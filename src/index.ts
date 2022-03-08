import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import Menssage from "./message";

const client = new Client({
  puppeteer: {
    headless: true,
  },
});

client.on("qr", (code) => {
  console.log("QR RECEIVED", code);
  qrcode.generate(code, { small: true });
});

client.on("ready", async () => {
  console.log("Client is ready!");
  // const chats = await client.getChats();
  // console.log({ chats });
});

client.on("message", Menssage);

client.initialize();
