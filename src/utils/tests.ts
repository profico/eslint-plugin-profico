import fs from "fs";
import path from "path";

export function readAllTxtFilesInDir(
  dir: string,
  filenamesToIgnore: string[] = [],
): string[] {
  let allFilenames = fs.readdirSync(dir);

  if (filenamesToIgnore.length) {
    allFilenames = allFilenames.filter(
      filename => !filenamesToIgnore.includes(filename),
    );
  }

  allFilenames = allFilenames.filter(el => el.endsWith(".txt"));

  return allFilenames.map(filename =>
    fs.readFileSync(path.join(dir, filename)).toString().trim(),
  );
}
