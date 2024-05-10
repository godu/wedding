import react from "@astrojs/react";
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	integrations: [react(), tailwind()],
	i18n: {
		defaultLocale: "fr",
		locales: ["fr", "en", "hy"],
		routing: {
			redirectToDefaultLocale: false,
			prefixDefaultLocale: true,
		},
	},
	server: {
		host: true,
	},
});
