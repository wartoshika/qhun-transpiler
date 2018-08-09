import { CommandLine } from "./CommandLine";

new CommandLine(process.argv.splice(2)).execute();
