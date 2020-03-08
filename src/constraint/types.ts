import { Node, TypeChecker } from "typescript";
import { Target, Transpiler, ExpressionTranspiler, StatementTranspiler, MiscTranspiler, DecoratorTranspiler, DeclarationTranspiler } from "../transpiler";
import { Config } from "../Config";
import { PartialTranspiler } from "../transpiler/impl/PartialTranspiler";
import { Obscurifier } from "../util/Obscurifier";

export declare type Class<T> = new (...args: any[]) => T;
export declare type TargetConstructor<T extends Target> = (new (transpiler: Transpiler, config: Config, typeChecker: TypeChecker) => T) & {
    transpilerClass: Class<Transpiler>,
    fillConfig: (config: Config) => Required<OptionalConfigOfTarget<Config>>
};
export declare type TranspilerConstructor<T extends Transpiler> = new (typeChecker: TypeChecker, config: Required<Config>, obscurifier: Obscurifier) => T;
export declare type PartialTranspilerConstructor<T extends PartialTranspiler, F extends keyof T> = new (transpiler: Transpiler) => Pick<T, F>;
export declare type NodeKindMapper = {
    [kind: number]: () => [PartialTranspiler, (node: Node) => string]
};

export declare type ConfigOfTarget<T extends TargetConstructor<any>> = ConstructorParameters<T>[1];
export declare type OptionalConfigOfTarget<C extends Config> = Omit<C, RequiredKeys<C> | keyof Config>

export declare type Imports = {
    variableName?: string,
    typesOnly: boolean,
    path: string
};

export declare type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];
export declare type RequiredKeys<T> = Exclude<KeysOfType<T, Exclude<T[keyof T], undefined>>, undefined>;
export declare type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>;

export declare type AllTranspilers = ExpressionTranspiler & StatementTranspiler & MiscTranspiler & DecoratorTranspiler & DeclarationTranspiler;