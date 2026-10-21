import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "dist");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const rootFiles = await readdir(root, { withFileTypes: true });
for (const entry of rootFiles) {
  if (entry.isFile() && entry.name.endsWith(".html")) {
    await cp(resolve(root, entry.name), resolve(output, entry.name));
  }
}

for (const name of ["app.css", "assets"]) {
  await cp(resolve(root, name), resolve(output, name), { recursive: true });
}

await cp(resolve(root, "src/data"), resolve(output, "src/data"), { recursive: true });
