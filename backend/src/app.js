import express from "express";
import authRoutes from "./routes/auth.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);

app.get("/", (req, res) => {
  res.send("Server is Running....");
});

app.use((err, req, res, next) => {
  res.status(400).json({
    success: false,
    message: err.message,
  });
});

export default app;
