Befunge.BefungeCore = function(cbcList) {
	var CursolState = {
		Normal: 1,
		Skipping: 2,
		Reading: 4,
		Done: 8,
		Break: 16
	}
	var Direction = {
		N: 0,
		S: 1,
		W: 2,
		E: 3
	}
	var getPutTemp = []

	var stack = new Befunge.StackDump();
	var cursol = new Cursol();
	var cursolState = CursolState.Normal;

	var cmdMap = {
		'<': joinNext(function () { cursol.d = Direction.W; }),
		'>': joinNext(function () { cursol.d = Direction.E; }),
		'^': joinNext(function () { cursol.d = Direction.N; }),
		'v': joinNext(function () { cursol.d = Direction.S; }),
		'_': joinNext(function () { if (stack.pop() == 0) { cursol.d = Direction.E; } else { cursol.d = Direction.W; }}),
		'|': joinNext(function () { if (stack.pop() == 0) { cursol.d = Direction.S; } else { cursol.d = Direction.N; }}),
		'?': joinNext(function () { cursol.d = Math.floor(Math.random() * 4); }),
		' ': joinNext(function () {}),
		'#': joinNext(function () { cursolState = CursolState.Skipping; }),
		'@': joinNext(function () { cursolState = CursolState.Done; }),
		'0': joinNext(function () { stack.push(0); }),
		'1': joinNext(function () { stack.push(1); }),
		'2': joinNext(function () { stack.push(2); }),
		'3': joinNext(function () { stack.push(3); }),
		'4': joinNext(function () { stack.push(4); }),
		'5': joinNext(function () { stack.push(5); }),
		'6': joinNext(function () { stack.push(6); }),
		'7': joinNext(function () { stack.push(7); }),
		'8': joinNext(function () { stack.push(8); }),
		'9': joinNext(function () { stack.push(9); }),
		'"': joinNext(function () { cursolState = CursolState.Reading; }),
		'&': function (next) {
			Befunge.InputView.inputNumber(function(n) {
				stack.push(n);
				next(cursolState);
			});
		},
		'~': function (next) {
			Befunge.InputView.inputChar(function(c) {
				stack.push(c.charCodeAt(0));
				next(cursolState);
			});
		},
		'.': joinNext(function () { Befunge.Console.Output(stack.pop()); Befunge.Console.Output(" ") }),
		',': joinNext(function () { Befunge.Console.Output(String.fromCharCode(stack.pop())); }),
		'+': joinNext(function () { stack.push(stack.pop() + stack.pop()); }),
		'-': joinNext(function () { var y = stack.pop(); var x = stack.pop(); stack.push(x - y); }),
		'*': joinNext(function () { stack.push(stack.pop() * stack.pop()); }),
		'/': joinNext(function () { var y = stack.pop(); var x = stack.pop(); stack.push(Math.floor(x / y)); }),
		'%': joinNext(function () { var y = stack.pop(); var x = stack.pop(); stack.push(x % y); }),
		'`': joinNext(function () { stack.push(stack.pop() > stack.pop() ? 1 : 0); }),
		'!': joinNext(function () { stack.push(stack.pop() == 0 ? 1 : 0); }),
		':': joinNext(function () { var val = stack.pop(); stack.push(val); stack.push(val); }),
		'\\': joinNext(function () {var val1 = stack.pop(); var val2 = stack.pop(); stack.push(val1); stack.push(val2); }),
		'$': joinNext(function() { stack.pop(); }),
		'g': joinNext(function() { var y = stack.pop(); var x = stack.pop(); stack.push(getSrc(y, x).charCodeAt(0)); }),
		'p': joinNext(function() { var y = stack.pop(); var x = stack.pop(); var v = stack.pop(); setSrc(y, x, v); })
	}
	function joinNext(f) {
		return function(next) {
			f();
			next(cursolState);
		}
	}
	var previous;
	this.doAStep = function(next) {
		if (previous) {
			previous.setCurrent(false);
			for (var i = 0; i < getPutTemp.length; i ++) {
				getPutTemp[i].setGetPut(false);
			}
			getPutTemp = [];
		}
		var cbcNow = cbcList[cursol.y][cursol.x];
		cbcNow.setCurrent(true);
		doAStepIn(cbcNow, function(ret) {
			cursol.toNext();
			previous = cbcNow;

			setTimeout(function() { next(argNext(ret)); }, 0);
		});

		function argNext(ret) {
			if (ret == CursolState.Done) {
				return Befunge.BefungeCore.StepResult.Done;
			} else if (cbcList[cursol.y][cursol.x].hasBreak()) { // Next has breakpoint.
				return Befunge.BefungeCore.StepResult.Break;
			} else {
				return Befunge.BefungeCore.StepResult.Continue;
			}
		}
	}
	function doAStepIn(cbcObj, next) {
		if (cursolState == CursolState.Normal) {
			var c = cbcObj.Char;
			var cmd = cmdMap[c];
			if (cmd) {
				cmd(next);
			} else {
				throw "Unknown command " + c;
			};
			return;
		} else if (cursolState == CursolState.Skipping) {
			cursolState = CursolState.Normal;
		} else if (cursolState == CursolState.Reading) {
			var c = cbcObj.Char;
			if (c == '"') {
				cursolState = CursolState.Normal;
			} else {
				stack.push(c.charCodeAt(0));
			}
		} else {
			throw "CursolState???";
		}

		next(cursolState);
	}

	function setSrc(y, x, v) {
		while(y >= cbcList.length) {
			cbcList.push([]);
		}
		while(x >= cbcList[y].length) {
			cbcList[y].push(new Befunge.CbCObj(" "));
		}
		var cbc = cbcList[y][x];
		cbc.setGetPut(true);
		getPutTemp.push(cbc);

		cbc.SetChar(String.fromCharCode(v));
	}
	function getSrc(y, x) {
		var cbc = cbcList[y][x];
		cbc.setGetPut(true);
		getPutTemp.push(cbc);

		return cbc.Char;
	}

	function Cursol() {
		return {
			x: 0,
			y: 0,
			d: Direction.E,
			toNext: function() { toNextIn(this); }
		}

		function toNextIn(obj) {
			switch (obj.d) {
			case Direction.N:
				if (obj.y > 0) {
					obj.y -= 1;
				} else {
					obj.y = cbcList.length - 1;
				}
				break;
			case Direction.S:
				if (obj.y + 1 == cbcList.length) {
					obj.y = 0;
				} else {
					obj.y += 1;
				}
				break;
			case Direction.W:
				if (obj.x > 0) {
					obj.x -= 1;
				} else {
					obj.x = cbcList[obj.y].length - 1;
				}
				break;
			case Direction.E:
				if (obj.x + 1 == cbcList[obj.y].length) {
					obj.x = 0;
				} else {
					obj.x += 1;
				}
				break;
			}
			if (! cbcList[obj.y][obj.x]) {
				toNextIn(obj);
			}
		}
	}
}

Befunge.BefungeCore.StepResult = {
	Continue: 0,
	Done: 1,
	Break: 2
};
