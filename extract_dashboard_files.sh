#!/bin/bash

# Create timestamped consolidated file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="dashboard_audit_${TIMESTAMP}.txt"

echo "🎯 DASHBOARD AUDIT EXTRACTION - $(date)" > $OUTPUT_FILE
echo "============================================================" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Function to safely extract files with clear separators
extract_file() {
    local filepath=$1
    local description=$2
    
    echo "" >> $OUTPUT_FILE
    echo "============================================================" >> $OUTPUT_FILE
    echo "📁 FILE: $filepath" >> $OUTPUT_FILE
    echo "📝 DESCRIPTION: $description" >> $OUTPUT_FILE
    echo "============================================================" >> $OUTPUT_FILE
    
    if [ -f "$filepath" ]; then
        echo "// --- START OF FILE ---" >> $OUTPUT_FILE
        cat "$filepath" >> $OUTPUT_FILE
        echo "" >> $OUTPUT_FILE
        echo "// --- END OF FILE ---" >> $OUTPUT_FILE
        echo "✅ EXTRACTED: $filepath" >&2
    else
        echo "❌ FILE NOT FOUND: $filepath" >> $OUTPUT_FILE
        echo "❌ MISSING: $filepath" >&2
    fi
}

# Stage 1: Application Timeline Reality Check
extract_file "src/components/dashboard/application-timeline.tsx" "Main timeline component - generates stages based on progress"
extract_file "src/app/dashboard/client.tsx" "Dashboard data flow - how timeline gets currentProgress"
extract_file "src/types/database.types.ts" "Database schema definitions"
extract_file "src/lib/supabase/user-progress.ts" "User progress queries (if exists)"

# Stage 2: Confidence Meter Deep Dive  
extract_file "src/components/dashboard/confidence-meter.tsx" "Current confidence meter - uses REAL data from multiple tables"
extract_file "src/lib/supabase/queries.ts" "All Supabase queries"
extract_file "src/hooks/use-user-data.ts" "User data hooks (if exists)"

# Stage 3: Start Journey Reality Check
extract_file "src/components/dashboard/start-visa-journey-card.tsx" "CONFIRMED: Hardcoded 25% progress - main target"
extract_file "src/app/api/start-journey/route.ts" "Start journey API route (if exists)"
extract_file "src/lib/supabase/mutations.ts" "Supabase mutations (if exists)"

# Stage 4: Progress Infrastructure
extract_file "src/types/progress.types.ts" "Progress type definitions (if exists)"
extract_file "src/utils/progress-calculator.ts" "Progress calculation utilities (if exists)"
extract_file "src/app/api/progress/route.ts" "Progress API endpoint (if exists)"

# Additional Critical Files
extract_file "src/app/dashboard/page.tsx" "Main dashboard page structure"
extract_file "src/components/dashboard/confidence-meter-enhanced.tsx" "Enhanced confidence meter (backup)"
extract_file "src/components/dashboard/apple-health-rings.tsx" "Apple health rings component"

# Database Tables Reference
echo "" >> $OUTPUT_FILE
echo "============================================================" >> $OUTPUT_FILE
echo "📊 DATABASE TABLES REFERENCE" >> $OUTPUT_FILE
echo "============================================================" >> $OUTPUT_FILE

# Extract table schemas from database types
if [ -f "src/types/database.types.ts" ]; then
    echo "// --- USER TABLES ---" >> $OUTPUT_FILE
    grep -A 50 "user_progress" src/types/database.types.ts >> $OUTPUT_FILE 2>/dev/null || echo "user_progress table not found"
    echo "" >> $OUTPUT_FILE
    grep -A 50 "user_documents" src/types/database.types.ts >> $OUTPUT_FILE 2>/dev/null || echo "user_documents table not found"
    echo "" >> $OUTPUT_FILE
    grep -A 50 "user_timeline" src/types/database.types.ts >> $OUTPUT_FILE 2>/dev/null || echo "user_timeline table not found"
fi

# Summary Section
echo "" >> $OUTPUT_FILE
echo "============================================================" >> $OUTPUT_FILE
echo "📋 AUDIT SUMMARY" >> $OUTPUT_FILE
echo "============================================================" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo "✅ CONFIRMED FINDINGS:" >> $OUTPUT_FILE
echo "1. Confidence Meter: Uses REAL data from multiple tables (GOOD)" >> $OUTPUT_FILE
echo "2. Timeline: Uses some real data but hardcoded thresholds (NEEDS FIX)" >> $OUTPUT_FILE
echo "3. Start Journey: Hardcoded 25% progress (CRITICAL FIX NEEDED)" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo "🎯 NEXT STEPS:" >> $OUTPUT_FILE
echo "1. Replace hardcoded 25% with real baseline calculation" >> $OUTPUT_FILE
echo "2. Fix timeline stage thresholds (5%, 20% magic numbers)" >> $OUTPUT_FILE
echo "3. Connect timeline progress to actual user actions" >> $OUTPUT_FILE
echo "4. Use confidence meter approach for all progress calculations" >> $OUTPUT_FILE

echo "" >> $OUTPUT_FILE
echo "============================================================" >> $OUTPUT_FILE
echo "📁 EXTRACTION COMPLETE: $OUTPUT_FILE" >> $OUTPUT_FILE
echo "📁 File size: $(wc -c < $OUTPUT_FILE) bytes" >> $OUTPUT_FILE
echo "📁 Lines: $(wc -l < $OUTPUT_FILE)" >> $OUTPUT_FILE
echo "============================================================" >> $OUTPUT_FILE

echo "✅ Extraction complete! File created: $OUTPUT_FILE"
echo "📊 Size: $(wc -c < $OUTPUT_FILE) bytes, $(wc -l < $OUTPUT_FILE) lines"
