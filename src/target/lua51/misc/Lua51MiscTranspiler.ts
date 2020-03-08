import { AbstractMiscTranspiler } from "../../../transpiler/impl/AbstractMiscTranspiler";
import { Lua51Identifier } from "./Lua51Identifier";
import { Lua51Block } from "./Lua51Block";
import { Lua51StringLiteral } from "./Lua51StringLiteral";
import { Lua51FirstLiteralToken } from "./Lua51FirstLiteralToken";
import { Lua51Keyword } from "./Lua51Keyword";
import { Lua51ArrayBindingPattern } from "./Lua51ArrayBindingPattern";

export class Lua51MiscTranspiler extends AbstractMiscTranspiler {

    protected transpilerFunctions = {
        identifier: Lua51Identifier,
        block: Lua51Block,
        stringLiteral: Lua51StringLiteral,
        firstLiteralToken: Lua51FirstLiteralToken,
        keyword: Lua51Keyword,
        arrayBindingPattern: Lua51ArrayBindingPattern
    };

}