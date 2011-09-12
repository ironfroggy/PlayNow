now.type = function(params) {
    constructor = function() {
        params.init.apply(this, arguments);
    };
    constructor.prototype = new params.inherit();
    constructor.prototype.constructor = constructor
    for (param in params) {
        constructor.prototype[param] = params[param];
    }
    return constructor;
};
