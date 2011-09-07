function V(x, y) {
    this.push(x);
    this.push(y);
}
V.prototype = new Array();
V.prototype.add = function(b) {
    return new V(this[0] + b[0], this[1] + b[1]);
};
V.prototype.getLength = function() {
    var length_sqr = this[0]*this[0] + this[1]*this[1] // + this[2]*this[2]
    ,   length = Math.sqrt(length_sqr)
    ;

    return length;
};
V.prototype.normal = function() {
    var n = 1 / this.getLength();

    return new V(this[0] * n, this[1] * n, this[2] * n);
};
V.prototype.multiply = function(n) {
    return new V(this[0] * n, this[1] * n, this[2] * n);
};
