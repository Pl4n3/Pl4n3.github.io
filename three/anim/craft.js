//--- for rts, copied from circlecollision
(function () {
  var scrubs=[],t=0,mobs=[],rani=planim.rani,viewMode,mAction,
      bw=10,bl=7,arr,selo;
  
  function shrubloadSimple(v) {
    var ps=this;
    
    for (var i=0;i<5;i++) {
      var ps0=Pd5.hcopy(ps);
      ps0=Pd5.hcopy({
        pos:new THREE.Vector3(-2+i*1,-1.9,0),
        scale:0.01+0.001*i,
        collr:(0.01+0.001*i)*100,
      },ps0);
      var o=Pd5.load(v);
      planim.loadInit(o,ps0);
      o.animStop=true;
      scrubs.push(o);
    }
  }
  
  function shrubload(v) {
    var ps=this,mx=bw,mz=bl;
    //var o=Pd5.load(v);planim.loadInit(o,ps);
    var sc=20;//20;
    for (var i=0;i<sc;i++) {
      var ps0=Pd5.hcopy(ps),rs=Math.random();
      rs=rs*rs*rs;
      ps0=Pd5.hcopy({
        pos:new THREE.Vector3(Math.random()*2*mx-mx,-1.9,Math.random()*2*mz-mz),
        scale:0.01+0.01*rs,
        collr:(0.01+0.01*rs)*50,
        r_oty:Math.random()*2*Math.PI,
      },ps0);
      var o=Pd5.load(v);
      //o.castShadow=0;
      planim.loadInit(o,ps0);
      var m=o.meshes[0].tmesh;
      m.rotation.order='YXZ'
      m.rotation.y=Math.random()*2*Math.PI;
      o.t=planim.rani(500);o.shake=false;o.amp=0;o.animStop=true;
      scrubs.push(o);
    }
  }
  
  
  //...
  var view0=planim.addView({w:1,h:1,x:0,y:0,cam_:new THREE.Vector3(0,-0.10,2.50),bg:1,noOrbitControls:1
    ,target:new THREE.Vector3(0,-0.40,-1.00),fov:40,bgcol:0x333333,fovportrait:1,fovptf0:0.5,fovptv:40});
  
  var go=planim.box(0,-1.9,0,bw*2,0.2,bl*2);go.castShadow=false;
  go.userData.onclick=function(e,ij) {
    if (e.type=='click') return;
    //f (e.type=='mousedown') console.log('craft.onclick type='+e.type);
    //e.type=mousedown/mousemove touchdown/touchmove, ignore click
    if (ij.faceIndex==4||ij.faceIndex==5) {
      var pos={x:(ij.uv.x-0.5)*bw*2,y:-1.8,z:(-ij.uv.y+0.5)*bl*2};
      if ((e.type=='mousedown')||(e.type=='touchstart')) {
        var os=threeEnv.os,md=1000,mo=undefined;
        for (var i=os.length-1;i>=0;i--) {
          var o5=os[i],o=o5.ps;
          if ((o.party!=1)||(o.health<=0)) continue;
          var d=Vecmath.dist2(o.pos,pos);
          if (d>md) continue;
          md=d;mo=o;
        }
        selo=mo;
        return;
      }
      var o=selo;
      if (!o) return;
      o.focus={pos:pos};
      //o.pos.x=(ij.uv.x-0.5)*bw*2;
      //o.pos.z=(-ij.uv.y+0.5)*bl*2;
    }
    else console.log(ij);
  }
  
  var l0,l1,l2;
  planim.base.add(l0=new THREE.AmbientLight(0xffffff,0.3));
  l1=planim.pointLight({x:-1,y:2,z:1,col:0xffffaa,dist:10,int:2});
  l2=planim.pointLight({x:5,y:-5,z:-5,col:0xaaffff,dist:100,int:0.5,castShadow:false});
  
  
  
  var o,a=[
  //  o={fn:'/shooter/objs/templar/o5.txt',pos:new THREE.Vector3(0,-1.8,-1.00),health:5
  //    ,anim:'stand2',scale:2,animRun:'run',animAttack:'attack2',animHit:'hit',animDead:'lost',v:0.006,_ego:1,vrot:0.01,collr:0.5,hitr:1
  //    ,bb:1,bby:1.8,bbtransp:1,randomWalk:false,party:1,attackParty:1
  //    },
      
  //  {fn:'/shooter/objs/tripod/o5.txt',pos:new THREE.Vector3(Math.random()*bw*2-bw,-1.8,Math.random()*bw*2-bw),health:5
  //    ,anim:'idle',scale:2,animRun:'run',animAttack:'attack',animHit:'hit',v:0.003,collr:1.5,hitr:1.5
  //    ,bb:1,bby:1.5,bbtransp:1,roty:Math.random()*Math.PI*2},
      
    {fn:'/shooter/objs/shrub/roundb.json',pos:new THREE.Vector3(0,-1.8,-1.00),scale:0.01,f:shrubload,env:1},
  ];
  
  for (var i=0;i<2;i++) 
  a.push(
  o={fn:'/shooter/objs/templar/o5.txt',pos:new THREE.Vector3(i*1,-1.8,-1.00),health:5
    ,anim:'stand2',scale:2,animRun:'run',animAttack:'attack2',animHit:'hit',animDead:'lost',v:0.006,_ego:1,vrot:0.01,collr:0.5,hitr:1
    ,bb:1,bby:1.8,bbtransp:1,randomWalk:false,party:1,attackParty:1
    }
  );
  
  
  for (var i=0;i<3;i++) {
    a.push(
  {fn:'/shooter/objs/tripod/o5.txt',pos:new THREE.Vector3(Math.random()*5-2.5,-1.8,Math.random()*2+5),health:5
    ,anim:'idle',scale:2,animRun:'run',animAttack:'attack',animHit:'hit',animDead:'dead',v:0.003,collr:0.75,hitr:1.5,attackr:0.75
    ,bb:1,bby:1.5,bbtransp:1,roty:Math.random()*Math.PI*2,randomWalk:1,party:2,attackParty:1
    });
  }
  
  planim.loadObjsThenLoop(a);
  
  //planim.views[0].camera.rotation.x=-0.6;
  planim.game.defMoves=1;
  planim.game.calc=function(dt) {
    //var o=planim.ego;
    //if (o) l1.position.set(o.pos.x-1,o.pos.y+4,o.pos.z+1);
    
    var os=threeEnv.os,md=1000,mo=undefined;
    for (var i=os.length-1;i>=0;i--) {
      var o5=os[i],o=o5.ps;
      if (o.party!=1) continue;
      var showArrow=(o.health>=0)&&o.focus&&(o.focus.health===undefined);
      if (showArrow) {
        if (!o.arr) {
    var geometry = new THREE.BufferGeometry();
    var vertices = new Float32Array( [
      0,0,1, 2,0,1, 2,1,1, 0,1,1,//0-3
      0,1,-1, 2,1,-1, 0,0,-1, 2,0,-1,//4-7
      3,1,0, 2,1,2, 2,0,2, 3,0,0,   //8-11
      2,1,-2, 2,0,-2, //12
    ]);
    // mulholland drive
    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setIndex([0,1,2, 2,3,0, 3,2,4, 4,2,5, 4,5,6, 5,7,6, 0,3,4, 4,6,0,
      8,5,2, 8,2,9, 9,1,10, 9,2,1, 8,9,10, 8,10,11, 12,5,8, 8,11,12, 12,7,5,
      12,13,7, 12,11,13,
      ]);
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
      o.arr=new THREE.Mesh(
        geometry,//new THREE.BoxGeometry(4,0.2,1),
        planim.m1);
      }
        if (!o.arrShown) { planim.base.add(o.arr);o.arrShown=true; }
        o.arr.position.set(o.pos.x,o.pos.y,o.pos.z);
        
        o.arr.rotation.set(0,Math.atan2(-o.focus.pos.z+o.pos.z,o.focus.pos.x-o.pos.x),0);
        o.arr.scale.set(Math.sqrt(Vecmath.dist2(o.pos,o.focus.pos))*0.3333,0.2,0.3);
      } else {
        if (o.arrShown) { planim.base.remove(o.arr);o.arrShown=false; }
      }
    }
    
    //...
  }
  
  
  Menu.init([{s:'Menu',ms:planim.version+' Craft v.0.174 ',sub:[//FOLDORUPDATEVERSION
    planim.mfullscreen
    //,planim.minitvr,planim.muitoggle,planim.megoswitch
    ,planim.mrestart]}
    //,planim.maction
  ,{s:'Pause',vertCenter:1,actionf:function() {
    if (this.s=='Pause') {
      planim.etDtscale(0.05);this.s='Run';
    } else {
      planim.etDtscale(1);this.s='Pause';
    }
  }
    }
    ],{listen:1});
  
  //planim.uiSet(3);
  planim.vrkeys=1;//undefined;
  planim.moveBounds={x0:-bw,x1:bw,z0:-bl,z1:bl};
  //planim.tsd=Menu.touchSticksInit();
  Sound.vol=0.2;
  //threeEnv.useBaseRot=1;
  
  var fe=1.8;//1.2
  planim.base.position.set(0,-5*fe,-7.5*fe);
  view0.camera.rotation.x=-0.72;
  planim.dragRays=true;
  //...
}
)();
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,13
//fr o,1,56
//fr o,1,64
//fr p,42,126
