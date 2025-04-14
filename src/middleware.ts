import { defineMiddleware } from "astro:middleware";
import {createHash} from "node:crypto";

interface Session {
    tokenHash: string;
    expiry: number;    
}

export const sessions: Map<string, Session> = new Map();

export const onRequest = defineMiddleware((ctx, next) => {
    if(ctx.routePattern.startsWith("admin")) {
        const token = ctx.cookies.get("admin-session");
        if(token) {
            const tokenHash = createHash("sha512").update(token.value).digest("hex");
            const session = sessions.get(tokenHash);
            if(session && session.expiry <= Date.now()) {
                sessions.delete(tokenHash);
            }
        }
    }
});