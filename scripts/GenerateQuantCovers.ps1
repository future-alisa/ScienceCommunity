param([string]$OutputDirectory=(Join-Path $PSScriptRoot '../content/quantitative-finance/covers'))
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$null=New-Item -ItemType Directory -Force -Path $OutputDirectory
$specs=@(
 @{slug='community';title='量化学习社区';code='QF';group='LEARN / TEST / REPRODUCE'},
 @{slug='base-0';title='量化交易研究入门';code='QT';group='READING GUIDE / CHAN'},
 @{slug='base-1';title='均值回归与动量研究';code='AT';group='READING GUIDE / CHAN'},
 @{slug='base-2';title='量化数据与计算实践';code='PY';group='READING GUIDE / HILPISCH'},
 @{slug='base-3';title='金融机器学习验证';code='ML';group='READING GUIDE / LOPEZ DE PRADO'},
 @{slug='base-4';title='组合与稳健研究';code='AM';group='READING GUIDE / LOPEZ DE PRADO'},
 @{slug='case-0';title='信号时点与未来信息';code='TIME';group='RESEARCH / DATA LEAKAGE'},
 @{slug='case-1';title='交易成本与微弱优势';code='COST';group='RESEARCH / EXECUTION'},
 @{slug='case-2';title='相关性与稳定价差';code='PAIR';group='RESEARCH / TIME SERIES'},
 @{slug='case-3';title='标签区间与验证';code='CV';group='RESEARCH / VALIDATION'},
 @{slug='case-4';title='相关结构与组合风险';code='RISK';group='RESEARCH / PORTFOLIO'},
 @{slug='case-5';title='历史股票池与样本偏差';code='BIAS';group='RESEARCH / UNIVERSE'}
)
$backgrounds=@('#E8EDF4','#E9EBF2','#E7F0EF','#EEEAF2');$inks=@('#405B7C','#505E80','#386763','#6B557D')
for($index=0;$index -lt $specs.Count;$index++){
 $spec=$specs[$index];$bitmap=[Drawing.Bitmap]::new(1200,600);$g=[Drawing.Graphics]::FromImage($bitmap)
 $g.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::AntiAlias;$g.TextRenderingHint=[Drawing.Text.TextRenderingHint]::AntiAliasGridFit
 $color=[Drawing.ColorTranslator]::FromHtml($inks[$index%4]);$g.Clear([Drawing.ColorTranslator]::FromHtml($backgrounds[$index%4]))
 $ink=[Drawing.SolidBrush]::new($color);$muted=[Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(160,$color));$light=[Drawing.Pen]::new([Drawing.Color]::FromArgb(42,$color),2);$trace=[Drawing.Pen]::new([Drawing.Color]::FromArgb(95,$color),3)
 $big=[Drawing.Font]::new('Consolas',96,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel);$title=[Drawing.Font]::new('Microsoft YaHei',42,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel);$small=[Drawing.Font]::new('Segoe UI',18,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel)
 try{
  $g.FillRectangle($ink,72,72,38,5);$g.DrawString('QUANTITATIVE RESEARCH / SCIENCE COMMUNITY',$small,$ink,72,110)
  $g.DrawString($spec.code,$big,$ink,64,192);$g.DrawString($spec.title,$title,$ink,[Drawing.RectangleF]::new(72,350,610,130));$g.DrawString($spec.group,$small,$muted,72,525)
  for($x=730;$x -le 1130;$x+=80){for($y=95;$y -le 495;$y+=80){$g.DrawEllipse($light,$x,$y,5,5)}}
  $g.DrawLine($light,740,450,1120,450);$g.DrawLine($light,740,140,740,450)
  $ys=@(400,360,385,290,320,240,260,180)
  for($j=0;$j -lt 7;$j++){$g.DrawLine($trace,760+$j*48,$ys[$j],808+$j*48,$ys[$j+1]);$g.FillEllipse($ink,756+$j*48,$ys[$j]-4,8,8)}
  $g.DrawString('HYPOTHESIS / EVIDENCE',$small,$muted,755,475)
  $bitmap.Save((Join-Path $OutputDirectory ($spec.slug+'.png')),[Drawing.Imaging.ImageFormat]::Png)
 }finally{$small.Dispose();$title.Dispose();$big.Dispose();$trace.Dispose();$light.Dispose();$muted.Dispose();$ink.Dispose();$g.Dispose();$bitmap.Dispose()}
}
Write-Output ('Generated '+$specs.Count+' original quantitative research covers')
