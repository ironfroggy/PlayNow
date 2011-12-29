function Event(name) {
    this.name = name;
}
Event.prototype.toString = function() {
    return this.name;
};

function EventHandling() {}

(function() {

    EventHandling.prototype.bind = function(eventnames, callback, defaults) {
        var i, l=eventnames.length, eventname;
        if (typeof eventnames === 'string') {
            eventnames = eventnames.split(' ');
        }

        if (typeof this.__event_handlers === 'undefined') {
            this.__event_handlers = {};
        }

        if (typeof defaults !== 'undefined') {
            var original_callback = callback;
            var callback = function() {
                var i;
                var args = [arguments[0]];
                for (i=0; i < defaults.length; i++) {
                    args.push(defaults[i]);
                }
                for (i=1; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                original_callback.apply(this, args);
            }
        }

        for (i=0; i < l; i++) {
            eventname = eventnames[i];
            if (typeof this.__event_handlers[eventname] === 'undefined') {
                this.__event_handlers[eventname] = [];
            }

            if (typeof this.__event_flags !== 'undefined') {
                if (this.__event_flags[eventname] instanceof Array) {
                    var args = Array.prototype.slice.call(arguments, 1, arguments.length);
                    args.unshift(eventname);
                    callback.apply(this, args);
                    return
                }
            }
            this.__event_handlers[eventname].push(callback);
        }
    }

    EventHandling.prototype.unbind = function(eventname, callback) {
        if (typeof this.__event_handlers === 'undefined') {
            return 0;
        }
        if (typeof this.__event_handlers[eventname] === 'undefined') {
            return 0;
        }
        var r = 0;
        for (var i=0, l=this.__event_handlers[eventname].length; i<l; i++) {
            var reg_callback = this.__event_handlers[eventname][i];
            if (!callback || reg_callback === callback) {
                this.__event_handlers[eventname].splice(i, 1);
                r += 1;
            }
        }
        return r;
    }

    EventHandling.prototype.bindonce = function (eventname, callback, defaults) {
        if (typeof this.__event_flags === 'undefined') {
            this.__event_flags = {};
        }

        this.__event_flags[eventname] = false;
        this.bind(eventname, callback || function(){}, defaults);
    };

    EventHandling.prototype.trigger = function (e) {
        var args = Array.prototype.slice.call(arguments, 1, arguments.length)
        ,   eventname = e instanceof Event ? e.name : e
        ,   event_name_parts = eventname.split(".")
        ,   e = e instanceof Event ? e : new Event(e)
        ,   i, l
        ;
        args.unshift(e);

        if (typeof this.__event_flags !== 'undefined') {
            if (this.__event_flags[eventname] instanceof Array) {
                return;
            } else if (this.__event_flags[eventname] === false) {
                this.__event_flags[eventname] = args;
            }
        }

        l = event_name_parts.length;
        trigger_specific.call(this, '');
        if (eventname !== '') {
            for (i=1; i<=l; i++) {
                trigger_specific.call(this, event_name_parts.slice(0, i).join('.'));
            }
        }

        function trigger_specific(specific_eventname) {
            var i, l;
            if (typeof this.__event_handlers !== 'undefined' && typeof this.__event_handlers[specific_eventname] !== 'undefined') {
                for (i=0,l=this.__event_handlers[specific_eventname].length; i<l; i++) {
                    this.__event_handlers[specific_eventname][i].apply(this, args);
                }
            }
            var default_handler = this['on'+specific_eventname];
            if (typeof default_handler === 'function') {
                default_handler.apply(this, args);
            }
        }

        return e;
    }

})();
