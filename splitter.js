const { promises, mkdirSync, rmdirSync } = require('fs');
const { readFile, writeFile } = promises;
const path = require('path');
const yaml = require('js-yaml');
const { snakeCase } = require('lodash');

async function main() {
  const outputPath = path.join(__dirname, 'src/data/links');

  rmdirSync(outputPath, { recursive: true });
  mkdirSync(outputPath);

  const { links } = yaml.safeLoad(
    await readFile(path.join(__dirname, 'src/data/links.yaml'))
  );

  let day = 1;
  let hour = 0;
  let minute = 0;
  let pad = x => String(x).padStart(2, '0');

  for (const [i, link] of links.entries()) {
    const { title } = link;

    minute = i % 60;
    hour = minute % 60 === 0 ? hour + 1 : hour;
    day = hour % 24 === 0 ? day + 1 : day;

    link.image = null;

    let prefix = `2019-12-${pad(day)}-${pad(hour)}-${pad(minute)}`;
    await writeFile(
      path.join(
        `${__dirname}/src/data/links/${prefix}_${snakeCase(
          title.toLowerCase()
        )}.yaml`
      ),
      yaml.safeDump(link)
    );
  }
}

main().catch(console.log);
