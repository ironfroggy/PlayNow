function EventHandling() {
}
EventHandling.prototype.bind = function(eventname, callback) {
    if (typeof this.__event_handlers === 'undefined') {
        this.__event_handlers = {};
    }
    if (typeof this.__event_handlers[eventname] === 'undefined') {
        this.__event_handlers[eventname] = [];
    }
    this.__event_handlers[eventname].push(callback);
}

EventHandling.prototype.trigger = function (eventname) {
    var args = Array.prototype.slice.call(arguments, 1, arguments.length)
    ,   event_name_parts = eventname.split(".")
    ;
    args.unshift(eventname);

    for (var i=1, l=event_name_parts.length; i<=l; i++) {
        if (eventname.indexOf('foo') >= 0)
            console.log(i, event_name_parts.slice(0, i).join('.'));
        trigger_specific.call(this, event_name_parts.slice(0, i).join('.'));
    }

    function trigger_specific(specific_eventname) {
        if (typeof this.__event_handlers !== 'undefined' && typeof this.__event_handlers[specific_eventname] !== 'undefined') {
            for (var i=0,l=this.__event_handlers[specific_eventname].length; i<l; i++) {
                this.__event_handlers[specific_eventname][i].apply(this, args);
            }
        }
        var default_handler = this['on'+specific_eventname];
        if (typeof default_handler === 'function') {
            default_handler.apply(this, args);
        }
    }
}
