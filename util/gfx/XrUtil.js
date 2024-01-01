import * as THREE from '/three/r124/build/three.module.js';
import { XRControllerModelFactory } from '/three/r124/examples/jsm/webxr/XRControllerModelFactory.js';
let XrUtil={};
(function(pself) {
  //---
  let self=pself,gp0,camera,room,vrPos;
  
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
    
    
    
    
    let ctrl0=renderer.xr.getController(0);
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
    
    let ctrl1=renderer.xr.getController(1);
    ctrl1.addEventListener('selectstart',onSelectStart);
    ctrl1.addEventListener('selectend',onSelectEnd);
    if (!ps.sculpt)
    ctrl1.addEventListener('connected',function(e) {
      //---
      this.add(buildController(e.data));
      self.gp1=e.data.gamepad;
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
    
    
    let mode='immersive-vr';
    const sessionInit={optionalFeatures:['local-floor','bounded-floor','hand-tracking'
      //,'layers' // doesnt start xr on quest3 with 124, maybe with 143?
      ]};
    function onSessionStarted(session) {
      //---
      renderer.xr.setSession(session);
      self.isSession=1;
      //...
    }
    //---
    self.menuXr={s:'XR',actionf:function() {
      //---
      navigator.xr.requestSession(mode,sessionInit).then(onSessionStarted);
      //...
    }
    };
    self.menuXr.ms='v.0.3 ';//FOLDORUPDATEVERSION
    
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-ar')
    .then(function(supported) {
      if (supported) {
        self.menuXr.s='AR';
        mode='immersive-ar';
        //showStartXR( 'immersive-ar' );
      }
    }
      );
      if (navigator.xr.offerSession!==undefined) 
        navigator.xr.offerSession(mode,sessionInit).then(onSessionStarted);
    }
    //...
  }
  
  
  console.log('XrUtil v.1.95 ');//FOLDORUPDATEVERSION
  //...
}
)(XrUtil);
export { XrUtil };
//fr o,3
//fr o,3,6
//fr o,3,7
//fr o,3,7,7
//fr o,3,7,9
//fr o,3,7,81
//fr o,3,7,87
//fr p,18,132
