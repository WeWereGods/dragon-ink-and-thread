# Render a built sign to PDF + PNG with headless Edge.
#
#   .\render.ps1 d-display            letter portrait (default)
#   .\render.ps1 s-price -Size 4x6    true 4in x 6in card
#
# Writes <name>.pdf and <name>.png next to the HTML, in build/, and prints the page count.
# A page count above 1 on a single-page sign means the content overflowed.
param(
  [Parameter(Mandatory = $true)][string]$Name,
  [ValidateSet("letter", "4x6")][string]$Size = "letter"
)

$dir = Join-Path $PSScriptRoot "build"
$html = Join-Path $dir "$Name.html"
if (-not (Test-Path $html)) { Write-Error "no such file: $html"; exit 1 }

if ($Size -eq "4x6") { $w = 384; $h = 576 } else { $w = 816; $h = 1056 }

$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { Write-Error "Edge not found at $edge"; exit 1 }

$url = "file:///" + ($html -replace "\\", "/")
$png = Join-Path $dir "$Name.png"
$pdf = Join-Path $dir "$Name.pdf"
$stamp = [DateTime]::Now.ToString("HHmmss")

# A fresh user-data-dir per run; reusing one makes Edge occasionally produce nothing.
$p = Start-Process -FilePath $edge -ArgumentList "--headless=new", "--disable-gpu", "--hide-scrollbars",
  "--allow-file-access-from-files", "--user-data-dir=$dir\edge-$stamp-a",
  "--force-device-scale-factor=2", "--window-size=$w,$h", "--virtual-time-budget=10000",
  "--screenshot=`"$png`"", $url -PassThru
if (-not $p.WaitForExit(60000)) { $p | Stop-Process -Force; Write-Warning "png timed out" }

$p = Start-Process -FilePath $edge -ArgumentList "--headless=new", "--disable-gpu",
  "--allow-file-access-from-files", "--user-data-dir=$dir\edge-$stamp-b",
  "--no-pdf-header-footer", "--virtual-time-budget=10000",
  "--print-to-pdf=`"$pdf`"", $url -PassThru
if (-not $p.WaitForExit(60000)) { $p | Stop-Process -Force; Write-Warning "pdf timed out" }

Start-Sleep -Seconds 1
if (Test-Path $pdf) {
  $t = [IO.File]::ReadAllText($pdf, [Text.Encoding]::GetEncoding(28591))
  "pages: " + ([regex]::Matches($t, "/Type\s*/Page(?![A-Za-z])")).Count
}
"wrote $png"
"wrote $pdf"
