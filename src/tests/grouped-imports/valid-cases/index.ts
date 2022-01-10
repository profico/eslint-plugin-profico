import path from "path";

import { readAllFilesInDir } from "../../../utils/tests";

export default readAllFilesInDir(path.join(__dirname, "."), ["index.ts"]);
