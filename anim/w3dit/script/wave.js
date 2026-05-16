//----
(function() {
  //---
  //tries to simulate https://x.com/flockaroo/status/1894088185019318565
  //next: according to the animation angle is different for 
  //different elements of the same depth, maybe try dependence on x?
  
  
  let mesh0,t=0,
      maxDepth=4;
  
  function transform(mesh,depth,x) {
    //---
    //mesh.rotation.z=1*Math.sin(t*0.002);
    
    //console.log(x);
    
    if (1) {
      let v=1;for (let i=0;i<depth-1;i++) v*=2;
      mesh.rotation.z=
      (Math.sin(t*0.001)-1)
      *0.25
      
      +0.2*Math.sin(t*(0.001+depth*0.001)+v*x*Math.PI);
    } else if (1) { //---
      let v=1;for (let i=0;i<depth-1;i++) v*=2;
      mesh.rotation.z=0.2*Math.sin(t*0.001+v*x*Math.PI);
    } else
    mesh.rotation.z=
    (Math.sin(t*0.001)-1)
    *0.25
    //*0.4*(5+depth)/(5+maxDepth)+
    +
    0.1*Math.sin(t*0.01+depth*Math.PI/4);
    //(0.2+(depth*0.1))*Math.sin(t*0.001
    ////+depth*Math.PI/4
    //+depth*x*Math.PI/4);
    
    depth++;
    let dx=1;for (let i=0;i<depth;i++) dx/=2;
    //for (let m of mesh.children) transform(m,depth);
    if (mesh.children.length>0) {
    transform(mesh.children[0],depth,x-dx);
    transform(mesh.children[1],depth,x+dx);
    }
    if (mesh.children.length>2) {
    transform(mesh.children[2],depth,x);
    transform(mesh.children[3],depth,x);
    }
    //...
  }
  
  //onsole.log('dungeonGeometry.js');
  //onsole.log(document.currentScript);
  window.w3ditScriptInit({initf:function (ps) {
    //---
    
    if (0) {
    let m=new THREE.Mesh(
       new THREE.BoxGeometry(0.1,0.1,0.1),
       new THREE.MeshPhongMaterial({flatShading:true,color:0xdddddd,transparent:true,opacity:0.9}));
    m.userData.editPoint=ps.mesh;
    ps.mesh.add(m);
    }
    
    if (0) {
    let ge=new THREE.BufferGeometry();
    
    let vs=[
       [-1,0,0]
      ,[0,0,1]
      ,[1,0,0]
      ,[0,0,-1]
      ,[0,-1,0]
      ,[0,0,0]//5
      ,[-0.7,0,0.7]
      ,[-0.7,-0.7,0]
      ,[-0.5,-0.7,0.5]
      ,[0,-0.7,0.7]
    ];
    for (let i=vs.length-1;i>=0;i--) {
      let v=vs[i];
      vs[i]=new THREE.Vector3(v[0],v[1],v[2]);
    }
    
    //v0.col={r:0.3,g:100.3,b:0.3}
    
    let c={r:0.1,g:0.1,b:0.9};
    let tris=[
    
      //[0,1,2]
      [0,6,5],[6,1,5]
      //,[2,3,0]
      //,[0,4,1]
      //,[0,4,6],[6,4,1]
      ,[4,8,7],[4,9,8]
      
      
      //,[1,4,2]
      ];
    for (let t of tris) 
      threeEnv.addTri({ge:ge,v0:vs[t[0]],v1:vs[t[1]],v2:vs[t[2]],c:c});
    //threeEnv.addTri({ge:ge,v0:v0,v1:v1,v2:v2,c:c});
    //threeEnv.addTri({ge:ge,v0:v2,v1:v3,v2:v0,c:c});
    //threeEnv.addTri({ge:ge,v0:v2,v1:v1,v2:v3,c:c});
    
    threeEnv.finishBufGem({ge:ge});
    ge.computeVertexNormals();
    let m=new THREE.Mesh(
      ge,
      new THREE.MeshPhongMaterial({
        //vertexColors:THREE.FaceColors
        vertexColors:true
      })//,flatShading:true})
      //new THREE.MeshStandardMaterial({vertexColors:THREE.FaceColors})//,flatShading:true})
      );
    m.position.set(0,0,0);//-0.5,-1);//m.castShadow=true;
    m.castShadow=true;
    m.receiveShadow=true;
    m.userData.editPoint=ps.mesh;
    ps.mesh.add(m);
    }
    
    
    Conet.download({fn:'/blog/2025/wave2.o5.json',f:function(v) {
      //---
      //onsole.log(v.length);
      let o=Pd5.load(v);
      //onsole.log(o);
      
      o.scale=0.01;
      threeEnv.base=ps.mesh;
      threeAddObj(o,0,0,0,1);
      o.calcVertNorms=1;
      
      //var calcnorms=true;//lo.calcVertNorms=true;
      ////if (!threeEnv.nocalc) calcnorms=
      //Pd5.calc(o,10,0,0,1,{x:0,y:0,z:0},0,0,true);
      ////if (calcnorms||lo.calcVertNorms) 
      ///Pd5.calcNormals(o,false);//!lo.calcVertNorms); //else console.log('calcNormals skipped');
      threeRender(0);
      
      mesh0=o.meshes[0].tmesh;
      
      
      function addClones(mesh,depth) {
        //---
        let sc=0.47;//0.47;
        depth++;
        { let m0=mesh0.clone(false);m0.scale.set(sc,sc,sc);m0.position.x=0.1;mesh.add(m0);if (depth<=maxDepth) addClones(m0,depth); }
        { let m0=mesh0.clone(false);m0.scale.set(sc,sc,sc);m0.position.x=-0.1;mesh.add(m0);if (depth<=maxDepth) addClones(m0,depth); }
        if (1) {
        { let m0=mesh0.clone(false);m0.scale.set(sc,sc,sc);m0.position.z=0.1;mesh.add(m0);if (depth<=maxDepth) addClones(m0,depth); }
        { let m0=mesh0.clone(false);m0.scale.set(sc,sc,sc);m0.position.z=-0.1;mesh.add(m0);if (depth<=maxDepth) addClones(m0,depth); }
        }
        //...
      }
      
      
      addClones(mesh0,0);
      mesh0.position.y=0.2;
      //let sc=0.47;
      //{ let m0=mesh0.clone(false);m0.scale.set(sc,sc,sc);m0.position.x=0.1;mesh0.add(m0); }
      //{ let m0=mesh0.clone(false);m0.scale.set(sc,sc,sc);m0.position.x=-0.1;mesh0.add(m0); }
      
      //...
    }
    });
    
    
    //part(ps.ps,ps.mesh);
    
    //...
  }
  ,renderf:function(dt) {
    //---
    //console.log(dt);
    //Conet.calcTweens(tweens,dt);
    //threeRender(dt);
    if (!mesh0) return;
    
    t+=dt;
    
    transform(mesh0,0,0);
    //...
  }
  ,what:'Wave v.0.183 '//FOLDORUPDATEVERSION
  });
  //...
}
)();
//----
//fr o,1
//fr o,1,9
//fr o,1,13
//fr o,1,13,69
//fr o,1,13,69,20
//fr o,1,14
//fr p,6,21
