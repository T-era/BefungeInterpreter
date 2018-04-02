(function() {
  document.addEventListener('DOMContentLoaded', function() {
    Befunge.InputView = new _inputView();

    function _inputView() {
      this._body = document.getElementsByTagName('body')[0];
      this._input = document.createElement('input', {id:"__input"});
      this._label = document.createElement('label', {for:"__input"});

      var div = document.createElement('div');
      this._modalInput = document.createElement('div', {id:"div_overwraps"});
      this._modalInput.setAttribute("class", "modal-overwrap");
      div.appendChild(this._label );
      div.appendChild(this._input);
      this._modalInput.appendChild(div);
    }

    _inputView.prototype.inputNumber = function(inputThen) {
      this._label.textContent = 'Input a numeric char :';
      listenKeyThen(this, function(val) {
        if (! isNaN(val)) {
          return null;
        } else {
          return 'Input a dec value.'
        }
      }, inputThen);
    }
    _inputView.prototype.inputChar = function(inputThen) {
      this._label.textContent = 'Input a ascii char :';
      listenKeyThen(this, function(val) {
        return null;
      }, inputThen);
    }
    function listenKeyThen(that, validate, inputThen) {
      that._body.appendChild(that._modalInput);

      that._input.onkeypress = function(event) {
        var val = event.key;
        var msg = validate(val);
        if (! msg) {
          that._body.removeChild(that._modalInput)
          inputThen(val);
        } else {
          setTimeout(function() {
            that._input.value = ''; //('value', '');
          }, 0);
          alert(msg);
        }
      };
    }
  });
})();
