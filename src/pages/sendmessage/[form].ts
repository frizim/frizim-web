import * as https from "node:https";
import type { APIRoute } from "astro";
import { writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { z, ZodObject } from "astro:schema";
import { MESSAGES_DIR, PUSHOVER_APP, PUSHOVER_USER } from "../../config";
import { existsSync, mkdirSync } from "node:fs";

const schemas = {
    "legal": z.object({
        email: z.string().regex(/\S+@\S{1,64}.\S{2,64}/),
        message: z.string().min(10).max(2000),
        "agree-privacy": z.string().regex(/(on)/)
    }).strict()
} as Record<string, ZodObject<any,any,any,any>>;

const formRegex = /^[a-z-]{1,30}$/;

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
    if(!ctx.params.form || !formRegex.test(ctx.params.form)) {
        return ctx.redirect("/404");
    }

    const schema = schemas[ctx.params.form ?? ""];
    if(!schema) {
        return ctx.redirect("/404");
    }

    let res;
    try {
        res = await schema.parseAsync(Object.fromEntries((await ctx.request.formData()).entries()));
    } catch (err: unknown) {
        console.log(err);
        return ctx.redirect("/" + ctx.params.form);
    }

    const messageId = randomUUID();

    res["id"] = messageId;
    res["created"] = new Date();

    const params = `token=${PUSHOVER_APP}&user=${PUSHOVER_USER}&message=${encodeURIComponent("Neue Nachricht")}&url=${encodeURIComponent("https://" + ctx.url.host + "/admin/message/" + ctx.params.form + "/" + messageId)}`;

    if(!existsSync(MESSAGES_DIR + "/" + ctx.params.form)) {
        mkdirSync(MESSAGES_DIR + "/" + ctx.params.form, {recursive: true});
    }

    await writeFile(MESSAGES_DIR + "/" + ctx.params.form + "/" + messageId + ".json", JSON.stringify(res), {
        flag: "wx+"
    });

    const req = https.request({
        method: "POST",
        hostname: "api.pushover.net",
        path: "/1/messages.json",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": params.length
        }
    }, res => {
        res.on("data", (chunk: Buffer) => {
            console.log(chunk.toString());
        });
    });
    req.write(params);
    req.end();

    return ctx.redirect("/" + ctx.params.form);
};