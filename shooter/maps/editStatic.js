//ABOUT: W3dit export map for static objs (game levels with collision)
ptd=0;usePtd=false;
camAx=0.2;
eyemd0=0;
eyemd1=100;
eyemdd=0.1;
physDampE=0.5;

//var mhealth;
mute=true;

useEyew=true;
if (onlyThree) {
  //threeEnv.scale=1;
} else if (isGlge) { 
  glgeCam.fovy=50;gscale=2;mapw=50.4*gscale,maph=50.4*gscale;
  //glgeCam.far=2000*gscale;//500*gscale;//far;
  glgeCam.near=gscale;
}
eyeh=1*gscale;
//eyemd=isGlge?4.5*gscale:3;//isGlge?7:4;//4*gscale;//15;
eyemd=3*gscale;
var posa=[],fposa=[],freePosPending=[];

if (params.twinstick) {
//fixCam=2;
camo.x=5;camo.z=6;camo.y=5;camAx=0.6;camdr=-3.14;eyemd=6*gscale;
twinstick=2;//
if (twinstick==2) {
  eyeh=1.5*gscale;camAx=0.2;eyemd=3*gscale;//camSmooth=10;
}
//iso=true;
//console.log(camo);
game.noDefMenu=1;
game.tsd=Menu.touchSticksInit();
}

game.sounds.botWalk=function() {
  //return {src:'stepf1'};
  return {src:'stepf'+[1,8,5][Math.floor(Math.random()*3)]+'s'};
}
game.sounds.stepx=function() {
  //return {src:'stepf1'};
  return {src:'stepf'+[4,2,7][Math.floor(Math.random()*3)]+'s'};
}
game.sounds.scream=function() {
  //return {src:'stepf1'};
  return {src:'jumpend'};
}
game.paramsPd5Loadf=function(o) {
  //og('game.paramsPd5Loadf '+o.verts.length);
  //ego.z=20;
  var idh={};
  for (var h=o.verts.length-1;h>=0;h--) {
    var v=o.verts[h];
    if (v.mark) {
      //console.log(v.p0);
      //console.log(v.p1);
      //console.log(v);
      var p=v.p1;
      //ego.x=p.x/20;ego.y=-p.y/20;ego.z=p.z/20;
      var ph={x:p.x/20,y:-p.y/20,z:p.z/20,mark:v.mark};
      var a=v.mark.split(' ');
      for (var i=a.length-1;i>=0;i--) {
        var m=a[i];
        if (m.startsWith('{')) {
          var o9=JSON.parse(m);
          //if (o9.id) ph.id=o9.id;
          //if (o9.nest) ph.next=o9.next;
          Pd5.hcopy(o9,ph);
          //alert(o9.id);
        }
        var ih=m.indexOf('=');
        if (ih==-1) continue;
        ph[m.substr(0,ih)]=m.substr(ih+1);
      }
      //log(v.mark);
      if (ph.id) {
        idh[ph.id]=ph;
        posa.push(ph);
        fposa.push(ph);
      }
      if (ph.fn) {
        load({fn:ph.fn,x:ph.x,y:ph.y,z:ph.z,s:ph.s,castShadow:ph.cs,env:1,rot:ph.rot,transparent:1,physTris:1});
      }
    }
  }
  console.log('editStatic game.paramsPd5Loadf posa.len='+posa.length+' fposa.len='+fposa.length);
  for (var h=posa.length-1;h>=0;h--) {
    var p=posa[h];
    if (p.next) for (var i=p.next.length-1;i>=0;i--) 
      p.next[i]=posa.indexOf(idh[p.next[i]]);
  }
  /*
  //calc next positions for each position
  for (var h=posa.length-1;h>=0;h--) {
    var p=posa[h];
    var md=1000;
    for (var i=posa.length-1;i>=0;i--) {
      if (i==h) continue;
      var q=posa[i];
      var d=dist(p,q);
      var same=(2*Math.abs(d-md)/(d+md))<0.3;
      if (same) p.next.push(i); else if (d<md) { md=d;p.next=[i]; }
    }
    //log('next '+h+' '+p.next.length);
  }
  */
  
  for (var h=0;h<freePosPending.length;h++) {
    if (fposa.length==0) break;
    freePos(freePosPending[h]);
  }
}

var ai0=function() {
  var o5=this.o5;
  
  if (this.health==0) return false;
  if (this.hite) {
    this.specialAnim=o5.animh.hit;
    var e=this.hite;
    if (e.o==ego) e.o.rotfocus=this;
    var dx=this.x-this.hite.x;
    var dy=this.y-this.hite.y;
    var dz=this.z-this.hite.z;
    var l=Math.sqrt(dx*dx+dy*dy+dz*dz);
    var vf=300;//500
    //this.vx=dx*vf/l;
    //this.vz=dz*vf/l;
    //this.vy=-vf;
    this.hitt+=dt;
    if (this.hitt>100) {
      this.specialAnim=undefined;
      this.focus=e.o;this.focust=0;
      this.hite=undefined;
      this.health=Math.max(0,this.health-(e.c?e.c:1));
      //if (this==ego) mhealth.c.innerHTML='Health <b>'+Math.floor(this.health*100/this.mhealth+0.5)+'</b>%';    
      if (this.health==0) {
        this.specialAnim=o5.animh.lost;
      }
    }
    return false;  
  }
  
  if (this.rotfocus) {
    var da=dAngle(this,this.rotfocus);
    var mda=0.003*dt;
    if (Math.abs(da)>mda) { da=da<0?-mda:mda; }
    this.rot+=da;
  }
  
  
  var md=Number.MAX_VALUE;
  var oh=undefined;
  for (var i=os.length-1;i>=0;i--) {
    var o=os[i];
    if (o.env||!o.hs) continue;
    if (o==this) continue;
    var d=dist(this,o);
    if (d<md) { md=d;oh=o; }
  }
  
  //this.goLeft=false;this.goFront=false;this.goBack=false;this.goRight=false;
  if (md<1.5) {
    var da=dAngle(this,oh);
    var daa=Math.abs(da);
    if (daa<PI/4) this.goBack=true; 
    else if (daa<3*PI/4) {
      if (da<0) this.goLeft=true; else this.goRight=true;
    } else this.goFront=true;  
    //if (this.goSrc!=oh.goSrc) this.focus=oh;
  } //else {
  
  return true;
}
var ai=function() {
  this.ait+=dt;
  
  if (this.focus) {
    this.targetDistA(this.focus);
    var d=this.aid,da=this.aida,daa=Math.abs(da);
    
    var turnrun=false;
    if (this.stopt==undefined) this.stopt=0;
    if (this.stopt>0) 
      this.stopt-=dt;
    else 
      turnrun=this.turnMove(2.5);
    if (!turnrun) {
      if (this.didRun) {
        this.didRun=false;
        this.stopt=500;
      }
    }
  
    if ((d<=2.5)&&(daa<=0.1)) this.attack=true; 
    if (this.focust==undefined) this.focust=0;
    this.focust+=dt;
    if (this.focust>5000) {
      this.focus=undefined;
      this.focust=undefined;
    }
    return;
  } 
  //this.rot+=0.01*dt;
  if (posa.length>0) {
  
  if (this.posaNeart===undefined) this.posaNeart=0;
  this.posaNeart+=dt;
  
  if ((this.posai===undefined)||(this.posaNeart>2000)) {
    var md=Number.MAX_VALUE,posai=-1;
    for (var h=posa.length-1;h>=0;h--) { var d=dist(this,posa[h]);if (d<md) { md=d;posai=h; }}
    this.posaNeart=0;
    //onsole.log('posaNearest posai='+posai);
    
    if (this.posai===undefined) {
      this.posai=posai;
      var next=posa[posai].next;this.target=next[rani(next.length)];
    } else {
      if ((posai!=this.posai)&&(posai!=this.target)) {
        //onsole.log('posaNearest new target '+posai);//ad this.posai='+this.posai+' this.target='+this.target+' posai='+posai);
        this.target=posai;
      }
    }
    //var target=rani(posa.length-1);if (target>=this.posai) target++;this.target=target;  
  }
  
  this.targetDistA(posa[this.target]);
  if (!this.turnMove(0.5)) {
    this.posai=this.target;
    var next=posa[this.posai].next;this.target=next[rani(next.length)];
    //var target=rani(posa.length-1);if (target>=this.posai) target++;this.target=target;  
  }
  }
}

function freePos(o) {
  //onsole.log(o);
  //og('freePos '+fposa.length);
  if (fposa.length==0) { freePosPending.push(o);return; }
  var i=Math.floor(Math.random()*fposa.length);
  var p=fposa[i];fposa.splice(i,1);
  o.x=p.x;o.y=p.y;o.z=p.z;
  if (p.rot&&(o==ego)) o.rot=parseFloat(p.rot);
}

//game.sounds.step=game.sounds.stepx;
game.startUp=function() {
  var mhh=5;
  var enemy;
  
  //{"id":"p0","n":["p1","p2"]}
  
  
  
  function targetDistA(p) {
    this.aid=dist(this,p);
    this.aida=dAngle(this,p);//,daa=Math.abs(da)
  }
  function turnMove(targetRange) {
    //var p=target;//posa[this.target];
    var d=this.aid,da=this.aida,daa=Math.abs(da),turnrun=false;
    if (da<-0.1) { this.turnLeft=true;this.didRun=true;turnrun=true; }
    else if (da>0.1) { this.turnRight=true;this.didRun=true;turnrun=true; }
    if (d>targetRange) {
      if (daa<0.5) {
        this.goFront=true;
        this.didRun=true;
        turnrun=true;
      }
    }
    return turnrun;
    // else {
    //  this.posai=this.target;
    //  var target=rani(posa.length-1);if (target>=this.posai) target++;this.target=target;  
    //}
    
  }
  
  function botLoadedf(o) {
    
    var ah=o.o5.animh;
    ah.idle=ah.stand;
    ah.attack=ah.attackmid;
    
    
    //log('posa.len='+posa.length);
    //var p=posa[0];//Math.floor(Math.random()*posa.length)];
    //o.x=p.x;o.y=p.y;o.z=p.z;
    freePos(o);
  }
  function frogLoadedf(o) {
    var ah=o.o5.animh;
    ah.idle=ah.stand;
    ah.lost=ah.dead;
    
    //var p=posa[1];
    //o.x=p.x;o.y=p.y;o.z=p.z;
    o.targetDistA=targetDistA;
    o.turnMove=turnMove;
    freePos(o);
  }
  function templarLoadedf(o) {
    //og('templarLoadedf');
    var ah=o.o5.animh;
    ah.idle=ah.stand2;
    ah.cidle=ah.cstand;
    ah.attack=ah.attack2;
    console.log('editStatic templarLoadedf before freePos');
    freePos(o);
  }
  
  
  //load({fn:'objs/h/samus/o2.txt',x:0,y:0,z:0,physC:2,v:0.3,rotofs:PI,s:8,ego:true,sasc:0.07,rot:-PI,eyeh:0.33});
  //load({fn:'objs/bullet/simple.txt',x:0,y:0,z:0,physC:2,v:0.3,rotofs:PI,s:8,ego:true,sasc:0.07,rot:-PI,loadf:botLoadf,eyeh:0.33,ai:ai,ai0:ai0,health:mhh,mhealth:mhh});
  //load({fn:'objs/bullet/simple.txt',x:0.2,y:0,z:-3,physC:2,v:0.3,rotofs:PI,s:8,sasc:0.07,rot:0,loadf:botLoadf,eyeh:0.33,ai:ai,ai0:ai0,health:mhh,mhealth:mhh,diff:'objs/bot/d2.jpg',loadedf:enemyLoaded});
  //load({fn:'objs/bot/o5.txt',x:0.2,y:0,z:-3,ego:1,physC:1,v:1,rotofs:PI,s:8,sasc:0.07,rot:0,eyeh:0.33,loadf:botLoadf});
  
  //load({fn:'objs/bot/o5.txt',x:-0.12,y:-1.5,z:8.15,ego:1,physC:1,v:1,rotofs:PI,s:8,sasc:0.07,rot:2.6,eyeh:0.33,loadf:botLoadf});
  //load({fn:'objs/bot/o5.txt',x:7.5,y:-1.5,z:7,ego:1,v:1,rotofs:PI,s:8,sasc:0.07,rot:2.6,eyeh:0.33,loadedf:botLoadedf,ai:ai,ai0:ai0,health:mhh,mhealth:mhh});
  
  
  
  function initAi(h) {
    h.ai0=ai0;h.ai=ai;h.health=mhh;h.mhealth=mhh;
  }
  
  var h;
  console.log('editStatic game.startUp loading templar');
  load(h={fn:'objs/templar/o5.txt',attackr:1,x:0,y:0,z:0,v:0.1,vr:twinstick?3:1,s:40,ssc:0.07,shhe:0.02,ego:true,rotofs:0,rot:PI,loadedf:templarLoadedf});initAi(h);
  //load(h={fn:'objs/frog/o5.txt',x:7.5,y:-1.5,z:7,ssc:0.1,v:0.03,s:50,sasc:0.07,rot:2,loadedf:frogLoadedf});initAi(h);
  ////load({fn:'objs/bot/o5.txt',x:3,y:0,z:0,physC:2,v:0.3,rotofs:PI,s:8,sasc:0.07,rot:-PI/4,loadf:botLoadf,eyeh:0.33});
  ////fixCam=true;useEyew=false;camo.rot=PI+1.4;camo.x=2;camo.z=-2.5;
  
  //load({fn:'objs/beton/n3.txt',x:0,y:0,z:0,s:1,env:1,collision:1,castShadow:false});//n11
  ////load({fn:'objs/beton/hud.txt',x:0,y:0,z:0,s:1,env:1,castShadow:false,diff:'canv:',hud:true,texCanvFunc:hudf});//n11
  
  
  
  //load({fn:'objs/fence/o5.txt',x:13,y:0,z:5,s:1,env:1,rot:-1.5});//5.5,0,-3.75,s:0.5
  if (!threeEnv) {
    load({fn:'objs/skybox/o5.txt',x:0,y:0,s:50,z:0,env:1,skybox:1,hs:false});
  } else { 
    threeEnv.				scene.add(threeEnv.skyMesh); 
    //threeEnv.fixLight=true;
    //var px=672,py=0,pz=-170;
    //threeEnv.spotLight.position.set(px+1000,py+500,pz+1000);
    //threeEnv.spotLight.target.position.set(px,py,pz);
  }
  
  
  
  
  loadPd5Start=loadIndex;
  
  //loadPd5(cubi2,5,0,-1);
  
}

startDraw();
//fr o,24
//fr o,35
//fr o,35,12
//fr o,35,25
//fr p,14,6
//fr x,compile.cmd,copyto D:/tools/Dropbox/Public/shooter/maps
