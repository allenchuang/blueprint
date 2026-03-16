import { buildApp } from "./app.js";

const start = async () => {
  const app = await buildApp();

  try {
    const address = await app.listen({ port: 3001, host: "0.0.0.0" });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
