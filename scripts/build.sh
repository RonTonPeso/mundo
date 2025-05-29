#!/bin/bash

# Build Lambda functions
cd ../src/lambda/submit-sighting
npm run build
cd ../get-sightings
npm run build
cd ../get-upload-url
npm run build

# Create ZIP files
cd ../submit-sighting
zip -r dist/function.zip dist/*

cd ../get-sightings
zip -r dist/function.zip dist/*

cd ../get-upload-url
zip -r dist/function.zip dist/*

echo "Build complete!" 