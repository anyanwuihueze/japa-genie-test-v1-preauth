#!/bin/bash

echo "🎫 JAPA GENIE PROMO CODE MANAGER"
echo "================================"

while true; do
    echo ""
    echo "1. View all active promo codes"
    echo "2. Create new promo code" 
    echo "3. Check code usage"
    echo "4. Deactivate promo code"
    echo "5. Exit"
    echo ""
    read -p "Choose option (1-5): " choice

    case $choice in
        1)
            echo ""
            echo "📋 ACTIVE PROMO CODES:"
            echo "====================="
            echo "Run this in Supabase SQL Editor:"
            echo "SELECT code, description, duration_days, uses_count, max_uses, expires_at"
            echo "FROM promo_codes WHERE is_active = true ORDER BY created_at DESC;"
            ;;
        2)
            echo ""
            echo "🆕 CREATE NEW PROMO CODE"
            echo "========================"
            read -p "Code: " code
            read -p "Description: " desc
            read -p "Duration (days) [7]: " days
            read -p "Max uses [7]: " uses
            read -p "Expiry (YYYY-MM-DD) [2024-12-31]: " expiry
            
            days=${days:-7}
            uses=${uses:-7}
            expiry=${expiry:-2024-12-31}
            
            echo ""
            echo "📋 NEW PROMO CODE:"
            echo "INSERT INTO promo_codes (code, description, plan_type, duration_days, max_uses, expires_at) VALUES"
            echo "('$code', '$desc', 'pro', $days, $uses, '$expiry');"
            echo ""
            echo "📋 Run the above SQL in Supabase"
            ;;
        3)
            echo ""
            echo "📊 CHECK CODE USAGE"
            echo "==================="
            read -p "Enter promo code to check: " check_code
            echo "Run in Supabase:"
            echo "SELECT code, description, uses_count, max_uses, expires_at,"
            echo "ROUND((uses_count::decimal / max_uses) * 100, 2) as usage_percent"
            echo "FROM promo_codes WHERE code = '$check_code';"
            ;;
        4)
            echo ""
            echo "🚫 DEACTIVATE PROMO CODE"
            echo "========================"
            read -p "Enter code to deactivate: " deactivate_code
            echo "Run in Supabase:"
            echo "UPDATE promo_codes SET is_active = false WHERE code = '$deactivate_code';"
            ;;
        5)
            echo "Goodbye! 🎫"
            exit 0
            ;;
        *)
            echo "Invalid option. Please choose 1-5."
            ;;
    esac
done
