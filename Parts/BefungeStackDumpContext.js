Befunge.StackDump = function() {
	var dumpTable = document.getElementById("dump");
	var values = [];
	var lines = 0;
	clearRows(dumpTable);

	this.push = function(value) {
		var index = values.length;
		values.push(value);

		var col = index % 16;
		var row = (index - col) / 16;
		if (row + 1 > lines) {
			createNewDebugLine();
		}
		var id = getIdString(row + 1, col);
		var tdElm = document.getElementById(id);
		tdElm.innerHTML = value;
	}
	this.pop = function() {
		var ret = values.length == 0 ? 0 : values.pop();
		var index = values.length;

		var col = index % 16;
		var row = (index - col) / 16;
		var id = getIdString(row + 1, col);
		var tdElm = document.getElementById(id);
		if (tdElm) {
			tdElm.innerHTML = "";
			return ret;
		} else {
			return 0;
		}
	}

	function createNewDebugLine() {
		lines ++;
		var lineStr = format("0000", lines);

		var newRow = dumpTable.insertRow(-1);
		newRow.isCns = true;
		newRow.className = "Contents";
		newRow.appendChild(createElement("th", lineStr));
		for (var i = 0; i < 16; i ++) {
			newRow.appendChild(createElement("td", "?" , getIdString(lines, i)));
			if (i == 7) {
				newRow.appendChild(createElement("td", " "));
			}
		}

		function createElement(tag, innerHTML , id) {
			var temp = document.createElement(tag);
			temp.innerHTML = innerHTML;
			if (id) temp.id = id;
			return temp;
		}
	}

	// format: 0 fill => "00..0"
	function format(format, value) {
		return (format + value).slice(0 - format.length);
	}
	function getIdString(row, col) {
		return format("0000", row) + col;
	}

	function clearRows(table) {
		var list = table.rows;
		for (var i = list.length - 1; i >= 1; i --) {
			table.deleteRow(i);
		}
	}
}
