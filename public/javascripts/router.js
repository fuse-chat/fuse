const R = {};

/**
 * Returns the current path as an array of components
 * @return {Array<string>}
 */
R.currentPath = function() {
    return window.document.location.pathname.split(/\//).filter(function(c) {
        return !_.isEmpty(c);
    });
};
