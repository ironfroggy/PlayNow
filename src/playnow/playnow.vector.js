function V(x, y) {
    this[0] = x;
    this[1] = y;
    this.x = x;
    this.y = y;
}
V.prototype = new Array();
V.prototype.add = function(b) {
    return new V(this[0] + b[0], this[1] + b[1]);
};
V.prototype.subtract = function(b) {
    return new V(this[0] - b[0], this[1] - b[1]);
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


function R(x, y, w, h) {
    V.call(this, x, y);
    this[2] = w;
    this[3] = h;
    this.w = w;
    this.h = h;
};
R.prototype = new V(0, 0);
R.prototype.intersects = function(b) {
    if (b instanceof R) {
        return (!(
            this[0] > (b[0]+b[2]) ||
            this[0]+this[2] < b[0] ||
            this[1] > (b[1]+b[3]) ||
            this[1]+this[3] < b[1]
        ));
    } else if (b instanceof V) {
        return (!(
            this.x > b.x ||
            this.x + this.w < b.x ||
            this.y > b.y ||
            this.y + this.h < b.y
        ));
    } else {
        var i=0, l=b.length, c=[];
        for (; i<l; i++) {
            if (this.is_in(b[i])) {
                c.push(b[i]);
            }
        }
        return c;
    }
};
