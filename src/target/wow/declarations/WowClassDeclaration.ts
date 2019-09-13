import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { LuaClassDeclaration } from "../../lua/traits";
import { WowPathBuilder } from "../special";
import { SourceFile } from "../../../compiler/SourceFile";

export interface WowClassDeclaration extends BaseTarget<"wow">, Target, WowPathBuilder { }
export class WowClassDeclaration implements Partial<LuaClassDeclaration> {

    public getClassNamespace(node: ts.ClassDeclaration): string {

        return this.getFilePath(node.getSourceFile() as SourceFile);
    }
}
