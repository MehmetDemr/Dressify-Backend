import "dotenv/config";
import app from "./app";
import { connectDB } from "./src/config/db";
import https from "https";
import fs from "fs";

const PORT = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
  try {
    await connectDB();

    const sslOptions = {
      key: fs.readFileSync(
        "/etc/letsencrypt/live/dressify-shop.com/privkey.pem",
      ),
      cert: fs.readFileSync(
        "/etc/letsencrypt/live/dressify-shop.com/fullchain.pem",
      ),
    };

    https.createServer(sslOptions, app).listen(443, () => {
      console.log("HTTPS Server started on port 443");
    });

    app.listen(PORT, () => {
      console.log(`Server started on: ${PORT} port`);
    });
  } catch (error) {
    console.error("Server couldn't started:", error);
    process.exit(1);
  }
}

startServer();
