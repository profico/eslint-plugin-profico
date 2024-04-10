import path from "path";

import { readAllTxtFilesInDir } from "../../../../utils/tests";

export default readAllTxtFilesInDir(path.join(__dirname, "."), ["index.ts"]);
