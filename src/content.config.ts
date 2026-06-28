import { file, glob } from 'astro/loaders';
import { defineCollection } from "astro:content";
import { z } from 'astro/zod';

const skill = defineCollection({
	loader: file("./src/content/skills.json"),
	schema: ({image}) => z.object({
		name: z.string(),
		icon: z.string().optional(),
		image: image().optional(),
		level: z.number(),
		tech: z.array(z.object({
			name: z.string(),
			icon: z.string().optional(),
			image: image().optional()
		})).optional()
	})
});

const article = defineCollection({
	loader: glob({base: "./src/content/articles", pattern: "*.{md,mdx}"}),
	schema: z.object({
		title: z.string()
	})
});

export const collections = { skill, article };
