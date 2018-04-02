Befunge.Debug = new function() {
	var core;

	this.Stop = function() {
		core = false;
	}

	this.Run = function() {
		StartExecute();
		InitDebug();

		core.doAStep(function _handler(resPrev) {
			if (resPrev != Befunge.BefungeCore.StepResult.Done) {
				core.doAStep(_handler);
			} else {
				finish();
			}
		});
	};
	this.RunAStep = function() {
		if (core) {
		} else {
			StartExecute();
			InitDebug();
		}

		core.doAStep(function (ret) {
			if (ret == Befunge.BefungeCore.StepResult.Done) {
				finish();
			}
		});
	};
	this.ToBreak = function() {
		if (core) {
		} else {
			StartExecute();
			InitDebug();
		}
		core.doAStep(function _handler(resPrev) {
			if (resPrev == Befunge.BefungeCore.StepResult.Done) {
				finish();
			} else if (resPrev == Befunge.BefungeCore.StepResult.Break) {
			} else {
				core.doAStep(_handler);
			}
		});
	};

	function StartExecute() {
		Befunge.Editor.StopEdit();
	}
	function InitDebug() {
		core = new Befunge.BefungeCore(Befunge.Editor.cbcObj);
		Befunge.Console.Clear();
	}
	function finish() {
		core = false;
		alert("Done");
	}
}();
