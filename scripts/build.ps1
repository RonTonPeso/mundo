# Build Lambda functions
Set-Location ../src/lambda/submit-sighting
npm run build
Set-Location ../get-sightings
npm run build
Set-Location ../get-upload-url
npm run build

# Create ZIP files
Set-Location ../submit-sighting
Compress-Archive -Path dist/* -DestinationPath dist/function.zip -Force

Set-Location ../get-sightings
Compress-Archive -Path dist/* -DestinationPath dist/function.zip -Force

Set-Location ../get-upload-url
Compress-Archive -Path dist/* -DestinationPath dist/function.zip -Force

Write-Host "Build complete!" 