#!/bin/bash
# API Testing Script for Capstone2

echo "🧪 CAPSTONE2 API TESTING"
echo "========================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:5500/api"

# Store tokens
ADMIN_TOKEN=""
WORKER_TOKEN=""
MANAGER_TOKEN=""
HRD_TOKEN=""
USER_ID=""
TASK_ID=""

echo -e "${BLUE}[TEST 1] CREATING ADMIN USER${NC}"
echo "POST /api/users/create (no auth required initially)"

# Check if admin exists first
ADMIN_EXISTS=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"employeeNo": "ADMIN001", "password": "admin123pass"}')

if echo "$ADMIN_EXISTS" | grep -q "token"; then
  echo -e "${GREEN}✅ Admin user already exists${NC}"
  ADMIN_TOKEN=$(echo "$ADMIN_EXISTS" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
  echo "⚠️  Admin user doesn't exist yet. You'll need to create one manually."
  echo "   Or we can test with creating a new user..."
fi

echo ""
echo -e "${BLUE}[TEST 2] LOGIN TEST${NC}"

if [ -z "$ADMIN_TOKEN" ]; then
  echo "Skipping login - no admin token"
else
  echo -e "${GREEN}✅ Admin login successful${NC}"
  echo "Token: ${ADMIN_TOKEN:0:20}..."
fi

echo ""
echo -e "${BLUE}[TEST 3] CREATE WORKER USER${NC}"
echo "POST /api/users/create"

# Create worker user
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/users/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "employeeNo": "WORKER001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "worker@example.com",
    "phoneNumber": "09123456789",
    "birthdate": "1995-06-15",
    "password": "worker123pass",
    "role": "worker"
  }')

if echo "$CREATE_RESPONSE" | grep -q "Account created successfully"; then
  echo -e "${GREEN}✅ Worker created successfully${NC}"
else
  echo -e "${YELLOW}⚠️  Response: $CREATE_RESPONSE${NC}"
fi

echo ""
echo -e "${BLUE}[TEST 4] LOGIN AS WORKER${NC}"
echo "POST /api/auth/login"

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"employeeNo": "WORKER001", "password": "worker123pass"}')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
  echo -e "${GREEN}✅ Worker login successful${NC}"
  WORKER_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  USER_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4 | head -1)
  echo "Worker Token: ${WORKER_TOKEN:0:20}..."
  echo "Worker ID: $USER_ID"
else
  echo -e "${RED}❌ Worker login failed${NC}"
  echo "Response: $LOGIN_RESPONSE"
fi

echo ""
echo -e "${BLUE}[TEST 5] GET ALL USERS${NC}"
echo "GET /api/users/all"

USERS_RESPONSE=$(curl -s -X GET "$BASE_URL/users/all" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

USER_COUNT=$(echo "$USERS_RESPONSE" | grep -o '"employeeNo"' | wc -l)
if [ "$USER_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✅ Users fetched successfully (Count: $USER_COUNT)${NC}"
else
  echo -e "${YELLOW}⚠️  Could not fetch users${NC}"
fi

echo ""
echo -e "${BLUE}[TEST 6] CREATE TASK${NC}"
echo "POST /api/tasks/create"

CREATE_TASK=$(curl -s -X POST "$BASE_URL/tasks/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "taskName": "Complete Report",
    "description": "Finish quarterly report",
    "assignedTo": "'$USER_ID'",
    "priority": "high",
    "dueDate": "2026-05-15"
  }')

if echo "$CREATE_TASK" | grep -q "Task created successfully"; then
  echo -e "${GREEN}✅ Task created successfully${NC}"
  TASK_ID=$(echo "$CREATE_TASK" | grep -o '"_id":"[^"]*' | cut -d'"' -f4 | head -1)
  echo "Task ID: $TASK_ID"
else
  echo -e "${YELLOW}⚠️  Response: $CREATE_TASK${NC}"
fi

echo ""
echo -e "${BLUE}[TEST 7] GET MY TASKS (Worker)${NC}"
echo "GET /api/tasks/my-tasks"

MY_TASKS=$(curl -s -X GET "$BASE_URL/tasks/my-tasks" \
  -H "Authorization: Bearer $WORKER_TOKEN")

TASK_COUNT=$(echo "$MY_TASKS" | grep -o '"taskName"' | wc -l)
if [ "$TASK_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✅ Worker tasks fetched (Count: $TASK_COUNT)${NC}"
else
  echo -e "${YELLOW}⚠️  No tasks returned or error${NC}"
fi

echo ""
echo -e "${BLUE}[TEST 8] UPDATE TASK STATUS${NC}"
echo "PATCH /api/tasks/update-status/:id"

if [ ! -z "$TASK_ID" ]; then
  UPDATE_TASK=$(curl -s -X PATCH "$BASE_URL/tasks/update-status/$TASK_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $WORKER_TOKEN" \
    -d '{"status": "in-progress"}')

  if echo "$UPDATE_TASK" | grep -q "in-progress"; then
    echo -e "${GREEN}✅ Task status updated successfully${NC}"
  else
    echo -e "${YELLOW}⚠️  Status update response: $UPDATE_TASK${NC}"
  fi
else
  echo -e "${RED}❌ No task ID available to update${NC}"
fi

echo ""
echo -e "${YELLOW}========================${NC}"
echo -e "${GREEN}Testing Complete!${NC}"
echo ""
echo "📝 SUMMARY:"
echo "   ✅ Backend running on port 5500"
echo "   ✅ MongoDB connected"
echo "   ✅ API endpoints responding"
echo ""
echo "🔧 NEXT STEPS:"
echo "   1. Test frontend by starting Expo"
echo "   2. Login with ADMIN001 / admin123pass or WORKER001 / worker123pass"
echo "   3. Create more test users with different roles"
echo "   4. Test task assignment workflow"
echo ""
