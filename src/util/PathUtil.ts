import { resolve, normalize, basename, dirname, join, sep as DIRECTORY_SEPERATOR } from "path";

export class PathUtil {

    public static getProjectRoot(): string {

        let root: string;
        if (module!.parent) {
            root = module.parent.filename;
        }
        root = process.argv[1];

        return PathUtil.dirname(root);
    }

    public static getRelativeToRoot(path: string): string {

        return resolve(normalize(path)).replace(normalize(this.getProjectRoot()), "");
    }

    public static filename(path: string): string {

        return basename(path);
    }

    public static resolveNormalize(path: string): string {

        return resolve(normalize(path));
    }

    public static dirname(path: string): string {

        return dirname(path);
    }

    public static toUnixSeparator(path: string): string {
        return path.replace(/\\/g, "/");
    }
}