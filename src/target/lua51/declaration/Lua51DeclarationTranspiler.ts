import { AbstractDeclarationTranspiler } from "../../../transpiler";
import { Lua51FunctionDeclaration } from "./Lua51FunctionDeclaration";
import { Lua51ImportDeclaration } from "./Lua51ImportDeclaration";
import { Lua51InterfaceDeclaration } from "./Lua51InterfaceDeclaration";
import { Lua51TypeAliasDeclaration } from "./Lua51TypeAliasDeclaration";
import { Lua51ExportDeclaration } from "./Lua51ExportDeclaration";
import { Lua51ImportEqualsDeclaration } from "./Lua51ImportEqualsDeclaration";
import { Lua51ClassDeclaration } from "./Lua51ClassDeclaration";
import { Lua51ModuleDeclaration } from "./Lua51ModuleDeclaration";
import { Lua51EnumDeclaration } from "./Lua51EnumDeclaration";
import { Lua51VariableDeclarationList } from "./Lua51VariableDeclarationList";
import { Lua51VariableDeclaration } from "./Lua51VariableDeclaration";

export class Lua51DeclarationTranspiler extends AbstractDeclarationTranspiler {

    protected transpilerFunctions = {
        functionDeclaration: Lua51FunctionDeclaration,
        importDeclaration: Lua51ImportDeclaration,
        interfaceDeclaration: Lua51InterfaceDeclaration,
        typeAliasDeclaration: Lua51TypeAliasDeclaration,
        exportDeclaration: Lua51ExportDeclaration,
        importEqualsDeclaration: Lua51ImportEqualsDeclaration,
        classDeclaration: Lua51ClassDeclaration,
        moduleDeclaration: Lua51ModuleDeclaration,
        enumDeclaration: Lua51EnumDeclaration,
        variableDeclarationList: Lua51VariableDeclarationList,
        variableDeclaration: Lua51VariableDeclaration
    };
}