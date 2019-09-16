import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { UnsupportedError } from "../../../src/error/UnsupportedError";
import { WowKeywords } from "../../../src/target/wow/WowKeywords";

@suite("[Unit] Target: Wow | Imports", slow(1000), timeout(10000)) class WowImportDeclaration extends UnitTest {

    public before() {

        // make sure that the project data is available
        this.lastProject = this.getProject("wow");
    }

    @test "Namespace imports"() {

        this.runCodeAndExpectResult("wow", [{
            code: `import * as a from "./b"`,
            expected: [
                `local __FILE_META = {...}`,
                `local a = ${WowKeywords.FILE_META_IMPORT_EXPORT}.get("__index_0")`
            ]
        }])
    }

    @test "Names imports"() {

        this.runCodeAndExpectResult("wow", [
            {
                code: `import {A} from "./a"`,
                expected: [
                    `local __FILE_META = {...}`,
                    `local A = ${WowKeywords.FILE_META_IMPORT_EXPORT}.get("__index_0").A`
                ]

            }, {
                code: `import { A as B } from "./a";`,
                expected: [
                    `local __FILE_META = {...}`,
                    `local B = ${WowKeywords.FILE_META_IMPORT_EXPORT}.get("__index_0").A`
                ]

            }
        ]);

    }

    @test "Multiple named imports"() {

        this.runCodeAndExpectResult("wow", [
            {
                code: `import {A, B, C as D} from "./a"`,
                expected: [
                    `local __FILE_META = {...}`,
                    `local A = ${WowKeywords.FILE_META_IMPORT_EXPORT}.get("__index_0").A`,
                    `local B = ${WowKeywords.FILE_META_IMPORT_EXPORT}.get("__index_0").B`,
                    `local D = ${WowKeywords.FILE_META_IMPORT_EXPORT}.get("__index_0").C`
                ]

            }
        ]);

    }

    @test "Longer file path check"() {

        this.runCodeAndExpectResult("wow",[{
            code: `import {A} from "./a/b/c/d";`,
            expected: [
                `local __FILE_META = {...}`,
                `local A = ${WowKeywords.FILE_META_IMPORT_EXPORT}.get("__index_0").A`
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