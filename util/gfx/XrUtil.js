import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
//import * as THREE from '/three/r124/build/three.module.js';
//import { XRControllerModelFactory } from '/three/r124/examples/jsm/webxr/XRControllerModelFactory.js';
let XrUtil={};
(function(pself) {
  //---
  let version='v.1.162 ',//FOLDORUPDATEVERSION
      self=pself,ctrl0,ctrl1,gp0,gp1,camera,scene,room,vrPos,huds=[],hudMesh,
      hud={lines:['XrUtil '+version],cursor:{x:0.5,y:0.5,vis:false},buttons:[]},
      raycaster,INTERSECTED,hudCount=0,needDrawUi=false;
  
  const tempMatrix=new THREE.Matrix4(),vt=new THREE.Vector3();
  
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
        vt.multiplyScalar(dt*0.01);
        room.position.x+=vt.x;
        room.position.y+=vt.y;
        room.position.z+=vt.z;
        if (vrPos) vrPos.add(vt);
        room.updateMatrix();
      }
    }
    //...
  }
  self.init=function(ps) {
    //---
    let renderer=ps.renderer;
    camera=ps.camera;
    room=ps.room;
    vrPos=ps.vrPos;
    scene=ps.scene;
    //let XRControllerModelFactory=ps.XRControllerModelFactory;
    
    function onSelectStart() {
      
      this.userData.isSelecting = true;
      
    }
    
    function onSelectEnd() {
      
      this.userData.isSelecting = false;
      
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
    
    
    if (!ps.sculpt) {
    ctrl0.addEventListener('connected',function (e) {
      //---
      this.add(buildController(e.data));
      //console.log(e.data.gamepad);
      gp0=e.data.gamepad;self.gp0=gp0;
      //...
    }
    );
    ctrl0.addEventListener('disconnected',function () {
      //---
      this.remove( this.children[0]);
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
      console.log('ctrl1 connected');
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
    //...
  }
  
  function drawHud() {
    //---
    const ct=hud.ct,c=hud.c,w=c.width,h=c.height;
    ct.clearRect(0,0,w,h);
    ct.fillStyle='rgba(0,0,0,0.3)';ct.fillRect(0,0,w,h);
    ct.font='20px sans-serif';//ct.textBaseline='top';
    //ct.fillText('c='+hudCount,2,2);
    const cur=hud.cursor,curx=cur.x*w,cury=cur.y*h;
    ct.textAlign='center';
    ct.textBaseline='middle';
    for (let b of hud.buttons) {
      const bx=b.x*w,by=b.y*h,bw=b.w*w,bh=b.h*h;
      if (b.pressed&&(!cur.down||!cur.vis)) b.pressed=false;
      if (cur.vis&&hudMesh.visible) {
        if ((curx>=bx)&&(cury>=by)&&(curx<=bx+bw)&&(cury<=by+bh)) {
          if (cur.down&&!b.pressed) {
            b.pressed=true;
            b.ondown();
          }
          ct.fillStyle=b.pressed?'rgba(150,150,50,0.5)':'rgba(100,100,100,0.5)';
          ct.fillRect(bx,by,bw,bh);
        }
      } 
      ct.strokeStyle=b.selected?'#fff':'#222';//#aaa
      ct.strokeRect(bx,by,bw,bh);
      if (b.ondraw) b.ondraw();
      if (b.color) {
        ct.fillStyle=b.color;
        ct.fillRect(bx+4,by+4,bw-8,bh-8);
      }
      if (b.s!==undefined) {
        ct.fillStyle='#ddd';
        ct.fillText(b.s,bx+bw/2,by+bh/2);
      }
    }
    ct.textAlign='start';
    ct.textBaseline='top';
    ct.fillStyle='#ddd';
    ct.font='14px sans-serif';//ct.textBaseline='top';
    for (let i=0;i<hud.lines.length;i++) {
      ct.fillText(hud.lines[i],3,3+i*12);
    }
    if (cur.vis) {
      ct.strokeStyle='#fff';
      ct.strokeRect(curx-5,cury-5,10,10);
    }
    hud.t.needsUpdate=true;
    needDrawUi=false;
    //...
  }
  
  self.log=function(s) {
    //---
    hud.lines.push(s);
    while (hud.lines.length>4) hud.lines.splice(0,1);
    //drawHud();
    needDrawUi=true;
    //...
  }
  
  self.initHud=function(ps) {
    const g=new THREE.PlaneGeometry(0.15,0.15);
    const c=document.createElement('canvas');c.width=256;c.height=256;
    const ct=c.getContext('2d');hud.c=c;hud.ct=ct;
    //ct.fillStyle='rgba(0,0,0,0.3)';ct.fillRect(0,0,c.width,c.height);
    //ct.font='20px sans-serif';ct.textBaseline='top';ct.fillStyle='#ff0';ct.fillText('n/i',2,2);
    const t1=new THREE.Texture(c);hud.t=t1;
    //t1.needsUpdate=true;
    drawHud();
    const planeMaterial=new THREE.MeshBasicMaterial({map:t1,opacity:1,transparent:true});
    const o=new THREE.Mesh(g,planeMaterial);
    o.position.set(-0.2,0,-0.5);
    o.rotation.y=0.3;hudMesh=o;
    //camera.add(o);o.position.set(-0.2,0,-0.5);o.rotation.y=0.3;
    //scene.add(o);
    ctrl0.add(o);o.position.set(-0.2,0,0);o.rotation.x=-1;o.rotation.y=1;
    huds.push(o);
    raycaster=new THREE.Raycaster();
    
    self.huds=huds;self.hudMesh=hudMesh;self.hud=hud;
    //...
  }
  
  self.renderHud=function() {
    //---
    if (hudMesh.visible) /* intersect */ {
      // find intersections
      tempMatrix.identity().extractRotation(ctrl1.matrixWorld);
      raycaster.ray.origin.setFromMatrixPosition(ctrl1.matrixWorld);
      raycaster.ray.direction.set(0,0,-1).applyMatrix4(tempMatrix);
      raycaster.far=0.1;
      const intersects=raycaster.intersectObjects(huds),//room.children);
            cursor=self.cursor;
      if (intersects.length>0) {
        const i0=intersects[0];
        //onsole.log(i0.distance);
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
        hud.cursor.vis=true;
        hud.cursor.down=gp1&&gp1.buttons[0].pressed;
        drawHud();
        if (cursor) cursor.visible=false;
      } else {
        //if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        INTERSECTED=undefined;
        if (cursor) cursor.visible=true;
        if (hud.cursor.vis) {
          hud.cursor.vis=false;
          drawHud();
        }
      }
      if (needDrawUi) drawHud();
    }
    //...
  }
  
  console.log('XrUtil '+version);
  //...
}
)(XrUtil);
export { XrUtil };
//fr o,5
//fr o,5,10
//fr o,5,10,8
//fr o,5,10,10
//fr o,5,10,57
//fr o,5,10,80
//fr o,5,10,81
//fr o,5,10,83
//fr o,5,10,89
//fr o,5,12
//fr o,5,14
//fr o,5,16
//fr o,5,18
//fr o,5,18,1
//fr p,18,9
