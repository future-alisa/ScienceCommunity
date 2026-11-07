param([Parameter(Mandatory=$true)][pscredential]$Credential,[string]$Gateway='https://alisa.docker.local')
$ErrorActionPreference='Stop'
$root=Split-Path $PSScriptRoot -Parent
$manifestPath=Join-Path $root 'science_community/community_service/target/rl-community-result.json'
$source=Get-Content (Join-Path $root 'content/reinforcement-learning/prepared-book.json') -Raw -Encoding utf8 | ConvertFrom-Json -AsHashtable
$record=if(Test-Path $manifestPath){Get-Content $manifestPath -Raw | ConvertFrom-Json -AsHashtable}else{@{communityId='';documentId='';assets=@{};completed=$false}}
if($record.completed){throw 'Import already completed; inspect manifest before rerunning'}
$token=$null
function SaveRecord{$record | ConvertTo-Json -Depth 15 | Set-Content $manifestPath -Encoding utf8}
function Api([string]$method,[string]$path,$body=$null){
 $options=@{Uri=$Gateway+'/community'+$path;Method=$method;NoProxy=$true;TimeoutSec=60;Headers=@{Authorization='Bearer '+$token}}
 if($null -ne $body){$options.ContentType='application/json; charset=utf-8';$options.Body=[Text.Encoding]::UTF8.GetBytes((ConvertTo-Json -InputObject $body -Depth 40 -Compress))}
 $reply=Invoke-RestMethod @options
 if($reply.code -ne 200){throw ('API failed '+$path)}
 return $reply.data
}
function Upload([string]$key,[string]$path,[string]$mime,[string]$purpose='attachment'){
 if($record.assets.ContainsKey($key)){return $record.assets[$key]}
 $handler=[Net.Http.HttpClientHandler]::new();$handler.UseProxy=$false;$client=[Net.Http.HttpClient]::new($handler);$form=[Net.Http.MultipartFormDataContent]::new()
 try{
  $client.DefaultRequestHeaders.Authorization=[Net.Http.Headers.AuthenticationHeaderValue]::new('Bearer',$token)
  $file=[Net.Http.ByteArrayContent]::new([IO.File]::ReadAllBytes($path));$file.Headers.ContentType=[Net.Http.Headers.MediaTypeHeaderValue]::new($mime)
  $extension=[IO.Path]::GetExtension($path);$form.Add($file,'file',$key+$extension)
  $form.Add([Net.Http.StringContent]::new($purpose),'purpose');$form.Add([Net.Http.StringContent]::new($record.communityId),'communityId')
  $response=$client.PostAsync($Gateway+'/community/storage',$form).GetAwaiter().GetResult()
  if(!$response.IsSuccessStatusCode){throw ('Upload failed: '+$key+' HTTP '+[int]$response.StatusCode)}
  $reply=$response.Content.ReadAsStringAsync().GetAwaiter().GetResult()|ConvertFrom-Json
  if($reply.code -ne 200){throw ('Upload business error: '+$key)}
  $record.assets[$key]=$reply.data.url;SaveRecord
  return $reply.data.url
 }finally{$form.Dispose();$client.Dispose()}
}
try{
 $login=Invoke-RestMethod ($Gateway+'/api/v1/user/signin') -NoProxy -Method Post -ContentType application/json -Body (@{username=$Credential.UserName;password=$Credential.GetNetworkCredential().Password}|ConvertTo-Json -Compress)
 $token=$login.data;if($login.code -ne 200 -or $token -isnot [string]){throw 'Login failed'}
 if(!$record.communityId){
  $ownedMatches=@((Api GET '/community/getAllByUser')|Where-Object communityName -eq '强化学习社区')
  if($ownedMatches.Count -gt 1){throw 'Ambiguous matching community'}
  if($ownedMatches.Count){throw 'An existing community has this name; inspect before importing'}
  $record.communityId=[guid]::NewGuid().ToString('N');SaveRecord
  $null=Api POST '/community/upsert' @{communityId=$record.communityId;communityName='强化学习社区';communityDescription='围绕序贯决策与贝尔曼方程，学习动态规划、时序差分、深度强化学习、策略优化、模型与离线学习、多智能体及偏好优化。基础资料保留完整教材与章节导航，重视算法假设、误差机制、实验诊断与可复现性。';communityImageUrl='';communityUrl=''}
 }
 $community=Api GET ('/community/'+$record.communityId)
 if($community.communityName -ne '强化学习社区'){throw 'Unexpected community identity'}
 $access=Api GET ('/communityuser/access?communityId='+$record.communityId)
 if($access.role -notin @('owner','admin')){throw 'Management access required'}
 if(!$community.communityImageUrl){
  $cover=Upload 'community-cover' (Join-Path $root 'content/reinforcement-learning/community-cover.png') 'image/png' 'community-cover'
  $null=Api POST ('/community/'+$record.communityId+'/cover') @{url=$cover}
 }
 Write-Output ('PASS: reinforcement learning community ready '+$record.communityId)
 $index=0
 foreach($asset in $source.assets){
  $null=Upload $asset.key $asset.path $asset.mime
  $index++
  if($index%10 -eq 0){Write-Output ('Uploaded and recorded '+$index+'/'+$source.assets.Count+' source assets')}
 }
 $cover=Upload 'book-cover' (Join-Path $root 'content/reinforcement-learning/book-cover.png') 'image/png' 'document-cover'
 foreach($block in $source.nodes){
  if($block.ContainsKey('url') -and $block.url.StartsWith('https://source.invalid/')){$key=$block.url.Substring('https://source.invalid/'.Length);$block.url=$record.assets[$key]}
  foreach($leaf in $block.children){if($leaf.ContainsKey('url') -and $leaf.url.StartsWith('https://source.invalid/')){$key=$leaf.url.Substring('https://source.invalid/'.Length);$leaf.url=$record.assets[$key]}}
 }
 $content=ConvertTo-Json -InputObject @($source.nodes) -Depth 40 -Compress
 if([Text.Encoding]::UTF8.GetByteCount($content) -ge 1MB){throw 'Document exceeds content limit'}
 $category=((Api GET '/category/getAll')|Where-Object categoryName -eq 'base').categoryId
 if(!$category){throw 'Missing base category'}
 $book=Api POST '/document/save' @{documentId=$record.documentId;documentCommunityId=$record.communityId;documentCategoryId=$category;documentName=$source.title;documentDescription='用户提供的完整教材：102 页、48 章，涵盖贝尔曼方程、TD、DQN、PPO、SAC、模型与离线强化学习、多智能体、RLHF，以及 Rust / Burn 核心实现。含可编辑文字、原页图像链接和完整 PDF。';documentContent=$content;documentThumbnailUrl=$cover}
 $record.documentId=$book.documentId;SaveRecord
 $verified=Api GET ('/document/'+$record.documentId)
 if($verified.documentContent -ne $content -or $verified.documentCategoryId -ne $category -or $verified.documentCommunityId -ne $record.communityId){throw 'Book read-back mismatch'}
 $signed=Api POST '/storage/read-urls' @($record.assets['original-pdf'],$record.assets['page-008'],$cover,$record.assets['community-cover'])
 foreach($url in $signed.PSObject.Properties.Value){if((Invoke-WebRequest $url -NoProxy -TimeoutSec 30).StatusCode -ne 200){throw 'Asset read failed'}}
 $record.pageCount=$source.pageCount;$record.chapterCount=$source.chapterCount;$record.sourceSha256=$source.sourceSha256;$record.contentBytes=[Text.Encoding]::UTF8.GetByteCount($content);$record.completed=$true;SaveRecord
 Write-Output ('COMPLETE: 1 book, 48 chapters, 102 source pages and original PDF; '+$record.contentBytes+' content bytes')
}finally{$token=$null;$Credential=$null}
