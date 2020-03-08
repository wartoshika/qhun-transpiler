import { Config } from "../Config";
import { AllTranspilers } from "../constraint";
import { Node } from "typescript";
import { Transpiler } from "../transpiler";

export function createTransformProxy<T extends object, M extends keyof AllTranspilers>(wrappedClass: T, transpiler: Transpiler, transpilerMethodName: M, config: Config): T {

    return new Proxy(wrappedClass, {
        get: (target, name) => {

            if (config.transform && typeof config.transform[transpilerMethodName] === "function") {

                const callable = config.transform[transpilerMethodName]!;
                const nodeTranspiler = transpiler.transpileNode.bind(transpiler);
                const originalNodeTranspiler = (target[name as keyof T] as any).bind(target);
                return (node: Node) => callable(node as any, nodeTranspiler, originalNodeTranspiler);
            }

            return target[name as keyof T];
        }
    });
}