// client side
// toolbelt.js
// - client side utitlity library

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
    toolbelt.base = Object.create(null);

    toolbelt.event.stop = function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    };

    toolbelt.normalize = function(obj, normal) {
        obj = _.clone(obj);

        Object.keys(normal).forEach(function(key) {
            if (defines.DEBUG && !Object.hasOwnProperty(key)) {
                console.warn(`expected key: ${key} missing in object:`, obj)
            }

            if (obj[key] == null) {
                obj[key] = normal[key];
            }
        });

        return obj;
    };

    toolbelt.assert = function(cond, str) {
        if (defines.DEBUG) {
            if (!cond) {
                throw new Error(str);
            }
        }
    };

    // AMD registration: http://requirejs.org/docs/whyamd.html
    // Copied from underscore
    if (typeof define == 'function' && define.amd) {
        define('toolbelt', [], function() {
          return toolbelt;
        });
      }
})();
