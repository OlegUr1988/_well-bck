import express from "express";
import path from "path";
import job from "./jobs/job";
import cors from "./middlewares/cors";
import PHDTags from "./routes/PHDTags";
import areas from "./routes/areas";
import assets from "./routes/assets";
import assignments from "./routes/assignments";
import attributeTypes from "./routes/attributeTypes";
import attributes from "./routes/attributes";
import dataSources from "./routes/dataSources";
import equipments from "./routes/equipments";
import records from "./routes/records";
import units from "./routes/units";
import users from "./routes/users";

const app = express();

app.use(express.json());
app.use(cors);
app.use(express.static("dist"));
app.use("/api/users", users);
app.use("/api/areas", areas);
app.use("/api/assets", assets);
app.use("/api/equipments", equipments);
app.use("/api/units", units);
app.use("/api/attribute-types", attributeTypes);
app.use("/api/attributes", attributes);
app.use("/api/phd-tags", PHDTags);
app.use("/api/assignments", assignments);
app.use("/api/records", records);
app.use("/api/data-sources", dataSources);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

job;

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listen on http:\\\\localhost:${port}`));
