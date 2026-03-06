import fs from "fs";
import fillTables from "./seed";

(async () => {
  if (!fs.existsSync(".initialized")) {
    await fillTables();
    fs.writeFileSync(".initialized", "Project initialized");
    console.log("Project initialized");
  } else {
    console.log("Project already initialized");
  }
})();
