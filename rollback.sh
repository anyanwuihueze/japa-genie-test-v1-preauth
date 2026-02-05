#!/bin/bash

# ================================================================
# EMERGENCY ROLLBACK SCRIPT
# ================================================================

echo "🔄 ROLLBACK: Restoring previous dashboard..."

# Find most recent backup
BACKUP_DIR=$(ls -td dashboard_backup_* 2>/dev/null | head -1)

if [ -z "$BACKUP_DIR" ]; then
    echo "❌ No backup found!"
    exit 1
fi

echo "📦 Found backup: $BACKUP_DIR"
echo "⚠️  This will restore:"
echo "   - src/app/dashboard/"
echo "   - src/components/dashboard/"
echo ""
read -p "Continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Rollback cancelled"
    exit 0
fi

# Restore files
rm -rf src/app/dashboard
rm -rf src/components/dashboard

cp -r "$BACKUP_DIR"/dashboard src/app/
cp -r "$BACKUP_DIR"/dashboard src/components/

echo "✅ Files restored from: $BACKUP_DIR"
echo "🔨 Rebuilding..."

npm run build

if [ $? -eq 0 ]; then
    echo "✅ Rollback successful!"
else
    echo "⚠️  Build failed. Check errors above."
fi
