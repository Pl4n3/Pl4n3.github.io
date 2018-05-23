//ABOUT: iso2
var isGrid0=true,deepMap=false,doSteps=false,iso2EditMenu=0;
//var gridfn='maps/grid0.map0.txt';
////var gridfn='../canvas/deep/map0.txt';deepMap=true;
//var gridfn='maps/gridDeep0.map0.txt';
var gridfn=params.data_grido;isGrid0=!params.is2d;
//var gridfn='maps/grid2d.map0.txt';isGrid0=false;
////if (params.gridfn) gridfn=params.gridfn;
////var isGrid0=gridfn=='maps/grid0.txt';
var is2d=!isGrid0;
ptd=0;usePtd=false;
camAx=0.2;
eyemd0=0;eyemd1=100;eyemdd=1;

  fixCam=2;camAx=0.5;camdr=Math.PI-0.5;onFullscreenPointerLock=false;defaultKeys=false;camo.z=is2d?0:-2;
  useEyew=false;game.noDefMenu=2;doPhysicsBeam=false;//deepMap;
  eyemd=15*gscale; 
 
physDampE=0.25;

//var mhealth;
//mute=true;
//var gridfn='maps/grid0.txt';
if (is2d) { camAx=0;camdr=Math.PI;eyemd=3*gscale; }

if (onlyThree) {
  threeEnv.fov=50;//70,50;
  threeEnv.noRotLight=1;
  //threeEnv.scale=1;
  
  if (isGrid0) {
    var l=new THREE.SpotLight(0xffff00);
    l.position.set(-400,0,0);
    l.distance=2000;
    l.castShadow=1;
    l.intensity=3;
    threeEnv.base.add(l);
  }
  threeEnv.spotLight.intensity=1.5;
  threeEnv.spotLight.shadowCameraNear=50;
  threeEnv.spotLightRot=!is2d;//threeEnv.fixLight=1;
  
} else if (isGlge) { 
  glgeCam.fovy=50;gscale=2;mapw=50.4*gscale,maph=50.4*gscale;
  //glgeCam.far=2000*gscale;//500*gscale;//far;
  glgeCam.near=gscale;
}
//eyedx=0.5;
//eyeh=1.3*gscale;
//eyemd=isGlge?4.5*gscale:3;//isGlge?7:4;//4*gscale;//15;
var eyedp=new Vecmath.Vec4(),curso,ringo,mMove,exito;//,attackps=[],attackps2=[];
//game.noDefMenu=1;
escale=0.5;var logcount=0,scripts={},mfile,ShapeUtils=THREE.ShapeUtils,map={};//,doSteps=true;
//---
function baneLoaded(o) {
  o.o5.animStop=1;
  o.ait=2000;
  o.scriptName='test0';
  o.script=scripts[o.scriptName];
  o.isBane=true;
  //var ah=o.o5.animh;
  //ah.idle=ah.stand;
}
function baneLoadf(o) {
  //var ah=o.animh;
  //ah.idle=ah.stand;
  var j=o.loadIndex%2;
  o.meshes[0].diff='objs/bane/'+(j==0?'s':(j==1?'d':'n'))+'.jpg';
  //...
}
function gemLoadedf(o) {
  curso=o;
}
function ringLoadedf(o) {
  ringo=o;
}
function exitLoaded(o) {
  exito=o;
}
function oforbbLoaded(o) {
  //var s;
  //if (s=o.bbName) o.o5.bbName=s;
  //if (s=o.bbParty) o.o5.bbParty=s;
  //if (o.o5.bbName) bbNew(o.o5);
  //if (o.bbName) bbNew(o);//.o5);
  
  //o.o5.animStop=1;
  o.ait=2000;
  o.scriptName='test0';
  o.script=scripts[o.scriptName];
  
  if ((o.party==1)&&map.startFp&&!iso2EditMenu) { Menu.remove();toggleView();Menu.draw(); }
  //console.log(o);
}
function templarArchLoadf(o) {
  var ah=o.animh;
  ah.idle=ah.stand2;
  ah.cidle=ah.cstand;
  ah.attack=ah.attack2;
  //curso=o;
  o.bbName='Arch';
  o.bbParty='Good';//os.length==0?'Good':'Ugly';
  //bbNew(o);
}
//---
function gameOver(win) {
  //---
  game.over=1;
  Menu.remove();
  var menus=Menu.getMenus();
  //og(menus.indexOf(mMove));
  menus.splice(menus.indexOf(mMove),1);
  //menus.push(game.mgo0={s:'<span style="color:#f0f0f0;"><br>Wloom 16<br><span style="font-size:1.8em;color:#ffaa00;">Gravity game test</span>'+
  //   '<br><br>Mission: evacuate the robot to<br>the exit by toggling gravity up/down.</span>',
  //   px:0.3,py:0.15,pw:0.4,ph:0.3,ydown:true,fs:0.15,bgcol:'rgba(0,0,0,0.7)',noinp:1});
  //menus.push(game.mgo0={s:'Start',px:0.4,py:0.175,pw:0.2,ph:0.075,ydown:true,fs:1.2,bgcol:'rgba(200,200,200,0.2)'});
  
  menus.push(game.mgo0={s:'<div style="color:#f0f0f0;padding:0.5em;">Wloom 18<br><span style="font-size:1.8em;color:#ffaa00;">1) Labyrinth of Wloom</span>'+
     '<br>Game Over. '+(win?
     '<span style="color:#0f0;">You won.</span>':
     '<span style="color:#f00;">You lost.</span>')+' Time passed: '+Math.floor(0.5+gtime/10)/100+' sec.</div>',
     px:0.25,py:0.02,pw:0.5,ph:0.13,ydown:true,fs:0.35,noinp:1});
  menus.push(game.mgo1={s:'Restart',px:0.74,py:0.02,pw:0.2,ph:0.075,ydown:true,fs:1.7,
  actionf:function() {
    var menus=Menu.getMenus();
    //menus.splice(2,menus.length-2);
    //menus.splice(menus.length-5,3);
    menus.splice(menus.indexOf(game.mgo0),1);
    menus.splice(menus.indexOf(game.mgo1),1);
    //menus.splice(menus.indexOf(game.mgo2),1);
    //menus.push(mMove);
    missionMenu(menus);
    Menu.roots=menus;//Menu.setMenuroots(menus);
    //game.isMenu=false;
    //delete(game.mgo0);
    gtime=0;
    objsReset();
    delete(game.over);
  }
  });
  //menus.push(game.mgo2={s:'X',px:0.93,py:0.02,pw:0.07,ph:0.075,ydown:true,fs:1.7});
  
  Menu.roots=menus;//Menu.setMenuroots(menus);
  //game.isMenu=true;
  //alert(menus.length);
    Menu.draw();
  //---
}
function missionMenu(ma) {
  console.log('missionMenu');
  ma.push(game.md0={s:'<div style="color:#f0f0f0;padding:0.5em;">Wloom 18<br><span style="font-size:1.8em;color:#ffaa00;">1) Labyrinth of Wloom</span>'+
       '<br>Your mission: Find the exit, avoid or beat them mobs.</div>',
       px:0.25,py:0.02,pw:0.5,ph:0.13,ydown:true,fs:0.35,noinp:1});
  ma.push(game.md1={s:'Start',px:0.74,py:0.02,pw:0.2,ph:0.075,ydown:true,fs:1.7,
  actionf:function() {
    var menus=Menu.getMenus();
    //menus.splice(2,menus.length-2);
    //menus.splice(menus.length-5,3);
    menus.splice(menus.indexOf(game.md0),1);
    menus.splice(menus.indexOf(game.md1),1);
    //menus.splice(menus.indexOf(game.md2),1);
    menus.push(mMove);
    Menu.roots=menus;//Menu.setMenuroots(menus);
    gtime=0;
    //delete(game.md0);
    //game.cams.dostop=true;
    startCams({dostop:true,a:[
      {t:0,x:camo.x,z:camo.z,ay:camdr,ax:camAx,d:eyemd,fov:threeEnv.camera.fov,eyeh:eyeh},
      hCopy(hCopy({},map.cams0.a[map.cams0.a.length-1]),{t:500})
    ]});
    //game.isMenu=false;
  }
  });
  if (map.cams0) startCams(map.cams0);//{ 
    //game.cams=game.cams0;
    //game.cams.t=0; 
  //}
  //ma.push(game.md2={s:'<',px:0.93,py:0.02,pw:0.07,ph:0.075,ydown:true,fs:1.7});
}
function startCams(c) {
  c.t=0;
  if (c.gt===undefined) {
    c.gt=0;
    for (var i=c.a.length-1;i>=0;i--) c.gt+=c.a[i].t;
  }
  game.cams=c;
}
//---
function egoControl() {
  //og('egoControl');
  if (mRight.on) { this.rot=PI/2;this.brot=this.rot;this.goFront=true; }
  else if (mLeft.on) { this.rot=-PI/2;this.brot=this.rot;this.goFront=true; }
  else { 
    //if ((this.brot!==undefined)) {//&&!this.o5.animStep) {
    //  this.rot=this.brot+0.5*Math.sin(ot*0.003);
    //}
    //this.rot+=0.001*dt;
    this.goFront=false; 
  }
  //this.goFront=mRight.on;
  //this.goBack=mLeft.on;
}
function scriptRegister(sc) {
  var sco=scripts[sc.name];
  if (sco!==undefined) if (sco.version===sc.version) return;
  scripts[sc.name]=sc;
  log('Script loaded: '+sc.name+' '+sc.version);
  for (var i=os.length-1;i>=0;i--) {
    var o=os[i];
    if (o.scriptName!=sc.name) continue;
    o.script=sc;
  }
}
game.startUp=function() {
  var mh=5;
  var enemy;
  
  //log('iso2 v.0.3');
  log('Generating level. (v.0.3)');
  
  function mapLoaded(o) {
    game.mapo=o;
    game.afterLoadGridMap();
  }
  function botLoadf(o) {
    var ah=o.animh;
    ah.idle=ah.stand;
  }
  
  game.afterLoadGridMap();
  //---
  load({fn:'objs/gem/o5.txt'    ,x:0,y:0,z:-4,s:0.1,env:1,castShadow:true ,loadedf:gemLoadedf ,hs:false})
  load({fn:'objs/gem/ring.txt'  ,x:0,y:-4,z:0,s:0.2,env:1,castShadow:false,loadedf:ringLoadedf,hs:false})
  
  
  load({fn:'objs/mapGen/beamIso2.txt',x:0,y:0,z:-3,s:1,env:1,collision:1,castShadow:true,phong:params.wireframe,loadedf:mapLoaded});//n11
  
  
  if (!threeEnv) {
    load({fn:'objs/skybox/o5.txt',x:0,y:0,s:50,z:0,env:1,skybox:1,hs:false});
  } else { 
    threeEnv.scene.add(threeEnv.skyMesh);   
  }
  
  loadPd5Start=loadIndex;
  
  //game.cams0={a:[
  //  {t:2500,x:-2.34,z:-8.72,ay:-0.28,ax:0.06,d:1,fov:150,eyeh:1.5},
  //  {t:2500,x:1.93,z:-1.96,ay:2.89,ax:0.04,d:7,fov:10,eyeh:0.5},
  //  {t:2500,x:-0.35,z:-0.73,ay:3.89,ax:0.3,d:7,fov:10,eyeh:0.5},
  //  {t:2500,x:0,z:-2,ay:2.64,ax:0.5,d:15,fov:50,eyeh:1.5}
  //]};
  //for (var i=game.cams.a.length-1;i>=0;i--) game.cams.gt+=game.cams.a[i].t;
  //game.cams0=game.cams;
  //startCams(game.cams0);
  
  setInterval(function() {
    var e=document.createElement('script');
    e.src='maps/scriptTest0.js?'+Date.now();
    document.body.appendChild(e);
  }
  ,1000);
}
game.calcLater=function() {
  if (is2d&&ego) { camo.x=ego.x;camo.y=ego.y-ego.eyeh; }
  if (curso) curso.rot+=0.003*dt;
  if (exito) exito.rot+=0.003*dt;
  if (ringo) {
    ringo.rot+=0.003*dt;
    var o=ringo.refo;
    if (o) {
      ringo.x=o.x;ringo.y=o.y;ringo.z=o.z;
      
      var dy=o.y-camo.y,dym=0.01*dt;
      if (dy<0) dy=Math.max(dy,-dym); else dy=Math.min(dy,dym);
      camo.y+=dy;
    }
  }
  if (ringo&&exito&&!game.over) {
    //og(dist(ringo,exito),undefined,1);
    if (dist(ringo,exito)<2.5) gameOver(1);
  }
  //if (game.cams.running) {//game.md0) {
  var c=game.cams;
  if (c) {
    c.t+=dt;//c.t=(c.t+dt)%c.gt;
    if (c.t>c.gt) {
      if (c.dostop) { c.t=c.gt;delete(game.cams);c.dostop=false; }
      else c.t=c.t%c.gt;
    }
    var t=c.t;
    for (var i=0;i<c.a.length;i++) {
      var k1=c.a[i];
      if (t>k1.t) { t-=k1.t;continue; }
      var f1=t/k1.t,f0=1-f1,k0=c.a[i==0?c.a.length-1:i-1];
      camo.x=f0*k0.x+f1*k1.x;
      //camo.y=f0*k0.y+f1*k1.y;
      camo.z=f0*k0.z+f1*k1.z;
      camdr=f0*k0.ay+f1*k1.ay;
      camAx=f0*k0.ax+f1*k1.ax;
      eyemd=f0*k0.d+f1*k1.d;
      eyeh=f0*k0.eyeh+f1*k1.eyeh;
      threeEnv.camera.fov=f0*k0.fov+f1*k1.fov;threeEnv.camera.updateProjectionMatrix();
      break;
    }
    //eyemd=Math.sin(gtime*0.001)*10+13;
  }
  if (threeEnv) {
    var p={x:camo.x*80,y:camo.y*80,z:camo.z*80};
    threeEnv.spotLight.target.position.set(p.x,p.y,p.z);
    threeEnv.spotLight.position.set(p.x+1000,p.y+500,p.z+1000);  
  } 
}
game.mouseDown=function(x,y) {
  //if (!moused[1]) return;
  if (0) {
  var p=eyedp;
  p.set4(0,0,eyed,0);//eyemd
  em0.rotX(-camAx);//+0.2*Math.abs(dx));//-2*((y/canvas.height)-0.5));
  em.rotY(camdr-PI);
  em.mul1(em0);em.transform1(p);
  ego.x=camo.x+p.x;
  ego.y=camo.y+p.y;
  ego.z=camo.z+p.z;
  //onsole.log(eye);
  return;
  }
  
  //og('camo='+camo.x+' '+camo.y+' '+camo.z+' eyemd='+eyemd);
  
  var dx=(x-cont.clientWidth/2)/cont.clientHeight;
  
  eye.set4(0,0,-70-eyed,0);//eyemd
  em0.rotX(-camAx-1*((y/cont.clientHeight)-0.5));//+0.2*Math.abs(dx));//-2*((y/canvas.height)-0.5));
  em.rotY(camdr-PI-dx);
  em.mul1(em0);em.transform1(eye);
  //em0.mul1(em);em0.transform1(eye);
  
  dox=camo.dox;
  doz=camo.doz;
  
  
  //---instead manually calc eyemd use calced cam position (not camo)
  //var p=eyemdp;p.set4(0,0,eyemd*2,0);em.transform1(p);
  //p.x+=camo.x+dox;p.y+=camo.y+eyeh;p.z+=camo.z+doz;
  var p=eyedp;
  p.set4(0,0,eyed,0);//eyemd
  em0.rotX(-camAx);
  em.rotY(camdr-PI);
  em.mul1(em0);em.transform1(p);
  p.x+=camo.x+dox;p.y+=camo.y+eyeh;p.z+=camo.z+doz;
  
  
  //from[0]=(camo.x+dox)*phf;from[1]=(camo.y+eyeh)*phf;from[2]=(camo.z+doz)*phf;
  //to[0]=(eye.x+camo.x+dox)*phf;to[1]=(eye.y+camo.y+eyeh)*phf;to[2]=(eye.z+camo.z+doz)*phf;
  var from=[],to=[];
  from[0]=(p.x)*phf;from[1]=(p.y)*phf;from[2]=(p.z)*phf;
  to[0]=(eye.x+p.x)*phf;to[1]=(eye.y+p.y)*phf;to[2]=(eye.z+p.z)*phf;
  //for (var ti=physTris.length-1;ti>=0;ti--) physTris[ti].mark=undefined;
  physicsBeam2(from,to,0);
  //spawnParticles(oh={x:(to[0]/phf-dox)*5,y:-(to[2]/phf-doz)*5,z:to[1]/phf*5,scale:5,num:10,v:0.0005});
  var o=curso;
  o.x=(to[0]/phf-dox);
  o.z=(to[2]/phf-doz);
  o.y=to[1]/phf;
  
  //var bb=billboards[0];bb.x=o.x;bb.y=o.y+1;bb.z=o.z;
  
  //threePs({x:o.x*100,y:o.y*100+60,z:o.z*100});
  var mind=1,mino;
  for (var h=os.length-1;h>=0;h--) {
    var oh=os[h];
    if (oh.env) continue;
    if (oh.party!=1) continue;
    var d=dist(o,oh);
    if (d>mind) continue;
    mind=d;mino=oh;
    //log(h+' '+d);
  }
  if (mino) {
    ringo.x=mino.x;ringo.y=mino.y;ringo.z=mino.z;ringo.refo=mino;
  } else { 
    //ringo.x=0;ringo.y=0;ringo.z=0; 
    //if (ringo.refo) ringo.refo.focus={x:curso.x,y:curso.y,z:curso.z};
  }
}
game.keyDown=function(kc) {
  //log(kc);
  //---
  if (kc==74) { threeEnv.camera.fov-=10;threeEnv.camera.updateProjectionMatrix(); }
  if (kc==75) { threeEnv.camera.fov+=10;threeEnv.camera.updateProjectionMatrix(); }
  if (kc==33) eyeh+=0.1;
  if (kc==34) eyeh-=0.1;
  //if (kc==33) camo.y+=1;
  //if (kc==34) camo.y-=1;
  //---
}
function isoMenuArrow() {
  var cdw=(map.gridw||40)/20;
  if (this.s=='\u2192') curso.x+=cdw;
  if (this.s=='\u2190') curso.x-=cdw;
  if (this.s=='\u2191') curso.z-=cdw;
  if (this.s=='\u2193') curso.z+=cdw;
  if (this.s=='\u21d1') curso.y+=cdw;
  if (this.s=='\u21d3') curso.y-=cdw;
  curso.x=Math.floor(curso.x/cdw)*cdw;
  curso.y=Math.floor(curso.y/cdw)*cdw;
  curso.z=Math.floor(curso.z/cdw)*cdw;
  //og('isoMenuArrow '+this.s);
}
game.getGrid=function(x,y,z) {
  return this.grid[x+'_'+y+'_'+z]||0;
}
game.gridToMap=function() {
  var o=game.mapo.o5,v0,v1,v2,v3,fa=o.meshes[0].fa,grid=game.grid,w=map.gridw||40,x,y,z;
  o.verts.splice(0,o.verts.length);
  fa.splice(0,fa.length);
  
  //var x=-70,y=0,z=-20,w=40;
  //var x=curso.x/2,y=curso.y/2,z=(curso.z/2+1),k=x+'_'+y+'_'+z;
  //if (grid[k]) delete(grid[k]); else grid[k]=1;
  function tri(x0,y0,z0,u0,v0, x1,y1,z1,u1,v1, x2,y2,z2,u2,v2) {
    var vh0,vh1,vh2;
    o.verts.push(vh0=Pd5.vertNew(x0,y0,z0,u0,v0));o.verts.push(vh1=Pd5.vertNew(x1,y1,z1,u1,v1));
    o.verts.push(vh2=Pd5.vertNew(x2,y2,z2,u2,v2));
    fa.push(Pd5.triNew(vh0,vh1,vh2));
  }
  
  //onsole.log(this);
  //if (0)
  for (k in grid) if (grid.hasOwnProperty(k)) {
    var a=k.split('_'),g=grid[k];
    x=parseInt(a[0]);y=parseInt(a[1]);z=parseInt(a[2]);
    var gx0=game.getGrid(x-1,y,z),gx1=game.getGrid(x+1,y,z),
        gy0=game.getGrid(x,y-1,z),gy1=game.getGrid(x,y+1,z),
        gz0=game.getGrid(x,y,z-1),gz1=game.getGrid(x,y,z+1),
        g12=game.getGrid(x-1,y-2,z);
    if ((g==6)&&(gy0==0)&&(game.getGrid(x-1,y-1,z)==6)&&(g12!=6)) game.grid[x+'_'+(y-1)+'_'+z]=3;//3
    if ((g==6)&&(gy0==0)&&(game.getGrid(x,y-1,z-1)==6)&&(game.getGrid(x,y-2,z-1)!=6)&&((game.getGrid(x,y+1,z+1)==6)||(gz1==6))) game.grid[x+'_'+(y-1)+'_'+z]=5;//3
  }
  //log(x+' '+y+' '+z);
  var pa=[];
  for (k in grid) if (grid.hasOwnProperty(k)) {
    var a=k.split('_'),g=grid[k];
    x=parseInt(a[0]);y=parseInt(a[1]);z=parseInt(a[2]);
    var gx0=game.getGrid(x-1,y,z),gx1=game.getGrid(x+1,y,z),
        gy0=game.getGrid(x,y-1,z),gy1=game.getGrid(x,y+1,z),
        gz0=game.getGrid(x,y,z-1),gz1=game.getGrid(x,y,z+1);
    x*=w;y*=w;z*=w;
    var fz1=(g==1)&&((gz1<1)||(gz1>5)),//!gz1,
        fx0=(g==1)&&((gx0<1)||(gx0>5)),//!gx0,
        fx1=(g==1)&&((gx1<1)||(gx1>5)),//!gx1,
        fy0=(g==1)&&((gy0<1)||(gy0>5)),//!gy0,
        fy1=(g==1)&&((gy1<1)||(gy1>5)),//!gy1,
        fz0=(g==1)&&((gz0<1)||(gz0>5));
     //((g==2)||(g==1))&&(gz0!=1);
    //fx0=0;fx1=0;fz0=0;fy0=0;//fz1=0;
    if (g==6) {
      if (!gz0) {//gz0) {
      o.verts.push(v0=Pd5.vertNew(x  ,y  ,z,0,0));o.verts.push(v1=Pd5.vertNew(x+w,y  ,z,0,1));
      o.verts.push(v2=Pd5.vertNew(x  ,y+w,z,1,0));o.verts.push(v3=Pd5.vertNew(x+w,y+w,z,1,1));
      fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
      }
      if (!gz1) {
        o.verts.push(v0=Pd5.vertNew(x+w,y  ,z+w,0,0));o.verts.push(v1=Pd5.vertNew(x  ,y  ,z+w,0,1));
        o.verts.push(v2=Pd5.vertNew(x+w,y+w,z+w,1,0));o.verts.push(v3=Pd5.vertNew(x  ,y+w,z+w,1,1));
        fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
      }
      if (!gy0) {
  //o.verts.push(v0=Pd5.vertNew(x  ,y+w,z+w,0,0));o.verts.push(v1=Pd5.vertNew(x+w,y+w,z+w,0,1));
  //o.verts.push(v2=Pd5.vertNew(x  ,y+w,z  ,1,0));o.verts.push(v3=Pd5.vertNew(x+w,y+w,z  ,1,1));
        o.verts.push(v0=Pd5.vertNew(x  ,y,z+w,0,0));o.verts.push(v1=Pd5.vertNew(x+w,y,z+w,0,1));
        o.verts.push(v2=Pd5.vertNew(x  ,y,z  ,1,0));o.verts.push(v3=Pd5.vertNew(x+w,y,z  ,1,1));
        fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
        pa.push([x,y,z]);
      }
      if (!gy1) {
        o.verts.push(v0=Pd5.vertNew(x  ,y+w,z,0,0));o.verts.push(v1=Pd5.vertNew(x+w,y+w,z,0,1));
        o.verts.push(v2=Pd5.vertNew(x  ,y+w,z+w,1,0));o.verts.push(v3=Pd5.vertNew(x+w,y+w,z+w,1,1));
        fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
      }
      if (!gx0) {
  o.verts.push(v0=Pd5.vertNew(x,y  ,z+w,0,0));o.verts.push(v1=Pd5.vertNew(x,y  ,z  ,0,1));
  o.verts.push(v2=Pd5.vertNew(x,y+w,z+w,1,0));o.verts.push(v3=Pd5.vertNew(x,y+w,z  ,1,1));
  fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
      }
      if (!gx1) {
  o.verts.push(v0=Pd5.vertNew(x+w,y  ,z  ,0,0));o.verts.push(v1=Pd5.vertNew(x+w,y  ,z+w,0,1));
  o.verts.push(v2=Pd5.vertNew(x+w,y+w,z  ,1,0));o.verts.push(v3=Pd5.vertNew(x+w,y+w,z+w,1,1));
  fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
      }
      continue;
    }
    if (g==2) {
      //fz1=0;fx0=0;fx1=0;fy1=0;
      o.verts.push(v0=Pd5.vertNew(x  ,y  ,z+w,0,0));o.verts.push(v1=Pd5.vertNew(x+w,y  ,z+w,0,1));
      o.verts.push(v2=Pd5.vertNew(x  ,y+w,z,1,0));o.verts.push(v3=Pd5.vertNew(x+w,y+w,z,1,1));
      fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
    }
    if (g==5) {
      o.verts.push(v0=Pd5.vertNew(x  ,y+w  ,z+w,0,0));o.verts.push(v1=Pd5.vertNew(x+w,y+w,z+w,0,1));
      o.verts.push(v2=Pd5.vertNew(x  ,y,z,1,0));o.verts.push(v3=Pd5.vertNew(x+w,y,z,1,1));
      fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
      var inv=gy1==6;
      if (inv) {
        tri(x,y,z,0,0, x,y+w,z,1,0, x,y+w,z+w,1,1);  
        tri(x+w,y+w,z,1,0, x+w,y,z,0,0, x+w,y+w,z+w,1,1);  
      } else {
        if (!fx0&&!gx0) tri(x,y,z,0,0,     x,y,z+w,0,1, x,y+w,z+w,1,1);  
        if (!fx1&&!gx1) tri(x+w,y,z+w,0,1, x+w,y,z,0,0, x+w,y+w,z+w,1,1);  
      }
    }
    if (g==3) {
      o.verts.push(v0=Pd5.vertNew(x,y  ,z  ,0,0));o.verts.push(v1=Pd5.vertNew(x,y  ,z+w,0,1));
      o.verts.push(v2=Pd5.vertNew(x+w,y+w,z  ,1,0));o.verts.push(v3=Pd5.vertNew(x+w,y+w,z+w,1,1));
      fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
      var inv=gy1==6;
      if (inv) {
        tri(x,y,z+w,0,1, x,y+w,z+w,1,1, x+w,y+w,z+w,1,0);
        tri(x,y+w,z,1,0, x,y,z,0,0, x+w,y+w,z,1,1);
      } else {
        if (!fz0&&!gz0) tri(x+w,y  ,z  ,0,0, x  ,y  ,z  ,0,1, x+w,y+w,z  ,1,0);
        if (!fz1&&!gz1) tri(x  ,y  ,z+w,0,0, x+w,y  ,z+w,0,1, x+w,y+w,z+w,1,1);
      }
    }
    if (g==4) {
      o.verts.push(v0=Pd5.vertNew(x,y+w,z  ,0,0));o.verts.push(v1=Pd5.vertNew(x,y+w,z+w,0,1));
      o.verts.push(v2=Pd5.vertNew(x+w,y,z  ,1,0));o.verts.push(v3=Pd5.vertNew(x+w,y,z+w,1,1));
      fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
    }
    
    if (fz0) {
      o.verts.push(v0=Pd5.vertNew(x+w,y  ,z,0,0));o.verts.push(v1=Pd5.vertNew(x  ,y  ,z,0,1));
      o.verts.push(v2=Pd5.vertNew(x+w,y+w,z,1,0));o.verts.push(v3=Pd5.vertNew(x  ,y+w,z,1,1));
      fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
    } else if ((g==3)&&!gz0) {
      //o.verts.push(v0=Pd5.vertNew(x+w,y  ,z,0,0));o.verts.push(v1=Pd5.vertNew(x  ,y  ,z,0,1));
      //o.verts.push(v2=Pd5.vertNew(x+w,y+w,z,1,0));
      //fa.push(Pd5.triNew(v0,v1,v2));
    }
    
    if (fz1) {
      o.verts.push(v0=Pd5.vertNew(x  ,y  ,z+w,0,0));o.verts.push(v1=Pd5.vertNew(x+w,y  ,z+w,0,1));
      o.verts.push(v2=Pd5.vertNew(x  ,y+w,z+w,1,0));o.verts.push(v3=Pd5.vertNew(x+w,y+w,z+w,1,1));
      fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
    } else if ((g==3)&&!gz1) {
      //o.verts.push(v0=Pd5.vertNew(x  ,y  ,z+w,0,0));o.verts.push(v1=Pd5.vertNew(x+w,y  ,z+w,0,1));
      //o.verts.push(v2=Pd5.vertNew(x+w,y+w,z+w,1,1));
      //fa.push(Pd5.triNew(v0,v1,v2));
    } else if ((g==4)&&!gz1) {
      o.verts.push(v0=Pd5.vertNew(x  ,y  ,z+w,0,0));o.verts.push(v1=Pd5.vertNew(x+w,y  ,z+w,0,1));
      o.verts.push(v2=Pd5.vertNew(x,y+w,z+w,1,0));
      fa.push(Pd5.triNew(v0,v1,v2));
    } else if ((g==1)&&(gz1==3)) {
      o.verts.push(v0=Pd5.vertNew(x  ,y  ,z+w,0,0));o.verts.push(v1=Pd5.vertNew(x+w,y+w,z+w,1,1));
      o.verts.push(v2=Pd5.vertNew(x,y+w,z+w,1,0));
      fa.push(Pd5.triNew(v0,v1,v2));
    } else if ((g==1)&&(gz1==4)) {
      o.verts.push(v0=Pd5.vertNew(x+w,y  ,z+w,0,1));o.verts.push(v1=Pd5.vertNew(x+w,y+w,z+w,1,1));
      o.verts.push(v2=Pd5.vertNew(x,y+w,z+w,1,0));
      fa.push(Pd5.triNew(v0,v1,v2));
    }
    
    if (fx1) {
      o.verts.push(v0=Pd5.vertNew(x+w,y  ,z+w,0,0));o.verts.push(v1=Pd5.vertNew(x+w,y  ,z  ,0,1));
      o.verts.push(v2=Pd5.vertNew(x+w,y+w,z+w,1,0));o.verts.push(v3=Pd5.vertNew(x+w,y+w,z  ,1,1));
      fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
    } else if ((g==2)&&!gx1) {
      o.verts.push(v0=Pd5.vertNew(x+w,y  ,z+w,0,0));o.verts.push(v1=Pd5.vertNew(x+w,y  ,z  ,0,1));
      o.verts.push(v2=Pd5.vertNew(x+w,y+w,z,1,1));
      fa.push(Pd5.triNew(v0,v1,v2));
    }
  
    if (fx0) {
      o.verts.push(v0=Pd5.vertNew(x,y  ,z  ,0,0));o.verts.push(v1=Pd5.vertNew(x,y  ,z+w,0,1));
      o.verts.push(v2=Pd5.vertNew(x,y+w,z  ,1,0));o.verts.push(v3=Pd5.vertNew(x,y+w,z+w,1,1));
      fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
    } else if ((g==1)&&(gx0==2)) {
      o.verts.push(v0=Pd5.vertNew(x,y  ,z+w,0,1));o.verts.push(v1=Pd5.vertNew(x,y+w,z+w,1,1));
      o.verts.push(v2=Pd5.vertNew(x,y+w,z  ,1,0));
      fa.push(Pd5.triNew(v0,v1,v2));
    } else if ((g==1)&&(gx0==5)) {
      o.verts.push(v0=Pd5.vertNew(x,y  ,z,0,0));o.verts.push(v1=Pd5.vertNew(x,y+w,z+w,1,1));
      o.verts.push(v2=Pd5.vertNew(x,y+w,z  ,1,0));
      fa.push(Pd5.triNew(v0,v1,v2));
    } else if ((g==2)&&!gx0) {
      o.verts.push(v0=Pd5.vertNew(x,y  ,z  ,0,0));o.verts.push(v1=Pd5.vertNew(x,y  ,z+w,0,1));
      o.verts.push(v2=Pd5.vertNew(x,y+w,z  ,1,0));
      fa.push(Pd5.triNew(v0,v1,v2));
    } else if ((g==5)&&!gx0) {
      //o.verts.push(v0=Pd5.vertNew(x,y  ,z  ,0,0));o.verts.push(v1=Pd5.vertNew(x,y  ,z+w,0,1));
      //o.verts.push(v2=Pd5.vertNew(x,y+w,z+w  ,1,1));
      //fa.push(Pd5.triNew(v0,v1,v2));
    }
    if (fy1) {
      o.verts.push(v0=Pd5.vertNew(x  ,y+w,z+w,0,0));o.verts.push(v1=Pd5.vertNew(x+w,y+w,z+w,0,1));
      o.verts.push(v2=Pd5.vertNew(x  ,y+w,z  ,1,0));o.verts.push(v3=Pd5.vertNew(x+w,y+w,z  ,1,1));
      fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
    }
    if (fy0) {
      o.verts.push(v0=Pd5.vertNew(x  ,y,z,0,0));o.verts.push(v1=Pd5.vertNew(x+w,y,z,0,1));
      o.verts.push(v2=Pd5.vertNew(x  ,y,z+w,1,0));o.verts.push(v3=Pd5.vertNew(x+w,y,z+w,1,1));
      fa.push(Pd5.triNew(v0,v1,v2));fa.push(Pd5.triNew(v1,v3,v2));
    }
  }
  //-------
  ////fa.splice(902,1);
  var ofal=fa.length;//log(fa.length);
  //og('Generating map.');
  if ((ofal>0)&&!params.skipTriOpt) {
    Pd5.triOpt(o);//pd5Opt(o);
    log('triOpt: '+ofal+' -> '+fa.length);
  }
  //-------
  threeMeshUpdate(o,0);
  physTris=[];
  finishPhysTris(game.mapo);
  
  if (iso2EditMenu) return;
  //og('pa.len='+pa.length);
  if (0) //map.gridw) //---temp
  for (var i=0;i<20;i++) {
    var p=pa[rani(pa.length)],
    f=20;
    //load({fn:'objs/bane/o5'+(i%2==0?'dark':'')+'.txt',x:i-10,y:0,z:-6.5,s:8,env:1,rot:Math.random()*PI*2,castShadow:true,hs:true,loadedf:baneLoaded});
    load({fn:'objs/bane/o5.txt',x:p[0]/f+0.5,y:p[1]/f,z:p[2]/f-2.5,v:0.2,rotofs:PI/2,s:8,rot:Math.random()*PI*2
      ,castShadow:true,hs:true,loadedf:baneLoaded,
      ai_:ai,ai0:ai0,
  loadf:function(o5) {
    var j=o5.loadIndex%2;
    o5.meshes[0].diff='objs/bane/'+(j==0?'s':(j==1?'d':'n'))+'.jpg';
  }
  
      });
    //og(p[0]+' '+p[1]+' '+p[2]);
  }
  
  
  if (map.types) for (var k in map.types) if (map.types.hasOwnProperty(k)) loadTyp(k,map.types[k]);
  if (map.os) for (var i=0;i<map.os.length;i++) loadTypObj(map.os[i]);
  if (map.gridos) for (var j=0;j<map.gridos.length;j++) {
    var go=map.gridos[j];
    for (var i=0;i<go.count;i++) {
      var p=pa[rani(pa.length)],
      f=20;
      loadTypObj({typ:go.typ,x:p[0]/f+0.5,y:p[1]/f,z:p[2]/f-2.5,rot:Math.random()*PI*2});    
    }
  }
  
}
game.afterLoadGridMap=function() {
  console.log('game.afterLoadGridMap 0');
  if (!game.grido||!game.mapo) return;
  console.log('game.afterLoadGridMap 1');
  var o=game.grido,fn=gridfn;
  
  if (fn.endsWith('.map0.txt')) {
    map=o;
    o=map.grid;
    //og('nu map.');
    //if (map.startFp&&!iso2EditMenu) { Menu.remove();toggleView();Menu.draw(); }
  }
  
  if (deepMap) {
    var h={},dx=+33,dy=-25,dz=-30,h1={};
    for (var i=0;i<o.length;i++) {
      var a=o[i],x=-a[0]+dx,y=a[1]+dy,z=a[2]+dz;
      //h[x+'_'+y+'_'+z]={x:x,y:y,z:z};
      h1[x+'_'+y+'_'+z]=6;
    }
    /*
    for (var k in h) if (h.hasOwnProperty(k)) {
      var p=h[k],k2;
      if (!h[k2=((p.x-1)+'_'+p.y+'_'+p.z)]) h1[k2]=1;
      if (!h[k2=((p.x+1)+'_'+p.y+'_'+p.z)]) h1[k2]=1;
      if (!h[k2=(p.x+'_'+p.y+'_'+(p.z-1))]) h1[k2]=1;
      if (!h[k2=(p.x+'_'+p.y+'_'+(p.z+1))]) h1[k2]=1;
      if (!h[k2=(p.x+'_'+(p.y-1)+'_'+p.z)]) h1[k2]=1;
      if (!h[k2=(p.x+'_'+(p.y+1)+'_'+p.z)]) h1[k2]=1;
    }
    */
    game.grid=h1;
  } else 
    game.grid=o;//{'0_-1_-1':1};
  game.gridToMap();
  game.grido=undefined;
  if (map.cams0&&!iso2EditMenu&&game.md0) startCams(map.cams0);
}
function loadGridMap(fn) {
  gridfn=fn;
  //if (!game.mapo) return;
  Conet.download({fn:fn,nocache:1,f:function(v) {
    //log('isoWithEdit mapLoaded: '+JSON.parse(v));
    var o=JSON.parse(v);
    game.grido=o;
    game.afterLoadGridMap();
  }
  });
}
function initEditMenus(ma) {
  //og('isoWithEdit.initEditMenus');
  ma.push({s:'\u2190',px:0.02,py:0.02,pw:0.116,ph:0.116,ydown:true,fs:1.4,actionf:isoMenuArrow});
  ma.push({s:'\u2192',px:0.13,py:0.02,pw:0.116,ph:0.116,ydown:true,fs:1.4,actionf:isoMenuArrow});
  ma.push({s:'\u2191',px:0.13,py:0.13,pw:0.116,ph:0.116,ydown:true,fs:1.4,actionf:isoMenuArrow});
  ma.push({s:'\u2193',px:0.02,py:0.13,pw:0.116,ph:0.116,ydown:true,fs:1.4,actionf:isoMenuArrow});
  ma.push({s:'\u21d1',px:0.13,py:0.24,pw:0.116,ph:0.116,ydown:true,fs:1.4,actionf:isoMenuArrow});
  ma.push({s:'\u21d3',px:0.02,py:0.24,pw:0.116,ph:0.116,ydown:true,fs:1.4,actionf:isoMenuArrow});
  
  ma.push(mfile=Conet.fileMenu({defFn:gridfn,fn:'maps/isoWithEditFiles.txt',curFn:gridfn,loadf:loadGridMap,
  savef:function(fn) {
    //var fn=mfile.curFn;//gridfn;
    var datao=game.grid;
    if (fn.endsWith('.map0.txt')) {
      map.grid=game.grid;
      datao=map;
    }
    Conet.upload({fn:fn,data:JSON.stringify(datao,undefined,' '),f:function() {
      log('Grid saved to '+fn+'.');
    }
    });
  }
  ,newf:function() {
    game.grid={};
    game.gridToMap();
  }
  }));
  
  
  /*
  ma.push({s:'Save',ms:gridfn,fs:1.4,
  actionf:function() {
    var fn=gridfn;
    Conet.upload({fn:fn,data:JSON.stringify(game.grid),f:function() {
      log('Grid saved to '+fn+'.');
    }
    });
  }
  });
  */
  ma.push(game.mtyp={s:'Type',ms:'Block',autoval:2,autovala:1,a:1,fs:1.2,sub:[{s:'Block',a:1}
    ,{s:'Ramp Y0',a:5},{s:'Ramp Y1',a:2},{s:'Ramp X0',a:4},{s:'Ramp X1',a:3},{s:'InvBlock',a:6},{s:'Empty',a:7}]});
  ma.push(game.mdim={s:'Dimension',ms:'1x1x1',doctrl:'Dimension of cursor'
  ,valuef:function() {
    return this.ms;
  }
  ,setfunc:function(v) {
    this.ms=v;
  }
  });
  iso2EditMenu=1;
}
function toggleView() {
  //onsole.log(os);
  //onsole.log(camo);
  var ma=Menu.getMenus();
  //if (fixCam==2) {
  if (!defaultKeys) {
    for (var h=os.length-1;h>=0;h--) {
      var o=os[h];
      if (o.party==1) { setEgo(o);o.o5.animStop=0;break; }
    }
    
    //fixCam=2;twinstick=1;eyemd=5*gscale;
    eyemd=2*gscale;fixCam=0;camAx=0.3;camdr=0;camo.z=0;useEyew=true;doPhysicsBeam=true; 
    
    onFullscreenPointerLock=true;defaultKeys=true;
    ////ma.splice(ma.indexOf(mMove),1);
    if (!isVr) {
      Menu.arrayRemove(ma,mMove);
      ma.push(mLeft,mRight,mFront,mBack,mtLeft,mtRight,mAction,mCrouch);
    }
    threeEnv.fov=70;
    threeEnv.camera.fov=70;threeEnv.camera.updateProjectionMatrix();
    //---hack to register crouch key, todo: Menu.setMenus should register keys (and deregister old menu)
    if (!game.wasFp) { Menu.initLoad(ma);game.wasFp=1; } 
  } else {
    fixCam=2;camAx=0.5;camdr=Math.PI-0.5;onFullscreenPointerLock=false;defaultKeys=false;camo.z=-2;useEyew=false;doPhysicsBeam=false;//deepMap;
    camo.rot=0;ego=undefined;
    if (!isVr) {
    Menu.arrayRemove(ma,mLeft);
    Menu.arrayRemove(ma,mRight);
    Menu.arrayRemove(ma,mFront);
    Menu.arrayRemove(ma,mBack);
    Menu.arrayRemove(ma,mAction);
    Menu.arrayRemove(ma,mtLeft);
    Menu.arrayRemove(ma,mtRight);
    Menu.arrayRemove(ma,mCrouch);
    ma.push(mMove);
    }
    eyemd=5*gscale;
    threeEnv.fov=50;
    threeEnv.camera.fov=50;threeEnv.camera.updateProjectionMatrix();
  }
  Menu.roots=ma;
  Menu.setMenus(ma.concat(Menu.recent));
}
game.menuInit=function(ma) {
  //if (!game.noDefMenu) return ma;
  var w=0.24;
  ma[0].sub=[mrenderer,mresolution,mfullscreen
    //,{s:'Restart',fs:1.5,actionf:objsReset}
  ];//e-69
  ma[0].sub.push({s:'Edit',r:1,fs:1.5,keys:[],ms:'Add map tris',actionf:function() {
    
    var cdw=(map.gridw||40)/20;
    curso.x=Math.floor(curso.x/cdw)*cdw;
    curso.y=Math.floor(curso.y/cdw)*cdw;
    curso.z=Math.floor(curso.z/cdw)*cdw;
    
    
    if (!iso2EditMenu) {
      initEditMenus(ma);
      Menu.setMenus(ma.concat(Menu.recent));//Menu.roots.concat(Menu.recent);
      //Menu.cmenu=ma[0];
      //Menu.action();
      //Menu.action();
      return;
    }
    
    
    
    var grid=game.grid;
    if (!grid) { grid={};game.grid=grid; }
    var x=curso.x/cdw,y=curso.y/cdw,z=(curso.z/cdw+1),k=x+'_'+y+'_'+z,isdel=grid[k],da=game.mdim.ms.split('x');
    for (var xh=da[0]-1;xh>=0;xh--)
    for (var yh=da[1]-1;yh>=0;yh--)
    for (var zh=da[2]-1;zh>=0;zh--) {
      k=(xh+x)+'_'+(yh+y)+'_'+(zh+z);
      if (isdel) delete(grid[k]); else grid[k]=game.mtyp.a;
    }
    
    
    //var s='';
    //for (var h=0;h<o.verts.length;h++) { s+=o.verts[h].p0+'\n'; }
    //for (var h=0;h<fa.length;h++) {  var t=fa[h];s+=o.verts.indexOf(t.v0)+' '+o.verts.indexOf(t.v1)+' '+o.verts.indexOf(t.v2)+'\n';}
    //for (var h=0;h<physTris.length;h++) { var t=physTris[h];s+='physTris '+t.p0+', '+t.p1+', '+t.p2+'\n'; }
    //alert(s);
    
    game.gridToMap();
    
  }
  });
  if (is2d) ma.push(mLeft,mRight,mFront,mBack,mAction);
  else {
  mMove={s:'Move',px:1-w,py:0.02,pw:w,ph:0.12,ydown:true,fs:1.5,noa:true,keys:[32],actionf:function() {
    //log('mMOve');
    if (!ringo||!curso) return;
    if (ringo.refo) {
      ringo.refo.focus={x:curso.x,y:curso.y,z:curso.z};
      if (ringo.refo.o5.bb) ringo.refo.o5.bb.update=true;
    }
  }
    };
    if (!params.noMissionMenu) { //start with menu
      missionMenu(ma);
    } else
      ma.push(mMove);
    ma[0].sub.push({s:'Toggle View',vertCenter:1,actionf:toggleView});
  }
  
  ma[0].sub.push({s:'Toggle steps',vertCenter:1,actionf:function() {
    doSteps=!doSteps;
    for (var i=os.length-1;i>=0;i--) {
      var o=os[i];
      if (o.env) continue;
      o.o5.animStep=doSteps;
    }
  }
  });
  
  ma[0].sub.push({s:'Capture',vertCenter:1,actionf:function() {
    if (capturer) {
      capturer.stop();
      capturer.save();
      capturer=undefined;
      return;
    }
    capturer=new CCapture({format:'webm'});//,framerate:30});
    //capturer=new CCapture({format:'gif',workersPath:'js/'});//,framerate:30});
    capturer.start();
  }
  });
  if (is2d)
  ma.push({s:'Switch ego',vertCenter:1,actionf:function() {
    setEgo(opposed());
  }
  });
  
  
  if (params.startEdit) initEditMenus(ma);
  return ma;
}
startDraw();
//fr o,63,5
//fr o,68
//fr o,68,6
//fr o,68,7
//fr o,69
//fr o,71
//fr o,74
//fr o,74,209
//fr o,75
//fr o,76,2
//fr o,77,10
//fr o,77,29
//fr o,78
//fr p,5,85
