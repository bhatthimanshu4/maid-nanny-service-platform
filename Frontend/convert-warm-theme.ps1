[CmdletBinding()]
param(
    [string]$RepoRoot = 'D:\maidnannyproj\maid-nanny-service-platform'
)

$ErrorActionPreference = 'Stop'
$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
$targets = @(
    (Join-Path $RepoRoot 'Frontend\app'),
    (Join-Path $RepoRoot 'Frontend\components')
)
foreach ($target in $targets) {
    if (-not (Test-Path -LiteralPath $target -PathType Container)) {
        throw "Required source folder is missing: $target"
    }
}

# Replace exact Tailwind color tokens only inside literal className values.
$classNamePattern = '(\bclassName\s*=\s*)(["''])(.*?)\2'
$rules = [ordered]@{
    'bg-green-600'      = 'bg-primary'
    'hover:bg-green-700'= 'hover:bg-primary-dark'
    'bg-green-700'      = 'bg-primary-dark'
    'text-green-600'    = 'text-primary-dark'
    'hover:text-green-700' = 'hover:text-primary-dark'
    'text-green-700'   = 'text-primary-dark'
    'border-green-600' = 'border-primary'
    'focus:border-green-600' = 'focus:border-primary'
    'focus:ring-green-600' = 'focus:ring-primary'
    'bg-green-50'       = 'bg-background'
    'bg-green-100'      = 'bg-background'
    'hover:bg-green-50' = 'hover:bg-background'
    'hover:bg-green-100'= 'hover:bg-background'
    'bg-gray-50'        = 'bg-background'
    'hover:bg-gray-50'  = 'hover:bg-background'
    'bg-white'          = 'bg-surface'
    'text-white'        = 'text-foreground'
    'text-gray-500'     = 'text-foreground'
    'text-gray-600'     = 'text-foreground'
    'text-gray-700'     = 'text-foreground'
    'text-gray-900'     = 'text-foreground'
    'border-gray-200'   = 'border-border'
    'border-gray-300'   = 'border-border'
}

$files = foreach ($target in $targets) {
    Get-ChildItem -LiteralPath $target -Recurse -File -Include '*.tsx','*.jsx','*.ts','*.js'
}
$changed = [System.Collections.Generic.List[object]]::new()
foreach ($file in $files) {
    $original = [System.IO.File]::ReadAllText($file.FullName)
    $updated = [regex]::Replace($original, $classNamePattern, {
        param($match)
        $prefix = $match.Groups[1].Value
        $quote = $match.Groups[2].Value
        $classes = $match.Groups[3].Value
        foreach ($old in $rules.Keys) {
            $classes = [regex]::Replace($classes, '(?<![\w-])' + [regex]::Escape($old) + '(?![\w-])', [string]$rules[$old])
        }
        return $prefix + $quote + $classes + $quote
    })
    if ($updated -cne $original) {
        $changed.Add([pscustomobject]@{ Path = $file.FullName; Content = $updated })
    }
}

if ($changed.Count -eq 0) {
    Write-Output 'No matching theme classes found; no files changed.'
    exit 0
}

$backupRoot = Join-Path $RepoRoot ('Frontend\theme-backups\' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null
foreach ($item in $changed) {
    $relative = [System.IO.Path]::GetRelativePath($RepoRoot, $item.Path)
    $backupPath = Join-Path $backupRoot $relative
    New-Item -ItemType Directory -Path (Split-Path -Parent $backupPath) -Force | Out-Null
    Copy-Item -LiteralPath $item.Path -Destination $backupPath
}
foreach ($item in $changed) {
    [System.IO.File]::WriteAllText($item.Path, $item.Content, [System.Text.UTF8Encoding]::new($false))
}
Write-Output "Updated $($changed.Count) file(s). Backup: $backupRoot"
$changed | ForEach-Object { Write-Output ('  ' + [System.IO.Path]::GetRelativePath($RepoRoot, $_.Path)) }
