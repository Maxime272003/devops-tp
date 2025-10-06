#!/bin/bash

# Script de test de l'API Todo

BASE_URL="http://localhost:3000"

echo "🧪 Test de l'API Todo List"
echo "=========================="
echo ""

# Test 1: Health Check
echo "1️⃣  Test du health check..."
HEALTH=$(curl -s -w "\n%{http_code}" $BASE_URL/api/health)
HTTP_CODE=$(echo "$HEALTH" | tail -n1)
if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ Health check OK"
else
    echo "❌ Health check FAILED (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

# Test 2: Créer une tâche
echo "2️⃣  Test de création d'une tâche..."
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Tâche de test","description":"Description de test"}' \
  -w "\n%{http_code}")
HTTP_CODE=$(echo "$CREATE_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" -eq 201 ]; then
    echo "✅ Création OK"
    TODO_ID=$(echo "$CREATE_RESPONSE" | head -n-1 | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
    echo "   ID de la tâche: $TODO_ID"
else
    echo "❌ Création FAILED (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

# Test 3: Lister les tâches
echo "3️⃣  Test de listing des tâches..."
LIST_RESPONSE=$(curl -s -w "\n%{http_code}" $BASE_URL/api/todos)
HTTP_CODE=$(echo "$LIST_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ Listing OK"
    COUNT=$(echo "$LIST_RESPONSE" | head -n-1 | grep -o '"count":[0-9]*' | cut -d':' -f2)
    echo "   Nombre de tâches: $COUNT"
else
    echo "❌ Listing FAILED (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

# Test 4: Récupérer une tâche par ID
if [ -n "$TODO_ID" ]; then
    echo "4️⃣  Test de récupération par ID..."
    GET_RESPONSE=$(curl -s -w "\n%{http_code}" $BASE_URL/api/todos/$TODO_ID)
    HTTP_CODE=$(echo "$GET_RESPONSE" | tail -n1)
    if [ "$HTTP_CODE" -eq 200 ]; then
        echo "✅ Récupération OK"
    else
        echo "❌ Récupération FAILED (HTTP $HTTP_CODE)"
        exit 1
    fi
    echo ""

    # Test 5: Mettre à jour la tâche
    echo "5️⃣  Test de mise à jour..."
    UPDATE_RESPONSE=$(curl -s -X PUT $BASE_URL/api/todos/$TODO_ID \
      -H "Content-Type: application/json" \
      -d '{"completed":true}' \
      -w "\n%{http_code}")
    HTTP_CODE=$(echo "$UPDATE_RESPONSE" | tail -n1)
    if [ "$HTTP_CODE" -eq 200 ]; then
        echo "✅ Mise à jour OK"
    else
        echo "❌ Mise à jour FAILED (HTTP $HTTP_CODE)"
        exit 1
    fi
    echo ""

    # Test 6: Supprimer la tâche
    echo "6️⃣  Test de suppression..."
    DELETE_RESPONSE=$(curl -s -X DELETE $BASE_URL/api/todos/$TODO_ID -w "\n%{http_code}")
    HTTP_CODE=$(echo "$DELETE_RESPONSE" | tail -n1)
    if [ "$HTTP_CODE" -eq 200 ]; then
        echo "✅ Suppression OK"
    else
        echo "❌ Suppression FAILED (HTTP $HTTP_CODE)"
        exit 1
    fi
    echo ""
fi

echo "🎉 Tous les tests sont passés avec succès !"
