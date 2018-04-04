
/// returns object as { Char, DomObj }.
Befunge.CharByChar = function(source) {
	var list = [];
	list.Source = source;

	var sourceLines = source.split('\n');
	for (var i = 0; i < sourceLines.length; i ++) {
		var aLineSrc = sourceLines[i];
		var aLine = [];
		for (var j = 0; j < aLineSrc.length; j ++) {
			var charCode = aLineSrc.charCodeAt(j);
			aLine.push(new Befunge.CbCObj(charCode));
		}
		list.push(aLine);
	}
	return list;
}
Befunge.CbCObj = function(charCode) {
	var c = String.fromCharCode(charCode);
	var dom = document.createElement("div");
	var _hasBreak = false;
	this.SetChar = function(charCode) {
		var c = String.fromCharCode(charCode);
		if (charCode <= 32 || charCode > 127) {
			dom.innerHTML = "&nbsp;";
		} else {
			dom.innerHTML = c;
		}
		this.Char = c;
		this.CharCode = charCode;
	}

	this.SetChar(charCode);
	dom.className = "CharByChar";
	dom.onclick = function() {
		if (_hasBreak) {
			_hasBreak = false;
		} else {
			_hasBreak = true;
		}
		setClassName();
	}
	this.hasBreak = function() { return _hasBreak; }
	this.DomObj = dom;
	var isCurrent = false;
	this.setCurrent = function(b) {
		isCurrent = b;
		setClassName();
	}
	var isNowGetPut = false;
	this.setGetPut = function(b) {
		isNowGetPut = b;
		setClassName();
	}
	function setClassName() {
		dom.className = "CharByChar";
		if (_hasBreak) {
			dom.className += " BackGround_Break";
		} else {
			dom.className += " BackGround_Normal";
		}
		if (isCurrent) {
			dom.className += " ForeGround_Current";
		} else {
			dom.className += " ForeGround_Normal";
		}
		if (isNowGetPut) {
			dom.className += " Frame_GetPut";
		} else {
			dom.className += " Frame_Normal";
		}
	}
	setClassName();
}
