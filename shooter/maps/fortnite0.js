//ABOUT: copied from twinstickGenMaze.js
ptd=0;usePtd=false;
eyemd0=0;
eyemd1=100;
eyemdd=1;//0.1;
//mute=1;
physDampE=0.5;


useEyew=false;
if (onlyThree) {
  //threeEnv.scale=1;
  threeEnv.fov=50;
  
  threeEnv.spotLight.intensity=1.5;
  threeEnv.spotLight.shadowCameraNear=50;
  threeEnv.spotLightRot=1;
  
var dl=new THREE.DirectionalLight(0x77ffff,0.5);
dl.position.set(0,-1,0);
threeEnv.scene.add(dl);
dl=new THREE.DirectionalLight(0xffffdd,0.5);
if (0) {
dl.castShadow=true;
dl.shadowBias=0.001;
dl.shadowMapWidth=1024;
dl.shadowMapHeight=1024;
}
dl.position.set(0,2000,500);
threeEnv.scene.add(dl);
  
  
} else if (isGlge) { 
  glgeCam.fovy=50;gscale=2;mapw=50.4*gscale,maph=50.4*gscale;
  //glgeCam.far=2000*gscale;//500*gscale;//far;
  glgeCam.near=gscale;
}

//fixCam=2;
camo.x=5;camo.z=6;camo.y=5;camAx=0.6;camdr=0;eyemd=6*gscale;eyeh=gscale*1;
twinstick=2;//camSmooth=1;
if (twinstick==2) {
  eyeh=1.5*gscale;camAx=0.2;eyemd=3*gscale;//camSmooth=10;
}
//iso=true;
//console.log(camo);
game.noDefMenu=1;
game.tsd=Menu.touchSticksInit();


game.startUp=function() {
  var mhh=5;
  var enemy;
  
  //var s=document.createElement('script');
  //s.text=game.genMaze;
  //document.body.appendChild(s);
  
  var s=document.createElement('script');
  s.text=game.w3dit;
  document.body.appendChild(s);
  
  
  
  function cload(o,ch) {
    ch.o5=o;loadPd5(ch);
    //if (ch.startAnim) o.anim=o.animh[ch.startAnim];
    //loadf(o);
  }
  
  
  //eyeh=gscale*(twinstick==2?1.5:1);
  var z0=0;//4;
  load({fn:'objs/templar/o5.txt',x:5,y:0,z:-0.5,ego:1,v:0.05,vr:twinstick==2?3:3,s:40,ssc:0.07,rot:0,eyeh:0.33,ai0:ai0
    ,party:1,health:5,mhealth:5,bbName:'Sword',bbParty:'Good',animr:[['idle','stand2'],['attack','attack2']]});
  load({fn:'objs/tripod/o5.txt',x:10,y:0,z:4,v:0.03,vr:1,s:40,ssc:0.07,rot:PI,eyeh:0.33,ai0:ai0,ai:ai
    ,radius:1,health:5,mhealth:5,bbName:'Spider',bbParty:'Bad',animr:[['lost','dead']]});
  ////load({fn:'objs/tripod/o5.txt',x:3,y:0,z:z0,v:0.03,vr:0.75,s:40,ssc:0.07,rot:PI,eyeh:0.33,ai0:ai0,ai:ai
  ////  ,radius:1,health:5,mhealth:5,bbName:'Spider',bbParty:'Bad',animr:[['lost','dead']]});
  
  //load({fn:'objs/beton/n3.txt',x:0,y:0,z:0,s:1,env:1,collision:1,castShadow:false});//n11
  Conet.download({fn:'/three/lego/fortnite0.txt',f:function(v) {
    var map=JSON.parse(v);//alert(v);
    
    //objs/mapGen/beamIso2.txt
    
    load({fn:'objs/mapGen/beamIso2.txt',x:0,y:0,z:0,s:1,env:1,collision:1,castShadow:true,phong:0,loadedf:function(o) {
      
      o=o.o5;
      var v0,v1,v2,v3,fa=o.meshes[0].fa,x,y,z,w=50,h=w*2/3,h8=h/4;//,grid=game.grid,w=map.gridw||40,x,y,z;
      o.verts.splice(0,o.verts.length);
      fa.splice(0,fa.length);
      
      
      function quat(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,p) {
        var t,ph=p||{},uu1=1||ph.u1,vv1=1||ph.v1;
        //u1=1;v1=1;
        o.verts.push(v0=Pd5.vertNew(x0,y0,z0,0,0));
        o.verts.push(v1=Pd5.vertNew(x1,y1,z1,uu1,0));
        o.verts.push(v2=Pd5.vertNew(x2,y2,z2,0,vv1));
        o.verts.push(v3=Pd5.vertNew(x3,y3,z3,uu1,vv1));
        fa.push(t=Pd5.triNew(v0,v1,v2));if (p) t.p=p;
        fa.push(t=Pd5.triNew(v1,v3,v2));if (p) t.p=p;
        //...
      }
      function quat2(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,p,dx,dy,dz) {
        quat(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,p);
        quat(x1+dx,y1+dy,z1+dz,x0+dx,y0+dy,z0+dz,x3+dx,y3+dy,z2+dz,x2+dx,y2+dy,z2+dz,p);
        //...
      }
      
      function block(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,f) {
        if (0)
        if (lightcount<10) {
          var l=new THREE.PointLight(0xff9900,2,1000);
          l.position.set(x0*5,y0*5,z0*5);
          threeEnv.scene.add(l);
          lightcount++;
          console.log('block '+x0+' '+y0+' '+z0);
        }
        
        quat(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3);//up
        quat(x2,y2-h8,z2,x3,y3-h8,z3,x0,y0-h8,z0,x1,y1-h8,z1);//down
        //if (1) return;
        quat(x0,y0-h8,z0,x1,y1-h8,z1,x0,y0,z0,x1,y1,z1,{coll:'v'});//left
        quat(x2,y2,z2,x3,y3,z3,x2,y2-h8,z2,x3,y3-h8,z3,{coll:'v'});//right
        quat(x2,y2-h8,z2,x0,y0-h8,z0,x2,y2,z2,x0,y0,z0,{coll:'v'});//front
        quat(x1,y1-h8,z1,x3,y3-h8,z3,x1,y1,z1,x3,y3,z3,{coll:'v'});//back
        
        var ps={coll:'c'};
        if (!f.freex0) quat(x0,y0+h8,z0,x1,y1+h8,z1,x0,y0,z0,x1,y1,z1,ps);//left
        if (!f.freex1) quat(x2,y2,z2,x3,y3,z3,x2,y2+h8,z2,x3,y3+h8,z3,ps);//right
        if (!f.freez0) quat(x2,y2+h8,z2,x0,y0+h8,z0,x2,y2,z2,x0,y0,z0,ps);//front
        if (!f.freez1) quat(x1,y1+h8,z1,x3,y3+h8,z3,x1,y1,z1,x3,y3,z3,ps);//back
        
      }
      
      
      
      //quat(w,0,0, 0,0,0, w,0,w, 0,0,w);
      
      var bl,th=w/10,th2=th*2,grid={};
      
      function etGrid(x,y,z,b) {
        var k=z+' '+y+' '+x;
        if (b!==undefined) {
          if (grid[k]===undefined) grid[k]=[];
          b.gx=x;b.gy=y;b.gz=z;
          grid[k].push(b);
        }
        return grid[k];
        //...
      }
      
      
      //if (1)
      for (var b of map.bricks) {
        if (bl) Pd5.hcopy(bl,b,undefined,undefined,1);
        //console.log(b);
        bl=b;
        b.gt=b.t;//undefined;
        if ((b.t=='block')&&(b.w==4)&&(b.b==4)) {
          var x=(b.x-2)/4,z=(b.z-2)/4,y=b.y/6;    
          b.gt='blocky';etGrid(x,y,z,b);
        }
        else if (b.t.startsWith('ramp')) {//=='ramp1') {
          var x=(b.x-2)/4,z=(b.z-2)/4,y=(b.y-1)/6;etGrid(x,y,z,b);
          x*=w;y*=w;z*=w;
        }
        else if ((b.t=='block')&&(b.w==4)&&(b.h==6)) {
          var x=(b.x-2)/4,z=(b.z-1)/4,y=(b.y-2)/6;etGrid(x,y,z,b);
          x*=w;y*=w;z*=w;b.gt='blockz';
          //quat2(x+w,y,z-th, x,y,z-th, x+w,y+w,z-th, x,y+w,z-th,{coll:'v'},0,0,th2);
          //quat2(x+w,y,z, x,y,z, x+w,y+w-5,z, x,y+w-5,z,{coll:'c'},0,0,0);
        }
        else if ((b.t=='block')&&(b.b==4)&&(b.h==6)) {
          var x=(b.x-2)/4,z=(b.z-2)/4,y=(b.y-2)/6;etGrid(x,y,z,b);
          x*=w;y*=w;z*=w;b.gt='blockx';
          //quat2(x-th,y+w,z, x-th,y,z, x-th,y+w,z+w, x-th,y,z+w,{coll:'v'},th2,0,0);
          //quat2(x,y+w-5,z, x,y,z, x,y+w-5,z+w, x,y,z+w,{coll:'c'},0,0,0);
      //  } else if (b.t=='ramp0') {
      //    var x=(b.x-2)/4,z=(b.z-2)/4,y=(b.y-1)/6;etGrid(x,y,z,b);
      //    x*=w;y*=w;z*=w;
      //    //quat2(x,y,z+w, x+w,y,z+w, x,y+w,z, x+w,y+w,z,undefined,0,-th2,0);
        } else if (b.t=='light') {
          //onsole.log(b);
          var x=(b.x-2)/4.0,z=(b.z-2)/4.0,y=(b.y-1)/6.0;//etGrid(x,y,z,b);
          x*=w;y*=w;z*=w;
          //onsole.log(x+' '+y+' '+z);
          var l=new THREE.PointLight(0xff9900,2,w*14);
          l.position.set(x*5,y*5,z*5);
          threeEnv.scene.add(l);
          //quat2(x+th2,y,z, x,y,z, x+th2,y,z+th2, x,y,z+th2,undefined,0,-th2,0);
        }
        else console.log(b);
      } 
      
      function eg(b,dx,dy,dz,ta) {
        var ga=etGrid(b.gx+dx,b.gy+dy,b.gz+dz);
        if (ta===undefined) return ga;
        if (ga===undefined) return undefined;
        for (var t of ta) for (var g of ga) if (g.gt==t) return 1;
        return undefined;
        //...
      }
      
      for (var b of map.bricks) {
        var x=b.gx*w,y=b.gy*w,z=b.gz*w;
        if (b.gt=='blocky') {
          quat2(x+w,y,z, x,y,z, x+w,y,z+w, x,y,z+w,undefined,0,-th2,0);
          if (!eg(b,0,0,-1,['blocky','ramp0'])) quat(x+w,y-th2,z, x,y-th2,z, x+w,y,z, x,y,z,{coll:'v',v1:0.1});
          if (!eg(b,0,0,1,['blocky','ramp1'])) quat(x,y-th2,z+w, x+w,y-th2,z+w, x,y,z+w, x+w,y,z+w,{coll:'v',v1:0.1});
          if (!eg(b,1,0,0,['blocky','ramp3'])&&!eg(b,1,-1,0,['ramp2'])) quat(x+w,y-th2,z+w, x+w,y-th2,z, x+w,y,z+w, x+w,y,z,{coll:'v',v1:0.1});  
          if (!eg(b,-1,0,0,['blocky','ramp2'])) quat(x,y-th2,z, x,y-th2,z+w, x,y,z, x,y,z+w,{coll:'v',v1:0.1}); 
        }
        if (1) {
        if (b.gt=='blockz') {
          //var upb=!eg(b,0,1,0,['blockz']),yw=y+w+(upb?-th:0);
          var upb=(eg(b,0,1,0,['blocky'])||eg(b,0,1,-1,['blocky']))&&!eg(b,0,1,0,['blockz']),yw=y+w+(upb?-th:0);
          quat2(x+w,y,z-th, x,y,z-th, x+w,yw,z-th, x,yw,z-th,undefined,0,0,th2);
          //quat2(x+w,y,z, x,y,z, x+w,y+w-5,z, x,y+w-5,z,{coll:'c'},0,0,0);
          if (!eg(b,1,0,0,['blockz'])) quat(x+w,y,z+th, x+w,y,z-th, x+w,yw,z+th, x+w,yw,z-th,{coll:'v',u1:0.1});  
          if (!eg(b,-1,0,0,['blockz'])) quat(x,y,z-th, x,y,z+th, x,yw,z-th, x,yw,z+th,{coll:'v',u1:0.1});  
          if (!eg(b,0,-1,0,['blockz'])) quat(x,y,z-th, x+w,y,z-th, x,y,z+th, x+w,y,z+th,{coll:'v',v1:0.1});
          if (!eg(b,0,1,0,['blockz'])) quat(x+w,yw,z-th, x,yw,z-th, x+w,yw,z+th, x,yw,z+th,{coll:'v',v1:0.1});
        }
        if (b.gt=='blockx') {
          var upb=(eg(b,0,1,0,['blocky'])||eg(b,0,1,-1,['blocky']))&&!eg(b,0,1,0,['blockx']),yw=y+w+(upb?-th:0);
          quat2(x-th,yw,z, x-th,y,z, x-th,yw,z+w, x-th,y,z+w,undefined,th2,0,0);
          //quat2(x,y+w-5,z, x,y,z, x,y+w-5,z+w, x,y,z+w,{coll:'c'},0,0,0);
          if (!eg(b,0,0,-1,['blockx'])) quat(x+th,y,z, x-th,y,z ,x+th,yw,z, x-th,yw,z, {coll:'v',u1:0.1});  
          if (!eg(b,0,0,1,['blockx'])) quat(x-th,y,z+w, x+th,y,z+w ,x-th,yw,z+w, x+th,yw,z+w, {coll:'v',u1:0.1});  
          if (!eg(b,0,-1,0,['blockz'])) quat(x-th,y,z, x+th,y,z, x-th,y,z+w, x+th,y,z+w,{coll:'v',v1:0.1});
          if (!eg(b,0,1,0,['blockz'])) quat(x+th,yw,z, x-th,yw,z, x+th,yw,z+w, x-th,yw,z+w,{coll:'v',v1:0.1});
        }
        if (b.gt=='ramp1') {
          quat2(x+w,y,z, x,y,z, x+w,y+w,z+w, x,y+w,z+w,undefined,0,-th2,0);
          if (!eg(b,1,0,0,['ramp1'])) quat(x+w,y-th2+w,z+w, x+w,y-th2,z, x+w,y+w,z+w, x+w,y,z,{coll:'v',v1:0.1});
          if (!eg(b,-1,0,0,['ramp1'])) quat(x,y-th2,z, x,y-th2+w,z+w, x,y,z, x,y+w,z+w,{coll:'v',v1:0.1});
        }
        if (b.gt=='ramp0') {
          quat2(x,y,z+w, x+w,y,z+w, x,y+w,z, x+w,y+w,z,undefined,0,-th2,0);
          if (!eg(b,1,0,0,['ramp0'])) quat(x+w,y-th2,z+w, x+w,y-th2+w,z, x+w,y,z+w, x+w,y+w,z,{coll:'v',v1:0.1});
          if (!eg(b,-1,0,0,['ramp0'])) quat(x,y-th2+w,z, x,y-th2,z+w, x,y+w,z, x,y,z+w,{coll:'v',v1:0.1});
        }
        if (b.gt=='ramp2') {
          quat2(x+w,y,z, x,y+w,z, x+w,y,z+w, x,y+w,z+w,undefined,0,-th2,0);
          if (!eg(b,0,0,-1,['ramp2'])) quat(x+w,y-th2,z, x,y+w-th2,z, x+w,y,z, x,y+w,z ,{coll:'v',u1:0.1});
          if (!eg(b,0,0,1,['ramp2'])) quat(x,y+w-th2,z+w, x+w,y-th2,z+w, x,y+w,z+w, x+w,y,z+w ,{coll:'v',u1:0.1});
        }
        if (b.gt=='ramp3') {
          quat2(x,y-th2,z, x+w,y+w-th2,z, x,y-th2,z+w, x+w,y+w-th2,z+w,undefined,0,th2,0);
          if (!eg(b,0,0,-1,['ramp3'])) quat(x+w,y+w-th2,z, x,y-th2,z, x+w,y+w,z, x,y,z ,{coll:'v',u1:0.1});
          if (!eg(b,0,0,1,['ramp3'])) quat(x,y-th2,z+w, x+w,y+w-th2,z+w, x,y,z+w, x+w,y+w,z+w ,{coll:'v',u1:0.1});
        }}
      }
      
      
      if (0) {
      window.ShapeUtils=THREE.ShapeUtils;
      var ofal=fa.length;
      if ((ofal>0)&&!params.skipTriOpt) {
        Pd5.triOpt(o);
        log('triOpt: '+ofal+' -> '+fa.length);
      }}
      
      
      
      threeMeshUpdate(o,0);
      physTris=[];
      finishPhysTris(o.o);
      
      
      //console.log('--fortnite0 w3dit='+window.W3dit);
      if (0&&window.W3dit) //alert(W3dit.serialize1(o));
        Conet.upload({fn:'/shooter/objs/mapGen/fortniteGen.json',data:W3dit.serialize1(o)});
    }
    });
    
  }
  });
  
  
  //load({fn:'objs/fence/o5.txt',x:13,y:0,z:5,s:1,env:1,rot:-1.5});//5.5,0,-3.75,s:0.5
  if (!threeEnv) {
    load({fn:'objs/skybox/o5.txt',x:0,y:0,s:50,z:0,env:1,skybox:1,hs:false});
  } else { 
    threeEnv.scene.add(threeEnv.skyMesh); 
    //threeEnv.fixLight=true;
    //var px=672,py=0,pz=-170;
    //threeEnv.spotLight.position.set(px+1000,py+500,pz+1000);
    //threeEnv.spotLight.target.position.set(px,py,pz);
  //var l=new THREE.PointLight(0xff9900,2,500);l.position.set(-1000,100,0);threeEnv.scene.add(l);
  //var l=new THREE.PointLight(0xff9900,2,500);l.position.set(0,200,0);threeEnv.scene.add(l);
  //var l=new THREE.PointLight(0xff9900,2,500);l.position.set(1000,200,0);threeEnv.scene.add(l);
  //var l=new THREE.PointLight(0xff9900,2,500);l.position.set(0,200,1000);threeEnv.scene.add(l);
    
  }
  
  
  loadPd5Start=loadIndex;
}
game.menuInit=function(ma) {
  ma.push(mAction={s:'\u270a',px:0.03,py:0.25,pw:0.116,ph:0.116,ydown:true,fs:1.4,noa:true});//...
  return ma;
}
game.onAttack=function() {
  if (fixCam) return;
  if (twinstick==2) return;
  //if (Math.random()<0.75) return;
  game.ocam={dr:camdr,ax:camAx,eyemd:eyemd};
  game.camt=0;
  fixCam=1;
  //game.nearCam=1;
  dtscale=0.1;
  //var o=ego;o.fixCamMove={goFront:o.goFront,goBack:o.goBack,goLeft:o.goLeft,goRight:o.goRight};
  //...
}
game.keyDown=function(kc) {
  if (kc==189) objsReset();//game.onAttack();
  //og('twinstick.js '+kc);//...
}
game.calcLater=function() {
  //---
  var o=ego;
  if (o) if (o.y<-10) { o.x=5;o.y=0;o.z=-0.5; }
  //if (!game.nearCam) //
  if (!fixCam) return;
  game.camt+=dt;
  //if (0) 
  if (game.camt>=300) {
    fixCam=0;
    var oc=game.ocam;
    camdr=oc.dr;camAx=oc.ax;eyemd=oc.eyemd;
    dtscale=1;
    return;
  }
  if (!ego) return;
  if (!ego.camo) ego.camo=opposed();
  var o0=ego,o1=ego.camo,dx=o1.x-o0.x,dz=o1.z-o0.z;
  camAx=0;
  //console.log(o0.z);
  //camo.x=o0.x+dx/2+3*dz/2;camo.z=o0.z+dz/2-3*dx/2;
  //camdr=-PI/2-Math.atan2(-dx,dz);//eyeh=1;
  //eyemd=0;
  camo.x=o0.x+dx/2;camo.z=o0.z+dz/2;
  eyemd=1+Math.sqrt(dx*dx+dz*dz);
  
  //...
}
startDraw();
//fr o,50
//fr o,50,26
//fr o,50,26,4
//fr o,50,26,4,7
//fr o,50,26,4,8
//fr o,50,26,4,18
//fr o,50,26,4,63
//fr o,54
//fr p,44,39
