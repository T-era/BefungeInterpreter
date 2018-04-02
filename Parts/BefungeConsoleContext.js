Befunge.Console = new function() {
	var textArea;
	this.OnLoad = function(dom) {
		textArea = dom;
	}
	this.Output = function(arg) {
		textArea.value += arg;
	}
	this.Clear = function() {
		textArea.value = "";
	}
}();
