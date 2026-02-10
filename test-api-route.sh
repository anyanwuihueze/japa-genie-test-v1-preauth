#!/bin/bash
echo "Testing eligibility API..."
curl -X POST http://localhost:3000/api/analyze-eligibility \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Canada",
    "visaType": "Student",
    "background": "Software engineer with 3 years experience",
    "currentSituation": "Want to study Masters in CS"
  }' | jq .
