//---
(function () {
  //...
  planim.addView({w:1,h:1,x:0,y:0,cam:new THREE.Vector3(0.193,-0.725,0.850),bg:1,autoRotate:0,//0,-0.1,2.50
    target:new THREE.Vector3(-0.018,-0.849,0.012),fov:40,bgcol:0x666666,_vr:1});//0,-0.8.0
  
  //planim.game.rays=1;
  //planim.game.fetchOnKey=1;
  function select(o) {
    this.material=o?planim.m1:planim.m0;
    //console.log('bases.select o='+o);
    //console.log(this);
  }
  
  function init() {
    //---
    
    Conet.download({
    //fn:'/three/anim/boxScales/h_plaitChase.json',
    fn:'/three/anim/boxScales/uglyPullover.json',
    
    
    f:function (v) {
      //...
      //onsole.log(v);
      var d=JSON.parse(v);
      for (var o of d.objs) {
        if (!o.plaitSkip) planim.loadObj(o);
        //console.log(o);
      }
      
      if (d.initScript) 
        Function('"use strict";'+(Array.isArray(d.initScript)?d.initScript.join('\n'):d.initScript))();
      //---
    }
    });
    
    
    //...
  }
  
  
  planim.box(0,-1.9,0,6,0.2,6).castShadow=false;
  //planim.box(0,0,0,0.2,0.2,0.2);
  //planim.box(0,-0.05,-1,0.2,0.2,0.2).select=select;
  //planim.box(0.1,0.05,-0.9,0.2,0.2,0.2).select=select;
  planim.defaultLights();
  //planim.loadObjsThenLoop([{fn:'../shooter/objs/templar/o5.txt',pos:new THREE.Vector3(0,-1.8,-1.00),anim:'stand2',scale:0.004,ohkey:'m',roty:0},]);
  
  //init();
  planim.scriptsLoaded.push(init);
  
  //---
}
)();
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,6
//fr o,1,8
//fr o,1,8,7
//fr p,0,19
