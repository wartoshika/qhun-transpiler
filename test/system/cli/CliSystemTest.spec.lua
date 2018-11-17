local suite = require("mocha-typescript").suite
local test = require("mocha-typescript").test
local slow = require("mocha-typescript").slow
local timeout = require("mocha-typescript").timeout
local expect = require("chai").expect
local mockfs = require("mock-fs")
local path = require("path")
local CliSystemTest = {}
CliSystemTest.__index = CliSystemTest
function CliSystemTest.__new(self, ...)
  local instance = setmetatable({}, CliSystemTest)
  if self and CliSystemTest.__prepareNonStatic then
    CliSystemTest.__prepareNonStatic(instance)
  end
  if self and CliSystemTest.__init then
    CliSystemTest.__init(instance, ...)
  end
  return instance
end
function CliSystemTest.__init(self)
end

function CliSystemTest."process should exit with 0 when transpiling was successfull"(self)
  test(self, ""process should exit with 0 when transpiling was successfull"", {})
  local exitCode = nil
  process.exit = (function (code)
    exitCode = code
  end)
  process.argv = {"nodepath", "currentfilepath", "-t", "lua", "-f", path:resolve(__filename)}
  console:log(path:resolve("./src/index.ts"))
  require(path:resolve("./src/index.ts"))
  expect(exitCode).to:equal(0)
end

function CliSystemTest."process should exit with != 0 when an error occurs"(self)
  test(self, ""process should exit with != 0 when an error occurs"", {})
end

CliSystemTest.__init = suite("[System] CLI")(CliSystemTest)
