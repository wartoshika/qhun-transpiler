import { CommandLine } from "./cli/CommandLine";

const result = new CommandLine(process.argv.splice(2)).execute();

// exit the program with the correct exit status
if (!result) {
    process.exit(1);
}

// everything worked fine
process.exit(0);
