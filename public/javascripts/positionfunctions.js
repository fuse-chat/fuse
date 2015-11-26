// Adds methods to the Position object.
// For a description of this object see https://developer.mozilla.org/en-US/docs/Web/API/Position
var PositionFunctions = {};

/**
 * Helper function. Converts inputted degrees to radians.
 */
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

/**
 * Finds and returns the distance between the two positions
 * Returns distance in kilometers.
 * Code found in the following page:
 * http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 * See: https://en.wikipedia.org/wiki/Haversine_formula for description of haversine formula used
 * @param {Position} position1
 * @param {Position} position2
 * @return {number}
 */
PositionFunctions.distanceInKmBetween = function(position1, position2) {
  var R = 6371; // Radius of the earth in km
  var lat1 = position1.coords.latitude;
  var lat2 = position2.coords.latitude;
  var dLat = deg2rad(position1.coords.latitude-position2.coords.latitude);  // deg2rad below
  var dLon = deg2rad(position1.coords.longitude-position2.coords.longitude);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
};

/**
 * Finds and returns the distance between the two groups
 * input position
 * @param {Position} position1
 * @param {Position} position2
 * @return {number}
 */
PositionFunctions.distanceInMilesBetween = function(position1, position2) {
  var milesToKm = 0.621371;
  return this.distanceInKmBetween(position1, position2)*milesToKm;
};

/*
 * Determines if the two positions are with the maximum allowed distance.
 * @param {Position} position1
 * @param {Position} position2
 * @return {Boolean}
 */
PositionFunctions.isWithinMaxDist = function(position1, position2) {

};

if (typeof module !== 'undefined') {
  module.exports = PositionFunctions;
}
