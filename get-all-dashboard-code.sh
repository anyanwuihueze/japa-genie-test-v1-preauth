#!/bin/bash

OUTPUT_FILE="complete-dashboard-code-review.txt"

echo "📝 Extracting ALL dashboard code to $OUTPUT_FILE..."

# Clear any existing file
> "$OUTPUT_FILE"

# Function to properly append files
append_code() {
  local filepath="$1"
  echo "FILE: $filepath" >> "$OUTPUT_FILE"
  echo "================================================================================" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  if [[ -f "$filepath" ]]; then
    cat "$filepath" >> "$OUTPUT_FILE"
  else
    echo "[ERROR: File not found at $filepath]" >> "$OUTPUT_FILE"
  fi
  echo "" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
}

# NEW FILES (2 files)
append_code "src/hooks/use-dashboard-data.ts"
append_code "src/lib/utils/progress-calculator.ts"

# MODIFIED COMPONENTS (9 files)
append_code "src/components/dashboard/quick-stats.tsx"
append_code "src/components/dashboard/insights-card.tsx"
append_code "src/components/dashboard/next-best-action.tsx"
append_code "src/components/dashboard/confidence-meter.tsx"
append_code "src/components/dashboard/application-timeline.tsx"
append_code "src/components/dashboard/start-visa-journey-card.tsx"
append_code "src/components/dashboard/document-checker-card.tsx"
append_code "src/components/dashboard/enhanced-profile-card.tsx"
append_code "src/app/dashboard/client.tsx"

echo "✅ DONE! File created: $OUTPUT_FILE"
echo ""
echo "To view all code:"
echo "cat $OUTPUT_FILE"
echo ""
echo "Line count:"
wc -l "$OUTPUT_FILE"

# Also create a version with line numbers for easier review
nl -ba "$OUTPUT_FILE" > "${OUTPUT_FILE%.txt}-with-lines.txt"
echo ""
echo "📊 Version with line numbers also created: ${OUTPUT_FILE%.txt}-with-lines.txt"
