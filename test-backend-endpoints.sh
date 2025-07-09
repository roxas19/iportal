#!/bin/bash

echo "🚀 Testing Backend Integration for Dashboard"
echo "============================================"

# Test if backend is running
echo "1. Testing backend connection..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/admin/ && echo "✅ Backend is running" || echo "❌ Backend not accessible"

echo ""
echo "2. Testing authentication endpoint..."
# Test auth endpoint structure
curl -s -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test","password":"test"}' \
  -w "Status: %{http_code}\n" || echo "❌ Auth endpoint error"

echo ""
echo "3. Testing instructor courses endpoint (needs auth)..."
curl -s -w "Status: %{http_code}\n" http://localhost:8000/api/courses/instructor/courses/ || echo "❌ Instructor courses endpoint error"

echo ""
echo "4. Testing network contacts endpoint (needs auth)..."
curl -s -w "Status: %{http_code}\n" http://localhost:8000/api/network/contacts/ || echo "❌ Network contacts endpoint error"

echo ""
echo "📋 Next Steps:"
echo "- If endpoints return 401/403: Authentication working, need to login first"
echo "- If endpoints return 404: Check backend routing"
echo "- If endpoints return 200: Ready for frontend integration!"
echo ""
echo "🎯 Frontend is running at: http://localhost:3000"
echo "🔧 Backend should be at: http://localhost:8000"
