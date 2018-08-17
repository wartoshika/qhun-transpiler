import { suite, test, slow, timeout } from "mocha-typescript";
import { UnitTest } from "../../UnitTest";
import { UnsupportedError } from "../../../src/error/UnsupportedError";
import { WowKeywords } from "../../../src/target/wow/WowKeywords";
import { WowConfig } from "../../../src/target/wow/WowConfig";

@suite("[Unit] Target: Wow | Path building", slow(1000), timeout(10000)) class WowPathBuilder extends UnitTest {

    

}