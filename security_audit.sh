#!/bin/bash
echo "🔒 SECURITY AUDIT"
echo "================="

# Find hardcoded API keys
echo "1. Checking for hardcoded API keys..."
grep -r "AIza\|sk_\|pk_\|eyJ" ./src --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v "node_modules"

# Check for .env files in git
echo "2. Checking for .env files in git..."
git ls-files | grep "\.env"

# Find console.log in production code
echo "3. Finding console.log statements..."
grep -r "console\." ./src --include="*.ts" --include="*.tsx" | grep -v "test" | grep -v "spec"

# Check for disabled ESLint rules
echo "4. Checking for disabled ESLint rules..."
grep -r "eslint-disable\|@ts-ignore\|@ts-expect-error" ./src --include="*.ts" --include="*.tsx"
