import { ApiOptions } from "../api/ApiOptions";
import { SupportedTargets } from "../target/TargetFactory";

/**
 * the project data read from the qhun-transpiler.json file with aditional parsed data
 */
export interface Project<T extends keyof SupportedTargets = any> extends ApiOptions<T> {

    /**
     * the directory name where to put the transpiled files
     */
    outDir: string;

    /**
     * the root dir of the project. this must be absolute!
     */
    rootDir: string;
}
