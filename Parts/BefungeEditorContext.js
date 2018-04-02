Befunge.Editor = new function() {
	var isEditing = false;
	var srcTextArea = document.createElement("textarea");
	var srcDiv;

	this.OnLoad = function(domSrcDiv) {
		srcDiv = domSrcDiv;
	}
	this.Switch = function() {
		if (isEditing) {
			this.Close();
		} else {
			Befunge.Debug.Stop();
			Open();
		}
	}
	this.GetSrcText = function() {
		return srcTextArea.value;
	}
	this.StopEdit = function() {
		this.Close();
	}
	function Open() {
		isEditing = true;
		clearChild(srcDiv);
		srcDiv.appendChild(srcTextArea);
	};
	this.Close = function() {
		if (isEditing) {
			isEditing = false;
			clearChild(srcDiv);
			this.cbcObj = Befunge.CharByChar(srcTextArea.value);
			ConvToShow(this.cbcObj);
		}
		function ConvToShow(cbcObj) {
			var frameDiv = document.createElement("div");
			for (var i = 0; i < cbcObj.length; i ++) {
				var aLine = cbcObj[i];
				for (var j = 0; j < aLine.length; j ++) {
					frameDiv.appendChild(aLine[j].DomObj);
				}
				frameDiv.appendChild(document.createElement("br"));
			}
			srcDiv.appendChild(frameDiv);
		}
	};
	function clearChild(dom) {
		var list = dom.childNodes;
		for (var i = list.length - 1; i >= 0; i --) {
			var child = list[i];
			dom.removeChild(child);
		}
	}
}();
