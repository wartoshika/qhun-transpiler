import { BaseTarget } from "../../BaseTarget";
import { WowConfig } from "../WowConfig";
import { WowKeywords } from "../WowKeywords";

export interface WowGlobalLibrary extends BaseTarget<WowConfig> { }

/**
 * can create a project specific library object for the global namespace in wow
 */
export class WowGlobalLibrary {

    /**
     * get the __library name for the current project
     */
    protected getGlobalLibraryVariableName(): string {

        let suffix: string = "";
        if (this.project.config.personalizedLibrary) {
            suffix = this.generateGlobalLibraryName();
        }

        return WowKeywords.IMPORT_LIB_NAME + suffix;
    }

    /**
     * generates a unique project based library suffix name
     */
    private generateGlobalLibraryName(): string {

        const onlyAllowedChars = /[^a-zA-Z0-9\_]/g;

        return `${this.project.name}_${this.project.version}`.replace(onlyAllowedChars, "");
    }
}
