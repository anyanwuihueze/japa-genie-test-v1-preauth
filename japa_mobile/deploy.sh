#!/bin/bash
echo "🚀 Building Flutter PWA..."
flutter build web --release

echo "📦 Deploying to Netlify..."
netlify deploy --prod --dir=build/web --message "Update: $(date)"

echo "✅ Live at: https://superb-gelato-b96b92.netlify.app"
