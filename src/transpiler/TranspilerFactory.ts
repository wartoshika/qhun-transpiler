import { TranspilerConstructor } from "../constraint";
import { Transpiler } from "./Transpiler";
import { TypeChecker } from "typescript";
import { Config } from "../Config";
import { Obscurifier } from "../util/Obscurifier";

export class TranspilerFactory {

    public create<T extends Transpiler>(typeChecker: TypeChecker, config: Required<Config>, transpiler: TranspilerConstructor<T>, obscurifier: Obscurifier): T {

        return new transpiler(typeChecker, config, obscurifier);
    }
}