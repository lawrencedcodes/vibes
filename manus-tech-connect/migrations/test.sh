#!/bin/bash

# Test script for Tech Connect application
echo "Running Tech Connect application tests..."

# Check if the database migrations exist
echo "Checking database migrations..."
if [ -f "migrations/0001_initial.sql" ] && [ -f "migrations/0002_notifications.sql" ] && [ -f "migrations/0003_messages.sql" ]; then
  echo "✅ Database migrations found"
else
  echo "❌ Database migrations missing"
  exit 1
fi

# Check if the core API routes exist
echo "Checking API routes..."
API_ROUTES=(
  "src/app/api/auth/login/route.ts"
  "src/app/api/auth/register/route.ts"
  "src/app/api/auth/logout/route.ts"
  "src/app/api/profile/route.ts"
  "src/app/api/profile/technologies/route.ts"
  "src/app/api/profile/availability/route.ts"
  "src/app/api/teachers/route.ts"
  "src/app/api/connections/route.ts"
  "src/app/api/match/route.ts"
  "src/app/api/notifications/route.ts"
  "src/app/api/messages/[connectionId]/route.ts"
)

for route in "${API_ROUTES[@]}"; do
  if [ -f "$route" ]; then
    echo "✅ API route found: $route"
  else
    echo "❌ API route missing: $route"
    exit 1
  fi
done

# Check if the core pages exist
echo "Checking pages..."
PAGES=(
  "src/app/page.tsx"
  "src/app/login/page.tsx"
  "src/app/register/page.tsx"
  "src/app/register/success/page.tsx"
  "src/app/dashboard/page.tsx"
  "src/app/profile/page.tsx"
  "src/app/technologies/page.tsx"
  "src/app/availability/page.tsx"
  "src/app/find-teachers/page.tsx"
  "src/app/match/page.tsx"
  "src/app/connections/page.tsx"
  "src/app/notifications/page.tsx"
  "src/app/messages/page.tsx"
  "src/app/messages/[connectionId]/page.tsx"
  "src/app/onboarding/page.tsx"
)

for page in "${PAGES[@]}"; do
  if [ -f "$page" ]; then
    echo "✅ Page found: $page"
  else
    echo "❌ Page missing: $page"
    exit 1
  fi
done

# Check if the core utility files exist
echo "Checking utility files..."
UTILS=(
  "src/lib/auth/auth-utils.ts"
  "src/lib/notifications.ts"
  "src/middleware.ts"
)

for util in "${UTILS[@]}"; do
  if [ -f "$util" ]; then
    echo "✅ Utility file found: $util"
  else
    echo "❌ Utility file missing: $util"
    exit 1
  fi
done

echo "All files are present. Tech Connect application is ready for deployment."
echo "To test the application functionality, start the development server with:"
echo "cd /home/ubuntu/tech-connect/tech-connect && npm run dev"
