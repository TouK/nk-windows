const { execSync } = require("node:child_process");
const fsPromises = require("node:fs/promises");
const path = require("node:path");

function parseVersion(name) {
  const match = name.match(/^v?(\d+)\.(\d+)\.(\d+)(?:-beta\.(\d+))?$/);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    beta: match[4] != null ? Number(match[4]) : Infinity,
  };
}

function compareVersions(a, b) {
  const va = parseVersion(a.name);
  const vb = parseVersion(b.name);
  if (!va || !vb) return 0;
  return (vb.major - va.major)
    || (vb.minor - va.minor)
    || (vb.patch - va.patch)
    || (vb.beta - va.beta);
}

function getPublishDate(name) {
  try {
    // tag date (lightweight tags use commit date)
    return execSync(`git for-each-ref --format='%(creatordate:short)' refs/tags/${name}`, { encoding: "utf-8" }).trim();
  } catch {}
  try {
    // fallback: date of the commit that added the directory
    return execSync(`git log -1 --format='%as' -- ${name}/`, { encoding: "utf-8" }).trim();
  } catch {}
  return "";
}

async function generateIndexHtml(basePath, regex) {
  const items = await fsPromises.readdir(basePath, { withFileTypes: true });

  const latestLink = items.find(item => item.name === "latest");
  let latestTarget = "";
  if (latestLink) {
    latestTarget = await fsPromises.readlink(path.join(basePath, "latest")).catch(() => "");
  }

  const directories = items
    .filter(item => item.name !== "latest" && item.isDirectory() && regex.test(item.name))
    .map(item => ({ name: item.name, date: getPublishDate(item.name) }))
    .sort(compareVersions);

  const latestRow = latestTarget
    ? `<a href="./latest/" class="version stable latest"><span class="name">latest</span><span class="date">${latestTarget}</span></a>`
    : "";

  const htmlContent = [
      `<!DOCTYPE html>`,
      `<html>`,
      `<head><meta charset="utf-8"><link rel="stylesheet" href="index.css"></head>`,
      `<body>`,
      latestRow,
      ...directories.map(({ name, date }) => {
        const cls = name.match("beta") ? "version beta" : "version stable";
        return `<a href="./${name}/" class="${cls}"><span class="name">${name}</span><span class="date">${date || ""}</span></a>`;
      }),
      `</body>`,
      `</html>`,
    ].filter(Boolean)
  ;

  const outputPath = path.join(basePath, ".out");
  try {
    await fsPromises.access(outputPath);
  } catch {
    await fsPromises.mkdir(outputPath, { recursive: true });
  }
  await fsPromises.writeFile(path.join(outputPath, "index.html"), htmlContent.join("\n"));
  await fsPromises.copyFile(path.join(__dirname, "index.css"), path.join(outputPath, "index.css"));

  console.log(`index.html + index.css generated in ${outputPath}`);
}

const basePath = "./";
const regex = /^[a-zA-Z].+$/;

generateIndexHtml(basePath, regex);
