import * as path from "path";
import { FilesProcessor } from "./src/files/filesProcessor";
import { CSVWriter } from "./src/utils/csvWriter";
import { Command } from "commander";
import { JsonView } from "./src/views/jsonView";
import { TableView } from "./src/views/tableView";
import { View } from "./src/views/view";

const program = new Command();

program
  .name("ReactSniffer")
  .description("A React code smells detector")
  .option("--json", "generates json output")
  .option("--csv", "generates csv output files")
  .argument("<path>", "directory or file for detection");

program.parse();

const detectionArg = program.args[0];
const detectionPath = path.isAbsolute(detectionArg)
  ? detectionArg
  : path.join(process.cwd(), detectionArg);

const { csv, json } = program.opts() as { csv: boolean; json: boolean };

const fileProcessor = new FilesProcessor(detectionPath);
const view: View = json ? new JsonView() : new TableView();

view.add(fileProcessor.files);
view.render();

if (csv) {
  void CSVWriter.writeFiles(fileProcessor.files);
  void CSVWriter.writeComponents(
    fileProcessor.files.map((file) => file.components).flat(),
  );
}
