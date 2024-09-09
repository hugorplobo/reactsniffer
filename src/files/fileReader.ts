import * as fs from "fs";
import * as path from "path";

export class FileReader {
  readonly dir: string;
  readonly files: string[];

  constructor(dir: string) {
    this.dir = dir;
    this.files = [];

    this.processDir();
  }

  public getAllLines(filename: string): string {
    return fs.readFileSync(filename, "utf-8");
  }

  private processDir(dir: string = this.dir) {
    if (!fs.existsSync(this.dir)) {
      throw new Error("Directory of file not found");
    }

    const dirStats = fs.statSync(dir);

    if (dirStats.isDirectory()) {
      fs.readdirSync(dir).forEach((file) => {
        try {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);

          if (stats?.isDirectory()) {
            if (!filePath.includes("node_modules")) {
              this.processDir(filePath);
            }
          } else if (
            stats.isFile() &&
            (filePath.endsWith(".jsx") || filePath.endsWith(".tsx"))
          ) {
            this.files.push(filePath);
          }
        } catch (_e) {}
      });
    } else {
      this.files.push(dir);
    }
  }
}
