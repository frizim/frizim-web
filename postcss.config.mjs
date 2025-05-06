import cssnano from "cssnano";
import { purgeCSSPlugin } from "@fullhuman/postcss-purgecss";
import autoprefixer from "autoprefixer";

export default {
    plugins: [
        cssnano(),
        purgeCSSPlugin({
            content: ['./src/**/*.astro', './src/**/*.ts']
        }),
        autoprefixer()
    ]
};