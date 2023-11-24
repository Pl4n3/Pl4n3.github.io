//--- bricks
var Bricks={};
(function (Bricks) {
  var version='1.356 ',stats,//FOLDORUPDATEVERSION
      brickts={},bricktc=0,
      camera,controls,scene,renderer,sel,mmode,mmenu,mtype,mmultisel,
      mpos,mdim,click,raycaster,//=new THREE.Raycaster(),
      sels=[],ms=[],
      without={mesh:1,light:1,fn:1},bricks=[],data,
      bw=20,sw=15,sw2=(sw-1)/2,bh=bw/2,grid={},//20,15
      multi=false,mvcol,loaderPs;
  
  //onsole.log('Brick Construction Tool, Version '+version);
  //---
  function animate() {
    
    requestAnimationFrame( animate );
    
    controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    if (stats) stats.update();
    
    render();
    
  }
  function meshAdd(ps) {
    
    mesh=new THREE.Mesh(ps.g,ps.m);
    //if (multi&&brick) mesh.position.set(0,0,0); else 
    var x=ps.x||0,y=ps.y||0,z=ps.z||0;
    var pos=loaderPs?loaderPs.pos:undefined;
    if (pos) { x+=pos.x;y+=pos.y;z+=pos.z; }
    
    mesh.position.set(x,y,z);
    if (loaderPs&&loaderPs.scale) mesh.scale.set(loaderPs.scale,loaderPs.scale,loaderPs.scale);
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    mesh.castShadow=true;
    mesh.receiveShadow=true;
    scene.add(mesh);
    return mesh;
    
    //...
  }
  function box(x,y,z,w,h,b,m,brick) {
    //mesh=new THREE.Mesh(new BrickGeometry(w,h,b,brick?brick.t:undefined),m);
    
    
    //mesh=new THREE.Mesh(brickGeometry(w,h,b,brick),m);
    //if (multi&&brick) mesh.position.set(0,0,0);
    //else mesh.position.set(x,y,z);
    //mesh.updateMatrix();
    //mesh.matrixAutoUpdate = false;
    //mesh.castShadow=true;
    //mesh.receiveShadow=true;
    //scene.add(mesh);
    //return mesh;
    
    if (multi&&brick) { x=0;y=0;z=0; }
    return meshAdd({g:brickGeometry(w,h,b,brick),m:m,x:x,y:y,z:z});
    
  }
  function box0(b,brh) {
    var bo=1,//0.5
        mesh;
    
    if (brh) {
      if (b.t!='light') brickGeometryAdd(brh,b.w*bw-bo,b.h*bh-bo,b.b*bw-bo,b);
    } else
      mesh=box(
      (b.x-sw2+(b.w-1)/2)*bw,
      -150+(bw*3/4)+(b.y+(b.h-1)/2)*bh,
      (b.z-sw2+(b.b-1)/2)*bw,
      b.w*bw-bo,b.h*bh-bo,b.b*bw-bo,multi?mvcol:ms[b.col],b);
    
    for (var xi=0;xi<b.w;xi++) for (var yi=0;yi<b.h;yi++) for (var zi=0;zi<b.b;zi++)
      grid[key(xi+b.x,yi+b.y,zi+b.z)]=1;
    b.mesh=mesh;
    if (b.t=='light') {
      if (mesh) mesh.castShadow=false;
      var l=new THREE.PointLight(0xffaa00,2,300);//l.position.set(b.x*bw,b.y*bh,b.z*bw);
      l.castShadow=true;
      l.shadow.camera.near=10;
      l.shadow.camera.far=1000;
      l.shadow.mapSize.width=1024;//2048;
      l.shadow.mapSize.height=1024;
      //l.shadow.bias=0.01;
      scene.add(l);b.light=l;
    }
    return mesh;
  }
  
  function brickGeometryFinish(h) {
    
    var br=new THREE.BufferGeometry(),f=1;
    br.parameters = { width:h.width*f,height:h.height*f,depth:h.depth*f };
    br.setIndex(h.indices);
    br.setAttribute('position',new THREE.Float32BufferAttribute(h.vertices,3));
    br.setAttribute('color',new THREE.Float32BufferAttribute(h.colors,3));
    br.setAttribute('normal',new THREE.Float32BufferAttribute(h.normals,3));
    br.setAttribute('uv',new THREE.Float32BufferAttribute(h.uvs,2));
    return br;
    
    //...
  }
  function brickGeometryAdd(brh,width,height,depth,brick) {
    
    var t=brick?brick.t:undefined;
    
    
    //br.type='BrickGeometry';
    var b=brick,bx=0,by=0,bz=0;
    if (multi&&b) {
      bx=(b.x-sw2+(b.w-1)/2)*bw;
      by=-150+(bw*3/4)+(b.y+(b.h-1)/2)*bh;
      bz=(b.z-sw2+(b.b-1)/2)*bw;
    }
    
    
    
    //var br=new THREE.BufferGeometry();
    //br.parameters = { width:width,height:height,depth:depth };
    
    //var scope=br;
    // buffers
    
    //var brh={};
    if (!brh.indices) { 
      brh.width=width;brh.height=height;brh.depth=depth;
      brh.indices=[];brh.vertices=[];brh.normals=[];brh.uvs=[];brh.colors=[]; }
    
    //var indices = [];
    //var vertices = [];
    //var normals = [];
    //var uvs = [];
    //var colors = [];
    
    // helper variables
    
    //var numberOfVertices = 0;
    //var groupStart = 0;
    
    // build each side of the box geometry
    var w=width,h=height,d=depth,a,mx,mz,xz,
        roofpa=[[-100,-60,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[100,-100,100,0.4688,0.4108],[100,-60,100,0.4688,0.3801],[-100,-100,-100,0.1563,0.3676],[-100,100,-100,0.1563,0.2142],[100,-100,-100,0.355,0.3096],[100,100,-100,0.355,0.1563],[100,100,0,0.4119,0.2068],[-100,100,0,0.2131,0.2648],[100,100,-100,0.355,0.1563],[-100,100,-100,0.1563,0.2142],[-100,100,0,0.2131,0.2648],[100,100,0,0.4119,0.2068],[-100,-60,100,0.27,0.4381],[100,-60,100,0.4688,0.3801],[-100,-100,100,0.27,0.4688],[100,-100,100,0.4688,0.4108],[-100,-100,-100,0.1563,0.3676],[100,-100,-100,0.355,0.3096],[100,100,0,0.4119,0.2068],[100,100,-100,0.355,0.1563],[100,-60,100,0.4688,0.3801],[100,-100,100,0.4688,0.4108],[100,-100,-100,0.355,0.3096],[-100,100,-100,0.1563,0.2142],[-100,100,0,0.2131,0.2648],[-100,-60,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[-100,-100,-100,0.1563,0.3676]],
        rooffa=[[0,2,1],[2,0,3],[7,4,6],[4,7,5],[11,8,9],[8,11,10],[12,15,14],[15,12,13],[16,19,18],[19,16,17],[22,24,23],[24,22,20],[21,24,20],[27,29,26],[29,27,28],[25,26,29]],
        roof=[roofpa,rooffa],
        roofTop=[[[-100,-60,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[100,-100,100,0.4688,0.4108],[100,-60,100,0.4688,0.3801],[-100,-60,-100,0.1563,0.2142],[100,-60,-100,0.355,0.1563],[100,70,-20,0.4119,0.2068],[-100,70,-20,0.2131,0.2648],[100,-60,-100,0.355,0.1563],[-100,-60,-100,0.1563,0.2142],[-100,70,20,0.2131,0.2648],[100,70,20,0.4119,0.2068],[-100,-60,100,0.27,0.4381],[100,-60,100,0.4688,0.3801],[-100,-100,100,0.27,0.4688],[100,-100,100,0.4688,0.4108],[100,70,-20,0.4119,0.2068],[100,-100,-100,0.355,0.1563],[100,-60,100,0.4688,0.3801],[100,-100,100,0.4688,0.4108],[-100,-100,-100,0.1563,0.2142],[-100,70,-20,0.2131,0.2648],[-100,-60,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[100,70,20,0.5,0.5],[-100,70,20,0.5,0.5],[100,-100,-100,0.5,0.5],[-100,-100,-100,0.5,0.5],[-100,-60,-100,0.5,0.5],[-100,-100,-100,0.5,0.5],[-100,70,-20,0.5,0.5],[-100,70,20,0.5,0.5],[100,70,20,0.5,0.5],[100,70,-20,0.5,0.5],[100,-60,-100,0.5,0.5],[100,-100,-100,0.5,0.5]],
                [[0,2,1],[2,0,3],[9,6,7],[6,9,8],[10,13,12],[13,10,11],[5,20,17],[20,5,4],[16,25,21],[25,16,24],[27,19,26],[19,27,23],[30,22,28],[22,30,31],[28,14,29],[14,28,22],[32,34,18],[34,32,33],[18,35,15],[35,18,34]]],
        roofA=[[[-100,-60,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[100,-100,100,0.4688,0.4108],[100,-60,100,0.4688,0.3801],[-100,-100,-100,0.1563,0.3676],[-100,100,-100,0.1563,0.2142],[100,-60,-100,0.355,0.3096],[0,100,-100,0.355,0.1563],[0,100,0,0.4119,0.2068],[-100,100,0,0.2131,0.2648],[0,100,-100,0.355,0.1563],[-100,100,-100,0.1563,0.2142],[-100,100,0,0.2131,0.2648],[0,100,0,0.4119,0.2068],[-100,-60,100,0.27,0.4381],[100,-60,100,0.4688,0.3801],[-100,-100,100,0.27,0.4688],[100,-100,100,0.4688,0.4108],[-100,-100,-100,0.1563,0.3676],[100,-100,-100,0.355,0.3096],[0,100,0,0.4119,0.2068],[0,100,-100,0.355,0.1563],[100,-60,100,0.4688,0.3801],[100,-100,100,0.4688,0.4108],[100,-60,-100,0.355,0.3096],[-100,100,-100,0.1563,0.2142],[-100,100,0,0.2131,0.2648],[-100,-60,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[-100,-100,-100,0.1563,0.3676],[100,-100,-100,0.5,0.5],[100,-60,100,0.5,0.5],[100,-60,-100,0.5,0.5],[100,-100,-100,0.5,0.5]],
               [[0,2,1],[2,0,3],[7,4,6],[4,7,5],[11,8,9],[8,11,10],[12,15,14],[15,12,13],[16,19,18],[19,16,17],[24,22,20],[21,24,20],[27,29,26],[29,27,28],[25,26,29],[6,4,30],[31,33,23],[33,31,32]]],
        roofNook=[[[-100,-60,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[100,-100,100,0.4688,0.4108],[0,100,100,0.4688,0.3801],[-100,-100,-100,0.1563,0.3676],[-100,100,-100,0.1563,0.2142],[100,-100,-100,0.355,0.3096],[100,100,-100,0.355,0.1563],[100,100,100,0.4119,0.2068],[-100,100,0,0.2131,0.2648],[100,100,-100,0.355,0.1563],[-100,100,-100,0.1563,0.2142],[-100,100,0,0.2131,0.2648],[0,100,0,0.4119,0.2068],[-100,-60,100,0.27,0.4381],[0,100,100,0.4688,0.3801],[-100,-100,100,0.27,0.4688],[100,-100,100,0.4688,0.4108],[-100,-100,-100,0.1563,0.3676],[100,-100,-100,0.355,0.3096],[100,100,100,0.4119,0.2068],[100,100,-100,0.355,0.1563],[100,-100,100,0.4688,0.3801],[100,-100,-100,0.355,0.3096],[-100,100,-100,0.1563,0.2142],[-100,100,0,0.2131,0.2648],[-100,-60,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[-100,-100,-100,0.1563,0.3676],[-100,-60,100,0.5,0.5],[0,100,0,0.5,0.5],[100,100,100,0.5,0.5],[0,100,0,0.5,0.5],[0,100,100,0.5,0.5]],
               [[0,2,1],[2,0,3],[7,4,6],[4,7,5],[16,19,18],[19,16,17],[23,22,20],[21,23,20],[26,28,25],[28,26,27],[24,25,28],[12,13,14],[30,15,29],[3,31,2],[32,8,33],[8,32,10],[32,11,10],[11,32,9]]],
        roofNookTop=[[[-100,-60,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[100,-60,100,0.4688,0.4108],[-20,70,100,0.4688,0.3801],[-100,-60,-100,0.1563,0.3676],[-100,70,-20,0.1563,0.2142],[100,-60,-100,0.355,0.3096],[20,70,-20,0.355,0.1563],[20,70,100,0.4119,0.2068],[-100,70,20,0.2131,0.2648],[20,70,-20,0.355,0.1563],[-100,70,-20,0.1563,0.2142],[-100,70,20,0.2131,0.2648],[-20,70,20,0.4119,0.2068],[-100,-60,100,0.27,0.4381],[-20,70,100,0.4688,0.3801],[-100,-100,100,0.27,0.4688],[100,-100,100,0.4688,0.4108],[-100,-100,-100,0.1563,0.3676],[100,-100,-100,0.355,0.3096],[20,70,100,0.4119,0.2068],[20,70,-20,0.355,0.1563],[100,-60,100,0.4688,0.3801],[100,-60,-100,0.355,0.3096],[-100,70,-20,0.1563,0.2142],[-100,70,20,0.2131,0.2648],[-100,-60,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[-100,-60,-100,0.1563,0.3676],[-100,-60,100,0.5,0.5],[-20,70,20,0.5,0.5],[20,70,100,0.5,0.5],[-20,70,20,0.5,0.5],[-20,70,100,0.5,0.5],[100,-100,100,0.5,0.5],[-100,-100,-100,0.5,0.5],[100,-60,100,0.5,0.5],[100,-60,-100,0.5,0.5],[100,-100,100,0.5,0.5],[100,-100,-100,0.5,0.5],[100,-60,-100,0.5,0.5],[-100,-60,-100,0.5,0.5],[100,-100,-100,0.5,0.5],[-100,-100,-100,0.5,0.5]],
               [[0,2,1],[2,0,3],[7,4,6],[4,7,5],[16,19,18],[19,16,17],[23,22,20],[21,23,20],[26,28,25],[28,26,27],[24,25,28],[12,13,14],[30,15,29],[3,31,2],[32,8,33],[8,32,10],[32,11,10],[11,32,9],[1,2,34],[28,27,35],[36,39,38],[39,36,37],[40,43,42],[43,40,41]]],
        roofTopLean=[[[-100,-60,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[0,-100,100,0.4688,0.4108],[0,-60,100,0.4688,0.3801],[-100,-60,-100,0.1563,0.2142],[0,-60,-100,0.355,0.1563],[83,70,-20,0.4119,0.2068],[-100,70,-20,0.2131,0.2648],[0,-60,-100,0.355,0.1563],[-100,-60,-100,0.1563,0.2142],[-100,70,20,0.2131,0.2648],[83,70,20,0.4119,0.2068],[-100,-60,100,0.27,0.4381],[0,-60,100,0.4688,0.3801],[-100,-100,100,0.27,0.4688],[0,-100,100,0.4688,0.4108],[83,70,-20,0.4119,0.2068],[0,-100,-100,0.355,0.1563],[0,-60,100,0.4688,0.3801],[0,-100,100,0.4688,0.4108],[-100,-100,-100,0.1563,0.2142],[-100,70,-20,0.2131,0.2648],[-100,-60,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[83,70,20,0.5,0.5],[-100,70,20,0.5,0.5],[0,-100,-100,0.5,0.5],[-100,-100,-100,0.5,0.5],[-100,-60,-100,0.5,0.5],[-100,-100,-100,0.5,0.5],[-100,70,-20,0.5,0.5],[-100,70,20,0.5,0.5],[83,70,20,0.5,0.5],[83,70,-20,0.5,0.5],[0,-60,-100,0.5,0.5],[0,-100,-100,0.5,0.5],[0,-60,100,0.5,0.5],[0,-60,-100,0.5,0.5]],
               [[0,2,1],[2,0,3],[9,6,7],[6,9,8],[10,13,12],[13,10,11],[5,20,17],[20,5,4],[16,25,21],[25,16,24],[27,19,26],[19,27,23],[30,22,28],[22,30,31],[28,14,29],[14,28,22],[32,34,18],[34,32,33],[36,35,15],[35,36,37]]],
        ramp=[[[-100,-80,120,0.27,0.4381],[-100,-120,80,0.27,0.4688],[100,-120,80,0.4688,0.4108],[100,-80,120,0.4688,0.3801],[-100,-20,-20,0.1563,0.3676],[-100,80,-120,0.1563,0.2142],[100,-20,-20,0.355,0.3096],[100,80,-120,0.355,0.1563],[100,120,-80,0.4119,0.2068],[-100,120,-80,0.2131,0.2648],[100,80,-120,0.355,0.1563],[-100,80,-120,0.1563,0.2142],[-100,120,-80,0.2131,0.2648],[100,120,-80,0.4119,0.2068],[-100,-80,120,0.27,0.4381],[100,-80,120,0.4688,0.3801],[-100,-120,80,0.27,0.4688],[100,-120,80,0.4688,0.4108],[-100,-20,-20,0.1563,0.3676],[100,-20,-20,0.355,0.3096],[100,120,-80,0.4119,0.2068],[100,80,-120,0.355,0.1563],[100,-80,120,0.4688,0.3801],[100,-120,80,0.4688,0.4108],[100,-20,-20,0.355,0.3096],[-100,80,-120,0.1563,0.2142],[-100,120,-80,0.2131,0.2648],[-100,-80,120,0.27,0.4381],[-100,-120,80,0.27,0.4688],[-100,-20,-20,0.1563,0.3676]],
               [[0,2,1],[2,0,3],[7,4,6],[4,7,5],[11,8,9],[8,11,10],[12,15,14],[15,12,13],[16,19,18],[19,16,17],[22,24,23],[24,22,20],[21,24,20],[27,29,26],[29,27,28],[25,26,29]]];
    
    if (t) {
      var tr=t.substr(0,t.length-1),th=brickts[tr];
      if (th) {
        a=th.a;//brickts[tr]; 
        //if (a) {
        var c=parseInt(t.substr(t.length-1,1));
        if (c==1) mz=true; else if (c==2) { xz=true; } else if (c==3) { xz=true;mx=true; } 
        else if (c==4) { xz=true;mz=true;mx=true; }
      }
    }           
    if (a) {} else
    if (t=='roofTop0') a=roofTop; else
    if (t=='roofTop1') { a=roofTop;xz=true; } else
    if (t=='roof0') { a=roof; } else 
    if (t=='roof1') { a=roof;mz=true; } else 
    if (t=='roof2') { a=roof;xz=true; } else 
    if (t=='roof3') { a=roof;xz=true;mx=true; } else 
    if (t=='roofCant0') { a=roofA; } else 
    if (t=='roofCant1') { a=roofA;mz=true; } else 
    if (t=='roofCant2') { a=roofA;xz=true; } else 
    if (t=='roofCant3') { a=roofA;xz=true;mx=true; } else 
    if (t=='roofNook0') { a=roofNook; } else 
    if (t=='roofNook1') { a=roofNook;mz=true; } else 
    if (t=='roofNook2') { a=roofNook;xz=true; } else 
    if (t=='roofNook3') { a=roofNook;mx=true; } else 
    if (t=='roofNookTop0') { a=roofNookTop; } else 
    if (t=='roofNookTop1') { a=roofNookTop;mz=true; } else 
    if (t=='roofNookTop2') { a=roofNookTop;xz=true; } else 
    if (t=='roofNookTop3') { a=roofNookTop;mx=true; } else 
    if (t=='roofTopLean0') { a=roofTopLean; } else 
    if (t=='roofTopLean1') { a=roofTopLean;mz=true; } else 
    if (t=='roofTopLean2') { a=roofTopLean;xz=true; } else 
    if (t=='roofTopLean3') { a=roofTopLean;xz=true;mz=true; } else 
    if (t=='ramp0') { a=ramp; } else 
    if (t=='ramp1') { a=ramp;mz=true; } else 
    if (t=='ramp2') { a=ramp;xz=true; } else 
    if (t=='ramp3') { a=ramp;xz=true;mx=true; } else 
    {
      a=[[[-100,100,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[100,-100,100,0.4688,0.4108],[100,100,100,0.4688,0.3801],[-100,-100,-100,0.1563,0.3676],[-100,100,-100,0.1563,0.2142],[100,-100,-100,0.355,0.3096],[100,100,-100,0.355,0.1563],[100,100,-100,0.355,0.1563],[-100,100,-100,0.1563,0.2142],[-100,100,100,0.27,0.4381],[100,100,100,0.4688,0.3801],[-100,-100,100,0.27,0.4688],[100,-100,100,0.4688,0.4108],[-100,-100,-100,0.1563,0.3676],[100,-100,-100,0.355,0.3096],[100,100,-100,0.355,0.1563],[100,100,100,0.4688,0.3801],[100,-100,100,0.4688,0.4108],[100,-100,-100,0.355,0.3096],[-100,100,-100,0.1563,0.2142],[-100,100,100,0.27,0.4381],[-100,-100,100,0.27,0.4688],[-100,-100,-100,0.1563,0.3676]],
         [[0,2,1],[2,0,3],[7,4,6],[4,7,5],[12,15,14],[15,12,13],[17,19,18],[23,21,22],[10,16,11],[16,10,20],[17,8,19],[9,21,23]]];
    }
    
    var pa=a[0],fa=a[1];
    
    var cr=0.5,cg=0.5,cb=0;
    
    if (brick&&data.colors) {
      var c=data.colors[brick.col];
      cr=((c>>16)&0xff)*1.0/0xff;
      cg=((c>>8)&0xff)*1.0/0xff;
      cb=((c>>0)&0xff)*1.0/0xff;
      //console.log('brickGeometryAdd colors='+c+' '+cr+' '+cg+' '+cb+' '+(c&0xff));
    }
    
    //cr=Math.random();cg=Math.random();cb=Math.random();
    
    var vl0=brh.vertices.length/3;
    for (var i=0;i<pa.length;i++) { var p=pa[i];
      var x=(mx?-1:1)*(xz?p[2]:p[0]),
          y=p[1],
          z=(mz?-1:1)*(xz?p[0]:p[2]);
      brh.vertices.push(bx+x*w/200,by+y*h/200,bz+z*d/200);brh.normals.push(0,0,1);brh.uvs.push(p[3],p[4]); 
      brh.colors.push(cr,cg,cb);
    }
    for (var i=0;i<fa.length;i++) { var f=fa[i];
      if ((mz&&!xz)||(xz&&!mx&&!mz)||(mx&&!xz)||(xz&&mx&&mz)) brh.indices.push(vl0+f[0],vl0+f[1],vl0+f[2]); else brh.indices.push(vl0+f[0],vl0+f[2],vl0+f[1]); 
    }
    //groupCount=indices.length;
    //scope.addGroup( groupStart, groupCount, 0 );
    //groupStart += groupCount;
    
    
    //var br=new THREE.BufferGeometry();
    //br.parameters = { width:width,height:height,depth:depth };
    //br.setIndex(indices);
    //br.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
    //br.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
    //br.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
    //br.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
    //return br;
    //return brickGeometryFinish(brh);
    
  }
  function brickGeometry(width,height,depth,brick) {
    var brh={};
    brickGeometryAdd(brh,width,height,depth,brick);
    return brickGeometryFinish(brh);
    //...
  }
  
  function brickPos(b,rand) {
    var xh,yh,zh;
    
    xh=(b.x-sw2+(b.w-1)/2)*bw+(Math.random()-0.5)*rand;
    yh=-150+(bw*3/4)+(b.y+(b.h-1)/2)*bh+(Math.random()-0.5)*rand;
    zh=(b.z-sw2+(b.b-1)/2)*bw+(Math.random()-0.5)*rand;
    
    
    if (!multi) {
      //if (!b.mesh) return;
      b.mesh.position.set(xh,yh,zh);
      //console.log('lego.brickpos b.z='+b.z+' sw2='+sw2+' b.b='+b.b+' bw='+bw+' zh='+zh);
      //console.log(b.mesh.position);
      b.mesh.updateMatrix();
    }
    if (b.light) {
      b.light.position.set(xh,yh,zh);
      //Conet.log('set light pos '+xh+' '+yh+' '+zh);
    }
    //...
  }
  function brickRemove(b) {
    if (b.mesh) scene.remove(b.mesh);
    if (b.light) scene.remove(b.light);
    //...
  }
  function clear() {
    for (var i=0;i<bricks.length;i++) brickRemove(bricks[i]);
    bricks.length=0;
    brickts={};bricktc=0;
    //...
  }
  function cloneWithout(o,h) {
    var n={};
    for (var k in o) if (o.hasOwnProperty(k)) if (!h[k]) n[k]=o[k];
    return n;
  }
  function diff(o0,o1) {
    //returns all fields from o1, that are different in o0
    var r={}
    for (var k in o1) if (o1.hasOwnProperty(k)&&(o1[k]!=o0[k])) r[k]=o1[k];
    return r;
  }
  function legoGenMaze() {
    clear();bricks=[];
    if (0) 
    for (var z=0;z<5;z++) for (var y=0;y<5;y++) for (var x=0;x<5;x++) {
      var r=rani(5),b;
      box0(b={"x":x*2+2,"y":y*3,t:r==4?'box':'ramp'+r,"z":8+z*2-5,"w":2,"b":2,"h":3,"col":0});
      bricks.push(b);brickPos(b,0);sel=b;
    }
    //var b;
    //box0(b={"x":8,"y":0,"t":"block","z":8,"w":2,"b":2,"h":3,"col":0});bricks.push(b);brickPos(b,0);sel=b;
    //box0(b={"x":6,"y":0,"t":"block","z":8,"w":2,"b":2,"h":3,"col":0});bricks.push(b);brickPos(b,0);sel=b;
    
    var world=genMaze();
    //console.log('world.ways.len='+world.ways.length);
    //console.log(world.ways);
    for (var z=-10;z<10;z++) for (var y=0;y<10;y++) for (var x=-10;x<10;x++) {
      var t=world.map[x+'_'+y+'_'+z];//et(x,y,z);
      if (!t) continue;
      var light=(x==0)&&(y==0)&&(z==0);
      var isway=false;for (i=world.ways.length-1;i>=0;i--) {
        var w=world.ways[i];if ((x==w.x)&&(y==w.y)&&(z==w.z)) { isway=true;break; }
      }
      box0(b={"x":x*2+6.5,"y":y*3+(((t==1))?2:0),t:light?'light':(t==1?'box':'ramp'+(t-2)),"z":z*2+6.5,"w":2,"b":2,"h":t==1?1:3,"col":light?2:(isway?1:0)});
      bricks.push(b);brickPos(b,0);sel=b;
    }
    
    
    //...
  }
  function isfree(x,y,z,w,h,b) {
    if (y<0) return false;
    for (var xi=0;xi<w;xi++) for (var yi=0;yi<h;yi++) for (var zi=0;zi<b;zi++)
      if (grid[key(xi+x,yi+y,zi+z)]) return false;
    return true;
  }
  function key(x,y,z) {
    return x+'_'+y+'_'+z;
  }
  function menuArrow() {
    //if (mmode.ms=='Select') {
    //  brickPos(sel,0);
    //  var i=bricks.indexOf(sel),l=bricks.length;
    //  if (this.s=='\u2192') sel=bricks[(i+1)%l];
    //  if (this.s=='\u2190') sel=bricks[(i-1+l)%l];
    //  if (this.s=='\u2191') sel=bricks[(i+10)%l];
    //  if (this.s=='\u2193') sel=bricks[(i-Math.min(l,10)+l)%l];
    //  
    //  return;
    //}
    var rot=camera.rotation;
    //console.log(rot.y+' '+rot.z);
    var a=Math.floor((4*controls.getAzimuthalAngle()/Math.PI)+4);
    a=Math.floor(((a+7)%8)/2);
    //var b=((a>=-0.25)&&(a<=0.25))?0:1;
    //onsole.log(controls.getAzimuthalAngle());
    
    //onsole.log(a);
    
    var dx=0,dy=0,dz=0,f=0;
    
    if (this.s=='\u2192') { f=1;if (a==0) dz=1; else if (a==1) dx=1; else if (a==2) dz=-1; else dx=-1; }
    if (this.s=='\u2190') { f=2;if (a==0) dz=-1; else if (a==1) dx=-1; else if (a==2) dz=1; else dx=1;  }
    if (this.s=='\u2191') { f=3;if (a==0) dx=1; else if (a==1) dz=-1; else if (a==2) dx=-1; else dz=1; } //dz=-1;
    if (this.s=='\u2193') { f=4;if (a==0) dx=-1; else if (a==1) dz=1; else if (a==2) dx=1; else dz=-1; } //dz=1;
    if (this.s=='\u21d1') { f=5;dy=1; }
    if (this.s=='\u21d3') { f=6;dy=-1; }
    
    Conet.beep({vol:0.5,freq:300+f*50});
    
    
    for (var j=sels.length-1;j>=0;j--) {
    var b=sels[j];
    
    if (mdim.checked) {//mmode.ms=='Dimension') {
      b.w+=dx;b.b+=dz;b.h+=dy;
      //if (this.s=='\u2192') b.w++;
      //if (this.s=='\u2190') b.w--;
      //if (this.s=='\u2191') b.b--;
      //if (this.s=='\u2193') b.b++;
      //if (this.s=='\u21d1') b.h++;
      //if (this.s=='\u21d3') b.h--;
      //scene.remove(b.mesh);
      //if (b.light) scene.remove(b.light);
      brickRemove(b);
      box0(b);
      return;
    }
    
    b.x+=dx;b.y+=dy;b.z+=dz;
    //if (this.s=='\u2192') { if (a==0) b.z++; else if (a==1) b.x++; else if (a==2) b.z--; else b.x--; }
    //if (this.s=='\u2190') { if (a==0) b.z--; else if (a==1) b.x--; else if (a==2) b.z++; else b.x++;  }
    //if (this.s=='\u2191') b.z--;
    //if (this.s=='\u2193') b.z++;
    //if (this.s=='\u21d1') b.y++;
    //if (this.s=='\u21d3') b.y--;
    }
    
    //Conet.beep({vol:0.5});
  }
  function menuInit() {
    var url=Conet.parseUrl(document.URL);
    
    if (url.gen) setTimeout(legoGenMaze,500);
    
    var c=document.createElement('div');ccol=c;
    c.innerHTML='<input type="color" value="#e66465"></input>"';
    
    //Menu.colBg='rgba(150,150,150,0.2)';
    Menu.cpy=0.07;
    var loadMs=false;
    var cfm=Conet.fileMenu({fn:'lego/files.txt',defFn:'lego/test0.txt',noStartLoad:url.data||url.gen,loadMs:loadMs,
    loadf:function(v) {
      Conet.download({fn:v+'?1',f:parseLoad});
    }
    ,savef:function(v) {
      Conet.upload({fn:v,data:serialize(),f:function(d) {
        Conet.log(d===''?'Conet.save error.':'Conet.saved: '+v+'.');
      }
      });
    }
    });
    
    cfm.sub.push(
    
    {s:'Export',ms:'Import',doctrl:'Brick data',mcfs:0.07,okS:'Import',cancelS:'Close',ta:true,wrap:1,tacols:50,tarows:20,setfunc:function(v,initLoad) {
      //tridata=v.length==0?undefined:JSON.parse(v);
      parseLoad(v);
    }
    ,valuef:function() {
      var r=serialize();
      Conet.log('Data: '+r.length+' bytes');
      return r;
    }
    },
    
    {s:'Export',ms:'to URL',actionf:function() {
      var durl=document.URL,i=durl.indexOf('?');
      if (i!=-1) durl=durl.substr(0,i+1); else durl+='?';
      window.open(durl+'data='+btoa(serialize()),'Url Export');
    }
    },
    
    );
    
    Menu.init([mmenu={s:'Menu',ms:'Version '+version,msid:'mmenums',sub:
    
    (loadMs?cfm.sub:[cfm]).concat([
    
    {s:'ColorIndex',r:1,actionf:function() {
      var col=(sel.col+1)%ms.length;
      
      for (var se of sels) {
        se.col=col;
        //onet.log('color set:'+sel.col);
        brickRemove(se);
        box0(se);
      }
      
      Conet.log('Color set: '+col+' to '+sels.length+' bricks.');
      
      Conet.beep();
      
    }
    },
    
    {s:'Color',doctrl:'Pick color',color:1,_value:'#1f5f7f',oninput:function(v) {
      var col='0x'+v.substr(1);
      var mat=ms[sel.col];
      mat.color.set(parseInt(col));
      mat.userData.scol=col;
      //data.colors[sel.col]=col;
      //mat.needsUpdate=true;
      //console.log(parseInt(col));
    }
    ,valuef:function() {
      if (!sel) { log('Select brick first.');return undefined; }
      return '#'+data.colors[sel.col].substr(2);
    }
    },
    
    mtype={s:'Type',ms:'block',msid:'mtype',r:1,autoval:2,sub:[{s:'block'}
      ,{s:'roof',sub:[{s:'0',a:'roof0'},{s:'1',a:'roof1'},{s:'2',a:'roof2'},{s:'3',a:'roof3'}]}
      ,{s:'roofTop',sub:[{s:'0',a:'roofTop0'},{s:'1',a:'roofTop1'}]}
      ,{s:'roofCant',sub:[{s:'0',a:'roofCant0'},{s:'1',a:'roofCant1'},{s:'2',a:'roofCant2'},{s:'3',a:'roofCant3'}]}
      ,{s:'roofNook',sub:[{s:'0',a:'roofNook0'},{s:'1',a:'roofNook1'},{s:'2',a:'roofNook2'},{s:'3',a:'roofNook3'}]}
      ,{s:'roofNookTop',sub:[{s:'0',a:'roofNookTop0'},{s:'1',a:'roofNookTop1'},{s:'2',a:'roofNookTop2'},{s:'3',a:'roofNookTop3'}]}
      ,{s:'roofTopLean',sub:[{s:'0',a:'roofTopLean0'},{s:'1',a:'roofTopLean1'},{s:'2',a:'roofTopLean2'},{s:'3',a:'roofTopLean3'}]}
      ,{s:'light'}
      ,{s:'ramp',sub:[{s:'0',a:'ramp0'},{s:'1',a:'ramp1'},{s:'2',a:'ramp2'},{s:'3',a:'ramp3'}]}
      ,{s:'rotate'}
      ]
    ,setfunc:function(a) {
      if (a=='rotate') {
        var t=sel.t,tr=t.substr(0,t.length-1),
            n=parseInt(t.substr(t.length-1));
        sel.t=tr+(n+1)%5;
        //Menu.ms(mtype,sel.t);
        mtype.ms=sel.t;
      } else
        sel.t=a;
      scene.remove(sel.mesh);
      box0(sel);
    }
    },
    
    
    {s:'New Brick',r:1,keys:[78],ms:'key: n',actionf:function() {
      //brickPos(sel,0);
      var b=cloneWithout(sel,without);//{x:sel.x,y:sel.y,z:sel.z,w:sel.w,h:sel.h,b:sel.b,col:sel.col};
      box0(b);bricks.push(b);
      select(b);
      //sel=b;
      Menu.ms(mmenu,bricks.length+' bricks');
      if (mdim.checked) mpos.actionf();
    }
    },
    
    
    {s:'Del Brick',r:1,keys:[46],ms:'key: del',actionf:function() {
      if (bricks.length<2) return;
      var i=bricks.indexOf(sel);
      scene.remove(sel.mesh);
      bricks.splice(i,1);
      if (i==bricks.length) i--;
      sel=bricks[i];
      Menu.ms(mmenu,bricks.length+' bricks');
    }
    },
    
    {s:'Config',ms:'Version '+version,sub:[
    
    mmultisel={s:Menu.soff,ms:'multi select',checkbox:1,r:1},
    
    {ms:'multi mesh',checkbox:1,checked:multi,
    actionf:function() {
      //onsole.log(this.checked);
      multi=this.checked;
    }
    }
    
    
    ]},
    
    {s:'Rotate',actionf:function() {
      controls.autoRotate=!controls.autoRotate;//...
    }
    },
    
    {s:'Clear',actionf:clear},
    {s:'Generate',ms:'amazing maze',r:1,actionf:legoGenMaze}
    ])},
    
    
    
    
    //mmode={s:'Mode',ms:'Position',autoval:2,sub:[{s:'Position',r:1},{s:'Dimension',r:1},{s:'Select',r:1}]},
    {s:'\u2190',px:0.02,py:0.02,pw:0.116,ph:0.116,ydown:true,fs:1.4,actionf:menuArrow},
    {s:'\u2192',px:0.13,py:0.02,pw:0.116,ph:0.116,ydown:true,fs:1.4,actionf:menuArrow},
    {s:'\u2191',px:0.13,py:0.13,pw:0.116,ph:0.116,ydown:true,fs:1.4,actionf:menuArrow},
    {s:'\u2193',px:0.02,py:0.13,pw:0.116,ph:0.116,ydown:true,fs:1.4,actionf:menuArrow},
    {s:'\u21d1',px:0.13,py:0.24,pw:0.116,ph:0.116,ydown:true,fs:1.4,actionf:menuArrow},
    {s:'\u21d3',px:0.02,py:0.24,pw:0.116,ph:0.116,ydown:true,fs:1.4,actionf:menuArrow},
    mdim={s:Menu.soff,px:0.13,py:0.35,pw:0.116,ph:0.116,ydown:true,fs:1.4,checkbox:1,ms:'Dimension',mfs:1.5,msCenter:1,mstop:4,
    actionf:function() {
      //onet.log('mdim.actionf');
      Menu.setChecked(mpos,0);
      Menu.setChecked(mdim,1);
    }
    },
    mpos={s:Menu.son ,px:0.02,py:0.35,pw:0.116,ph:0.116,ydown:true,fs:1.4,checkbox:1,ms:'Position',checked:1,mfs:1.5,msCenter:1,mstop:4,
    actionf:function() {
      //onet.log('mpos.actionf');
      Menu.setChecked(mdim,0);//...
      Menu.setChecked(mpos,1);
    }
    }
    
    
    ],{listen:1,_keyLog:1});
    
    if (url.data) parseLoad(atob(url.data));
    //...
  }
  function onClick(e) {
    click=new THREE.Vector2(2*e.clientX/window.innerWidth-1,-2*e.clientY/window.innerHeight+1);
    //console.log(click);
  }
  function onWindowResize() {
    
    Menu.draw();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    
  }
  function loadFinish() {
    var bl,brh=0?undefined:(multi?{}:undefined);
    for (var i=0;i<bricks.length;i++) {
      var b=bricks[i];
      if (bl) for (var k in bl) if (bl.hasOwnProperty(k)) if (!without[k])
        if (b[k]===undefined) b[k]=bl[k];
      if (!b.t) b.t='block';
      box0(b,brh);//.x,b.y,b.z,b.w,b.h,b.b,ms[b.col]);
      //if (!multi) 
      brickPos(b,0);
      sel=b;bl=b;
    }
    if (brh) bricks[0].mesh=meshAdd({g:brickGeometryFinish(brh),m:mvcol});
    if (!loaderPs) Menu.ms(mmenu,bricks.length+' bricks');
    //...
  }
  function brickLoaded(v) {
    var o=JSON.parse(v),
        a=[o.pa,o.meshes[0].fa];
    console.log('brickLoaded ');
    var t=this.bt;
    //t=t.substr(0,t.length-1);
    brickts[t]={a:a,fn:this.fn};
    bricktc--;
    if (bricktc==0) loadFinish();
    //onsole.log(t);
  }
  function parseLoad(d) {
    clear();
    var o=JSON.parse(d);
    if (Array.isArray(o)) 
      bricks=o;
    else {
      bricks=o.bricks;data=o;
      if (o.bricktypes) for (var k in o.bricktypes) if (o.bricktypes.hasOwnProperty(k)) {
        bricktc++;
        Conet.download({bt:k,fn:o.bricktypes[k],f:brickLoaded});
      }
      if (o.colors) {
        ms=[];ms.own=1;
        for (var i=0;i<o.colors.length;i++) {
          var m=new THREE.MeshPhongMaterial({color:parseInt(o.colors[i]),flatShading:true,
            //vertexColors:multi?THREE.VertexColors:undefined
            });
          m.userData.scol=o.colors[i];
          ms.push(m);
        }
      }
    }
    
    //for (var i=0;i<bricks.length;i++) {
    //  var b=bricks[i];
    //  if (!b.fn) continue;
    //  bricktc++;
    //  Conet.download({bt:b.t,fn:b.fn,f:brickLoaded});
    //  //console.log(b.fn);
    //}
    
    if (bricktc>0) return;
    loadFinish();
  }
  function rani(m) {
    return Math.floor(Math.random()*m);
  }
  function render() {
    //var b=sel;if (b) brickPos(b,3);
    //for (var i=sels.length-1;i>=0;i--) brickPos(sels[i],3);
    
    if (click) {
      raycaster.setFromCamera(click,camera);
      var intersects=raycaster.intersectObjects(scene.children);
      click=undefined;
      if (intersects.length>0) {
        //Conet.log('render intersects='+intersects.length);
        for (var j=0;j<(
         //mmultisel.checked?intersects.length:
         1);j++) {
         var o=intersects[j].object;
         for (var i=bricks.length-1;i>=0;i--) {
          var b=bricks[i];
          if (b.mesh!=o) continue;
          select(b,mmultisel.checked);
          //brickPos(sel,0);
          //sel=b;Menu.ms(mtype,sel.t);
          break;
         }
        }
      }
    }
    //---
    renderer.render( scene, camera );
    
  }
  function select(b,multisel) {
    brickPos(sel,0);
    sel=b;Menu.ms(mtype,sel.t);
    //onsole.log(sel);
    
    if (!multisel) {
      for (var i=sels.length-1;i>=0;i--) {
        let bh=sels[i];
        brickPos(bh,0);
        if (bh.omaterial) { bh.mesh.material=bh.omaterial;delete(bh.omaterial); }
      }
      sels.length=0;
    } else if (sels.indexOf(b)!=-1) return;
    sels.push(b);
    if (!b.omaterial) b.omaterial=b.mesh.material;
    b.mesh.material=new THREE.MeshPhongMaterial({flatShading:true,color:0x66aa66//0x99aa66
      ,depthTest:false,transparent:true,opacity:0.7});
    console.log('select material set');
    //...
  }
  function serialize() {
    var s='{\n',bl;
    var a=[];
    for (var k in brickts) if (brickts.hasOwnProperty(k)) a.push(k);
    if (a.length>0) {
      s+='"bricktypes":{\n';
      for (var i=0;i<a.length;i++) {
        s+='  "'+a[i]+'":"'+brickts[a[i]].fn+'"'+(i<a.length-1?',':'')+'\n';
      }
      s+='},\n';
    }
    if (ms.own) {
      s+='"colors":[\n';
      for (var i=0;i<ms.length;i++) {
        console.log(ms[i].color);
        s+=' "'+ms[i].userData.scol+'"'+(i<ms.length-1?',':'')+'\n';
      }
      s+='],\n';
    }
    s+='"bricks":[\n';
    for (var i=0;i<bricks.length;i++) {
      var b=cloneWithout(bricks[i],without);
      s+='  '+JSON.stringify(bl?diff(bl,b):b)+((i<bricks.length-1)?',':'')+'\n';
      bl=b;
    }
    s+=']\n';
    s+='}';
    return s;
  }
  function init() {
    //---
    raycaster==new THREE.Raycaster();
    mvcol=new THREE.MeshPhongMaterial({flatShading:true,vertexColors:THREE.VertexColors});
    //...
  }
  function initEditor() {
    init();
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setClearColor( 0x888888 );
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.BasicShadowMap;
    //				renderer.shadowMapEnabled=true;
    //				renderer.shadowMapType=THREE.PCFShadowMap;//PCFShadowMap;
    
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.innerWidth, window.innerHeight );
    var container = document.getElementById('container');
    container.appendChild( renderer.domElement );
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 500;
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.autoRotate=true;
    controls.enableDamping=true;
    controls.dampingFactor=0.25;//0.25;
    controls.enableZoom=true;controls.zoomSpeed=0.5;
    controls.enablePan=true;
    controls.maxDistance=1000;
    controls.rotateSpeed=0.4;
    
    var ca=[0x666666,0x333333,0xf0f000,0x90f000,0x00f000,0x009090,0x0030d0];
    for (var i=0;i<ca.length;i++) {
      var m=new THREE.MeshPhongMaterial({//color:ca[i],flatShading:true//,shading:THREE.FlatShading
        vertexColors:THREE.VertexColors
      });
      ms.push(m);
    }
    //if (1) { box0(-1,0,-1,1,1,1,m2);box0(15,0,-1,1,1,1,m2);
    //         box0(-1,0,15,1,1,1,m2);box0(15,0,15,1,1,1,m2); }
    box(0,-150,0,600,bw,600,new THREE.MeshPhongMaterial({flatShading:true,color:0x666666})).castShadow=false;
    
    var l=new THREE.AmbientLight(0x555555),f=3;scene.add(l);
    l=new THREE.PointLight(0xffffff,1,0);l.position.set(-100*f,200*f,100*f);scene.add(l);
    l=new THREE.PointLight(0xffffaa,1,0);l.position.set(100*f,100*f,100*f);
    l.castShadow=true;
    l.shadow.camera.near=100;
    l.shadow.camera.far=1000;
    l.shadow.mapSize.width=1024;//2048;
    l.shadow.mapSize.height=1024;
    //l.shadow.bias=0.01;
    scene.add(l);
    l=new THREE.PointLight(0xaaffff,1,0);l.position.set(100*f,-200*f,-100*f);scene.add(l);
    
    if (1) {
    stats=new Stats(),el=stats.domElement,st=el.style;
    st.position='absolute';st.top='0px';st.left='0px';st.zIndex=100;
    container.appendChild(el); }
    
    window.addEventListener('resize',onWindowResize,false);
    menuInit();
    onWindowResize();
    window.addEventListener('click',onClick,false);
    animate();
    
    //...
  }
  //---init();
  Bricks.initEditor=initEditor;
  Bricks.initLoader=function(ps) {
    init();
    scene=ps.scene;
    
    multi=true;loaderPs=ps;
    Bricks.parseLoad=parseLoad;
    //...
  }
  console.log('Bricks '+version);
}
(Bricks));


//fr o,2
//fr o,2,11
//fr o,2,12
//fr o,2,13
//fr o,2,14
//fr o,2,20
//fr o,2,29,30
//fr o,2,29,33
//fr o,2,29,34
//fr o,2,29,52
//fr o,2,29,70
//fr o,2,34
//fr o,2,36
//fr o,2,37
//fr o,2,39
//fr o,2,40
//fr o,2,43
//fr p,86,217
