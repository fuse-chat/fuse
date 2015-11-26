// client side
// geolocation.js
// - regularly get updates of current client's location
// - notify other components of the app when the user moves significant distances

const Geo = {};

Geo.getCurrentPosition = function(callback) {
  navigator.geolocation.getCurrentPosition(callback);
};

Geo.groupWithinDistance = function(group, callback) {
  this.getCurrentPosition(function(position) {
    callback(PositionFunctions.isWithinMaxDist(group.position, position));
  });
};

navigator.geolocation.getCurrentPosition(function (position) {
    console.log(position);
});
