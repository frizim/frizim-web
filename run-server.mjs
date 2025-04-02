import fastifyStatic from "@fastify/static";
import fastify from "fastify";
import {fileURLToPath} from "node:url";
import {handler} from "./dist/server/entry.mjs";
import fastifyMiddie from "@fastify/middie";

const app = fastify({logger: true});
await app
    .register(fastifyStatic, {
        root: fileURLToPath(new URL("./dist/client", import.meta.url))
    })
    .register(fastifyMiddie);
app.use(handler);
app.listen({host: process.env.HOST, port: 8080});