import { hash } from "argon2";

console.log(await hash(process.env.npm_config_password, {raw:false}));