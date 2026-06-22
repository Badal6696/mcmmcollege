// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // The Lovable config only auto-enables the Nitro/Cloudflare build plugin when it
  // detects it's running inside a Lovable sandbox. Plain CI builds (e.g. Cloudflare's
  // own dashboard build, triggered from GitHub) don't have that context, so the
  // Cloudflare Worker output was being silently skipped, leaving only a generic
  // SSR build that Cloudflare can't deploy. Forcing it on here fixes that.
  nitro: { preset: "cloudflare-module" },
});
