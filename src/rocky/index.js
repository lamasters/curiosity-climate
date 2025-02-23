var rocky = require("rocky");

var weather = {
  high: 0,
  low: 0,
  pressure: 0,
  sunrise: "00:00",
  sunset: "00:00",
  sol: "0",
};

var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

rocky.on("draw", function (event) {
  var ctx = event.context;
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;

  var d = new Date();

  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "42px bold Bitham";
  ctx.fillText(
    (d.getHours() > 12 ? d.getHours() - 12 : d.getHours()) +
      ":" +
      (d.getMinutes() < 10 ? "0" : "") +
      d.getMinutes(),
    w / 2,
    0,
    w
  );
  ctx.font = "28px Gothic";
  ctx.fillText(
    days[d.getDay()] + " " + months[d.getMonth()] + " " + d.getDate(),
    w / 2,
    40,
    w
  );

  ctx.font = "18px bold Gothic";
  var offsetX = w / 2;
  var offsetY = 10;
  var orbitOffset = 10;
  var spacing = 16;

  // Adjust alignment if watchface is round
  if (rocky.watchInfo.platform == "chalk") {
    offsetY = 20;
    orbitOffset = 5;
    ctx.fillText("sol: " + weather.sol, offsetX, h - (offsetY + spacing), w);
    ctx.fillText(
      "day: " + weather.sunrise + "-" + weather.sunset,
      offsetX,
      h - (offsetY + spacing * 3),
      w
    );
  } else {
    ctx.fillText(
      "sol: " + weather.sol,
      offsetX,
      h - (offsetY + spacing * 3),
      w
    );
    ctx.fillText(
      "day: " + weather.sunrise + "-" + weather.sunset,
      offsetX,
      h - (offsetY + spacing),
      w
    );
  }
  ctx.fillText(
    "temp: " + weather.high + "/" + weather.low + " °C",
    offsetX,
    h - (offsetY + spacing * 2),
    w
  );

  var size = 8 + Math.sin((d.getMinutes() * 2 * Math.PI) / 60) * 6;
  var x = w / 2 - Math.cos((d.getMinutes() * 2 * Math.PI) / 60) * 40;
  if (Math.sin((d.getMinutes() * 2 * Math.PI) / 60) > 0) {
    ctx.fillStyle = "white";
    ctx.rockyFillRadial(w / 2, h / 2 + orbitOffset, 0, 18, 0, 2 * Math.PI);
    ctx.fillStyle = "#b51300";
    ctx.rockyFillRadial(x, h / 2 + orbitOffset, 0, size, 0, 2 * Math.PI);
  } else {
    ctx.fillStyle = "#b51300";
    ctx.rockyFillRadial(x, h / 2 + orbitOffset, 0, size, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.rockyFillRadial(w / 2, h / 2 + orbitOffset, 0, 18, 0, 2 * Math.PI);
  }
});

rocky.on("minutechange", function (event) {
  rocky.requestDraw();
});

rocky.on("hourchange", function (event) {
  rocky.postMessage({ fetch: true });
});

rocky.on("message", function (event) {
  var message = event.data;
  if (message.weather) {
    weather = message.weather;
    rocky.requestDraw();
  }
});
