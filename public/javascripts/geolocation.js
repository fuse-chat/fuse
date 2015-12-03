// client side
// geolocation.js
// - regularly get updates of current client's location
// - notify other components of the app when the user moves significant distances

const Geo = {};

Geo.getCurrentPosition = function(callback) {
  navigator.geolocation.getCurrentPosition(callback, null, {maximumAge: 1000*60*5}); // 2 mins. cache
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
Geo.updateGroupsOnChange = function(position, alertOnGroupChange = true) {
  if((previousPosition != null) && (previousPosition.coords.longitude == position.coords.longitude) &&
     (previousPosition.coords.latitude == position.coords.latitude)) { return; }
  previousPosition = position;
  if (G) {
    G.getAllGroupsOnServer(function(groups) {
      Geo.allGroupsWithinDistanceFromPos(groups, position, function(groupsList) {
        G.updateSidebar(groupsList, alertOnGroupChange);
      });
    });
  }
};

/*
 *
 *
 */
Geo.updateGroupsOnStartup = function() {
  Geo.getCurrentPosition(function(position) {
    Geo.updateGroupsOnChange(position, false);
  });
}

Geo.start = function() {
  navigator.geolocation.watchPosition(Geo.updateGroupsOnChange);
};

Geo.start();
