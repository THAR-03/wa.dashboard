require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/send", async (req, res) => {
  try {
    const { number, message } = req.body;
    if (!number || !message) {
      return res.status(400).json({
        success: false,
        message: "Nomor dan pesan wajib diisi."
      });
    }

    const version = process.env.GRAPH_API_VERSION || "v23.0";
    const url =
      `https://graph.facebook.com/${version}/${process.env.PHONE_NUMBER_ID}/messages`;

    const response = await axios.post(url, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "text",
      text: {
        preview_url: false,
        body: message
      }
    }, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    res.json({
      success: true,
      message: "Pesan berhasil dikirim.",
      data: response.data
    });
  } catch (error) {
    console.error(
      "WhatsApp error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        "Gagal mengirim pesan."
    });
  }
});

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.WEBHOOK_VERIFY_TOKEN
  ) {
    console.log("Webhook berhasil diverifikasi.");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Receive incoming WhatsApp messages
app.post("/webhook", (req, res) => {
  console.log(
    "Webhook diterima:",
    JSON.stringify(req.body, null, 2)
  );

  try {
    for (const entry of req.body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value || {};

        for (const message of value.messages || []) {
          console.log("\n======================");
          console.log("PESAN WHATSAPP MASUK");
          console.log("======================");
          console.log("Dari :", message.from);
          console.log("ID   :", message.id);
          console.log("Tipe :", message.type);

          if (message.type === "text") {
            console.log("Pesan:", message.text.body);
          }

          console.log("======================\n");
        }
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    return res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Dashboard berjalan di http://localhost:${PORT}`);
});
