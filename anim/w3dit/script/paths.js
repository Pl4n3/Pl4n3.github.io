//----
(function() {
  //---
  let m0=new THREE.MeshPhongMaterial({color:0x666666,flatShading:true}),
      m1=new THREE.MeshPhongMaterial({color:0x77dd77,flatShading:true,
        transparent:true,opacity:0.5}),//9.7
      count=0,tps=[],tweens=[],otgt=new THREE.Vector3(),//otgt=oldTarget
      ttgt=0,targetVis=false,targetVisChanged=false;
  
  function box(x,y,z,w,h,b,m,t) {
    
    let g=new THREE.BufferGeometry();
    let f=1;
    let vertices,normals;
    if (t=='ramp0') vertices=new Float32Array([
      -1,-1,1, 1,-1,1, 1,1,1, -1,1,1,
      -1,-1,-1, 1,-1,-1, 1,1,0, -1,1,0
    ]);
    else if (t=='ramp1') vertices=new Float32Array([
      -1,-1,1, 1,-1,1, 1,1,1, -1,1,1,
      -1,-1,0, 1,-1,0, 1,1,-1, -1,1,-1
    ]);
    else vertices=new Float32Array([
      -1,-1,1, 1,-1,1, 1,1,1, -1,1,1,
      -1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1
    ]);
    normals=new Float32Array([
      0,0,1, 0,0,1, 0,0,1, 0,0,1,
      0,0,1, 0,0,1, 0,0,1, 0,0,1
    ]);
    let indices=[0,1,2, 2,3,0, 4,6,5, 6,4,7, 1,5,6, 6,2,1, 4,0,3, 3,7,4, 3,2,6, 6,7,3, 4,5,1, 1,0,4 ];
    g.setIndex(indices);
    g.setAttribute('position',new THREE.BufferAttribute(vertices,3));
    g.setAttribute('normal',new THREE.BufferAttribute(normals,3));
    
    let mesh=new THREE.Mesh(g//new THREE.BoxGeometry(2,2,2)//w,h,b)
      ,m);
    let bo=0.0005;
    mesh.scale.set(w/2-bo,h/2-bo,b/2-bo);
    mesh.position.set(x,y,z);
    mesh.updateMatrix();
    mesh.matrixAutoUpdate=false;
    mesh.castShadow=true;
    mesh.receiveShadow=true;
    //scene.add(mesh);
    return mesh;
  }
  
  function add(c,mesh) {
    //---
    mesh.userData.editPoint=c;
    c.add(mesh);
    //c.material.opacity=0;
    return mesh;
    //...
  }
  
  function part(ps,c) {
    //---
    if (ps.directionalLight) {
      //onsole.log('adding directional light');
      let l=new THREE.DirectionalLight(ps.color?parseInt(ps.color,16):0xffffff,ps.intensity||1);
      l.position.set(ps.xd||0,ps.yd||0,ps.zd||0); //default; light shining from top
      //onsole.log(l);
      //light.castShadow = true; // default false
      let ch=ps.castShadow;
      if (ch) {
        if (typeof(ch)!='object') ch={};
        l.castShadow=true;
        l.shadow.mapSize.width=2048; // default
        l.shadow.mapSize.height=2048; // default
        l.shadow.camera.near=ch.near||0.5; // default
        l.shadow.camera.far=ch.far||500; // default
      }
      c.add(l);
      return l;
    }
    
    if (ps.ambientLight) {
      let l=new THREE.AmbientLight(
        ps.color?parseInt(ps.color,16):0xffffff,
        ps.intensity||1,
        );
      //l.position.set(ps.xd||0,ps.yd||0,ps.zd||0); //default; light shining from top
      c.add(l);
      return l;
    }
    
    if (ps.pointLight) {
      let l=new THREE.PointLight(
        ps.color?parseInt(ps.color,16):0xffffff,
        ps.intensity||1,
        ps.distance||0,
        ps.decay||2
        );
      //l.position.set(ps.xd||0,ps.yd||0,ps.zd||0); //default; light shining from top
      c.add(l);
      return l;
    }
    
    if (ps.hemisphereLight) {
      let l=new THREE.HemisphereLight(
        ps.skyColor?parseInt(ps.skyColor,16):0xffffff,
        ps.groundColor?parseInt(ps.groundColor,16):0xffffff,
        ps.intensity||1,
        );
      //l.position.set(ps.xd||0,ps.yd||0,ps.zd||0); //default; light shining from top
      c.add(l);
      return l;
    }
    
    
    let w=0.1;
    let wh=w/2,w0=w*10/10,w1=w/10,
        //x=ps.x+1.5,y=ps.y,z=ps.z;
        x=0,y=0,z=0;
    
    /*
    if (ps.fly) {
      let w2=w/2;
      let mesh=box(x*w,y*w-w,z*w,w2,w2,w2,m0);
      mesh.matrixAutoUpdate=true;
      return mesh;
    }
    
    if ((!(ps.nx0&&ps.nx1))&&(!(ps.ny0&&ps.ny1))&&(!(ps.nz0&&ps.nz1)))
      tps.push(ps);
    */
    
    if (ps.box||ps.brick) {
      let m;
      //if (ps.color) m=new THREE.MeshBasicMaterial({color:parseInt(ps.color,16),flatShading:true}); else m=m0;
      if (ps.color) m=new THREE.MeshPhongMaterial({color:parseInt(ps.color,16),flatShading:true}); else m=m0;
      let mesh=box(x*w,y*w,z*w,w0*(ps.scx||1),w0*(ps.scy||1),w0*(ps.scz||1),m,ps.t);
      mesh.matrixAutoUpdate=true;
      mesh.rotation.set(ps.xr||0,ps.yr||0,ps.zr||0);
      add(c,mesh);
      if (ps.hidden) { //---hidden not visible and not clickable (but can make a cannon box)
        mesh.visible=false;
        delete(mesh.userData.editPoint);
      }
      if (ps.qx!==undefined) {
        //onsole.log('set quaternion nao.');
        mesh.quaternion.set(ps.qx,ps.qy,ps.qz,ps.qw);
        mesh.quaternion.normalize();
      } else {
        mesh.rotation.set(ps.xr||0,ps.yr||0,ps.zr||0);
      }
      return mesh;//add(c,mesh);//box(x*w,y*w,z*w,w0*(ps.scx||1),w0*(ps.scy||1),w0*(ps.scz||1),m);
    }
    
    if (((!(ps.nx0&&ps.nx1))&&(!(ps.ny0&&ps.ny1))&&(!(ps.nz0&&ps.nz1)))||ps.flypoint) {
      let p=c.position;
      tps.push({x:p.x,y:p.y,z:p.z});
    }
    
    if (!ps.nx1) add(c,box(x*w+wh,y*w ,z*w   ,w1,w0,w0,m1));
    if (!ps.nx0) add(c,box(x*w-wh,y*w ,z*w   ,w1,w0,w0,m1));
    
    if (!ps.ny1) add(c,box(x*w   ,y*w-wh,z*w   ,w0,w1,w0,m1));
    if (!ps.ny0) add(c,box(x*w   ,y*w-wh+w,z*w   ,w0,w1,w0,m1));
    
    if (!ps.nz1) add(c,box(x*w   ,y*w ,z*w+wh,w0,w0,w1,m1));
    if (!ps.nz0) add(c,box(x*w   ,y*w ,z*w-wh,w0,w0,w1,m1));
    //...
  }
  
  //onsole.log('running path.js');
  //onsole.log('dungeonGeometry.js');
  //onsole.log(document.currentScript);
  let gps=
  window.w3ditScriptInit({initf:function (ps) {
    //---
    //let m=new THREE.Mesh(
    //   new THREE.BoxGeometry(0.1,0.1,0.1),
    //   new THREE.MeshPhongMaterial({flatShading:true,color:0xdddddd,transparent:true,opacity:0.9}));
    //ps.mesh.add(m);
    
    //onsole.log('paths.w3ditScriptInit');
    
    if (count==0) ps.xrUtil.log('Paths v.0.178 (cmds: pathsScale)');//FOLDORUPDATEVERSION
    //count++;
    
    let w=0.1;
    //let m=box(0,0,0,w,w,w,m1);
    //ps.mesh.add(m);
    //onsole.log(ps.ps,ps.mesh);
    //ps.mesh.visible=false;
    part(ps.ps,ps.mesh);
    if (ps.ps.fly) {
      let m=part({box:1,scx:0.5,scz:0.5,scy:0.5},ps.mesh);
      m.matrixAutoUpdate=true;
      //tweens.push({o:m.position,key:'x',value:1,t:1000});
      
      let t=500;
     
      //tps.length=2;
      for (let i=0;i<tps.length;i++) {
        let p=tps[i],p0=ps.mesh.position;
        p.tws={tweens:tweens,t:t,o:m.position,kv:[['x',p.x-p0.x],['y',p.y-p0.y],['z',p.z-p0.z]]};
        if (i>0) tps[i-1].tws.onend=[p.tws];
      }
      tps[tps.length-1].tws.onend=[tps[0].tws];
    
      Conet.tweensAdd(tps[0].tws);
      
      //console.log(m);
    }
    count++;
    
    window.pathsScale=function(f) {
      //---
      for (let p of ps.points) if (p.userData.op.box) {
        p.position.x*=f;
        p.position.y*=f;
        p.position.z*=f;
        p.userData.op.scx*=f;
        p.userData.op.scy*=f;
        p.userData.op.scz*=f;
      }
      console.log('pathsScale done.');
      //onsole.log(f);
      //...
    }
    
    
    //...
  }
  ,renderf:function(dt) {
    //---
    ttgt+=dt;
    if (((ttgt>1000)&&targetVis)||targetVisChanged) {
      ttgt=0;
      let editxr=gps.editxr,tgt=editxr.controls.target;
      if ((tgt.x!=otgt.x)||(tgt.y!=otgt.y)||(tgt.z!=otgt.z)||targetVisChanged) {
        otgt.copy(tgt);
        console.log('target changed: '+tgt.x+' '+tgt.y+' '+tgt.z);
        let c=0,min=Number.MAX_VALUE,max=Number.MIN_VALUE;
        for (let p of editxr.points) if (p.userData.op.box) {
          c++;
          let d=p.position.distanceToSquared(tgt);
          min=Math.min(min,d);
          max=Math.max(max,d);
          //if (p.children.length!=1) console.log(p.children.length);
          p.children[0].visible=targetVis?(d<0.1):true;
          //onsole.log(d);
        }
        //onsole.log('c='+c+' min='+min+' max='+max);
        targetVisChanged=false;
      }
    }
    Conet.calcTweens(tweens,dt);
    //...
  }
  });
  gps.xrUtil.hud.buttons.push(
  {s:targetVis?'Target':'All',ms:'visibility',x:0.7,y:0.3,w:0.25,h:0.08
  ,ondown:function() {
    //---
    targetVis=!targetVis;//otgt.x+=1;
    this.s=targetVis?'Target':'All';
    targetVisChanged=true;
    //onsole.log('dsfsdfsd');
    //...
  }
  }
  );
  //onsole.log(gps.editxr.controls);
  //...
}
)();
//----
//fr o,1
//fr o,1,7
//fr o,1,9
//fr o,1,11
//fr o,1,17
//fr o,1,17,38
//fr o,1,18
//fr o,1,22
//fr p,44,244
