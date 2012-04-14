var AnimationFrame = now.type('AnimationFrame', {
    inherit: Entity,
    required: "image sx sy sw sh",
});

var Animation = now.type('Animation', {
    inherit: Entity,
    required: "frames rate",
});

var RunningAnimation = now.type('RunningAnimation', {
    inherit: Entity,
    required: "animation started runningtime",
});

