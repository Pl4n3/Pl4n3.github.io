//--- bullet 6dof anims, copied from bullet0.js 
(function () {
  var scrubs=[],t=0,mobs=[],rani=planim.rani,viewMode,mAction,f4=planim.f4,
      tmp=new Vecmath.Vec3(),i6=0,panos=[],mb=125,mleft,mright,mforward,mforwardjump;//75;
  
  //...
  planim.addView({w:1,h:1,x:0,y:0,cam:new THREE.Vector3(0,3,9),bg:1,noOrbitControls:1
    ,target:new THREE.Vector3(0,-0.40,-1.00),fov:60,bgcol:0x333333,vr_:1,camNear:0.2});
  
  //planim.box(0,-1.9,0,mb/7.5,0.2,mb/7.5).castShadow=false;
  
  var l0,l1,l2;
  planim.base.add(l0=new THREE.AmbientLight(0xffffff,0.3));
  l1=planim.pointLight({x:-4,y:12,z:4,col:0xffffff,dist:25,int:2});
  l2=planim.pointLight({x:5,y:-5,z:-5,col:0xaaffff,dist:100,int:0.5,castShadow:false});
  
  
  var o,o0,og0,bw=10,a=[],camz=-3,startWithEgo=false;
  
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
    
    if (pan) {
    o.pan=pan;
    o.pani=0;
    o.pant=0;
    } else o.pani=undefined;
    //o.o.bones[7].co.gravity.y=300;
    //...
  }
  
  
  //init objs
  (function() {
    
    function stick5Onload(o) {
      
      o.o={x:0,y:0,z:0,rot:0,go:{rotofs:o.ps.rotofs}};
      Pd5.bulletize(o);
      //o.bones[2].noAnim=1;
      //console.log(o.bones[2].co);
      var im=o.ps.inverseMass||100;//100
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
      var dz=0.5,fx=o.ps.fx||1;//0.5;
      o.panForward=[
        {t:t,a:[{i:0,x:fx*1.5,dz:dz} ,{i:2,x:fx*-1.5},{i:1,x:fx*0.5,dz:dz} ,{i:3,x:fx*-0.5}]},
        {t:t,a:[{i:0,x:fx*1,dz:dz}   ,{i:2,x:fx*-0.5},{i:1,x:fx*-0.5,dz:dz},{i:3,x:fx*-0.5}]},
        {t:t,a:[{i:0,x:fx*0.5,dz:dz} ,{i:2,x:fx*-0.5},{i:1,x:fx*1.5,dz:dz} ,{i:3,x:fx*-1.5}]},
        {t:t,a:[{i:0,x:fx*-0.5,dz:dz},{i:2,x:fx*-0.5},{i:1,x:fx*1,dz:dz}   ,{i:3,x:fx*-0.5}]},
      ];
      o.pans=[o.panTurnLeft,o.panIdle,o.panForward];
      
      
      //...
    }
    function stick5(x,z,ps) {
      var o0;
      
      a.push( o0=Conet.hcopy(ps,{
        fn:'/shooter/objs/bullet/'+(ps.corefn||('stick5face'+(ps.subfn||'')+'.txt'))//stick2fat0.txt'//simple.txt'//hand0.txt'
        ,pos:new THREE.Vector3(x,-1.8,z),health:5,rotofs:Math.PI
        ,anim:'idle',scale:0.4,v:0.006,vrot:0.01//anim:flat//test0//idle
        ,onload:stick5Onload//,inverseMass:ps.inverseMass||100,panps:ps
        }));
      panos.push(o0);
      return o0;
      
      //...
    }
    
    function stick15Onload(o) {
      
      o.o={x:0,y:0,z:0,rot:0,go:{rotofs:o.ps.rotofs}};
      Pd5.bulletize(o,{damp0:1,damp1:1});
      //o.bones[2].noAnim=1;
      //console.log(o.bones[2].co);
      var bo,im=o.ps.inverseMass||100,//100
          im2=im,///100;
          gy2=-30,//-5 //of arms 
          gy7=240;//140  //of head
      o.bones[1].co.inverseMass=im;//0.01;
      o.bones[2].co.inverseMass=im;//0.01;
      o.bones[3].co.inverseMass=im;//0.01;
      o.bones[4].co.inverseMass=im;//0.01;
      o.bones[5].co.inverseMass=im;//0.01;
      o.bones[6].co.inverseMass=im;///100;
      o.bones[7].co.inverseMass=im;///100;
      //o.bones[1].co.gravity.y=10;
      (bo=o.bones[7].co).gravity.y=gy7;//140;
      //onsole.log(bo);
      o.bones[8].co.inverseMass=im;
      o.bones[9].co.inverseMass=im;
      o.bones[10].co.inverseMass=im2;
      o.bones[10].co.gravity.y=gy2;
      o.bones[11].co.inverseMass=im2;
      o.bones[11].co.gravity.y=gy2;
      o.bones[12].co.inverseMass=im2;
      o.bones[12].co.gravity.y=gy2;
      o.bones[13].co.inverseMass=im2;
      o.bones[13].co.gravity.y=gy2;
      
      //console.log('gravity='+o.bones[11].co.gravity); -> -30
      //onsole.log(o.j6dofs);
      //...
      var t=200;//500 better moves but take longer to get going
      
      o.panTurnRight=
      0?//very slow
      [
        //{t:t,a:[{i:0,x:1.5},{i:2,x:-1.5},{i:1,x:0.5},{i:3,x:-0.5}]},
        //{t:t,a:[{i:0,x:1,z:0.5},{i:2,x:-0.5,z:0.5}]},
        //{t:t,a:[{i:0,x:-0,z:-0.5},{i:2,x:-0.5,z:-0.5}]},
        ////{t:500,a:[{i:0,x:1.5},{i:2,x:-1.5}]},
        
      {t:300,a:[{i:0,x:0.5},{i:1,x:0.5},{i:2,x:-0.5},{i:3,x:-0.5},{i:4,x:0,y:0.5,_interpol:1},{i:5,x:0,y:0}],
      
      f:function() {
        bo.gravity.y=gy7;//...
      }
      },
      
      {t:300,a:[{i:0,x:0.5},{i:1,x:0.5},{i:2,x:-0.5},{i:3,x:-0.5},{i:4,x:0,y:1},{i:5,x:0,y:0}]},
      
      {t:300,a:[{i:0,x:0.7},{i:1,x:0.7},{i:2,x:-0.7},{i:3,x:-0.7},{i:4,y:0,_interpol:1},{i:5,y:0}]},
      ]:
      
      //faster, jumping
      [
      {t:t,a:[{i:0,x:2},{i:1,x:2},{i:2,x:-2.5},{i:3,x:-2.5},{i:4,x:0.5},{i:5,x:0}],
      f:function() {
        bo.gravity.y=gy7;
      }
      },
      
      {t:300,a:[{i:0,x:0.5},{i:1,x:0.5},{i:2,x:-0.5},{i:3,x:-0.5},{i:4,x:0,y:1},{i:5,x:0}],
      f:function() {
        bo.gravity.y=gy7+50;//...
      }
      },
      
      {t:500,a:[{i:0,x:0.5},{i:1,x:0.5},{i:2,x:-0.5},{i:3,x:-0.5},{i:4,x:0,y:0},{i:5,x:0}],
      f:function() {
        bo.gravity.y=gy7;
      }
      
      },
      
      ];
      
      
      o.panTurnLeft=
      [
      {t:t,a:[{i:0,x:2},{i:1,x:2},{i:2,x:-2.5},{i:3,x:-2.5},{i:4,x:0.5},{i:5,x:0}],
      f:function() {
        bo.gravity.y=gy7;
      }
      },
      
      {t:300,a:[{i:0,x:0.5},{i:1,x:0.5},{i:2,x:-0.5},{i:3,x:-0.5},{i:4,x:0,y:-1},{i:5,x:0}],
      f:function() {
        bo.gravity.y=gy7+50;//...
      }
      },
      
      {t:500,a:[{i:0,x:0.5},{i:1,x:0.5},{i:2,x:-0.5},{i:3,x:-0.5},{i:4,x:0,y:0},{i:5,x:0}],
      f:function() {
        bo.gravity.y=gy7;
      }
      
      },
      
      ];
      
      
      
      
      
      o.panIdle=[
        {t:t,a:[{i:0,x:0.5},{i:1,x:0.5},{i:2,x:-0.5},{i:3,x:-0.5},{i:4,x:0,y:0},{i:5,x:0},{i:9,x:0},{i:8,x:0}],
      f:function() {
        bo.gravity.y=gy7;//...
      }
        },
        {t:t,a:[{i:0,x:0.7},{i:1,x:0.7},{i:2,x:-0.7},{i:3,x:-0.7}]},
      ];
      var dz=0.5,fx=o.ps.fx||1,dz0=0;//0.5;
      o.panForward=[
        {t:t,a:[{i:0,x:fx*1.5,dz:dz}  ,{i:2,x:fx*-2.5},{i:1,x:fx*0.5,dz:dz}  ,{i:3,x:fx*-0.5},{i:4,x:-1},{i:5,x:1}]},
        {t:t,a:[{i:0,x:fx*1,dz:dz0}   ,{i:2,x:fx*-0.5},{i:1,x:fx*-0.5,dz:dz0},{i:3,x:fx*-0.5},{i:4,x:-1},{i:5,x:1}]},
        {t:t,a:[{i:0,x:fx*0.5,dz:dz}  ,{i:2,x:fx*-0.5},{i:1,x:fx*1.5,dz:dz}  ,{i:3,x:fx*-2.5},{i:4,x:-1},{i:5,x:1}]},
        {t:t,a:[{i:0,x:fx*-0.5,dz:dz0},{i:2,x:fx*-0.5},{i:1,x:fx*1,dz:dz0}   ,{i:3,x:fx*-0.5},{i:4,x:-1},{i:5,x:1}]},
      ];
      
      o.panDown=[
        {t:t,a:[{i:0,x:2},{i:1,x:2},{i:2,x:-2.5},{i:3,x:-2.5},{i:4,x:1},{i:5,x:1},{i:9,x:1},{i:8,x:1}],
      f:function() {
        bo.gravity.y=gy7;
      }
        },
        
      {t:300,a:[{i:0,x:0.5},{i:1,x:0.5},{i:2,x:-0.5},{i:3,x:-0.5},{i:4,x:0},{i:5,x:0},{i:9,x:0},{i:8,x:0}],
      f:function() {
        bo.gravity.y=gy7+110;//...
      }
      },
      
      {t:500,a:[{i:0,x:2},{i:1,x:2},{i:2,x:-2.5},{i:3,x:-2.5},{i:4,x:0},{i:5,x:0}]},
      
      
        
      //{t:1000,a:[{i:0,x:0.5},{i:1,x:0.5},{i:2,x:-0.5},{i:3,x:-0.5},{i:4,x:0},{i:5,x:0}],
      {t:500,a:[{i:0,x:2},{i:1,x:2},{i:2,x:-2.5},{i:3,x:-2.5},{i:4,x:0},{i:5,x:0}],
      
      
      f:function() {
        bo.gravity.y=gy7;
      }
      
      },
        
      ];
      
      
      o.pans=[o.panIdle,o.panTurnLeft,o.panIdle,o.panIdle,o.panIdle,o.panIdle,o.panIdle,o.panIdle];//o.panTurnLeft,o.panIdle,o.panForward];
      
      
      //...
    }
    function stick15(x,z,ps) {
      var o0;
      
      a.push( o0=Conet.hcopy(ps,{
        fn:ps.fn||'/shooter/objs/bullet/stick15.txt'
        ,pos:new THREE.Vector3(x,-1.8,z),health:5,rotofs:Math.PI
        ,anim:'idle',scale:0.4,v:0.006,vrot:0.01
        ,onload:stick15Onload
        }));
      panos.push(o0);
      return o0;
      
      //...
    }
    
    Pd5.boxes.push([-mb,50,0,10,100,mb*2]);
    Pd5.boxes.push([mb,50,0,10,100,mb*2]);
    Pd5.boxes.push([0,50,-mb,mb*2,100,10]);
    Pd5.boxes.push([0,50,mb,mb*2,100,10]);
    
    //Pd5.boxes.push([-mb,50,0,10,100,200]);
    //Pd5.boxes.push([mb,50,0,10,100,200]);
    //Pd5.boxes.push([0,50,-mb,200,100,10]);
    //Pd5.boxes.push([0,50,mb,200,100,10]);
    
    Pd5.boxes.push([-75,0,-75,50,10,50]);//,0.09]);
    
    //planim.box(0,-1.9,0,mb/7.5,0.2,mb/7.5).castShadow=false;
    var ge=new THREE.Geometry(),w=mb/7,c=new THREE.Color(0.5,0.5,0.5),y0=-1.8,h0=w/3;
    
    threeEnv.addQuad({ge:ge,a0:[-w/2,y0,w/2],a1:[w,0,0],a2:[0,0,-w],a3:[w,0,-w],dim:1,c:c});
    threeEnv.addQuad({ge:ge,a0:[-w/2,y0,w/2],a1:[0,0,-w],a2:[0,h0,0],a3:[0,h0,-w],dim:1,c:c});
    threeEnv.addQuad({ge:ge,a0:[w/2,y0,-w/2],a1:[0,0,w],a2:[0,h0,0],a3:[0,h0,w],dim:1,c:c});
    
    threeEnv.addQuad({ge:ge,a0:[-w/2,y0,-w/2],a1:[w,0,0],a2:[0,h0,0],a3:[w,h0,0],dim:1,c:c});
    threeEnv.addQuad({ge:ge,a0:[w/2,y0,w/2],a1:[-w,0,0],a2:[0,h0,0],a3:[-w,h0,0],dim:1,c:c});
    
    var w2=50/7;
    threeEnv.addQuad({ge:ge,a0:[-w/2,y0+0.8,-w/2+w2],a1:[w2,0,0],a2:[0,0,-w2],a3:[w2,0,-w2],dim:1,c:c});
    threeEnv.addQuad({ge:ge,a0:[-w/2,y0,-w/2+w2],a1:[w2,0,0],a2:[0,0.8,0],a3:[w2,0.8,0],dim:1,c:c});
    threeEnv.addQuad({ge:ge,a0:[-w/2+w2,y0,-w/2+w2],a1:[0,0,-w2],a2:[0,0.8,0],a3:[0,0.8,-w2],dim:1,c:c});
    
    
    if (0) for (var b of Pd5.boxes) {
      var x=b[0],y=b[1],z=b[2],dx=b[3],dy=b[4],dz=b[5],d=6;
      //onsole.log(b);
      x/=d;y/=d;z/=d;dx/=d;dy/=d;dz/=d;
      threeEnv.addQuad({ge:ge,a0:[x-dx/2,y-dy/2,z+dz/2],a1:[dx,0,0],a2:[0,0,-dz],a3:[dx,0,-dz],dim:1,c:c});
    }
    
    
    ge.computeVertexNormals();
    var bge=new THREE.BufferGeometry().fromGeometry(ge);
    var mh={vertexColors:THREE.FaceColors};
    var m=new THREE.Mesh(bge,new THREE.MeshPhongMaterial(mh));
    m.position.set(0,0,0);
    m.castShadow=true;
    m.receiveShadow=true;
    planim.base.add(m);
    
    
    (og0=o0=stick15(0,-1,{fx:0.5}));    
    stick15(1,-2,{fx:0.5,diff:'dsfsdf',fn:'/shooter/objs/bullet/stick15b.txt'}).panai=1;
    
    
    
  }
  )();
  
  planim.loadObjsThenLoop(a);
  planim.game.defMoves=1;
  
  planim.game.calc=function(dt) {
    t+=dt;
    if (t>1000) {
      //onsole.log(mleft.on);
      var pan=og0.o.panIdle,ons=0;
      if (mleft.on) { pan=og0.o.panTurnLeft;ons++; }
      if (mright.on) { pan=og0.o.panTurnRight;ons++; }
      if (mforward.on) { pan=og0.o.panForward;ons++; }
      if (mforwardjump.on) { pan=og0.o.panDown;ons++; }
      if (ons>1) pan=og0.o.panIdle;
      if (og0.pan!=pan) panStart(og0,pan);
    }
    
    if (1)
    //if (o0) 
    for (var o0 of panos) {
      if (o0.panai) {
        o0.panchanget=(o0.panchanget||0)+dt;
        if (o0.panchanget>3000) {
          o0.panchanget=0;
          o0.panchangei=o0.panchangei===undefined?0:(o0.panchangei+1)%o0.o.pans.length;
          //onsole.log('calc starting '+o0.panchangei);
          panStart(o0,o0.o.pans[o0.panchangei
          ]);
        }
      }
      if (o0.env&&(o0.pani!==undefined)) {
        var t6=o0.pant;
        t6+=dt;
        while (1) {
          var an=o0.pan[o0.pani];
          var e=Bullet.BulletGlobals.SIMD_EPSILON;
          if (t6<an.t) { 
            //---interpol
            //for (var ab of an.a) {
            for (var abi=an.a.length-1;abi>=0;abi--) {
              var ab=an.a[abi];
              if (!ab.interpol) continue;
              var constr=o0.o.j6dofs[ab.i];
              //onsole.log('anim '+JSON.stringify(ab));
              var ab0=o0.pan[(o0.pani-1+o0.pan.length)%o0.pan.length].a[abi];
              var x0=ab0.x||0,y0=ab0.y||0,z0=ab0.z||0,
                  x1=ab.x||0,y1=ab.y||0,z1=ab.z||0,
                  f1=t6/an.t,f0=1-f1;
                  x=(x0*f0+x1*f1),y=(y0*f0+y1*f1),z=(z0*f0+z1*f1);
              tmp.set3(x-e,y-e,z-e-ab.dz||0);
              constr.setAngularLowerLimit(tmp);
              tmp.set3(x+e,y+e,z+e+ab.dz||0);
              constr.setAngularUpperLimit(tmp);    
            }
            
            break;
          }
          //onsole.log('anim '+animi);
          for (var ab of an.a) {
            var constr=o0.o.j6dofs[ab.i];
            //onsole.log('anim '+JSON.stringify(ab));
            tmp.set3(ab.x||0-e,ab.y||0-e,ab.z||0-e-ab.dz||0);
            constr.setAngularLowerLimit(tmp);
            tmp.set3(ab.x||0+e,ab.y||0+e,ab.z||0+e+ab.dz||0);
            constr.setAngularUpperLimit(tmp);    
          }
          t6-=an.t;
          if (an.f) an.f();//console.log('pani='+o0.pani);
          o0.pani=(o0.pani+1)%o0.pan.length;
        }
        o0.pant=t6;
      }
    }
    
    //onsole.log(panos.length);
    
    
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
  
  var px=0.045,pw=0.08;//0.116;
  
  Menu.init([{s:'Menu',ms:planim.version+' bobst v.0.54 ',sub:[//FOLDORUPDATEVERSION
    planim.mfullscreen]},
    
  
  mright=      {s:'>',px:px,py:0.22,pw:pw,ph:pw,ydown:true,xright:true,fs:1.4},
  mforward=    {s:'^',px:px+pw,py:0.22,pw:pw,ph:pw,ydown:true,xright:true,fs:1.4},
  mleft=       {s:'<',px:px+pw+pw,py:0.22,pw:pw,ph:pw,ydown:true,xright:true,fs:1.4},
  mforwardjump={s:'\u25b2',px:px+pw,py:0.22+pw,pw:pw,ph:pw,ydown:true,xright:true,fs:1.4},
  
  
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
  //Pd5.boxes.push([-mb,50,0,10,100,200]);
  //Pd5.boxes.push([mb,50,0,10,100,200]);
  //Pd5.boxes.push([0,50,-mb,200,100,10]);
  //Pd5.boxes.push([0,50,mb,200,100,10]);
  //
  //Pd5.boxes.push([0,0,90,100,60,100]);
  
  
  //...
}
)();
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,23
//fr o,1,23,4
//fr o,1,23,4,45
//fr o,1,23,4,60
//fr o,1,23,4,94
//fr o,1,23,5
//fr p,8,167
