Pebble.on("message", function (event) {
  var message = event.data;

  if (message.fetch) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var response = JSON.parse(this.responseText);
      if (response.documents) {
        var weather = response.documents[0];
        Pebble.postMessage({
          weather: {
            high: weather.max_temp,
            low: weather.min_temp,
            pressure: weather.pressure,
            sunrise: weather.sunrise,
            sunset: weather.sunset,
            sol: weather.sol,
          },
        });
      }
    };
    xhr.open(
      "GET",
      "https://cloud.appwrite.io/v1/" +
        "databases/6689a86c002a9fb1b740/" +
        "collections/6689a86f001b93c155ac/documents" +
        "?project=67cc9f770031b2c18340" +
        "&queries[0]=%7B%22method%22:%22limit%22,%22values%22:[1]%7D" +
        "&queries[1]=%7B%22method%22:%22orderDesc%22,%22attribute%22:%22$createdAt%22%7D"
    );
    xhr.send();
  }
});
