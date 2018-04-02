(function() {
  document.addEventListener('DOMContentLoaded', function() {
    Befunge.InputView = new _inputView();

    function _inputView() {
      this._body = document.getElementsByTagName('body')[0];
      this._input = document.createElement('input');
    }

    _inputView.prototype.inputNumber = function(inputThen) {
      listenKeyThen(this, function(val) {
        if (! isNaN(val)) {
          return null;
        } else {
          return 'Input a dec value.'
        }
      }, inputThen);
    }
    _inputView.prototype.inputChar = function(inputThen) {
      listenKeyThen(this, function(val) {
        return null;
      }, inputThen);
    }
    function listenKeyThen(that, validate, inputThen) {
      that._body.appendChild(that._input);

      that._input.onkeypress = function(event) {
        var val = event.key;
        var msg = validate(val);
        if (! msg) {
          that._body.removeChild(that._input)
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
