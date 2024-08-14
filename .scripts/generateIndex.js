const fs = require("node:fs");
const fsPromises = require("node:fs/promises");
const path = require("node:path");

async function generateIndexHtml(basePath, regex) {
  const items = await fsPromises.readdir(basePath, { withFileTypes: true });

  const directories = items
    .filter(item => item.isDirectory() && regex.test(item.name))
    .map(item => ({
      name: item.name,
      mtime: fs.statSync(path.join(basePath, item.name, "project.json")).mtime,
    }))
    .sort((a, b) => b.mtime - a.mtime);

  const htmlContent = [
      "<!DOCTYPE html><html><body>",
      ...directories.map(({ name }) =>
        `<div style="font-weight: ${name.match("beta") ? "normal" : "bold"}"><a href="./${name}/">${name}</a></div>`,
      ),
      "</body></html>",
    ]
  ;

  const outputPath = path.join(basePath, ".out");
  try {
    await fsPromises.access(outputPath);
  } catch {
    await fsPromises.mkdir(outputPath, { recursive: true });
  }
  await fsPromises.writeFile(path.join(outputPath, "index.html"), htmlContent.join("\n"));

  console.log(`index.html generated in ${outputPath}`);
}

const basePath = "./";
const regex = /^[a-zA-Z].+$/;

generateIndexHtml(basePath, regex);
