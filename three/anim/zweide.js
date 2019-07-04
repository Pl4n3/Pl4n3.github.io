//---
planim.scriptsLoaded.push(function () {
  var t=0,rani=planim.rani,mainz=-1,// = vr-cam-dist
      zoomOnMove=true,game=planim.game,
      camd=//zoomOnMove?5:
      2,camx=0,camy=0.75,player,//relates to planim ego,controlo but different semantics:
      //--- ego for cam, controlo for wasd controls
      threeEnv=planim.threeEnv,keys=planim.keys,pi2=Math.PI/2,
      base=planim.base,camt=0,mleft,mright,noinpt=0,noinph,maction,mapCfg;
  //...
  planim.addView({w:1,h:1,x:0,y:0,bg:1,noOrbitControls:1
    ,target:new THREE.Vector3(0,-0.40,-1.00),fov:zoomOnMove?40:60,bgcol:0x666666,vr_:1,camNear:0.15});
  
  var m=new THREE.MeshPhongMaterial({ color:0x333333,flatShading:true });
  planim.box(0,-1.9,mainz,20,0.2,2,m).castShadow=false;
  //planim.defaultLights();
  planim.base.add(l0=new THREE.AmbientLight(0xffffff,0.3));
  planim.pointLight({x:-1,y:2,z:mainz+2,col:0xffffff,dist:10,int:2});
  planim.pointLight({x:1,y:-2,z:mainz+2,col:0xffffff,dist:100,int:0.5,castShadow:false});
  
  function setPlayer(o) {
    player=o.ps;//...
  }
  function ai(dt) {
    
    if (1) return;
    
    var o=this;
    var dx=o.pos.x-player.pos.x,
        dy=o.pos.y-player.pos.y;
    
    var ol=dx>1.5,or=dx<-1.5;
    
    o.attack=false;
    o.zgoLeft=ol;
    o.zgoRight=or;
    if (ol||or) { o.attackt=0;return; }
    
    o.attackt+=dt;
    if (o.attackt<500) return;
    
    o.attack=true;
    
    //...
  }
  
  //console.log('zweide.js initing.');
  //console.log(game);
  
  if (planim.zweideMap) mapCfg=planim.zweideMap({mainz:mainz,setPlayer:setPlayer,ai:ai,
  etCamd:function(v) {
    camd=v;
    //...
  }
  });
  else
  (function() {
    planim.loadObjsThenLoop([
      {fn:'/shooter/objs/templar/o5.txt',pos:new THREE.Vector3(-1,-1.8,mainz),anim:'stand2',scale:2,animRun:'run',v:0.003,vrot:0.01,roty:1.5,onload:setPlayer,_ego:1},
      //{fn:'/shooter/objs/tripod/o5.txt',pos:new THREE.Vector3(1,-1.8,mainz),anim:'idle',scale:2,animRun:'run',v:0.003,roty:-1.5},
      //{fn:'/shooter/objs/shrub/conifer.json',pos:new THREE.Vector3(0,-1.8,mainz-0.7),scale:0.015,env:1},
      //{fn:'/shooter/objs/shrub/conifer.json',pos:new THREE.Vector3(-2,-1.8,mainz-1.7),scale:0.03,env:1},
      //{fn:'/shooter/objs/shrub/conifer.json',pos:new THREE.Vector3(-4,-1.8,mainz-2.7),scale:0.05,env:1},
      //{fn:'/shooter/objs/shrub/conifer.json',pos:new THREE.Vector3(-12,-1.8,mainz-4),scale:0.1,env:1},
      //{fn:'/shooter/objs/shrub/conifer.json',pos:new THREE.Vector3(12,-1.8,mainz-4),scale:0.1,env:1},
    ]);
  }
  )();
  if (!mapCfg) mapCfg={};
  
  var cam=planim.views[0].camera,cr=cam.rotation,cp=cam.position,inp0={},
      bp=base.position,cry=0,plMoved=true;
  bp.z=-(mainz+camd);
  bp.y+=camy;
  game.defMoves=1;
  planim.defMoveAi=undefined;
  planim.vrkeys=!zoomOnMove
  if (0)
  game.allLoaded=function() {
    console.log('zweide.allLoaded');
    //...
  }
  game.calcLater=function(dt) {
    t+=dt;
    if (!player) return;
    player.zgoLeft=//keys[74]||
      mleft.on;//j
    player.zgoRight=//keys[76]||
      mright.on;//l
    player.attack=maction.on;
    
    for (var i=threeEnv.os.length-1;i>=0;i--) {
      var o5=threeEnv.os[i],o=o5.ps;
      if (o.env) continue;
      o.goFront=false;o.turnLeft=false;o.turnRight=false;
      if (o.zgoRight) {
        if (o.roty<pi2) o.turnLeft=true; else { o.roty=pi2;o.goFront=true; }
        o.dir=1;noinpt=0;
      }
      if (o.zgoLeft) {
        if (o.roty>-pi2) o.turnRight=true; else { o.roty=-pi2;o.goFront=true; }
        o.dir=-1;noinpt=0;
      }
    }
    
    noinpt+=dt;
    if (0&&(noinpt>=5000)) {
      //onsole.log('noinp nao');
      //noinpt=0;
      if (noinpt>=7000) {
        noinph=undefined;
        noinpt=5000;
      }
      
      if (!noinph) noinph={cry:Math.random()*3-1.5};
      
      cry+=(noinph.cry-cry)/20;cr.y=cry;
      //camx=player.pos.x;
      bp.x=-(camx+Math.sin(cr.y)*camd);
      bp.z=-(mainz+Math.cos(cr.y)*camd);
    } else noinph=undefined;
    
    if (planim.ego) return;
    
    var plmo=player.zgoLeft||player.zgoRight||player.attack;
    
    
    
    
    //--- new tech straight cam, move near on player move
    
    if (zoomOnMove) { 
    
      var camdMove=4,camdIdle=planim._zCamIdle||10;
      if (plmo) { plMoved=true;cam.rotation.set(0,0,0);camd=Math.max(camdMove,camd-0.03*dt);camt=1000; }
      else if (plMoved) { camt-=dt; if (camt<=0) { camd=Math.min(camdIdle,camd+0.015*dt); }}
    
      if (//plmo||
        (plMoved&&(camd<camdIdle))) { //camt=1000;
      //if (camt>0) {
        //planim.vrkeys=false;
        camy=Math.min(2,Math.max(0,camy));  
        camx=player.pos.x;
    
        cry+=-cry/10;cr.y=cry;
        bp.x+=(-(camx+Math.sin(cr.y)*camd)-bp.x)/1;
        bp.z+=(-(mainz+Math.cos(cr.y)*camd)-bp.z)/1;
        bp.y+=(camy+planim.vrUserHeight-bp.y)/1;
        //camt-=dt;
      } else plMoved=false;//else planim.vrkeys=true;
    
    return;
    }
    
    
    
    
    //--- old tech cam turns into player move direction
    
    if (plmo) camt=1000;
    if (camt>0) {
      planim.vrkeys=false;
      camd=Math.max(0.5,camd+(((keys[87])?-1:0)+((keys[83])?1:0))*0.01*dt);
      camy=Math.min(2,Math.max(0,camy+((keys[81]?-1:0)+(keys[69]?1:0))*0.001*dt));
      
      camx=player.pos.x+(player.dir||0)*camd/2;//camx+=(player.pos.x-camx)/10;
      //camd=2;//camd+=(3-camd)/10;
      //onsole.log('zweide..calc camx='+camx+' camd='+camd);
    
      cry+=((player.zgoLeft?pi2/2:(player.zgoRight?-pi2/2:0))
        -cry)/10;cr.y=cry;//+=(0-cr.y)/10;
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
    //onsole.log('zweide inpmove');
    if (ps.dist) {
      //console.log('zweide.mousemove '+inp0.ang+' '+ps.ang);
      cr.y=Math.min(1.5,Math.max(-1.5,inp0.cry+ps.ang-inp0.ang));cry=cr.y;
      camd=Math.max(0.5,inp0.camd*inp0.dist/ps.dist);
    }
    if (inp0.button==2) {
      bp.y=inp0.bpy-camd*2/3*(ps.y-inp0.y);
      cr.y=Math.min(1.5,Math.max(-1.5,inp0.cry-ps.x+inp0.x));cry=cr.y;
    } else {
      var f=camd*2/3;
      //cp.x=inp0.cpx+f*(-ps.x+inp0.x);
      camx=inp0.camx+f*(-ps.x+inp0.x);
      bp.y=inp0.bpy-f*(ps.y-inp0.y);
    }
    
    bp.x=-(camx+Math.sin(cr.y)*camd);
    bp.z=-(mainz+Math.cos(cr.y)*camd);
    noinpt=0;
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
  ;
  //---init menus
  if (!mapCfg.skipMenu)
  (function() {
    //...
    
    mleft={s:'\u2190',ms:zoomOnMove?undefined:'<br><br>Key J',px:0.02,py:0.02,pw:0.116,ph:0.116,ydown:true,fs:1.4,keys:[74,65,37]};
    mright={s:'\u2192',ms:zoomOnMove?undefined:'<br><br>Key L',px:0.13,py:0.02,pw:0.116,ph:0.116,ydown:true,fs:1.4,keys:[76,68,39]};
    
    var m=planim.maction;maction=m;
    m.py=0.02;
    m.px=0;
    m.keys=[69];
    
    
    Menu.init([{s:'Menu',ms:planim.version+' zweide v.0.344 ',sub:[//FOLDORUPDATEVERSION
    planim.mfullscreen,planim.minitvr,
    {s:'1stPerson',keys:[86],actionf:function() {
      //---key V
      if (planim.ego) { 
        planim.ego=undefined;//delete(planim.ego);
        //camd=2;//camx=0;camy=0.75; 
        //bp.z=-(mainz+camd);
        //bp.y=camy;
        //bp.x=0;
        camt=1000;
        //base.position.copy(base.posold);
        //base.updateMatrix();
        //bp=base.position;
        base.matrixAutoUpdate=true;
      } else {
        //base.posold=new THREE.Vector3();
        //base.posold.copy(base.position);
        planim.ego=player;
      }
    }
    },
    {s:'Change<br>Person',keys:[80],fs:0.9,actionf:function() {
      //---key P
      var n=undefined,c=undefined,no=undefined;
      for (var i=threeEnv.os.length-1;i>=0;i--) {
        var o5=threeEnv.os[i],o=o5.ps;
        if (player===o) { c=i;continue; }//console.log(i);continue; }
        if (o.env) continue;
        if (n===undefined) { n=i;no=o; }
        if (c!==undefined) { n=i;no=o;break; }
      }
      
      //onsole.log('menu change person c='+c+' n='+n);
      player=no;camt=1000;
      if (planim.ego) planim.ego=player;
    }
    }
    ]},
    mleft,mright,planim.maction
    ],{listen:1,_keyLog:1});
    
    
    //console.log('--sdfsd-fsd-f-3223233');
    //...
  }
  )();
  //...
}
);
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,19
//fr o,1,28
//fr o,1,40
//fr o,1,48
//fr p,0,83
