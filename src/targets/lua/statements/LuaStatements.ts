import { LuaReturnStatement } from "./LuaReturnStatement";
import { LuaVariableStatement } from "./LuaVariableStatement";
import { LuaIfStatement } from "./LuaIfStatement";
import { LuaWhileStatement } from "./LuaWhileStatement";
import { LuaDoStatement } from "./LuaDoStatement";
import { LuaForStatement } from "./LuaForStatement";
import { LuaForOfStatement } from "./LuaForOfStatement";
import { LuaForInStatement } from "./LuaForInStatement";
import { LuaSwitchStatement } from "./LuaSwitchStatement";
import { LuaBreakStatement } from "./LuaBreakStatement";
import { LuaTryStatement } from "./LuaTryStatement";
import { LuaThrowStatement } from "./LuaThrowStatement";
import { LuaContinueStatement } from "./LuaContinueStatement";
import { LuaEmptyStatement } from "./LuaEmptyStatement";

export interface LuaStatements extends LuaReturnStatement, LuaVariableStatement, LuaIfStatement, LuaWhileStatement, LuaDoStatement, LuaForStatement,
    LuaForOfStatement, LuaForInStatement, LuaSwitchStatement, LuaBreakStatement, LuaTryStatement, LuaThrowStatement, LuaContinueStatement,
    LuaEmptyStatement { }
