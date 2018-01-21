//---
game.init=function() {
  
  parties=[
      {bbcol:[150,100,0],col:'#f90'},
      {bbcol:[0,100,200],col:'#0cf',ai:1}];
  
  
  var blocks=[
    //{x:4,y:0,z:-4,xw:1,yw:1,zw:8},
    //{x:-5,y:0,z:-4,xw:1,yw:1,zw:8},
    //{x:-4,y:0,z:-5,xw:8,yw:1,zw:1},
    //{x:-4,y:0,z:4,xw:8,yw:1,zw:1}, 
    {x:-4,y:0,z:-4,xw:3,yw:5,zw:8},
    {x:0,y:0,z:-4,xw:4,yw:5,zw:8},
    {x:-1,y:0,z:-4,xw:1,yw:4,zw:4},
    {x:-1,y:0,z:1,xw:1,yw:4,zw:3},
    
    {x:-9,y:0,z:-2,xw:5,yw:3,zw:1},
    {x:-9,y:0,z:-6,xw:1,yw:3,zw:4},
    {x:-9,y:0,z:-7,xw:7,yw:3,zw:1},
    {x:-3,y:0,z:-6,xw:1,yw:3,zw:2},
  ];
  for (var i=0;i<blocks.length;i++) {
    var b=blocks[i];
    for (var z=b.z;z<b.z+b.zw;z++)
    for (var y=b.y;y<b.y+b.yw;y++)
    for (var x=b.x;x<b.x+b.xw;x++) {
      var g=deep.getR(z,y,x,1);
      //g.block=1;
      //g.dbg=1;
      g.wview=1;
    }
  }
  //console.log(dum1geometry);
  //var o0;
  
  function templar(h) {
    Pd5.hcopy({fn:'../shooter/objs/templar/o5.txt'
      ,animIdle:'stand2',animRun:'run',animAttack:'attack2',animHit:'hit',animLost:'lost' 
      ,roty:0,onclick:click,orbitCenter:250}
      ,h,undefined,undefined,1);
    return h;
  }
  
  loadObjsThenLoop([
  //initpos({fn:'../shooter/objs/templar/o5.txt',pos:new THREE.Vector3(1.4,-1.8,0.00)
  //  ,animIdle:'stand2',animRun:'run',animAttack:'attack2',animHit:'hit' 
  //  ,scale:0.0035    ,roty:0,onclick:click,orbitCenter:250,xw:1,yw:3,zw:1,x:0,y:0,z:0,health:4,mhealth:5}),
  initpos(templar({pos:new THREE.Vector3(1.4,-1.8,0.00),scale:0.0035    ,xw:1,yw:3,zw:1,x:0 ,y:0,z:2,ap:1,health:5,mhealth:5,party:0})),
  initpos(templar({pos:new THREE.Vector3(1.4,-1.8,0.00),scale:0.0035    ,xw:1,yw:3,zw:1,x:-4 ,y:0,z:-4,ap:1,health:5,mhealth:5,party:0})),
  //initpos(templar({pos:new THREE.Vector3(1.4,-1.8,0.00),scale:0.0035    ,xw:1,yw:3,zw:1,x:2 ,y:0,z:2,ap:1,health:5,mhealth:5,party:0})),
  initpos(templar({pos:new THREE.Vector3(0,-1.8,0.00),  scale:0.0035*1.5,xw:2,yw:4,zw:2,x:2 ,y:0,z:2,ap:2,health:8,mhealth:8,party:1})),
  ]);
  
  calcPartyCount();
  //onsole.log(parties);
  updateViews();
  //| How to win? Move 2 guys together into the center, wait for the big one to approach, sth you have the first attacks, continue
  //| to attack with both, in the end one of them prevails
}
//---
//fr o,1
//fr o,1,35
//fr p,14,57
