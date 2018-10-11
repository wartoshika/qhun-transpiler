import { WowPathBuilder } from "./WowPathBuilder";
import { WowPostTranspile } from "./WowPostTranspile";
import { WowGlobalLibrary } from "./WowGlobalLibrary";

export interface WowSpecial extends WowPathBuilder, WowPostTranspile, WowGlobalLibrary { }
