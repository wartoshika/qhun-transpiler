import { LuaTarget } from "./lua/LuaTarget";
import { TargetConstructor } from "./TargetConstructor";
import { WowTarget } from "./wow/WowTarget";
import { Project } from "../config/Project";
import * as ts from "typescript";

export declare type SupportedTargets = {
    lua: LuaTarget,
    wow: WowTarget
};

declare type SupportedTargetConstructors = {
    [T in keyof SupportedTargets]: TargetConstructor<SupportedTargets[T]>
};

/**
 * A factory that is capable of instantiating target classes
 */
export class TargetFactory {

    /**
     * a stack of supported targets
     */
    public static readonly supportedTargets: SupportedTargetConstructors = {
        lua: LuaTarget,
        wow: WowTarget
    };

    /**
     * creates a target by giving the name of the target
     * @param target the target name
     * @param project the project object
     * @param typeChecker the current typer checker
     */
    public create<T extends keyof SupportedTargetConstructors>(target: T, project: Project, typeChecker: ts.TypeChecker): SupportedTargets[T] {

        return new TargetFactory.supportedTargets[target](project, typeChecker);
    }
}
