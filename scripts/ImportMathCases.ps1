param([Parameter(Mandatory=$true)][pscredential]$Credential,[string]$Gateway='https://alisa.docker.local',[string]$SiteOrigin='http://localhost:3001')
$ErrorActionPreference='Stop'
$communityId='9df3e510c8434bbf91f8753c060331f8'
$runtime=Join-Path $PSScriptRoot '../science_community/community_service/target'
$token=$null
function Api([string]$method,[string]$path,$body=$null){
    $options=@{Uri=$Gateway+'/community'+$path;Method=$method;NoProxy=$true;TimeoutSec=30;Headers=@{Authorization='Bearer '+$token}}
    if($null -ne $body){$options.ContentType='application/json; charset=utf-8';$options.Body=[Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $body -Depth 35 -Compress))}
    $reply=Invoke-RestMethod @options;if($reply.code -ne 200){throw ('API failed '+$path)};return $reply.data
}
function UploadCover([int]$index){
    $handler=[Net.Http.HttpClientHandler]::new();$handler.UseProxy=$false;$client=[Net.Http.HttpClient]::new($handler);$form=[Net.Http.MultipartFormDataContent]::new()
    try{
        $client.DefaultRequestHeaders.Authorization=[Net.Http.Headers.AuthenticationHeaderValue]::new('Bearer',$token)
        $bytes=[IO.File]::ReadAllBytes((Join-Path $PSScriptRoot ('../content/mathematics/case-covers/'+$index.ToString('00')+'.png')))
        $file=[Net.Http.ByteArrayContent]::new($bytes);$file.Headers.ContentType=[Net.Http.Headers.MediaTypeHeaderValue]::new('image/png');$form.Add($file,'file','case-cover.png')
        $form.Add([Net.Http.StringContent]::new('document-cover'),'purpose');$form.Add([Net.Http.StringContent]::new($communityId),'communityId')
        $response=$client.PostAsync($Gateway+'/community/storage',$form).GetAwaiter().GetResult();if(!$response.IsSuccessStatusCode){throw 'Cover upload failed'}
        $reply=$response.Content.ReadAsStringAsync().GetAwaiter().GetResult()|ConvertFrom-Json;if($reply.code -ne 200){throw 'Cover upload business error'};return $reply.data.url
    }finally{$form.Dispose();$client.Dispose()}
}
try{
    if(([Uri]$SiteOrigin).Scheme -notin @('http','https')){throw 'Invalid site origin'}
    $login=Invoke-RestMethod ($Gateway+'/api/v1/user/signin') -NoProxy -Method Post -ContentType application/json -Body (@{username=$Credential.UserName;password=$Credential.GetNetworkCredential().Password}|ConvertTo-Json -Compress)
    $token=$login.data;if($login.code -ne 200 -or $token -isnot [string]){throw 'Login failed'}
    $books=Get-Content (Join-Path $runtime 'math-books-result.json') -Raw|ConvertFrom-Json
    if($books.communityId -ne $communityId -or $books.books.Count -ne 4){throw 'Unexpected textbook manifest'}
    $category=@((Api GET '/category/getAll')|Where-Object categoryName -eq 'case');if($category.Count -ne 1){throw 'Expected case category'}
    $existing=@(Api GET ('/document/getAllByCommunityId?communityId='+$communityId+'&typeId='+$category[0].categoryId))
    $source=Get-Content (Join-Path $PSScriptRoot '../content/mathematics/common-cases.md') -Raw -Encoding utf8
    $parts=@($source -split '(?m)^---DOCUMENT---\s*$');if($parts.Count -ne 4){throw 'Expected four case collections'}
    $summaries=@('纸盒容积优化、变速运动的积分计算、牛顿冷却模型。每例包含建模、推导、结果解释和延伸练习。','固定预算资源分配、非均匀薄片的质心、幂级数近似与误差控制。','两种产品的生产安排、最小二乘直线拟合、马尔可夫链长期比例。','质检报警的贝叶斯分析、不合格品抽样计数、平均重量的置信区间与假设检验。')
    $results=[Collections.Generic.List[object]]::new();$linkBackups=[Collections.Generic.List[object]]::new()
    for($i=3;$i -ge 0;$i--){
        $lines=@($parts[$i].Trim() -split '\r?\n');if($lines[0] -notmatch '^# (.+)$'){throw 'Invalid case collection title'};$title=$Matches[1]
        $nodes=[Collections.Generic.List[object]]::new();$book=$books.books[$i]
        $nodes.Add(@{type='paragraph';children=@(@{text='配套基础资料：'},@{text=$book.title;url=$SiteOrigin.TrimEnd('/')+'/community/'+$communityId+'/document/'+$book.documentId})})
        foreach($line in ($lines|Select-Object -Skip 1)){
            if(!$line.Trim()){continue}
            if($line -match '^(#{2,6}) (.+)$'){$nodes.Add(@{type='heading';level=($Matches[1].Length-1);children=@(@{text=$Matches[2]})})}
            else{$nodes.Add(@{type='paragraph';children=@(@{text=$line})})}
        }
        $caseCount=@($nodes|Where-Object{$_.type -eq 'heading' -and $_.level -eq 1}).Count;if($caseCount -ne 3){throw 'Expected three cases per collection'}
        $content=ConvertTo-Json -InputObject @($nodes.ToArray()) -Depth 25 -Compress
        $old=@($existing|Where-Object documentName -eq $title);if($old.Count -gt 1){throw 'Duplicate case collection title'}
        if($old.Count -eq 1){if($old[0].documentContent -ne $content){throw 'Existing case collection differs; refusing to overwrite'};$saved=$old[0]}
        else{$cover=UploadCover $i;$saved=Api POST '/document/save' @{documentId='';documentCommunityId=$communityId;documentCategoryId=$category[0].categoryId;documentName=$title;documentDescription=$summaries[$i];documentContent=$content;documentThumbnailUrl=$cover}}
        $verified=Api GET ('/document/'+$saved.documentId)
        if($verified.documentContent -ne $content -or $verified.documentCategoryId -ne $category[0].categoryId){throw 'Saved case collection mismatch'}
        $signed=Api POST '/storage/read-urls' @($verified.documentThumbnailUrl)
        if((Invoke-WebRequest $signed.($verified.documentThumbnailUrl) -NoProxy -TimeoutSec 20).StatusCode -ne 200){throw 'Cover read failed'}
        $results.Add(@{title=$title;documentId=$verified.documentId;cases=$caseCount;bookId=$book.documentId})
        $base=Api GET ('/document/'+$book.documentId);if($base.documentName -ne $book.title -or $base.documentCommunityId -ne $communityId){throw 'Base material identity mismatch'}
        $caseUrl=$SiteOrigin.TrimEnd('/')+'/community/'+$communityId+'/document/'+$verified.documentId
        $body=@($base.documentContent|ConvertFrom-Json)
        $alreadyLinked=@($body|Where-Object{$_.type -eq 'paragraph' -and @($_.children|Where-Object{$_.url -eq $caseUrl}).Count -gt 0}).Count -gt 0
        if(!$alreadyLinked){
            $linkBackups.Add($base)
            $linkBackups.ToArray()|ConvertTo-Json -Depth 35|Set-Content (Join-Path $runtime 'math-case-link-backups.json') -Encoding utf8
            $link=@{type='paragraph';children=@(@{text='配套案例集：'},@{text=$title;url=$caseUrl})}
            $base.documentContent=ConvertTo-Json -InputObject @(@($link)+$body) -Depth 30 -Compress
            $null=Api POST '/document/save' $base
            if((Api GET ('/document/'+$book.documentId)).documentContent -ne $base.documentContent){throw 'Textbook case link verification failed'}
        }
        Write-Output ('PASS: '+$title+' — 3 cases, cover and reciprocal textbook link verified')
        Start-Sleep -Milliseconds 1100
    }
    @{communityId=$communityId;collections=@($results.ToArray()|Sort-Object title);caseCount=12;completedAt=[DateTimeOffset]::Now.ToString('o')}|ConvertTo-Json -Depth 10|Set-Content (Join-Path $runtime 'math-cases-result.json') -Encoding utf8
    Write-Output 'COMPLETE: 4 case collections, 12 worked examples'
}finally{$token=$null;$Credential=$null}
