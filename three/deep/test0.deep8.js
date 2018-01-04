//---
game.init=function() {
  var blocks=[
    {x:4,y:0,z:-4,xw:1,yw:1,zw:8},
    {x:-5,y:0,z:-4,xw:1,yw:1,zw:8},
    {x:-4,y:0,z:-5,xw:8,yw:1,zw:1},
    {x:-4,y:0,z:4,xw:8,yw:1,zw:1}, 
  ];
  for (var i=0;i<blocks.length;i++) {
    var b=blocks[i];
    for (var z=b.z;z<b.z+b.zw;z++)
    for (var y=b.y;y<b.y+b.yw;y++)
    for (var x=b.x;x<b.x+b.xw;x++)
      deep.getR(z,y,x,1).block=1;
  }
  //var o0;
  
  loadObjsThenLoop([
  initpos({fn:'../shooter/objs/templar/o5.txt',pos:new THREE.Vector3(1.4,-1.8,0.00),animIdle:'stand2',animRun:'run',scale:0.0035    ,roty:0,onclick:click,orbitCenter:250,xw:1,yw:3,zw:1,x:0,y:0,z:0}),
  initpos({fn:'../shooter/objs/templar/o5.txt',pos:new THREE.Vector3(0,-1.8,0.00)  ,animIdle:'stand2',animRun:'run',scale:0.0035*1.5,roty:0,onclick:click,orbitCenter:250,xw:2,yw:4,zw:2,x:1,y:0,z:0}),
  ]);
}
//---
//fr o,1
//fr p,0,19
