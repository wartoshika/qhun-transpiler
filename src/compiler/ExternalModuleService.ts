import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";
import { Project } from "../config/Project";
import { SourceFile } from "./SourceFile";
import { FileNotExistsError } from "../error/FileNotExistsError";

declare type ExternalModuleContainer = {
    [moduleRootName: string]: string
};

/**
 * a service that identifies if a sourcefile is an external module that is
 * nessesary for the program to work
 */
export class ExternalModuleService {

    public static EXTERNAL_FOLDER_NAME = "__external";

    public static instance: ExternalModuleService;

    public static getInstance(): ExternalModuleService {
        if (!ExternalModuleService.instance) {
            ExternalModuleService.instance = new ExternalModuleService();
        }
        return ExternalModuleService.instance;
    }

    /**
     * contains the available external modules.
     * key is the module name. e.g: @wartoshika/wow-qhun-core-ts
     * value contains the new path. e.g: __external/wow-qhun-core-ts
     */
    private availableExternalModules: ExternalModuleContainer = {};

    /**
     * the project instance
     */
    private project: Project;

    /**
     * set the project var
     * @param project the current project config
     */
    public setProject(project: Project): void {
        this.project = project;
    }

    /**
     * check if the given file belongs to an external module
     * @param file the file to check
     */
    public isExternalModule(file: ts.SourceFile): boolean {

        const projectRoot = this.project.rootDir.replace(/\\/g, "/");

        // get the base project path
        const relativeFilePath = file.fileName
            // to normal directory seperator
            .replace(/\\/g, "/")
            // remove absolute path
            .replace(projectRoot, "")
            // strip leading slash
            .replace(/^\/?/, "");

        return relativeFilePath.indexOf(this.project.stripOutDir) !== 0;
    }

    /**
     * check if the given file is a project source file and no external file or module
     * @param file the file to check
     */
    public isInternalModule(file: ts.SourceFile): boolean {

        return !this.isExternalModule(file);
    }

    /**
     * analyses the given files and detect external modules. every file will be cast to a transpiler source file
     * @param file the file to cast
     */
    public analyseSourceFilesAndCastToSourceFile(files: ts.SourceFile[]): SourceFile[] {

        return files.map(file => {

            // check if this file is an external file
            let isExternal = this.isExternalModule(file);
            if (this.project.skipExternalModuleCheck) {
                isExternal = false;
            }

            // add transpiler source file attributes
            (file as SourceFile).isExternal = isExternal;
            (file as SourceFile).transpilerFileName = file.fileName;

            // when external, override the name and path to embed the file
            // into the project's path
            if (isExternal) {

                // get project absolute root path by finding a tsconfig.json file
                const moduleRoot = this.getAbsoluteFilePathByTSConfigPath(file.fileName);

                // valid check
                if (!moduleRoot) {
                    throw new FileNotExistsError(`Could not find any tsconfig.json file in the directories ${path.dirname(file.fileName)} and below.`);
                }

                // extract the module name from the path
                const projectName = moduleRoot.substring(moduleRoot.lastIndexOf("/"), moduleRoot.length);

                // build a new relative file path and add the project name
                // and add an external flag
                const newModuleRoot = `${ExternalModuleService.EXTERNAL_FOLDER_NAME}${projectName}`;
                const relativeFilePath = `${newModuleRoot}${file.fileName.replace(moduleRoot, "")}`;

                // set sourcefile properties
                (file as SourceFile).transpilerFileName = relativeFilePath;
                (file as SourceFile).externalModuleRoot = newModuleRoot;
                (file as SourceFile).externalModuleName = projectName;

                // get node module root path
                let nodeModuleRootPath = moduleRoot.replace(this.project.rootDir.replace(/\\/g, "/"), "");
                if (nodeModuleRootPath[0] === "/") {
                    nodeModuleRootPath = nodeModuleRootPath.substring(1);
                }
                (file as SourceFile).externalNodeModulesPath = nodeModuleRootPath;

                // add to available external modules
                let nodeReference = nodeModuleRootPath.substring(nodeModuleRootPath.indexOf("/"));
                if (nodeReference[0] === "/") {
                    nodeReference = nodeReference.substring(1);
                }
                this.availableExternalModules[nodeReference] = newModuleRoot;
            }

            return file as SourceFile;
        });
    }

    /**
     * get all available external modules
     */
    public getAvailableExternalModules(): ExternalModuleContainer {

        return this.availableExternalModules;
    }

    /**
     * extracts all folder names of a given file
     * @param fileName the file path to extracts the fragments of
     */
    public getPathFragments(fileName: string): string[] {

        let rootAddition: string;
        if (!path.isAbsolute(fileName)) {

            const absolutePath = "/" + fileName;
            rootAddition = absolutePath.replace(fileName, "").replace(/\\/g, "/");

            // replace file name with absolute path
            fileName = absolutePath;
        }

        const fragmentStack = [
            path.dirname(fileName).replace(/\\/g, "/")
        ];

        let currentPath = path.dirname(fileName);
        let lastNormalized: string = "";
        while (true) {

            // check for trailing path sep
            if (currentPath[currentPath.length - 1] !== "\\" && currentPath[currentPath.length - 1] !== "/") {
                currentPath += path.sep;
            }

            currentPath += `..${path.sep}`;
            const normalized = path.normalize(currentPath).replace(/\\/g, "/");

            if (normalized !== lastNormalized && normalized.indexOf(`..${path.sep}`) === -1) {

                // transform the path to push
                let pushPath = normalized;
                if (rootAddition) {
                    pushPath = pushPath.replace(rootAddition, "");
                }
                fragmentStack.push(pushPath);
                lastNormalized = normalized;
            } else {
                break;
            }
        }
        return fragmentStack;
    }

    /**
     * extracts the absolute file name by trying to detect a tsconfig.json file at project root level
     * @param fileName the filename to look for
     */
    private getAbsoluteFilePathByTSConfigPath(fileName: string): string | false {

        let folderOfTsConfig: string = "";

        // iterate over every path fragment
        this.getPathFragments(fileName).some(pathFragment => {

            if (fs.existsSync(pathFragment + path.sep + "tsconfig.json")) {
                folderOfTsConfig = pathFragment;
                return true;
            }

            return false;
        });

        if (!folderOfTsConfig) {
            return false;
        }

        // replace window path sep
        folderOfTsConfig = folderOfTsConfig.replace(/\\/g, "/");

        // the external project name should not be replaced
        const sepIndexSubstring = folderOfTsConfig.lastIndexOf("/");

        // apply substr
        return folderOfTsConfig.substring(0, sepIndexSubstring);
    }

}
