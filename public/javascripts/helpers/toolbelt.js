(function() {
    // Establish the root object
    // Save the previous toolbelt variable
    // Create the toolbelt object
    var root = typeof self == 'object' && self.self === self && self ||
        typeof global == 'object' && global.global === global && global ||
        this;

    var previousToolbelt = root.toolbelt;

    const toolbelt = Object.create(null);

    // Node export v. Browser global
    // Inspired by underscore
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = toolbelt;
        }

        exports.toolbelt = toolbelt;
    } else {
        root.toolbelt = toolbelt;
    }

    /**
     * Restores the previous toolbelt variable
     * @return {Object} this reference
     */
    toolbelt.noConflict = function() {
       root.toolbelt = previousToolbelt;
       return this;
    };

    toolbelt.event = Object.create(null);

    toolbelt.event.stop = function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    };

    // AMD registration: http://requirejs.org/docs/whyamd.html
    // Copied from underscore
    if (typeof define == 'function' && define.amd) {
        define('toolbelt', [], function() {
          return toolbelt;
        });
      }
})();
