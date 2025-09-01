import type { APIRoute } from "astro";
import { MESSAGES_DIR } from "../../../../config";
import { existsSync, unlinkSync } from "node:fs";

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
    if(!ctx.params.form) {
        return ctx.redirect("/404");
    }

    const path = MESSAGES_DIR + "/" + ctx.params.form + "/" + (await ctx.request.formData()).get('messageId')?.toString;
    if(existsSync(path)) {
        unlinkSync(path);
    }

    return ctx.redirect("/admin/message/" + ctx.params.form + "/list");
};