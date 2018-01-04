//---
function initAnimScript() {
  var deep,gridw=0.65,marks=[],curro,lastCamDist,
      path=undefined,pathi,patht,patha0,patha1=undefined,
      matsel=new THREE.MeshPhongMaterial({color:0xdddd00,flatShading:true,
      transparent:true,opacity:0.5}),selg,selt=0;
  //...
  version+='base 0.249 ';//FOLDORUPDATEVERSION
  addView({w:1,h:1,x:0,y:0,cam:new THREE.Vector3(-1.5,1.5,3.50),bg:1,fovportrait:1,
    target:new THREE.Vector3(0,-0.40,0),fov:60,bgcol:0x666666,vr:url.vr!='0'});
  resize();
  
  box(0,-1.9,0,5.2,0.2,5.2,m0).castShadow=false;
  
  function clickMark() {
    if (path) return;
    
    //mesh.material=m0;
    //return;
    
    //onsole.log('clickMark');
    var userData=this,g=userData.g;
    //console.log(userData.g);
    //onsole.log(mesh);
    path=deep.pathStart(g,curro);
    pathi=0;patht=0;
    //onsole.log(path);
    updateMarks();
    var o=curro;
    Pd5.animStart(o.o,o.o.animh[o.animRun]);
    //m1.color.set(0xff0000);
    g.mesh.material=matsel;selg=g;selt=0;
    //onsole.log('path.len='+path.length);
  }
  function addMark(ps) {
    var w=gridw,wh=w-0.05,yf=0.25,g=ps.g;
    var mesh=new THREE.Mesh(new THREE.BoxGeometry(wh,wh*yf,wh),m1);var b=mesh;
    mesh.position.set((g.x+0.5)*w,g.y*w-1.8+w/2*yf,(g.z+0.5)*w);
    mesh.updateMatrix();
    mesh.matrixAutoUpdate=false;
    base.add(mesh);
    marks.push(mesh);
    mesh.userData.g=g;
    mesh.userData.onclick=clickMark;
    g.mesh=mesh;
    //...
  }
  function updateMarks() {
    for (var i=marks.length-1;i>=0;i--) base.remove(marks[i]);
    marks=[];
    
    var rH=deep.rH,c=0;
    for (var k in rH) {
      var g=rH[k],gh=g;
      if (g.len==0) continue;
      if (g.gpos) gh=g.gpos;
      if (gh.len) {
        c++;
        //onsole.log(g);
        addMark({//x:g.x,y:g.y,z:g.z,
          g:g});
      }
    }
    
    
    //...
  }
  function objTargetCampos(o,e) {
    
    var v=views[0],cp=v.camera.position,tp=v.controls.target,
        dx=cp.x-tp.x,dy=cp.y-tp.y,dz=cp.z-tp.z;//,o=this;
    
    //path=undefined;//temp later path is reset after movement
    
    //if (o==curro) {
    if (e.detail>1) {
      var l=Math.sqrt(dx*dx+dy*dy+dz*dz),lr=2*o.orbitCenter*o.scale;
      if (Math.abs(l-lr)<0.01) lr=lastCamDist; else lastCamDist=l;
      dx*=lr/l;
      dy*=lr/l;
      dz*=lr/l;
    }
    var x=o.pos.x,y=o.pos.y+o.orbitCenter*o.scale,z=o.pos.z;
    setTargetCampos(x,y,z,x+dx,y+dy,z+dz);
    
    //...
  }
  function click(e) {
    //onsole.log('deep8.click');
    //onsole.log(this);
    if (path) return;
    
    var o=this;
    objTargetCampos(o,e);
    curro=o;
    
    
    //aa.c1.x=x+dx;aa.c1.y=y+dy;aa.c1.z=z+dz;
    //aa.t1.x=x;   aa.t1.y=y;   aa.t1.z=z;
    //aa.c0.copy(v.camera.position);
    //aa.t0.copy(v.controls.target);
    //taa=tam;
    
    //for (var i=marks.length-1;i>=0;i--) base.remove(marks[i]);
    //marks=[];
    
    //deep.placeGrid(o0,1);
    deep.lenInit();
    deep.maxlen=3;
    deep.calcLen(o.x,o.y,o.z,0,o)
    //console.log(deep.rH);
    updateMarks();
    //var rH=deep.rH,c=0;
    //for (var k in rH) {
    //  var g=rH[k],gh=g;
    //  if (g.len==0) continue;
    //  if (g.gpos) gh=g.gpos;
    //  if (gh.len) {
    //    c++;
    //    //onsole.log(g);
    //    addMark({//x:g.x,y:g.y,z:g.z,
    //      g:g});
    //  }
    //}
    //onsole.log('click c='+c);
    
    
    
    //var w=gridw,wh=w*0.9;
    //for (var x=-1;x<=o.xw;x++) for (var z=0;z<2;z++) {
    //  addMark({x:x+o.x,y:o.y,z:o.z+z*(o.zw+1)-1});
      
      //var mesh=new THREE.Mesh(new THREE.BoxGeometry(wh,wh/4,wh),m1);var b=mesh;
      //mesh.position.set((x+o.x+0.5)*w,o.y*w-1.75,(o.z+0.5+z*(o.zw+1)-1)*w);
      //mesh.updateMatrix();
      //mesh.matrixAutoUpdate=false;
      //base.add(mesh);
      //marks.push(mesh);
    //}
    //for (var x=0;x<2;x++) for (var z=0;z<o.zw;z++) 
    //  addMark({x:o.x+x*(o.xw+1)-1,y:o.y,z:z+o.z});
    
  }
  function setpos(o,x,y,z) {
    o.pos.x=(x+o.xw/2)*gridw;
    o.pos.y=y*gridw-1.8;
    o.pos.z=(z+o.zw/2)*gridw;
    //...
  }
  function initpos(o) {
    //o.pos.x=(o.x+o.xw/2)*gridw;
    //o.pos.y=o.y*gridw-1.8;
    //o.pos.z=(o.z+o.zw/2)*gridw;
    setpos(o,o.x,o.y,o.z);
    deep.placeGrid(o,1);
    return o;
  }
  function checkGameInit() {
    if (deep&&game.init) game.init();
    //...
  }
  
  game.calc=function(dt) {
    if (selg) {
      selt+=dt;
      //matsel.opacity=0.5+0.5*Math.sin(selt*0.03);
      if (selt>200) {
        selg.mesh.material=m1;
        selg=undefined;
      }
    }
    
    if (!path) return;
    //matsel.opacity=Math.random();
    var mt=300,o=curro;
    patht=Math.min(patht+dt,mt);
    var f1=patht/mt,f0=1-f1,g0=path[pathi],g1=path[pathi+1],
        x=g0.x*f0+g1.x*f1,
        y=g0.y*f0+g1.y*f1,
        z=g0.z*f0+g1.z*f1;
    
    if (patha1===undefined) {
      patha0=o.roty;
      patha1=-Math.atan2(g1.z-g0.z,g1.x-g0.x)+Math.PI/2;
      da=dAng(patha1,patha0);
      patha1=patha0+da;
    }
    
    setpos(o,x,y,z);
    o.roty=patha0*f0+patha1*f1;
    
    var v=views[0],cp=v.camera.position,tp=v.controls.target,
        dx=cp.x-tp.x,dy=cp.y-tp.y,dz=cp.z-tp.z;//,o=this;
    var x=o.pos.x,y=o.pos.y+o.orbitCenter*o.scale,z=o.pos.z;
    tp.set(x,y,z);cp.set(x+dx,y+dy,z+dz);
    //setTargetCampos(x,y,z,x+dx,y+dy,z+dz);
    
    //set pos,a
    
    if (patht==mt) {
      patht=0;patha1=undefined;
      pathi++;
      //console.log(pathi);
      if (pathi==path.length-1) {
        path=undefined;
        deep.lenInit();
        deep.placeGrid(o,0);
        o.x=g1.x;o.y=g1.y;o.z=g1.z;
        deep.placeGrid(o,1);
        updateMarks();
        Pd5.animStart(o.o,o.o.animh[o.animIdle]);
        //objTargetCampos(o,{});
      }
    }
    //console.log(dt);
  }
  
  var s=document.createElement('script');
  s.src='/util/deep.js';
  s.onload=function(e) {
    deep=new Deep({rH:{}});
    //onsole.log('script deep.js loaded');
    checkGameInit();
  }
  document.body.appendChild(s);
  
  Conet.download({fn:url.fn0||'deep/test0.deep8.js',f:function(v) {
    eval(v);
    checkGameInit();
    //console.log(game);
    //...
  }
  });
  
  
}
initAnimScript();
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,19
//fr o,1,25
//fr o,1,28
//fr p,44,37
