//--- bullet 6dof anims, copied from bullet0.js 
(function () {
  var scrubs=[],t=0,mobs=[],rani=planim.rani,viewMode,mAction,f4=planim.f4,
      tmp=new Vecmath.Vec3(),i6=0,panos=[],mb=75;
  
  //...
  planim.addView({w:1,h:1,x:0,y:0,cam:new THREE.Vector3(0,3,9),bg:1,noOrbitControls:1
    ,target:new THREE.Vector3(0,-0.40,-1.00),fov:60,bgcol:0x333333,vr_:1,camNear:0.2});
  
  planim.box(0,-1.9,0,mb/7.5,0.2,mb/7.5).castShadow=false;
  
  var l0,l1,l2;
  planim.base.add(l0=new THREE.AmbientLight(0xffffff,0.3));
  l1=planim.pointLight({x:-4,y:12,z:4,col:0xffffff,dist:25,int:2});
  l2=planim.pointLight({x:5,y:-5,z:-5,col:0xaaffff,dist:100,int:0.5,castShadow:false});
  
  
  var o,o0,bw=10,a=[],camz=-3,startWithEgo=false;
  
  function initBullet(o) {
    o.o={x:0,y:0,z:0,rot:0,go:{rotofs:o.ps.rotofs}};
    Pd5.bulletize(o);
    //...
  }
  
  function panStart(o,pan) {
    //anim=pan;//o0.o.panTurnLeft;
    //animi=0;t6=0;
    
    if (!o.env) {//--- this was checkstartanims()
      o.env=true;
      o.o.anim=undefined;
      o.o.animInt=undefined;
    }
    
    
    o.pan=pan;
    o.pani=0;
    o.pant=0;
    //...
  }
  
  
  //init objs
  (function() {
    
    function stick5Onload(o) {
      
      o.o={x:0,y:0,z:0,rot:0,go:{rotofs:o.ps.rotofs}};
      Pd5.bulletize(o);
      //o.bones[2].noAnim=1;
      //console.log(o.bones[2].co);
      var im=o.ps.inverseMass;//100
      o.bones[1].co.inverseMass=im;//0.01;
      o.bones[2].co.inverseMass=im;//0.01;
      o.bones[3].co.inverseMass=im;//0.01;
      o.bones[4].co.inverseMass=im;//0.01;
      o.bones[5].co.inverseMass=im;//0.01;
      o.bones[1].co.gravity.y=2*40;//*im/100;
      //onsole.log(o.j6dofs);
      //...
      var t=200;//500 better moves but take longer to get going
      o.panTurnLeft=[
        {t:t,a:[{i:0,x:1.5},{i:2,x:-1.5},{i:1,x:0.5},{i:3,x:-0.5}]},
        {t:t,a:[{i:0,x:1,z:0.5},{i:2,x:-0.5,z:0.5}]},
        {t:t,a:[{i:0,x:-0,z:-0.5},{i:2,x:-0.5,z:-0.5}]},
        //{t:500,a:[{i:0,x:1.5},{i:2,x:-1.5}]},
      ];
      o.panIdle=[
        //{t:1000,a:[{i:0,x:0.5},{i:1,x:0.5},{i:2,x:-0.5},{i:3,x:-0.5}]},
        //{t:1000,a:[{i:0,x:1.5},{i:1,x:1.5},{i:2,x:-1.5},{i:3,x:-1.5}]},
        {t:t,a:[{i:0,x:0.5},{i:1,x:0.5},{i:2,x:-0.5},{i:3,x:-0.5}]},
        {t:t,a:[{i:0,x:0.7},{i:1,x:0.7},{i:2,x:-0.7},{i:3,x:-0.7}]},
      ];
      var dz=0.5;
      o.panForward=[
        {t:t,a:[{i:0,x:1.5,dz:dz},{i:2,x:-1.5},{i:1,x:0.5,dz:dz},{i:3,x:-0.5}]},
        {t:t,a:[{i:0,x:1,dz:dz},{i:2,x:-0.5},{i:1,x:-0.5,dz:dz},{i:3,x:-0.5}]},
        {t:t,a:[{i:0,x:0.5,dz:dz},{i:2,x:-0.5},{i:1,x:1.5,dz:dz},{i:3,x:-1.5}]},
        {t:t,a:[{i:0,x:-0.5,dz:dz},{i:2,x:-0.5},{i:1,x:1,dz:dz},{i:3,x:-0.5}]},
      ];
      o.pans=[o.panTurnLeft,o.panIdle,o.panForward];
      
      
      //...
    }
    
    function stick5(x,z,ps) {
      
      
      a.push( o0={
        fn:'/shooter/objs/bullet/stick5face'+(ps.subfn||'')+'.txt'//stick2fat0.txt'//simple.txt'//hand0.txt'
        ,pos:new THREE.Vector3(x,-1.8,z),health:5,rotofs:Math.PI
        ,anim:'idle',scale:0.4,v:0.006,vrot:0.01//anim:flat//test0//idle
        ,onload:stick5Onload,inverseMass:ps.inverseMass||100});
      panos.push(o0);
      
      
      //...
    }
    
    if (1) {
    
      if (0)
      a.push(
      o={fn:'/shooter/objs/bot/o5.txt',pos:new THREE.Vector3(0,-1.8,-2),health:5,rotofs:Math.PI
        ,anim:'stand',scale:0.4,animRun:'run',animAttack:'attackmid',animHit:'hit',animDead:'lost',v:0.006,ego:startWithEgo,vrot:0.01,
    onload:function(o) {
      o.o={x:0,y:0,z:0,rot:0,go:{rotofs:o.ps.rotofs}};
      //console.log('baseUnit.onload '+o.ps.pos);
      Pd5.bulletize(o);
      //onsole.log(o);
      if (0) {
      o.bones[9].co.gravity.y=40;
      o.bones[8].co.gravity.y=40;
      o.bones[2].co.gravity.y=40;
      }
      //...
    }
        });
    
      if (0)
      a.push( o0={
        fn:'/shooter/objs/bullet/stick3.txt'//stick2fat0.txt'//simple.txt'//hand0.txt'
      ,pos:new THREE.Vector3(1,-1.8,0),health:5,rotofs:Math.PI
      ,anim:'idle',scale:0.4,v:0.006,vrot:0.01//anim:flat//test0//idle
      //,onload:initBullet
    ,onload:function(o) {
      o.o={x:0,y:0,z:0,rot:0,go:{rotofs:o.ps.rotofs}};
      Pd5.bulletize(o);
      //o.bones[2].noAnim=1;
      //console.log(o.bones[2].co);
      o.bones[1].co.inverseMass=100;//0.01;
      o.bones[2].co.inverseMass=100;//0.01;
      o.bones[3].co.inverseMass=100;//0.01;
      //o.bones[1].co.gravity.y=40;
      //onsole.log(o.j6dofs);
      //...
      
      o.panTurnLeft=[
        {t:250,a:[{i:0,x:0.3,z:-0.7},{i:1,x:0.5}]},
        {t:250,a:[{i:0,x:1,z:-1},{i:1,x:1.5}]},
      ];
      o.panIdle=[
        {t:250,a:[{i:0,z:-0.7},{i:1,z:0.7}]},
      ];
      o.panForward=[
        {t:250,a:[{i:0,x:0.5,z:0},{i:1,x:0.5,z:0}]},
        {t:500,a:[{i:0,x:1.5},{i:1,x:1.5}]},
      ];
      //---
      
    }
      });
    
      if (1) {
    
        stick5(1,0,{});
        stick5(-1,0,{});
        stick5(1,-2,{});
        stick5(-1,-2,{});
        stick5(0,-1,{subfn:'Small',inverseMass:20});
        stick5(0,-1,{subfn:'Small',inverseMass:20});
        
        
    /*
        a.push( o0={
          fn:'/shooter/objs/bullet/stick5.txt'//stick2fat0.txt'//simple.txt'//hand0.txt'
          ,pos:new THREE.Vector3(1,-1.8,0),health:5,rotofs:Math.PI
          ,anim:'idle',scale:0.4,v:0.006,vrot:0.01//anim:flat//test0//idle
          ,onload:stick5Onload});
        panos.push(o0);
    a.push( o0={
      fn:'/shooter/objs/bullet/stick5.txt'//stick2fat0.txt'//simple.txt'//hand0.txt'
      ,pos:new THREE.Vector3(-1,-1.8,0),health:5,rotofs:Math.PI
      ,anim:'idle',scale:0.4,v:0.006,vrot:0.01//anim:flat//test0//idle
      ,onload:stick5Onload});
    panos.push(o0);
    */
      }
      return;
    }
    
    
  }
  )();
  
  planim.loadObjsThenLoop(a);
  planim.game.defMoves=1;
  
  planim.game.calc=function(dt) {
    if (1)
    //if (o0) 
    for (var o0 of panos)
    {
      o0.panchanget=(o0.panchanget||0)+dt;
      if (o0.panchanget>3000) {
        o0.panchanget=0;
        o0.panchangei=o0.panchangei===undefined?0:(o0.panchangei+1)%o0.o.pans.length;
        //onsole.log('calc starting '+o0.panchangei);
        panStart(o0,o0.o.pans[o0.panchangei
        ]);
      }
      
      if (o0.env) {
      var t6=o0.pant;
      t6+=dt;
      while (1) {
        var an=o0.pan[o0.pani];
        if (t6<an.t) break;
        //onsole.log('anim '+animi);
        var e=Bullet.BulletGlobals.SIMD_EPSILON;
        for (var ab of an.a) {
          var constr=o0.o.j6dofs[ab.i];
          //onsole.log('anim '+JSON.stringify(ab));
          tmp.set3(ab.x||0-e,ab.y||0-e,ab.z||0-e-ab.dz||0);
          constr.setAngularLowerLimit(tmp);
          tmp.set3(ab.x||0+e,ab.y||0+e,ab.z||0+e+ab.dz||0);
          constr.setAngularUpperLimit(tmp);    
        }
        t6-=an.t;
        o0.pani=(o0.pani+1)%o0.pan.length;
      }
      o0.pant=t6;
      }
    }
    
    
    if (0) {
    t6+=dt;
    if (t6>500) {
      if (o0.env) {
        //onsole.log('game.calc. '+o0.o.j6dofs);
        var e=Bullet.BulletGlobals.SIMD_EPSILON,constr,
            va=[
              [-e,-e,-e,e,e,e],
              [-e+1,-e,-e,e+1,e,e]
            ];
            
        i6=(i6+1)%va.length;
        var ah=va[i6];
    
        constr=o0.o.j6dofs[0];
        tmp.set3(ah[0],ah[1],ah[2]);
        constr.setAngularLowerLimit(tmp);
        tmp.set3(ah[3],ah[4],ah[5]);
        constr.setAngularUpperLimit(tmp);    
        constr=o0.o.j6dofs[1];
        tmp.set3(ah[0],ah[1],ah[2]);
        constr.setAngularLowerLimit(tmp);
        tmp.set3(ah[3],ah[4],ah[5]);
        constr.setAngularUpperLimit(tmp);    
      }
      t6=0;
    }
    }
    
    //console.log('baseUnit.game.calc');
    //if (!o.ps) return;
    //if (1) return;
    for (var i=0;i<a.length;i++) { var o=a[i];
    
    var o5=o.o;
    if (!o5) return;
    //console.log('baseUnit.game.calc');
    var oo=o5.o,pos=o.pos;
    oo.x=pos.x;
    //onsole.log('baseunit.game.calc pos='+f4(pos.x)+' '+f4(pos.y)+' '+f4(pos.z));
    //oo.y=pos.y;
    oo.z=pos.z;
    oo.rot=o.roty;
    
    }
    //oo.go.rotofs=o.rotofs;
  }
  
  planim.defMoveAi=false;
  
  Menu.init([{s:'Menu',ms:planim.version,sub:[
    planim.mfullscreen
    //planim.minitvr,planim.muitoggle,planim.megoswitch,planim.mrestart
    ]},
    
  /*  
    
  {s:'Turn left',actionf:function() {
    //checkStartAnims();
    //anim=[
    //  {t:250,a:[{i:0,x:0.3,z:-0.7},{i:1,x:0.5}]},
    //  {t:250,a:[{i:0,x:1,z:-1},{i:1,x:1.5}]},
    //];
    panStart(o0,o0.o.panTurnLeft);
    //...
  }
  },
  
  {s:'Idle',actionf:function() {
    //checkStartAnims();
    //anim=[
    //  {t:250,a:[{i:0,z:-0.7},{i:1,z:0.7}]},
    //];
    panStart(o0,o0.o.panIdle);
    //...
  }
  },
  
  {s:'Forward',actionf:function() {
    //checkStartAnims();
    //anim=[
    //  {t:250,a:[{i:0,x:0.5,z:0},{i:1,x:0.5,z:0}]},
    //  {t:500,a:[{i:0,x:1.5},{i:1,x:1.5}]},
    //];
    panStart(o0,o0.o.panForward);
    //anim=o0.o.panForward;
    //animi=0;t6=0;
    //...
  }
  },
  
  */
  
    //planim.maction
    ],{listen:1});
  
  //if (startWithEgo) 
  //planim.uiSet(3);//,{camz:camz});
  planim.vrkeys=!startWithEgo;
  if (!planim.startWithEgo) { planim.base.position.set(0,0,-2);planim.views[0].camera.rotation.set(-0.3,0,0); }//planim.vrkeysAuto=1; }
  
  planim.moveBounds={x0:-bw,x1:bw,z0:-bw,z1:bw};
  planim.tsd=Menu.touchSticksInit();
  Sound.vol=0.2;
  threeEnv.useBaseRot=1;
  
  //Pd5.boxes.push([0,10,-50,10,10,10]);
  //Pd5.boxes.push([-50,0,0,10,10,10]);
  
  //[0,-10,0,200,10,200],
  //var mb=150;
  Pd5.boxes.push([-mb,50,0,10,100,200]);
  Pd5.boxes.push([mb,50,0,10,100,200]);
  Pd5.boxes.push([0,50,-mb,200,100,10]);
  Pd5.boxes.push([0,50,mb,200,100,10]);
  
  
  //...
}
)();
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,19
//fr o,1,23
//fr o,1,23,1
//fr o,1,23,3
//fr o,1,29
//fr p,20,239
