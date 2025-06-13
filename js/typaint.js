function Typaint() {
  var _this = this;

  // Application variables
  position = { x: 0, y: window.innerHeight / 2 };
  textIndex = 0;
  this.textColor = "#000000";
  this.bgColor = "#ffffff";
  this.minFontSize = 8;
  this.maxFontSize = 300;
  this.angleDistortion = 0.01;

  var strokes = [];
  var redoStack = [];
  var currentStroke = null;

  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var urlText = urlParams.get('text')

  this.text = urlText || 
    "My name is Yoshikage Kira. I'm 33 years old. My house is in the northeast section of Morioh, where all the villas are, and I am not married. I work as an employee for the Kame Yu department stores, and I get home every day by 8 PM at the latest. I don't smoke, but I occasionally drink. I'm in bed by 11 PM, and make sure I get eight hours of sleep, no matter what. After having a glass of warm milk and doing about twenty minutes of stretches before going to bed, I usually have no problems sleeping until morning. Just like a baby, I wake up without any fatigue or stress in the morning. I was told there were no issues at my last check-up. I'm trying to explain that I'm a person who wishes to live a very quiet life. I take care not to trouble myself with any enemies, like winning and losing, that would cause me to lose sleep at night. That is how I deal with society, and I know that is what brings me happiness. Although, if I were to fight I wouldn't lose to anyone.";

  // Drawing Variables
  canvas = null;
  context = null;
  mouse = { x: 0, y: 0, down: false };

  bgCanvas = null;
  bgContext = null;

  this.initialize = function () {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.addEventListener("mousemove", onMove, false);
    canvas.addEventListener("mousedown", onDown, false);
    canvas.addEventListener("mouseup", onUp, false);
    canvas.addEventListener("mouseout", onUp, false);

    canvas.addEventListener("touchstart", onDown, false);
    canvas.addEventListener("touchmove", onMove, false);
    canvas.addEventListener("touchend", onUp, false);
    canvas.addEventListener("touchcancel", onUp, false);

    bgCanvas = document.createElement("canvas");
    bgContext = bgCanvas.getContext("2d");
    bgCanvas.width = canvas.width;
    bgCanvas.height = canvas.height;
    _this.setBackground(_this.bgColor);

    window.onresize = function (event) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
      _this.setBackground(_this.bgColor);
      _this.clear();
    };

    update();
  };

  var update = function () {
    requestAnimationFrame(update);
    draw();
  };

  var draw = function () {
    if (mouse.down) {
      var newDistance = distance(position, mouse);
      var fontSize = _this.minFontSize + newDistance / 2;

      if (fontSize > _this.maxFontSize) {
        fontSize = _this.maxFontSize;
      }

      var letter = _this.text[textIndex];
      var stepSize = textWidth(letter, fontSize);

      if (newDistance > stepSize) {
        var angle = Math.atan2(mouse.y - position.y, mouse.x - position.x);

        context.font = fontSize + "px Georgia";
        context.fillStyle = _this.textColor;

        context.save();
        context.translate(position.x, position.y);
        context.rotate(
          angle +
            (Math.random() * (_this.angleDistortion * 2) -
              _this.angleDistortion)
        );
        context.fillText(letter, 0, 0);
        context.restore();

        // Save this action to the current stroke
        if (currentStroke) {
          currentStroke.push({
            x: position.x,
            y: position.y,
            fontSize: fontSize,
            angle: angle,
            letter: letter,
            textColor: _this.textColor,
            angleDistortion: _this.angleDistortion
          });
        }

        textIndex++;
        if (textIndex > _this.text.length - 1) {
          textIndex = 0;
        }

        position.x = position.x + Math.cos(angle) * stepSize;
        position.y = position.y + Math.sin(angle) * stepSize;
      }
    }
  };

  var redrawAllStrokes = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < strokes.length; i++) {
      var stroke = strokes[i];
      for (var j = 0; j < stroke.length; j++) {
        var action = stroke[j];
        context.font = action.fontSize + "px Georgia";
        context.fillStyle = action.textColor;
        context.save();
        context.translate(action.x, action.y);
        context.rotate(action.angle + (Math.random() * (action.angleDistortion * 2) - action.angleDistortion));
        context.fillText(action.letter, 0, 0);
        context.restore();
      }
    }
  };

  var distance = function (pt, pt2) {
    var xs = 0;
    var ys = 0;

    xs = pt2.x - pt.x;
    xs = xs * xs;

    ys = pt2.y - pt.y;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
  };

  var onDown = function (event) {
    const eventObject = event.touches && event.touches.item(0) || event
    mouse.down = true;
    position.x = eventObject.pageX;
    position.y = eventObject.pageY;
    mouse.x = eventObject.pageX;
    mouse.y = eventObject.pageY;
    // Start a new stroke
    currentStroke = [];
    strokes.push(currentStroke);
    // Clear redo stack on new draw
    redoStack.length = 0;
  };

  var onUp = function () {
    mouse.down = false;
    currentStroke = null;
  };

  var onMove = function (event) {
    const eventObject = event.touches && event.touches.item(0) || event
    mouse.x = eventObject.pageX;
    mouse.y = eventObject.pageY;
    draw();
  };

  var textWidth = function (string, size) {
    context.font = size + "px Georgia";

    if (context.fillText) {
      return context.measureText(string).width;
    } else if (context.mozDrawText) {
      return context.mozMeasureText(string);
    }
  };

  this.clear = function () {
    canvas.width = canvas.width;
    context.fillStyle = _this.textColor;
    strokes.length = 0;
    currentStroke = null;
    redoStack.length = 0;
  };

  this.undo = function () {
    if (strokes.length > 0) {
      var popped = strokes.pop();
      if (popped) {
        redoStack.push(popped);
      }
      redrawAllStrokes();
    }
  };

  this.redo = function () {
    if (redoStack.length > 0) {
      var restored = redoStack.pop();
      if (restored) {
        strokes.push(restored);
        redrawAllStrokes();
      }
    }
  };

  this.applyNewColor = function (value) {
    _this.textColor = value;
    context.fillStyle = _this.textColor;
  };

  this.setBackground = function (value) {
    _this.bgColor = value;
    canvas.style.backgroundColor = value;
  };

  this.onTextChange = function () {
    textIndex = 0;
  };

  this.save = function () {
    // Prepare the background canvas's color
    bgContext.rect(0, 0, bgCanvas.width, bgCanvas.height);
    bgContext.fillStyle = _this.bgColor;
    bgContext.fill();

    // Draw the front canvas onto the bg canvas
    bgContext.drawImage(canvas, 0, 0);

    // Open in a new window
    window.open(bgCanvas.toDataURL("image/png"), "mywindow");
  };
}
