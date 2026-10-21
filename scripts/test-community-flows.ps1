# Requires PowerShell 7. Credentials stay in memory; fixture identities go to ignored target/.
# Run against a development environment; deletes only its own community fixtures.
param([string]$Gateway = 'https://alisa.docker.local')
$ErrorActionPreference = 'Stop'
$statePath = Join-Path $PSScriptRoot '../science_community/community_service/target/flow-fixture.json'
if (Test-Path -LiteralPath $statePath) { throw 'Clean the previous recorded test accounts and remove flow-fixture.json before starting another run.' }
New-Item -ItemType Directory -Force -Path (Split-Path $statePath) | Out-Null
$run = [guid]::NewGuid().ToString('N').Substring(0, 12)
$users = @()
$community = [guid]::NewGuid().ToString('N')
$channelIds = [System.Collections.Generic.List[string]]::new()
$created = $false
$checks = 0
function Check($condition, [string]$name) {
    if (!$condition) { throw "FAIL: $name" }
    $script:checks++; Write-Output "PASS: $name"
}
function Request([string]$method, [string]$path, $user, $body = $null, [int]$status = 200) {
    $options = @{ Uri = "$Gateway$path"; Method = $method; NoProxy = $true; SkipHttpErrorCheck = $true; TimeoutSec = 20 }
    if ($user -and $user.token) { $options.Headers = @{ Authorization = "Bearer $($user.token)" } }
    if ($null -ne $body) { $options.ContentType = 'application/json'; $options.Body = ConvertTo-Json -InputObject $body -Depth 10 -Compress }
    $response = Invoke-WebRequest @options
    if ([int]$response.StatusCode -ne $status) { throw "$method $path expected $status, got $($response.StatusCode): $($response.Content)" }
    $envelope = $response.Content | ConvertFrom-Json
    if ($status -eq 200 -and $envelope.code -ne 200) { throw "$method $path business error $($envelope.code): $($envelope.message)" }
    return $envelope.data
}
try {
    foreach ($i in 0..3) {
        $user = @{ username = "qa${run}_$i"; password = "Qa!$([guid]::NewGuid().ToString('N'))"; email = "qa${run}_$i@example.invalid" }
        $users += $user
        # Keep exact fixture identities for cleanup even if a later request fails.
        @{ users = @($users | ForEach-Object { @{ username = $_.username; email = $_.email } }); communityId = $community } | ConvertTo-Json -Depth 6 | Set-Content $statePath
        $registered = Request POST '/api/v1/user/signup' $null $user
        Check ($registered -eq $true) "register account $i with email"
        $user.token = Request POST '/api/v1/user/signin' $null @{ username = $user.username; password = $user.password }
        if (!$user.token) { throw 'Missing login token' }
        Check $true "login account $i"
    }
    $owner, $admin, $member, $outsider = $users
    $base = '/community'
    $null = Request POST "$base/community/upsert" $owner @{ communityId = $community; communityName = "QA $run"; communityDescription = 'Isolated integration test'; communityUrl = ''; communityImageUrl = '' }
    $created = $true
    $access = Request GET "$base/communityuser/access?communityId=$community" $owner
    Check ($access.role -eq 'owner') 'creator becomes owner'
    $null = Request POST "$base/community/upsert" $owner @{ communityId = $community; communityName = "QA $run edited"; communityDescription = 'Edited isolated integration test'; communityUrl = ''; communityImageUrl = '' }
    Check ((Request GET "$base/community/$community" $owner).communityName -eq "QA $run edited") 'community edits persist'
    $null = Request GET "$base/communityuser/getAllByCommunityId?communityId=$community" $outsider $null 403
    $null = Request POST "$base/community/upsert" $outsider @{ communityId = $community; communityName = 'unauthorized edit' } 403
    Check $true 'outsider cannot inspect members or edit community'
    $ownerMemberId = $access.membershipId
    $roles = Request GET "$base/communityuser/roles" $owner
    $memberRole = ($roles | Where-Object name -eq member).id
    $adminRole = ($roles | Where-Object name -eq admin).id
    $null = Request POST "$base/communityuser/add" $owner @{ communityId = $community; identity = $admin.email; roleId = $adminRole }
    $null = Request POST "$base/communityuser/join" $member @{ communityId = $community }
    Check ((Request POST "$base/communityuser/join" $member @{ communityId = $community }) -eq 0) 'join community is idempotent'
    $list = @(Request GET "$base/communityuser/getAllByCommunityId?communityId=$community" $owner)
    Check ($list.Count -eq 3) 'three distinct community members'
    $adminAccess = Request GET "$base/communityuser/access?communityId=$community" $admin
    $memberAccess = Request GET "$base/communityuser/access?communityId=$community" $member
    Check ($adminAccess.role -eq 'admin') 'owner can assign admin by email'
    $null = Request POST "$base/communityuser/add" $owner @{ communityId = $community; identity = $admin.username; roleId = $memberRole } 409
    $null = Request DELETE "$base/communityuser/$ownerMemberId" $owner $null 409
    $null = Request POST "$base/communityuser/add" $member @{ communityId = $community; identity = $outsider.username; roleId = $memberRole } 403
    $null = Request POST "$base/communityuser/add" $admin @{ communityId = $community; identity = $outsider.username; roleId = $adminRole } 403
    Check $true 'duplicate, owner removal and privilege escalation rejected'
    $null = Request POST "$base/communityuser/add" $admin @{ communityId = $community; identity = $outsider.username; roleId = $memberRole }
    $outsiderAccess = Request GET "$base/communityuser/access?communityId=$community" $outsider
    Check ($outsiderAccess.role -eq 'member') 'admin can add ordinary member by username'
    foreach ($roleId in @($memberRole, $adminRole)) {
        $null = Request POST "$base/communityuser/upsert" $owner @{ communityUserId = $adminAccess.membershipId; communityId = $community; userId = $adminAccess.userId; communityRoleId = $roleId }
    }
    Check $true 'owner can demote and promote admin'
    $channel = Request POST "$base/channel/save" $owner @{ channelCommunityId = $community; channelName = '讨论'; channelDescription = '多人消息测试' }
    $channelId = $channel.channelId; $channelIds.Add($channelId)
    Check ($channel.channelDescription -eq '多人消息测试') 'channel description persists'
    $channel.channelName = '讨论（已编辑）'; $channel.channelDescription = '频道编辑后仍保存简介'
    $null = Request POST "$base/channel/save" $admin $channel
    Check ((Request GET "$base/channel/$channelId" $member).channelDescription -eq '频道编辑后仍保存简介') 'admin can edit channel and changes persist'
    $null = Request POST "$base/channel/save" $member $channel 403
    $null = Request DELETE "$base/channel/$channelId" $member $null 403
    $null = Request DELETE "$base/community/batch-delete" $owner @($community) 409
    Check $true 'member cannot manage channel; occupied community cannot be deleted'
    $null = Request GET "$base/channel/$channelId/messages" $member $null 403
    foreach ($user in @($admin, $member)) { $null = Request POST "$base/channel/$channelId/join" $user }
    Check ((Request POST "$base/channel/$channelId/join" $member) -eq 0) 'channel join is idempotent'
    Check ((Request GET "$base/channel/$channelId/access" $owner).memberCount -eq 3) 'three channel participants'
    # Requests execute in parallel with independent bearer tokens; never print credentials.
    $jobs = foreach ($user in @($owner, $admin, $member)) {
        Start-ThreadJob -ArgumentList $Gateway, $channelId, $user.token, $user.username -ScriptBlock {
            param($gateway, $channel, $token, $name)
            for ($i = 0; $i -lt 20; $i++) {
                $body = @{ content = "${name}: 消息 $i"; clientMessageId = "${name}_$i" } | ConvertTo-Json -Compress
                $r = Invoke-WebRequest "$gateway/community/channel/$channel/messages" -Method Post -NoProxy -TimeoutSec 30 -SkipHttpErrorCheck -ContentType application/json -Headers @{ Authorization = "Bearer $token" } -Body $body
                $e = $r.Content | ConvertFrom-Json
                if ($r.StatusCode -ne 200 -or $e.code -ne 200) { throw "Send failed HTTP $($r.StatusCode)" }
                $e.data
            }
        }
    }
    try { $sent = @($jobs | Wait-Job | Receive-Job -ErrorAction Stop) }
    finally { $jobs | Remove-Job -Force }
    Check ($sent.Count -eq 60 -and @($sent.messageId | Sort-Object -Unique).Count -eq 60) '60 concurrent messages from three accounts, no duplicate IDs'
    Check (@($sent.senderId | Sort-Object -Unique).Count -eq 3) 'server identifies three distinct senders'
    $latest = Request GET "$base/channel/$channelId/messages" $member
    Check ($latest.messages.Count -eq 50 -and $latest.hasMore) 'latest page holds 50 messages and signals older history'
    $older = Request GET "$base/channel/$channelId/messages?before=$($latest.messages[0].sequenceId)" $admin
    $all = @($older.messages) + @($latest.messages)
    Check ($all.Count -eq 60 -and @($all.messageId | Sort-Object -Unique).Count -eq 60) 'backward pagination has no missing or repeated messages'
    $forward = Request GET "$base/channel/$channelId/messages?after=$($older.messages[-1].sequenceId)" $owner
    Check (($forward.messages.messageId -join ',') -eq ($latest.messages.messageId -join ',')) 'different accounts see identical incremental history'
    $numbers = @($all | ForEach-Object { [long]$_.sequenceId })
    Check (($numbers -join ',') -eq (($numbers | Sort-Object) -join ',')) 'history is chronological'
    $isolated = Request POST "$base/channel/save" $owner @{ channelCommunityId = $community; channelName = '隔离频道'; channelDescription = '' }
    $channelIds.Add($isolated.channelId)
    Check ((Request GET "$base/channel/$($isolated.channelId)/messages" $owner).messages.Count -eq 0) 'messages stay isolated between channels'
    $retryBody = @{ content = $sent[0].content; clientMessageId = $sent[0].clientMessageId }
    $sender = $users | Where-Object { $_.username -eq $sent[0].senderName }
    if (!$sender) { throw 'Sender name mismatch' }
    $retry = Request POST "$base/channel/$channelId/messages" $sender $retryBody
    Check ($retry.messageId -eq $sent[0].messageId) 'retry returns original message without duplicate'
    $retryBody.content = 'conflicting retry'
    $null = Request POST "$base/channel/$channelId/messages" $sender $retryBody 409
    $null = Request POST "$base/channel/$channelId/messages" $member @{ content = ' '; clientMessageId = 'blank' } 400
    $null = Request GET "$base/channel/$channelId/messages?before=1&after=2" $member $null 400
    Check $true 'conflicting retry, blank message and invalid cursor rejected'
    $null = Request POST "$base/channel/$channelId/leave" $member
    $null = Request GET "$base/channel/$channelId/messages" $member $null 403
    $null = Request POST "$base/channel/$channelId/messages" $member @{ content = 'after leaving'; clientMessageId = 'left' } 403
    $null = Request POST "$base/channel/$channelId/join" $member
    $null = Request DELETE "$base/communityuser/$($memberAccess.membershipId)" $admin
    $null = Request GET "$base/channel/$channelId/messages" $member $null 403
    $null = Request POST "$base/channel/$channelId/messages" $member @{ content = 'revoked'; clientMessageId = 'revoked' } 403
    $null = Request POST "$base/channel/$channelId/join" $member $null 403
    Check $true 'leave and community removal immediately revoke channel read/send/join'
    $participants = Request GET "$base/channeluser/getAllByChannelId?channelId=$channelId" $owner
    Check (@($participants | Where-Object communityUserId -eq $memberAccess.membershipId).Count -eq 0) 'removing community member also cleans channel membership'
    Write-Output "Completed $checks checks."
} finally {
    if ($created) {
        $owner = $users[0]
        foreach ($id in $channelIds) { $null = Request DELETE "/community/channel/$id" $owner }
        $remaining = @(Request GET "/community/communityuser/getAllByCommunityId?communityId=$community" $owner)
        foreach ($row in $remaining | Where-Object role -ne owner) { $null = Request DELETE "/community/communityuser/$($row.id)" $owner }
        $null = Request DELETE '/community/community/batch-delete' $owner @($community)
        Write-Output 'CLEANUP: test channels, messages, memberships and community deleted.'
    }
    Write-Output 'Account fixtures are recorded in the ignored target/flow-fixture.json for exact-identity cleanup.'
}
