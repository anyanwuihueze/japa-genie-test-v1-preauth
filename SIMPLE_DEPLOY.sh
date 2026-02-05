#!/bin/bash

# ================================================================
# JAPA GENIE - SIMPLE ONE-COMMAND DEPLOYMENT
# Just run: bash SIMPLE_DEPLOY.sh
# ================================================================

set -e
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="dashboard_backup_${TIMESTAMP}"

echo "ðŸš€ JAPA GENIE DASHBOARD - SIMPLE DEPLOYMENT"
echo "============================================="
echo ""

# Check we're in right place
if [ ! -d "src/app/dashboard" ]; then
    echo "âŒ Error: Run this from your project root!"
    exit 1
fi

# Backup
echo "ðŸ“¦ Creating backup..."
mkdir -p "$BACKUP_DIR"
cp -r src/app/dashboard "$BACKUP_DIR/"
cp -r src/components/dashboard "$BACKUP_DIR/"
echo "âœ… Backup: $BACKUP_DIR"
echo ""

# Copy NEW components (from same directory as this script)
echo "ðŸ“ Installing VisaSuccessScore..."
if [ -f "VisaSuccessScore.tsx" ]; then
    cp VisaSuccessScore.tsx src/components/dashboard/
    echo "âœ… VisaSuccessScore installed"
else
    echo "âš ï¸  VisaSuccessScore.tsx not found (skipping)"
fi

echo "ðŸ“ Installing RejectionRiskInsights..."
if [ -f "RejectionRiskInsights.tsx" ]; then
    cp RejectionRiskInsights.tsx src/components/dashboard/
    echo "âœ… RejectionRiskInsights installed"
else
    echo "âš ï¸  RejectionRiskInsights.tsx not found (skipping)"
fi

echo "ðŸ“ Installing SmartNextAction..."
if [ -f "SmartNextAction.tsx" ]; then
    cp SmartNextAction.tsx src/components/dashboard/
    echo "âœ… SmartNextAction installed"
else
    echo "âš ï¸  SmartNextAction.tsx not found (skipping)"
fi

echo "ðŸ“ Installing CollapsibleCard..."
if [ -f "CollapsibleCard.tsx" ]; then
    cp CollapsibleCard.tsx src/components/dashboard/
    echo "âœ… CollapsibleCard installed"
else
    echo "âš ï¸  CollapsibleCard.tsx not found (skipping)"
fi

# Update dashboard client
echo "ðŸ“ Updating dashboard..."
if [ -f "dashboard-client-simplified.tsx" ]; then
    cp dashboard-client-simplified.tsx src/app/dashboard/client.tsx
    echo "âœ… Dashboard updated"
else
    echo "âš ï¸  dashboard-client-simplified.tsx not found (skipping)"
fi

echo ""
echo "ðŸ”¨ Testing build..."
if npm run build; then
    echo ""
    echo "============================================="
    echo "âœ… DEPLOYMENT SUCCESS!"
    echo "============================================="
    echo ""
    echo "ðŸ“Š New dashboard installed!"
    echo "ðŸ’¾ Backup saved: $BACKUP_DIR"
    echo ""
    echo "ðŸŽ¯ NEXT STEPS:"
    echo "   1. Test: npm run dev"
    echo "   2. Visit: http://localhost:3000/dashboard"
    echo "   3. Deploy: git push origin main"
    echo ""
    echo "âš ï¸  To undo: bash rollback.sh"
    echo ""
else
    echo ""
    echo "âŒ BUILD FAILED - ROLLING BACK"
    rm -rf src/app/dashboard
    rm -rf src/components/dashboard  
    cp -r "$BACKUP_DIR"/dashboard src/app/
    cp -r "$BACKUP_DIR"/dashboard src/components/
    echo "âœ… Rolled back to previous version"
    echo ""
    echo "Check the errors above and try again"
    exit 1
fi
