// O export estático do Next 16 grava os dados de navegação em pastas
// (ex.: out/plates/__next.plates/__PAGE__.txt), mas o navegador pede o arquivo
// com o caminho unido por pontos (out/plates/__next.plates.__PAGE__.txt).
// Sem servidor para reescrever URLs (GitHub Pages), criamos cópias com o nome esperado.
import { copyFile, readdir, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const OUT_DIR = "out";

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => (entry.isDirectory() ? listFiles(join(dir, entry.name)) : [join(dir, entry.name)])),
  );
  return nested.flat();
}

async function exists(path) {
  return stat(path).then(
    () => true,
    () => false,
  );
}

async function flatten(dir) {
  let copied = 0;
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const entryPath = join(dir, entry.name);

    if (!entry.name.startsWith("__next.")) {
      copied += await flatten(entryPath);
      continue;
    }

    for (const file of await listFiles(entryPath)) {
      const target = join(dir, relative(dir, file).split(sep).join("."));
      if (await exists(target)) continue;
      await copyFile(file, target);
      copied += 1;
    }
  }

  return copied;
}

const copied = await flatten(OUT_DIR);
console.log(`flatten-rsc-segments: ${copied} arquivo(s) criado(s) em ${OUT_DIR}/`);
