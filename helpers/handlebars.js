module.exports = {
    toHumanDate: function(timestamp) {
        return new Date(timestamp);
    },
    json: function(context) {
      return JSON.stringify(context);
    }
};

