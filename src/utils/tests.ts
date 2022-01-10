import fs from "fs";
import path from "path";

export function readAllFilesInDir(
  dir: string,
  filenamesToIgnore: string[] = [],
): string[] {
  let allFilenames = fs.readdirSync(dir);

  if (filenamesToIgnore.length) {
    allFilenames = allFilenames.filter(
      filename => !filenamesToIgnore.includes(filename),
    );
  }

  return allFilenames.map(filename =>
    fs.readFileSync(path.join(dir, filename)).toString().trim(),
  );
}
