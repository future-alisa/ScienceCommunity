param(
    [Parameter(Mandatory=$true)][pscredential]$Credential,
    [string]$Gateway='https://alisa.docker.local'
)
$ErrorActionPreference='Stop'
if (Test-Path (Join-Path $PSScriptRoot '../science_community/community_service/target/math-books-result.json')) { throw 'The materials are now organized as four books. Do not recreate the retired chapter entries.' }
$token=$null
function CallApi([string]$method,[string]$path,$body=$null) {
    $options=@{ Uri=$Gateway+$path; Method=$method; NoProxy=$true; TimeoutSec=30; SkipHttpErrorCheck=$true }
    if ($token) { $options.Headers=@{Authorization='Bearer '+$token} }
    if ($null -ne $body) { $options.ContentType='application/json; charset=utf-8'; $options.Body=[Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $body -Depth 30 -Compress)) }
    $response=Invoke-WebRequest @options
    if ([int]$response.StatusCode -ne 200) { throw ('API request failed: '+$method+' '+$path+' HTTP '+[int]$response.StatusCode) }
    $envelope=$response.Content | ConvertFrom-Json
    if ($envelope.code -ne 200) { throw ('API business error: '+$path+' '+$envelope.message) }
    return $envelope.data
}
try {
    $token=CallApi POST '/api/v1/user/signin' @{username=$Credential.UserName;password=$Credential.GetNetworkCredential().Password}
    if ($token -isnot [string] -or !$token) { throw 'Login failed; no token returned' }
    Write-Output 'PASS: authenticated supplied account'
    $base='/community'
    $owned=@(CallApi GET "$base/community/getAllByUser")
    $matching=@($owned | Where-Object communityName -eq '数学社区')
    if ($matching.Count -gt 1) { throw 'More than one matching community; choose explicitly before importing' }
    if ($matching.Count -eq 1) { $communityId=$matching[0].communityId }
    else {
        $communityId=[guid]::NewGuid().ToString('N')
        $null=CallApi POST "$base/community/upsert" @{communityId=$communityId;communityName='数学社区';communityDescription='从基础概念到系统推导，一起学习高等数学、线性代数与概率统计。基础资料首先收录高等数学入门讲义、例题与练习。';communityUrl='';communityImageUrl='';communityTag='数学'}
        Write-Output 'PASS: mathematics community created'
    }
    $access=CallApi GET "$base/communityuser/access?communityId=$communityId"
    if ($access.role -notin @('owner','admin')) { throw 'Import requires ownership or management access to the existing community' }
    $categories=@(CallApi GET "$base/category/getAll")
    $category=@($categories | Where-Object categoryName -eq 'base')
    if ($category.Count -ne 1) { throw 'Expected exactly one base category' }
    $existing=@(CallApi GET "$base/document/getAllByCommunityId?communityId=$communityId")
    $source=Get-Content (Join-Path $PSScriptRoot '../content/mathematics/calculus-foundations.md') -Raw -Encoding utf8
    $manifest=[Collections.Generic.List[object]]::new()
    foreach ($chapter in ($source -split '(?m)^---DOCUMENT---\s*$')) {
        $lines=@($chapter.Trim() -split '\r?\n')
        if ($lines[0] -notmatch '^# (.+)$') { throw 'Invalid chapter header' }
        $title=$Matches[1]
        $nodes=[Collections.Generic.List[object]]::new()
        $description=''
        foreach ($line in $lines | Select-Object -Skip 1) {
            if (!$line.Trim()) { continue }
            if ($line -match '^(#{1,6}) (.+)$') { $nodes.Add(@{type='heading';level=$Matches[1].Length;children=@(@{text=$Matches[2]})}) }
            else { $nodes.Add(@{type='paragraph';children=@(@{text=$line})}); if (!$description) { $description=$line.Substring(0,[Math]::Min(200,$line.Length)) } }
        }
        $content=ConvertTo-Json -InputObject @($nodes.ToArray()) -Depth 15 -Compress
        $old=@($existing | Where-Object documentName -eq $title)
        if ($old.Count -gt 1) { throw ('Duplicate chapter titles: '+$title) }
        if ($old.Count -eq 1) {
            if ($old[0].documentCategoryId -ne $category[0].categoryId -or $old[0].documentContent -ne $content) { throw ('Existing chapter differs; refusing to overwrite: '+$title) }
            $saved=$old[0]
        } else {
            $saved=CallApi POST "$base/document/save" @{documentId='';documentCommunityId=$communityId;documentCategoryId=$category[0].categoryId;documentName=$title;documentDescription=$description;documentThumbnailUrl='';documentContent=$content}
        }
        $reread=CallApi GET "$base/document/$($saved.documentId)"
        if ($reread.documentContent -ne $content -or $reread.documentCategoryId -ne $category[0].categoryId) { throw ('Read-back mismatch: '+$title) }
        $manifest.Add(@{title=$title;documentId=$saved.documentId;characters=$chapter.Length})
        Write-Output ('PASS: saved and verified '+$title)
    }
    $result=@{communityId=$communityId;communityName='数学社区';ownerUsername=$Credential.UserName;category='base';documents=$manifest.ToArray();verifiedAt=[DateTimeOffset]::Now.ToString('o')}
    $outFile=Join-Path $PSScriptRoot '../science_community/community_service/target/calculus-import-result.json'
    $result | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $outFile -Encoding utf8
    Write-Output ('COMPLETE: '+$manifest.Count+' verified foundation documents; community '+$communityId)
} finally { $token=$null; $Credential=$null }
