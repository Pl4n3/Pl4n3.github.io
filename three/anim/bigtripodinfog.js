//---
(function () {
  var scrubs=[],t=0,mobs=[],rani=planim.rani,viewMode,mx=50,mz=50,view0;
  
  function mobLoaded(o) {
    //console.log('mobLoaded');
    //console.log(o);
    //o.ps.goFront=true;
    o.t=0;//o.dest=new THREE.Vector3(10,-1.8,10);
    mobs.push(o);
    //...
  }
  function shrubload(v) {
    var ps=this;//,mx=30,mz=30;
    //var o=Pd5.load(v);planim.loadInit(o,ps);
    
    for (var i=0;i<100;i++) {
      var ps0=Pd5.hcopy(ps),rs=Math.random();
      rs=rs*rs*rs;
      ps0=Pd5.hcopy({
        pos:new THREE.Vector3(Math.random()*2*mx-mx,-1.9,Math.random()*2*mz-mz),
        scale:0.01+0.01*rs,
        r_oty:Math.random()*2*Math.PI,
      },ps0);
      var o=Pd5.load(v);
      //o.castShadow=0;
      planim.loadInit(o,ps0);
      var m=o.meshes[0].tmesh;
      m.rotation.order='YXZ'
      m.rotation.y=Math.random()*2*Math.PI;
      o.t=planim.rani(500);o.shake=false;o.amp=0;o.animStop=true;
      scrubs.push(o);
    }
  }
  
  //...
  planim.addView(view0={w:1,h:1,x:0,y:0,cam_:new THREE.Vector3(0,-0.10,2.50),bg:1,noOrbitControls:1
    ,target:new THREE.Vector3(0,-0.40,-1.00),fov:60,bgcol:0x666666,vr_:1,camNear:0.2});
  view0.camera.rotation.x=0.2;
  
  planim.scene.fog=new THREE.FogExp2(0x666666,0.05);
  
  planim.box(0,-1.9,0,mx*2,0.2,mz*2).castShadow=false;
  var lia=planim.defaultLights();
  
  var o;
  planim.loadObjsThenLoop([
    {fn:'/shooter/objs/templar/o5.txt',pos:new THREE.Vector3(-25,-1.8,-25-1)
      ,anim:'stand2',scale:2,animRun:'run',v:0.006,ego:1,vrot:0.01},
    {fn:'/shooter/objs/tripod/o5.txt',pos:new THREE.Vector3(-10+0.5,-1.8,-10-1.00)
      ,anim:'idle',scale:2,animRun:'run',onload:mobLoaded,v:0.003,roty:-2},
  
  
  {fn:'/shooter/objs/tripod/o5.txt',pos:new THREE.Vector3(25+0.5,-1.8,25-1.00)
    ,anim:'idle',scale:40,animRun:'run',onload:mobLoaded,v:0.003,roty:-2},
  
  
    {fn:'/shooter/objs/shrub/roundb.json',pos:new THREE.Vector3(0,-1.8,-1.00),scale:0.01,f:shrubload,env:1},
  ]);
  
  //planim.views[0].camera.rotation.x=-0.6;
  planim.game.defMoves=1;
  planim.defMoveAi=false;
  
  planim.game.calc=function(dt) {
    var o=planim.ego;
    if (o) lia[1].position.set(o.pos.x-1,o.pos.y+4,o.pos.z+1);
    //...
  }
  planim.initVrStart=function() {
    planim.camPos.y=-1.5;
    view0.camera.rotation.x=0;
    //...
  }
  
  Menu.init([{s:'Menu',ms:planim.version+'- 0.13 ',sub:[//FOLDORUPDATEVERSION
  planim.mfullscreen,planim.minitvr,planim.muitoggle]}
  ],{listen:1});
  
  planim.uiSet(1);
  planim.camPos.y=-1.2;
  //planim.baseRot.x=0.3;
  planim.vrkeys=undefined;
  planim.moveBounds={x0:-mx,x1:mx,z0:-mz,z1:mz};
  //game.tsd=
  planim.tsd=Menu.touchSticksInit();
  Sound.vol=0.2;
  //...
}
)();
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,2
//fr o,1,3
//fr o,1,34
//fr o,1,35
//fr p,25,71
