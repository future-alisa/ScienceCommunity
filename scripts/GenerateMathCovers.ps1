# Original, code-drawn typography and mathematical diagrams; no external artwork.
param([string]$OutputDirectory=(Join-Path $PSScriptRoot '../content/mathematics/covers'),[switch]$BookEdition,[switch]$CaseEdition)
$ErrorActionPreference='Stop'
if($BookEdition -and $CaseEdition){throw 'Choose one cover edition'}
Add-Type -AssemblyName System.Drawing
$null=New-Item -ItemType Directory -Force -Path $OutputDirectory
$titles=@('高等数学学习指南','函数、极限与连续','导数与微分','中值定理与导数应用','不定积分与积分方法','定积分与反常积分','常微分方程入门','向量与空间解析几何','多元函数与全微分','二重积分与三重积分','曲线与曲面积分','无穷级数与幂级数','数学社区')
$symbols=@('∞','lim','dy/dx','f′(x)','∫','∫','y′','v','∇','∬','∮','Σ','∞')
if($BookEdition){$titles=@('高等数学上册','高等数学下册','线性代数','概率论与数理统计');$symbols=@('∫','∇','Ax','P(X)')}
if($CaseEdition){$titles=@('高数上册 · 常见案例','高数下册 · 常见案例','线性代数 · 常见案例','概率统计 · 常见案例');$symbols=@('V(x)','∬','Ax','P(A)')}
$backgrounds=@('#E8EFE9','#EAF0F3','#F1ECE4','#EDECF2')
$inks=@('#315C49','#3D6173','#826849','#655678')
function Brush([string]$color){return [Drawing.SolidBrush]::new([Drawing.ColorTranslator]::FromHtml($color))}
for($i=0;$i -lt $titles.Count;$i++){
    $palette=if($i -eq 12){0}else{$i%4}
    $bitmap=[Drawing.Bitmap]::new(1200,600)
    $g=[Drawing.Graphics]::FromImage($bitmap)
    $g.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint=[Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([Drawing.ColorTranslator]::FromHtml($backgrounds[$palette]))
    $ink=Brush $inks[$palette];$muted=Brush '#6C7D74'
    $color=[Drawing.ColorTranslator]::FromHtml($inks[$palette])
    $grid=[Drawing.Pen]::new([Drawing.Color]::FromArgb(18,$color),1)
    $line=[Drawing.Pen]::new([Drawing.Color]::FromArgb(90,$color),3)
    $axis=[Drawing.Pen]::new([Drawing.Color]::FromArgb(50,$color),1.5)
    $serif=[Drawing.Font]::new('Georgia',100,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel)
    $symbolFont=[Drawing.Font]::new('Cambria Math',110,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel)
    $titleFont=[Drawing.Font]::new('Microsoft YaHei',43,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel)
    $small=[Drawing.Font]::new('Segoe UI',18,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel)
    try {
        for($x=670;$x -le 1170;$x+=50){$g.DrawLine($grid,$x,60,$x,540)}
        for($y=60;$y -le 540;$y+=50){$g.DrawLine($grid,670,$y,1170,$y)}
        $g.FillRectangle($ink,72,72,38,5)
        $g.DrawString('MATHEMATICS  /  SCIENCE COMMUNITY',$small,$ink,72,110)
        $number=if($i -eq 12){'Explore.'}else{$i.ToString('00')}
        $g.DrawString($number,$serif,$ink,62,170)
        $g.DrawString($titles[$i],$titleFont,$ink,[Drawing.RectangleF]::new(72,325,590,130))
        $footer=if($CaseEdition){'MATHEMATICS  /  APPLIED EXAMPLES'}elseif($BookEdition){'MATHEMATICS  /  COURSE NOTES'}elseif($i -eq 12){'LEARN  ·  CONNECT  ·  DISCOVER'}else{'CALCULUS  /  FOUNDATION NOTES'}
        $g.DrawString($footer,$small,$muted,72,525)
        $g.DrawLine($axis,690,430,1160,430);$g.DrawLine($axis,770,110,770,500)
        $points=[Collections.Generic.List[Drawing.PointF]]::new()
        for($step=0;$step -le 90;$step++){
            $x=690+$step*5;$t=$step/90.0
            $y=switch($i%4){0 {430-270*$t*$t} 1 {330-105*[Math]::Sin($t*5.5)} 2 {440-260*[Math]::Pow($t,0.5)} 3 {250+100*[Math]::Cos($t*5)} }
            $points.Add([Drawing.PointF]::new($x,$y))
        }
        $g.DrawLines($line,$points.ToArray())
        $g.DrawEllipse($axis,835,125,240,240)
        $g.DrawString($symbols[$i],$symbolFont,$ink,[Drawing.RectangleF]::new(830,160,350,180))
        $g.FillEllipse($ink,1100,190,9,9)
        $name=if($i -eq 12){'community.png'}else{$i.ToString('00')+'.png'}
        $bitmap.Save((Join-Path $OutputDirectory $name),[Drawing.Imaging.ImageFormat]::Png)
    } finally { $small.Dispose();$titleFont.Dispose();$symbolFont.Dispose();$serif.Dispose();$axis.Dispose();$line.Dispose();$grid.Dispose();$muted.Dispose();$ink.Dispose();$g.Dispose();$bitmap.Dispose() }
}
Write-Output ('Generated '+$titles.Count+' original mathematics covers')
