#!/bin/bash

# Test the email API
curl -X POST http://localhost:3000/api/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@gmail.com",
    "firstName": "TestUser"
  }' \
  -w "\n"
