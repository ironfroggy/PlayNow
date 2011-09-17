(function(now){
    var default_type_params = {
        toString: function() {
            return "<"+this.constructor.__name__ +" instance>";
        }
    };

    now.type = function(name, params) {
        var inherit = params.inherit || Object;

        constructor = function() {
            params.init.apply(this, arguments);
        };
        constructor.prototype = new inherit();
        constructor.prototype.constructor = constructor
        constructor.__name__ = name;
        constructor.toString = function() {
            return "<"+ name +" constructor>";
        }

        for (param in default_type_params) {
            constructor.prototype[param] = default_type_params[param];
        }
        for (param in params) {
            constructor.prototype[param] = params[param];
        }
        return constructor;
    };
})(now);
