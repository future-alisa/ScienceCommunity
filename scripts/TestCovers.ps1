param([Parameter(Mandatory=$true)][pscredential]$Credential,[string]$Gateway='https://alisa.docker.local')
$ErrorActionPreference='Stop'
$token=$null; $communityId=[guid]::NewGuid().ToString('N'); $created=$false; $documentId=$null
$urls=[Collections.Generic.List[string]]::new()
function Api([string]$method,[string]$path,$body=$null) {
    $options=@{Uri=$Gateway+'/community'+$path;Method=$method;NoProxy=$true;TimeoutSec=30;Headers=@{Authorization='Bearer '+$token}}
    if ($null -ne $body) { $options.ContentType='application/json; charset=utf-8';$options.Body=[Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $body -Depth 20 -Compress)) }
    $result=Invoke-RestMethod @options
    if ($result.code -ne 200) { throw ('API failed '+$path) }
    return $result.data
}
function Check($condition,[string]$label) { if (!$condition) { throw ('FAIL: '+$label) }; Write-Output ('PASS: '+$label) }
function UploadCover([string]$purpose) {
    $handler=[Net.Http.HttpClientHandler]::new();$handler.UseProxy=$false
    $client=[Net.Http.HttpClient]::new($handler)
    $form=[Net.Http.MultipartFormDataContent]::new()
    try {
        $client.DefaultRequestHeaders.Authorization=[Net.Http.Headers.AuthenticationHeaderValue]::new('Bearer',$token)
        $bytes=[Convert]::FromBase64String('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aG1sAAAAASUVORK5CYII=')
        $file=[Net.Http.ByteArrayContent]::new($bytes);$file.Headers.ContentType=[Net.Http.Headers.MediaTypeHeaderValue]::new('image/png')
        $form.Add($file,'file','fixture.png');$form.Add([Net.Http.StringContent]::new($purpose),'purpose');$form.Add([Net.Http.StringContent]::new($communityId),'communityId')
        $reply=$client.PostAsync($Gateway+'/community/storage',$form).GetAwaiter().GetResult()
        if (!$reply.IsSuccessStatusCode) { throw ('Upload HTTP '+[int]$reply.StatusCode) }
        $envelope=$reply.Content.ReadAsStringAsync().GetAwaiter().GetResult() | ConvertFrom-Json
        if ($envelope.code -ne 200) { throw 'Upload failed' }
        $urls.Add($envelope.data.url)
        return $envelope.data.url
    } finally { $form.Dispose();$client.Dispose() }
}
try {
    $login=Invoke-RestMethod ($Gateway+'/api/v1/user/signin') -NoProxy -Method Post -ContentType application/json -Body (@{username=$Credential.UserName;password=$Credential.GetNetworkCredential().Password}|ConvertTo-Json -Compress)
    $token=$login.data
    if ($login.code -ne 200 -or $token -isnot [string]) { throw 'Login failed' }
    $null=Api POST '/community/upsert' @{communityId=$communityId;communityName='封面验证-'+$communityId.Substring(0,8);communityDescription='Disposable cover test';communityImageUrl='';communityUrl=''}
    $created=$true
    $communityCover=UploadCover 'community-cover'
    $null=Api POST "/community/$communityId/cover" @{url=$communityCover}
    $read=Api GET "/community/$communityId"
    Check ($read.communityImageUrl -eq $communityCover -and $read.communityDescription -eq 'Disposable cover test') 'community cover saved without changing description'
    $signed=Api GET ('/storage/read-url?url='+[Uri]::EscapeDataString($communityCover))
    Check ((Invoke-WebRequest $signed.url -NoProxy -TimeoutSec 20).StatusCode -eq 200) 'private community cover can be read with signed URL'
    $documentCover=UploadCover 'document-cover'
    $categories=Api GET '/category/getAll';$category=($categories|Where-Object categoryName -eq base).categoryId
    $doc=Api POST '/document/save' @{documentId='';documentCommunityId=$communityId;documentCategoryId=$category;documentName='封面验证';documentDescription='Disposable';documentThumbnailUrl=$documentCover;documentContent='[{"type":"paragraph","children":[{"text":"Cover test"}]}]'}
    $documentId=$doc.documentId
    Check ((Api GET "/document/$documentId").documentThumbnailUrl -eq $documentCover) 'document cover persists'
    $signed=Api GET ('/storage/read-url?url='+[Uri]::EscapeDataString($documentCover))
    Check ((Invoke-WebRequest $signed.url -NoProxy -TimeoutSec 20).StatusCode -eq 200) 'private document cover can be read with signed URL'
    $doc.documentThumbnailUrl='';$null=Api POST '/document/save' $doc
    $null=Api POST "/community/$communityId/cover" @{url=''}
    Check (((Api GET "/document/$documentId").documentThumbnailUrl -eq '') -and ((Api GET "/community/$communityId").communityImageUrl -eq '')) 'both cover references can be removed'
} finally {
    $urls.ToArray() | ConvertTo-Json -AsArray | Set-Content (Join-Path $PSScriptRoot '../science_community/community_service/target/cover-fixture-urls.json') -Encoding utf8
    if ($documentId) { $null=Api DELETE "/document/$documentId" }
    if ($created) { $null=Api DELETE '/community/batch-delete' @($communityId);Write-Output 'PASS: temporary community and document removed' }
    $token=$null;$Credential=$null
}
