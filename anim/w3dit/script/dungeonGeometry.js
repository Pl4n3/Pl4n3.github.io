//----
(function() {
  //---
  //onsole.log('dungeonGeometry.js');
  //onsole.log(document.currentScript);
  window.w3ditScriptInit(function (ps) {
    //---
    //let m=new THREE.Mesh(
    //   new THREE.BoxGeometry(0.1,0.1,0.1),
    //   new THREE.MeshPhongMaterial({flatShading:true,color:0xdddddd,transparent:true,opacity:0.9}));
    //ps.mesh.add(m);
    
    let xrUtil=ps.xrUtil,du,dum0,dum1;
    xrUtil.hud.buttons.push(
    {s:'DG toggle',x:0.5,y:0.55,w:0.45,h:0.1,ondown:function() {
      //---
      xrUtil.log('dsf');
      let a=Object.values(du.rH);
      for (let h of a) h.view=!h.view;
      dum0.geometry=threeEnv.dungeonGeometry(du);
      dum1.geometry=threeEnv.dungeonGeometry(du,true);
      //...
    }
    });
    xrUtil.log('DungeonGeometry v.0.4 ');//FOLDORUPDATEVERSION
    
    let deep=new Deep({});
    //onsole.log(deep);
    Conet.download({fn:'/canvas/deep/deep7.txt',f:function(v) {
      //---
      du=deep.dungeonLoad(JSON.parse('['+v+']'));
      //onsole.log(du);
      
      let m1=new THREE.MeshPhongMaterial({color:0x77dd77,flatShading:true
        ,transparent:true,opacity:0.5,depthWrite:false
        });
      
      threeEnv.path='/shooter/';
      let mesh;
      threeSetMeshMaterial(mesh={diff:'objs/mapGen/d10.jpg',spec:'objs/mapGen/s1.jpg',norm:'objs/mapGen/n1.jpg'},{});
      let m2=mesh.material;
      //onsole.log(m2);
      
      dum0=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.1),m1);ps.mesh.add(dum0);
      dum1=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.1),m2);ps.mesh.add(dum1);
      //dum0.position.x=-0.2;dum1.position.x=0.2;
      
      du.allwview=1;//mviewall.checked;
      dum0.geometry=threeEnv.dungeonGeometry(du);
      dum1.geometry=threeEnv.dungeonGeometry(du,true);
      let sc=0.001;
      dum0.scale.set(sc,sc,sc);
      dum1.scale.set(sc,sc,sc);
      //...
    }
    });
    //...
  }
  );
  //...
}
)();
//----
//fr o,1
//fr o,1,3
//fr o,1,3,8
//fr o,1,3,14
//fr p,13,24
