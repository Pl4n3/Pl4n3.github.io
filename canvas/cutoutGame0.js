function tmenu(ma) {
  ma.push({s:'<div style="padding:20px;">'
    //+'<span style="font-size:1.7em;color:#f80">Cutouts</span><br>'
    +'Game mission: Attack the green reptiles. Try to fight only single ones, health regenerates over time.'
    +'<span style="font-size:0.7em;color:#888;"><br>Controls depend on system/browser: keys (wasd,cursor,ctrl), touch or gamepad.</span></div>'
    //,padding:'1em'
    ,px:0.3,py:0.15,pw:0.4,ph:0.3,ydown:true,fs:0.165,tesh:1,bosh:1,col:'#ccc',bgcol:'rgba(0,0,0,0.7)',bocol:'rgba(200,200,200,0.5)',noinp:1});
  //ma.push({s:'<span style="color:#f0f0f0;"><br><span style="color:#aaaaaa;font-size:0.75em;">'+42+' Points <span style="font-size:0.75em;">(time: '+555+' sec)</span></span><br><br>Game Over'+
  //  '</span>',px:0.3,py:0.15,pw:0.4,ph:0.3,ydown:true,fs:0.25,bgcol:'rgba(0,0,0,0.7)',noinp:1});
  ma.push({s:'Start',px:0.4,py:0.17,pw:0.2,tesh:1,ph:0.075,ydown:true,fs:1.4,bgcol:'rgba(200,200,200,0.2)',col:'#af0',
  actionf:function () {
    //...
    
    var menus=Menu.getMenus();
    menus.splice(6,menus.length-1);
    Menu.roots=menus;//Menu.setMenuroots(menus);
    for (var h=canattack.length-1;h>=0;h--) {
      var o=canattack[h];
      o.init={x:o.seg0.x,y:o.seg0.y,dir:o.dir};
    }
    isMenu=false;
    //this.isMenu=false;
    //bt=0;bpi=0;lives=3;count=0;game.gemsInited=false;gamet=0;
    //mlives.s=mlives.c.innerHTML='Lives: '+lives;
    //setSpeed(1);
    
    
    
    //...
  }
  
  });
  
}
var grass=[],appt=0;
game={
isCamy:true,
init:function(ps) {
  var ma=ps.ma;
  ma.push(mleft={bosh:1,tesh:1,s:'\u2190',px:0.02,py:0.02,pw:0.116,ph:0.116,ydown:true,fs:1.4,noa:true,keys:[37,65],gpbu:[14]});//mleft
  ma.push(mright={bosh:1,tesh:1,s:'\u2192',px:0.13,py:0.02,pw:0.116,ph:0.116,ydown:true,fs:1.4,noa:true,keys:[39,68],gpbu:[15]});//mright
  ma.push(mjump={bosh:1,tesh:1,s:'\u2191',px:1-0.23,py:0.02,pw:0.116,ph:0.116,ydown:true,fs:1.4,noa:true,keys:[38,87],gpbu:[12]});//mtleft
  //ma.push(mattack={s:'A',px:1-0.12,py:0.02,pw:0.116,ph:0.116,ydown:true,fs:1.4,noa:true,keys:[17,69]});//mtright
  ma.push(mattack={bosh:1,tesh:1,s:'\u21b2',px:1-0.12,py:0.02,pw:0.116,ph:0.116,ydown:true,fs:1.4,noa:true,keys:[17,69,13],gpbu:[0]});//mtright
  ma.push(mzoom={bosh:1,tesh:1,s:'\u2315',px:1-0.084,py:0.02+0.11,pw:0.08,ph:0.08,ydown:true,fs:1.4,noa:true,keys:[81],gpbu:[1]});//mtright
  //2315-lupe 221e-infinity
  //ma.push(mlog={s:'<b>Log:</b>',px:0.02,py:0.02,pw:0.2,ph:0.2,noinp:true,fs:0.1,log:true});
  //var menus=Menu.getMenus();
  var initMenu=0;
  if (initMenu) {
    tmenu(ma);
    //Menu.roots=menus;//Menu.setMenuroots(menus);
    //this.isMenu=true;
    ////alert(menus.length);
    //Menu.draw();
    isMenu=true;
  } else isMenu=false;
  
  
  animActions.lirun=function(o) {
    var f0=rani(40,20);//50;
    sound([{f:f0,v:0,n:1},{t:10,v:1},{t:240,v:0}],o);//same as createOsc
    //sound([{f:f0,v:0,n:n},{t:10,v:mv},{t:200,v:mv},{t:140,v:0}]);
    var osc=o.sc,dx=o.dir*20*osc;
    createParticles(o.seg0.x+dx*4,o.seg0.y,o.seg0.z+20,5,dx,2*osc,0.04,0,-0.1*osc,500,1500,hbooms);
  }
  animActions.liattack=function(o) {
    //var f0=rani(100,200),f1=rani(25,50);//200,50
    //var f0=rani(150,100),f1=rani(75,50);//200,100
    //var f0=300,f1=200;
    var f0=rani(250,100),f1=rani(175,50);//200,100
    //var mv=(o==camo?0.3:0.1),n=2;
    //sound([{f:f0,v:0,n:n},{t:10,v:mv},{t:240,v:0,f:f1}]);//same as createOsc
    o.attackGain=sound([{f:f0,v:0,n:2},{t:10,v:1},{t:150,v:1},{t:140,v:0,f:f1}],o);
  }
  
  
  var grounds=[
  
    //{x:-700,y:-65-295-130,sc:0.5},
    //{x:-700,y:-65-295-295,sc:0.5},
  
    {x:-1600,y:-300,sc:2},
    {x:-2000,y:-300-650,sc:2},
    {x:-1000,y:0},
    {x:-1100,y:-240,sc:0.5},
    //{x:-1100,y:-240-165,sc:0.5},
    {x:-700,y:-65,sc:0.5},
    {x:-500,y:-65-130,sc:0.5},
    {x:-500,y:-65-295,sc:0.5},
    {x:-300,y:-65,sc:0.5},
  
    {x:0,y:0},
    {x:400,y:0},
    {x:800,y:0},
    {x:1200,y:0},
    {x:1600,y:-280},
    {x:2000,y:-280-280},
    {x:2000,y:-280-280-325},
  /*
    {x:-140,y:-600,sc:0.5},
    {x:-140+200,y:-600,sc:0.5},
    {x:-140+400,y:-600-130,sc:0.5},
    {x:-140+600,y:-600-260,sc:0.5},  
    
    {x:900,y:-600,sc:0.5},
    {x:1100,y:-600,sc:0.5},
  
    //{x:400,y:-400,sc:0.5},
    //-------
    {x:-900,y:-800,sc:0.5},
    {x:-700,y:-800-130,sc:0.5},
    {x:-500,y:-800-260,sc:0.5},
    {x:-300,y:-800-390,sc:0.5},
    {x:-100,y:-800-590,sc:0.5},
    {x:100,y:-800-520,sc:0.5},
    {x:300,y:-800-520,sc:0.5},
    {x:500,y:-800-520,sc:0.5},
    {x:700,y:-800-520,sc:0.5},
    {x:900,y:-800-590,sc:0.5},
    {x:1600,y:-800-620,sc:2},
    {x:1800,y:-800-980,sc:0.5},
    {x:1800,y:-800-980-165,sc:0.5},
    {x:1800,y:-800-980-165-165,sc:0.5},
    //{x:2200,y:-800-1020,sc:2},
  */
  ];
  
  
  function olsky(o) {
    //og('olsky');
    sky=o;
    vis(o);
  }
  function ollizard(o) {
    //og('ollizard');
    //if (o.p.camo) camo=o;
    
    if (o.p.camo) {//o.is==0) { 
      camo=o;
      if (edit) { 
        oe=o;selai=1; 
      }
      //o.speed=2;
      //o.seg0.xs=1;o.seg0.ys=1; 
    } //else o.ai=true;
    o.dir=o.seg0.xs>0?1:-1;
    o.sc=Math.abs(o.seg0.xs);
    
    if (o.is>=5) o.seg0.y-=1300;
    
    if (!edit) {
      o.canfall=true;
      o.speed=2;
    }
    o.v=0.8;
    //o.falling=true;
    o.anim=o.anims[1].a;
    o.trun=rani(1200,4000);
    o.hbary=280;
    o.mhealth=10;
    o.health=o.mhealth;//o.p.camo?o.mhealth:1;
    //o.seg0.y=-o.is*25;
    //0.5+o.is*0.5;
    //var sc=1-o.is/12;o.seg0.xs=sc;o.seg0.ys=sc; 
    //o.r={x:-70,y:-250,w:140,h:250};
    o.x=-70;o.y=-250;o.w=140;o.h=250;
    vis(o,o.p.dz?o.p.dz:0);//200-o.is*10);
    canattack.push(o);o.hitt=0;o.swordt=0;
    if (!initMenu) o.init={x:o.x,y:o.y,dir:o.dir};
  }
  function loadboom(o) {
    hbooms.push(o);
    //alert(toStr(o));
    //alert(toStr(clone(o)));
    //vis(o);
  }
  function loadhhunt(o) {
    oe=o;vis(o);
  }
  function loadground(o) {
    var g=grounds[o.is];
    o.seg0.x=g.x;o.seg0.y=g.y+700;
    if (g.sc) { o.seg0.ys=g.sc;o.seg0.xs=g.sc; }
    
    o.x=-200*o.seg0.xs;o.y=-130*o.seg0.ys;o.w=400*o.seg0.xs;o.h=300*o.seg0.ys;
    vis(o);
    groundInited=true;
  }
  function loadcat(o) {
    //oe=o;
    o.hbary=550;
    vis(o);
  }
  
  iw=1512;iw0=1512;
  
  var s0=edit?1:0.5;//0.5;
  var licount=1;//10;//20
  //load({fn:'paint/lizard',xp:80,yp:(edit?-100:-110-300),xsp:s0,ysp:s0,iw:512,camo:true,onload:ollizard,count:1,hasShadow:true,dz:10,filter:filterGreenToRed});
  
  
  
  
  load({fn:'paint/lizard',xp:30,yp:(edit?-100:-665+700),xsp:s0,ysp:s0,iw:512,camo:true,onload:ollizard,count:1,hasShadow:true,dz:10,filter_:filterGreenToRed,hasHbar:true});
  load({fn:'paint/hbar',xp:0,yp:-110,xsp:2,ysp:0.5,iw:64,pool:hbars,count:2+licount});
  //load({fn:'paint/lizard',xp:500,yp:-210+700,xsp:s0,ysp:s0,iw:512,onload:ollizard,count:licount,hasShadow:true,ai:true,hasHbar:true});
  
  //var s2=0.3*gls;//0.5
  //load({fn:'paint/h/hunt',xp:-200*gls,yp:-110*gls,xsp:s2,ysp:s2,iw:1024,onload:loadhhunt,hasShadow:true,shadowScale:0.5});
  
  
  ////load({fn:'paint/lizard',xp:300,xsp:s0,ysp:s0,iw:512,camo:false,onload:ollizard,speed:1});
  ////load({fn:'paint/lizard',xp:300,yp:-200,xsp:s0,ysp:s0,iw:512,camo:false,onload:ollizard,speed:2});
  load({fn:'paint/skybox',xp:0,yp:-256,xsp:8,ysp:4,jpg:1,iw:512,onload:olsky});
  
  var s=1;////isGl?8:1;//bad, todo
  ////for (var h=0;h<20;h++) 
  
  //load({fn:'paint/boom',xp:0,xsp:0,ysp:0,iw:64,onload:loadboom,count:200,filter:filterOnlyRed});
  load({fn:'paint/boom',xp:0,xsp:0,ysp:0,iw:64,pool:hbooms,count:200});
  load({fn:'paint/boom',xp:0,xsp:0,ysp:0,iw:64,pool:blood,count:50,filter:filterOnlyRed});
  load({fn:'paint/ground',xp:0,yp:20,xsp:1,ysp:1,iw:512,onload:loadground,count:grounds.length,coll:true});
  load({fn:'paint/shadow',xp:0,yp:-110,xsp:2,ysp:0.5,iw:64,pool:shadows,count:2+licount});
  //load({fn:'paint/hbar',xp:0,yp:-110,xsp:2,ysp:0.5,iw:64,pool:hbars,count:2+licount});
  //var gls=(isGl?2:1);s=edit?1:1*gls;load({fn:'paint/cat',xp:650*gls,yp:(edit?0:(-130+700)*gls),xsp:s,ysp:s,iw:1024,onload:loadcat,hasShadow:true,shadowScale:2});
  
  
  function olgrass(o) {
    //console.log('olgrass '+o.is);
    //grass=o;
    o.seg0.x=0;
    //vis(o,1000);//...
    var oo=o;
    for (var i=0;i<100
      ;i++) {
      o=oClone(oo);
      var x=150+(Math.random()-0.5)*1000,
          y0=(Math.random()-0.5)*150,y=580+y0;
      o.x=x;o.y=580;o.y0=y0;//---for wind calculation
      var f=isGl?0.5:1;
      o.seg0.x=x*f;o.seg0.y=y*f;
      o.amp=0.05;
      vis(o,850+y0);
      grass.push(o);
    }
  }
  
  s=isGl?0.3:0.6;
  load({fn:'paint/grass256_',xp:0,yp:140,xsp:s,ysp:s,iw:256,onload:olgrass
  ,rawData:{"rects":[{"x":0,"y":0,w:256,h:256,cx:128,cy:225,"ps":[]}
  ],"bones":[{"i":0,"p":-1,"z":3}]}
  });
  
  
}
,calc:function() {
  appt+=dt;
  
  if (!camo) return;
  
  var md=25000;
  for (var i=grass.length-1;i>=0;i--) {
    var o=grass[i];
    
    o.amp=Math.max(0.05,o.amp-dt*0.001);
    
    if (camo.run) {
      var dx=camo.seg0.x-o.x,dy=o.y0*2,d=dx*dx+dy*dy;     
      //console.log(dx);
      if (d<md) o.amp=Math.min(1.5,o.amp+dt*0.01*(1-d/md));
    }
    
    
    o.seg0.a=Math.sin(appt*0.005+o.seg0.x*0.01+o.seg0.y*0.04)
     *o.amp;
    //*((d<30000)//&&camo.run
    //  ?1.5:0.05);//*(Math.sin(appt*0.001)+1)*0.4;
  }
  
  
  
  //if (!edit) 
  {
    if (mzoom.on) gs=Math.max(0.2,gs-dt*0.001);//0.2
    else gs=Math.min(1,gs+dt*0.001);
  }
  //gs=0.4;
  //anims
  //var gameOver=true;
  
  //if (!camo) return;
  
  //if (!isMenu) 
  if (canattack.length>1) {
    gamet+=dt;
    var aihealth=false;
    for (var h=canattack.length-1;h>=0;h--) {
      var o=canattack[h];
      if (o.p.ai) if (o.health>0) aihealth=true;
    }
  
    if ((!aihealth)||(camo.health==0)) {
      isMenu=true;
      var menus=Menu.getMenus();  
      menus.push({s:'<div style="padding:20px;">'
      +'Game over.<br>You '+(camo.health==0?'lost':'won')+' in '+(Math.floor(gamet/10+0.5)/100)+' sec.'
      +'<span style="font-size:0.7em;color:#888;"><br>Controls depend on system/browser: keys (wasd,cursor,ctrl), touch or gamepad.</span></div>'
      ,px:0.3,py:0.15,pw:0.4,ph:0.3,ydown:true,fs:0.165,tesh:1,bosh:1,col:'#ccc',bgcol:'rgba(0,0,0,0.7)',bocol:'rgba(200,200,200,0.5)',noinp:1});
      menus.push({s:'Restart',px:0.4,py:0.17,pw:0.2,tesh:1,ph:0.075,ydown:true,fs:1.4,bgcol:'rgba(200,200,200,0.2)',col:'#af0'});
      Menu.roots=menus;//Menu.setMenuroots(menus);
      //this.isMenu=true;
      ////alert(menus.length);
      Menu.draw();
      //alert('Menu');
    }
  }
}
,calco:function(o,h) {
  if (((o==camo)||o.p.ai)&&!edit&&!(o.health==0)&&!isMenu) {
    //alert(o);
    o.washit=o.hit;
    o.hit=false;
    o.health=Math.min(o.mhealth,o.health+dt*0.0005);
    if (o.didhitt) {
      o.didhitt-=dt;
      if (o.didhitt<=0) delete o.didhitt;
    }
    for (var i=canattack.length-1;i>=0;i--) {
      var oh=canattack[i];
      if (oh==o) continue;
      if (!oh.wantattack) continue;
      if (o.p.ai&&oh.p.ai) continue;
      var x=oh.fx;
      var y=oh.fy;
      x-=o.x+o.seg0.x;
      y-=o.y+o.seg0.y;
      if ((x>0)&&(x<o.w)&&(y>0)&&(y<o.h)) { o.attacker=oh;o.hit=true; }
    }
    if (o.washit) {
      if (o.hit) {
        o.hitt+=dt;
        if (o.hitt>50) {
          //console.log(o.hitt);
          o.attacker.didhitt=4000;
          o.hitt=0;
          if (!o.realhit) {
            //sound+health-decrease
            //console.log(o.hbar.seg0.xs);
            o.health=Math.max(0,o.health-1);
            //if (o.health==0) {
            //  var ica=canattack.indexOf(o);
            //  if (ica==-1) alert('ica==-1'); else canattack.splice(ica,1);
            //}
            //o.hbar.seg0.xs=Math.max(0,o.hbar.seg0.xs-0.2);
            var shs=o.p.shadowScale;if (shs===undefined) shs=1;
            //o.hbar.seg0.xs=Math.max(0,o.hbar.seg0.xs-0.2);
            o.hbar.seg0.xs=2*shs*(isGl?1/8:1)*o.health/o.mhealth;
            //var f0=250,f1=350;//abit like voice
            var f0=150,f1=450;//abit like voice
            sound([{f:f0,v:0,n:1},{t:50,v:1},{t:150,f:f1},{t:150,f:f0,v:1},{t:300,v:0}],o);
  
          }
          o.realhit=true;
        }
      } else {
        o.hitt=0;
        o.realhit=false;
      }
    }
    o.hbar.seg0.xs=2*o.health/o.mhealth*(isGl?1/8:1);
    
    if (!o.hit) {
      if (o==camo) {
        o.wantjump=mjump.on;
        o.run=false;
        if (mleft.on) { o.run=true;o.dir=-1; }
        if (mright.on) { o.run=true;o.dir=1; }
        if (o.wat===undefined) o.wat=0;
        o.wat+=dt;
        if (mattack.on) {
          if (o.wat>500) o.wat=0;
          o.wantattack=o.wat<400;
        } else {
          o.wantattack=false;
        }
        //o.wantattack=mattack.on;
      } else ai(o,dt,h);    
    }
    
    if (o.hit) { o.wantattack=false;o.run=false; }
    else if (o.wantattack) o.run=false;
    
    var jumpv=1.5;
    if (o.health==0) animStart(o,o.as.dead);
    else if (o.wantjump&&!o.jumpmode&&o.ground) {
      //alert(o.seg0.y);//o.seg0.y-=0.1*dt;
      o.jumpmode=1;o.jumpt=300;
      o.ground=false;
      o.canfall=false;
      animStart(o,o.as.jumpdown);
      
      var osc=Math.abs(o.seg0.xs),dx=o.dir*20*osc;
      createParticles(o.seg0.x-dx*4,o.seg0.y,o.seg0.z,8,dx,2*osc,0.04,0,-0.1*osc,500,1500,hbooms);
      //createOscillator({freq:100,freq0:400,attack:10,decay:250,vol:(o==camo?0.3:0.1),type:'sawtooth'});
      var f0=rani(50,100),f1=rani(200,400);//100,400;
      //var mv=(o==camo?0.3:0.1),n=1;
      //sound([{f:f0,v:0,n:n},{t:10,v:mv},{t:240,v:0,f:f1}]);//same as createOsc
      sound([{f:f0,v:0,n:1},{t:10,v:1},{t:200,v:1},{t:140,v:0,f:f1}],o);
      
      //var f0=100,f1=80,mv=0.21,n=1;//abit like bump 
      //var f0=250,f1=350,mv=0.21,n=1;//abit like voice
      //sound([{f:f0,v:0,n:n},{t:50,v:mv},{t:150,f:f1},{t:150,f:f0,v:mv},{t:300,v:0}]);
      
      //var f0=50,f1=60,mv=0.21,n=3;//abit like sirene/choir
      //sound([{f:f0,v:0,n:n},{t:50,v:mv},{t:350,f:f1},{t:350,f:f0},{t:150,f:f1,v:mv},{t:500,v:0}]);
    } else if (o.jumpmode==1) {
      o.jumpt-=dt;
      if (o.jumpt>200) 
        animStart(o,o.as.jumpdown);
      else {
        //o.seg0.y-=jumpv*dt;
        trymove(o,0,-jumpv*dt);
        animStart(o,o.as.jumpup);
      }
      if (o.jumpt<0) { 
        //animStart(o,o.as.jumpdown);
        //o.jumpmode=2;//2; 
        o.jumpmode=0;
        o.canfall=true;
      }
    } else if (o.wantattack) animStart(o,o.as.attack);
    else if (o.hit) animStart(o,o.as.hit);
    else {
      var an;
      if (!o.ground) an=o.as.jumpdown;
      else {
        if (o.run) {
          an=o.anims[0].a;
          o.tween=TWEEN_LINEAR;
          //o.speed=2;
        } else {
          an=o.anims[1].a;
          o.tween=TWEEN_COS;
          //o.speed=2;
        }
      }
      animStart(o,an);
      //animStart(o,o.ground?o.anims[o.run?0:1].a:o.as.jumpdown);
    }
    if (!o.wantattack) if (o.attackGain) {
      if (!o.attackGain.isDisconnect) o.attackGain.disconnect(audio.destination);
      delete o.attackGain;
    }
  }
}
}
loaded();
//fr o,0,9
//fr o,4
//fr o,4,78
//fr o,4,117
//fr o,5
//fr p,27,171
