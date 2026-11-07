param([string]$OutputDirectory=(Join-Path $PSScriptRoot '../content/computer-science/covers'))
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$null=New-Item -ItemType Directory -Force -Path $OutputDirectory
$specs=@(
 @{slug='community';title='计算机社区';code='CS';group='EXPLORE SYSTEMS & IDEAS'},
 @{slug='base-0';title='操作系统';code='OS';group='FOUNDATIONS / 01'},
 @{slug='base-1';title='数据结构';code='DS';group='FOUNDATIONS / 02'},
 @{slug='base-2';title='计算机组成原理';code='CO';group='FOUNDATIONS / 03'},
 @{slug='base-3';title='计算机网络';code='NET';group='FOUNDATIONS / 04'},
 @{slug='base-4';title='计算机体系结构';code='ARCH';group='FOUNDATIONS / 05'},
 @{slug='case-0';title='内存压力与页面置换';code='VM';group='RESEARCH / MEMORY'},
 @{slug='case-1';title='范围查询与索引选择';code='IDX';group='RESEARCH / DATA'},
 @{slug='case-2';title='TCP 窗口与吞吐';code='TCP';group='RESEARCH / NETWORK'},
 @{slug='case-3';title='缓存行布局与伪共享';code='CPU';group='RESEARCH / CACHE'},
 @{slug='case-4';title='事件驱动与背压';code='I/O';group='RESEARCH / SERVICES'},
 @{slug='case-5';title='多核扩展与串行瓶颈';code='SMP';group='RESEARCH / PARALLEL'}
)
$backgrounds=@('#E8EDF4','#E9EBF2','#E7F0EF','#EEEAF2');$inks=@('#405B7C','#505E80','#386763','#6B557D')
for($index=0;$index -lt $specs.Count;$index++){
 $spec=$specs[$index];$bitmap=[Drawing.Bitmap]::new(1200,600);$g=[Drawing.Graphics]::FromImage($bitmap)
 $g.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::AntiAlias;$g.TextRenderingHint=[Drawing.Text.TextRenderingHint]::AntiAliasGridFit
 $color=[Drawing.ColorTranslator]::FromHtml($inks[$index%4]);$g.Clear([Drawing.ColorTranslator]::FromHtml($backgrounds[$index%4]))
 $ink=[Drawing.SolidBrush]::new($color);$muted=[Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(160,$color));$light=[Drawing.Pen]::new([Drawing.Color]::FromArgb(42,$color),2);$trace=[Drawing.Pen]::new([Drawing.Color]::FromArgb(95,$color),3)
 $big=[Drawing.Font]::new('Consolas',96,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel);$title=[Drawing.Font]::new('Microsoft YaHei',42,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel);$small=[Drawing.Font]::new('Segoe UI',18,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel)
 try{
  $g.FillRectangle($ink,72,72,38,5);$g.DrawString('COMPUTER SCIENCE / SCIENCE COMMUNITY',$small,$ink,72,110)
  $g.DrawString($spec.code,$big,$ink,64,192);$g.DrawString($spec.title,$title,$ink,[Drawing.RectangleF]::new(72,350,610,130));$g.DrawString($spec.group,$small,$muted,72,525)
  for($x=730;$x -le 1130;$x+=80){for($y=95;$y -le 495;$y+=80){$g.DrawEllipse($light,$x,$y,5,5)}}
  $g.DrawRectangle($trace,830,190,200,200);$g.DrawRectangle($light,865,225,130,130)
  for($j=0;$j -lt 4;$j++){$v=210+$j*50;$g.DrawLine($trace,780,$v,830,$v);$g.DrawLine($trace,1030,$v,1090,$v);$h=850+$j*50;$g.DrawLine($trace,$h,140,$h,190);$g.DrawLine($trace,$h,390,$h,450)}
  $g.DrawLine($light,710,160,780,160);$g.DrawLine($light,780,160,780,210);$g.DrawLine($light,1090,360,1140,360);$g.DrawLine($light,1140,360,1140,460)
  $g.FillEllipse($ink,706,156,8,8);$g.FillEllipse($ink,1136,456,8,8)
  $g.DrawString('01  10  11',$small,$muted,864,278)
  $bitmap.Save((Join-Path $OutputDirectory ($spec.slug+'.png')),[Drawing.Imaging.ImageFormat]::Png)
 }finally{$small.Dispose();$title.Dispose();$big.Dispose();$trace.Dispose();$light.Dispose();$muted.Dispose();$ink.Dispose();$g.Dispose();$bitmap.Dispose()}
}
Write-Output ('Generated '+$specs.Count+' original computer science covers')
