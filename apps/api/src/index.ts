import Fastify from "fastify";
import { PROTOCOL_VERSION } from "@rn-studio/protocol"

const app= Fastify({
  logger: true,
  bodyLimit: 1048576, 
});

app.get("/health", async (request, reply) => {
  return {
    status: "ok",
    protocolVersion: PROTOCOL_VERSION,
  };
});

const start = async () => {
    try {
        const port = process.env.PORT ? Number(process.env.PORT) : 4000;
        await app.listen({ port, host: "0.0.0.0" });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();