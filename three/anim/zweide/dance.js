//---
planim.scriptsLoaded.splice(0,0,function () {
  var ps,o0,o1,o2,o3;
  //...
  function rana(a) {
    return a[Math.floor(Math.random()*a.length)];
  }
  function onload(o) {
    //ps.setPlayer(o);
    //console.log(o);//JSON.stringify(o,undefined,' '));
    if (o.ps.loadIndex%2==0) o.meshes[0].diff='objs/bot/d2.jpg';
    
    
    var a=o.animh.stand;
    o.ta=0;
    var legs=[[13,14,15],[10,11,12]],
        uko=1,
        a0=JSON.stringify(a[0]),
        a1=JSON.stringify(a[1]),
        moveConf={pua:[a0,a1]};
    
    function apush(ah) {
      var ak=JSON.parse(ah);
      ak.t=0.15;
      a.push(ak);
      //...
    }
    function move(ps) {
      var pua;//=[undefined];
      if (ps.pu) pua=[ps.pu];
      else pua=moveConf.pua;
      for (var pu of pua) {
        if (pu) apush(pu);
        var ak=a[ps.aki===undefined?a.length-1:ps.aki],f=ps.i?-1:1;
        if (ps.t=='legUp') {
          var l=legs[ps.i];
          ak.bs[l[0]].q.x=-0.7;
          ak.bs[l[1]].q.x=0.95;
          ak.bs[l[2]].q.x=-0.2;
      
          var lo=legs[1-ps.i];
          ak.bs[lo[0]].q.z=f*0.05;
          ak.bs[lo[0]].q.y=-0.1;
      
          ak.bs[uko].t.x+=f*0.5;
        } else if (ps.t=='legSide') {
          var l=legs[ps.i];
          ak.bs[l[0]].q.z=f*0.3;
          ak.bs[l[0]].q.x=-0.1;
          ak.bs[l[1]].q.x=0;
          ak.bs[l[2]].q.x=0;
      
          var lo=legs[1-ps.i];
          //ak.bs[lo[0]].q.z=f*0.15;
          ak.bs[lo[0]].q.y=f*0.5;
        } else if (ps.t=='legFront') {
          var l=legs[ps.i];
          ak.bs[l[0]].q.x=-0.3;
          ak.bs[l[0]].q.z=-0.05*f;
          ak.bs[l[1]].q.x=0;
          ak.bs[l[2]].q.x=0.2;
          var lo=legs[1-ps.i];
          ak.bs[lo[0]].q.x=0.3;
          ak.bs[lo[0]].q.z=f*0.05;
          ak.bs[lo[1]].q.x=0;
        } else throw('unknown move type: '+t);
      }
      //...
    }
    
    var legUp='legUp',legSide='legSide',legFront='legFront',
        left=0,right=1;
    
    a.length=0;
    switch (o.ps.loadIndex) {
    case 0: 
      for (var i=0;i<8;i++) 
        move({t:rana([legUp,legSide,legFront]),
              i:rana([left,right])}); break;
    case 1: 
      move({t:legUp  ,i:left});
      move({t:legSide,i:left});
      move({t:legUp  ,i:right});
      move({t:legSide,i:right}); break;
    case 2: 
      move({t:legUp   ,i:left});
      move({t:legFront,i:left});
      move({t:legUp   ,i:right});
      move({t:legFront,i:right}); break;
    case 3: 
      for (var i=0;i<4;i++) {
        move({t:legUp  ,i:left});
        move({t:legSide,i:left}); }
      for (var i=0;i<4;i++) {
        move({t:legUp  ,i:right});
        move({t:legSide,i:right});} break;  
    }
    
    //...
  }
  
  planim.game.allLoaded=function() {
    //
    //onload(o0.o);//onload(o1.o);
    o0.o.ta=0;
    o1.o.ta=0;
    o2.o.ta=0;
    o3.o.ta=0;
    //...
  }
  
  planim.zweideMap=function(psh) {
    ps=psh;
    var mainz=ps.mainz,setPlayer=ps.setPlayer;
    planim.loadObjsThenLoop([
      o0={fn:'/shooter/objs/bot/o5.txt',posa:[-2.25,-1.8,mainz],anim:'stand',scale:0.4,animRun:'run',v:0.003,vrot:0.01,roty:0,rotofs:Math.PI,onload:onload},
      o1={fn:'/shooter/objs/bot/o5.txt',posa:[-0.75,-1.8,mainz],anim:'stand',scale:0.4,animRun:'run',v:0.003,vrot:0.01,roty:0,rotofs:Math.PI,onload:onload},
      o2={fn:'/shooter/objs/bot/o5.txt',posa:[0.75,-1.8,mainz],anim:'stand',scale:0.4,animRun:'run',v:0.003,vrot:0.01,roty:0,rotofs:Math.PI,onload:onload},
      o3={fn:'/shooter/objs/bot/o5.txt',posa:[2.25,-1.8,mainz],anim:'stand',scale:0.4,animRun:'run',v:0.003,vrot:0.01,roty:0,rotofs:Math.PI,onload:onload},
      {fn:'/shooter/objs/shrub/conifer.json',pos:new THREE.Vector3(2,-1.8,mainz-0.7),scale:0.015,env:1},
      {fn:'/shooter/objs/shrub/conifer.json',pos:new THREE.Vector3(-4,-1.8,mainz-1.7),scale:0.03,env:1},
      {fn:'/shooter/objs/shrub/conifer.json',pos:new THREE.Vector3(-6,-1.8,mainz-2.7),scale:0.05,env:1},
      //{fn:'/shooter/objs/shrub/conifer.json',pos:new THREE.Vector3(-12,-1.8,mainz-4),scale:0.1,env:1},
      //{fn:'/shooter/objs/shrub/conifer.json',pos:new THREE.Vector3(12,-1.8,mainz-4),scale:0.1,env:1},
    ]);
    planim._zCamIdle=5;
    ps.etCamd(5);
    
    Menu.init([{s:'&#9776;',noTri:true,pw:0.05,fs:1.4,sub:[planim.mfullscreen,planim.minitvr,planim.mtimescale]}],{listen:1});
    
    return {skipMenu:true};
  }
  //...
  // onsole.log('zweide/test0.js loaded.');
}
);
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,2
//fr o,1,3
//fr o,1,5
//fr o,1,7
//fr p,49,82
