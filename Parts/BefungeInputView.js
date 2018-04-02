Befunge.InputView = (function() {
  var div = document.createElement('div');
  var input = document.createElement('input', {id:"__input"});
  var label = document.createElement('label', {for:"__input"});
  var modalInput = document.createElement('div', {id:"div_overwraps"});
  modalInput.setAttribute("class", "modal-overwrap");
  div.appendChild(label);
  div.appendChild(input);
  modalInput.appendChild(div);

  function __cnst(caption) {
    that = {};
    label.textContent = caption;
    that._body = document.getElementsByTagName("body").item(0);

    //body.removeChild(modalInput);
    return that;
  }
  __cnst.prototype.show = function(eventOnInputPress) {
    input.onKeyPress = eventOnInputPress.bind(this);
    this._body.appendChild(modalInput);
  };
  __cnst.prototype.hide = function() {
    this._body.removeChild(modalInput);
  };

  return __cnst;
})();
