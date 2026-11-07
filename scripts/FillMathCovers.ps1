param([Parameter(Mandatory=$true)][pscredential]$Credential,[string]$Gateway='https://alisa.docker.local')
$ErrorActionPreference='Stop'
if (Test-Path (Join-Path $PSScriptRoot '../science_community/community_service/target/math-books-result.json')) { throw 'The chapter documents have been merged into four books; use the book manifest instead.' }
$communityId='9df3e510c8434bbf91f8753c060331f8'
$token=$null
function Api([string]$method,[string]$path,$body=$null){
    $options=@{Uri=$Gateway+'/community'+$path;Method=$method;NoProxy=$true;TimeoutSec=30;Headers=@{Authorization='Bearer '+$token}}
    if($null -ne $body){$options.ContentType='application/json; charset=utf-8';$options.Body=[Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $body -Depth 30 -Compress))}
    $result=Invoke-RestMethod @options
    if($result.code -ne 200){throw ('API failed '+$path)}
    return $result.data
}
function Upload([string]$fileName,[string]$purpose){
    $handler=[Net.Http.HttpClientHandler]::new();$handler.UseProxy=$false;$client=[Net.Http.HttpClient]::new($handler);$form=[Net.Http.MultipartFormDataContent]::new()
    try{
        $client.DefaultRequestHeaders.Authorization=[Net.Http.Headers.AuthenticationHeaderValue]::new('Bearer',$token)
        $file=[Net.Http.ByteArrayContent]::new([IO.File]::ReadAllBytes((Join-Path $PSScriptRoot ('../content/mathematics/covers/'+$fileName))))
        $file.Headers.ContentType=[Net.Http.Headers.MediaTypeHeaderValue]::new('image/png');$form.Add($file,'file',$fileName)
        $form.Add([Net.Http.StringContent]::new($purpose),'purpose');$form.Add([Net.Http.StringContent]::new($communityId),'communityId')
        $reply=$client.PostAsync($Gateway+'/community/storage',$form).GetAwaiter().GetResult()
        if(!$reply.IsSuccessStatusCode){throw ('Upload failed HTTP '+[int]$reply.StatusCode)}
        $result=$reply.Content.ReadAsStringAsync().GetAwaiter().GetResult()|ConvertFrom-Json
        if($result.code -ne 200){throw 'Upload business error'}
        return $result.data.url
    }finally{$form.Dispose();$client.Dispose()}
}
try{
    $login=Invoke-RestMethod ($Gateway+'/api/v1/user/signin') -NoProxy -Method Post -ContentType application/json -Body (@{username=$Credential.UserName;password=$Credential.GetNetworkCredential().Password}|ConvertTo-Json -Compress)
    $token=$login.data;if($login.code -ne 200 -or $token -isnot [string]){throw 'Login failed'}
    $community=Api GET "/community/$communityId"
    if(!$community.communityImageUrl){
        $cover=Upload 'community.png' 'community-cover'
        $null=Api POST "/community/$communityId/cover" @{url=$cover}
        if((Api GET "/community/$communityId").communityImageUrl -ne $cover){throw 'Community cover read-back failed'}
        Write-Output 'PASS: mathematics community cover saved'
    }
    $manifest=Get-Content (Join-Path $PSScriptRoot '../science_community/community_service/target/calculus-import-result.json') -Raw|ConvertFrom-Json
    if($manifest.communityId -ne $communityId){throw 'Unexpected community in local chapter manifest'}
    foreach($chapter in $manifest.documents){
        $doc=Api GET ('/document/'+$chapter.documentId)
        if($doc.documentCommunityId -ne $communityId -or $doc.documentName -ne $chapter.title){throw 'Chapter identity mismatch'}
        if($doc.documentThumbnailUrl){Write-Output ('SKIP: existing cover '+$chapter.title);continue}
        if($chapter.title -notmatch '^(\d{2}) '){throw 'Unexpected chapter title'}
        $cover=Upload ($Matches[1]+'.png') 'document-cover'
        # Re-read immediately before saving to preserve any edits made during upload.
        $latest=Api GET ('/document/'+$chapter.documentId)
        if($latest.documentThumbnailUrl){Write-Output ('SKIP: concurrent cover update '+$chapter.title);continue}
        $latest.documentThumbnailUrl=$cover
        $null=Api POST '/document/save' $latest
        $verified=Api GET ('/document/'+$chapter.documentId)
        if($verified.documentThumbnailUrl -ne $cover -or $verified.documentContent -ne $latest.documentContent){throw 'Document read-back mismatch'}
        $signed=Api GET ('/storage/read-url?url='+[Uri]::EscapeDataString($cover))
        if((Invoke-WebRequest $signed.url -NoProxy -TimeoutSec 20).StatusCode -ne 200){throw 'Cover read failed'}
        Write-Output ('PASS: cover saved and readable '+$chapter.title)
    }
}finally{$token=$null;$Credential=$null}
