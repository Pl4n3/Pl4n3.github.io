var MegaBonkMaze=(function() {
  let r0=0.3,g0=0.3,b0=0.1,//brown
      r1=0.1,g1=1,b1=0.1;//green
  let self={};
  self.generate=function(ps) {
    //---
    console.log('generating.');
    let ph=ps.ph;
    
    function et(x,y,z,v) {
      //---
      //let k=z+'_'+y+'_'+x;
      let k=x+'_'+y+'_'+z;
      if (v===undefined) return ph[k];
      ph[k]=v;
      //...
    }
    
    
    let ge=new THREE.BufferGeometry();
    let w=0.4*0.2,h=0.3*0.2;
    let mh={
      position:[],
      color:[],
      index:[],
      uv:[],
    };
    //let groundUv={u0:0,u1:1,v0:0,v1:1};
    let groundUv={u0:0.1,u1:0.5,v0:0.4,v1:0.64};
    let greenUv={u0:0.1,u1:0.5,v0:0.7,v1:0.9};
    
    function addTri(mh, x0,y0,z0, x1,y1,z1, x2,y2,z2, r,g,b) {
      let i0=mh.position.length/3;
      mh.position.push(x0,y0,z0, x1,y1,z1, x2,y2,z2);
      mh.color.push(r,g,b, r,g,b, r,g,b);
      mh.index.push(i0+0,i0+1,i0+2);
      if (mh.uv) {
        let h=(r==r1)?greenUv:groundUv;
        mh.uv.push(h.u0,h.v0, h.u1,h.v0, h.u0,h.v1);
        //mh.uv.push(0,0, 1,0, 0,1);
      }
      //...
    }
    
    
    function addQuad(mh, x0,y0,z0, x1,y1,z1, x2,y2,z2, x3,y3,z3, r,g,b) {
      let i0=mh.position.length/3;
      mh.position.push(x0,y0,z0, x1,y1,z1, x2,y2,z2, x3,y3,z3);
      mh.color.push(r,g,b, r,g,b, r,g,b, r,g,b);
      mh.index.push(i0+0,i0+1,i0+2,i0+1,i0+3,i0+2);
      if (mh.uv) {
        let h=(r==r1)?greenUv:groundUv;
        mh.uv.push(h.u0,h.v0, h.u1,h.v0, h.u0,h.v1, h.u1,h.v1);
        //mh.uv.push(0,0, 1,0, 0,1, 1,1);
      }
      //...
    }
    
    //let x0=0,y0=0,z0=0;
    //addQuad(mh, x0-w,y0-h,z0+w, x0+w,y0-h,z0+w, x0-w,y0+h,z0+w ,x0+w,y0+h,z0+w, r0,g0,b0);
    //x0+=w*2;
    //addQuad(mh, x0-w,y0-h,z0+w, x0+w,y0-h,z0+w, x0-w,y0+h,z0+w ,x0+w,y0+h,z0+w, r0,g0,b0);
    
    //onsole.log(ph);
    //MegaBonkMaze.generate({});
    
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
          addTri(mh, x0+w,y0-h,z0+w, x0+w,y0-h,z0-w, x0+w,y0+h,z0+w, r0,g0,b0);
          //addTri(mh, x0+w,y0+h,z0+w, x0+w,y0-h,z0+w, x0+w,y0-h,z0-w ,r0,g0,b0);
    
      } else if (p.t=='r1') {
    
        n=et(p.x,p.y,p.z-1)?.t;if ((n!='b')&&(n!='r0')&&(n!='r1'))
          addTri(mh, x0+w,y0-h,z0-w, x0-w,y0-h,z0-w, x0+w,y0+h,z0-w, r0,g0,b0);
          //addTri(mh, x0-w,y0-h,z0-w, x0+w,y0+h,z0-w, x0+w,y0-h,z0-w ,r0,g0,b0);
        n=et(p.x,p.y,p.z+1)?.t;if ((n!='b')&&(n!='r2')&&(n!='r1'))
          addTri(mh, x0+w,y0-h,z0+w, x0+w,y0+h,z0+w, x0-w,y0-h,z0+w, r0,g0,b0);
          //addTri(mh, x0-w,y0-h,z0+w, x0+w,y0-h,z0+w, x0+w,y0+h,z0+w ,r0,g0,b0);
          
        addQuad(mh, x0-w,y0-h,z0+w, x0+w,y0+h,z0+w, x0-w,y0-h,z0-w ,x0+w,y0+h,z0-w, r1,g1,b1);
    
        n=et(p.x+1,p.y,p.z)?.t;if ((n!='b')&&(n!='r3'))
          addQuad(mh, x0+w,y0-h,z0+w, x0+w,y0-h,z0-w, x0+w,y0+h,z0+w ,x0+w,y0+h,z0-w, r0,g0,b0); 
      }
      
      else if (p.t=='r2') {
    
        n=et(p.x,p.y,p.z-1)?.t;if ((n!='b')&&(n!='r0')) 
          addQuad(mh, x0+w,y0-h,z0-w, x0-w,y0-h,z0-w, x0+w,y0+h,z0-w ,x0-w,y0+h,z0-w, r0,g0,b0);
    
        addQuad(mh, x0-w,y0-h,z0+w, x0+w,y0-h,z0+w, x0-w,y0+h,z0-w ,x0+w,y0+h,z0-w, r1,g1,b1);
    
        n=et(p.x-1,p.y,p.z)?.t;if ((n!='b')&&(n!='r1')&&(n!='r2'))
          addTri(mh, x0-w,y0-h,z0-w,  x0-w,y0-h,z0+w,  x0-w,y0+h,z0-w, r0,g0,b0);
          //addTri(mh, x0-w,y0+h,z0-w, x0-w,y0-h,z0-w, x0-w,y0-h,z0+w ,r0,g0,b0);
        n=et(p.x+1,p.y,p.z)?.t;if ((n!='b')&&(n!='r3')&&(n!='r2'))
          addTri(mh, x0+w,y0-h,z0-w, x0+w,y0+h,z0-w, x0+w,y0-h,z0+w, r0,g0,b0);
          //addTri(mh, x0+w,y0-h,z0+w, x0+w,y0-h,z0-w, x0+w,y0+h,z0-w ,r0,g0,b0);
    
      } else if (p.t=='r3') {
    
        n=et(p.x,p.y,p.z-1)?.t;if ((n!='b')&&(n!='r0')&&(n!='r3'))
          addTri(mh, x0-w,y0-h,z0-w, x0-w,y0+h,z0-w, x0+w,y0-h,z0-w, r0,g0,b0);
        n=et(p.x,p.y,p.z+1)?.t;if ((n!='b')&&(n!='r2')&&(n!='r3'))
          addTri(mh, x0-w,y0-h,z0+w, x0+w,y0-h,z0+w, x0-w,y0+h,z0+w, r0,g0,b0);
          //addTri(mh, x0-w,y0+h,z0+w, x0-w,y0-h,z0+w, x0+w,y0-h,z0+w, r0,g0,b0);
    
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
    if (mh&&mh.uv) ge.setAttribute('uv',new THREE.Float32BufferAttribute(mh.uv,2));
    ge.setIndex(mh?mh.index:[0,1,2 ,1,3,2 //,1,5,3, 5,7,3
    ]);
    ge.computeBoundingBox();
    ge.computeBoundingSphere();
    ge.computeVertexNormals();
    //ge.computeTangents();
    
    let mesh;
    //threeEnv.path='/shooter/';
    //threeSetMeshMaterial(mesh={diff:'objs/mapGen/d10.jpg',spec:'objs/mapGen/s1.jpg',norm:'objs/mapGen/n1.jpg'},{});//m2=mesh.material;//m0=
    
    //threeEnv.path='/shooter/objs/mapGen/';
    //threeSetMeshMaterial(mesh={diff:'d10.jpg',spec:'s1.jpg',norm:'n1.jpg'},{});//m2=mesh.material;//m0=
    
    threeEnv.path='/three/deep/deep8voxb/';
    threeSetMeshMaterial(mesh={diff:'blockSummerTexDiff.json',spec:'blockSummerTexSpec.json',norm:'blockSummerTex.json'},{});//m2=mesh.material;//m0=
    threeEnv.path='/shooter/';
    
    
    
    let m=new THREE.Mesh(ge,
      mesh.material//new THREE.MeshPhongMaterial({color:0x666666,flatShading:true,vertexColors:true})
      );
      
    //for (let sc of gps.sceneh.scaleCfg) sc.lint*=0.1;
      
    m.castShadow=true;
    m.receiveShadow=true;
    //onsole.log(m);
    m.updateMatrix();
    m.matrixAutoUpdate=false;
    return m;
    //...
  }
  return self;
}
)();
//fr o,0
//fr o,0,3
//fr p,30,2
