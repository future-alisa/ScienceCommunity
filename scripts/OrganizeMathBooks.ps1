param([Parameter(Mandatory=$true)][pscredential]$Credential,[string]$Gateway='https://alisa.docker.local')
$ErrorActionPreference='Stop'
$communityId='9df3e510c8434bbf91f8753c060331f8'
$runtime=Join-Path $PSScriptRoot '../science_community/community_service/target'
$backupPath=Join-Path $runtime 'math-books-original-backup.json'
$resultPath=Join-Path $runtime 'math-books-result.json'
$token=$null
function Api([string]$method,[string]$path,$body=$null){
    $options=@{Uri=$Gateway+'/community'+$path;Method=$method;NoProxy=$true;TimeoutSec=30;Headers=@{Authorization='Bearer '+$token}}
    if($null -ne $body){$options.ContentType='application/json; charset=utf-8';$options.Body=[Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $body -Depth 40 -Compress))}
    $reply=Invoke-RestMethod @options;if($reply.code -ne 200){throw ('API failed '+$path)};return $reply.data
}
function Heading([string]$text){return @{type='heading';level=1;children=@(@{text=$text})}}
function MergeChapters($docs){
    $nodes=[Collections.Generic.List[object]]::new();$number=0
    foreach($doc in $docs){
        $title=$doc.documentName -replace '^\d{2}\s+',''
        if($doc.documentName -match '^00 '){$title='使用说明与学习指南'}else{$number++;$title='第'+$number+'章 '+$title}
        $nodes.Add((Heading $title))
        foreach($node in @($doc.documentContent|ConvertFrom-Json)){
            if($node.type -eq 'heading' -and $node.level -lt 2){$node.level=2}
            $nodes.Add($node)
        }
    }
    return ConvertTo-Json -InputObject @($nodes.ToArray()) -Depth 35 -Compress
}
function MarkdownBook([string]$file){
    $nodes=[Collections.Generic.List[object]]::new()
    foreach($line in (Get-Content (Join-Path $PSScriptRoot ('../content/mathematics/'+$file)) -Encoding utf8|Select-Object -Skip 1)){
        if(!$line.Trim()){continue}
        if($line -match '^(#{2,6}) (.+)$'){$nodes.Add(@{type='heading';level=($Matches[1].Length-1);children=@(@{text=$Matches[2]})})}
        else{$nodes.Add(@{type='paragraph';children=@(@{text=$line})})}
    }
    return ConvertTo-Json -InputObject @($nodes.ToArray()) -Depth 20 -Compress
}
function UploadBookCover([int]$index){
    $handler=[Net.Http.HttpClientHandler]::new();$handler.UseProxy=$false;$client=[Net.Http.HttpClient]::new($handler);$form=[Net.Http.MultipartFormDataContent]::new()
    try{
        $client.DefaultRequestHeaders.Authorization=[Net.Http.Headers.AuthenticationHeaderValue]::new('Bearer',$token)
        $bytes=[IO.File]::ReadAllBytes((Join-Path $PSScriptRoot ('../content/mathematics/book-covers/'+$index.ToString('00')+'.png')))
        $file=[Net.Http.ByteArrayContent]::new($bytes);$file.Headers.ContentType=[Net.Http.Headers.MediaTypeHeaderValue]::new('image/png');$form.Add($file,'file','book.png')
        $form.Add([Net.Http.StringContent]::new('document-cover'),'purpose');$form.Add([Net.Http.StringContent]::new($communityId),'communityId')
        $response=$client.PostAsync($Gateway+'/community/storage',$form).GetAwaiter().GetResult();if(!$response.IsSuccessStatusCode){throw 'Cover upload failed'}
        $reply=$response.Content.ReadAsStringAsync().GetAwaiter().GetResult()|ConvertFrom-Json;if($reply.code -ne 200){throw 'Cover upload business error'};return $reply.data.url
    }finally{$form.Dispose();$client.Dispose()}
}
try{
    $login=Invoke-RestMethod ($Gateway+'/api/v1/user/signin') -NoProxy -Method Post -ContentType application/json -Body (@{username=$Credential.UserName;password=$Credential.GetNetworkCredential().Password}|ConvertTo-Json -Compress)
    $token=$login.data;if($login.code -ne 200 -or $token -isnot [string]){throw 'Login failed'}
    if(Test-Path $resultPath){throw 'Book reorganization already recorded; inspect its result before rerunning'}
    if(Test-Path $backupPath){$backup=Get-Content $backupPath -Raw|ConvertFrom-Json;if($backup.communityId -ne $communityId){throw 'Unexpected backup community'};$original=@($backup.documents)}
    else{
        $manifest=Get-Content (Join-Path $runtime 'calculus-import-result.json') -Raw|ConvertFrom-Json
        if($manifest.communityId -ne $communityId -or $manifest.documents.Count -ne 12){throw 'Unexpected original chapter manifest'}
        $original=@(foreach($chapter in $manifest.documents){$doc=Api GET ('/document/'+$chapter.documentId);if($doc.documentCommunityId -ne $communityId -or $doc.documentName -ne $chapter.title){throw 'Original chapter has changed identity'};$doc})
        @{communityId=$communityId;createdAt=[DateTimeOffset]::Now.ToString('o');documents=$original}|ConvertTo-Json -Depth 40|Set-Content $backupPath -Encoding utf8
    }
    if($original.Count -ne 12){throw 'Expected exactly 12 original chapters'}
    Write-Output 'PASS: complete original chapter backup available'
    $upper=@($original|Where-Object{[int]$_.documentName.Substring(0,2) -le 6}|Sort-Object documentName)
    $lower=@($original|Where-Object{[int]$_.documentName.Substring(0,2) -ge 7}|Sort-Object documentName)
    $specs=@(
        @{title='高等数学上册';reuse=$upper[0].documentId;content=(MergeChapters $upper);description='学习指南与六章基础内容：函数与极限、导数与微分、中值定理、积分方法、定积分与反常积分、常微分方程。'},
        @{title='高等数学下册';reuse=$lower[0].documentId;content=(MergeChapters $lower);description='五章内容：向量与空间解析几何、多元函数微分、重积分、曲线与曲面积分、无穷级数。'},
        @{title='线性代数';reuse='';content=(MarkdownBook 'linear-algebra.md');description='六章入门讲义：行列式、矩阵、向量组与秩、线性方程组、特征值与对角化、二次型。'},
        @{title='概率论与数理统计';reuse='';content=(MarkdownBook 'probability-statistics.md');description='八章入门讲义：随机事件、随机变量、多维分布、数字特征、大数定律、抽样分布、参数估计、假设检验。'}
    )
    $books=[Collections.Generic.List[object]]::new()
    for($i=0;$i -lt $specs.Count;$i++){
        $spec=$specs[$i];$cover=UploadBookCover $i
        $saved=Api POST '/document/save' @{documentId=$spec.reuse;documentCommunityId=$communityId;documentCategoryId=$original[0].documentCategoryId;documentName=$spec.title;documentDescription=$spec.description;documentContent=$spec.content;documentThumbnailUrl=$cover}
        $verified=Api GET ('/document/'+$saved.documentId)
        if($verified.documentContent -ne $spec.content -or $verified.documentName -ne $spec.title){throw ('Book read-back mismatch '+$spec.title)}
        $chapterCount=@(($verified.documentContent|ConvertFrom-Json)|Where-Object{$_.type -eq 'heading' -and $_.level -eq 1}).Count
        $books.Add(@{title=$spec.title;documentId=$saved.documentId;chapters=$chapterCount})
        Write-Output ('PASS: book saved with chapter headings '+$spec.title+' ('+$chapterCount+')')
    }
    # Only retire exact original generated records after all replacement books are verified.
    foreach($doc in $original){
        if($books.documentId -contains $doc.documentId){continue}
        $current=Api GET ('/document/'+$doc.documentId)
        if($current.documentContent -ne $doc.documentContent -or $current.documentName -ne $doc.documentName -or $current.documentThumbnailUrl -ne $doc.documentThumbnailUrl){throw 'A source chapter changed during migration; preserving it'}
        $null=Api DELETE ('/document/'+$doc.documentId)
    }
    @{communityId=$communityId;books=$books.ToArray();originalBackup=$backupPath;completedAt=[DateTimeOffset]::Now.ToString('o')}|ConvertTo-Json -Depth 10|Set-Content $resultPath -Encoding utf8
    $remaining=@(Api GET ('/document/getAllByCommunityId?communityId='+$communityId))
    Write-Output ('COMPLETE: '+$remaining.Count+' documents in mathematics community; originals backed up')
}finally{$token=$null;$Credential=$null}
