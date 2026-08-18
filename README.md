# WhatsApp Dashboard

Dashboard lokal untuk WhatsApp Cloud API resmi, cocok untuk Termux/Linux.

## Menjalankan setelah clone

```bash
git clone https://github.com/THAR-03/wa-dashboard
cd wa-dashboard
chmod +x start.sh
./start.sh
```

Pada penggunaan pertama, isi kredensial Meta:

```bash
nano .env
```

Isi:
- WHATSAPP_TOKEN
- PHONE_NUMBER_ID
- GRAPH_API_VERSION
- WEBHOOK_VERIFY_TOKEN

Kemudian:

```bash
./start.sh
```

Buka:

```text
http://localhost:8080
```

## Keamanan

Jangan upload `.env` atau access token ke GitHub. File `.env` sudah dimasukkan ke `.gitignore`.

## Webhook

Endpoint webhook tersedia di:

```text
GET  /webhook
POST /webhook
```

Webhook membutuhkan URL HTTPS publik agar Meta dapat mengakses server Termux.
