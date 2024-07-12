//---
function flightInit(gps) {
  //---
  // using OrbitControls r143, because r124 doesnt give touch clicks
  // using r124 three.js because o5 still uses geometry
  //script src="/three/r124/build/three.min.js">/script>
  //script src="/three/r143/examples/js/libs/stats.min.js">/script>
  //script src="/three/r143/examples/js/controls/OrbitControls.js">/script>
  
  //---
  let gw=30,bw=28,//---grid width, box width
      camera,controls,scene,renderer,stats,deep,
      m0=new THREE.MeshPhongMaterial({color:0x666666,flatShading:true}),
      matMove=material({color:0x77dd77,opacity:0.7}),
      matMoveNA=material({color:0xbbbb77,opacity:0.7}),
      matAttk=material({color:0xee4444,opacity:0.7}),
      matSel=material({color:0xdddd77,opacity:0.7}),
      unit,marks=[],mmove,munit,raycaster,tweens=[],path,pathi,//meshSel
      maxlen=1,units=[],cursor,ot=Date.now(),firstClick=true,
      turnCount=0,gridSel,tai=600,PI=Math.PI,tweent=100,level,
      mnext,flatMarks=false,turnInfo;
  //---
  function ai() {
    //---
    let u=unit;
    
    //onsole.log('ai '+u.aiMode); 
    let rush=(u.ai=='rush');
    
    if (!u.aiMode) {
     
      //--- check for direct attack
      let attack=false;
      for (let u0 of units) {
        if (!canAttack(u,u0)) continue;
        let d=deep.dista(u,u0);
        if ((d<=u.ar)&&(d>=u.arMin)) { attack=true;break; }
        //onsole.log('direct attack d='+d);
      }
      if (attack) {
        u.attack=1;
        u.aiMode='attack';
      } else {
        maxlen=rush?u.maxlen:Math.min(u.maxlen,Math.floor(u.omaxlen/2));
        u.aiMode='approach';
      }
      
      showMarks();
      setTimeout(ai,tai);
      return; 
    }
    
    
    
    if (u.aiMode=='approach') {
      let c=0,mindist=Number.MAX_VALUE,gs=[];
      for (let g of Object.values(deep.rH)) {
        if (g.len) {
          c++;
          for (let u0 of units) {
            if (!canAttack(u,u0)) continue;
            let d=deep.dista(g,u0);
            if (d<u.arMin) continue;
            if (d<mindist) {
              mindist=d;
              gs.length=0;
            }
            if (d==mindist) {
              let skip=false;
              if (gs.length>0) {
                let g0=gs[0];
                if (g0.len>g.len) { gs.length=0; }
                else if (g0.len<g.len) skip=true;
              } 
              if (!skip) gs.push(g);
            }
          }
          //console.log(v);
          //marks.push(m=box(v.x*30,v.y*30,v.z*30,28,28,28,matMove));
          //m.userData.g=v;
          //m.castShadow=false;m.receiveShadow=false;
        }
      }
      u.approachMinDist=mindist;
      if (gs.length==0) { 
        //console.error('approach gs.len=0');
        delete(u.aiMode);u.maxlen=1;checkNextUnit();return; 
      }
      let g=gs[Conet.rani(gs.length)];
      u.aiMode='approachDone';
      clickGrid(g);
      //tweenClick(g);
      //console.log(gs);
      //console.log('c='+c);
    
    
      //delete(u.aiMode);
      //u.maxlen=1;
      //checkNextUnit();
      return;
    }
    
    if (u.aiMode=='approachDone') {
      if (u.maxlen>=3) {
        u.attack=1;
        u.aiMode='attack';
        showMarks();
        setTimeout(ai,tai);
        return;
      }
    
      //--nao if maxlen>=3 attack
      delete(u.aiMode);
      u.maxlen=1;
      checkNextUnit();
      return;
    }
    
    
    if (u.aiMode=='attack') {
      let gs=[];
      for (let m of marks) {
        let g=m.userData.g;
        if (g.os&&g.os.length>0) {
          let u1=g.os[0];
          if (canAttack(u,u1)) {
            gs.push(g);
          }
        }
      }
      //console.log(
      if (gs.length==0) { 
        //---wenn nahest moegliche position am gegner
        //---diesen nicht erreicht aber auch nicht 
        //---maxlen ausgenutzt wird (locales minimum)
        //console.error('attack gs.len=0');
        if (u.approachMinDist<3) { //---> evade
          u.aiMode='attackDone';ai();return;
        }
        delete(u.aiMode);u.maxlen=1;checkNextUnit();return; 
        //u.aiMode='attackDone';ai();return;
      }
    
      let g=gs[Conet.rani(gs.length)];
      u.aiMode='attackDone';
      clickGrid(g);
      
      //delete(u.aiMode);
      //u.maxlen=1;
      //checkNextUnit();
      return;
    }
    
    if (u.aiMode=='attackDone') {
      if (rush) u.maxlen=1;
      if (u.maxlen==1) { delete(u.aiMode);checkNextUnit();return; }
      u.attack=false;
      //--- following moaxlen/2 so that evade is not too far
      maxlen=Math.min(u.maxlen,Math.floor(u.omaxlen/2));
      showMarks();
      u.aiMode='evade';
      setTimeout(ai,tai);
      return;
    }
    
    if (u.aiMode=='evade') {
    
      let c=0,maxdist=0,gs=[];
      for (let g of Object.values(deep.rH)) {
        if (!g.len) continue;
        c++;
        let nearest=Number.MAX_VALUE;
        for (let u0 of units) {
          if (!canAttack(u,u0)) continue;
          let d=deep.dista(g,u0);
          if (d<nearest) nearest=d;
        }
        if (nearest>maxdist) {
          maxdist=nearest;
          gs.length=0;
        }
        if (nearest==maxdist) gs.push(g);        
      }
    
      if (gs.length==0) { 
        //---wenn ai cornered
        delete(u.aiMode);u.maxlen=1;checkNextUnit();return; 
      }
    
      let g=gs[Conet.rani(gs.length)];
      u.aiMode='evadeDone';
      clickGrid(g);
      return;
    }
    
    if (u.aiMode=='evadeDone') {
      delete(u.aiMode);
      u.maxlen=1;
      checkNextUnit();
      return;
    }
    
    
    
    console.log('unknown aiMode: '+u.aiMode);
    
    //...
  }
  function animate() {
    requestAnimationFrame( animate );
    if (controls) controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    stats.update();
    
    //--
    let t=Date.now(),dt=Math.min(100,(t-ot));ot=t;
    Conet.calcTweens(tweens,dt);
    
    threeRender(dt);
    
    renderer.render(scene,camera);
  }
  function bbdraw(bb) {
    //--- -
    //onsole.log('boxScales.bbdraw');
    //var ct=bb.ct;
    //console.log(bb);
    
    var c=bb.c,w=c.width,h=c.height*bb.ar,ct=bb.ct,//c.getContext('2d');
        bo=bb.o;//undefined;
    
    ct.clearRect(0,0,w,h);
    //ct.fillStyle=(bo?.hitt===undefined)?'rgba(0,0,0,0.5)':'#f00';
    ct.fillStyle='rgba(0,0,0,0.5)';
    ct.fillRect(0,0,w,h);//p.c=c;p.ct=ct;
    
    
    var h2=h,b=w/40;
    var f=bo.hp/bo.ohp;
    ct.fillStyle='#0f0';
    ct.fillRect(b,b+h-h2,(w-2*b)*f,h2-2*b);
    ct.fillStyle='#f00';
    ct.fillRect(b+(w-2*b)*f,b+h-h2,(w-2*b)*(1-f),h2-2*b);
    
    ct.textBaseline='top';
    ct.font='16px sans-serif';
    let sh='\u2694'+bo.ap+' \u2665'+bo.hp+' \u26f8'+bo.omaxlen,//unicode swords,heart,iceshoe
        x=w/25,y=x;
    ct.fillStyle='#fff';ct.fillText(sh,x+1,y+1);
    ct.fillStyle='#000';ct.fillText(sh,x,y);
    
    bb.threeTex.needsUpdate=true;
    //...
  }
  function box(x,y,z,w,h,b,m) {
    let mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,b),m);
    mesh.position.set(x,y,z);
    mesh.updateMatrix();
    //mesh.matrixAutoUpdate=false;
    mesh.castShadow=true;
    mesh.receiveShadow=true;
    scene.add(mesh);
    return mesh;
  }
  function canAttack(u0,u1) {
    //---
    if ((u0===u1)||(u1.hp==0)) return false;
    if (u0.party!=u1.party) return true;
    //if (u0.name==u1.name) return false;
    return false;
    //...
  }
  function checkNextUnit() {
    //---
    let i=units.indexOf(unit);
    //onsole.log('checkNextUnit i0='+i);
    
    if (unit.maxlen<=1) {
      //for (let u of units) 
      //if ((u.maxlen>1)&&(u.hp>0)) {
      //  unit=u;placeCursor();
      //  break;
      //}
      for (let j=0;j<units.length;j++) {
        let u=units[(j+i+1)%units.length];
        if ((u.maxlen>1)&&(u.hp>0)) {
          unit=u;placeCursor();
          //onsole.log('new unit.');
          //onsole.trace();
          //updateTurnInfo();
          break;
        }
      }
    }
    
    //onsole.log('checkNextUnit i1='+units.indexOf(unit));
    
    if (unit.maxlen<=1) turn(); else {
      maxlen=unit.maxlen;
      showMarks();
    }
    
    updateTurnInfo();
    
    //onsole.log('checkNextUnit i2='+units.indexOf(unit));
    
    
    if (unit.ai) ai();
    //...
  }
  
  function checkNoInput(silent) {
    if (path) { 
      //onsole.log('No clicks during path animation allowed.');
      return 1; }
    if (unit.ai) { 
      //onsole.log('No clicks during ai allowed.');
      return 1; }
      
    if (self.user) if (self.user.party!=unit.party) {
      if (!silent) Conet.log('Not your turn. >=[:');
      return 1;  
    }
    //...
  }
  
  function click(e) {
    //onsole.log('click');
    
    //---
    if (firstClick) {
      Sound.preload('/sound/plastic.wav');
      firstClick=false;
    }
    
    //if (path) { 
    //  //onsole.log('No clicks during path animation allowed.');
    //  return; }
    //if (unit.ai) { 
    //  //onsole.log('No clicks during ai allowed.');
    //  return; }  
    //if (self.user) if (self.user.party!=unit.party) {
    //  Conet.log('Wrong user.');
    //  return;  
    //}
    
    //if (checkNoInput()) return; 
    
    let click=new THREE.Vector2(2*e.clientX/window.innerWidth-1,-2*e.clientY/window.innerHeight+1);
    raycaster.setFromCamera(click,camera);
    let a=raycaster.intersectObjects(scene.children);
    loop1: for (let v of a) {
      let m=v.object;
      //for (let u of units) if (m===u.meshes[0]) {
        //unit=u;maxlen=unit.maxlen;
        ////u.hp--;bbdraw(u.bb);
        //placeCursor();
        //console.log('unit clicked');
        //
        ////maxlen++;if (maxlen==7) maxlen=2;
        //showMarks();
        //break loop1;
      //}
      let i=marks.indexOf(m);
      if (i!=-1) {
        let g=m.userData.g;
        if (checkNoInput()) return;
        clickGrid(g);
        break;
      }
    }
    //onet.log('click count:'+a.length+(a.length>0?' index0:'+scene.children.indexOf(a[0].object):''));
    
    //...
  }
  function clickGrid(g) {
    //---
    tweenClick(g);
    if (unit.attack) {
      //onsole.log(g);
      let u=unit;
      let u1=(g.os&&(g.os.length>0))?g.os[0]:undefined;
      //onsole.log(u1);
      if (u1&&(u1!==unit)) {
        //onsole.log(u1);
        let nhp=Math.max(0,u1.hp-unit.ap);
        Conet.log(unit.name+' attacks '+u1.name+' ('+u1.hp+' -> '+nhp+' hp)');
        u1.hp=nhp;
        bbdraw(u1.bb);
        u1.bb.threeMesh.visible=u1.hp>0;
        //console.log(u1.bb);
        unit.maxlen-=2;
        if (unit.o5) {
          tweenDirection(unit,u1);
          Pd5.animStart(unit.o5,unit.t.attack);
          Pd5.animStart(u1.o5,u1.t.hit);
    setTimeout(function() {
      Pd5.animStart(u.o5,u.t.idle);
      Pd5.animStart(u1.o5,u1.hp>0?u1.t.idle:u1.t.lost);
    }
    ,500);
        }
        //if (u1.o5) Pd5.animStart(unit.o5,unit.t.attack);
        if (unit.ai) setTimeout(ai,tai); else {
          if (unit.maxlen<3) unit.attack=false;
          showMarks();
          checkNextUnit();
        }
      }
      return;
    }
    ////onsole.log('marks i='+i);
    //---if (meshSel) meshSel.material=matMove;
    //---m.material=matSel;meshSel=m;//console.log(m);
    gridSel=g;
    if (1) //---quickwalk
      pathStart(); 
    else {
    //let t=300;
    //tweens.push({t:t,value0:0,value:1,o:m.scale,key:'x'});
    //tweens.push({t:t,value0:0,value:1,o:m.scale,key:'y'});
    //tweens.push({t:t,value0:0,value:1,o:m.scale,key:'z'});
    mmove.noinp=undefined;
    Menu.remove();
    Menu.draw();
    }
    //...
  }
  function init() {
    
    Sound.vol=0.3;
    //all r143
    //script src="https://threejs.org/build/three.min.js">/script>  //r124
    //script src="https://threejs.org/examples/js/libs/stats.min.js">/script> //r109
    //script src="https://threejs.org/examples/js/controls/OrbitControls.js">/script>  //v81
    
    let levels=[
      {url:'bees',f:levelDudeVs2Bees,ms:'dude vs 2 bees, evadeAi'}
     ,{url:'plain',f:levelSlowVsQuickPlain,ms:'2vs2, evadeAi, plain'}
     ,{url:'barriers',f:levelSlowVsQuickObstacles,ms:'2vs2, evadeAi, barriers'}
     ,{url:'rush',f:levelRush0,ms:'2vs2, rushAi'}
     ,{url:'range',f:levelRange0,ms:'2vs2, range, rushAi'}
     ,{url:'level',f:gameLevel,ms:'leveling up'}
     ,{url:'noAi',f:levelNoAi,ms:'1vs1, no ai'}
     ,{url:'noAi2',f:levelNoAi2,ms:'2vs2, no ai'}
    ];
    let lurl=Conet.parseUrl().level||gps.level||levels[0].url;
    
    
    
    function resize() {
      if (gps.container) return;
      camera.aspect=window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth,window.innerHeight);
    }
    
    //Sound.preload('/sound/plastic.wav');
    
    /* scene */ {
      
      scene = new THREE.Scene();
      renderer = new THREE.WebGLRenderer({antialias:true});
      renderer.setClearColor( 0x888888 );
      renderer.shadowMap.enabled=true;
      //renderer.shadowMap.type=THREE.BasicShadowMap;
      //renderer.outputEncoding=THREE.sRGBEncoding;
      //				renderer.shadowMapEnabled=true;
      //				renderer.shadowMapType=THREE.PCFShadowMap;//PCFShadowMap;
      
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      
      var container=gps.container||document.body//document.getElementById('container')
        ,ms=[];
      container.appendChild( renderer.domElement );
      
      camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1,1000);
      camera.position.z=500;
      
      
      
      if (1) {
      controls=new OrbitControls(camera,renderer.domElement);
      //controls.enableDamping=true;
      //controls.dampingFactor=0.25;
      controls.enableZoom=true;
      controls.enablePan=true;
      controls.maxDistance=600;
      //controls.rotateSpeed=0.4;
      //controls.autoRotate=true;
      //console.log(controls);
      //controls.maxPolarAngle=Math.PI/2;
      }
      
      
      //var bw=20;//,sw=15,sw2=(sw-1)/2,bh=bw/2;//20,15
      
      
      //if (1) { box0(-1,0,-1,1,1,1,m1);box0(15,0,-1,1,1,1,m1);
      //         box0(-1,0,15,1,1,1,m1);box0(15,0,15,1,1,1,m1); }
      
      //box(0-200,-80,0,50,100,50,m1);
      //box(60-200,-80,0,50,100,50,m1);
      //box(0-200,-80,60,50,100,50,m1);
      
      //box(0,-150,0,600,20,600,m0).castShadow=false;
      
      //unit={name:'Ungo',fly:1,xw:1,yw:1,zw:1,x:-2,y:2,z:1};let u=unit;
      //let unitBox=box(u.x*30,u.y*30,u.z*30,28,28,28,material({color:0x7777dd}));
      
      let o=new THREE.Group();cursor=o;
      o.position.set(0,4*30,0);
      let osc=scene;scene=o;
      box(0,-14.5,0,28,4,28,material({color:0xffff00}));
      //box(0,14.5,0,28,4,28,material({color:0xffff00}));
      scene=osc;
      scene.add(o);
      
      let lint=THREE.REVISION>155?800000:1;
      //let l=new THREE.AmbientLight(0x555555),scene.add(l);
      let f=3;
      l=new THREE.PointLight(0xffffff,lint/2,0);l.position.set(-100*f,200*f,100*f);scene.add(l);
      l=new THREE.PointLight(0xffffff,lint,0);l.position.set(100*f,100*f,100*f);
      l.castShadow=true;
      l.shadow.camera.near=100;
      l.shadow.camera.far=1000;
      l.shadow.mapSize.width=1024;//2048;
      l.shadow.mapSize.height=1024;
      scene.add(l);
      l=new THREE.PointLight(0xaaffff,lint,0);l.position.set(100*f,-200*f,-100*f);scene.add(l);
      
      
      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';
      stats.domElement.style.zIndex = 100;
      container.appendChild(stats.domElement);
      
      window.addEventListener('resize',resize,false);
      
      raycaster=new THREE.Raycaster();
      window.addEventListener('click',click,false);
      
      threeEnv.base=scene;//scene;
      threeEnv.scene=scene;
      threeEnv.path='/shooter/';
      threeEnv.coBoSp=1;//computeBoundingSphere
      threeEnv.camera=camera;
      //threeEnv.bbquat=controls.quat;
      
      
      //var psbb=ps.bb,oyw=1,psh={},pos=boxMesh.position;
      //var bb=threeBillboardAdd({
      //  x:pos.x+(psbb.x||0),y:pos.y+(psbb.y||0),z:pos.z+(psbb.z||0),
      //  ar:psbb.ar||0.2,s:0.1*(1+(oyw-1)*2),transparent:psh.bbtransp,gw:psbb.gw||30,cw:128});
      //bb.o={bbdraw:bbdraw,ps:psbb,mesh:boxMesh};
      //boxMesh.userData.bb=bb;
      
      //let bb=threeBillboardAdd({x:0,y:150,z:0,ar:0.2,s:10,transparent:1,gw:30,cw:128,_o:{}});
      
      
    }
    
    /* deep */ {
      //---
      
      deep=new Deep({rH:{}});
      
      let f;
      for (let l of levels) if (l.url==lurl) { f=l.f;break; }
      level=f();
        //levelDudeVs2Bees();
        //levelSlowVsQuickPlain();
        //levelSlowVsQuickObstacles();
      
      
      //deep.moveUpdown=false;
      let dimx=level.dimx||4,dimy=level.dimy||4,dimz=level.dimz||4;
      for (let x=-dimx;x<=dimx;x++) for (let y=-dimy;y<dimy;y++)for (let z=-dimz;z<=dimz;z++)
        deep.getR(z,y,x,1);
      
      units=level.units;
      //units.push(
      //{name:'Bee',fly:1,xw:1,yw:1,zw:1,x:-3,y:2,z:1,maxlen:6,hp:2 ,ap:1,ai:1},//x:-3
      //{name:'Bee',fly:1,xw:1,yw:1,zw:1,x:-2,y:2,z:1,maxlen:6,hp:2 ,ap:1,ai:1},
      //{name:'Dude',     xw:1,yw:2,zw:1,x:4,y:1,z:1 ,maxlen:4,hp:10,ap:1}
      //);
      unit=units[0];
      //unit.attack=1;
      
      //let unitBox=box(u.x*30,u.y*30,u.z*30,28,28,28,material({color:0x7777dd}));
      
      
      //let u=unit;
      //deep.getR(u.z,u.y,u.x).os=[unit];
      //deep.placeGrid(u,1);
      //for (let y=-d;y<=d;y++) for (let z=-d;z<=d;z++) deep.getR(z,y,2).block=1;
      //deep.getR(0,1,2).block=undefined;
      
      let a=level.types;
      let ts={};
      for (let t of a) ts[t.name]=t;
      
      for (let u of units) { 
        let t=ts[u.name];u.t=t;
        Conet.hcopy(t,u,undefined,undefined,1);
        u.attack=undefined;//---different meaning: t.attack, u.attack
        //onsole.log(JSON.stringify(u));
      
        //---todo: werte aus typ kopieren, wenn nicht in unit definiert
        u.omaxlen=u.maxlen;
        u.ohp=u.hp;
        if (u.ar===undefined) u.ar=1;
        if (u.arMin===undefined) u.arMin=0;
        placeUnit(u); 
      }
      
      //showMarks();
      if (level.randBlocks) {
        Conet.seed(level.randBlockSeed);
        let c=Math.floor(dimx*dimz*level.randBlocks);
        for (let i=0;i<c;i++) {
          let x=Conet.rani(dimx*2)-dimx,
              z=Conet.rani(dimz*2)-dimz;
          let g0=deep.getR(z,-1,x);
          let g1=deep.getR(z,0,x);
          if (g0.os||g1.os) continue;
          g0.block=2;
          if (!level.randBlockOnly0) g1.block=2;
          //d.voxels.push({x:x,y:-1,z:z});
          //d.voxels.push({x:x,y:0,z:z});
        }
      }
      
      if (level.groundY!==undefined) 
        for (let x=-dimx;x<=dimx;x++) for (let z=-dimz;z<=dimz;z++) 
          deep.getR(z,level.groundY,x).block=1;
      
      
      if (level.voxedFn)
      Conet.download({fn:level.voxedFn,f:function(v) {
        //---
        let d=JSON.parse(v);
        //onsole.log(d);
        
        
        for (let v of d.voxels) 
          deep.getR(v.z,v.y,v.x).block=1;
        
        initLevel();
        
        //...
      }
      });
      else initLevel();
      
      //onsole.log(deep.rH);
      //...
    }
    
    /* menu */ {
      
      
      let mplus={s:'move+',actionf:function() {
        //---
        if (unit.ai||path) return;
        if (maxlen<unit.maxlen) maxlen++;
        showMarks();
        //...
      }
      },
      mminus={s:'move-',actionf:function() {
        //---
        if (unit.ai||path) return;
        if (maxlen>2) maxlen--;
        showMarks();
        //...
      }
      };
      
      function changeLevel() {
        //---
        window.location='/three/deep/flight.htm?level='+this.s;
        //...
      }
      
      let ml={s:'Games',ms:lurl,sub:[]};
      for (let l of levels) ml.sub.push({s:l.url,ms:l.ms,bgcol:(l.url==lurl?'#0f0':undefined),actionf:changeLevel});
      
      
      let c2=document.createElement('div');turnInfo=c2;
      c2.style.fontSize='0.8em';
      c2.style.paddingTop='3px';
      //c2.innerHTML='Your turn'
      //  //+' (<div style="display:inline-block;font-size:0.5em;">Move &<br>Attack</div>)'
      //  +'!<br><span style="font-size:0.75em;">List of parties here.</span>';
      
      
      
      Menu.init([
      {s:'&#9776;',noTri:true,fs:1.4,pw:0.05,sub:gps.noGamesMenu?[Menu.mFullscreen]:[
        ml,
        Menu.mFullscreen
      ]},
      
      munit={s:'Unit',ms:'3 actions',msid:'actions',noinp:1},
      
      //mplus,mminus,
      
      mmove={s:'Move',ms:'',msid:'movesteps',actionf:function() {
        //pathStart();
        //if (unit.ai||path) return;
        if (checkNoInput()) return;
        
        unit.attack=false;
        maxlen=unit.maxlen;
        showMarks();
        //...
      }
      },
      
      {s:'Attack',ms:'cost:2 actions',actionf:function() {
        //---
        //if (unit.ai||path) return;
        if (checkNoInput()) return;
        
        
        unit.attack=true;//!unit.attack;
        showMarks();
        //onsole.log('attack marks nao.');
        //...
      }
      },
      
      mnext={s:'Next unit',actionf:function() {
        //if (unit.ai||path) return;
        //if (self.user) if (self.user.party!=unit.party) {
        //  Conet.log('Wrong user.');
        //  return;  
        //}
        //console.log('menu next unit');
        if (checkNoInput()) return;
        
        
        unit.maxlen=1;
        checkNextUnit();
        //...
      }
      }
      
      ,{s:'',c2:c2,//s:'Wait for other parties.',
        xcenter:1,px:0,py:0.01,pw:0.5,ph:0.1}
      
      
      ],{listen:1});
      Menu.draw();
      
      //...
    }
    
    animate();
    //---
  }
  function initLevel() {
    //---
    let inst=1,insta=[[],[]];
    //if (!inst)
    for (let v of Object.values(deep.rH)) {
      if (!v.block) continue;
      
      if (inst) 
        insta[v.block-1].push(v);
      else {
        let m=box(v.x*30,v.y*30,v.z*30,28,28,28,material({
          transparent:false,
          color:0x777777}));
        m.matrixAutoUpdate=false;
      } 
    }
    //onsole.log(insta);
    //maxlen=unit.maxlen;
    //showMarks();
    //checkNextUnit();
    
    //let bb=threeBillboardAdd({x:0,y:150,z:0,ar:0.2,s:3,transparent:1,gw:30,cw:128,_o:{}});
    
    //for (let u of units) {
    //  u.bbdraw=bbdraw;
    //  u.bb=threeBillboardAdd({x:u.x*gw,y:(u.y+u.yw)*gw,z:u.z*gw,ar:0.2,s:1,transparent:1,gw:20,cw:128,o:u});
    //}
    
    //let a=[
    //{name:'Dude',fn:'/shooter/objs/templar/o5.txt',idle:'stand2',move:'run',attack:'attack2',hit:'hit',lost:'lost',sc:70,da:PI/2},
    //{name:'Bee' ,fn:'/shooter/objs/bane/o5.txt'   ,idle:'stand' ,move:'run',attack:'attack' ,hit:'hit',lost:'lost',sc:8,da:PI}
    //];
    //console.log(level.units[0]);
    let a=level.types;
    
    let ima;
    if (inst) {
      ima=[
        {fn:'/three/deep/deep8voxb/blockSmall.json',scale:0.14,oy:-3}];
      if (insta[1].length>0) ima.push(
        {fn:'/shooter/objs/shrub/conifer.json',scale:0.5,oy:-15});
      a=a.concat(ima);
    }
    
    //onsole.log(a);
    
    //let ts={};
    //for (let t of a) ts[t.name]=t;
    
    Conet.load({a:a,onAll:function() {
      //---
      //onsole.log('all loaded');
      
      for (let u of units) {
        let t=u.t;//ts[u.name];u.t=t;
        //console.log(t.v);
        var o=Pd5.load(t.v);
        
        //---switch off osc
        let run=o.animh.run;//onsole.log(run);
        if (run) for (let ak of run) delete(ak.text);
        
        if (t.onNewObj) t.onNewObj(o);
        if (u.diffIsNorm) o.meshes[0].diff=o.meshes[0].norm;
        if (u.diff) o.meshes[0].diff=u.diff;
        //onsole.log(o);
        o.scale=1;
        Pd5.animStart(o,t.idle);
        //Pd5.calc(o,0,0.0,0,1,{x:0,y:0,z:0},0,0,true);
        o.ay=u.ay;
        threeAddObj(o,u.x*gw,(u.y-0.5)*gw,u.z*gw,t.sc);
        u.o5=o;
      
        if (!u.meshes) {
          let m=o.meshes[0].tmesh;
          threeEnv.base=m;
          u.bbdraw=bbdraw;
          u.bb=threeBillboardAdd({x:0,y:(0.0+u.yw)*gw/t.sc,z:0,ar:0.2,s:1/t.sc,transparent:1,gw:20,cw:128,o:u});
          threeEnv.base=scene;
        }
      
      }
      
      if (ima) {
        for (let j=0;j<ima.length;j++) {
          let m=ima[j];
          let o=Pd5.load(m.v);
          //onsole.log(o);
      o.meshes[0].diffFilter=function(ps) {
        //---
        //onsole.log('diffFilter');
        let img=new Image();
        img.src=ps.data;
        img.onload=function() {
          //---
          let w=img.width,h=img.height;
          //onsole.log(img.width+' '+img.height);
          let c=document.createElement('canvas');
          c.width=w;c.height=h;
          let ct=c.getContext('2d');
          ct.drawImage(img,0,0);
          let id=ct.getImageData(0,0,w,h);
          for (let i=id.data.length/4;i>=0;i--) {
            let r=id.data[i*4+0],g=id.data[i*4+1],b=id.data[i*4+2],
                m=(r+g+b)/3,f0=0.2,f1=1-f0;
            id.data[i*4+0]=m;//f0*r+f1*m;
            id.data[i*4+1]=m;//f0*g+f1*m;
            id.data[i*4+2]=m;//f0*b+f1*m;
          }
          ct.putImageData(id,0,0);
          ps.img.src=c.toDataURL();
          //...
        }
        //...
      }
          //o.instances=3;
          o.scale=m.scale;
          o.instances=insta[j].length;
          threeAddObj(o,0,0,0,1);
          let im=o.meshes[0].tmesh;
          //onsole.log(im);
          let mat=new THREE.Matrix4();
          for (let i=0;i<o.instances;i++) {
            let v=insta[j][i];
            mat.makeTranslation(v.x*gw,v.y*gw+m.oy,v.z*gw);
            im.setMatrixAt(i,mat); 
          }
        }
      }
      
      
      
      checkNextUnit();
      
      //...
    }
    });
    
    //...
  }
  
  function levelDudeVs2Bees() {
    //---
    return{
    units:[
    {name:'Bee',fly:1,xw:1,yw:1,zw:1,x:-3,y:2,z:1,party:1,maxlen:6,hp:2 ,ap:1,ai:1},//x:-3
    {name:'Bee',fly:1,xw:1,yw:1,zw:1,x:-2,y:2,z:1,party:1,maxlen:6,hp:2 ,ap:1,ai:1},
    {name:'Dude',     xw:1,yw:2,zw:1,x:4,y:1,z:1 ,party:2,maxlen:4,hp:10,ap:1}
    ],
    
    types:[
    {name:'Dude',fn:'/shooter/objs/templar/o5.txt',idle:'stand2',move:'run',attack:'attack2',hit:'hit',lost:'lost',sc:70,da:PI/2},
    {name:'Bee' ,fn:'/shooter/objs/bane/o5.txt'   ,idle:'stand' ,move:'run',attack:'attack' ,hit:'hit',lost:'lost',sc:8,da:PI}
    ],
    
    
    voxedFn:'/three/anim/voxed/flightRooms.json',
    };
    //...
  }
  function levelSlowVsQuickPlain() {
    //---
    return{
    units:[
    //{name:'Bee',fly:1,xw:1,yw:1,zw:1,x:-3,y:2,z:1,maxlen:6,hp:2 ,ap:1,ai:1},//x:-3
    //{name:'Bee',fly:1,xw:1,yw:1,zw:1,x:-2,y:2,z:1,maxlen:6,hp:2 ,ap:1,ai:1},
    
    
    //--- ai can be cornered but lots hits
    {name:'Dude',xw:1,yw:2,zw:1,x:-3,y:-1,z:1 ,maxlen:9,hp:2,ap:1,ai:1,party:1,diffIsNorm:1},
    {name:'Dude',xw:1,yw:2,zw:1,x:-4,y:-1,z:1 ,maxlen:9,hp:2,ap:1,ai:1,party:1,diffIsNorm:1},
    {name:'Dude',xw:1,yw:2,zw:1,x:4 ,y:-1,z:1 ,maxlen:4,hp:9,ap:1,party:2},
    {name:'Dude',xw:1,yw:2,zw:1,x:3 ,y:-1,z:1 ,maxlen:4,hp:9,ap:1,party:2}
    //{name:'Dude',xw:1,yw:2,zw:1,x:2 ,y:-1,z:1 ,maxlen:4,hp:5,ap:1,party:2}
    ],
    
    types:[
    {name:'Dude',fn:'/shooter/objs/templar/o5.txt',idle:'stand2',move:'run',attack:'attack2',hit:'hit',lost:'lost',sc:70,da:PI/2},
    {name:'Bee' ,fn:'/shooter/objs/bane/o5.txt'   ,idle:'stand' ,move:'run',attack:'attack' ,hit:'hit',lost:'lost',sc:8,da:PI}
    ],
    
    
    //voxedFn:'/three/anim/voxed/flightPlane.json',
    onlyGroundAttacks:1,
    //randBlocks:1,
    groundY:-2,
    dimx:4,dimz:4,
    dimy:2
    };
    //...
  }
  function levelSlowVsQuickObstacles() {
    //---
    return{
    units:[
    //{name:'Bee',fly:1,xw:1,yw:1,zw:1,x:-3,y:2,z:1,maxlen:6,hp:2 ,ap:1,ai:1},//x:-3
    //{name:'Bee',fly:1,xw:1,yw:1,zw:1,x:-2,y:2,z:1,maxlen:6,hp:2 ,ap:1,ai:1},
    
    
    //--- ai can be cornered but lots hits
    {name:'Dude',xw:1,yw:2,zw:1,x:-3,y:-1,z:1 ,maxlen:9,hp:2,ap:1,ai:1,party:1,diffIsNorm:1},
    {name:'Dude',xw:1,yw:2,zw:1,x:-4,y:-1,z:1 ,maxlen:9,hp:2,ap:1,ai:1,party:1,diffIsNorm:1},
    {name:'Dude',xw:1,yw:2,zw:1,x:4 ,y:-1,z:1 ,maxlen:4,hp:9,ap:1,party:2},
    {name:'Dude',xw:1,yw:2,zw:1,x:3 ,y:-1,z:1 ,maxlen:4,hp:9,ap:1,party:2}
    //{name:'Dude',xw:1,yw:2,zw:1,x:2 ,y:-1,z:1 ,maxlen:4,hp:5,ap:1,party:2}
    ],
    
    types:[
    {name:'Dude',fn:'/shooter/objs/templar/o5.txt',idle:'stand2',move:'run',attack:'attack2',hit:'hit',lost:'lost',sc:70,da:PI/2},
    {name:'Bee' ,fn:'/shooter/objs/bane/o5.txt'   ,idle:'stand' ,move:'run',attack:'attack' ,hit:'hit',lost:'lost',sc:8,da:PI}
    ],
    
    
    //voxedFn:'/three/anim/voxed/flightPlane.json',
    onlyGroundAttacks:1,
    randBlocks:1.4,randBlockSeed:2,
    groundY:-2,
    dimx:10,dimz:10,
    dimy:2
    };
    //...
  }
  function levelRush0() {
    //---
    let hp=10;//14
    return{
    units:[
    {name:'Dude',xw:1,yw:2,zw:1,x:-3,y:-1,z:1 ,maxlen:4,hp:hp,ap:1,ai:'rush',party:1,diffIsNorm:1},
    {name:'Dude',xw:1,yw:2,zw:1,x:-4,y:-1,z:1 ,maxlen:4,hp:hp,ap:1,ai:'rush',party:1,diffIsNorm:1},
    {name:'Dude',xw:1,yw:2,zw:1,x:4 ,y:-1,z:1 ,maxlen:4,hp:hp,ap:1,party:2},
    {name:'Dude',xw:1,yw:2,zw:1,x:3 ,y:-1,z:1 ,maxlen:4,hp:hp,ap:1,party:2}
    ],
    
    types:[
    {name:'Dude',fn:'/shooter/objs/templar/o5.txt',idle:'stand2',move:'run',attack:'attack2',hit:'hit',lost:'lost',sc:70,da:PI/2}
    ],
    
    onlyGroundAttacks:1,
    groundY:-2,
    dimx:4,dimz:4,
    dimy:2
    };
    //...
  }
  function levelRange0() {
    //---
    return{
    units:[
     {name:'Dude',xw:1,yw:2,zw:1,x:-3,y:-1,z:1 ,maxlen:4,hp:10,ap:1,ar:3,arMin:3,party:1,ai:'rush',diffIsNorm:1}
    ,{name:'Dude',xw:1,yw:2,zw:1,x:-4,y:-1,z:1 ,maxlen:4,hp:10,ap:1,ar:3,arMin:3,party:1,ai:'rush',diffIsNorm:1}
    ,{name:'Dude',xw:1,yw:2,zw:1,x:4 ,y:-1,z:1 ,maxlen:4,hp:10,ap:1,ar:3,arMin:3,party:2}
    ,{name:'Dude',xw:1,yw:2,zw:1,x:3 ,y:-1,z:1 ,maxlen:4,hp:10,ap:1,ar:3,arMin:3,party:2}
    ],
    
    types:[
    {name:'Dude',fn:'/shooter/objs/templar/arch.txt',idle:'stand2',move:'run',attack:'attack2',hit:'hit',lost:'lost',sc:70,da:PI/2}
    ],
    
    onlyGroundAttacks:1,
    groundY:-2,
    dimx:4,dimz:4,
    dimy:2
    };
    //...
  }
  function gameLevel() {
    //...
    console.log('todo: init grid of different levels');
    
    function fixTemplarSound(o) {
      //---
      let a=o.animh.run;
      for (let h of a) h.text=undefined;
      //...
    }
    
    //start: initialize via playerLevel, gridx, gridy
    //  medium mob level is dist from 0,0
    //  obstacles mob positions and properties are random
    //  with seed from gridx,gridy
    //later: check different gridx,gridy, check how lvlup
    //  could work, maybe via log(exp), where exp increases
    //  on won maps related to mobLvl/playerLvl; if lvlup
    //  works, visualize map grid and add persistence
    //  (save playerExp, mapposition and won maps)
    
    let gx=1,gy=0,lvl=0,
        moblvl=2;//---shall be abs(gx)+abs(gy)
    
    Conet.seed((gy+50)*1000+gx+50);//--> grid should be within -50 50
    
    let dimx=4;
    
    
    
    let map={
    units:[
    // {name:'Melee',xw:1,yw:2,zw:1,x:-3,y:-1,z:1 ,maxlen:4,hp:2,ap:1,party:1,ai:'rush',diffIsNorm:1}
    //,{name:'Range',xw:1,yw:2,zw:1,x:-4,y:-1,z:1 ,maxlen:4,hp:2,ap:1,party:1,ar:3,arMin:3,ai:'rush',diffIsNorm:1}
    //,{name:'Range',xw:1,yw:2,zw:1,x:-2,y:-1,z:1 ,maxlen:4,hp:2,ap:1,party:1,ar:3,arMin:3,ai:'rush',diffIsNorm:1}
     {name:'Range',x:-1,y:-1,z:dimx ,ay:PI,party:2}
    ,{name:'Melee',x:0 ,y:-1,z:dimx ,ay:PI,party:2}
    ,{name:'Range',x:1 ,y:-1,z:dimx ,ay:PI,party:2}
    ],
    
    types:[
    {name:'Melee',fn:'/shooter/objs/templar/o5.txt'  ,idle:'stand2',move:'run',attack:'attack2',hit:'hit',lost:'lost',sc:70,da:PI/2,xw:1,yw:2,zw:1,maxlen:4,hp:2,ap:1,onNewObj:fixTemplarSound},
    {name:'Range',fn:'/shooter/objs/templar/arch.txt',idle:'stand2',move:'run',attack:'attack2',hit:'hit',lost:'lost',sc:70,da:PI/2,xw:1,yw:2,zw:1,maxlen:4,hp:2,ap:1,ar:3,arMin:3}
    ],
    
    onlyGroundAttacks:1,
    groundY:-2,
    dimx:dimx,dimz:dimx,
    randBlocks:0.9*Conet.rand(),
    randBlockSeed:Conet.rani(1000),
    dimy:2
    };
    
    for (let i=0;i<3;i++) {
      let u={name:Conet.rand()<0.5?'Melee':'Range',y:-1,party:1,ai:'rush',diffIsNorm:1,maxlen:4,hp:2,ap:1};
      u.x=Conet.rani(dimx*2+1)-dimx;
      u.z=Conet.rani(dimx*2)-dimx;
      map.units.push(u);
    }
    
    for (let i=0;i<3;i++) {
      let u=map.units[i+3];
      for (let j=0;j<moblvl;j++) {
        let w=Conet.rani(3);
        if (w==0) u.maxlen++;
        else if (w==1) u.ap++;
        else u.hp++;
      }
      //onsole.log(JSON.stringify(u));
    }
    
    return map;
    
    //---
  }
  
  function levelNoAi() {
    //---
    flatMarks=true;
    controls.maxPolarAngle=Math.PI/2;
    
    return{
    units:[
    //{name:'Dude',xw:1,yw:2,zw:1,x:-3,y:-1,z:1 ,maxlen:4,hp:hp,ap:1,ai:'rush',party:1,diffIsNorm:1},
    {name:'Dude',xw:1,yw:2,zw:1,x:-4,y:-1,z:1 ,maxlen:6,hp:2,ap:1,party:1,ai:0
      //,diff:'/shooter/objs/templar/redd.jpg',
      ,diffIsNorm:1
      },
    {name:'Dude',xw:1,yw:2,zw:1,x:4 ,y:-1,z:1 ,maxlen:6,hp:2,ap:1,party:2,ai:'rush'},
    //{name:'Dude',xw:1,yw:2,zw:1,x:3 ,y:-1,z:1 ,maxlen:4,hp:hp,ap:1,party:2}
    ],
    
    types:[
    {name:'Dude',fn:'/shooter/objs/templar/o5.txt',idle:'stand2',move:'run',attack:'attack2',hit:'hit',lost:'lost',sc:70,da:PI/2}
    ],
    
    parties:[
    {name:'The good',party:1},
    {name:'The bad',party:2}
    ],
    
    onlyGroundAttacks:1,
    groundY:-2,
    dimx:4,dimz:4,
    dimy:2
    };
    //...
  }
  function levelNoAi2() {
    //---
    deep.moveUpdown=false;
    flatMarks=true;
    controls.maxPolarAngle=Math.PI/2;
    
    function colorImg(color) {
      let c=document.createElement('canvas');
      c.width=64;c.height=64;
      let ct=c.getContext('2d');
      ct.fillStyle=color;
      ct.fillRect(0,0,c.width,c.height);
      let du=c.toDataURL();
      return du;
      //...
    }
    
    let diff1=colorImg('#f50'),
        diff2=colorImg('#3a0'),
        diff3=colorImg('#05f');
    
    return{
    units:[
    {name:'Melee',xw:1,yw:2,zw:1,x:-4,y:-1,z:1,ai:0,maxlen:6,hp:10,ap:1,party:1,diff:diff1},
    {name:'Melee',xw:1,yw:2,zw:1,x:4 ,y:-1,z:1,_ai:'rush',maxlen:6,hp:10,ap:1,party:2,diff:diff2},
    {name:'Melee',xw:1,yw:2,zw:1,x:0 ,y:-1,z:-5,ai:'rush',maxlen:6,hp:10,ap:1,party:3,diff:diff3},
    {name:'Range',xw:1,yw:2,zw:1,x:-5,y:-1,z:1,ai:0,maxlen:6,hp:6,ap:1,ar:4,arMin:3,party:1,diff:diff1},
    {name:'Range',xw:1,yw:2,zw:1,x:5 ,y:-1,z:1,ai:0,maxlen:6,hp:6,ap:1,ar:4,arMin:3,party:2,diff:diff2},
    {name:'Range',xw:1,yw:2,zw:1,x:1 ,y:-1,z:-5,ai:1,maxlen:6,hp:6,ap:1,ar:4,arMin:3,party:3,diff:diff3},
    ],
    
    types:[
    {name:'Melee',fn:'/shooter/objs/templar/o5.txt',idle:'stand2',move:'run',attack:'attack2',hit:'hit',lost:'lost',sc:70,da:PI/2},
    {name:'Range',fn:'/shooter/objs/templar/arch.txt',idle:'stand2',move:'run',attack:'attack2',hit:'hit',lost:'lost',sc:70,da:PI/2}
    ],
    
    parties:[
    {name:'The good',party:1},
    {name:'The bad',party:2},
    {name:'The ugly',party:3}
    ],
    
    
    onlyGroundAttacks:1,
    randBlocks:1.2,randBlockSeed:2,randBlockOnly0:1,
    groundY:-2,
    dimx:6,dimz:6,
    dimy:2
    };
    //...
  }
  
  
  function material(ps) {
    return new THREE.MeshPhongMaterial({color:ps.color,flatShading:true,
          transparent:ps.transparent!==undefined?ps.transparent:true,opacity:ps.opacity||0.7});
    //...
  }
  function showMarks() {
    //---
    let u=unit,m;
    
    Menu.ms(munit,'has '+(unit.maxlen-1)+' actions');
    if (maxlen>unit.maxlen) maxlen=unit.maxlen;
    Menu.ms(mmove,'cost:'+((u.fly||(maxlen<=2))?'':'up to ')+(maxlen-1)+' actions');
    
    for (let m of marks) scene.remove(m);marks.length=0;
    deep.lenInit();
    
    //if (meshSel) { 
    //  meshSel=undefined;
    //  //mmove.noinp=1; 
    //}
    
    let dimy=flatMarks?2:28,offy=flatMarks?-14:0;
    
    let op=checkNoInput(1)?0.4:0.7;
    matMove.opacity=op;
    matMoveNA.opacity=op;
    matAttk.opacity=op;
    
    if (unit.attack) {
      //onsole.log('show attackmarks nao');
      if (unit.maxlen>=3) {
      //---following similar to deep.checkMarkAttack, but there cylinder,
      //---here area is capsule, at some point unify both
      let ar=u.ar,arMin=u.arMin;
      for (let x=u.x-ar;x<=u.x+u.xw+ar-1;x++)
      for (let y=u.y-ar;y<=u.y+(level.onlyGroundAttacks?0:u.yw+ar-1);y++)
      for (let z=u.z-ar;z<=u.z+u.zw+ar-1;z++) {
        let d=deep.dista4(x,y,z,u);
        //  (x<u.x?(u.x-x):((x>u.x+u.xw-1)?x-u.x-u.xw+1:0))+
        //  (y<u.y?(u.y-y):((y>u.y+u.yw-1)?y-u.y-u.yw+1:0))+
        //  (z<u.z?(u.z-z):((z>u.z+u.zw-1)?z-u.z-u.zw+1:0));   
        if ((d>ar)||(d<arMin)) continue;
        let g=deep.getR(z,y,x);
        if (!g) continue;
        if (g.block) continue;
        if (g.os&&(g.os.length>0)&&(g.os[0]===unit)) continue;
        marks.push(m=box(x*30,y*30+offy,z*30,28,dimy,28,matAttk));
        m.userData.g=g;
        //onsole.log(g);
      }
      }
      //Menu.ms(mmove,'');
      return;
    }
    
    deep.maxlen=maxlen;//console.log(deep.maxlen);
    
    if (maxlen>1) {
    let r=deep.calcLen(u.x,u.y,u.z,0,u);
    
    //console.log(deep.rH);
    //onsole.log(r);
    //deep.getR(0,0,0,1);
    
    for (let v of Object.values(deep.rH)) {
      if ((v.len==deep.maxlen-1)||(!u.fly&&v.len)) {
        //console.log(v);
        marks.push(m=box(v.x*30,v.y*30+offy,v.z*30,28,dimy,28,(v.len<deep.maxlen-2)?matMove:matMoveNA));
        m.userData.g=v;
        //m.castShadow=false;m.receiveShadow=false;
      }
    }
    }
    //Menu.ms(mmove,'cost:'+(maxlen-1)+' actions');
    //...
  }
  function pathStart() {
    //---
    //onet.log('Move nao');
    //onsole.log(meshSel.userData);
    
    //onsole.log('unit=');
    //onsole.log(unit);
    //onsole.log('g=');
    //onsole.log(meshSel.userData.g);
    let u=unit,pa=deep.pathStart(
      gridSel//meshSel.userData.g
      ,unit);
    //onsole.log(pa);
    
    let dimy=flatMarks?10:28,offy=flatMarks?-9:0;
    
    for (let m of marks) scene.remove(m);marks.length=0;
    //let mat=material({color:0x77dd77,opacity:0.4});
    for (let i=1;i<pa.length;i++) {
      let v=pa[i];
      marks.push(box(v.x*30,v.y*30+offy,v.z*30,28,dimy,28,matMove));
    }
    
    if (u.o5) Pd5.animStart(u.o5,u.t.move);
    
    path=pa;pathi=0;
    tweenPath();
    //let t=1000,vl=pa[1],m=unit.meshes[0];
    //tweens.push({t:t,value:vl.x*30,o:m.position,key:'x'});
    //tweens.push({t:t,value:vl.y*30,o:m.position,key:'y'});
    //tweens.push({t:t,value:vl.z*30,o:m.position,key:'z'});
    
    
    //placeUnit(unit,meshSel.userData.g);maxlen=2;
    //showMarks();
    //...
  }
  
  function tweensAdd(ps) {
    //---
    for (let i=0;i<ps.kv.length;i++) {
      let kvi=ps.kv[i],tw;
      ps.tweens.push(tw={t:ps.t,o:ps.o,key:kvi[0],value:kvi[1]});
      if (ps.onend&&(i==ps.kv.length-1)) {
    tw.onend=function() {
      //---
      tweensAdd(ps.onend[0]);
      if (ps.onend.length>1) throw('more nextKvs n/i');
      //...
    }
      }
    }
    //...
  }
  
  
  function placeCursor() {
    //---
    //onsole.trace();
    let u=unit;
    if (cursor.children.length>1) cursor.children[1].position.y=14.5+(u.yw-1)*30;
    //cursor.position.set(u.x*30,u.y*30,u.z*30);
    
    let t=tweent,o=cursor.position;
    //tweens.push({t:t,value:u.x*30,o:o,key:'x'});
    //tweens.push({t:t,value:u.y*30,o:o,key:'y'});
    //tweens.push({t:t,value:u.z*30,o:o,key:'z'});
    tweensAdd({tweens:tweens,t:t,o:o,
      kv:[['x',u.x*30],['y',(u.y+2)*30],['z',u.z*30]],
      onend:[
        {tweens:tweens,t:t,o:o,kv:[['x',u.x*30],['y',u.y*30],['z',u.z*30]]}
      ]
    });
    //...
  }
  function placeUnit(u,g) {
    //---
    if (g) {
      deep.placeGrid(u,false);
      u.x=g.x;u.y=g.y;u.z=g.z;
      //for (let m of u.meshes) scene.remove(m);u.meshes.length=0;
    }
    if (0&&!u.meshes) {
      let b=4,m=box(u.x*30,u.y*30+(u.yw-1)*30/2,u.z*30,28-b,28-b+(u.yw-1)*30,28-b,material({color:0x7777dd}));u.meshes=[m];
      threeEnv.base=m;
      u.bbdraw=bbdraw;
      u.bb=threeBillboardAdd({x:0,y:(0.3+u.yw/2)*gw,z:0,ar:0.2,s:1,transparent:1,gw:20,cw:128,o:u});
      threeEnv.base=scene;
    }
    deep.placeGrid(u,true);
    if (u===unit) placeCursor();
    //...
  }
  function tweenClick(g) {
    //---
    let t=300,mn=box(g.x*gw,g.y*gw,g.z*gw,bw,bw,bw,material({color:0xffffff,transparent:false}));
    tweens.push({t:t,value0:1,value:0,o:mn.scale,key:'x'});
    tweens.push({t:t,value0:1,value:0,o:mn.scale,key:'y'});
    tweens.push({t:t,value0:1,value:0,o:mn.scale,key:'z',onend:function() {
      scene.remove(mn);
    }
    });
    Sound.play('/sound/plastic.wav');
    
    //...
  }
  function tweenDirection(vp,vl) {
    //--
    let t=tweent,u=unit,dx=vl.x-vp.x,dz=vl.z-vp.z;
    if ((dx!=0)||(dz!=0)) {
      let a=u.t.da-Math.atan2(dz,dx);
      //u.o5.ay=a;//Math.random()*Math.PI;
      u.o5.ay=u.o5.ay||0;
      let da=Conet.dAng(a,u.o5.ay);
      //onsole.log(da);
      //u.o5.ay+=da;
      tweens.push({t:t,value:u.o5.ay+da,o:u.o5,key:'ay'});
    }
    //...
  }
  function tweenPath() {
    //---
    Sound.play('/sound/plastic.wav');
    let u=unit;
    pathi++;
    if (pathi==path.length) {
      placeUnit(unit,path[path.length-1]);
      unit.maxlen-=path.length-1;
      path=undefined;
      if (u.o5) Pd5.animStart(u.o5,u.t.idle);
      if (u.ai) ai(); 
      else {
        if (u.maxlen>=3) {
          u.attack=true;
          showMarks();
        } else
          checkNextUnit();
      }
      return;
    }
    let t=tweent,vl=path[pathi];
    if (u.meshes) {
    let o=unit.meshes[0].position;
    tweens.push({t:t,value:vl.x*gw,o:o,key:'x'});
    tweens.push({t:t,value:vl.y*gw+(u.yw-1)*30/2,o:o,key:'y'});
    tweens.push({t:t,value:vl.z*gw,o:o,key:'z',onend:tweenPath});
    }
    if (u.o5) {
    let o=u.o5.meshes[0].tmesh.position;
    //u.o5.ay=Math.random()*Math.PI;
    
    let vp=path[pathi-1];
    tweenDirection(vp,vl);
    //let dx=vl.x-vp.x,dz=vl.z-vp.z;
    //if ((dx!=0)||(dz!=0)) {
    //  let a=u.t.da-Math.atan2(dz,dx);
    //  //u.o5.ay=a;//Math.random()*Math.PI;
    //  u.o5.ay=u.o5.ay||0;
    //  let da=Conet.dAng(a,u.o5.ay);
    //  //onsole.log(da);
    //  //u.o5.ay+=da;
    //  tweens.push({t:t,value:u.o5.ay+da,o:u.o5,key:'ay'});
    //}
    
    tweens.push({t:t,value:vl.x*gw      ,o:o,key:'x'});
    tweens.push({t:t,value:(vl.y-0.5)*gw,o:o,key:'y'});
    tweens.push({t:t,value:vl.z*gw      ,o:o,key:'z',onend:u.meshes?undefined:tweenPath});
    }
    
    //...
  }
  function turn() {
    //---
    turnCount++;Conet.log(turnCount+' turns');
    unit=undefined;
    for (let u of units) { 
      if (u.hp==0) continue;
      u.maxlen=u.omaxlen;u.attack=false; 
      if (unit===undefined) unit=u;
    }
    //unit=units[0];
    placeCursor();
    maxlen=unit.maxlen;
    showMarks();
    //pdateTurnInfo();
    //...
  }
  function updateTurnInfo() {
    //---
    //onsole.log('update turn info');
    let s='';//,upn;
    if (level.parties) for (let i=0;i<level.parties.length;i++) {
      let p=level.parties[i];
      //if (self.user) if (self.user.party==p.party) upn=p.name;
      let n=p.name;
      if (self.user&&(self.user.party==p.party)) n+=' (you)';
      s+=(s.length>0?', ':'')+((unit.party==p.party)?'<b>'+n+'</b>':n);
    }
    
    turnInfo.innerHTML=
      //(upn?'"'+upn+'"':'Player')+
      (checkNoInput(1)?'Wait for others.':'Your turn!')
      //+' (<div style="display:inline-block;font-size:0.5em;">Move &<br>Attack</div>)'
      +'<br><span style="font-size:0.75em;">Parties: '+s+'.</span>';
    
    //...
  }
  
  init();
  
  let self={};
  self.etState=function(s) {
    //---
    let changes=false;
    if (!s) s={};
    if (!s.units) s.units=[];
    s.units.length=units.length;
    for (let i=units.length-1;i>=0;i--) {
      let u=units[i],su=s.units[i];
      if (su) {
        u.o5.ay=su.ay;
        if (su.hp!=u.hp) {
          u.hp=su.hp;bbdraw(u.bb);
          u.bb.threeMesh.visible=u.hp>0;
          Pd5.animStart(u.o5,u.hp>0?u.t.idle:u.t.lost);
        }
        //u.maxlen=su.maxlen;u.attack=su.attack;
        if ((su.x!=u.x)||(su.y!=u.y)||(su.z!=u.z)) {
          deep.placeGrid(u,false);
          u.x=su.x;u.y=su.y;u.z=su.z;
          deep.placeGrid(u,true);
          //onsole.log(u);
          //onsole.log('x changed');
          //u.o5.meshes[0].tmesh.position.x=u.x*gw;
          let t=tweent;
          let o=u.o5.meshes[0].tmesh.position;
          tweens.push({t:t,value:u.x*gw      ,o:o,key:'x'});
          tweens.push({t:t,value:(u.y-0.5)*gw,o:o,key:'y'});
          tweens.push({t:t,value:u.z*gw      ,o:o,key:'z'});
          //onsole.log(u);
          changes=true;
        }
      }
      su=Conet.hcopy(u,su,['x','y','z','hp','party','ai']);//maxlen,attack
      su.ay=u.o5?.ay||0;
      s.units[i]=su;
    }
    if (s.currentUnit!==undefined) {
      let u=units[s.currentUnit];
      if (u!==unit) { 
        
        // reset all units, not only current, sth also ai gets reseted
        for (let u of units) { u.maxlen=u.omaxlen;u.attack=false; }
        
        console.log('setting currentUnit '+s.currentUnit);
        unit=u;changes=true;
        //u.maxlen=u.omaxlen;u.attack=false;
        placeCursor();
        maxlen=u.maxlen;
        //tweens.length=0; 
        updateTurnInfo();
      }
    }
    if (changes) showMarks();
    //onsole.log(units);
    s.currentUnit=units.indexOf(unit);
    return s;
    //...
  }
  self.multiPlayerLoop=function(ps) {
    //---
    //let fn='/three/deep/flight/state.json';
    
    let o=self;
    
    function reset() {
      //---
      //console.log('reset nao "'+Conet.parseUrl().reset+'"');
      let s=o.etState();
      //Conet.upload({fn:fn,data:JSON.stringify(
      ps.upload({users:[
        {name:level.parties[0].name,c:0,party:level.parties[0].party},
        {name:level.parties[1].name,c:0,party:level.parties[1].party},
      ],state:s});//,undefined,' ')});
      Conet.log('Reset done.');
      //...
    }
    
    if (Conet.parseUrl().reset) reset();
    
    //s=o.etState();
    //Conet.upload({fn:fn,data:JSON.stringify({users:[],state:s},undefined,' ')});
    let user,wasCurrentUser,env;//='u'+(Math.random()+'').substr(2);
    console.log('start conet loop, user='+user);
    
    setInterval(function() {
      //---
      let s=o.etState(),cu=s.units[s.currentUnit];
      let currentUser=(user&&(cu.party==user.party))
         //||(user&&(user.party==1)&&cu.ai) //--- for now doesnt work: user 1 does ai
         //--- another approach also didnt work for now: currentUser=wasCurrentUser&&cu.ai
         ||(wasCurrentUser&&cu.ai)
        ;
      
      //onsole.log('currentUser: '+currentUser+' cu.ai='+cu.ai+' s.cunit='+s.currentUnit);
      
      if (currentUser||wasCurrentUser) {
         env.state=s;
         env.changes=(env.changes||0)+1;
         //Conet.upload({fn:fn,data:JSON.stringify(env,undefined,' ')});
         ps.upload(env);
         console.log('uploaded, changes='+env.changes);
      } else
      ps.download(function(v) {
        //---
        if (v===undefined) {
          console.log('no data, doing reset.');
          reset();
          return;
        }
        
        let h=JSON.parse(v);
        
        if (!h.users||!h.state) {
          console.log('empty data, doing reset.');
          reset();
          return;
        }
        
        env=h;
        console.log('downloaded, changes='+env.changes);
        
        if (!user) {
          if (h.users.length>=2) {
            h.users.length=2;
            user=h.users[0];
            user.c=(user.c||0)+1;
            h.users.splice(0,1);
            h.users.push(user);
            o.user=user;//Menu.ms(mnext,user.name);
            updateTurnInfo();
          } else {
            throw 'For now 2 fix users (Party 1, Party 2) must be in state.json.';
            //user='u'+(Math.random()+'').substr(2);
            //h.users.push({name:user,c:0});
          }
          h.changes=(h.changes||0)+1;
          console.log('upload '+h.changes);
          ps.upload(env);//{fn:fn,data:JSON.stringify(h,undefined,' ')});
          Conet.log('User is "'+user.name+'".');
        }
        
        o.etState(env.state);
        //console.log(h.users);
        //console.log(h);
        //...
      }
      );
      
      wasCurrentUser=currentUser;
      //...
    }
    ,1000);
    //...
  }
  
  let v;
  console.log(v='Flight 0.367 ');//FOLDORUPDATEVERSION
  Conet.log(v);
  return self;
  //...
}
;
//...

//fr o,1
//fr o,1,25
//fr o,1,27
//fr o,1,30,20
//fr o,1,31,27,76
//fr o,1,31,29,7
//fr o,1,31,29,38
//fr o,1,39,3
//fr o,1,41
//fr o,1,42
//fr o,1,42,5
//fr o,1,49,5
//fr o,1,54,4
//fr o,1,57
//fr o,1,58
//fr o,1,63
//fr o,1,64
//fr o,1,64,5
//fr o,1,64,14
//fr o,1,64,14,17
//fr p,0,153
