import { cp, mkdir } from "node:fs/promises";
await mkdir("dist/themes", { recursive: true });
await cp("src/styles.css", "dist/styles.css");
await cp("src/themes/mt0.css", "dist/themes/mt0.css");
