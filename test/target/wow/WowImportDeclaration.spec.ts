import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { UnsupportedError } from "../../../src/error/UnsupportedError";
import { WowKeywords } from "../../../src/target/wow/WowKeywords";
import { WowConfig } from "../../../src/target/wow/WowConfig";

@suite("[Unit] Target: Wow | Imports", slow(1000), timeout(10000)) class WowImportDeclaration extends UnitTest {

    public before() {

        // make sure that the project data is available
        this.lastProject = this.getProject("wow", {} as WowConfig);
    }

    @test "Namespace imports"() {

        this.runCodeAndExpectResult("wow", [{
            code: `import * as a from "./b"`,
            expected: [
                `local a = ${WowKeywords.IMPORT_LIB_NAME}.get("${this.lastProject.name}@b")`
            ]
        }])
    }

    @test "Names imports"() {

        this.runCodeAndExpectResult("wow", [
            {
                code: `import {A} from "./a"`,
                expected: [
                    `local A = ${WowKeywords.IMPORT_LIB_NAME}.get("${this.lastProject.name}@a").A`
                ]

            }, {
                code: `import { A as B } from "./a";`,
                expected: [
                    `local B = ${WowKeywords.IMPORT_LIB_NAME}.get("${this.lastProject.name}@a").A`
                ]

            }
        ]);

    }

    @test "Multiple named imports"() {

        this.runCodeAndExpectResult("wow", [
            {
                code: `import {A, B, C as D} from "./a"`,
                expected: [
                    `local A = ${WowKeywords.IMPORT_LIB_NAME}.get("${this.lastProject.name}@a").A`,
                    `local B = ${WowKeywords.IMPORT_LIB_NAME}.get("${this.lastProject.name}@a").B`,
                    `local D = ${WowKeywords.IMPORT_LIB_NAME}.get("${this.lastProject.name}@a").C`
                ]

            }
        ]);

    }

    @test "Longer file path check"() {

        this.runCodeAndExpectResult("wow",[{
            code: `import {A} from "./a/b/c/d";`,
            expected: [
                `local A = ${WowKeywords.IMPORT_LIB_NAME}.get("${this.lastProject.name}@a/b/c/d").A`
            ]
        }])
    }

    @test "File imports should fail"() {

        this.runCodeAndExpectThrow("wow", [
            {
                code: `import "./myTestFile";`,
                throw: UnsupportedError
            }
        ])
    }

}