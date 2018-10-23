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
                `local __FILE_META = {...}`,
                `local a = ${WowKeywords.IMPORT_LIB_NAME}.get("87a61d925f9d8ce482b0b8642d91ead0")`
            ]
        }], {
            personalizedLibrary: false
        })
    }

    @test "Names imports"() {

        this.runCodeAndExpectResult("wow", [
            {
                code: `import {A} from "./a"`,
                expected: [
                    `local __FILE_META = {...}`,
                    `local A = ${WowKeywords.IMPORT_LIB_NAME}.get("57a3494e7efa4eba07c02b3bdf1224e3").A`
                ]

            }, {
                code: `import { A as B } from "./a";`,
                expected: [
                    `local __FILE_META = {...}`,
                    `local B = ${WowKeywords.IMPORT_LIB_NAME}.get("57a3494e7efa4eba07c02b3bdf1224e3").A`
                ]

            }
        ], {
            personalizedLibrary: false
        });

    }

    @test "Multiple named imports"() {

        this.runCodeAndExpectResult("wow", [
            {
                code: `import {A, B, C as D} from "./a"`,
                expected: [
                    `local __FILE_META = {...}`,
                    `local A = ${WowKeywords.IMPORT_LIB_NAME}.get("57a3494e7efa4eba07c02b3bdf1224e3").A`,
                    `local B = ${WowKeywords.IMPORT_LIB_NAME}.get("57a3494e7efa4eba07c02b3bdf1224e3").B`,
                    `local D = ${WowKeywords.IMPORT_LIB_NAME}.get("57a3494e7efa4eba07c02b3bdf1224e3").C`
                ]

            }
        ], {
            personalizedLibrary: false
        });

    }

    @test "Longer file path check"() {

        this.runCodeAndExpectResult("wow",[{
            code: `import {A} from "./a/b/c/d";`,
            expected: [
                `local __FILE_META = {...}`,
                `local A = ${WowKeywords.IMPORT_LIB_NAME}.get("b3db118440b65d234555874d7a736c23").A`
            ]
        }], {
            personalizedLibrary: false
        })
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