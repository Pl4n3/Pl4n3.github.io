import { XRControllerModelFactory } from '/three/r124/examples/jsm/webxr/XRControllerModelFactory.js';
let XrUtil={};
(function(XrUtil) {
  //---
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
  
  XrUtil.init=function(ps) {
    //---
    let renderer=ps.renderer;
    //let XRControllerModelFactory=ps.XRControllerModelFactory;
    
    function onSelectStart() {
      
      this.userData.isSelecting = true;
      
    }
    
    function onSelectEnd() {
      
      					this.userData.isSelecting = false;
      
    }
    
    let controller=renderer.xr.getController(0);
    controller.addEventListener('selectstart',onSelectStart);
    controller.addEventListener('selectend',onSelectEnd);
    controller.addEventListener('connected',function (e) {
      //---
      this.add(buildController(e.data));
      //console.log(e.data.gamepad);
      XrUtil.gp0=e.data.gamepad;
      //...
    }
    );
    controller.addEventListener('disconnected',function () {
      //---
      this.remove( this.children[0]);
      //...
    }
    );
    ps.scene.add(controller);
    //onsole.log(controller);
    
    const controllerModelFactory=new XRControllerModelFactory();
    
    let controllerGrip = renderer.xr.getControllerGrip( 0 );
    controllerGrip.add( controllerModelFactory.createControllerModel( controllerGrip ) );
    ps.scene.add( controllerGrip );
    
    let ctrl1=renderer.xr.getController(1);
    ctrl1.addEventListener('connected',function(e) {
      //---
      this.add(buildController(e.data));
      XrUtil.gp1=e.data.gamepad;
      //onsole.log('ctrl1 connected');
      //...
    }
    );
    ps.scene.add(ctrl1);
    
    let cg1=renderer.xr.getControllerGrip(1);
    cg1.add(controllerModelFactory.createControllerModel(cg1));
    ps.scene.add(cg1);
    
    XrUtil.controller=controller;
    XrUtil.ctrl1=ctrl1;
    //...
  }
  
  
  console.log('XrUtil v.1.15 ');//FOLDORUPDATEVERSION
  //...
}
)(XrUtil);
export { XrUtil };
//fr o,2
//fr o,2,3
//fr o,2,3,4
//fr o,2,3,11
//fr o,2,3,25
//fr p,3,1
