import fs from "fs";
import fillTables from "./seed";

if (!fs.existsSync(".initialized")) {
  fillTables();
  fs.writeFileSync(".initialized", "Project initialized");
  console.log("Project initialized");
} else {
  console.log("Project already initialized");
}
