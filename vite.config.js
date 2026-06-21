import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";
dns.setDefaultResultOrder("verbatim");
// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin

import vuetify from "vite-plugin-vuetify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default () => {
  const baseURL =
    process.env.APP_ENV === "development" ? "/" : "/planetarium-frontend/";

  return defineConfig({
    plugins: [vue(), vuetify({ autoImport: true })],

    server: {
      host: "localhost",
      port: 8081,
    },
    base: baseURL,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
};
