import { Test } from "../Test";
import { Config } from "../../src/config/Config";
import { SupportedTargets, TargetFactory } from "../../src/target/TargetFactory";


export abstract class UnitTest extends Test {

    /**
     * get a transpiler target
     * @param target the target to get
     * @param config the optional project config
     */
    protected getTarget<T extends keyof SupportedTargets, C extends Config>(target: T, config?: C): SupportedTargets[T] {

        const targetFactory = new TargetFactory();
        return targetFactory.create(target, this.getProject(target, config), this.getTypeChecker());
    }
}
