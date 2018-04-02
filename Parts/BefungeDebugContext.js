Befunge.Debug = new function() {
	var core;
	this.Stop = function() {
		core = false;
	}
	this.Run = function() {
		StartExecute();
		InitDebug();

		do {
		} while(core.doAStep() != Befunge.BefungeCore.StepResult.Done);

		finish();
	};
	this.RunAStep = function() {
		if (core) {
		} else {
			StartExecute();
			InitDebug();
		}
		var ret = core.doAStep();
		if (ret == Befunge.BefungeCore.StepResult.Done) {
			finish();
		}
	};
	this.ToBreak = function() {
		if (core) {
		} else {
			StartExecute();
			InitDebug();
		}
		var stepRet;
		do {
			stepRet = core.doAStep();
		} while (stepRet != Befunge.BefungeCore.StepResult.Done && stepRet != Befunge.BefungeCore.StepResult.Break)
		if (stepRet == Befunge.BefungeCore.StepResult.Done) {
			finish();
		}
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
