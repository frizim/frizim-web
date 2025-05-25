import { defineMiddleware } from "astro:middleware";
import {createHash, randomBytes} from "node:crypto";
import { ADMIN_SESSION_DURATION } from "./config";

interface Session {
    tokenHash: string;
    expiry: number;    
}

const sessions: Map<string, Session> = new Map();

export const onRequest = defineMiddleware(async (ctx, next) => {
    console.log(ctx.routePattern);
    if(ctx.routePattern.startsWith("/admin") && ctx.routePattern != "/admin/login") {
        const token = ctx.cookies.get("admin-session");
        if(token) {
            const tokenHash = createHash("sha512").update(token.value).digest("hex");
            const session = sessions.get(tokenHash);
            if(session) {
                if(session.expiry <= Date.now()) {
                    sessions.delete(tokenHash);
                    ctx.cookies.delete("admin-session");
                }
                else {
                    return next();
                }
            }
        }

        return ctx.redirect("/admin/login?redir=" + ctx.url.pathname);
    }
    else {
        return next();
    }
});

export function createSession(): string {
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha512").update(token).digest("hex");
    sessions.set(tokenHash, {
        tokenHash: tokenHash,
        expiry: Date.now() + ADMIN_SESSION_DURATION
    });
    return token;
}