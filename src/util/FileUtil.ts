import { PathUtil } from "./PathUtil";
import { statSync } from "fs";

export class FileUtil {

    public static readableFileSize(path: string): string {

        const stats = statSync(PathUtil.resolveNormalize(path));
        const bytes = stats["size"];

        return FileUtil.bytesToX(bytes);
    }

    public static bytesToX(bytes: number, thresh: number = 1024): string {

        if (Math.abs(bytes) < thresh) {
            return bytes + " bytes";
        }

        const units = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
        let i = -1;
        do {
            bytes /= thresh;
            ++i;
        } while (Math.abs(bytes) >= thresh && i < units.length - 1);

        return `${bytes.toFixed(2)} ${units[i]}`;
    }
}