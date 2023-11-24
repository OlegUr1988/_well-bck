import express from "express";
import assets from "./routes/assets";
import cors from "./middlewares/cors";

const app = express();

app.use(express.json());
app.use(cors);
app.use("/api/assets", assets);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listen on http:\\\\localhost:${port}`));
