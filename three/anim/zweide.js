//---
(function () {
  var t=0,rani=planim.rani,mainz=-1,// = vr-cam-dist
      camd=2,camx=0,camy=0.75,player,//relates to planim ego,controlo but different semantics:
      //--- ego for cam, controlo for wasd controls
      threeEnv=planim.threeEnv,keys=planim.keys,pi2=Math.PI/2,
      base=planim.base,camt=0,mleft,mright;
  //...
  planim.addView({w:1,h:1,x:0,y:0,bg:1,noOrbitControls:1
    ,target:new THREE.Vector3(0,-0.40,-1.00),fov:60,bgcol:0x666666,vr_:1,camNear:0.2});
  
  var m=new THREE.MeshPhongMaterial({ color:0x333333,flatShading:true });
  planim.box(0,-1.9,mainz,20,0.2,2,m).castShadow=false;
  //planim.defaultLights();
  planim.base.add(l0=new THREE.AmbientLight(0xffffff,0.3));
  planim.pointLight({x:-1,y:2,z:mainz+2,col:0xffffff,dist:10,int:2});
  planim.pointLight({x:1,y:-2,z:mainz+2,col:0xffffff,dist:100,int:0.5,castShadow:false});
  
  function setPlayer(o) {
    player=o.ps;//...
  }
  
  (function() {
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
  )();
  
  var cam=planim.views[0].camera,cr=cam.rotation,cp=cam.position,inp0={},
      bp=base.position,cry=0;
  bp.z=-(mainz+camd);
  bp.y+=camy;
  planim.game.defMoves=1;
  //planim.vrkeys=false;
  planim.game.calc=function(dt) {
    t+=dt;
    if (!player) return;
    player.goLeft=//keys[74]||
      mleft.on;//j
    player.goRight=//keys[76]||
      mright.on;//l
    
    for (var i=threeEnv.os.length-1;i>=0;i--) {
      var o5=threeEnv.os[i],o=o5.ps;
      if (o.env) continue;
      o.goFront=false;o.turnLeft=false;o.turnRight=false;
      if (o.goRight) {
        if (o.roty<pi2) o.turnLeft=true; else { o.roty=pi2;o.goFront=true; }
      }
      if (o.goLeft) {
        if (o.roty>-pi2) o.turnRight=true; else { o.roty=-pi2;o.goFront=true; }
      }
    }
    
    if (player.goLeft||player.goRight) camt=1000;
    if (camt>0) {
      planim.vrkeys=false;
      camd=Math.max(0.5,camd+((keys[87]?-1:0)+(keys[83]?1:0))*0.01*dt);
      camy=Math.min(2,Math.max(0,camy+((keys[81]?-1:0)+(keys[69]?1:0))*0.001*dt));
      
      camx=player.pos.x;//camx+=(player.pos.x-camx)/10;
      //camd=2;//camd+=(3-camd)/10;
    
      cry+=((player.goLeft?pi2/2:(player.goRight?-pi2/2:0))-cry)/10;cr.y=cry;//+=(0-cr.y)/10;
      bp.x+=(-(camx+Math.sin(cr.y)*camd)-bp.x)/10;
      bp.z+=(-(mainz+Math.cos(cr.y)*camd)-bp.z)/10;
    
      bp.y+=(camy+planim.vrUserHeight-bp.y)/10;
      camt-=dt;
    } else planim.vrkeys=true;
    //---
  }
  planim.inpDown=function(ps) {
    //onsole.log('zweide.mousedown '+x+' '+y);
    inp0={//cpx:cp.x,
          //cpy:cp.y,
          x:ps.x,y:ps.y,dist:ps.dist,camd:camd,
          button:ps.button,cry:cr.y,ang:ps.ang,camx:camx,
          bpy:bp.y};
  }
  planim.inpMove=function(ps) {
    if (ps.dist) {
      //console.log('zweide.mousemove '+inp0.ang+' '+ps.ang);
      cr.y=Math.min(1,Math.max(-1,inp0.cry+ps.ang-inp0.ang));cry=cr.y;
      camd=Math.max(0.5,inp0.camd*inp0.dist/ps.dist);
    }
    if (inp0.button==2) {
      bp.y=inp0.bpy-camd*2/3*(ps.y-inp0.y);
      cr.y=Math.min(1,Math.max(-1,inp0.cry-ps.x+inp0.x));cry=cr.y;
    } else {
      var f=camd*2/3;
      //cp.x=inp0.cpx+f*(-ps.x+inp0.x);
      camx=inp0.camx+f*(-ps.x+inp0.x);
      bp.y=inp0.bpy-f*(ps.y-inp0.y);
    }
    
    bp.x=-(camx+Math.sin(cr.y)*camd);
    bp.z=-(mainz+Math.cos(cr.y)*camd);
    
  }
  planim.mouseScroll=function(up) {
    //...
    camd+=up?-0.5:0.5;
    camd=Math.max(0.5,camd);
    //cp.z=mainz+camd;
    bp.x=-(camx+Math.sin(cr.y)*camd);
    bp.z=-(mainz+Math.cos(cr.y)*camd);
    
    //onsole.log('zweide.mouseScroll '+up);
  }
  
  Menu.init([{s:'Menu',ms:planim.version+' zweide v.0.113 ',sub:[//FOLDORUPDATEVERSION
  {s:'Fullscreen',actionf:function() {
    var c=document.body;
    if (c.requestFullscreen) c.requestFullscreen();
    else if (c.mozRequestFullScreen) c.mozRequestFullScreen();
    else if (c.webkitRequestFullScreen) c.webkitRequestFullscreen();
    //...
  }
  },
  {s:'Init VR',actionf:function() {
    planim.initVr();
  }
  }]},
  mleft={s:'\u2190',ms:'<br><br>Key J',px:0.02,py:0.02,pw:0.116,ph:0.116,ydown:true,fs:1.4,keys:[74]},
  mright={s:'\u2192',ms:'<br><br>Key L',px:0.13,py:0.02,pw:0.116,ph:0.116,ydown:true,fs:1.4,keys:[76]}
  ],{listen:1});
  //...
}
)();
//console.log('YOIUOkokooko');
//fr o,1
//fr p,0,19
