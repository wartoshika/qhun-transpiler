import { CommandLine } from "./cli/CommandLine";

// create new cli instance
const cli = new CommandLine(process.argv.splice(2));

// prepare env
const result = cli.prepare();

// dont exit the program if there are file watchers
if (result) {

    // everything worked fine
    process.exit(0);
} else {

    // error
    process.exit(1);
}
