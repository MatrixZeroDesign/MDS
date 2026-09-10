import { cp } from "node:fs/promises";
await cp("src/styles.css", "dist/styles.css");
