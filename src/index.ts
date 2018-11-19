import { CommandLine } from "./cli/CommandLine";

// create new cli instance
const cli = new CommandLine(process.argv.splice(2));

// prepare env
cli.prepare();

// get result
const result = cli.execute();

// dont exit the program if there are file watchers
if (!cli.isWatchingFiles()) {

    // exit the program with the correct exit status
    if (!result) {
        process.exit(1);
    }

    // everything worked fine
    process.exit(0);
}
