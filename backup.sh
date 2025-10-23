#!/bin/bash
set -e

# Create a new branch for the backup
git checkout -b presupabase-upgrade

# Add all current changes to the branch
git add .

# Commit the changes with a descriptive message
git commit -m "feat: Backup state before Supabase upgrade"

# Push the new branch to the remote repository
git push origin presupabase-upgrade

echo "✅ Backup complete. Your current state is saved in the 'presupabase-upgrade' branch."

# Switch back to the main branch to continue development
git checkout -
