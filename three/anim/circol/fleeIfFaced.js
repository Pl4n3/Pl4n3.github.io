//---
(function () {
  var scrubs=[],t=0,mobs=[],rani=planim.rani,viewMode,mAction,
      inp0,bw=8;//210726: bw=5; bw=10;
  
  
  function init(ps) {
    
    var s,toRemove=[],dieded=0,uiMode=3,focrotP=new Vecmath.Vec3(0,0,0);
    var l0,l1,l2,a,o,
        camNear={rotx:0,posy:-1,posz:-2},
        camUp={rotx:1.1,posy:-0.5,posz:-5},camStart=camUp,gem,cdist,collected=0;
    
    
    
    if (!ps.scriptH[s='anim/data/objs.js']) { Conet.log('Error: need to load '+s);return; }
    
    planim.circolInit({bw:bw,noLights:1,bgcol:0x010101});
    
    if (1) {
    var dl=new THREE.PointLight(0xffffee,2.5,8,1);//ffe
    dl.position.set(0,3,0);
    if (1) {
    dl.castShadow=true;
    var c=dl.shadow.camera;
    c.near=1;//100;
    c.far=500;//1000;
    c.left=c.bottom=-20;
    c.right=c.top=20;
    dl.shadow.mapSize.width=1*1024;//2048;
    dl.shadow.mapSize.height=1*1024;
    }
    planim.base.add(dl);
    }
    
    
    function onDead() {
      
      //onsole.log('onDead');
      
      toRemove.push({o:this,t:10000});
      
      
      dieded++;
      Conet.log('Dieded: '+dieded);
      
      //...
    }
    
    
    if (1) //--- 210725 new ai: evade front approach from back/side
    (function() {
      
      //camNear={rotx:0.4,posy:-0.85,posz:-2};
      //camStart=camNear;
      Conet.seed(20);
      var rw=true;//randomwalk
      
      a=[
        {ap:1,objs:'templar',bb:1,bbtransp:1,ego:1,posa:[bw/2,-1.8,bw],collr:0.5,hitr:0.5,roty:Math.PI,party:0}//,hitr:1.5},
        ,{fn:'/shooter/objs/gem/o5.txt',env:1,posa:[Conet.rand()*bw*2-bw,-1.8,Conet.rand()*bw*2-bw],scale:0.005,
      onload:function(o) {
        //onsole.log(o.ps.pos.x+=1);
        gem=o.ps;
        //...
      }
        
        
        }
        //,{ap:3,objs:'tripod',bb:1,noAttack:0,randomWalk:rw,posa:[1,-1.8,1]  ,attackr:1,collr:0.5,hitr:.1,health:1.5,aFocus:undefined,distUnfocus:30,fleeIfFaced:1,vrot:0.009}//,vrot:0.01},
        //,{ap:3,objs:'tripod',bb:1,noAttack:0,randomWalk:rw,posa:[1.1,-1.8,1],attackr:1,collr:0.5,hitr:.1,health:1.5,aFocus:undefined,distUnfocus:30,fleeIfFaced:1,vrot:0.009}//,vrot:0.01},
        //,{ap:3,objs:'tripod',bb:1,noAttack:0,randomWalk:rw,posa:[1.2,-1.8,1],attackr:1,collr:0.5,hitr:.1,health:1.5,aFocus:undefined,distUnfocus:30,fleeIfFaced:1,vrot:0.009}//,vrot:0.01},
        //,{fn:'/shooter/objs/shrub/roundb.json',pos:new THREE.Vector3(0,-1.8,-1.00),scale:0.01,shrubCount:25,f:shrubload,env:1}
        //,{fn:'/shooter/objs/shrub/roundb.json',pos:new THREE.Vector3(0,-1.8,-1.00),scale:0.01,area:{count:25,bw:bw,a:scrubs},f:planim.areaLoad,env:1}
        ,{fn:'/shooter/objs/shrub/alpha.txt',transparent:1,pos:new THREE.Vector3(0,-1.8,-1.00),scale:0.005,area:{count:50,bw:bw,a:scrubs,collr:25,scale2:0.02,linearScales:1},f:planim.areaLoad,env:1}
      
      
      ];
      for (let i=0;i<10;i++) 
        a.push({ap:1,objs:'tripod',bb:0,noAttack:0,randomWalk:rw,posa:[Conet.rand()*bw*2-bw,-1.8,Conet.rand()*bw*2-bw],party:1,attackr:1,collr:0.5,hitr:0.5,health:1,aFocus:undefined,distFocus:25,distUnfocus:30,fleeIfFaced:1,vrot:0.009});
      
      //...
    }
    )();
    
    
    planim.loadObjsThenLoop(a);
    
    //planim.views[0].camera.rotation.x=-0.6;
    var mht=0;
    planim.game.defMoves=1;
    planim.game.calc=function(dt) {
      var o=planim.ego;
      if (o&&o.pos) {
        dl.position.set(o.pos.x+1,o.pos.y+3,o.pos.z+1);
        var maxcol=5;
        if (gem&&gem.pos&&(collected<maxcol)) {
          var d=Math.sqrt(planim.dist2(o.pos,gem.pos));
          if (d<1) {
            collected++;
            gem.pos.x=Conet.rand()*2*bw-bw;
            gem.pos.z=Conet.rand()*2*bw-bw;
          }
          cdist.innerHTML=(collected==maxcol)?'Game won!!1':'Loot '+(collected+1)+'/'+maxcol+' Distance: '+'-'.repeat(Math.floor(d+0.5));
        }
        
        focrotP.set3(o.pos.x*10,o.pos.y*10+10,o.pos.z*10);
        
        //onsole.log(focrotP.toString());
        if (uiMode==2) {
        if ((o.health<o.mhealth)&&(o.health>0)) {
          mht+=dt;
          if (mht>100) {
            o.health=Math.min(o.mhealth,o.health+0.02);
            o.o.bb.update=true;
            //console.log(o);
            mht=0;
          }
        }
        if (o.lastAttacked&&(o.lastAttacked.health==0)) o.lastAttacked=undefined;
        if (o.lastAttacked) {
          //onsole.log(o.lastAttacked);
          //o.roty=
          var da=planim.dAng(o.roty,planim.angle(o.pos,o.lastAttacked.pos));
          o.roty-=da;
          
          //var a=angleKeys(kL,kR,kU,kDn),da=dAng(o.roty,a-baseRot.y);
          //if (da<-PI/18) o.turnLeft=true;
          //if (da>PI/18) o.turnRight=true;
        }
        }
      }
      
      for (var i=toRemove.length-1;i>=0;i--) {
        var tr=toRemove[i];
        tr.t-=dt;
        if (tr.t>0) continue;
        toRemove.splice(i,1);
        threeRemoveObj(tr.o.o);
        planim.loadObj({party:1,ap:1,objs:'tripod',bb:1,_noAttack:1,randomWalk:true,aFocus:0,distUnfocus:30,attackmt:5000,attackFix:1,
          posa:[Conet.rand()*10-5,-1.8,Conet.rand()*10-5],attackr:1,collr:0.5,hitr:.5,health:10,onDead:onDead});
        planim.loadObj({party:1,ap:1,objs:'tripod',bb:1,_noAttack:1,randomWalk:true,aFocus:0,distUnfocus:30,attackmt:5000,attackFix:1,
          posa:[Conet.rand()*10-5,-1.8,Conet.rand()*10-5],attackr:1,collr:0.5,hitr:.5,health:10,onDead:onDead});
      }
      
      
      //...
    }
    
    
    
    
    var ma=[{s:'Menu',ms:planim.version+' circol v.0.1119 ',sub:[//FOLDORUPDATEVERSION
      planim.mfullscreen
      //,planim.minitvr,planim.muitoggle,planim.megoswitch,planim.mrestart
      ]}];
      
    if (0) ma.push({s:'View',actionf:function() {
      if (planim.baseRot.x==camUp.rotx) {
        //planim.baseRot.x=0;
        //planim.isoCamPos.y=-1;
        //planim.isoCamPos.z=-2;  
        planim.baseRot.x  =camNear.rotx;//0.4;
        planim.isoCamPos.y=camNear.posy;//-0.75;//-1;
        planim.isoCamPos.z=camNear.posz;//-2;//-2.5;  
      } else {
        planim.baseRot.x  =camUp.rotx;//1.1;
        planim.isoCamPos.y=camUp.posy;//-0.5;
        planim.isoCamPos.z=camUp.posz;//-5;  
      }
    }
    });
     
     ma.push(planim.maction);  
      
    Menu.init(ma,{listen:1});
    {
      planim.uiY=-1;planim.uiZ=-3;//-0.3 -3
      planim.uiSet(3);
      planim.baseRot.x  =0.7;//1.0
      //planim.isoCamPos.y=camStart.posy;//-0.5;
      //planim.isoCamPos.z=camStart.posz;//-5;
      planim.tsd=Menu.touchSticksInit();
    }
    planim.vrkeys=undefined;
    planim.moveBounds={x0:-bw,x1:bw,z0:-bw,z1:bw};
    //planim.tsd=Menu.touchSticksInit({skip1:1});
    Sound.vol=0.2;
    threeEnv.useBaseRot=1;
    planim.isoCamPosUi3Calc();
    
    var c=document.createElement('span'),st=c.style;
    st.position='absolute';st.top='2px';st.left='80px';st.color='#888';
    c.innerHTML='Loot 4/5 distance: -------------';
    document.body.appendChild(c);cdist=c;
    
  }
  
  planim.inpDown=function(ps) {
    inp0={rotx:planim.baseRot.x,y:ps.y};
    //console.log(ps);
    //...
  }
  planim.inpMove=function(ps) {
    //console.log(ps);//...
    planim.baseRot.x=(ps.y-inp0.y)+inp0.rotx;
  }
  
  planim.scriptsLoaded.push(init);
  
  //...
}
)();
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,4
//fr o,1,4,33
//fr o,1,4,42
//fr o,1,7
//fr p,20,138
