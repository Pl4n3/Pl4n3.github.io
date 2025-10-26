//----
(function() {
  //---
  let first=true,manims,selected,
      phys,physWalks=[],pha=[0,0,0,0,0,0],tsd,cannon,
      q0=new THREE.Quaternion(),q1=new THREE.Quaternion(),
      v0=new THREE.Vector3(),xrUtil,
      grabMesh,grabMeshMatrix,room,
      initps,tweens=[],//---here to prototype, suboptimal as there could be different initps, 
      m0=new THREE.Matrix4(),m1=new THREE.Matrix4(),m2=new THREE.Matrix4(),
      rotateRoom=1,roomAngleD=Math.PI;
  
  //----cannonstuff
  let cannonsc=0,player,cannonTriMesh=undefined,triMeshBody,sculptBody,sculptVersion=-1,
      groundMaterial;
  function cannonBoxMeshUpdate(box) {
    //---
    let sc=cannonsc,pos=box.pos;
    
    let mesh=box.mesh;
    
    if (mesh) {
    //box.mesh.position.set(sc*(box.pos.x),sc*(box.pos.y+2),sc*(box.pos.z-3));
    mesh.position.set(sc*(box.pos.x),sc*(box.pos.z),-sc*(box.pos.y));
    mesh.scale.set(sc*box.dim.x*2,sc*box.dim.z*2,sc*box.dim.y*2);
    
    if (box.quat) { //--- could also be copied from box.body.quaternion, maybe box-values not necessary
    mesh.quaternion.x=box.quat.x;
    mesh.quaternion.z=-box.quat.y;
    mesh.quaternion.y=box.quat.z;
    mesh.quaternion.w=box.quat.w;
    }
    }
    
    let p=box.point,o5=p.userData.o5;
    if (o5) {
      //console.log(o5.x);
      //if (isNaN(o5.x)) { o5.x=0;o5.y=0;o5.z=0; }
      //let s2=1/p.userData.op.sc;
      //o5.x=(sc*pos.x-p.position.x)*s2;
      //o5.y=(sc*pos.z-p.position.y-sc*box.dim.z)*s2;
      //o5.z=(sc*-pos.y-p.position.z)*s2;
      let m=o5.meshes[0].tmesh,mpos=m.position,ppos=p.position;
      mpos.set(
        sc*pos.x-ppos.x,
        sc*pos.z-ppos.y-sc*box.dim.z,
        sc*-pos.y-ppos.z);
      if (player===box) {
        //onsole.log('set room');
        let vp=initps.editxr.vrPos;
        ////console.log(vp.x+' '+vp.y+' '+vp.z);
        //room.position.set(-mpos.x+vp.x,-mpos.y+vp.y,-mpos.z+vp.z);
        ////onsole.log(o5.ay);
        if (rotateRoom) {
          //room.rotation.y=-o5.ay;
          room.matrixAutoUpdate=false;
          room.matrix.identity();
          
          room.matrix.multiply(m0.makeScale(room.scale.x,room.scale.y,room.scale.z));
          
          room.matrix.multiply(m0.makeTranslation(vp.x+ppos.x,vp.y+ppos.y,vp.z+ppos.z));
          room.matrix.multiply(m0.makeRotationY(-o5.ay+roomAngleD));//---add a offset here
          room.matrix.multiply(m0.makeTranslation(-mpos.x-ppos.x,-mpos.y-ppos.y,-mpos.z-ppos.z));
          //250619 no effect here: 
          room.matrixWorldNeedsUpdate=true;
          
          //if (threeEnv.skyMesh) {
          //  threeEnv.skyMesh.rotation.y=-o5.ay;
          //  threeEnv.skyMesh.matrixAutoUpdate=true;
          //}
          let sc=threeEnv.scene;
          if (sc.backgroundRotation)
            sc.backgroundRotation.y=-o5.ay;
        } else { 
          room.matrixAutoUpdate=true;
        }
      }
    }
    //...
  }
  function cannonRender(dt) {
    //---
    if (cannonTriMesh!=initps.editxr.mesh) {
      cannonTriMesh=initps.editxr.mesh;
      let bg=cannonTriMesh.geometry;
      //let pos=bg.getAttribute('position');
      
      //onsole.log(cannonTriMesh);
      console.log('cannon trimesh update.');
      //onsole.log(pos.array.length);
      //onsole.log(bg.index.array.length);
      Sound.vol=0.1;
      
      if (triMeshBody) cannon.world.remove(triMeshBody);
      let a0=bg.getAttribute('position').array,a1=[];
      let i=0,sc=cannonsc;
      while (i<a0.length) {
        let x=a0[i],y=a0[i+1],z=a0[i+2];
        a1.push(x/sc,-z/sc,y/sc);
        i+=3;
      }
      
      
      let shape=new CANNON.Trimesh(a1,bg.index.array);//[0,0,0, 9,0,0, 0,0,9],[0,1,2,0,2,1]);
      let shapeBody = new CANNON.Body({ mass:0 });
      shapeBody.addShape(shape);
      //var pos = new CANNON.Vec3(0,0,size);
      shapeBody.position.set(0,0,0);
      //shapeBody.velocity.set(0,1,1);
      //shapeBody.angularVelocity.set(0,0,0);
      cannon.world.add(shapeBody);triMeshBody=shapeBody;
    }
    
    let smi=initps.editxr.sculptMeshInfo;
    //onsole.log('smi='+smi);
    if (smi) {
      if (!smi.anim&&(smi.version>sculptVersion)) {
        sculptVersion=smi.version;
        console.log('cannon update sculptBody');
        //onsole.log(smi.mesh);
        if (sculptBody) cannon.world.remove(sculptBody);
        let bg=smi.mesh.geometry;
        let a0=bg.getAttribute('position').array;
    
        console.log('drawRange.count='+bg.drawRange.count);
        //for (let i=0;i<bg.drawRange.count/1;i++) 
        //for (let i=30000;i<60000;i++)
        //let i0=30000,i1=60000;
        let maxVerts=63000;
        let i0=0,//126000,
            i1=0;//153000;
            
        while (1) {
          i0=i1;
          if (i0==bg.drawRange.count*3) break;
          i1=Math.min(i0+maxVerts,bg.drawRange.count*3);
          console.log('i0='+i0+' i1='+i1);
            
        let index=[],a1=[];
        for (let i=i0;i<i1;i++)
          index.push(i-i0);//[i*3,i*3+1,i*3+2]);//Mi);
    let i=i0,sc=cannonsc,pp=smi.mesh.parent.position;
    //onsole.log('pp '+pp.x+' '+pp.y+' '+pp.z);
    while (i<i1) {//bg.drawRange.count*3) {
      let x=a0[i],y=a0[i+1],z=a0[i+2];
      //let x=a0[i]+pp.x,y=a0[i+1]+pp.y,z=a0[i+2]+pp.z;
      x+=pp.x;y+=pp.y;z+=pp.z;
      //a1.push(x/sc,-z/sc,y/sc);
      a1.push(Conet.f4(x/sc),Conet.f4(-z/sc),Conet.f4(y/sc));
      i+=3;
    }
    
        
        if (0) {
          let g=new THREE.BufferGeometry();
          //g.setAttribute('position',bg.getAttribute('position'));
          g.setAttribute('position',new THREE.Float32BufferAttribute(a1,3));
          
          g.setIndex(index);
          //g.drawRange=bg.drawRange;
          let m=new THREE.Mesh(g,
            new THREE.MeshBasicMaterial({color:0x66aa66,transparent:true,opacity:0.7,depthTest:false})
          );
          m.scale.set(sc,sc,sc);
          initps.editxr.room.add(m);
        }
        
        if (1) {
        //onsole.log(bg.drawRange);
    
        let shape=new CANNON.Trimesh(a1,index);
        let shapeBody=new CANNON.Body({mass:0,material:groundMaterial});
        shapeBody.addShape(shape);
        shapeBody.position.set(0,0,0);
        cannon.world.add(shapeBody);sculptBody=shapeBody;
        if (0)
        shapeBody.addEventListener('collide',
    function (e) {
      //---
      console.log(e.contact);
      let c=e.contact;
      //contactpoints (via https://github.com/schteppe/cannon.js/issues/303)
      //c.bi.position + c.ri
      //c.bj.position + c.rj
      
      //...
    }
        ); 
     
        //let sh=JSON.stringify([a1,index]);
        //Conet.upload({fn:'/anim/w3dit/sculptCannonTriMesh.json',data:sh});
        //console.log('sh.len='+sh.length); 
        }
        }
      }
    }
    
    let c=cannon.ctrl,gp1=xrUtil.gp1,carControl=(player===undefined);
    c.fore=(tsd[0].dy<-0.5)||(gp1&&(carControl?gp1.buttons[0]?.pressed:(gp1.axes[3]<-0.5)));//gp1.axes[3]<-0.5);Menu.keys[38]
    c.back=(tsd[0].dy>0.5) ||(gp1&&(carControl?gp1.buttons[1]?.pressed:(gp1.axes[3]>0.5)));//&&gp1.axes[3]>0.5);Menu.keys[40]
    c.left=(tsd[0].dx<-0.5)||(gp1&&gp1.axes[2]<-0.5);//Menu.keys[37]
    c.right=(tsd[0].dx>0.5)||(gp1&&gp1.axes[2]>0.5);//Menu.keys[39]
    c.brake=Menu.keys[66]||(gp1&&gp1.buttons[4]?.pressed);
    c.up=Menu.keys[32];
    let z=cannon.ctrlOld,change=false;
    for (let k of Object.keys(c)) {
      if (z[k]!=c[k]) { z[k]=c[k];change=true; }
    }
    //f (xrUtil.gp1) console.log(xrUtil.gp1.buttons[0].pressed+' '+xrUtil.gp1.buttons[1].pressed+' '+xrUtil.gp1.buttons[2].pressed+' '+xrUtil.gp1.buttons[3].pressed+' '+xrUtil.gp1.buttons[4].pressed+' '+xrUtil.gp1.buttons[5].pressed+' '+xrUtil.gp1.buttons[6].pressed);
    //f (gp1) console.log(gp1.axes);
    if (carControl&&change) {
      //onsole.log(c);//Menu.keys[38]);
    
      let maxSteerVal=0.5,
          maxForce=1000,
          brakeForce=1000000,
          vehicle=cannon.vehicle;
      
      vehicle.setBrake(0, 0);
      vehicle.setBrake(0, 1);
      vehicle.setBrake(0, 2);
      vehicle.setBrake(0, 3);
    
      let f=((c.fore?-1:0)+(c.back?1:0))*maxForce;
      vehicle.applyEngineForce(f,2);
      vehicle.applyEngineForce(f,3);
      
      if (c.brake) {
        vehicle.setBrake(brakeForce, 0);
        vehicle.setBrake(brakeForce, 1);
        vehicle.setBrake(brakeForce, 2);
        vehicle.setBrake(brakeForce, 3);
      }
      
      let s=((c.right?-1:0)+(c.left?1:0))*maxSteerVal;
      vehicle.setSteeringValue(s,0);
      vehicle.setSteeringValue(s,1);
      
    }
    
    let xrAy=xrUtil.getAy();
    if (1) 
    for (let p of initps.points) if (p.userData.op.box
      &&p.userData.cannonBox
      ) {
      //p.userData.cannonBox.mesh.position.x+=0.001;
      let op=p.userData.op;
      
      
      
      op.x=p.position.x;
      op.y=p.position.y;
      op.z=p.position.z;
      //onsole.log(op.x);
      let box=p.userData.cannonBox,f=0.1/cannonsc;
      if (op.mass) {
        //onsole.log(box.body.position.z);
        let body=box.body,p0=body.position;
        box.pos.x=p0.x;box.pos.y=p0.y;box.pos.z=p0.z;
        //body.quaternion.set(b.quat.x,b.quat.y,b.quat.z,b.quat.w);
        if (!box.quat) box.quat={};
        let q=body.quaternion;
        box.quat.x=q.x;
        box.quat.y=q.y;
        box.quat.z=q.z;
        box.quat.w=q.w;
        let o5=box.point.userData.o5;
        if (o5&&(o5.ay===undefined)) o5.ay=0;
        if (box.ay===undefined) box.ay=0;
        let turna=undefined;
        let fore=undefined;//,up=undefined;
        if (box===player) {
          let x0=(c.left?-1:0)+(c.right?1:0);
          let y0=(c.fore?1:0)+(c.back?-1:0);
          //body.velocity.x=0;
          //body.velocity.y=0;
          if ((x0!=0)||(y0!=0)) {
            //let a=xrUtil.getAy();
            //console.log('a='+a);
            //let x1=x0*Math.cos(ay)-y0*Math.sin(ay);
            //let y1=y0*Math.cos(ay)+x0*Math.sin(ay);
            //body.velocity.x=x1*6;
            //body.velocity.y=y1*6;
            //let o5=box.point.userData.o5;
            //if (o5) {
            if (rotateRoom) {
              turna=-x0*0.05+o5.ay;
              fore=y0>0;
            } else {
              turna=Math.atan2(y0,x0)+xrAy+Math.PI/2;
              fore=true;
            } 
    
    //            let da=Conet.dAng(an,box.ay),ada=Math.abs(da);
    //            box.ay+=Math.min(ada,0.005*dt)*(da<0?-1:1);
    //            //o5.ay=an;
    //            if (o5) {
    //              o5.ay=box.ay;
    //              Pd5.animStart(o5,'run');
    //            }
    //            if (ada<0.3) 
    //              {
    //              //let a=xrAy;
    //              //console.log(a);
    //              let a=box.ay-Math.PI;x0=0;y0=1;
    //              let x1=x0*Math.cos(a)-y0*Math.sin(a);
    //              let y1=y0*Math.cos(a)+x0*Math.sin(a);
    //              body.velocity.x=x1*6;body.velocity.y=y1*6;
    //              //body.force.x=x1*20;body.force.y=y1*20;
    //            }
              
            //}
            //box.point.userData.o5.ay=ay;
    //          if (o5) {
    //            console.log(o5.x);
    //            if (isNaN(o5.x)) { o5.x=0;o5.y=0;o5.z=0; }
    //            o5.x=cannonsc*p0.x;
    //            o5.y=cannonsc*p0.z;
    //            o5.z=cannonsc*-p0.y;
    //          }
            //onsole.log(body.quaternion);
          } else {
            //if (o5) Pd5.animStart(o5,'stand2');
          }
          //let o5=box.point.userData.o5;
          //if (o5) o5.ay=ay+Math.PI;
          //let v;
          //v=(c.fore?1:0)+(c.back?-1:0);if (v!=0) body.velocity.x=v*6;
          //v=(c.left?1:0)+(c.right?-1:0);if (v!=0) body.velocity.y=v*6;
        } else { //ai
          let dx=player.pos.x-box.pos.x,
              dy=player.pos.y-box.pos.y,
              dz=player.pos.z-box.pos.z;
          turna=Math.atan2(dy,dx)+Math.PI/2;
          if (op.aiApproach) { 
            let d2=dx*dx+dy*dy+dz*dz;
            //console.log('aiApproach d2='+d2); 
            if (d2>op.aiApproach) fore=true;
          }
          if (op.animRun=='run') {
            //console.log('scale.x='+o5.meshes[0].tmesh.scale.x);
            if (c.brake!=p.userData.wasBrake) {
              if (c.brake) new Audio('https://cdn.freesound.org/previews/534/534218_11864320-lq.mp3').play();
              p.userData.wasBrake=c.brake;
              let sc=c.brake?0.5:0.04,t=100,scale=o5.meshes[0].tmesh.scale;
              tweens.push({t:t,o:scale,key:'x',value:sc});
              tweens.push({t:t,o:scale,key:'y',value:sc});
              tweens.push({t:t,o:scale,key:'z',value:sc});
              //onsole.log('sc='+sc);
              //o5.meshes[0].tmesh.scale.set(sc,sc,sc);
            }
          }
          //if (o5) { o5.ay=Math.random()*Math.PI; }
        }
        if (turna!==undefined) {
          let da=Conet.dAng(turna,box.ay),ada=Math.abs(da);
          box.ay+=Math.min(ada,(op.turnSpeed||0.005)*dt)*(da<0?-1:1);
          //o5.ay=an;
          if (o5) {
            o5.ay=box.ay;
            //Pd5.animStart(o5,'run');
          }
          if (fore&&(ada>0.3)) fore=undefined;
          if (ada<0.01) turna=undefined;
    //        {
            //let a=xrAy;
            //console.log(a);
    //          let a=box.ay-Math.PI;x0=0;y0=1;
    //          let x1=x0*Math.cos(a)-y0*Math.sin(a);
    //          let y1=y0*Math.cos(a)+x0*Math.sin(a);
    //          body.velocity.x=x1*6;body.velocity.y=y1*6;
            //body.force.x=x1*20;body.force.y=y1*20;
    //        }
        }
        if (fore) {
          //let a=xrAy;
          //console.log(a);
          let a=box.ay-Math.PI;x0=0;y0=1;
          let x1=x0*Math.cos(a)-y0*Math.sin(a);
          let y1=y0*Math.cos(a)+x0*Math.sin(a);
          let speed=op.speed||6;
          body.velocity.x=x1*speed;body.velocity.y=y1*speed;
          //body.force.x=x1*20;body.force.y=y1*20;
        }
        if (c.up) body.velocity.z=(op.speed||6);// /2
        if (o5) {
          //try { 
          Pd5.animStart(o5,turna||fore?(op.animRun||'run'):(op.animIdle||'stand2'));
          //} catch (e) {}
        }
        body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1),box.ay-Math.PI);//o5?o5.ay-Math.PI:xrAy);
        //---for force-use
        //let v=body.velocity,vl=Math.sqrt(v.x*v.x+v.y*v.y),maxvl=10;
        //if (vl>maxvl) { v.x*=maxvl/vl;v.y*=maxvl/vl; }      
        
        //let o5=box.point.userData.o5;
        //if (o5) o5.x+=1;
        //console.log(box.point);//.mesh?.userData.o5);
        //body.velocity.x=(c.fore?1:0)+(c.back?-1:0);
        //body.velocity.z=(c.left?1:0)+(c.right?-1:0);
      } else {
        box.pos.x=op.x*10*f;
        box.pos.y=-op.z*10*f;
        box.pos.z=op.y*10*f;
      }
      box.dim.x=op.scx*0.5*f;
      box.dim.y=op.scz*0.5*f;
      box.dim.z=op.scy*0.5*f;
      cannonBoxMeshUpdate(box);
      //console.log('update pos');
    }
    
    cannon.step(dt);//--- 10
    //onsole.log(dt/1000);
    //cannon.world.step(1.0/60.0,10/1000,3);
    //console.log(cannon.bodies[0]);
    let sc=cannon.sc;//0.5;
    for (let i=cannon.bodies.length-1;i>=0;i--) {
      let body=cannon.bodies[i],bp=bp.position,o=cannon.meshes[i].position;
      o.y=bp.z*sc;
      o.x=bp.x*sc;
      o.z=-bp.y*sc;
      let bq=cannon.bodies[i].quaternion,oq=cannon.meshes[i].quaternion;
      
      if (1) {
        oq.set(bq.x,bq.z,-bq.y,bq.w);
      } else {
        v0.set(1,0,0);
      
        q0.setFromAxisAngle(v0,Math.PI/2);
        q1.set(bq.x,bq.y,bq.z,bq.w);
        //oq.copy(q1);
        oq.multiplyQuaternions(q1,q0);
        q0.setFromAxisAngle(v0,Math.PI/2);
        oq.multiplyQuaternions(q0,oq);
      }
      
      //oq.y=bq.x;
      //oq.x=bq.y;
      //oq.z=bq.z;
      //oq.w=bq.w;
    }
    //console.log(player);
    //let o=cannon.o.meshes[0].tmesh.position,bp=cannon.ball.position;
    //o.y=bp.z-5;
    //o.x=bp.x;
    //o.z=bp.y;
    //onsole.log(o.y);
    
    //...
  }
  //--------------
  
  
  //---
  function onSelect() {
    //---
    selected=this;
    if (manims) {
      manims.s=this.o5.anim;
      manims.ms='Pd5 Anims';
    }
    //...
  }
  //---
  function render(dt) {
    //---
    Conet.calcTweens(tweens,dt);
    
    if (cannon) cannonRender(dt);
    
    //onsole.log(physWalks.length);
    for (let o of physWalks) {
      let phf=phys.etPhf();//250;
      
      //onsole.log(tsd);
      
      o.vx=tsd[0].dx*200;
      o.vz=tsd[0].dy*200;
      //onsole.log('x='+o.x+' y='+o.y);
      pha[0]=o.x*phf;
      pha[1]=o.y*phf;
      pha[2]=o.z*phf;
      pha[3]=o.vx;
      pha[4]=o.vy;
      pha[5]=o.vz;
      phys.calc0(o,pha,dt);
      //o.x+=0.01;
    }
    
    //if (rotateObj) rotateObj.rotation.y+=0.001*dt;
    
    let gp0=xrUtil.gp0;
    if (gp0&&grabMesh) {
      if (gp0.buttons[1]?.pressed) {
        if (!grabMeshMatrix) { 
          console.log('start grab '+grabMesh.matrixAutoUpdate);
          grabMesh.matrixAutoUpdate=false;
          console.log('start grab '+grabMesh.matrixAutoUpdate);
          grabMeshMatrix=new THREE.Matrix4();
          grabMeshMatrix.copy(grabMesh.matrix); 
        }
        grabMesh.matrix.multiplyMatrices(xrUtil.ctrl0.matrix,grabMeshMatrix);
        //onsole.log('grabbing');
      } else {
        if (grabMeshMatrix) { 
          grabMesh.matrix.copy(grabMeshMatrix);grabMeshMatrix=undefined; 
          console.log('grabbing stopped');
        }
      }
    }
    
    threeRender(dt);
    //onsole.log('pd5.render');
    //...
  }
  
  
  
  function initCannonTrimesh(ps) {
    //---
    if (0) {
      cannon=Conet.cannonTest();
      return;
    }
    
    console.log('init cannon');
    var world=new CANNON.World(),size=2.0;
    
    var shape = CANNON.Trimesh.createTorus(4, 3.5, 16, 16);
    
    // Create world
    world.gravity.set(0,0,-10);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    
    world.defaultContactMaterial.contactEquationStiffness = 1e7;
    world.defaultContactMaterial.contactEquationRelaxation = 4;
    
    // ground plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    world.add(groundBody);
    
    // sphere
    var sphereShape = new CANNON.Sphere(1);
    var sphereBody = new CANNON.Body({
      mass: 1,
      shape: sphereShape,
      position: new CANNON.Vec3(3,3,11)
    });
    world.add(sphereBody);
    
    // Shape on plane
    var shapeBody = new CANNON.Body({ mass: 1 });
    shapeBody.addShape(shape);
    var pos = new CANNON.Vec3(0,0,size);
    shapeBody.position.set(0,0,size*2);
    shapeBody.velocity.set(0,1,1);
    shapeBody.angularVelocity.set(0,0,0);
    world.add(shapeBody);
    
    //cannon={world:world,body:sphereBody};
    
      let cv=Conet.cannonVis({world:world});
      cv.co.ps.push(
        {p:shapeBody.position,c:'#ff0'},
        {p:sphereBody.position,c:'#fff'});
      //setInterval(cv.step,10);  
    
      cannon={torus:shapeBody,ball:sphereBody,step:cv.step};
    
    
    //...
  }
  
  function initCannonRaycastVehicle(ps) {
    //---
    console.log('init cannon raycast');
    //onsole.trace();
    var world=new CANNON.World(),size=2.0;
    
    
    var mass = 150;
    var vehicle;
    let cfg=initps.ps.cannonTest;
    
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.gravity.set(0,0,cfg.gravityZ||-10);
    world.defaultContactMaterial.friction = 0;
    
    groundMaterial=new CANNON.Material("groundMaterial");
    let sphereMovers=1;//if 0 its boxMovers
    groundMaterial.friction=sphereMovers?0.3:0.05;
    
    let noCar=cfg.noCar;
    if (noCar) {
      //ps.ps.mesh.removeFromParent();
      //onsole.log(ps.ps);
    } else {
    var wheelMaterial = new CANNON.Material("wheelMaterial");
    var wheelGroundContactMaterial = window.wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
        friction: 0.3,
        restitution: 0,
        contactEquationStiffness: 1000
    });
    
    // We must add the contact materials to the world
    world.addContactMaterial(wheelGroundContactMaterial);
    
    var chassisShape;
    chassisShape = new CANNON.Box(new CANNON.Vec3(2, 1,0.5));
    var chassisBody = new CANNON.Body({ mass: mass });
    chassisBody.addShape(chassisShape);
    chassisBody.position.set(0, 0, 4);
    chassisBody.angularVelocity.set(0, 0, 0.5);
    //demo.addVisual(chassisBody);
    
    var options = {
        radius: 0.5,
        directionLocal: new CANNON.Vec3(0, 0, -1),
        suspensionStiffness: 30,
        suspensionRestLength: 0.3,
        frictionSlip: 5,
        dampingRelaxation: 2.3,
        dampingCompression: 4.4,
        maxSuspensionForce: 100000,
        rollInfluence:  0.01,
        axleLocal: new CANNON.Vec3(0, 1, 0),
        chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
        maxSuspensionTravel: 0.3,
        customSlidingRotationalSpeed: -30,
        useCustomSlidingRotationalSpeed: true
    };
    
    // Create the vehicle
    vehicle = new CANNON.RaycastVehicle({
        chassisBody: chassisBody,
    });
    
    options.chassisConnectionPointLocal.set(1, 1, 0);
    vehicle.addWheel(options);
    
    options.chassisConnectionPointLocal.set(1, -1, 0);
    vehicle.addWheel(options);
    
    options.chassisConnectionPointLocal.set(-1, 1, 0);
    vehicle.addWheel(options);
    
    options.chassisConnectionPointLocal.set(-1, -1, 0);
    vehicle.addWheel(options);
    
    vehicle.addToWorld(world);
    
    var wheelBodies = [];
    for(var i=0; i<vehicle.wheelInfos.length; i++){
        var wheel = vehicle.wheelInfos[i];
        var cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20);
        var wheelBody = new CANNON.Body({ mass: 1 });
        var q = new CANNON.Quaternion();
        q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
        wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);
        wheelBodies.push(wheelBody);
        //demo.addVisual(wheelBody);
    }
    
    // Update wheels
    world.addEventListener('postStep', function() {
      for (var i = 0; i < vehicle.wheelInfos.length; i++) {
          vehicle.updateWheelTransform(i);
          var t = vehicle.wheelInfos[i].worldTransform;
          wheelBodies[i].position.copy(t.position);
          wheelBodies[i].quaternion.copy(t.quaternion);
      }
    }
    );
    
    }
    
    let matrix;
    if (!initps.ps.cannonTest.noGround) {
    matrix = [];
    var sizeX = 64,
        sizeY = 64;
    
    for (var i = 0; i < sizeX; i++) {
        matrix.push([]);
        for (var j = 0; j < sizeY; j++) {
            var height = Math.cos(i / sizeX * Math.PI * 5) * Math.cos(j/sizeY * Math.PI * 5) * 2 + 2;
            if(i===0 || i === sizeX-1 || j===0 || j === sizeY-1)
                height = 3;
            matrix[i].push(height);
        }
    }
    
    var hfShape = new CANNON.Heightfield(matrix, {
        elementSize: 100 / sizeX
    });
    var hfBody = new CANNON.Body({ mass: 0 });
    hfBody.addShape(hfShape);
    hfBody.position.set(-sizeX * hfShape.elementSize / 2, -sizeY * hfShape.elementSize / 2, -1);
    world.add(hfBody);
    }
    //demo.addVisual(hfBody);
    
    //onsole.log(ps.initps.points);
    
    let boxes=[
      //{pos:{x:5, y:0,z:3},dim:{x:2,y:2,z:2}},
      ////{pos:{x:10,y:0,z:3},dim:{x:2,y:2,z:2}}
      //{pos:{x:13.5,y:0,z:2},dim:{x:6,y:1,z:2},quat:{x:0,y:0,z:1,w:0.3}},
      ////{pos:{x: 6.19, y: 1.487, z: -8.634},dim:{x: 6, y: 2, z: 1.5}},
      ////{pos:{x: 6.1899999999999995, y: 1.487, z: -8.634},dim:{x: 6, y: 2, z: 1.5}},
    ];
    
    cannonsc=ps.ps.ps.sc/0.005;
    
    
    if (1)
    for (let p of initps.points) if (p.userData.op.box) {
      //onsole.log('add box from point');
      let op=p.userData.op,f=0.1/cannonsc;
      //onsole.log('f='+f);
      boxes.push(p.userData.cannonBox={
        pos:{x:op.x*10*f,y:-op.z*10*f,z:op.y*10*f},
        dim:{x:op.scx*0.5*f,y:op.scz*0.5*f,z:op.scy*0.5*f},
        quat:(op.qx===undefined?undefined:{x:op.qx,y:-op.qz,z:op.qy,w:op.qw}),
        point:p
      });
      if (op.player) player=p.userData.cannonBox;
    }
    
    //onsole.log(initps.points);
    //console.log('boxes.length='+boxes.length);
    //console.log(boxes[2].pos);console.log(boxes[2].dim);
    
    for (let box of boxes) {
      let mass=box.point?.userData.op.mass||0;
      //if (mass!=0) console.log('box.dim='+box.dim.x+' '+box.dim.y+' '+box.dim.z);
      let h=box,shape=((mass!=0)&&sphereMovers)?
        new CANNON.Sphere(h.dim.z):
        new CANNON.Box(new CANNON.Vec3(h.dim.x,h.dim.y,h.dim.z));
      let body=new CANNON.Body({mass:mass,material:groundMaterial});
      body.angularDamping=1;
      //body.linearDamping=0.8;
      //onsole.log('body.mass='+body.mass);
      body.addShape(shape);
      body.position.set(h.pos.x,h.pos.y,h.pos.z);
      
      let b=h;
      //if (0) 
      if (b.quat) {
        let l=Math.sqrt(b.quat.x*b.quat.x+b.quat.y*b.quat.y+b.quat.z*b.quat.z+b.quat.w*b.quat.w);
        b.quat.x/=l;b.quat.y/=l;b.quat.z/=l;b.quat.w/=l;//console.log(b.quat);
        body.quaternion.set(b.quat.x,b.quat.y,b.quat.z,b.quat.w);
      }
     
      world.add(body);box.body=body;
      
      if (mass!=0)
    if (0) body.addEventListener('collide',
    function (e) {
      //---
      //onsole.log(e.contact);
      let c=e.contact;
      //contactpoints (via https://github.com/schteppe/cannon.js/issues/303)
      //c.bi.position + c.ri
      //c.bj.position + c.rj
      let sc=cannonsc;
      let p0=c.bi.position,p1=c.ri,
          x=(p0.x+p1.x)*sc,
          y=(p0.z+p1.z)*sc,
          z=-(p0.y+p1.y)*sc;
      //x*=sc;y*=sc;z*=sc;
      initps.editxr.pointAdd({x:x,y:y,z:z,noSerialize:1});
      //onsole.log('collide');//+x+' '+y+' '+z);
      //...
    }
    ); 
      
      
      //demo.addVisual(boxBody2);
    }
    
    
    //-------------------------------------
    
    
    //threeEnv.path='/shooter/';
    let m2,m3;
    {
    let mesh;
    threeSetMeshMaterial(mesh={
      //diff:'/shooter/objs/mapGen/d10.jpg',spec:'/shooter/objs/mapGen/s1.jpg',norm:'/shooter/objs/mapGen/n1.jpg'
      diff:'/shooter/objs/mapGen/leavesd.jpg',spec:'/shooter/objs/mapGen/leavess.jpg',norm:'/shooter/objs/mapGen/leavesn.jpg'
    },{});
    m2=mesh.material;//m2.castShadow=true;m2.receiveShadow=true;
    threeSetMeshMaterial(mesh={
      diff:'/shooter/objs/mapGen/d10.jpg',spec:'/shooter/objs/mapGen/s1.jpg',norm:'/shooter/objs/mapGen/n1.jpg'
    },{});
    m3=mesh.material;
    }
    //onsole.log(m2);
    
    //cannonsc=ps.ps.ps.sc/0.005;
    console.log('cannonsc='+cannonsc+' ps.ps.ps.sc='+ps.ps.ps.sc+' initps.sc='+initps.sc);
    if (matrix) {
    let g=new THREE.BufferGeometry(),pos=[],uv=[],ix=[],norm=[],w=1.55*cannonsc;
    //ix=[0,2,1];pos=[0,0,0,1,0,0,1,0,1];uv=[0,0,1,0,1,1];
    for (let y=0;y<sizeY;y++) 
      for (let x=0;x<sizeX;x++) {
         pos.push((x-sizeX/2)*w,(matrix[x][y]-1)*cannonsc,(-y+sizeY/2)*w);
         norm.push(0,1,0);
         uv.push(x*0.25,y*0.25);
         if ((x==0)||(y==0)) continue;
         let i0=(y-1)*sizeX+x-1,
             i1=(y)*sizeX+x-1,
             i2=(y)*sizeX+x,
             i3=(y-1)*sizeX+x;
         ix.push(i0,i2,i1,i2,i0,i3);
      }
    g.setIndex(ix);
    g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    g.setAttribute('normal',new THREE.Float32BufferAttribute(norm,3));
    g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
    g.computeVertexNormals();
    
    let dum1=new THREE.Mesh(g//new THREE.BoxGeometry(0.1,0.1,0.1)
    ,m2);
    dum1.castShadow=true;dum1.receiveShadow=true;
    //console.log(ps);
    let sc=1;dum1.scale.set(sc,sc,sc);
    ps.ps.mesh.add(dum1);
    }
    
    for (let box of boxes) {
      if (box.point.userData.op.fn) continue;//---testbox
      if (box.point.userData.op.hidden) continue;//---testbox 
      let h=box,sc=cannonsc; 
      let mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1//sc*h.dim.x*2,sc*h.dim.z*2,sc*h.dim.y*2
        ),box.point.userData.op.diff?m3:m2);
      box.mesh=mesh;
      //mesh.position.set(sc*(h.pos.x),sc*(h.pos.y+2),sc*(h.pos.z-3));
      //mesh.scale.set(sc*h.dim.x*2,sc*h.dim.z*2,sc*h.dim.y*2);
      cannonBoxMeshUpdate(box);
      //if (h.quat) 
      //mesh.quaternion.copy(box.body.quaternion);
      mesh.quaternion.x=box.body.quaternion.x;
      mesh.quaternion.z=-box.body.quaternion.y;
      mesh.quaternion.y=box.body.quaternion.z;
      mesh.quaternion.w=box.body.quaternion.w;
      mesh.castShadow=true;
      mesh.receiveShadow=true;
      ps.ps.mesh.add(mesh);
      
    }
    
    
    //cannon={world:world,body:sphereBody};
    
    let step;
    
    if (0) {
      let cv=Conet.cannonVis({world:world});
      cv.co.ps.push(
        {p:wheelBodies[0].position,c:'#fff'},
        {p:wheelBodies[1].position,c:'#fff'},
        {p:wheelBodies[2].position,c:'#fff'},
        {p:wheelBodies[3].position,c:'#fff'});
      step=cv.step;
    } else 
    step=function(dt) {
      //---
      world.step(1.0/60.0,dt/1000,3);
      //...
    }
        
      //setInterval(cv.step,10);  
    
    cannon={
      //ball:wheelBodies[0],
      step:step,
      bodies:noCar?[]:wheelBodies.concat([chassisBody]),
      sc:cannonsc,
      ctrl:{},ctrlOld:{},vehicle:vehicle,
      world:world
    };
    
    //xrUtil.log('');
    xrUtil.log(player?
      '--> Move knight with WASD, Jump-Scare B or xr-ctrl.':
      '--> Move car with wasd+b or xr-controller.');
    
    //...
  }
  
  function bbdraw(bb) {
    //--- copied from /util/bricks.js
    
    var c=bb.c,w=c.width,h=c.height*bb.ar,ct=bb.ct,//c.getContext('2d');
        bo=bb.o,u=bo;//undefined;
    
    ct.clearRect(0,0,w,h);
    //ct.fillStyle=(bo?.hitt===undefined)?'rgba(0,0,0,0.5)':'#f00';
    ct.fillStyle=u.alerted?'rgba(250,250,0,0.9)':'rgba(0,0,0,0.5)';
    ct.fillRect(0,0,w,h);//p.c=c;p.ct=ct;
    
    
    var h2=h,b=w/40;
    var f=bo.hp/bo.ohp;
    ct.fillStyle='#0f0';
    ct.fillRect(b,b+h-h2,(w-2*b)*f,h2-2*b);
    ct.fillStyle='#f00';
    ct.fillRect(b+(w-2*b)*f,b+h-h2,(w-2*b)*(1-f),h2-2*b);
    
    ct.textBaseline='top';
    ct.font='16px sans-serif';
    let sh='\u2694'+bo.ap+' \u2665'+bo.hp
        //+(((bo.col==2)&&(u.blockHeight==1))?' stealth':'')
        ,//unicode swords,heart,iceshoe
        x=w/25,y=x;
    ct.fillStyle='#fff';ct.fillText(sh,x+1,y+1);
    ct.fillStyle='#000';ct.fillText(sh,x,y);
    
    bb.threeTex.needsUpdate=true;
    //...
  }
  
  
  window.w3ditScriptInit({initf:function (ps) {
    //---
    //let m=new THREE.Mesh(
    //   new THREE.BoxGeometry(0.1,0.1,0.1),
    //   new THREE.MeshPhongMaterial({flatShading:true,color:0xdddddd,transparent:true,opacity:0.9}));
    //ps.mesh.add(m);
    
    xrUtil=ps.xrUtil;
        //canv,ct,tex,
    let o,mesh,ps0=ps.ps,sceneh=ps.sceneh,lights=[],editxr=ps.editxr,
        scriptHandlers=ps.scriptHandlers,mode='diff',
        modes={
          diff:{tex:'map'},
          norm:{tex:'normalMap'},
          spec:{tex:'specularMap'}
        };//,initps=ps;
    initps=ps;
    room=editxr.room;
    
    //onsole.log('initf ps0.fn='+ps0.fn+' ps0.cannonTest='+ps0.cannonTest);
    //onsole.log(this);
    //console.log('ps.points.len='+ps.points.length);
    //for (let p of ps.points) if (p.userData.op.box) console.log(p.userData.op);
    //onsole.log(ps);
    
    scriptHandlers.setMode=function(m) {
      //---
      mode=m;
      console.log('script-pd5 mode='+mode);
      //...
    }
    
    
    //onsole.log(ps);
    ps.mesh.userData.onserialize=function() {
      //---
      //onsole.log('pd5.onserialize');
      let data=this.op.data;
      //console.log(this.op);
      //console.log(modes.diff.canv);
      if (data) {
        //onsole.log(data.meshes[0].diff);
        //onsole.log(canv.toDataURL());
        if (modes.diff.canv) data.meshes[0].diff=modes.diff.canv.toDataURL();
        if (modes.norm.canv) data.meshes[0].norm=modes.norm.canv.toDataURL();
        if (modes.spec.canv) data.meshes[0].spec=modes.spec.canv.toDataURL();
      }
      if (ps0.diff&&modes.diff.canv&&ps0.diff.endsWith('.json')) {
        //console.log(ps0.diff);
        //console.log(modes.diff.canv.toDataURL());
        let h;
        Conet.upload(h={fn:ps0.diff,data:JSON.stringify({data:modes.diff.canv.toDataURL()})});
        xrUtil.log('Saved '+h.data.length+' b to '+h.fn+'.');
      }
      if (!data&&!ps0.diff) {
        //---
        if (modes.diff.canv||modes.norm.canv||modes.spec.canv) {
          if (modes.diff.canv) o.meshes[0].diff=modes.diff.canv.toDataURL();
          if (modes.norm.canv) o.meshes[0].norm=modes.norm.canv.toDataURL();
          if (modes.spec.canv) o.meshes[0].spec=modes.spec.canv.toDataURL();
          let d=W3dit.serialize1(o);
          xrUtil.log('Saving '+ps0.fn+' '+d.length);//+modes.diff.canv+' '+modes.norm.canv+' '+modes.spec.canv);
          Conet.upload({fn:ps0.fn,data:d});
          //console.log(o);
        } else 
          xrUtil.log('Saving '+ps0.fn+' skipped, no changes.');
        //let d=W3dit.serialize1(o);
        //console.log(d.length);
        //console.log(d);
      }
      //onsole.log(this);
      this.op.animStop=this.o5.animStop?1:undefined;
      //...
    }
    
    ps.mesh.userData.onSelect=onSelect;
    
    function modeColor() {
      //---
      return ((mode=='diff')?sceneh.paint.color:((mode=='spec')?sceneh.paint.specColor:sceneh.paint.normColor));
      //...
    }
    
    function rayCol(co,down,e) {
      //---
      //onsole.log(co);
      let downgp11=xrUtil.isSession&&xrUtil.gp1&&xrUtil.gp1.buttons[1].pressed;
      
      if (!down&&!downgp11) return;
      
      //console.log(e.buttons);
      let modeh=modes[mode],canv=modeh.canv,ct=modeh.ct,tex=modeh.tex;
      
      if (!canv) {
        //onsole.log(mesh.material);
        let img=mesh.material[modeh.tex].image,w=img.width,h=img.height;
        //onsole.log('now create canvas with '+w+' '+h);
        let c=document.createElement('canvas');
        c.width=w;c.height=h;canv=c;
        xrUtil.log('creating canvas '+w+'x'+h);
        ct=c.getContext('2d',{willReadFrequently:true});
        ct.drawImage(img,0,0);
        //ct.fillStyle='#0f0';
        //ct.fillRect(0,0,w,h);
        tex=new THREE.Texture(c);tex.needsUpdate=true;
        mesh.material[modeh.tex]=tex;
        modeh.canv=canv;modeh.ct=ct;modeh.tex=tex;
      }
      
      let uv=co.uv,cw=canv.width,ch=canv.height,xc=(uv.x*cw),yc=((1-uv.y)*ch);
      
      if ((e&&e.buttons==2)||downgp11||scriptHandlers.pickMode) {
        //onsole.log('pick');
        let d=ct.getImageData(xc,yc,1,1).data;
        //onsole.log(d);
        let c=modeColor();//sceneh.paint.color;
        c[0]=d[0];
        c[1]=d[1];
        c[2]=d[2];
        scriptHandlers.colorChanged();
        return;
      }
      
      if ((mode=='norm')&&(sceneh.paint.normMode!='paint')) {//---norm up down
        let r=sceneh.paint.radius,xcf=Math.floor(xc),ycf=Math.floor(yc),
            x0=xcf-r,x1=xcf+1+r,y0=ycf-r,y1=ycf+1+r;
        if (x0<0) x0=0;if (y0<0) y0=0;
        if (x1>=cw) x1=cw-1;if (y1>=ch) y1=ch-1; 
        let id=ct.getImageData(x0,y0,x1-x0+1,y1-y0+1),d=id.data;
        let bp=modeColor()[3];
        for (let yr=-r;yr<=r;yr++) for (let xr=-r;xr<=r;xr++) {
          var x=xr+xcf,y=yr+ycf;
          if ((x<0)||(y<0)||(x>=cw)||(y>=ch)) continue;
          let f1=1-(xr*xr+yr*yr)/(r*r);
          if (f1<0) continue;
          let of1=f1;
          
          let di=((y-y0)*(x1-x0+1)+(x-x0))*4;
          let or=d[di],og=d[di+1],ob=d[di+2],oa=d[di+3];
          
          let n0x=or*2/255-1,n0y=og*2/255-1,n0z=ob*2/255-1,n0l=Math.sqrt(n0x*n0x+n0y*n0y+n0z*n0z);
          n0x/=n0l;n0y/=n0l;n0z/=n0l;
      
          let h0=255*of1;
          let hx0=255*Math.max(0,1-((xr-1)*(xr-1)+yr*yr)/(r*r));
          let hx1=255*Math.max(0,1-((xr+1)*(xr+1)+yr*yr)/(r*r));
          let hy0=255*Math.max(0,1-(xr*xr+(yr-1)*(yr-1))/(r*r));
          let hy1=255*Math.max(0,1-(xr*xr+(yr+1)*(yr+1))/(r*r));
          let down=sceneh.paint.normMode=='down';//(normalMode==NMDOWN);
          let nx=(down?-1:1)*((hx0-h0)+(h0-hx1))/2;
          let ny=(down?-1:1)*((hy0-h0)+(h0-hy1))/2;
          let nz=down?-10:10;
          let nl=Math.sqrt(nx*nx+ny*ny+nz*nz);nx/=nl;ny/=nl;nz/=nl;
          let p=Math.pow(bp,1.5);// 0.1 ~> 0.03
          nx=nx*p+n0x*(1-p);
          ny=ny*p+n0y*(1-p);
          nz=nz*p+n0z*(1-p);
          nl=Math.sqrt(nx*nx+ny*ny+nz*nz);nx/=nl;ny/=nl;nz/=nl;
      
          let nr=Math.floor((nx+1)*128+0.5);
          let ng=Math.floor((ny+1)*128+0.5);
          let nb=Math.floor((nz+1)*128+0.5);
          d[di]=nr;d[di+1]=ng;d[di+2]=nb;d[di+3]=255;
        }
        ct.putImageData(id,x0,y0);
        //onsole.log(xc+' '+yc+' '+r);
      } else {
        let cs,bw=10;
        if (sceneh.paint) {
          let a=modeColor();//((mode=='diff')?sceneh.paint.color:((mode=='spec')?sceneh.paint.specColor:[0,255,0,0.1]));
          cs=a[0]+','+a[1]+','+a[2]+','+a[3];
          bw=sceneh.paint.radius;
        } else cs='0,0,250,1';
        //onsole.log(sceneh.paint);
        ct.fillStyle='rgba('+cs+')';
        
        //ct.fillRect((uv.x*canv.width)-bw,((1-uv.y)*canv.height)-bw,bw*2,bw*2);
        ct.beginPath();
        ct.arc(xc,yc,bw,0,2*Math.PI);
        ct.fill();
      }
      
      tex.needsUpdate=true;
      //onsole.log(co.uv);
      //...
    }
    
    function initObj(ps1) {
      //---
      console.log('initObj '+ps0.fn);
      
      
      o.scale=1;
      if (ps0.anim) Pd5.animStart(o,ps0.anim);
      threeEnv.base=ps1.base;
      if (ps0.transparent) o.transparent=true;
      threeAddObj(o,0,0,0,ps0.sc||1);//0.5
      let ps=ps1.ps;
      if (ps.ay) o.ay=ps.ay;
      if (ps0.ay) o.ay=ps0.ay;//250615 added and tested, is ps.ay check still needed?
      o.calcVertNorms=1;
      ps.mesh.userData.o5=o;
      //onsole.log(p);
      
      mesh=o.meshes[0].tmesh;
      grabMesh=mesh;
      
      
      //u.bbdraw=bbdraw;
      //u.bb=
      if (ps0.bb) {
        let tb=threeEnv.base,m=o.meshes[0].tmesh;
        threeEnv.base=m;
        o.ap=2;o.hp=5;o.ohp=10;
        o.bbdraw=bbdraw;
        threeBillboardAdd({x:0,y:0.9,z:0,ar:0.2,s:0.015,transparent:true,gw:20,cw:128,o:o});
        threeEnv.base=tb;
      }
      //xrUtil.rayObjs.push(mesh);//250130
      //console.log('xrUtil.rayObjs.length='+xrUtil.rayObjs.length);
      //console.log(mesh);
      
      mesh.userData.rayCol=rayCol;
      mesh.userData.editPoint=ps.mesh;
      ps.scriptHandlers.rayObjsReset();
      //Pd5.animStart(o,{a:[{s:'nay'},{s:'yay'}]});
      if (ps0.phys) {
        if (!phys) {
          phys=new Phys({});
          phys.etPhf(1250);
        }
        //onsole.log(phys.tris.length);
        Pd5.calc(o,0,0.0,0.0,1,{x:0,y:0,z:0},0,0,true);
        phys.finishTris({o5:o,sc:0.5});
        //onsole.log(phys.tris.length);
      }
      if (ps0.physWalk) {
        if (physWalks.length==0) tsd=Menu.touchSticksInit({autoKeys:1,skip1:1});
        o.x=0;o.y=1;o.z=1;
        o.vx=0;o.vy=0;o.vz=0;//o.flying=1;
        o.pht2=10;
        physWalks.push(o);
        //onsole.log(o);
      }
      if (ps0.cannonTest) {
        //onsole.log('loading cannon.min.js');
        var script=document.createElement('script');
      script.onerror=function() {
        //---
        console.log('Cannon Script error.');
        //xrUtil.log(fn);
        //...
      }
      script.onload=function() {
        //---
        //xrUtil.log('Script loaded: '+fn);
        //onsole.log('Cannon Script loaded.');
        //initCannonTrimesh({});
        //onsole.log(ps0.sc);
        tsd=Menu.touchSticksInit({autoKeys:1,skip1:1});
        
        initCannonRaycastVehicle({ps:ps});
        cannon.o=o;
        cannon.meshes=[];
        //cannon.sc=ps0.sc/0.005;
        //console.log(cannon.sc);
        
        if (ps0.cannonTest.noCar) {
          o.meshes[0].tmesh.removeFromParent();
          o.meshes[1].tmesh.removeFromParent();
        } else {
        let c=ps1.base,m0=o.meshes[0].tmesh;//.clone();
        //ps1.base.remove(m0);
        m0.userData={};
        cannon.meshes.push(m0);
        
        for (i=0;i<3;i++) { 
          let m1=m0.clone();
          //m1.position.x=i+1;
          c.add(m1);
          cannon.meshes.push(m1);
        }
        
        cannon.meshes.push(o.meshes[1].tmesh);
        }
        //console.log(o);
        
        //xrUtil.log(fn);
        //...
      }
        script.src='/anim/cannon/v062/cannon.min.js';
        document.head.appendChild(script);
        //script.onload();
      }
      
      if (ps0.player) {
        //onsole.log('@@@@@@@@@@@@ add light');
        let l=new THREE.PointLight(0xffffff,0.05,0.1);
        l.position.set(0.3,0.3,0.3);//0.3,0.9,0.3
        l.castShadow=true;
        l.shadow.mapSize.width=2048; // default
        l.shadow.mapSize.height=2048; // default
        l.shadow.camera.near=0.01; // default
        l.shadow.camera.far=1; // defaul
        mesh.add(l);
        lights.push({light:l});
        
        if (1) {
        //onsole.log('pd5.initObj '+editxr.points.length);
        for (let p of editxr.points) {
          if (p.children.length==0) continue;
          for (let ch of p.children) {
            if (!(ch instanceof THREE.DirectionalLight)) continue;
            //onsole.log(ch);
            lights.push({light:ch});
          }
        }
        let bgMesh=editxr.sceneh.bgMesh;
        //onsole.log('bgMesh');
        //nsole.log(bgMesh);
        //console.log(Menu.roots);
        if (1) {
          let m;
          xrUtil.hud.buttons.push(
        m={s:'Scale',ms:'Pd5',x:0.55,y:0.7,w:0.16,h:0.1
        ,ondown:xrUtil.scaleSwitch({
          scaleCfg:sceneh.scaleCfg||[
            ////{sc:0.0015,lint:0.000003*lint,bgop:0,flightSpeed:0.001,camPos:{x:0,y:0.24,z:1}   ,roomPos:{x:-0.48,y:0.99,z:-0.65}},
            //{sc:0.5,lint:0.9,bgop:0,flightSpeed:0.001,rotateRoom:0,_camPos:{x:0,y:0.24,z:1}   ,_roomPos:{x:-0.48,y:0.99,z:-0.65},vrPos:{x:-0.121,y:1.5728,z:-0.4666}},
            //{sc:1,lint:0.8,bgop:0,flightSpeed:0.001,rotateRoom:1,camPos:{x:-0.0702,y:0.2576,z:0.0778} ,notXr:1},
            //{sc:1,lint:0.8,bgop:0,flightSpeed:0.001,rotateRoom:0,camPos:sceneh.camPos1,notXr:1},
            {sc:0.25,lint:0.8,bgop:0,flightSpeed:0.001,rotateRoom:0,_camPos:{x:0,y:0.24,z:1}   ,_roomPos:{x:-0.48,y:0.99,z:-0.65},vrPos:{x:-0.121,y:1.5728,z:-0.4666},_onlyXr:1},
            {sc:15  ,lint:50 ,bgop:1,flightSpeed:0.001,rotateRoom:1,_camPos:{x:0,y:2.2 ,z:14.7},_roomPos:{x:2.43,y:3.38,z:-3.79} ,vrPos:{x:0.058,y:-0.1197,z:0.0373},_onlyXr:1},
          ]
          //,pl0:pl0,pl1:pl1
          ,bgMeshScale:bgMesh?bgMesh.scale:0.2
          ,bgMeshPosition:bgMesh?new THREE.Vector3(bgMesh.pos.x,bgMesh.pos.y,bgMesh.pos.z):new THREE.Vector3(0,0,0)
          //,noStartScfg:1//251022 commented out
          ,lights:lights})
        }   
          );
          //onsole.log('m='+m);
      xrUtil.onScaleSwitch=function(ps) {
        rotateRoom=ps.scfg.rotateRoom;
        //onsole.log('xrUtil rotateRoom='+rotateRoom);
        //...
      }
          Menu.roots[0].sub.push({s:'Scale',ms:'Pd5',actionf:m.ondown,r:1});
          if (Conet.parseUrl().scaleCfg) m.ondown();
          window.mscale=m;console.info('%cmscale.ondown() to toggle scale','background: #9f9; font-size: large');
        }
      }  
      }
      //...
    }
    
    if (first) {
      first=false;
      xrUtil.log('Pd5 v.0.1531 ');//FOLDORUPDATEVERSION
      
      
      if (0) xrUtil.hud.buttons.push(
        manims={s:(typeof(ps.ps.anim)=='string')?ps.ps.anim:'random',ms:'Pd5 Anims',x:0.37,y:0.7,w:0.3,h:0.1,
    ondown:function() {
      //---
      //console.log(selected);
      let o5=selected.o5;
      console.log(o5.animStop);
      if (o5.animStop) { o5.animStop=false;Pd5.animStart(o5,o5.anim); }
      else o5.animStop=true;//!o5.animstop;
      //...
    }
        }
      );
      if (0) //250616 for now just use fix value
      if (rotateRoom) xrUtil.hud.buttons.push(
        {s:''+roomAngleD,ms:'delta room rotation',x:0.37,y:0.7,w:0.3,h:0.1,
    oninput:function(v) {
      //---
      //console.log(v);
      if (v.length>0) try {
      roomAngleD=parseFloat(v);
      } catch(e) {};
      //...
    }
        }
      );
      selected=ps.mesh.userData;
      //onsole.log(ps);
    }
    
    //onsole.log(ps);
    if (ps0.data) {
      xrUtil.log('scriptPd5: loading data');
      o=Pd5.load(JSON.stringify(ps0.data));
      initObj({ps:ps,base:ps.mesh});
    } else if (1)
    Conet.download({fn:ps0.fn,ps:ps,base:ps.mesh,f:function(v) {
      //---
      //if (1) {
      //  console.log(this);
      //  console.log(v);
      //  return;
      //}
      o=Pd5.load(v);
      
      //o.meshes[0].diff=o.meshes[0].norm;
      //onsole.log(o.meshes[0].diff);
      if (ps0.diff) o.meshes[0].diff=ps0.diff;//'/shooter/objs/templar/ar_png.json';
      if (ps0.animStop) o.stopAfterAnim=true;
      
      //if (1) {
      //  console.log(o);
      //  return;
      //}
      initObj(this);
      //...
    }
    });
    //...
  }
  ,renderf:render
  });
  //...
}
)();
//----
//fr o,1
//fr o,1,13
//fr o,1,14
//fr o,1,21
//fr o,1,27,90
//fr o,1,27,177
//fr o,1,27,271
//fr o,1,32
//fr o,1,32,32
//fr o,1,32,34
//fr o,1,32,36
//fr o,1,32,36,113
//fr o,1,32,64
//fr p,27,70
