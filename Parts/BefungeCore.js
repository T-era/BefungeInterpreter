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
		'<': function () { cursol.d = Direction.W; },
		'>': function () { cursol.d = Direction.E; },
		'^': function () { cursol.d = Direction.N; },
		'v': function () { cursol.d = Direction.S; },
		'_': function () { if (stack.pop() == 0) { cursol.d = Direction.E; } else { cursol.d = Direction.W; }},
		'|': function () { if (stack.pop() == 0) { cursol.d = Direction.S; } else { cursol.d = Direction.N; }},
		'?': function () { cursol.d = Math.floor(Math.random() * 4); },
		' ': function () {},
		'#': function () { cursolState = CursolState.Skipping; },
		'@': function () { cursolState = CursolState.Done; },
		'0': function () { stack.push(0); },
		'1': function () { stack.push(1); },
		'2': function () { stack.push(2); },
		'3': function () { stack.push(3); },
		'4': function () { stack.push(4); },
		'5': function () { stack.push(5); },
		'6': function () { stack.push(6); },
		'7': function () { stack.push(7); },
		'8': function () { stack.push(8); },
		'9': function () { stack.push(9); },
		'"': function () { cursolState = CursolState.Reading; },
		'&': function () { var n = Befunge.getANumber(); stack.push(n); },
		'~': function () { var c = Befunge.getAChar(); stack.push(c.charCodeAt(0)); },
		'.': function () { Befunge.Console.Output(stack.pop()); Befunge.Console.Output(" ") },
		',': function () { Befunge.Console.Output(String.fromCharCode(stack.pop())); },
		'+': function () { stack.push(stack.pop() + stack.pop()); },
		'-': function () { var y = stack.pop(); var x = stack.pop(); stack.push(x - y); },
		'*': function () { stack.push(stack.pop() * stack.pop()); },
		'/': function () { var y = stack.pop(); var x = stack.pop(); stack.push(Math.floor(x / y)); },
		'%': function () { var y = stack.pop(); var x = stack.pop(); stack.push(x % y); },
		'`': function () { stack.push(stack.pop() > stack.pop() ? 1 : 0); },
		'!': function () { stack.push(stack.pop() == 0 ? 1 : 0); },
		':': function () { var val = stack.pop(); stack.push(val); stack.push(val); },
		'\\': function () {var val1 = stack.pop(); var val2 = stack.pop(); stack.push(val1); stack.push(val2); },
		'$': function() { stack.pop(); },
		'g': function() { var y = stack.pop(); var x = stack.pop(); stack.push(getSrc(y, x).charCodeAt(0)); },
		'p': function() { var y = stack.pop(); var x = stack.pop(); var v = stack.pop(); setSrc(y, x, v); }
	}

	var previous;
	this.doAStep = function() {
		if (previous) {
			previous.setCurrent(false);
			for (var i = 0; i < getPutTemp.length; i ++) {
				getPutTemp[i].setGetPut(false);
			}
			getPutTemp = [];
		}
		var cbcNow = cbcList[cursol.y][cursol.x];
		cbcNow.setCurrent(true);
		var ret = doAStepIn(cbcNow);

		cursol.toNext();

		previous = cbcNow;
		if (ret == CursolState.Done) {
			return Befunge.BefungeCore.StepResult.Done;
		} else if (cbcList[cursol.y][cursol.x].hasBreak()) { // Next has breakpoint.
			return Befunge.BefungeCore.StepResult.Break;
		} else {
			return Befunge.BefungeCore.StepResult.Continue;
		}
	}
	function doAStepIn(cbcObj) {
		if (cursolState == CursolState.Normal) {
			var c = cbcObj.Char;
			cmdMap[c]();
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
		
		return cursolState;
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
Befunge.getAChar = function() {
	var obj = {
		f: function(value) {
			return value.length == 1;
			},
		label: "Input a char."
	};
	var dlg = window.showModalDialog("Parts/InputView.html", obj, "dialogWidth=180px; dialogHeight=10px;");
	return obj.Value;
}
Befunge.getANumber = function() {
	var obj = {
		f: function (value) {
			return ! isNaN(value);
		},
		label: "Input a dec value."
	};
	var dlg = window.showModalDialog("Parts/InputView.html", obj, "dialogWidth=180px; dialogHeight=10px;");
	return obj.Value;
}

Befunge.BefungeCore.StepResult = {
	Continue: 0,
	Done: 1,
	Break: 2
};
