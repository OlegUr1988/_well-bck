import fs from "fs";
import path from "path";

// Example of command:
// npm run setDigitCert certPath=path password=password

const args = process.argv.slice(2);

// Parse arguments into an object
const parsedArgs: { [key: string]: string } = {};

for (let arg of args) {
  const [key, value] = arg.split("=");
  parsedArgs[key] = value;
}

const certPath = parsedArgs["certPath"];
const password = parsedArgs["password"];

const setDigitCert = async () => {
  if (certPath && password)
    try {
      const destination = path.join(
        path.resolve(__dirname),
        ".\\windows\\cert.pfx"
      );

      fs.copyFileSync(certPath, destination);
      console.log(destination);
      fs.writeFileSync(".\\windows\\certPassword", password);
    } catch (error) {
      console.log(error);
    }
};

export const getCertPassword = () => {
  try {
    const certPassword = fs.readFileSync(".\\windows\\certPassword", "utf-8");
    return certPassword.trim();
  } catch (error) {
    console.log(error);
  }
};

export const getCertPath = () => {
  return path.join(path.resolve(__dirname), ".\\windows\\cert.pfx");
};

setDigitCert();
