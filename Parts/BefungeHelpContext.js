Befunge.Help = new function() {
	var div;

	this.OnLoad = function(domDiv) {
		div = domDiv;
	}
	this.Open = function() {
		var helpButton = document.getElementById("HelpButton");
		div.style.position = "absolute";
		div.style.display = "block";
		div.style.top = helpButton.offsetTop + "px";
		div.style.left = helpButton.offsetLeft + "px";
	};
	this.Close = function() {
		div.style.display = "none";
	};
}();
