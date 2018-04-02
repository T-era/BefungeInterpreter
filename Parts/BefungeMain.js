var Befunge = {
};

Befunge.OnLoad = function() {
	Befunge.ResizeWindow();
	Befunge.Editor.OnLoad(document.getElementById("source"));
	Befunge.Help.OnLoad(document.getElementById("HelpDiv"));
	Befunge.Console.OnLoad(document.getElementById("consoleView"));
}

Befunge.ResizeWindow = function() {
	ResizeDiv("Top", "console", "header");
	ResizeDiv("in", "source", "buttons");

	function ResizeDiv(outId, targetId, fixedId) {
		var outDiv = document.getElementById(outId);
		var targetDiv = document.getElementById(targetId);
		var fixedDiv = document.getElementById(fixedId);

		targetDiv.style.height = (outDiv.clientHeight - fixedDiv.clientHeight - 5) + "px";
	}
}
