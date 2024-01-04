import express from "express";
import areas from "./routes/areas";
import assets from "./routes/assets";
import PHDTags from "./routes/PHDTags";
import equipments from "./routes/equipments";
import units from "./routes/units";
import attributeTypes from "./routes/attributeTypes";
import attributes from "./routes/attributes";
import assignments from "./routes/assignments";
import cors from "./middlewares/cors";
import path from "path";

const app = express();

app.use(express.json());
app.use(cors);
app.use(express.static("dist"));
app.use("/api/areas", areas);
app.use("/api/assets", assets);
app.use("/api/equipments", equipments);
app.use("/api/units", units);
app.use("/api/attribute-types", attributeTypes);
app.use("/api/attributes", attributes);
app.use("/api/phd-tags", PHDTags);
app.use("/api/assignments", assignments);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listen on http:\\\\localhost:${port}`));
