#!/bin/bash

# DMRV Platform UI - Quick Start Server
# This script starts a local web server to view the UI

PORT=8000
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🌱 DMRV Platform UI Server"
echo "=========================="
echo ""
echo "Starting server on port $PORT..."
echo "Open your browser to: http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Try Python 3 first (most common)
if command -v python3 &> /dev/null; then
    echo "Using Python 3 HTTP server"
    cd "$DIR"
    python3 -m http.server $PORT
# Try Python 2 as fallback
elif command -v python &> /dev/null; then
    echo "Using Python 2 HTTP server"
    cd "$DIR"
    python -m SimpleHTTPServer $PORT
# Try Node.js http-server
elif command -v npx &> /dev/null; then
    echo "Using Node.js http-server (via npx)"
    cd "$DIR"
    npx --yes http-server -p $PORT
# Try PHP
elif command -v php &> /dev/null; then
    echo "Using PHP built-in server"
    cd "$DIR"
    php -S localhost:$PORT
else
    echo "❌ Error: No suitable web server found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3: brew install python3 (macOS) or apt-get install python3 (Linux)"
    echo "  - Node.js: brew install node (macOS) or apt-get install nodejs (Linux)"
    echo "  - PHP: brew install php (macOS) or apt-get install php (Linux)"
    echo ""
    echo "Alternatively, open index.html directly in your browser"
    exit 1
fi

