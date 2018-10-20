import { LuaTarget } from "./lua/LuaTarget";
import { TargetConstructor } from "./TargetConstructor";
import { WowTarget } from "./wow/WowTarget";
import { Project } from "../config/Project";
import * as ts from "typescript";
import { LuaConfig } from "./lua/LuaConfig";
import { WowConfig } from "./wow/WowConfig";
import { SourceFile } from "../compiler/SourceFile";
import { QhunTranspilerMetadata } from "./QhunTranspilerMetadata";

export declare type SupportedTargets = {
    lua: LuaTarget,
    wow: WowTarget
};

export declare type SupportedTargetConfig = {
    lua: LuaConfig,
    wow: WowConfig
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
     * @param metadata the transpiler metadata
     */
    public create<T extends keyof SupportedTargetConstructors>(
        target: T,
        project: Project,
        typeChecker: ts.TypeChecker,
        sourceFile: SourceFile,
        metadata: QhunTranspilerMetadata
    ): SupportedTargets[T] {

        return new TargetFactory.supportedTargets[target](project, typeChecker, sourceFile, metadata);
    }
}
