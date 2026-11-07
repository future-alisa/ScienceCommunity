param([string]$OutputDirectory=(Join-Path $PSScriptRoot '../content/reinforcement-learning'))
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$null=New-Item -ItemType Directory -Force -Path $OutputDirectory
$specs=@(
 @{slug='community';title='强化学习社区';code='RL';group='STATE / ACTION / VALUE'},
 @{slug='book';title='从贝尔曼方程到现代强化学习';code='V(s)';group='48 CHAPTERS / USER PROVIDED PDF'}
)
$backgrounds=@('#E8EDF4','#E9EBF2','#E7F0EF','#EEEAF2');$inks=@('#405B7C','#505E80','#386763','#6B557D')
for($index=0;$index -lt $specs.Count;$index++){
 $spec=$specs[$index];$bitmap=[Drawing.Bitmap]::new(1200,600);$g=[Drawing.Graphics]::FromImage($bitmap)
 $g.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::AntiAlias;$g.TextRenderingHint=[Drawing.Text.TextRenderingHint]::AntiAliasGridFit
 $color=[Drawing.ColorTranslator]::FromHtml($inks[$index%4]);$g.Clear([Drawing.ColorTranslator]::FromHtml($backgrounds[$index%4]))
 $ink=[Drawing.SolidBrush]::new($color);$muted=[Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(160,$color));$light=[Drawing.Pen]::new([Drawing.Color]::FromArgb(42,$color),2);$trace=[Drawing.Pen]::new([Drawing.Color]::FromArgb(95,$color),3)
 $big=[Drawing.Font]::new('Consolas',96,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel);$title=[Drawing.Font]::new('Microsoft YaHei',42,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel);$small=[Drawing.Font]::new('Segoe UI',18,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel)
 try{
  $g.FillRectangle($ink,72,72,38,5);$g.DrawString('REINFORCEMENT LEARNING / SCIENCE COMMUNITY',$small,$ink,72,110)
  $g.DrawString($spec.code,$big,$ink,64,192);$g.DrawString($spec.title,$title,$ink,[Drawing.RectangleF]::new(72,350,610,130));$g.DrawString($spec.group,$small,$muted,72,525)
  for($x=730;$x -le 1130;$x+=80){for($y=95;$y -le 495;$y+=80){$g.DrawEllipse($light,$x,$y,5,5)}}
  $g.DrawLine($light,740,450,1120,450);$g.DrawLine($light,740,140,740,450)
  $ys=@(400,360,385,290,320,240,260,180)
  for($j=0;$j -lt 7;$j++){$g.DrawLine($trace,760+$j*48,$ys[$j],808+$j*48,$ys[$j+1]);$g.FillEllipse($ink,756+$j*48,$ys[$j]-4,8,8)}
  $g.DrawString('POLICY / ENVIRONMENT',$small,$muted,755,475)
  $bitmap.Save((Join-Path $OutputDirectory ($spec.slug+'-cover.png')),[Drawing.Imaging.ImageFormat]::Png)
 }finally{$small.Dispose();$title.Dispose();$big.Dispose();$trace.Dispose();$light.Dispose();$muted.Dispose();$ink.Dispose();$g.Dispose();$bitmap.Dispose()}
}
Write-Output ('Generated '+$specs.Count+' original reinforcement learning covers')
