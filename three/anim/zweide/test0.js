//---
planim.scriptsLoaded.splice(0,0,function () {
  //...
  planim.zweideMap=function(ps) {
    var mainz=ps.mainz,setPlayer=ps.setPlayer;
    planim.loadObjsThenLoop([
      {fn:'/shooter/objs/templar/o5.txt',pos:new THREE.Vector3(-1,-1.8,mainz),anim:'stand2',scale:2,animRun:'run',v:0.003,vrot:0.01,roty:1.5,onload:setPlayer},
      {fn:'/shooter/objs/tripod/o5.txt',pos:new THREE.Vector3(1,-1.8,mainz),anim:'idle',scale:2,animRun:'run',v:0.003,roty:-1.5},
      {fn:'/shooter/objs/shrub/conifer.json',pos:new THREE.Vector3(0,-1.8,mainz-0.7),scale:0.015,env:1},
      {fn:'/shooter/objs/shrub/conifer.json',pos:new THREE.Vector3(-2,-1.8,mainz-1.7),scale:0.03,env:1},
      {fn:'/shooter/objs/shrub/conifer.json',pos:new THREE.Vector3(-4,-1.8,mainz-2.7),scale:0.05,env:1},
      {fn:'/shooter/objs/shrub/conifer.json',pos:new THREE.Vector3(-12,-1.8,mainz-4),scale:0.1,env:1},
      {fn:'/shooter/objs/shrub/conifer.json',pos:new THREE.Vector3(12,-1.8,mainz-4),scale:0.1,env:1},
    ]);
  }
  //...
  //onsole.log('zweide/test0.js loaded.');
}
);
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,1
//fr p,2,16
