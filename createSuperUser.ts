import { prisma } from "./prisma/client";

// Example of command:
// npm run create-superuser username:username password:password

const args = process.argv.slice(2);

// Parse arguments into an object
const parsedArgs: { [key: string]: string } = {};

for (let arg of args) {
  const [key, value] = arg.split(":");
  parsedArgs[key] = value;
}

const username = parsedArgs["username"];
const password = parsedArgs["password"];

const createSuperUser = async () => {
  if (username && password)
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (user) {
        console.log("User is already created");
      } else {
        await prisma.user.create({
          data: {
            password,
            username,
            isAdmin: true,
          },
        });
        console.log("created");
      }
    } catch (error) {
      console.log(error);
    }
};

createSuperUser();
