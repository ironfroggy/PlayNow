now.inherit = function(child, base, attributes) {
    child.prototype = new base();
    child.prototype.constuctor = child;

    for (attribute_name in attributes) {
        child.prototype[attribute_name] = attributes[attribute_name];
    }
};


