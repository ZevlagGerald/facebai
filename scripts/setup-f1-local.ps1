param(
    [switch]$Start
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$envPath = Join-Path $repoRoot ".env.local"

Write-Host "FaceBai F1 local development setup"
Write-Host "Project: facebai-development (Supabase Singapore)"
Write-Host ""

$publishableKey = (Read-Host "Paste the Supabase DEVELOPMENT publishable key (sb_publishable_...)").Trim()
if (-not $publishableKey.StartsWith("sb_publishable_")) {
    throw "Expected a modern Supabase publishable key beginning with sb_publishable_. Do not paste a secret/service-role key."
}

$content = @"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://hxrrdwhttmkjluhcverb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$publishableKey
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAFCdCcxwW8Jx02gI
"@

Set-Content -Path $envPath -Value $content -Encoding utf8NoBOM

Write-Host ""
Write-Host "Created .env.local (gitignored)."
Write-Host "No Supabase secret/service-role key or Turnstile secret was written."
Write-Host ""
Write-Host "Before live signup testing, complete docs/F1_MANUAL_AUTH_CONFIG.md in the Supabase dashboard."

if ($Start) {
    Push-Location $repoRoot
    try {
        npm run dev
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Host "Then run: npm run dev"
}
