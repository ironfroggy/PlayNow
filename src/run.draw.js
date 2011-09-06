function DrawDemo() {
    
}
DrawDemo.prototype = new Scene();


DrawDemo.prototype['onmouse.drag'] = function(e, coord, fromcoord) {
    var ctx = this.get('viewport').get('ctx');
    ctx.fillStyle = "red";
    ctx.moveTo(fromcoord[0], fromcoord[1]);
    ctx.lineTo(coord[0], coord[1]);
    ctx.stroke();
}

scene = new DrawDemo();
