//----
(function() {
  //---
  //onsole.log('dungeonGeometry.js');
  //onsole.log(document.currentScript);
  window.w3ditScriptInit(function (ps) {
    //---
    let m=new THREE.Mesh(
       new THREE.BoxGeometry(0.1,0.1,0.1),
       new THREE.MeshPhongMaterial({flatShading:true,color:0xdddddd,transparent:true,opacity:0.9}));
    ps.mesh.add(m);
    //...
  }
  );
  //...
}
)();
//----
//fr o,1
//fr o,1,3
//fr p,3,10
