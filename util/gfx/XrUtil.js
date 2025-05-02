import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
//import * as THREE from '/three/r124/build/three.module.js';
//import { XRControllerModelFactory } from '/three/r124/examples/jsm/webxr/XRControllerModelFactory.js';
let XrUtil={};
(function(pself) {
  //---
  let version='v.1.629 ',//FOLDORUPDATEVERSION
      self=pself,ctrl0,ctrl1,gp0,gp1,camera,scene,room,vrPos,huds=[],hudMesh,
      hud={lines:['XrUtil '+version],cursor:{x:0.5,y:0.5,vis:false},buttons:[]},
      raycaster,INTERSECTED,hudCount=0,needDrawUi=false,input,uisc=2,gps,
      lastLogCount=1,euler=new THREE.Euler(0,1,0,'YXZ'),//inp,
      tempMatrix=new THREE.Matrix4(),vt=new THREE.Vector3();
  self.flightSpeed=0.01;
  
  self.tryHideKeyboard=function() {
    //---
    if (self.hideKeyboard) self.hideKeyboard();
    //...
  }
  
  function keyDown(e) {
    //---
    let b=input;
    if (!b) return;
    let kc=e.keyCode;
    if (kc==8) { //backspace
      if (b.s.length>0) b.s=b.s.substr(0,b.s.length-1);
    } else if ((kc==27)||(kc==13)) { //esc,return
      delete(b.color);
      input=undefined;
      self.tryHideKeyboard();
    } else if (!{16:1,17:1}[kc]) { //shift,ctrl
      b.s+=e.key;
      //onsole.log(e);
    }
    b.oninput(b.s);
    needDrawUi=true;
    //...
  }
  
  function buildController(data) {
    //---
    let geometry, material;
    
    switch ( data.targetRayMode ) {
    
    case 'tracked-pointer':
    
    geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
    
    material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );
    
    return new THREE.Line( geometry, material );
    
    case 'gaze':
    
    geometry = new THREE.RingBufferGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
    material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
    return new THREE.Mesh( geometry, material );
    
    }
    //...
  }
  self.checkFlight=function(dt) {
    //---
    if (gp0) {
      //otateObj.rotation.y+=gp0.axes[2]*dt*0.1;
      const dx=gp0.axes[2],dz=gp0.axes[3],md=0.1;
      let adx=Math.abs(dx),adz=Math.abs(dz);
      if ((adz>md)||(adx>md)) {
        //const position = new THREE.Vector3();
        //const rotation = new THREE.Quaternion();
        //const scale = new THREE.Vector3();
        //camera.matrixWorld.decompose(position,rotation,scale);
        tempMatrix.identity().extractRotation(camera.matrixWorld);
        adx=(adx-md)/(1-md);adx*=adx*adx*adx;
        adz=(adz-md)/(1-md);adz*=adz*adz*adz;
        vt.set(adx*(dx>0?-1:1),0,adz*(dz>0?-1:1));
        vt.applyMatrix4(tempMatrix);
        vt.multiplyScalar(dt*self.flightSpeed);
        room.position.x+=vt.x;
        room.position.y+=vt.y;
        room.position.z+=vt.z;
        if (vrPos) vrPos.add(vt);
        room.updateMatrix();
        room.updateWorldMatrix(false,true);
        //onsole.log(room.position);
        let p=room.position;
        if (gps.lskey) localStorage[gps.lskey]=JSON.stringify({
          x:p.x,y:p.y,z:p.z});
      }
    }
    //...
  }
  self.init=function(ps) {
    //---
    gps=ps;self.gps=gps;
    let renderer=ps.renderer;
    camera=ps.camera;
    room=ps.room;
    vrPos=ps.vrPos;
    scene=ps.scene;
    //let XRControllerModelFactory=ps.XRControllerModelFactory;
    
    function onSelectStart() {
      //---
      this.userData.isSelecting=true;
      //...
    }
    
    function onSelectEnd() {
      //---
      this.userData.isSelecting=false;
      //...
    }
    
    
    if (0&&ps.sculpt) {
      let scene=ps.scene;
    
      let ctrl0=renderer.xr.getController(0);
      ctrl0.addEventListener('selectstart',onSelectStart);
      ctrl0.addEventListener('selectend',onSelectEnd);
      scene.add(ctrl0);
    
      let ctrl1=renderer.xr.getController(1);
      ctrl1.addEventListener('selectstart',onSelectStart);
      ctrl1.addEventListener('selectend',onSelectEnd);
      scene.add(ctrl1);
    
      self.ctrl0=ctrl0;
      self.ctrl1=ctrl1;
      return;
    }
    
    
    
    
    ctrl0=renderer.xr.getController(0);
    ctrl0.addEventListener('selectstart',onSelectStart);
    ctrl0.addEventListener('selectend',onSelectEnd);
    
    
    //if (!ps.sculpt) 
    {
    ctrl0.addEventListener('connected',function (e) {
      //---
      if (!ps.sculpt) this.add(buildController(e.data));
      //console.log(e.data.gamepad);
      gp0=e.data.gamepad;self.gp0=gp0;
      //...
    }
    );
    ctrl0.addEventListener('disconnected',function () {
      //---
      if (!ps.sculpt) this.remove( this.children[0]);
      //...
    }
    );
    }
    ps.scene.add(ctrl0);
    //onsole.log(controller);
    
    //const controllerModelFactory=new XRControllerModelFactory();
    //let cg0=renderer.xr.getControllerGrip(0);
    //cg0.add(controllerModelFactory.createControllerModel(cg0));
    //ps.scene.add(cg0);
    
    ctrl1=renderer.xr.getController(1);
    ctrl1.addEventListener('selectstart',onSelectStart);
    ctrl1.addEventListener('selectend',onSelectEnd);
    //if (!ps.sculpt)
    ctrl1.addEventListener('connected',function(e) {
      //---
      if (!ps.sculpt) this.add(buildController(e.data));
      gp1=e.data.gamepad;self.gp1=gp1;
      //onsole.log(XrU til.gp1);
      //onsole.log('ctrl1 connected');
      //...
    }
    );
    ps.scene.add(ctrl1);
    
    if (!ps.sculpt) {
    const controllerModelFactory=new XRControllerModelFactory();
    let cg0=renderer.xr.getControllerGrip(0);
    cg0.add(controllerModelFactory.createControllerModel(cg0));
    ps.scene.add(cg0);
    
    let cg1=renderer.xr.getControllerGrip(1);
    cg1.add(controllerModelFactory.createControllerModel(cg1));
    ps.scene.add(cg1);
    }
    
    self.ctrl0=ctrl0;
    self.ctrl1=ctrl1;
    
    
    let mode='immersive-vr',currentSession=null;
    const sessionInit={optionalFeatures:['local-floor','bounded-floor','hand-tracking'
      //,'layers' // doesnt start xr on quest3 with 124, maybe with 143?
      ]};
    async function onSessionStarted(session) {
      //---
      session.addEventListener('end',onSessionEnded);
      await renderer.xr.setSession(session);
      self.isSession=1;
      currentSession=session;
      
      let o=hudMesh;
      if (o) {
        camera.remove(o); 
        ctrl0.add(o);o.position.set(-0.2,0,0);o.rotation.x=-1;o.rotation.y=1;
      }
      if (1&&gps.lskey) {
        try {
        let h=JSON.parse(localStorage[gps.lskey]||'{}');
        console.log('h from ls');
        console.log(h);
        if (h.x!==undefined) {
          room.position.set(h.x,h.y,h.z);
          room.updateMatrix();
          room.updateWorldMatrix(false,true);
        }
        } catch (e) { console.error(e); }
      }
      if (self.onSessionStarted) self.onSessionStarted();
      //...
    }
    function onSessionEnded() {
      //---
      currentSession.removeEventListener('end',onSessionEnded);
      currentSession=null;
      self.isSession=false;
      //...
    }
    //---
    self.menuXr={s:'XR',actionf:function() {
      //---
      if (currentSession===null) 
        navigator.xr.requestSession(mode,sessionInit).then(onSessionStarted);
      else {
        currentSession.end();
        if (navigator.xr.offerSession!==undefined) 
          navigator.xr.offerSession(mode,sessionInit).then(onSessionStarted);
      }
      //...
    }
    };
    self.menuXr.ms=version;
    
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-ar')
    .then(function(supported) {
      if (supported) {
        self.menuXr.s='AR';
        mode='immersive-ar';
        //showStartXR( 'immersive-ar' );
      }
      if (navigator.xr.offerSession!==undefined) 
        navigator.xr.offerSession(mode,sessionInit).then(onSessionStarted);
      //...
    }
      );
    }
    
    //--- not needed if inp would work
    window.addEventListener('keydown',keyDown);
    
    self.menuHudPosition={s:'Hud',r:1,ms:'Position',autoval:1,setfunc:function(v) {
      //---
      if (v=='Desktop') hudMesh.position.set(-0.15,0.1,-0.4);
      if (v=='Phone') hudMesh.position.set(-0.15,0,-0.25);
      if (v=='Away') hudMesh.position.set(-0.35,0.1,-0.4);
      if (v=='Faraway') hudMesh.position.set(-1,0.1,-0.4);
      //o.rotation.y=0.3; //-0.15,0.1,-0.4
      //...
    }
    ,sub:[{s:'Phone'},{s:'Desktop'},{s:'Away'},{s:'Faraway'}]};
    
    if (0) /* inp, keyboard not showing up in xr */ {
      //---
      let c=document.createElement('input'),s=c.style;inp=c;self.inp=c;
      c.type='text';c.size=3;c.value='aa';
      s.position='absolute';s.top='0px';s.left='30px';s.width='1px';s.height='1px';s.zIndex=-1;
      document.body.appendChild(c);c.setSelectionRange(2,2);//inp.focus();
      
      c.addEventListener('input',function(e) {
        //---
        self.log('inp='+c.value);
        //...
      }
      );
      
      //c.focus();
      //...
    }
    
    
    //...
  }
  self.uiMenuSet=function(ps) {
    //--
    for (let b of ps.menu) b.pressed=true;
    hud.buttons=ps.menu;
    //...
  }
  
  function showKeyboard() {
    //---
    let esc,backspace,enter,a=[];
    
    function ondown() {
      //---
      let s=this.s;
      //onsole.log('keyOndown '+s);
      let e={key:s,keyCode:0};
      if (s==esc) e.keyCode=27;
      else if (s==backspace) e.keyCode=8;
      else if (s==enter) e.keyCode=13;
      keyDown(e);
      //if (!input) for (let b of a) {
      //  let i=hud.buttons.indexOf(b);hud.buttons.splice(i,1);
      //  //console.log('hided keyboard');
      //}
      //...
    }
    
    self.hideKeyboard=function() {
      //---
      for (let b of a) {
        let i=hud.buttons.indexOf(b);hud.buttons.splice(i,1);
        //console.log('hided keyboard');
      }
      a.length=0;
      //...
    }
    
    let ks=[esc='␛','0','1','2','3','4','5','6','7','8','9','.','-',backspace='⇦',enter='⏎'];
    for (let i=0;i<ks.length;i++) {
      let b={x:0.02+i*0.06,y:0.3,w:0.05,h:0.07,s:ks[i],ondown:ondown};
      hud.buttons.push(b);a.push(b);
    }
    needDrawUi=true;
    //...
  }
  
  function drawHud() {
    //---
    //onsole.log('drawHud');
    const ct=hud.ct,c=hud.c,w=c.width,h=c.height;
    ct.clearRect(0,0,w,h);
    ct.lineWidth=uisc;
    ct.fillStyle='rgba(0,0,0,0.3)';ct.fillRect(0,0,w,h);
    ct.font=(16*uisc)+'px sans-serif';//ct.textBaseline='top';
    //ct.fillText('c='+hudCount,2,2);
    const cur=hud.cursor,curx=cur.x*w,cury=cur.y*h;
    //ct.fillStyle='white';ct.fillText((cur.vis?1:0)+' '+Conet.f4(curx)+' '+Conet.f4(cury),12,40);
    ct.textAlign='center';
    ct.textBaseline='middle';
    let newMenu,lb;//,bOndown;
    for (let b of hud.buttons) {
      //let dx=b.dx||0,dy=b.dy||0;
      if (b.w===undefined) b.w=lb.w;
      if (b.h===undefined) b.h=lb.h;
      if (b.x===undefined) b.x=lb.x+(b.dx!==undefined?lb.w+b.dx:0);
      if (b.y===undefined) b.y=lb.y+(b.dy!==undefined?lb.h+b.dy:0);
      const bx=b.x*w,by=b.y*h,bw=b.w*w,bh=b.h*h;
      if (b.pressed&&(!cur.down||!cur.vis)) b.pressed=false;
      if (cur.vis&&hudMesh.visible) {
        if ((curx>=bx)&&(cury>=by)&&(curx<=bx+bw)&&(cury<=by+bh)&&!b.noinp) {
          if (cur.down&&!b.pressed) {
            b.pressed=true;let sthdone=false;
            if (b.subUp) {
              delete(hud.menuSub);
              newMenu=hud.menu0;sthdone=true;
              //onsole.log('delete menuSub 0');
            } else if (b.sub) {
              if (!hud.menu0) hud.menu0=hud.buttons;//alternatively maintain hud.menuStack[]
              hud.menuSub=b;
              newMenu=b.sub;sthdone=true;
              newMenu[0].subUp=true;
            } //else 
            if (b.ondown) { 
              //onsole.log('before ondown');
              //onsole.log(hud.buttons);
              //onsole.log(hud.buttons.indexOf(b));
              cur.down=false;
              b.ondown();//if (!bOndown) { bOndown=b;b.ondown(); }
              if (hud.menuSub) if (!hud.menuSub.stay) {
                delete(hud.menuSub);
                newMenu=hud.menu0;
                //onsole.log('delete menuSub 1');
              }
              sthdone=true;
            } else if (b.oninput) {
              b.color='rgba(250,250,0,0.5)';
              input=b;
              sthdone=true;
              showKeyboard();
              //inp.value=b.s;
              //inp.focus();
              //onsole.log('inp.focus');
            } 
            if (!sthdone) { console.log('no ondown >:[');console.log(b); }
          }
          ct.fillStyle=b.pressed?'rgba(150,150,50,0.5)':'rgba(100,100,100,0.5)';
          ct.fillRect(bx,by,bw,bh);
        }
      } 
      if (!b.noinp) {
        ct.strokeStyle='#000';
        ct.strokeRect(bx+0.5,by+0.5,bw,bh);
        ct.strokeStyle=b.selected?'#fff':(b.oninput?'#440':'#222');//#aaa
        ct.strokeRect(bx,by,bw,bh);
      }
      if (b.ondraw) b.ondraw();
      if (b.color) {
        ct.fillStyle=b.color;
        ct.fillRect(bx+4,by+4,bw-8,bh-8);
      }
      if (b.ms) {
        ct.textAlign='left';
        ct.textBaseline='bottom';
        ct.font=(7*uisc)+'px sans-serif';
        ct.fillStyle='#888';
        ct.fillText(b.ms,bx+2*uisc,by+bh-uisc);
        ct.textAlign='center';
        ct.textBaseline='middle';
        ct.font=(16*uisc)+'px sans-serif';
      }
      if (b.s!==undefined) {
        ct.fillStyle='#ddd';
        if (b.align=='left') {
          ct.textAlign='start';
          ct.fillText(b.s,bx+3*uisc,by+bh/2);
          ct.textAlign='center';
        } else 
          ct.fillText(b.s,bx+bw/2,by+bh/2);
      }
      lb=b;
    }
    ct.textAlign='start';
    ct.textBaseline='top';
    ct.fillStyle='#ddd';
    ct.font=(10*uisc)+'px sans-serif';//ct.textBaseline='top';
    for (let i=0;i<hud.lines.length;i++) {
      ct.fillText(hud.lines[i]+((i==hud.lines.length-1)&&(lastLogCount>1)?'['+lastLogCount+']':'')
        ,3*uisc,(3+i*10)*uisc);
    }
    if (cur.vis) {
      ct.strokeStyle='#fff';
      ct.strokeRect(curx-5*uisc,cury-5*uisc,10*uisc,10*uisc);
    }
    hud.t.needsUpdate=true;
    
    if (newMenu) {
      self.uiMenuSet({menu:newMenu});
      //for (let b of newMenu) b.pressed=true;
      //hud.buttons=newMenu;
    }
    needDrawUi=newMenu;
    //if (bOndown) bOndown.ondown();
    //...
  }
  function hudIntersects(i0,down) {
    //---
    //onsole.log(i0.distance);
    if (i0) {
      if (INTERSECTED!=i0.object) {
        //if (INTERSECTED) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        INTERSECTED=i0.object;
        //INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        //INTERSECTED.material.emissive.setHex( 0xff0000 );
        //onsole.log('intersected');
       hudCount++;    
      }
      //hud.lines[0]='c '+hudCount;
      //hud.lines[1]=i0.uv.x;
      //hud.lines[2]=i0.uv.y;
      hud.cursor.x=i0.uv.x;
      hud.cursor.y=1-i0.uv.y;
      //onsole.log(hud.cursor.x+' '+hud.cursor.y);
      hud.cursor.vis=true;
      hud.cursor.down=down;//gp1&&gp1.buttons[0].pressed;
      drawHud();
      if (self.cursor) self.cursor.visible=false;
    } else {
      //---
      INTERSECTED=undefined;
      if (self.cursor) self.cursor.visible=true;
      if (hud.cursor.vis) {
        hud.cursor.vis=false;
        drawHud();
      }
    }
    //...
  }
  self.hudIntersects=hudIntersects;
  self.log=function(s) {
    //---
    let lines=hud.lines,doAdd=true;
    if (lines.length>0) {
      if (lines[lines.length-1]==s) { lastLogCount++;doAdd=false; }
      else if (lastLogCount>1) {
        lines[lines.length-1]+='['+lastLogCount+']';
        lastLogCount=1;
      }
    }
    if (doAdd) {
      hud.lines.push(s);
      while (hud.lines.length>7) hud.lines.splice(0,1);
    }
    //drawHud();
    needDrawUi=true;
    //...
  }
  self.initHud=function() {
    const g=new THREE.PlaneGeometry(0.15,0.15);
    const c=document.createElement('canvas');
    c.width=256*uisc;
    c.height=c.width;
    const ct=c.getContext('2d');hud.c=c;hud.ct=ct;
    //ct.fillStyle='rgba(0,0,0,0.3)';ct.fillRect(0,0,c.width,c.height);
    //ct.font='20px sans-serif';ct.textBaseline='top';ct.fillStyle='#ff0';ct.fillText('n/i',2,2);
    const t1=new THREE.Texture(c);hud.t=t1;
    //t1.needsUpdate=true;
    drawHud();
    const planeMaterial=new THREE.MeshBasicMaterial({map:t1,opacity:1,transparent:true,side:THREE.DoubleSide
       ,depthTest:gps.depthTest||false
     });
    const o=new THREE.Mesh(g,planeMaterial);
    //o.position.set(-0.2,0,-0.5);
    //o.rotation.y=0.3;
    hudMesh=o;
    
    camera.add(o);o.position.set(-0.15,0.1,-0.4);//o.rotation.y=0.3; //-0.15,0.1,-0.4
    //scene.add(o);
    
    //ctrl0.add(o);o.position.set(-0.2,0,0);o.rotation.x=-1;o.rotation.y=1;
    
    huds.push(o);
    raycaster=new THREE.Raycaster();
    
    self.huds=huds;self.hudMesh=hudMesh;self.hud=hud;
    
    if (gps.pointers) {
    
    let pointDown=false,rayed=gps.pointers.rayed;
    
    function point(x,y,mode,e) {
      //---
      let p2=new THREE.Vector2(2*x/window.innerWidth-1,-2*y/window.innerHeight+1);
      raycaster.setFromCamera(p2,camera);
      
      let a=raycaster.intersectObjects(scene.children);
      
      //if (mode==1) {
      //  console.log('point a.len='+a.length);
      //  console.log(a);
      //}
      
      let np=undefined,hudo=undefined,paintco=undefined;
      for (let co of a) {
        let o=co.object;
        if (o===hudMesh) {
          //onsole.log('hud');
          hudo=co;
          break;
        }
      }
      
      gps.controls.enabled=!hudo;
      hudIntersects(hudo,mode==1);
      if (hudo) return;
      
      if (rayed) rayed(a,mode);
      //...
    }
    
    
    const canv=gps.renderer.domElement;
    canv.parentElement.addEventListener('pointermove',function(e) {
      //---
      //onsole.log('pointermove');
      point(e.clientX,e.clientY,2,e);
      //...
    }
    );
    canv.addEventListener('pointerdown',function(e) {
      //---
      //onsole.log('pointerdown');
      pointDown=true;
      point(e.clientX,e.clientY,1,e);
      //onsole.log(e);
      //...
    }
    );
    canv.parentElement.addEventListener('pointerup',function(e) {
      //---
      //onsole.log('mouseup');
      pointDown=false;
      point(e.clientX,e.clientY,0,e);
      //...
    }
    );
    
    }
    //...
  }
  self.rayAll=true;
  self.renderHud=function() {
    //---
    let i0=undefined;
    //if (hudMesh.visible) {
      if (self.isSession) {
        //console.log('renderHud 0');
        // find intersections
        tempMatrix.identity().extractRotation(ctrl1.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(ctrl1.matrixWorld);
        raycaster.ray.direction.set(0,0,-1).applyMatrix4(tempMatrix);
        let gp1b0=gp1&&gp1.buttons[0].pressed,rayCheck=self.rayCheck;
        if (self.rayAll) {
          //console.log('renderHud 1');
          raycaster.far=Infinity;
          
          let a;
          if (self.rayObjs) a=raycaster.intersectObjects(self.rayObjs,false);
          else a=raycaster.intersectObjects(scene.children);
          //onsole.log(a.length);
          for (let co of a) {
            let o=co.object;
            if ((o===hudMesh)&&(co.distance<0.1)
              &&hudMesh.visible) { 
              //onsole.log('renderHud 2 '+co.distance);
              i0=co;
              break;
              //onsole.log(co);
            }
            if (o.userData.rayCol) {
              if (self.rayCol) self.rayCol(co,gp1b0);
              break;
            }
            if (o.userData.xrRay) { o.userData.xrRay(co,gp1b0);break; }
            if (rayCheck) if (rayCheck(co)) break;
          }
        } else if (hudMesh.visible) {
          //onsole.log('renderHud 3');
          raycaster.far=0.1;
          const intersects=raycaster.intersectObjects(huds),//room.children);
                cursor=self.cursor;
          //let i0=undefined;
          if (intersects.length>0) i0=intersects[0];
          //onsole.log('renderHud 3 '+i0);
        }
        if (hudMesh.visible) hudIntersects(i0,i0&&gp1b0);
      }
      if (hudMesh.visible&&needDrawUi) drawHud();
    //}
    return i0;
    //...
  }
  self.setNeedDrawUi=function() {
    //---
    needDrawUi=true;
    //...
  }
  self.scaleSwitch=function(ps) {
    //---
    let scaleCfg=ps.scaleCfg,
        scfg=ps.noStartScfg?undefined:scaleCfg[0],
        sc=scfg?scfg.sc:0,bgMat;
    
    {
    let m;
    room.add(m=new THREE.Mesh(new THREE.BoxGeometry(10,10,10),
      bgMat=new THREE.MeshBasicMaterial({color:0x555566,transparent:false,opacity:1,side:THREE.BackSide,visible:false})));
    let sc=ps.bgMeshScale||2.61;
    m.scale.set(sc,sc,sc);
    m.position.y=2;
    }
    
    return function() {
      //---
      //onsole.log('scale nao');
      let oscfg=scfg;
      let oroomsc=room.scale.x;
      if (sc==scaleCfg[0].sc) {
        scfg=scaleCfg[1];//oscfg=scaleCfg[0];
      } else {
        scfg=scaleCfg[0];//oscfg=scaleCfg[1];
      }
      self.scfg=scfg;
      if (gps.room0&&!scfg.room0Rot) gps.room0.rotation.y=0;
      sc=scfg.sc;
      
      //onsole.log(scfg);
      
      if (ps.pl0) {
        ps.pl0.intensity=scfg.lint;
        //onsole.log('setting p0 '+scfg.lint);
        //ps.pl0.shadow.camera.near=100*sc;
        //ps.pl0.shadow.camera.far=1000*sc;
        //ps.pl0.shadow.camera.updateProjectionMatrix(); 
      }
      if (ps.pl1) ps.pl1.intensity=scfg.lint/3;
      
      if (ps.lights) for (let l of ps.lights) {
        l.light.intensity=scfg.lint*l.intensity;
        if (!l.light.castShadow) continue;
        let c=l.light.shadow.camera;
        c.near=10*sc;
        c.far=1000*sc;
        c.updateProjectionMatrix();
      }
      
      self.flightSpeed=scfg.flightSpeed;
      room.scale.set(sc,sc,sc);
      //bgMat.opacity=scfg.bgop;
      bgMat.visible=scfg.bgop==1?true:false;
      
      
      if (self.isSession) {
        let rp=room.position;
        //elf.log('roompos '+Conet.f4(rp.x)+' '+Conet.f4(rp.y)+' '+Conet.f4(rp.z));
        if (oscfg) oscfg.roomPos={x:rp.x,y:rp.y,z:rp.z}
        if (scfg.roomPos) {
          rp.x=scfg.roomPos.x;rp.y=scfg.roomPos.y;rp.z=scfg.roomPos.z;
        }
        //self.log('vrPos '+Conet.f4(vrPos.x)+' '+Conet.f4(vrPos.y)+' '+Conet.f4(vrPos.z));
        //if (oscfg) oscfg.vrPos={x:vrPos.x,y:vrPos.y,z:vrPos.z}
        //if (scfg.vrPos) {
        //  vrPos.x=scfg.vrPos.x;vrPos.y=scfg.vrPos.y;vrPos.z=scfg.vrPos.z;
        //  //blockWalk.tweens.push({o:vrPos,key:'x',t:t,value:scfg.vrPos.x});
        //  //blockWalk.tweens.push({o:vrPos,key:'y',t:t,value:scfg.vrPos.y});
        //  //blockWalk.tweens.push({o:vrPos,key:'z',t:t,value:scfg.vrPos.z});
        //}
      } else {
        let cp=camera.position;
        //elf.log('camPos '+Conet.f4(cp.x)+' '+Conet.f4(cp.y)+' '+Conet.f4(cp.z));
        if (oscfg) oscfg.camPos={x:cp.x,y:cp.y,z:cp.z}
        if (scfg.camPos) {
          cp.x=scfg.camPos.x;cp.y=scfg.camPos.y;cp.z=scfg.camPos.z;
          //blockWalk.tweens.push({o:cp,key:'x',t:t,value:scfg.camPos.x});
          //blockWalk.tweens.push({o:cp,key:'y',t:t,value:scfg.camPos.y});
          //blockWalk.tweens.push({o:cp,key:'z',t:t,value:scfg.camPos.z});
        }
      }
      
      if (self.onScaleSwitch) self.onScaleSwitch({oroomsc:oroomsc,scfg:scfg});
      
      /*
      if (sc==0.25) {
        sc=0.025; 
        pl0.intensity=0.3;
        pl1.intensity=0.08;
        xrUtil.flightSpeed=0.001;
        //pl0.distance=0.25;
        //pl1.distance=1.0;
      } else {
        sc=0.25;
        pl0.intensity=30;
        pl1.intensity=8;
        xrUtil.flightSpeed=0.01;
      }
      room.scale.set(sc,sc,sc);
      */
      //...
    }
    
    //...
  }
  
  self.subMenu=function(ps) {
    //---
    let ondown=ps.ondown||function() {
      //---
      let m=ps.mval;
      if (m) {
        m.s=this.s;
        if (input===m) {
          input=undefined;
          delete(m.color);
        }
        if (m.oninput) m.oninput(m.s);
      }
      //console.log('==>'+this.s);
      //...
    }
    
    let md=ps.md;
    if (!md) md={s:'v',dx:0.01,w:0.05};
    md.sub=[];
    for (let s of ps.a) {
      let m={s:s,ondown:ondown};
      if (md.sub.length==0) {
        m.x=0.05;m.y=0.4;m.w=0.25;m.h=0.08;
      } else m.dy=0.015;
      md.sub.push(m);
    }
    return md;
    //...
  }
  self.getAy=function() {
    //---
    tempMatrix.identity().extractRotation(camera.matrixWorld);
    euler.setFromRotationMatrix(tempMatrix);
    return euler.y;
    //...
  }
  self.fileMenu=function(ps) {
    //---analog to conet.fileMenu
    let path=ps.path,dirfn=ps.path+'/files.json',mFn,mDir,lsKey=ps.lsKey,dir,dirOff=0;
    //-------temp start (for modularize)
    //let loadfn=ps.loadfn//,mDirUpdate=ps.mDirUpdate
        //dirLoaded=ps.dirLoaded
    //    ;
    //-------temp end
    
    function dirUpload() {
      //---
      let s=JSON.stringify(dir);
      //onsole.log(s);
      if (isConet) Conet.upload({fn:dirfn,data:s});
      localStorage[lsKey+'dir']=s;
      //...
    }
    
    
    function dirFileLoad() {
      //---
      let i=this.i,fn=dir.a[i].fn;
      //let key=lsFnKey(fn);
      //console.log('fn='+fn+' key='+key);
      //let ls=localStorage[key];
      //load(ls);
      loadfn(fn);
      
      if (dir.i!==i) {
        dir.i=i;
        mFn.s=fn;
        dirUpload();//localStorage[lsKey+'dir']=JSON.stringify(dir);
        mDirUpdate();
      }
      
      self.log('Loaded \''+fn);//+'\' '+ls.length+'b');
      self.uiMenuSet({menu:self.hud.menu0});
      //onsole.log(this);
      //...
    }
    function dirFileDel() {
      //---
      
      let i=this.i,fn=dir.a[i].fn,key=lsFnKey(fn);
      let ls=localStorage[key];
      if ((dir.i>=i)&&(i!=0)) dir.i--;
      dir.a.splice(i,1);
      dirUpload();//localStorage[lsKey+'dir']=JSON.stringify(dir);
      mDirUpdate();
      localStorage[key]='';
      console.log('emptied localStorage length='+localStorage[key].length);
      
      self.log('Deleted \''+fn+'\' '+ls.length+'b');
      self.uiMenuSet({menu:self.hud.menu0});
      //...
    }
    
    
    
    function mDirUpdate() {
      //---
      mDir.sub.length=1;
      mDir.ms=(dir.i+1)+' / '+dir.a.length;
      //onsole.log(dirOff);
      //onsole.log(dir);
      //for (let f of dir.a) mDir.sub.push({s:f.fn,dy:0.01,h:0.08});
      for (let ih=0;ih<Math.min(6,dir.a.length-dirOff);ih++) {
        let i=ih+dirOff;
        mDir.sub.push({s:' '+i+' '+dir.a[i].fn,x:0.05,dy:0.01,w:0.6,h:0.08,i:i,ondown:dirFileLoad,align:'left'});
        if (dir.a.length>1) mDir.sub.push({s:'del',dx:0.02,w:0.15,i:i,ondown:dirFileDel});
      }
      mDir.sub.push({s:'^',x:0.84,y:0.41,w:0.1,h:0.08,ondown:function() {
        //---
        //onsole.log('up');
        //onsole.trace();
        dirOff=Math.max(dirOff-6,0);mDir.stay=true;
        setTimeout(mDirUpdate,0);
        //...
      }
      });
      mDir.sub.push({s:'V',x:0.84,y:0.5,w:0.1,h:0.08,ondown:function() {
        //---
        //onsole.log('down');
        //onsole.trace();
        dirOff+=6;mDir.stay=true;
        setTimeout(mDirUpdate,0);
        //...
      }
      });
      self.setNeedDrawUi();
      //...
    }
    
    
    function dirLoaded(s) {
      //---
      dir=s;
      if (dir) dir=JSON.parse(dir); else dir={i:0,a:[{fn:''}]};
      //onsole.log(dir);
      if (dir.i>=dir.a.length) dir.i=0;
      
      if (ps.setExamples) ps.setExamples(dir);
      
      let fn=dir.a[dir.i].fn;
      //onsole.log(fn);
      //if (!ps.skipStartLoad) mFn.s=fn;//xrUtil.log(dir.a.length+' files, index='+dir.i+'.');
      dirOff=Math.max(0,dir.a.length-5);
      //ps.tempSetVars({dir:dir,dirOff:dirOff});
      
      mDirUpdate();
      if (!ps.skipStartLoad) {
        mFn.s=fn;
        loadfn(fn);
      }
      
      //let ls=localStorage[lsFnKey(fn)];
      //if (ls) load(ls);
      //else {
      //  let g=new THREE.BoxGeometry(0.01,0.01,0.01),
      //  mesh=new THREE.Mesh(g,matPoint0);
      //  mesh.position.set(0,1,0);
      //  scene.add(mesh);points.push(mesh);
      //
      //  mesh=new THREE.Mesh(g,matPoint0);
      //  mesh.position.set(0.05,1.05,0.05);
      //  scene.add(mesh);points.push(mesh);
      //
      //  mesh=new THREE.Mesh(g,matPoint0);
      //  mesh.position.set(0.1,1.05,0.05);
      //  scene.add(mesh);points.push(mesh);
      //}
      
      
      //...
    }
    
    function lsFnKey(fn) {
      //
      return lsKey+((fn.length>0)?'file'+fn:'');
      //...
    }
    
    function loadfn(fn) {
      //---
      if (fn.startsWith('file:')) {
        //onsole.log('load file nao: '+fn);
        fn=path+'/'+fn.substr(5)+'.json';
        self.log('Fileload: '+fn);
        Conet.download({fn:fn,f:ps.load,log:self.log});
        return;
      } 
      let ls=localStorage[lsFnKey(fn)];
      if (ls) ps.load(ls);
      //...
    }
    
    function save(ps) {
      //---
      let fn=ps.fn;//mFn.s;
      if (dir)
      if (dir.a[dir.i].fn!=fn) { //---update dir
        dir.i=undefined;
        for (let i=dir.a.length-1;i>=0;i--) {
          if (dir.a[i].fn==fn) {
            //  if files can be removed via remove button, better do here skip with msg:
            //  'file already exists, remove it first'
            self.log('File already exists, first delete it.');
            return;
            //dir.i=i;break;
          }
        }
        if (dir.i===undefined) {
          dir.a.push({fn:fn});
          dir.i=dir.a.length-1;
          mDirUpdate();
        }
        //localStorage[lsKey+'dir']=JSON.stringify(dir);
        dirUpload();
      }
      
      let s=ps.data;//serialize();
      if (fn.startsWith('file:')) {
        fn=path+'/'+fn.substr(5)+'.json';
        //elf.log('Filesave: '+fn);
        Conet.upload({fn:fn,data:s,log:self.log});
      } else 
        localStorage[lsFnKey(fn)]=s;
      self.log('Saved '+s.length+'b.');
      //...
    }
    
    
    
    
    let isConet=Conet.checkOnline();
    
    self.hud.buttons.push(
    mFn={s:'file:test0',ms:'Current file',x:0.05,y:0.85,w:0.4,h:0.1,oninput:function(v) {
      //---
      //xrUtil.log(v);
      //...
    }
    },
    
    mDir={s:'\u25bc',ms:'Files',x:0.5,y:0.85,w:0.1,h:0.1,sub:[
      {s:'Files \u25b2',x:0.05,y:0.3,w:0.4,h:0.1}
      ,{s:'File0',dy:0.05}
    ]},
    
    {s:'Save',x:0.65,y:0.85,w:0.3,h:0.1,ondown:function() {
      //---
      save({fn:mFn.s,data:ps.serialize()});
      //let fn=mFn.s;
      //if (dir.a[dir.i].fn!=fn) { //---update dir
      //  dir.i=undefined;
      //  for (let i=dir.a.length-1;i>=0;i--) {
      //    if (dir.a[i].fn==fn) {
      //      //  if files can be removed via remove button, better do here skip with msg:
      //      //  'file already exists, remove it first'
      //      xrUtil.log('File already exists, first delete it.');
      //      return;
      //      //dir.i=i;break;
      //    }
      //  }
      //  if (dir.i===undefined) {
      //    dir.a.push({fn:fn});
      //    dir.i=dir.a.length-1;
      //    mDirUpdate();
      //  }
      //  localStorage[lsKey+'dir']=JSON.stringify(dir);
      //}
      //
      //let s=serialize();
      //localStorage[lsFnKey(fn)]=s;
      //xrUtil.log('Saved '+s.length+' bytes.');
      //...
    }
    },
    
    
    );
    
    
    
    
    
    
    let fn=Conet.parseUrl().file;
    
    //console.log('file='+fn);
    //console.log(encodeURI('file='+fn));
    //console.log(decodeURI('file%3Acannon0'));
    
    if (fn) {
      mFn.s=fn;
      loadfn(fn);
    } else {
    
      if (isConet) {
        //xrUtil.log('Fileload: '+dirfn+'.');
        Conet.download({fn:dirfn,f:dirLoaded});
      } else dirLoaded(localStorage[lsKey+'dir']);
    
    }
    
    //---temp for modularize
    //return {mFn:mFn};
    //ps.tempSetVars({mFn:mFn,mDir:mDir});
    //...
  }
  
  console.log('XrUtil '+version);
  //...
}
)(XrUtil);
export { XrUtil };
//fr o,5
//fr o,5,9
//fr o,5,11
//fr o,5,15
//fr o,5,15,9
//fr o,5,15,11
//fr o,5,15,42
//fr o,5,15,59
//fr o,5,15,82
//fr o,5,15,83
//fr o,5,15,85
//fr o,5,15,98
//fr o,5,15,101
//fr o,5,15,101,6
//fr o,5,18
//fr o,5,18,3
//fr o,5,18,5
//fr o,5,20
//fr o,5,21
//fr o,5,23
//fr o,5,24,36
//fr o,5,24,38
//fr o,5,24,40
//fr o,5,26
//fr o,5,27
//fr o,5,30
//fr o,5,30,1
//fr o,5,32
//fr o,5,32,12
//fr o,5,32,19
//fr o,5,32,23
//fr o,5,32,25
//fr p,29,663
