//--- gravity steering, copied from bulletGravityMovbes.js 
planim.scriptsLoaded.push(
(function () {
  let tmp=new Vecmath.Vec3(),i6=0,panos=[],mb=125,mright,mback,mleft,mforward,mup,panStart=planim.panStart,//mb 125
      tsd0;
  const PI=Math.PI;
  
  //...
  const view=planim.addView({w:1,h:1,x:0,y:0,cam:new THREE.Vector3(0,3,9),bg:1,_noOrbitControls:1
    ,target:new THREE.Vector3(0,-0.40,-1.00),fov:60,bgcol:0x333333,vr_:1,camNear:0.2});
  
  //planim.box(0,-1.9,0,mb/7.5,0.2,mb/7.5).castShadow=false;
  
  var l0,l1,l2;
  planim.base.add(l0=new THREE.AmbientLight(0xffffff,0.3));
  l1=planim.pointLight({x:-4,y:12,z:4,col:0xffffff,dist:25,int:2});
  l2=planim.pointLight({x:5,y:-5,z:-5,col:0xaaffff,dist:100,int:0.5,castShadow:false});
  
  
  var o,o0,bw=10,a=[],camz=-3,startWithEgo=false,stick3,stick15o,stick15oai;
  
  //init objs
  (function() {
    //---
    function panOnload() {
      //---
      var o=this.o;
      /*
      if (this===stick15o) {
        const gp=this.gravityPull;
        gp.panForward='panForward';//---not panDown
        //o.panForward[0].a.push({i:7,gy:350});
        o.panForward=[
          {t:200,a:[{i:0,x:1.8,dz:0.5},{i:2,x:-1.875},{i:1,x:0.25,dz:0.5},{i:3,x:-0.25},{i:4,x:0},{i:5,x:0},{i:7,gy:280}]}
         //,{t:200,a:[{i:0,x:0.75,dz:0.5},{i:2,x:-1.25},{i:1,x:0.25,dz:0.5},{i:3,x:-0.25},{i:4,x:0},{i:5,x:0}]}
         ,{t:300,a:[{i:0,x:0.5,dz:0}   ,{i:2,x:-0.25},{i:1,x:-0.25,dz:0} ,{i:3,x:-0.25},{i:4,x:0},{i:5,x:0}]}
         ,{t:200,a:[{i:0,x:0.25,dz:0.5},{i:2,x:-0.25},{i:1,x:1.8,dz:0.5},{i:3,x:-1.875},{i:4,x:0},{i:5,x:0}]}
         ,{t:300,a:[{i:0,x:-0.25,dz:0} ,{i:2,x:-0.25},{i:1,x:0.5,dz:0}   ,{i:3,x:-0.25},{i:4,x:0},{i:5,x:0}]}
        ];
        console.log(o.panForward);
      }
      */
      //console.log(o===stick15o);
      //console.log(this===stick15o);
      
      setTimeout(function() {
        //panStart(o.ps,o.panIdle);//...
        
        if (!o.ps.panOnloadNostart) 
          panStart(o.ps,o.panIdle);//...
        else {
          o.ps.env=true;
          o.anim=undefined;
          o.animInt=undefined;
        }
        //for (var b of o.bones) if (b.co) b.co.gravity.y=-5;
        
        
      }
      ,1500);
      //...
    }
    
    Pd5.boxes.push([-mb,10,0,10,20,mb]);
    Pd5.boxes.push([mb,10,0,10,20,mb]);
    Pd5.boxes.push([0,10,-mb,mb,20,10]);
    Pd5.boxes.push([0,10,10+mb,mb,20,10]);
    
    Pd5.boxes.push([-75,0,-75,50,10,50]);//,0.09]);
    Pd5.boxes.push([0,0,-35,10,10,10]);//,0.09]);
    Pd5.boxes.push([-90,15,-50,25,5,25]);
    
    var ge=new THREE.Geometry(),w=mb/7,c=new THREE.Color(0.5,0.5,0.5),y0=-1.8,h0=w/3;
    
    for (var i=Pd5.boxes.length-1;i>=0;i--) { var b=Pd5.boxes[i];
      var x=b[0],y=b[1],z=b[2],dx=b[3]*2,dy=b[4]*2,dz=b[5]*2,d=13;
      //onsole.log(b);
      x/=d;y/=d;z/=d;dx/=d;dy/=d;dz/=d;
      threeEnv.addQuad({ge:ge,a0:[x-dx/2,y-dy/2-1.8,z+dz/2],a1:[0,0,-dz],a2:[dx,0,0],a3:[dx,0,-dz],dim:1,c:c});
      threeEnv.addQuad({ge:ge,a0:[x-dx/2,y+dy/2-1.8,z+dz/2],a1:[dx,0,0],a2:[0,0,-dz],a3:[dx,0,-dz],dim:1,c:c});
      threeEnv.addQuad({ge:ge,a0:[x-dx/2,y-dy/2-1.8,z+dz/2],a1:[dx,0,0],a2:[0,dy,0],a3:[dx,dy,0],dim:1,c:c});
      threeEnv.addQuad({ge:ge,a0:[x-dx/2,y-dy/2-1.8,z+dz/2],a1:[0,dy,0],a2:[0,0,-dz],a3:[0,dy,-dz],dim:1,c:c});
      threeEnv.addQuad({ge:ge,a0:[x-dx/2,y-dy/2-1.8,z-dz/2],a1:[0,dy,0],a2:[dx,0,0],a3:[dx,dy,0],dim:1,c:c});
      threeEnv.addQuad({ge:ge,a0:[x+dx/2,y-dy/2-1.8,z+dz/2],a1:[0,0,-dz],a2:[0,dy,0],a3:[0,dy,-dz],dim:1,c:c});
    }
    
    
    ge.computeVertexNormals();
    var bge=new THREE.BufferGeometry().fromGeometry(ge);
    var mh={vertexColors:THREE.FaceColors};
    var m=new THREE.Mesh(bge,new THREE.MeshPhongMaterial(mh));
    m.position.set(0,0,0);
    m.castShadow=true;
    m.receiveShadow=true;
    planim.base.add(m);
    
    
    
    (o0=planim.panObj(0,-1,{
      fn:'/shooter/objs/bullet/stick15.txt',panOnload:panOnload
    }));stick15o=o0;
    a.push(o0);panos.push(o0);
    
        
    (o0=planim.panObj(5,-2,{
      fn:'/shooter/objs/bullet/stick15.txt',diff:'/shooter/objs/bullet/stick15/skin1d.json'
      
    ,onload:function(o) {
      //---
      for (const w of o.bones[3].ws) w.p0.y/=2;
      for (const w of o.bones[2].ws) w.p0.y/=2;
      for (const w of o.bones[4].ws) w.p0.y/=2;
      for (const w of o.bones[5].ws) w.p0.y/=2;
      for (const w of o.bones[6].ws) w.p0.y*=2;
      planim.panObjOnload(o);
      //...
    }
      
      ,panOnload:panOnload
    }));o0.panai=1;
    a.push(o0);panos.push(o0);
    
    
    (o0=planim.panObj(-5,-2,{
      fn:'/shooter/objs/bullet/stick15.txt',diff:'/shooter/objs/bullet/stick15/skin1d.json',panOnload:panOnload
    }));o0.panai=1;
    a.push(o0);panos.push(o0);
    
    
    
  }
  )();
  
  planim.loadObjsThenLoop(a);
  planim.game.defMoves=1;
  
  var th0=new Bullet.Transform(),th1=new Bullet.Transform();
  //let wasMnav=false;
  
  if (1)
  planim.game.calc=function(dt) {
    //---
    
    if (1) {
    //if (o0) 
    for (let o0 of panos) {
      let o=o0;
      
      const gp=o0.gravityPull;
      if (gp&&gp.ileft) {
    
        o.o.bones[gp.ileft].co.getWorldTransform(th0);const p0=th0.origin;
        o.o.bones[gp.iright].co.getWorldTransform(th1);const p1=th1.origin;
        if (!o.cpos) o.cpos={};
        o.cpos.x=(p0.x+p1.x)/2;o.cpos.y=(p0.y+p1.y)/2;o.cpos.z=(p0.z+p1.z)/2;
        const dx=p0.x-p1.x,dz=p0.z-p1.z,ang=Math.atan2(dz,dx);let f=gp.xz||50;
        let ah,g0;
        //console.log(ang);
    
        if (o===stick15o) {
          if ((tsd0.dx!=0)||(tsd0.dy!=0)) {
             //onsole.log(tsd0.dx+' '+tsd0.dy);
            const a2=Math.atan2(tsd0.dy,tsd0.dx)-PI/2-view.controls.getAzimuthalAngle(),
                  da=Conet.dAng(a2,ang);
            //onsole.log(da);
            const mda=0.15;
            o.turnLeft=da<-mda;
            o.turnRight=da>mda;
            o.moveFore=Math.abs(da)<=mda;
            //onsole.log(mleft.on+' '+mright.on+' '+da);
          } else { o.turnLeft=false;o.turnRight=false;o.moveFore=false; }
          //o.turnLeft=mleft.on;
          //o.turnRight=mright.on;
          //o.moveFore=mforward.on;
          //o.moveBack=mback.on;
        } else if (o.panai) {
          o.panchanget=(o.panchanget||0)+dt;
          if ((o.panchanget>3000)&&o.o.pans) {
            const p1=stick15o.cpos,p0=o.cpos;
            if (p1&&p0) {
              const dx=p1.x-p0.x,dz=p1.z-p0.z,a2=Math.atan2(dz,dx)-PI/2,
                    da=Conet.dAng(a2,ang),d2=dx*dx+dz*dz;
              const mda=0.15;
              o.turnLeft=da<-mda;
              o.turnRight=da>mda;
              o.moveFore=(Math.abs(da)<=mda)&&(d2>1500);
              //onsole.log(d2);
              //o0.panchanget=0;
            }
          }
        }
    
        let al=(o.turnLeft?-1:0)+(o.turnRight?1:0),ar=al;
        if (al!=0) {
          if (gp.panTurn) {
            //onsole.log('panTurn nao '+gp.panTurn);
            //onsole.log(o);
            //onsole.log(o[gp.panTurn]);
            panStart(o,o.o[gp.panTurn]);
          }
          if (gp.fTurn) f=gp.fTurn;
          o.wasMnav=true;
        } else if (o.moveFore) { 
          al=1;ar=-1; 
          //onsole.log('ileft');
          //onsole.log(gp);
          if (gp.panForward) panStart(o,o.o[gp.panForward]);
          o.wasMnav=true;
        } else if (o.moveBack) { 
          if (gp.fBack) f=gp.fBack;
          al=-1;ar=1; 
        } else {
          if (o.wasMnav&&gp.panIdle&&o.pan) panStart(o,o.o[gp.panIdle]);
          o.wasMnav=false;
        }
        if (al!=0) {
          ah=ang+al*Math.PI/2;g0=o.o.bones[gp.ileft].co.gravity;g0.x=Math.cos(ah)*f;g0.z=Math.sin(ah)*f;//12
          ah=ang-ar*Math.PI/2;g0=o.o.bones[gp.iright].co.gravity;g0.x=Math.cos(ah)*f;g0.z=Math.sin(ah)*f;//13
        } else {
          g0=o.o.bones[gp.ileft].co.gravity;g0.x=0;g0.z=0;//12
          g0=o.o.bones[gp.iright].co.gravity;g0.x=0;g0.z=0;//13
        }
    
      } else {
    //   let o=o0,mnav=mleft.on||mright.on||mforward.on||mback.on||mup.on;
    //   if (mnav||o.wasMnav) {
    //     var dx=(mleft.on?-1:0)+(mright.on?1:0),
    //       dz=(mback.on?1:0)+(mforward.on?-1:0),
    //       dy=(mup.on?gp.yUp:gp.yDown);//3*5:-1*5
    //     var b=o.o.bones[gp.i],f=gp.xz||7;//7//1 //f was 90 //250
    //     b.co.gravity.x=dx*f;
    //     b.co.gravity.y=dy;
    //     b.co.gravity.z=dz*f;
    //     //console.log(b.co.gravity.y);
    //     o.wasMnav=mnav;
    //   }
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
    
              if (!constr.og) {
                var al=constr.angularLimits;
                constr.og=[
                  new Vecmath.Vec3(al[0].loLimit,al[1].loLimit,al[2].loLimit),
                  new Vecmath.Vec3(al[0].hiLimit,al[1].hiLimit,al[2].hiLimit),
                ];
              }
    
    
              //onsole.log('anim '+JSON.stringify(ab));
              var ab0=o0.pan[(o0.pani-1+o0.pan.length)%o0.pan.length].a[abi];
              var x0=ab0.x||0,y0=ab0.y||0,z0=ab0.z||0,
                  x1=ab.x||0,y1=ab.y||0,z1=ab.z||0,
                  f1=t6/an.t,f0=1-f1;
                  x=(x0*f0+x1*f1),y=(y0*f0+y1*f1),z=(z0*f0+z1*f1);
              //onsole.log(ab.dz);
              tmp.set3(x-e,y-e,z-e-(ab.dz||0));
              constr.setAngularLowerLimit(tmp);
              tmp.set3(x+e,y+e,z+e+(ab.dz||0));
              constr.setAngularUpperLimit(tmp);    
            }
            
            break;
          }
          //onsole.log('anim '+animi);
          for (var ab of an.a) {
            var constr=o0.o.j6dofs[ab.i];
    
            if (ab.gy) {
              if (o0.o.bones[ab.i].co.gravity.y!=ab.gy) {
                //onsole.log('setting gravity.y from '+o0.o.bones[ab.i].co.gravity.y+' to '+ab.gy);
                o0.o.bones[ab.i].co.gravity.y=ab.gy;
              }
              //continue;
            }
            
            if (!constr.og) {
              var al=constr.angularLimits;
              constr.og=[
                new Vecmath.Vec3(al[0].loLimit,al[1].loLimit,al[2].loLimit),
                new Vecmath.Vec3(al[0].hiLimit,al[1].hiLimit,al[2].hiLimit),
              ];
              //console.log('constr.og');
              //console.log(constr.og);
            }
    
            
            //onsole.log('anim '+JSON.stringify(ab));
            if (ab.x!==undefined||ab.y!==undefined||ab.z!=undefined
              ||ab.dx!=undefined||ab.dy!=undefined||ab.dz!=undefined) 
            {
            tmp.set3(
              ab.x||0-e-ab.dx||0,
              ab.y||0-e-ab.dy||0,
              ab.z||0-e-ab.dz||0
            );
            constr.setAngularLowerLimit(tmp);
            tmp.set3(
              ab.x||0+e+ab.dx||0,
              ab.y||0+e+ab.dy||0,
              ab.z||0+e+ab.dz||0
            );
            constr.setAngularUpperLimit(tmp);
            }
          }
          t6-=an.t;
          if (an.f) an.f();//console.log('pani='+o0.pani);
          if (an.toOg) {
            for (var constr of o0.o.j6dofs) {
              if (!constr.og) continue;
              constr.setAngularLowerLimit(constr.og[0]);
              constr.setAngularUpperLimit(constr.og[1]);
            }
            //onsole.log('toOg');
          }
          o0.pani=(o0.pani+1)%o0.pan.length;
        }
        o0.pant=t6;
      }
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
    for (var i=0;i<a.length;i++) { const o=a[i];
    
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
  
  Menu.init([{s:'Menu',ms:planim.version+' steering v.0.182 ',sub:[//FOLDORUPDATEVERSION
    planim.mfullscreen]},
  /*
  mright=      {s:'>',px:px,py:0.22,pw:pw,ph:pw,ydown:true,xright:true,fs:1.4},
  mback=       {s:'v',px:px+pw,py:0.22,pw:pw,ph:pw,ydown:true,xright:true,fs:1.4},
  mleft=       {s:'<',px:px+pw+pw,py:0.22,pw:pw,ph:pw,ydown:true,xright:true,fs:1.4},
  mforward=    {s:'\u25b2',px:px+pw,py:0.22+pw,pw:pw,ph:pw,ydown:true,xright:true,fs:1.4},
  mup=         {s:'u',px:px,py:0.22+pw,pw:pw,ph:pw,ydown:true,xright:true,fs:1.4},
  */
    //planim.maction
    ],{listen:1});
  
  planim.vrkeys=false;//!startWithEgo;
  if (!planim.startWithEgo) { planim.base.position.set(0,0,-2);planim.views[0].camera.rotation.set(-0.3,0,0); }//planim.vrkeysAuto=1; }
  
  planim.moveBounds={x0:-bw,x1:bw,z0:-bw,z1:bw};
  planim.tsd=Menu.touchSticksInit({autoKeys:1,skip1:1});
  tsd0=planim.tsd[0];
  Sound.vol=0.2;
  threeEnv.useBaseRot=1;
  
  //...
}
));
//console.log('YOIUOkokooko');
//fr o,2
//fr o,2,19
//fr o,2,19,1
//fr o,2,19,1,20
//fr o,2,19,47
//fr o,2,29
//fr p,20,387
