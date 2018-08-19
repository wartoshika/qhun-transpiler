import { CommandLine } from "./cli/CommandLine";

new CommandLine(process.argv.splice(2)).execute();
