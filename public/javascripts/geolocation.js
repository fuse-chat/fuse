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

Geo.allGroupsWithinDistanceFromPos = function(groups, position, callback) {
  var groupsList = [];
  groups.forEach(function(group) {
    if(PositionFunctions.isWithinMaxDist(group.position, position)) {
      groupsList.push(group);
    }
  });
  callback(groupsList);
};

Geo.allGroupsWithinDistance = function(groups, callback) {
  Geo.getCurrentPosition(function(position) {
    Geo.allGroupsWithinDistanceFromPos(groups, position, callback);
  });
};

var previousPosition = null;
Geo.updateGroupsOnChange = function(position) {
  if((previousPosition != null) && (previousPosition.coords.longitude == position.coords.longitude) &&
     (previousPosition.coords.latitude == position.coords.latitude)) { return; }
  previousPosition = position;
  G.getAllGroupsOnServer(function(groups) {
    Geo.allGroupsWithinDistanceFromPos(groups, position, function(groupsList) {
      G.updateSidebar(groupsList);
    });
  });
};

/*
 *
 *
 */
Geo.updateGroupsOnStartup = function() {
  Geo.getCurrentPosition(function(position) {
    Geo.updateGroupsOnChange(position);
  });
}

Geo.start = function() {
  navigator.geolocation.watchPosition(Geo.updateGroupsOnChange);
};

Geo.start();
