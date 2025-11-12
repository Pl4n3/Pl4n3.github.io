//----
(function() {
  //---
  let m0=new THREE.MeshPhongMaterial({color:0x666666,flatShading:true}),
      m1=new THREE.MeshPhongMaterial({color:0x77dd77,flatShading:true,
        transparent:true,opacity:0.5}),//9.7
      count=0,tps=[],tweens=[],otgt=new THREE.Vector3(),//otgt=oldTarget
      ttgt=0,targetVis=false,targetVisChanged=false,group;
  let r0=0.3,g0=0.3,b0=0.1,//brown
      r1=0.1,g1=1,b1=0.1;//green
      
  window.pathsPointlights=[];
  
  
  function box(x,y,z,w,h,b,m,t) {
    
    let g=new THREE.BufferGeometry();
    let f=1;
    let vertices,normals,indices,colors;
    //let r0=0.3,g0=0.3,b0=0.1,//brown
    //    r1=0.1,g1=1,b1=0.1;//green
    //let r0=1,g0=1,b0=1,//brown
    //    r1=1,g1=1,b1=1;//green
    
    
    
    if (t=='box0') {
      vertices=new Float32Array([
      -1,-1,1, 1,-1,1, 1,1,1, -1,1,1,
      -1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1
    
      ,1,1,1 ,-1,1,1 ,1,1,-1 ,-1,1,-1
      ]);
      indices=[0,1,2, 2,3,0, 4,6,5, 6,4,7, 1,5,6, 6,2,1, 4,0,3, 3,7,4, /*3,2,6, 6,7,3,*/ 4,5,1, 1,0,4 
        ,9,8,10 ,10,11,9
      ];
      colors=new Float32Array([
        r0,g0,b0, r0,g0,b0, r0,g0,b0, r0,g0,b0, r0,g0,b0, r0,g0,b0 ,r0,g0,b0, r0,g0,b0
        ,r1,g1,b1 ,r1,g1,b1 ,r1,g1,b1 ,r1,g1,b1
        ]);
      m=new THREE.MeshPhongMaterial({color:0x666666,flatShading:true,vertexColors:true});
      //onsole.trace();
    } else if (t=='ramp00') {
      vertices=new Float32Array([
      -1,-1,1, 1,-1,1, 1,1,1, -1,1,1,
      -1,-1,-1, 1,-1,-1 //, 1,1,0, -1,1,0
      
      ,1,1,1 ,-1,1,1 ,-1,-1,-1 ,1,-1,-1
      ]);
      indices=[0,1,2, 2,3,0, 
        //4,6,5, 6,4,7, 1,5,6, 6,2,1,
        4,0,3, 
        //3,7,4, 3,2,6, 6,7,3,
        4,5,1, 1,0,4,
         5,2,1, 4,0,3 //, 4,2,5, 4,3,2
         
        ,8,6,9 ,8,7,6
      ];
      colors=new Float32Array([
        r0,g0,b0, r0,g0,b0, r0,g0,b0, r0,g0,b0, r0,g0,b0, r0,g0,b0
        ,r1,g1,b1 ,r1,g1,b1 ,r1,g1,b1 ,r1,g1,b1
        ]);
      m=new THREE.MeshPhongMaterial({color:0x666666,flatShading:true,vertexColors:true})
    } else if (t=='ramp0') vertices=new Float32Array([
      -1,-1,1, 1,-1,1, 1,1,1, -1,1,1,
      -1,-1,-1, 1,-1,-1, 1,1,0, -1,1,0
    ]);
    else if (t=='ramp1') vertices=new Float32Array([
      -1,-1,1, 1,-1,1, 1,1,1, -1,1,1,
      -1,-1,0, 1,-1,0, 1,1,-1, -1,1,-1
    ]);
    else { 
    vertices=new Float32Array([
      -1,-1,1, 1,-1,1, 1,1,1, -1,1,1,
      -1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1
    ]);
    normals=new Float32Array([
      0,0,1, 0,0,1, 0,0,1, 0,0,1,
      0,0,1, 0,0,1, 0,0,1, 0,0,1
    ]);
    }
    if (!indices) indices=[0,1,2, 2,3,0, 4,6,5, 6,4,7, 1,5,6, 6,2,1, 4,0,3, 3,7,4, 3,2,6, 6,7,3, 4,5,1, 1,0,4 ];
    g.setIndex(indices);
    g.setAttribute('position',new THREE.BufferAttribute(vertices,3));
    if (normals) g.setAttribute('normal',new THREE.BufferAttribute(normals,3));
    if (colors) g.setAttribute('color',new THREE.BufferAttribute(colors,3));
    
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
    
    if (0) { //tested group: with many meshes and group.visible=false fps goes up
      if (!group) {
        group=new THREE.Group();
        c.parent.add(group);
        console.log(group);
      }
      mesh.position.copy(c.position);
      group.add(mesh);
    } else
      c.add(mesh);
    
    //onsole.log('paths.add');
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
      editxr.lights.push({light:l});
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
    let ch=ps.castShadow;
    if (ch) {
      if (typeof(ch)!='object') ch={};
      l.castShadow=true;
      l.shadow.mapSize.width=2048; // default
      l.shadow.mapSize.height=2048; // default
      l.shadow.camera.near=ch.near||0.5; // default
      l.shadow.camera.far=ch.far||500; // default
    }
    
      pathsPointlights.push(l);
      editxr.lights.push({light:l});
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
    
    if (count==0) ps.xrUtil.log('Paths v.0.559 (cmds: pathsScale)');//FOLDORUPDATEVERSION
    //count++;
    
    let w=0.1,gps=ps;
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
    if (count==0) {
    
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
    
    
    window.pathsMegabonk=function(ps) {
      //---
      if (!ps) ps={};
      let testSmall=0,max=testSmall?1:(ps.width||7);
      
      function mp(x,y,z,t,dontQueue) {
        //---
        //let max=testSmall?1:7
        if ((Math.abs(x)>max)||(Math.abs(z)>max)) return;
        
        let yr=0;
        if (t=='r1') yr=Math.PI/2;
        else if (t=='r2') yr=Math.PI;
        else if (t=='r3') yr=-Math.PI/2;
        if (testSmall)
        editxr.pointAdd({
         "x": 0+x*0.04,
         "y": 0.2+y*0.03,
         "z": 0+z*0.04,
         "script": "/anim/w3dit/script/paths.js",
         "box": 1,
         "scx": 0.4,
         "scz": 0.4,
         "scy": 0.3,
         "t": (t=='b')?'box0':'ramp00',//"box0",
         "inv": 1,
         yr:yr
        });
        et(x,y,z,{x:x,y:y,z:z,t:t});
        if (!dontQueue) pts.push({x:x,y:y,z:z});
        if (1&&!testSmall&&(t!='b')) mp(x,y-1,z,'b',1);
        //...
      }
      
      //onsole.log('n/i');
      //for (let z=0;z<10;z++) 
      //for (let x=0;x<10;x++) 
      //  mp(x,0,z,'ramp00');  
      //mp(-1,0,0,'r1');
      let pts=[],ph={};
      //mp(0,0,0,'b');
      //onsole.log(ph);
      //onsole.log(et(0,0,0));
      //mp(1,0,0,'r3');
      //mp(0,0,-1,'r0');
      //mp(0,0,1,'r2');
      
      function et(x,y,z,v) {
        //---
        //let k=z+'_'+y+'_'+x;
        let k=x+'_'+y+'_'+z;
        if (v===undefined) return ph[k];
        ph[k]=v;
        //...
      }
      
      function empty(x,y,z) {
        //---
        for (let yh=y-3;yh<=y+3;yh++)
          if (et(x,yh,z)) return false;
        return true;
        //...
      }
      
      if (editxr.meshMaze) editxr.meshMaze.removeFromParent();
      
      if (1) {
      mp(0,0,0,'b');
      Conet.seed(ps.seed||100);
      for (let i=0;i<500;i++) {
        //onsole.log('i='+i);
        if (pts.length==0) break;
        let p=pts[0],x=p.x,y=p.y,z=p.z,t=et(x,y,z).t;
        //onsole.log('t='+t);
        pts.splice(0,1);
        if (t=='b') {
          //if (!et(x-1,y,z)&&!et(x-1,y-1,z)&&!et(x-1,y+1,z)) {
          if (1&&empty(x-1,y,z)) { let r=Conet.rani(3); if (r==0) mp(x-1,y,z,'b'); else if (r==1) mp(x-1,y,z,'r1'); else mp(x-1,y+1,z,'r3'); }
          if (1||!testSmall) {
          if (1&&empty(x+1,y,z)) { let r=Conet.rani(3); if (r==0) mp(x+1,y,z,'b'); else if (r==1) mp(x+1,y,z,'r3'); else mp(x+1,y+1,z,'r1'); }
          if (1&&empty(x,y,z-1)) { let r=Conet.rani(3); if (r==0) mp(x,y,z-1,'b'); else if (r==1) mp(x,y,z-1,'r0'); else mp(x,y+1,z-1,'r2'); }  
          if (1&&empty(x,y,z+1)) { let r=Conet.rani(3); if (r==0) mp(x,y,z+1,'b'); else if (r==1) mp(x,y,z+1,'r2'); else mp(x,y+1,z+1,'r0'); }  
          }
        } else if (t=='r0') {
          if (empty(x,y-1,z-1)) { let r=Conet.rani(2); if (r==0) mp(x,y-1,z-1,'b'); else mp(x,y-1,z-1,'r0'); }
          if (empty(x,y,z+1))   { let r=Conet.rani(2); if (r==0) mp(x,y,z+1,'b');   else mp(x,y+1,z+1,'r0'); }
        } else if (t=='r2') {
          if (empty(x,y,z-1))   { let r=Conet.rani(2); if (r==0) mp(x,y,z-1,'b');   else mp(x,y+1,z-1,'r2'); }
          if (empty(x,y-1,z+1)) { let r=Conet.rani(2); if (r==0) mp(x,y-1,z+1,'b'); else mp(x,y-1,z+1,'r2'); }
        } else if (t=='r1') {
          if (empty(x-1,y-1,z)) {
            let r=Conet.rani(2);
            if (r==0) mp(x-1,y-1,z,'b');
            else mp(x-1,y-1,z,'r1');
          }
          if (empty(x+1,y,z)) {
            let r=Conet.rani(2);
            if (r==0) mp(x+1,y,z,'b');
            else mp(x+1,y+1,z,'r1');
          }
        } else if (t=='r3') {
          if (empty(x-1,y,z)) {
            let r=Conet.rani(2);
            if (r==0) mp(x-1,y,z,'b');
            else mp(x-1,y+1,z,'r3');
          }
          if (empty(x+1,y-1,z)) {
            let r=Conet.rani(2);
            if (r==0) mp(x+1,y-1,z,'b');
            else mp(x+1,y-1,z,'r3');
          }
        }
      }
      
      if (1&&!testSmall) {
      let c=0,a=Object.keys(ph);
      for (let k of a) {
        c++;
        let p=ph[k];
        let down;
        for (down=0;down<6;down++) if (et(p.x,p.y-down-1,p.z)) break;
        //onsole.log('down='+down);
        for (let y=1;y<down-2;y++) mp(p.x,p.y-y,p.z,'b');
      }
      console.log('c='+c);
      }
      } else {
        max=7;
        mp(0,0,0,'r3');
        mp(0,0,1,'r0');
      }
      
      if (0||testSmall) {
        console.log(ph);  
      }
      
      let ge=new THREE.BufferGeometry();
      let w=0.4*0.2,h=0.3*0.2;
      let mh={
        position:[],
        color:[],
        index:[],
      };
      
      function addTri(mh, x0,y0,z0, x1,y1,z1, x2,y2,z2, r,g,b) {
        let i0=mh.position.length/3;
        mh.position.push(x0,y0,z0, x1,y1,z1, x2,y2,z2);
        mh.color.push(r,g,b, r,g,b, r,g,b);
        mh.index.push(i0+0,i0+1,i0+2);
        //...
      }
      
      
      function addQuad(mh, x0,y0,z0, x1,y1,z1, x2,y2,z2, x3,y3,z3, r,g,b) {
        let i0=mh.position.length/3;
        mh.position.push(x0,y0,z0, x1,y1,z1, x2,y2,z2, x3,y3,z3);
        mh.color.push(r,g,b, r,g,b, r,g,b, r,g,b);
        mh.index.push(i0+0,i0+1,i0+2,i0+1,i0+3,i0+2);
        //...
      }
      
      //let x0=0,y0=0,z0=0;
      //addQuad(mh, x0-w,y0-h,z0+w, x0+w,y0-h,z0+w, x0-w,y0+h,z0+w ,x0+w,y0+h,z0+w, r0,g0,b0);
      //x0+=w*2;
      //addQuad(mh, x0-w,y0-h,z0+w, x0+w,y0-h,z0+w, x0-w,y0+h,z0+w ,x0+w,y0+h,z0+w, r0,g0,b0);
      
      for (let p of Object.values(ph)) {
        //onsole.log(p);
        let x0=p.x*w*2,y0=p.y*h*2,z0=p.z*w*2,n;
        if (p.t=='b') {
        
          n=et(p.x,p.y,p.z-1)?.t;if ((n!='b')&&(n!='r0')) 
            addQuad(mh, x0+w,y0-h,z0-w, x0-w,y0-h,z0-w, x0+w,y0+h,z0-w ,x0-w,y0+h,z0-w, r0,g0,b0);
          n=et(p.x,p.y,p.z+1)?.t;if ((n!='b')&&(n!='r2'))
            addQuad(mh, x0-w,y0-h,z0+w, x0+w,y0-h,z0+w, x0-w,y0+h,z0+w ,x0+w,y0+h,z0+w, r0,g0,b0);
            
          //n=et(p.x,p.y-1,p.z)?.t;if (n!='b')
          //  addQuad(mh, x0+w,y0-h,z0+w, x0-w,y0-h,z0+w, x0+w,y0-h,z0-w ,x0-w,y0-h,z0-w, r0,g0,b0);
          n=et(p.x,p.y+1,p.z)?.t;if (!n)
            addQuad(mh, x0-w,y0+h,z0+w, x0+w,y0+h,z0+w, x0-w,y0+h,z0-w ,x0+w,y0+h,z0-w, r1,g1,b1);
            
          n=et(p.x-1,p.y,p.z)?.t;if ((n!='b')&&(n!='r1'))
            addQuad(mh, x0-w,y0-h,z0-w, x0-w,y0-h,z0+w, x0-w,y0+h,z0-w ,x0-w,y0+h,z0+w, r0,g0,b0);
          n=et(p.x+1,p.y,p.z)?.t;if ((n!='b')&&(n!='r3'))
            addQuad(mh, x0+w,y0-h,z0+w, x0+w,y0-h,z0-w, x0+w,y0+h,z0+w ,x0+w,y0+h,z0-w, r0,g0,b0);
      
        } else if (p.t=='r0') {
      
          n=et(p.x,p.y,p.z+1)?.t;if ((n!='b')&&(n!='r2'))
            addQuad(mh, x0-w,y0-h,z0+w, x0+w,y0-h,z0+w, x0-w,y0+h,z0+w ,x0+w,y0+h,z0+w, r0,g0,b0);
      
          addQuad(mh, x0-w,y0+h,z0+w, x0+w,y0+h,z0+w, x0-w,y0-h,z0-w ,x0+w,y0-h,z0-w, r1,g1,b1);
      
      
          n=et(p.x-1,p.y,p.z)?.t;if ((n!='b')&&(n!='r1')&&(n!='r0'))
            addTri(mh, x0-w,y0-h,z0+w, x0-w,y0+h,z0+w, x0-w,y0-h,z0-w ,r0,g0,b0);
          n=et(p.x+1,p.y,p.z)?.t;if ((n!='b')&&(n!='r3')&&(n!='r0'))
            addTri(mh, x0+w,y0+h,z0+w, x0+w,y0-h,z0+w, x0+w,y0-h,z0-w ,r0,g0,b0);
      
        } else if (p.t=='r1') {
      
          n=et(p.x,p.y,p.z-1)?.t;if ((n!='b')&&(n!='r0')&&(n!='r1'))
            addTri(mh, x0-w,y0-h,z0-w, x0+w,y0+h,z0-w, x0+w,y0-h,z0-w ,r0,g0,b0);
          n=et(p.x,p.y,p.z+1)?.t;if ((n!='b')&&(n!='r2')&&(n!='r1'))
            addTri(mh, x0-w,y0-h,z0+w, x0+w,y0-h,z0+w, x0+w,y0+h,z0+w ,r0,g0,b0);
            
          addQuad(mh, x0-w,y0-h,z0+w, x0+w,y0+h,z0+w, x0-w,y0-h,z0-w ,x0+w,y0+h,z0-w, r1,g1,b1);
      
          n=et(p.x+1,p.y,p.z)?.t;if ((n!='b')&&(n!='r3'))
            addQuad(mh, x0+w,y0-h,z0+w, x0+w,y0-h,z0-w, x0+w,y0+h,z0+w ,x0+w,y0+h,z0-w, r0,g0,b0); 
        }
        
        else if (p.t=='r2') {
      
          n=et(p.x,p.y,p.z-1)?.t;if ((n!='b')&&(n!='r0')) 
            addQuad(mh, x0+w,y0-h,z0-w, x0-w,y0-h,z0-w, x0+w,y0+h,z0-w ,x0-w,y0+h,z0-w, r0,g0,b0);
      
          addQuad(mh, x0-w,y0-h,z0+w, x0+w,y0-h,z0+w, x0-w,y0+h,z0-w ,x0+w,y0+h,z0-w, r1,g1,b1);
      
          n=et(p.x-1,p.y,p.z)?.t;if ((n!='b')&&(n!='r1')&&(n!='r2'))
            addTri(mh, x0-w,y0+h,z0-w, x0-w,y0-h,z0-w, x0-w,y0-h,z0+w ,r0,g0,b0);
          n=et(p.x+1,p.y,p.z)?.t;if ((n!='b')&&(n!='r3')&&(n!='r2'))
            addTri(mh, x0+w,y0-h,z0+w, x0+w,y0-h,z0-w, x0+w,y0+h,z0-w ,r0,g0,b0);
      
        } else if (p.t=='r3') {
      
          n=et(p.x,p.y,p.z-1)?.t;if ((n!='b')&&(n!='r0')&&(n!='r3'))
            addTri(mh, x0+w,y0-h,z0-w, x0-w,y0-h,z0-w, x0-w,y0+h,z0-w ,r0,g0,b0);
          n=et(p.x,p.y,p.z+1)?.t;if ((n!='b')&&(n!='r2')&&(n!='r3'))
            addTri(mh, x0-w,y0+h,z0+w, x0-w,y0-h,z0+w, x0+w,y0-h,z0+w ,r0,g0,b0);
      
          addQuad(mh, x0-w,y0+h,z0+w, x0+w,y0-h,z0+w, x0-w,y0+h,z0-w ,x0+w,y0-h,z0-w, r1,g1,b1);
      
          n=et(p.x-1,p.y,p.z)?.t;if ((n!='b')&&(n!='r1'))
            addQuad(mh, x0-w,y0-h,z0-w, x0-w,y0-h,z0+w, x0-w,y0+h,z0-w ,x0-w,y0+h,z0+w, r0,g0,b0);
        }
        
        n=et(p.x,p.y-1,p.z)?.t;if (n!='b')
          addQuad(mh, x0+w,y0-h,z0+w, x0-w,y0-h,z0+w, x0+w,y0-h,z0-w ,x0-w,y0-h,z0-w, r0,g0,b0);
      }
      
      ge.setAttribute('position',new THREE.BufferAttribute(new Float32Array(mh?mh.position:[
        -w,-h, w, w,-h, w, -w,h, w ,w,h, w//,-w,-h, -w, w,-h, -w, -w,h, -w ,w,h, -w
      ]),3));
      ge.setAttribute('color',new THREE.BufferAttribute(new Float32Array(mh?mh.color:[
        r0,g0,b0 ,r0,g0,b0 ,r0,g0,b0 ,r0,g0,b0//,r1,g1,b1 ,r1,g1,b1 ,r1,g1,b1 ,r1,g1,b1
      ]),3));
      ge.setIndex(mh?mh.index:[0,1,2 ,1,3,2 //,1,5,3, 5,7,3
      ]);
      ge.computeBoundingBox();
      ge.computeBoundingSphere();
      ge.computeVertexNormals();
      //ge.computeTangents();
      let m=new THREE.Mesh(ge,
        new THREE.MeshPhongMaterial({color:0x666666,flatShading:true,vertexColors:true
        }));
      m.castShadow=true;
      m.receiveShadow=true;
      //onsole.log(m);
      m.updateMatrix();
      m.matrixAutoUpdate=false;
      gps.mesh.parent.add(m);
      editxr.mesh=m;
      editxr.meshMaze=m;
      //...
    }
    
    count++;
    if (Conet.parseUrl().pathsMegabonk) window.pathsMegabonk();
    Conet.consoleInfo({head:'Paths commands',funcs:['pathsScale()','pathsMegabonk()']});
    }
    count++;
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
  
  Menu.roots[0].sub.push({s:'Maze...',ms:'generate, paths',doctrl:'Maze properties',ta:1,
    value:'{\n"width":7,\n"seed":100\n}',jsonCheck:1,mcpy:0.07,tacols:10,tarows:5,
    okS:'Generate',cancelS:'Close',cstay:1,
  
  setfunc:function(v) {
    //---
    //onsole.log(v);
    pathsMegabonk(JSON.parse(v));
    //...
  }
  
  });
  //onsole.log(gps.editxr.controls);
  //...
}
)();
//----
//fr o,1
//fr o,1,12
//fr o,1,16
//fr o,1,22
//fr o,1,22,41
//fr o,1,22,41,4
//fr o,1,22,41,19
//fr o,1,22,41,21
//fr o,1,22,41,103
//fr o,1,35
//fr p,80,547
