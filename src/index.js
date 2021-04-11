import { canvasNoise } from "./modules/canvas-noise";
import { Size, Point } from "./modules/objects";

var c = document.getElementById("c");
var ctx = c.getContext("2d");
var dims = new Size(600, 840);
var scale = window.devicePixelRatio || 1;
var things = [];

var defaults = {
  width: 14,
  height: 32,
  margin_left: 40,
  margin_top: 28,
  padding: 50,
  line_ratio: 0.95,
  shape_ratio: 0.6,
};
var colorIdx = 0;

function init() {
  setDims(dims);
  // 1200 1680
  setBG();
  things = gen();
  canvasNoise(dims.width / 5, dims.height / 5, scale, 0.04, "c"); // canvas noise by white vinyl

  ctx.strokeStyle = "#424D50";

  draw();
}

function setBG() {
  var bgColors = ["#9FC8DD", "#E2DB98", "#BBD8B1", "#CEBBC5"];

  c.style.backgroundColor = bgColors[colorIdx];
  colorIdx++;

  if (colorIdx >= bgColors.length) colorIdx = 0;
}

function dl() {
  var downloadLink = document.getElementById("downloadLink");

  downloadLink.href = c.toDataURL("image/png");
  downloadLink.download = "ruth.png";
}

function setDims(size) {
  c.width = size.width * scale;
  c.height = size.height * scale;
  c.style.width = size.width + "px";
  c.style.height = size.height + "px";
  ctx.scale(scale, scale);
}

function gen() {
  var output = [];

  var totalWidth = defaults.width + defaults.margin_left;
  var totalHeight = defaults.height + defaults.margin_top;

  var rowSize = Math.floor((dims.width - defaults.padding * 2) / totalWidth);
  var colSize = Math.floor(
    (dims.height - defaults.padding * 2) / (totalHeight / 2)
  );

  var offsetX = Math.floor((dims.width - totalWidth * rowSize) / 2);
  var offsetY = Math.floor((dims.height - (totalHeight / 2) * colSize) / 2);

  for (var ii = 0; ii < colSize; ii++) {
    for (var jj = 0; jj < rowSize; jj++) {
      if ((ii % 2 === 0 && jj % 2 === 0) || (ii % 2 !== 0 && jj % 2 !== 0)) {
        var randomFloat = Math.random();
        output.push(
          new Thing({
            pos: new Point(
              offsetX + jj * totalWidth + totalWidth / 2,
              offsetY + (ii * totalHeight) / 2
            ),
            size: new Size(
              defaults.width + Math.floor(randomFloat * 6),
              defaults.height
            ),
            type: Math.floor(Math.random() * 3) < 1 ? "circle" : "triangle",
            rotation: Math.floor(Math.random() * 2) * 180,
            weight: Math.floor(1 + randomFloat * (6 - 1)),
          })
        );
      }
    }
  }

  return output;
}

function Thing(props) {
  var me = this;

  me.pos = new Point(props.pos.x, props.pos.y);
  me.size = new Size(props.size.width, props.size.height);
  me.type = props.type;
  me.rotation = props.rotation;
  me.weight = props.weight;

  (me.lineStart = new Point(
    me.pos.x,
    me.pos.y + me.size.height * (1 - defaults.line_ratio)
  )),
    (me.lineEnd = new Point(me.pos.x, me.pos.y + me.size.height));

  me.shapeSize = new Size(me.size.width, me.size.height * defaults.shape_ratio);
  me.shapeRandomOffsetX = Math.random() * 2 - 1;
  me.shapePos = new Point(
    me.lineStart.x + me.shapeRandomOffsetX,
    me.lineStart.y
  );

  me.draw = function () {
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(me.lineStart.x, me.lineStart.y);
    ctx.lineTo(me.lineEnd.x, me.lineEnd.y);
    ctx.stroke();

    ctx.lineWidth = me.weight;

    switch (me.type) {
      case "triangle":
        ctx.setTransform(
          scale,
          0,
          0,
          scale,
          me.shapePos.x * scale,
          me.shapePos.y * scale
        );
        ctx.rotate((me.rotation * Math.PI) / 180);

        ctx.beginPath();
        ctx.moveTo(-me.shapeSize.width / 2, me.shapeSize.height / 2); // left bottom corner
        ctx.lineTo(
          -me.shapeSize.width / 2 + me.shapeSize.width,
          me.shapeSize.height / 2
        );
        ctx.lineTo(0, -me.shapeSize.height / 2);
        ctx.closePath();
        ctx.stroke();

        ctx.setTransform(scale, 0, 0, scale, 0, 0);

        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(me.shapePos.x, me.shapePos.y, me.size.width, 0, 2 * Math.PI);
        ctx.stroke();

        break;
    }
  };
}

function draw() {
  things.forEach((t) => {
    t.draw();
  });
}

window.onclick = init;
window.onload = init;
