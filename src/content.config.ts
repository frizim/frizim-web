import { file, glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

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

const project = defineCollection({
	loader: glob({base: "./src/content/projects", pattern: "*.md"}),
	schema: ({image}) => z.object({
		name: z.string(),
		state: z.enum(["idea", "planning", "wip", "alpha", "beta", "release", "archived"]),
		repo: z.string().optional(),
		icon: image(),
		stack: z.array(z.object({
			name: z.string(),
			icon: z.string().optional(),
			logo: image().optional()
		}))
	})
});

const article = defineCollection({
	loader: glob({base: "./src/content/articles", pattern: "*.{md,mdx}"}),
	schema: z.object({
		title: z.string()
	})
});

export const collections = { skill, project, article };
