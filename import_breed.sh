#!/bin/bash

APP_FILE="src/App.jsx"

# Check if App.jsx exists
if [ ! -f "$APP_FILE" ]; then
  echo "❌ $APP_FILE not found! Make sure you are in the repo root."
  exit 1
fi

echo "📄 Updating $APP_FILE to integrate BreedingCalculator..."

# Backup existing App.jsx
cp "$APP_FILE" "${APP_FILE}.bak"
echo "💾 Backup created at ${APP_FILE}.bak"

# Check if import already exists
if grep -q "BreedingCalculator" "$APP_FILE"; then
  echo "ℹ️ BreedingCalculator import already exists. Skipping import."
else
  # Add import at the top
  sed -i "1i import BreedingCalculator from './BreedingCalculator';" "$APP_FILE"
  echo "✅ Import added."
fi

# Replace return statement with <BreedingCalculator />
# This assumes the default App function is like: function App() { return ( ... ); }
# Replace everything inside the return parentheses
sed -i -E "/return\s*\(/,/\);/c\  return (<BreedingCalculator />);" "$APP_FILE"

echo "🎉 App.jsx updated to use BreedingCalculator."
