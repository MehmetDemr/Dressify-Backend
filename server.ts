import "dotenv/config";
import app from "./app";
import { connectDB } from "./src/config/db";

const PORT = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server started on:${PORT} port`);
    });
  } catch (error) {
    console.error("Server couldn't started:", error);
    process.exit(1);
  }
}

startServer();
