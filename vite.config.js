import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "/batterijconcept/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        producten: resolve(__dirname, "producten.html"),
        advies: resolve(__dirname, "advies-aan-huis.html"),
        overOns: resolve(__dirname, "over-ons.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
