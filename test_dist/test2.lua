--[[ Interface Mediator ]]
local Colleague = {}
Colleague.__index = Colleague
function Colleague.__new(self, ...)
  local instance = setmetatable( {}, Colleague )
  
  if self and Colleague.__prepareNonStatic then
    Colleague.__prepareNonStatic( instance )
  end
  if self and Colleague.__init then
    Colleague.__init( instance, ... )
  end
  return instance
end
function Colleague.__init ( self --[[ Parameter ]], mediator --[[ Mediator ]] )
  self.mediator = mediator
end
function Colleague.send ( self --[[ Parameter ]], msg --[[ StringKeyword ]] ) --[[ Returns VoidKeyword ]]
  error ( tostring ( Error.__new( true, "Abstract Method!" ) ) )
end
function Colleague.receive ( self --[[ Parameter ]], msg --[[ StringKeyword ]] ) --[[ Returns VoidKeyword ]]
  error ( tostring ( Error.__new( true, "Abstract Method!" ) ) )
end
local ConcreteColleagueA = Colleague.__new( {} )
ConcreteColleagueA.__super = Colleague
ConcreteColleagueA.__index = ConcreteColleagueA
function ConcreteColleagueA.__new(self, ...)
  local instance = setmetatable( {}, ConcreteColleagueA )
  
  if self and ConcreteColleagueA.__prepareNonStatic then
    ConcreteColleagueA.__prepareNonStatic( instance )
  end
  if self and ConcreteColleagueA.__init then
    ConcreteColleagueA.__init( instance, ... )
  end
  return instance
end
function ConcreteColleagueA.__init ( self --[[ Parameter ]], mediator --[[ Mediator ]] )
  ConcreteColleagueA.__super.__init( self, mediator )
end
function ConcreteColleagueA.send ( self --[[ Parameter ]], msg --[[ StringKeyword ]] ) --[[ Returns VoidKeyword ]]
  self.mediator:send( msg, self )
end
function ConcreteColleagueA.receive ( self --[[ Parameter ]], msg --[[ StringKeyword ]] ) --[[ Returns VoidKeyword ]]
  console:log( msg, "`receive` of ConcreteColleagueA is being called!" )
end
local ConcreteColleagueB = Colleague.__new( {} )
ConcreteColleagueB.__super = Colleague
ConcreteColleagueB.__index = ConcreteColleagueB
function ConcreteColleagueB.__new(self, ...)
  local instance = setmetatable( {}, ConcreteColleagueB )
  
  if self and ConcreteColleagueB.__prepareNonStatic then
    ConcreteColleagueB.__prepareNonStatic( instance )
  end
  if self and ConcreteColleagueB.__init then
    ConcreteColleagueB.__init( instance, ... )
  end
  return instance
end
function ConcreteColleagueB.__init ( self --[[ Parameter ]], mediator --[[ Mediator ]] )
  ConcreteColleagueB.__super.__init( self, mediator )
end
function ConcreteColleagueB.send ( self --[[ Parameter ]], msg --[[ StringKeyword ]] ) --[[ Returns VoidKeyword ]]
  self.mediator:send( msg, self )
end
function ConcreteColleagueB.receive ( self --[[ Parameter ]], msg --[[ StringKeyword ]] ) --[[ Returns VoidKeyword ]]
  console:log( msg, "`receive` of ConcreteColleagueB is being called!" )
end
local ConcreteMediator = {}
ConcreteMediator.__index = ConcreteMediator
function ConcreteMediator.__new(self, ...)
  local instance = setmetatable( {}, ConcreteMediator )
  
  if self and ConcreteMediator.__prepareNonStatic then
    ConcreteMediator.__prepareNonStatic( instance )
  end
  if self and ConcreteMediator.__init then
    ConcreteMediator.__init( instance, ... )
  end
  return instance
end
function ConcreteMediator.__init ( self --[[ Parameter ]] )
end
function ConcreteMediator.send ( self --[[ Parameter ]], msg --[[ StringKeyword ]], colleague --[[ Colleague ]] ) --[[ Returns VoidKeyword ]]
  if self.concreteColleagueA == colleague then
    self.concreteColleagueB:receive( msg )
  else
    self.concreteColleagueA:receive( msg )
  end
end
local __export = {
  Colleague = Colleague,
  ConcreteColleagueA = ConcreteColleagueA,
  ConcreteColleagueB = ConcreteColleagueB,
  ConcreteMediator = ConcreteMediator
}
return __export