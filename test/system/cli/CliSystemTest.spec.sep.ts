import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
import * as path from "path";
import * as fs from "fs";
import { spawn } from "child_process";

@suite("[System] CLI") class CliSystemTest {

    private tempFolder: string;
    private tempFile: string;

    public before(): void {

        this.tempFolder = fs.mkdtempSync("__transpilingTest");
        this.tempFile = path.join(this.tempFolder, path.sep, "testFile.ts");
    }

    public after(): void {

        this.removeRecursive(this.tempFolder)
    }

    private removeRecursive(dir: string): void {
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach(function (entry) {
                var entry_path = path.join(dir, entry);
                if (fs.lstatSync(entry_path).isDirectory()) {
                    this.removeRecursive(entry_path);
                } else {
                    fs.unlinkSync(entry_path);
                }
            });
            fs.rmdirSync(dir);
        }
    }

    @test(slow(1500), timeout(10000)) "process should exit with 0 when transpiling was successfull"(done: Function) {

        // write file
        fs.writeFileSync(this.tempFile, `console.log("test");`);

        // spawn process
        const procName = "./node_modules/.bin/ts-node" + (/^win/.test(process.platform) ? ".cmd" : "");
        const proc = spawn(path.resolve(procName), [path.resolve("./src/index.ts"), "-t", "lua", "-f", path.resolve(this.tempFile)]);

        proc.on("close", code => {

            expect(code).to.equal(0);
            done();
        });
    }

    @test(slow(1500), timeout(3000)) "process should exit with != 0 when an error occurs"(done: Function) {

        // write file
        fs.writeFileSync(this.tempFile, `console.log(Math.fktnDoesNotExists());`);

        // spawn process
        const procName = "./node_modules/.bin/ts-node" + (/^win/.test(process.platform) ? ".cmd" : "");
        const proc = spawn(path.resolve(procName), [path.resolve("./src/index.ts"), "-t", "lua", "-f", path.resolve(this.tempFile)]);

        proc.on("close", code => {

            expect(code).to.equal(1);
            done();
        });
    }
}