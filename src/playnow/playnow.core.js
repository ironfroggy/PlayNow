if (typeof now === 'undefined') {var now = {}; }

now.update = function() {
    var first, current, propname;
    first = Array.prototype.splice.call(arguments, 0, 1)[0];
    while (arguments.length > 0) {
        current = Array.prototype.splice.call(arguments, 0, 1)[0];
        for (propname in current) {
            if (current.hasOwnProperty(propname)) {
                first[propname] = current[propname];
            }
        }
    }
    return first;
};
