import express from "express";
import assets from "./routes/assets";
import equipments from "./routes/equipments";
import PHDTags from "./routes/PHDTags";
import parts from "./routes/parts";
import cors from "./middlewares/cors";
import path from "path";

const app = express();

app.use(express.json());
app.use(cors);
app.use(express.static("dist"));
app.use("/api/assets", assets);
app.use("/api/equipments", equipments);
app.use("/api/parts", parts);
// app.use("/api/phd-tags", PHDTags);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listen on http:\\\\localhost:${port}`));
