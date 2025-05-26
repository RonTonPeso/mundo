#!/bin/bash

# Install dependencies
npm install

# Build TypeScript
npm run build

# Create deployment package
cd dist
zip -r ../index.zip .
cd ..

echo "Build complete: index.zip" 