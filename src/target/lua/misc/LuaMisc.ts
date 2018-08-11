import { LuaBlock } from "./LuaBlock";
import { LuaEndOfFileToken } from "./LuaEndOfFileToken";
import { LuaIdentifier } from "./LuaIdentifier";
import { LuaStringLiteral } from "./LuaStringLiteral";
import { LuaNumericLiteral } from "./LuaNumericLiteral";
import { LuaKeyword } from "./LuaKeyword";
import { LuaComputedPropertyName } from "./LuaComputedPropertyName";
import { LuaTypeAssertion } from "./LuaTypeAssertion";
import { LuaExportAssignment } from "./LuaExportAssignment";
import { LuaVariableDeclarationList } from "./LuaVariableDeclarationList";
import { LuaArrayBindingPattern } from "./LuaArrayBindingPattern";
import { LuaObjectBindingPattern } from "./LuaObjectBindingPattern";

export interface LuaMisc extends LuaBlock, LuaEndOfFileToken, LuaIdentifier, LuaStringLiteral, LuaNumericLiteral, LuaKeyword, LuaComputedPropertyName,
    LuaTypeAssertion, LuaExportAssignment, LuaVariableDeclarationList, LuaArrayBindingPattern, LuaObjectBindingPattern { }
