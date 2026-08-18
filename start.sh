#!/data/data/com.termux/files/usr/bin/bash
set -e

echo "[+] WhatsApp Dashboard"

if ! command -v node >/dev/null 2>&1; then
  echo "[+] Installing Node.js..."
  pkg update -y
  pkg install nodejs -y
fi

echo "[+] Installing dependencies..."
npm install

if [ ! -f .env ]; then
  cp .env.example .env
  echo
  echo "[!] .env dibuat."
  echo "[!] Isi kredensial Meta dengan:"
  echo "    nano .env"
  echo
  exit 0
fi

echo
echo "[+] Starting dashboard..."
echo "[+] Open: http://localhost:8080"
echo

npm start
