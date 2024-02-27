import fs from "fs";

const getKey = () => {
  try {
    const data = fs.readFileSync(".\\secret_key.txt", "utf8");
    const secretKey: string = data.trim();
    return secretKey;
  } catch (err) {
    console.error("Error reading secret key:", err);
    throw err;
  }
};

export default getKey;
