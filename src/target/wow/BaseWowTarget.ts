import { use } from "typescript-mix";
import * as wowTrait from "./traits";
import { BaseLuaTarget } from "../lua/BaseLuaTarget";
import { Target } from "../Target";
import { BaseTarget } from "../BaseTarget";

export interface BaseWowTarget extends BaseLuaTarget, Target, wowTrait.WowDeclarations,
    wowTrait.WowSpecial, wowTrait.WowCallExpression { }

export abstract class BaseWowTarget extends BaseTarget implements Target {

    @use(
        // call expressions overrides
        wowTrait.WowCallExpression,
        // declaration overrides
        wowTrait.WowImportDeclaration,
        wowTrait.WowClassDeclaration,
        // specials
        wowTrait.WowPathBuilder,
        wowTrait.WowPostTranspile
    ) protected this: BaseWowTarget;
}
