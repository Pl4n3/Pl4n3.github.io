//ABOUT: ...
ptd=0;usePtd=false;
eyemd0=0;
eyemd1=100;
eyemdd=1;//0.1;
//mute=1;


useEyew=false;
if (onlyThree) {
  //threeEnv.scale=1;
  threeEnv.fov=50;

  threeEnv.spotLight.intensity=1.5;
  //threeEnv.spotLight.shadowCameraNear=50;
  //threeEnv.spotLightRot=1;
  var dl=new THREE.DirectionalLight(0xffff77,0.9);
  dl.position.set(-1,-1,-1);
  threeEnv.scene.add(dl);
  
} else if (isGlge) { 
  glgeCam.fovy=50;gscale=2;mapw=50.4*gscale,maph=50.4*gscale;
  //glgeCam.far=2000*gscale;//500*gscale;//far;
  glgeCam.near=gscale;
}

//fixCam=2;
camo.x=5;camo.z=6;camo.y=5;camAx=0.6;camdr=-3.14;eyemd=6*gscale;eyeh=gscale*1;
twinstick=2;//camSmooth=1;
if (twinstick==2) {
  eyeh=1.5*gscale;camAx=0.2;eyemd=3*gscale;//camSmooth=10;
}
//iso=true;
//console.log(camo);
game.maxSoundDist=15;
game.bbDist=20;
game.noDefMenu=1;
game.tsd=Menu.touchSticksInit();
game.aiRandomWalkRect={x0:-20,z0:-20,x1:20,z1:20};
game.startUp=function() {
  var mhh=5;
  var enemy;
  
  function cload(o,ch) {
    ch.o5=o;loadPd5(ch);
    //if (ch.startAnim) o.anim=o.animh[ch.startAnim];
    //loadf(o);
  }
  
  
  function drawBb() {
    var bb=this;
    var ct=bb.ct,c=bb.c;
    var w=c.width,h=c.height*bb.ar,fs=0.5*w/bb.sc,x,y;
    var o=bb.o5.o;//if (!o) return;
    ct.clearRect(0,0,w,h);
    ct.fillStyle='rgba(0,0,0,0.5)';ct.fillRect(0,0,w,h);
    ct.font=fs+'px sans-serif';ct.textBaseline='top';
    ct.textAlign='start';shadowText(ct,o.bbName,2,2,'#ccc');
    //ct.textAlign='end';shadowText(ct,o.bbParty,w-2,2,'#aa0');
    ct.strokeStyle='#aaa';ct.strokeRect(0,0,w,h);
    ct.textAlign='center';ct.font=(fs*0.6)+'px sans-serif';ct.textBaseline='middle';
    //var o=bb.o5.o;//if (!o) return;
    ct.fillStyle='#a22';ct.fillRect(2,fs+3,(w-4)*o.health/o.mhealth,h-fs-5);
    shadowText(ct,o.health+'/'+o.mhealth+' HP',w/2,fs+4+(h-fs-5)/2,'#ccc');
  }
  
  
  //eyeh=gscale*(twinstick==2?1.5:1);
  //var z0=0;//4;
  load({fn:'objs/templar/o5.txt',x:0,y:0,z:22,ego:1,v:0.1,vr:twinstick==2?3:3,s:40,ssc:0.07,rot:PI,eyeh:0.33,ai0:ai0
    ,party:1,health:3,mhealth:3,bbName:'Protagonist',animr:[['idle','stand2'],['attack','attack2']]});
  for (var i=0;i<4;i++)
  load({fn:'objs/tripod/o5.txt',x:Math.random()*40-20,y:0,z:Math.random()*40-20,v:0.03,vr:1,s:40,ssc:0.07,rot:PI*Math.random()*2,eyeh:0.33,ai0:ai0,ai:ai
    ,party:2,radius:1,health:5,mhealth:5,bbName:'Antagonist',bbNameCol_:'#888',animr:[['lost','dead']],aiViewDist:7,aiRandomWalkRange:5*1});//,drawBb:drawBb});
  ////load({fn:'objs/tripod/o5.txt',x:3,y:0,z:z0,v:0.03,vr:0.75,s:40,ssc:0.07,rot:PI,eyeh:0.33,ai0:ai0,ai:ai
  ////  ,radius:1,health:5,mhealth:5,bbName:'Spider',bbParty:'Bad',animr:[['lost','dead']]});
  load({fn:'objs/gem/o5.txt',x:0,y:5,z:0,env:1,s:0.25,loadf:function(o) {
    //console.log(o);//...
    game.gem=o;
  }
  });
  //load({fn:'objs/beton/n3.txt',x:-15,y:0,z:15,s:3,env:1,collision:1,castShadow:false});//n11
  if (1)
  load({fn:'/canvas/w3dit/grassFloor.txt',x:-15,y:0,z:0,s:3,env:1,collision:1,castShadow_:true,phong:0});
  else
  load({fn:'objs/mapGen/beamIso2.txt',x:-15,y:0,z:0,s:3,env:1,collision:1,castShadow_:true,phong:0,
  diff:'xyz',loadf:function(o5) {
    o5.meshes[0].diff='/canvas/paint/grassFloor.png';//o5.norm;
    console.log(o5);
  }
  });//n11
  
  function initGrass(url) {
    //
    var geometry=new THREE.Geometry();game.pG=geometry;
    var sprite=THREE.ImageUtils.loadTexture(url);//urlPf('../canvas/paint/grass512brown.png'));
    //var sprite=THREE.ImageUtils.loadTexture(urlPf('images/grass.png'));//images/fog.png"));grass.png
    threeParticles(geometry,0,0,0,800,1600);//270,200
    var material = new THREE.ParticleBasicMaterial({size:190*threeEnv.scale,sizeAttenuation:true,map:sprite,transparent:true});//1500
    var particles = new THREE.ParticleSystem( geometry, material );
    particles.sortParticles = true;
    threeEnv.scene.add(particles);
    //...
  }
  
  //load({fn:'objs/fence/o5.txt',x:13,y:0,z:5,s:1,env:1,rot:-1.5});//5.5,0,-3.75,s:0.5
  if (!threeEnv) {
    load({fn:'objs/skybox/o5.txt',x:0,y:0,s:50,z:0,env:1,skybox:1,hs:false});
  } else { 
    threeEnv.scene.add(threeEnv.skyMesh); 
    //var geometry=new THREE.Geometry();game.pG=geometry;
    //var sprite=THREE.ImageUtils.loadTexture(urlPf('../canvas/paint/grass512brown.png'));
    ////var sprite=THREE.ImageUtils.loadTexture(urlPf('images/grass.png'));//images/fog.png"));grass.png
    //threeParticles(geometry,0,0,0,800,1600);//270,200
    //var material = new THREE.ParticleBasicMaterial({size:190*threeEnv.scale,sizeAttenuation:true,map:sprite,transparent:true});//1500
    //var particles = new THREE.ParticleSystem( geometry, material );
    //particles.sortParticles = true;
    //threeEnv.scene.add(particles);
    //setTimeout(initGrass,1000);//if (0) initGrass();
    if (1)
  Conet.download({fn:'/canvas/paint/grass512brown.png.txt',f:function(v) {
    initGrass(v);//alert(v);
  }
    });
    
    //threeEnv.fixLight=true;
    //var px=672,py=0,pz=-170;
    //threeEnv.spotLight.position.set(px+1000,py+500,pz+1000);
    //threeEnv.spotLight.target.position.set(px,py,pz);
  }
  
  game.gempos={x:0,y:0,z:0,c:0};
  
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
game.calco=function(o) {
  if ((o.party!=2)||(!o.health)) return;//..
  var p=game.gempos;
  p.x+=o.x;p.z+=o.z;p.c++;
}
game.calcLater=function() {
  var g=game.pG,f=20*threeEnv.scale/gscale,md=50000;
  if (ego&&g) {
  for (var i=g.vertices.length-1
    ;i>=0;i--) {
    var v=g.vertices[i],mid=Number.MAX_VALUE;
    for (var oi=os.length-1;oi>=0;oi--) {
      var o=os[oi];if (o.env) continue;
      var dx=v.x-o.x*f,dz=v.z-o.z*f,d=dx*dx+dz*dz;
      mid=Math.min(mid,d);//Math.floor(Math.random()*g.vertices.length)];
    }
    v.y=(mid<md)?-200*(1-mid/md):0;
    //onsole.log('calcLater '+v.x+' '+v.z+' - '+ego.x+' '+ego.z);
  }
  g.verticesNeedUpdate=true;
  }
  // onsole.log(os.length);
  
  if (game.gem) {
    var p=game.gempos;
    //game.gemt=(game.gemt||0)+dt;
    var o=game.gem.o;
    o.y=1+Math.abs(10*Math.sin(gtime//game.gemt
      *0.0001));
    if (p.c>0) {
      o.x=p.x/p.c;o.z=p.z/p.c;
      p.x=0;p.z=0;p.c=0;
    }
    //console.log(game.gem.y);
  }
  
  //if (ego&&game.gem) console.log('calcLater '+Vecmath.dist2(ego,game.gem.o));
  
  if (ego&&game.gem&&((ego.health==0)||(Vecmath.dist2(ego,game.gem.o)<5))&&!this.isMenu) { //gameOver
    var menus=Menu.getMenus();
    menus.push({s:'<span style="color:#f0f0f0;"><br><span style="color:#aaaaaa;font-size:0.75em;">'
      +(ego.health==0?'You lost! D: ':'You won! :D ')
      +' <span style="font-size:0.75em;">(time: '+Math.floor(gtime/100+0.5)/10+' sec)</span></span><br><br>Game Over'
      +'</span>',px:0.1,py:0.15+0.05,pw:0.4,ph:0.3,ydown:true,fs:0.25,bgcol:'rgba(0,0,0,0.7)',noinp:1});
    menus.push({s:'Restart',px:0.2,py:0.175+0.05,pw:0.2,ph:0.075,ydown:true,fs:1.2,bgcol:'rgba(200,200,200,0.2)'});
    Menu.roots=menus;//Menu.setMenuroots(menus);
    this.isMenu=true;
    //alert(menus.length);
    Menu.draw();
  }
  
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
  //camo.x=o0.x+dx/2+3*dz/2;camo.z=o0.z+dz/2-3*dx/2;
  //camdr=-PI/2-Math.atan2(-dx,dz);//eyeh=1;
  //eyemd=0;
  camo.x=o0.x+dx/2;camo.z=o0.z+dz/2;
  eyemd=1+Math.sqrt(dx*dx+dz*dz);
  
  
  //...
}
game.menuSwitch=function(m,a) {
  //alert(a);
  if (a=='Restart') {
    //Menu.seta([{s:'Huhu'}]);
    objsReset();
    
    var menus=Menu.getMenus();
    menus.splice(menus.length-2,2);
    Menu.roots=menus;//Menu.setMenuroots(menus);
    this.isMenu=false;
    
    //bt=0;bpi=0;lives=3;count=0;game.gemsInited=false;gamet=0;
    //mlives.s=mlives.c.innerHTML='Lives: '+lives;
    //setSpeed(1);
  }
}

startDraw();
//fr o,39
//fr o,39,3
//fr o,39,6
//fr o,39,18
//fr o,39,28
//fr o,39,45
//fr o,40
//fr o,41
//fr o,43
//fr o,44
//fr o,45
//fr p,36,177
