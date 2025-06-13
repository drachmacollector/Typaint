// Custom sidepanel logic for Typaint controls
window.addEventListener('DOMContentLoaded', function () {
  var typaint = new Typaint();
  typaint.initialize();

  // Controls
  var wordInput = document.getElementById('word-input');
  var textColorInput = document.getElementById('text-color');
  var bgColorInput = document.getElementById('bg-color');
  var minFontSizeInput = document.getElementById('min-font-size');
  var maxFontSizeInput = document.getElementById('max-font-size');
  var angleDistortionInput = document.getElementById('angle-distortion');
  var minFontSizeValue = document.getElementById('min-font-size-value');
  var maxFontSizeValue = document.getElementById('max-font-size-value');
  var angleDistortionValue = document.getElementById('angle-distortion-value');
  var clearBtn = document.getElementById('clear-btn');
  var saveBtn = document.getElementById('save-btn');
  var undoBtn = document.getElementById('undo-btn');
  var redoBtn = document.getElementById('redo-btn');

  // Set initial values from Typaint
  wordInput.value = typaint.text;
  textColorInput.value = typaint.textColor;
  bgColorInput.value = typaint.bgColor;
  minFontSizeInput.value = typaint.minFontSize;
  minFontSizeValue.value = typaint.minFontSize;
  maxFontSizeInput.value = typaint.maxFontSize;
  maxFontSizeValue.value = typaint.maxFontSize;
  angleDistortionInput.value = typaint.angleDistortion;
  angleDistortionValue.value = typaint.angleDistortion;

  // Word/text
  wordInput.addEventListener('input', function () {
    typaint.text = wordInput.value;
    typaint.onTextChange();
  });

  // Text color
  textColorInput.addEventListener('input', function () {
    typaint.applyNewColor(textColorInput.value);
  });

  // Background color
  bgColorInput.addEventListener('input', function () {
    typaint.setBackground(bgColorInput.value);
  });

  // Min font size (slider -> number)
  minFontSizeInput.addEventListener('input', function () {
    minFontSizeValue.value = minFontSizeInput.value;
    typaint.minFontSize = parseInt(minFontSizeInput.value, 10);
  });
  // Min font size (number -> slider)
  minFontSizeValue.addEventListener('input', function () {
    let val = parseInt(minFontSizeValue.value, 10);
    if (isNaN(val)) val = 3;
    val = Math.max(3, Math.min(100, val));
    minFontSizeValue.value = val;
    minFontSizeInput.value = val;
    typaint.minFontSize = val;
  });

  // Max font size (slider -> number)
  maxFontSizeInput.addEventListener('input', function () {
    maxFontSizeValue.value = maxFontSizeInput.value;
    typaint.maxFontSize = parseInt(maxFontSizeInput.value, 10);
  });
  // Max font size (number -> slider)
  maxFontSizeValue.addEventListener('input', function () {
    let val = parseInt(maxFontSizeValue.value, 10);
    if (isNaN(val)) val = 3;
    val = Math.max(3, Math.min(400, val));
    maxFontSizeValue.value = val;
    maxFontSizeInput.value = val;
    typaint.maxFontSize = val;
  });

  // Angle distortion (slider -> number)
  angleDistortionInput.addEventListener('input', function () {
    angleDistortionValue.value = angleDistortionInput.value;
    typaint.angleDistortion = parseFloat(angleDistortionInput.value);
  });
  // Angle distortion (number -> slider)
  angleDistortionValue.addEventListener('input', function () {
    let val = parseFloat(angleDistortionValue.value);
    if (isNaN(val)) val = 0;
    val = Math.max(0, Math.min(2, val));
    angleDistortionValue.value = val;
    angleDistortionInput.value = val;
    typaint.angleDistortion = val;
  });

  // Clear
  clearBtn.addEventListener('click', function () {
    typaint.clear();
  });

  // Save
  saveBtn.addEventListener('click', function () {
    typaint.save();
  });

  // Undo
  undoBtn.addEventListener('click', function () {
    typaint.undo();
  });

  // Redo
  redoBtn.addEventListener('click', function () {
    typaint.redo();
  });
}); 