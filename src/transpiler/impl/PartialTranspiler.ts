import { Transpiler } from "../Transpiler";

export abstract class PartialTranspiler {

    constructor(
        protected transpiler: Transpiler
    ) { }
}