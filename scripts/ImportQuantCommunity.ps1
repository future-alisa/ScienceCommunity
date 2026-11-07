param([Parameter(Mandatory=$true)][pscredential]$Credential,[string]$Gateway='https://alisa.docker.local',[string]$SiteOrigin='http://localhost:3001')
$ErrorActionPreference='Stop'
$runtime=Join-Path $PSScriptRoot '../science_community/community_service/target'
$manifestPath=Join-Path $runtime 'quant-community-result.json'
$record=if(Test-Path $manifestPath){Get-Content $manifestPath -Raw|ConvertFrom-Json -AsHashtable}else{@{communityId='';foundations=@();cases=@();tagged=$false;completed=$false}}
$token=$null;$communityId=$record.communityId
function SaveRecord{$record|ConvertTo-Json -Depth 15|Set-Content $manifestPath -Encoding utf8}
function Api([string]$method,[string]$path,$body=$null){
 $options=@{Uri=$Gateway+'/community'+$path;Method=$method;NoProxy=$true;TimeoutSec=30;Headers=@{Authorization='Bearer '+$token}}
 if($null -ne $body){$options.ContentType='application/json; charset=utf-8';$options.Body=[Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $body -Depth 35 -Compress))}
 $reply=Invoke-RestMethod @options;if($reply.code -ne 200){throw ('API failed '+$path)};return $reply.data
}
function UploadCover([string]$slug,[string]$purpose){
 $handler=[Net.Http.HttpClientHandler]::new();$handler.UseProxy=$false;$client=[Net.Http.HttpClient]::new($handler);$form=[Net.Http.MultipartFormDataContent]::new()
 try{
  $client.DefaultRequestHeaders.Authorization=[Net.Http.Headers.AuthenticationHeaderValue]::new('Bearer',$token)
  $file=[Net.Http.ByteArrayContent]::new([IO.File]::ReadAllBytes((Join-Path $PSScriptRoot ('../content/quantitative-finance/covers/'+$slug+'.png'))));$file.Headers.ContentType=[Net.Http.Headers.MediaTypeHeaderValue]::new('image/png');$form.Add($file,'file','cover.png')
  $form.Add([Net.Http.StringContent]::new($purpose),'purpose');$form.Add([Net.Http.StringContent]::new($communityId),'communityId')
  $response=$client.PostAsync($Gateway+'/community/storage',$form).GetAwaiter().GetResult();if(!$response.IsSuccessStatusCode){throw 'Cover upload failed'}
  $reply=$response.Content.ReadAsStringAsync().GetAwaiter().GetResult()|ConvertFrom-Json;if($reply.code -ne 200){throw 'Cover upload business error'};return $reply.data.url
 }finally{$form.Dispose();$client.Dispose()}
}
function ParseSection([string]$text){
 $lines=@($text.Trim() -split '\r?\n');if($lines[0] -notmatch '^# (.+)$'){throw 'Invalid document heading'};$title=$Matches[1]
 $nodes=[Collections.Generic.List[object]]::new()
 foreach($line in ($lines|Select-Object -Skip 1)){
  if(!$line.Trim()){continue}
  if($line -match '^(#{2,6}) (.+)$'){$nodes.Add(@{type='heading';level=($Matches[1].Length-1);children=@(@{text=$Matches[2]})})}
  elseif($line -match '^\[([^\]]+)\]\((https?://[^)]+)\)$'){$nodes.Add(@{type='paragraph';children=@(@{text=$Matches[1];url=$Matches[2]})})}
  else{$nodes.Add(@{type='paragraph';children=@(@{text=$line})})}
 }
 return @{title=$title;nodes=$nodes.ToArray()}
}
function SaveMaterial($parsed,[string]$categoryId,[string]$coverSlug,[string]$description,$existing){
 $content=ConvertTo-Json -InputObject @($parsed.nodes) -Depth 30 -Compress
 $old=@($existing|Where-Object documentName -eq $parsed.title)
 if($old.Count -gt 1){throw ('Duplicate document title '+$parsed.title)}
 if($old.Count -eq 1){
  if($old[0].documentCategoryId -ne $categoryId -or $old[0].documentContent -ne $content){throw ('Existing material differs; refusing to overwrite '+$parsed.title)}
  $saved=$old[0]
 }else{
  $cover=UploadCover $coverSlug 'document-cover'
  $saved=Api POST '/document/save' @{documentId='';documentCommunityId=$communityId;documentCategoryId=$categoryId;documentName=$parsed.title;documentDescription=$description;documentContent=$content;documentThumbnailUrl=$cover}
 }
 $verified=Api GET ('/document/'+$saved.documentId)
 if($verified.documentCommunityId -ne $communityId -or $verified.documentContent -ne $content -or $verified.documentCategoryId -ne $categoryId){throw 'Read-back validation failed'}
 return @{title=$verified.documentName;documentId=$verified.documentId;cover=$verified.documentThumbnailUrl}
}
try{
 if($record.completed){throw 'Quantitative community import already completed; inspect its manifest before rerunning'}
 if(([Uri]$SiteOrigin).Scheme -notin @('http','https')){throw 'Invalid site origin'}
 $login=Invoke-RestMethod ($Gateway+'/api/v1/user/signin') -NoProxy -Method Post -ContentType application/json -Body (@{username=$Credential.UserName;password=$Credential.GetNetworkCredential().Password}|ConvertTo-Json -Compress)
 $token=$login.data;if($login.code -ne 200 -or $token -isnot [string]){throw 'Login failed'}
 if(!$communityId){
  $joined=@(Api GET '/community/getAllByUser');$match=@($joined|Where-Object communityName -eq '量化学习社区')
  if($match.Count -gt 1){throw 'Multiple matching quantitative communities'}
  if($match.Count){$communityId=$match[0].communityId}else{
   $communityId=[guid]::NewGuid().ToString('N');$record.communityId=$communityId;SaveRecord
   $null=Api POST '/community/upsert' @{communityId=$communityId;communityName='量化学习社区';communityDescription='从 Python 金融计算、统计基础到量化策略、金融机器学习与组合管理。以主流书籍的原创学习导读和问题导向案例构建研究路线，重视数据时点、样本外验证、成本与风险。';communityImageUrl='';communityUrl=''}
  }
  $record.communityId=$communityId;SaveRecord
 }
 $community=Api GET ('/community/'+$communityId);if($community.communityName -ne '量化学习社区'){throw 'Unexpected community identity'}
 $access=Api GET ('/communityuser/access?communityId='+$communityId);if($access.role -notin @('owner','admin')){throw 'Management access required'}
 if(!$community.communityImageUrl){$cover=UploadCover 'community' 'community-cover';$null=Api POST ('/community/'+$communityId+'/cover') @{url=$cover}}
 if(!$record.tagged){
  $tags=@((Api GET '/tag/getAll')|Where-Object tagName -eq '量化')
  if($tags.Count){$tagId=$tags[0].tagId}else{$tagId=[guid]::NewGuid().ToString('N');$null=Api POST '/tag/upsert' @{tagId=$tagId;tagName='量化';tagOwnerId=$access.userId}}
  if(!$record.tagCommunityId){$record.tagCommunityId=[guid]::NewGuid().ToString('N');SaveRecord}
  $null=Api POST '/tagcommunity/upsert' @{tagCommunityId=$record.tagCommunityId;tagId=$tagId;communityId=$communityId};$record.tagged=$true;SaveRecord
 }
 Write-Output ('PASS: quantitative community ready '+$communityId)
 $categories=@(Api GET '/category/getAll');$baseCategory=($categories|Where-Object categoryName -eq 'base').categoryId;$caseCategory=($categories|Where-Object categoryName -eq 'case').categoryId
 if(!$baseCategory -or !$caseCategory){throw 'Missing material categories'}
 $existing=@(Api GET ('/document/getAllByCommunityId?communityId='+$communityId))
 $baseParts=@((Get-Content (Join-Path $PSScriptRoot '../content/quantitative-finance/foundations.md') -Raw -Encoding utf8) -split '(?m)^---DOCUMENT---\s*$')
 $caseParts=@((Get-Content (Join-Path $PSScriptRoot '../content/quantitative-finance/research-cases.md') -Raw -Encoding utf8) -split '(?m)^---DOCUMENT---\s*$')
 if($baseParts.Count -ne 5 -or $caseParts.Count -ne 6){throw 'Unexpected source document count'}
 $baseDescriptions=@('Ernest P. Chan：六章原创导读，建立假设、数据时点、持仓、成本与样本外验证流程。','Ernest P. Chan：均值回归、动量、价差、执行与容量的六章学习路线。','Yves Hilpisch：Python、收益口径、时间索引、向量化与模拟的六章实践导读。','Marcos López de Prado：标签区间、防泄漏、验证与多重尝试的六章学习路线。','Marcos López de Prado：组合目标、协方差、风险贡献和稳健配置的六章导读。')
 $caseDescriptions=@('固定合成收益演示信号错位造成的虚假回测，并给出可交易时点审计流程。','用明确的权重变化口径推导成本敏感性，区分毛收益和净收益。','确定性序列说明相关性不等于价差稳定，附配对交易样本外研究方案。','通过未来标签区间检查边界重叠，构建清除与隔离的验证流程。','双资产解析模型研究相关性上升与风险集中，附组合压力测试方案。','三资产教学情景复核幸存者偏差，建立历史股票池与公布时间审计。')
 $baseDocs=@{};$caseDocs=@{}
 for($i=4;$i -ge 0;$i--){
  $parsed=ParseSection $baseParts[$i]
  $saved=SaveMaterial $parsed $baseCategory ('base-'+$i) $baseDescriptions[$i] $existing
  $baseDocs[$i]=$saved;$record.foundations=@($baseDocs.GetEnumerator()|Sort-Object Name|ForEach-Object{$_.Value});SaveRecord
  Write-Output ('PASS: foundation saved and verified '+$saved.title);Start-Sleep -Milliseconds 1100
 }
 $relations=@(@(0,2,3),@(0,1),@(1),@(3),@(4),@(0,3))
 for($i=5;$i -ge 0;$i--){
  $parsed=ParseSection $caseParts[$i];$leaves=[Collections.Generic.List[object]]::new();$leaves.Add(@{text='相关基础资料：'})
  foreach($j in $relations[$i]){if($leaves.Count -gt 1){$leaves.Add(@{text=' · '})};$leaves.Add(@{text=$baseDocs[$j].title;url=$SiteOrigin.TrimEnd('/')+'/community/'+$communityId+'/document/'+$baseDocs[$j].documentId})}
  $parsed.nodes=@(@{type='paragraph';children=$leaves.ToArray()})+@($parsed.nodes)
  $saved=SaveMaterial $parsed $caseCategory ('case-'+$i) $caseDescriptions[$i] $existing
  $caseDocs[$i]=$saved;$record.cases=@($caseDocs.GetEnumerator()|Sort-Object Name|ForEach-Object{$_.Value});SaveRecord
  Write-Output ('PASS: problem-oriented case study saved and verified '+$saved.title);Start-Sleep -Milliseconds 1100
 }
 # Add case links to the new foundation documents, preserving all original paragraphs.
 for($i=4;$i -ge 0;$i--){
  $doc=Api GET ('/document/'+$baseDocs[$i].documentId);$nodes=@($doc.documentContent|ConvertFrom-Json)
  $leaves=[Collections.Generic.List[object]]::new();$leaves.Add(@{text='相关案例研究：'})
  for($k=0;$k -lt 6;$k++){if($relations[$k] -contains $i){if($leaves.Count -gt 1){$leaves.Add(@{text='； '})};$leaves.Add(@{text=$caseDocs[$k].title;url=$SiteOrigin.TrimEnd('/')+'/community/'+$communityId+'/document/'+$caseDocs[$k].documentId})}}
  $doc.documentContent=ConvertTo-Json -InputObject @(@(@{type='paragraph';children=$leaves.ToArray()})+$nodes) -Depth 30 -Compress
  $null=Api POST '/document/save' $doc
  if((Api GET ('/document/'+$doc.documentId)).documentContent -ne $doc.documentContent){throw 'Foundation case links read-back failed'}
  Start-Sleep -Milliseconds 1100
 }
 $all=@(Api GET ('/document/getAllByCommunityId?communityId='+$communityId))
 foreach($doc in $all|Where-Object{$record.foundations.documentId -contains $_.documentId -or $record.cases.documentId -contains $_.documentId}){
  $signed=Api POST '/storage/read-urls' @($doc.documentThumbnailUrl)
  if((Invoke-WebRequest $signed.($doc.documentThumbnailUrl) -NoProxy -TimeoutSec 20).StatusCode -ne 200){throw 'Document cover read failed'}
 }
 $record.completed=$true;$record.completedAt=[DateTimeOffset]::Now.ToString('o');SaveRecord
 Write-Output 'COMPLETE: 5 foundation documents and 6 research case studies, with S3 covers and reciprocal links'
}finally{$token=$null;$Credential=$null}
