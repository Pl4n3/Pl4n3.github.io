//----
var Voxed;
(Voxed=function () {
  var mtool,medit,vw=0.03,mesh,cfm,cfmp,//medit1,
      vh={'0_0_0':{x:0,y:0,z:0},'1_0_0':{x:1,y:0,z:0},'2_0_0':{x:2,y:0,z:0},'2_1_0':{x:2,y:1,z:0},},
      colors=window.THREE?[new THREE.Color(0.5,0.5,0.5),new THREE.Color(0.2,0.8,0.2)]:[],
      ccol=colors[0],mcolor,isConet,planeY=15,mplaney,mpyshow,va=[],mcolor2,bgcoldef=0x666666,
      mbackground,groundbox,mgroundbox,brush='0,0,0',brusha=[0,0,0],blocks=undefined,
      isTiles=false,userData=undefined,pi=Math.PI,mRotate;
  
  
  function scriptForest2001() {
    //...
    //colors.push(new THREE.Color(1,0,0),new THREE.Color(0.2,0.4,0));//,new THREE.Color(1,1,0));
    var vs=planim.getVoxels(),d=50;//vh={};
    planim.putVoxels({vs:vs,dy:-48});
    planim.putVoxels({x:20,y:-47,z:20,dx:15,dy:30,dz:3,col:new THREE.Color(0.2,0.2,0.2)});//c:6});
    //return;
    Conet.seed(100);
    for (var c=0;c<20;c++)
    planim.putVoxels({vs:vs,colRedir:{1:Math.floor(Conet.rand()*3+3)},
      dx:Math.floor(Conet.rand()*d*2)-d,dy:-48,dz:Math.floor(Conet.rand()*d*2)-d,
      mirrorx:Conet.rand()<0.5,mirrorz:Conet.rand()<0.5,swapxz:Conet.rand()<0.5});
    //...
  }
  function scriptForest2001Winter() {
    //...
    //colors.push(new THREE.Color(1,0,0),new THREE.Color(0.2,0.4,0));//,new THREE.Color(1,1,0));
    var vs=planim.getVoxels(),d=50;//vh={};
    planim.putVoxels({vs:vs,dy:-47,colRedir:{1:7,2:7}});
    planim.putVoxels({vs:vs,dy:-48,colRedir:{1:0}});
    planim.putVoxels({x:20,y:-47,z:20,dx:15,dy:30,dz:3,col:new THREE.Color(0.2,0.2,0.2)});//c:6});
    //return;
    Conet.seed(100);
    for (var c=0;c<20;c++) {
      var col1=Math.floor(Conet.rand()*3+3),//not used
          dx=Math.floor(Conet.rand()*d*2)-d,
          dz=Math.floor(Conet.rand()*d*2)-d,
          mirrorx=Conet.rand()<0.5,
          mirrorz=Conet.rand()<0.5,
          swapxz=Conet.rand()<0.5;
      planim.putVoxels({vs:vs,colRedir:{1:7,2:7},dx:dx,dy:-47,dz:dz,mirrorx:mirrorx,mirrorz:mirrorz,swapxz:swapxz});
      planim.putVoxels({vs:vs,colRedir:{1:0}    ,dx:dx,dy:-48,dz:dz,mirrorx:mirrorx,mirrorz:mirrorz,swapxz:swapxz});
    }
    //...
  }
  function scriptRooms() {
    var vs=planim.getVoxels(),w=10;//vh={};
    Conet.seed(100);
    for (var z=0;z<w;z++) for (var y=0;y<w;y++) for (var x=-4;x<6;x++) {
      if ((Math.floor(x/2)%2!=0)&&(Math.floor(y/2)%2!=0)) continue;
      if ((Math.floor(z/2)%2!=0)&&(Math.floor(y/2)%2!=0)) continue;
      if ((Math.floor(z/2)%2!=0)&&(Math.floor(x/2)%2!=0)) continue;
      planim.putVoxels({vs:vs,dx:x*6,dy:y*6-48,dz:-z*8,nomesh:1,colRedir:{1:Conet.rand()<0.8?6:1}});
    }
    
    planim.putVoxels({vs:vs,dx:0,dy:-48,dz:16,nomesh:1,colRedir:{1:6}});  
    planim.putVoxels({vs:vs,dx:6,dy:-48,dz:16,nomesh:1,colRedir:{1:1}});  
    
    voxMesh();
    //...
  }
  function scriptShadowPoles() {
    
    for (var z=-5;z<5;z++) for (var x=-5;x<5;x++) planim.putVoxels({x:x*20,y:0,z:z*20,dx:1,dy:10,dz:1,c:0});
    planim.putVoxels({x:-100,y:-1,z:-100,dx:200,dy:1,dz:200,c:0});
    
    //...
  }
  function scriptNienhagenText() {
    return '{"voxels":[{"c":18,"x":-8,"y":1,"z":22},{"c":18,"x":-7,"y":1,"z":22},{"c":18,"x":-3,"y":1,"z":22},{"c":18,"x":-2,"y":1,"z":22},{"c":9,"x":0,"y":1,"z":22},{"c":18,"x":1,"y":1,"z":22},{"c":18,"x":2,"y":1,"z":22},{"c":18,"x":5,"y":1,"z":22},{"c":18,"x":6,"y":1,"z":22},{"c":18,"x":7,"y":1,"z":22},{"c":18,"x":8,"y":1,"z":22},{"c":18,"x":9,"y":1,"z":22},{"c":18,"x":12,"y":1,"z":22},{"c":18,"x":13,"y":1,"z":22},{"c":18,"x":-8,"y":2,"z":22},{"c":18,"x":-7,"y":2,"z":22},{"c":18,"x":-4,"y":2,"z":22},{"c":18,"x":-3,"y":2,"z":22},{"c":18,"x":-2,"y":2,"z":22},{"c":18,"x":1,"y":2,"z":22},{"c":18,"x":2,"y":2,"z":22},{"c":18,"x":5,"y":2,"z":22},{"c":18,"x":6,"y":2,"z":22},{"c":18,"x":12,"y":2,"z":22},{"c":18,"x":13,"y":2,"z":22},{"c":18,"x":-8,"y":3,"z":22},{"c":18,"x":-7,"y":3,"z":22},{"c":18,"x":-5,"y":3,"z":22},{"c":18,"x":-4,"y":3,"z":22},{"c":18,"x":-3,"y":3,"z":22},{"c":18,"x":-2,"y":3,"z":22},{"c":18,"x":1,"y":3,"z":22},{"c":18,"x":2,"y":3,"z":22},{"c":18,"x":5,"y":3,"z":22},{"c":18,"x":6,"y":3,"z":22},{"c":18,"x":7,"y":3,"z":22},{"c":18,"x":8,"y":3,"z":22},{"c":18,"x":12,"y":3,"z":22},{"c":18,"x":13,"y":3,"z":22},{"c":18,"x":-8,"y":4,"z":22},{"c":18,"x":-7,"y":4,"z":22},{"c":18,"x":-6,"y":4,"z":22},{"c":18,"x":-5,"y":4,"z":22},{"c":18,"x":-3,"y":4,"z":22},{"c":18,"x":-2,"y":4,"z":22},{"c":18,"x":1,"y":4,"z":22},{"c":18,"x":2,"y":4,"z":22},{"c":18,"x":5,"y":4,"z":22},{"c":18,"x":6,"y":4,"z":22},{"c":18,"x":7,"y":4,"z":22},{"c":18,"x":8,"y":4,"z":22},{"c":18,"x":12,"y":4,"z":22},{"c":18,"x":13,"y":4,"z":22},{"c":18,"x":-8,"y":5,"z":22},{"c":18,"x":-7,"y":5,"z":22},{"c":18,"x":-6,"y":5,"z":22},{"c":18,"x":-3,"y":5,"z":22},{"c":18,"x":-2,"y":5,"z":22},{"c":18,"x":1,"y":5,"z":22},{"c":18,"x":2,"y":5,"z":22},{"c":18,"x":5,"y":5,"z":22},{"c":18,"x":6,"y":5,"z":22},{"c":18,"x":12,"y":5,"z":22},{"c":18,"x":13,"y":5,"z":22},{"c":18,"x":-8,"y":6,"z":22},{"c":18,"x":-7,"y":6,"z":22},{"c":18,"x":-3,"y":6,"z":22},{"c":18,"x":-2,"y":6,"z":22},{"c":18,"x":1,"y":6,"z":22},{"c":18,"x":2,"y":6,"z":22},{"c":18,"x":5,"y":6,"z":22},{"c":18,"x":6,"y":6,"z":22},{"c":18,"x":7,"y":6,"z":22},{"c":18,"x":8,"y":6,"z":22},{"c":18,"x":9,"y":6,"z":22},{"c":18,"x":12,"y":6,"z":22},{"c":18,"x":13,"y":6,"z":22}]}';
    //...
  }
  function scriptSphere() {
    //---
    //---fullsphere
    
    planim.putVoxels({x:-20,y:-10,z:-20,dx:40,dy:40,dz:40,c:0,f:function(x,y,z) {
      return Math.sqrt(x*x+y*y+z*z)<=1;
    }
    });
    
    //---hollow 1/4 sphere
    planim.putVoxels({x:-20,y:-10,z:-10,dx:40,dy:20,dz:20,c:0,f:function(x,y,z) {
      y=(y+1)/2;z=(z+1)/2;var v=Math.sqrt(x*x+y*y+z*z); return (v<=1)&&(v>=0.9);
    }
    });
    
    //--- same with color grades
    planim.putVoxels({x:-20,y:-10,z:-10,dx:40,dy:20,dz:20,c:0,f:function(x,y,z) {
      y=(y+1)/2;z=(z+1)/2;var v=Math.sqrt(x*x+y*y+z*z); return (v<=1)&&(v>=0.9)?{col:{g:Math.min(1,Conet.rani(10)/10*0.35+y),r:y,b:0}}:undefined;
    }
    });
    
    
    //...
  }
  
  function etV(x,y,z,v) {
    var k=x+'_'+y+'_'+z;
    //onet.log(k);
    if (v===undefined) return vh[k];
    if (v===null) {
      //onsole.log('etV null va.len='+va.length+' k='+k);
      va.splice(va.indexOf(vh[k]),1);
      //onsole.log('va.len='+va.length);
      //onsole.trace();
      delete(vh[k]);
    } else {
      v.x=x;v.y=y;v.z=z;
      vh[k]=v;
      va.push(v);
    }
    //...
  }
  
  function generateMesh() {
    
    var ge=new THREE.Geometry();
    //threeEnv.addTri({ge:ge,a0:[0,0,0],a1:[-10,0,0],a2:[0,10,0],dim:1});
    
    var //c=new THREE.Color(0.5,0.5,0.5),
        w=vw,f=undefined,//threeEnv.pv;
        isplaney=mpyshow&&mpyshow.checked,
        count=0;
    
    for (var k in vh) if (vh.hasOwnProperty(k)) {
      var v=vh[k],x=v.x,y=v.y,z=v.z,
          x0=x*w+w/2,y0=y*w-0.4+w/2,z0=z*w+w/2,
          c=colors[v.c||0];
      if (isplaney&&(y>planeY)) continue;
      //onsole.log(v);
      if (!etV(x,y,z-1)) threeEnv.addQuad({ge:ge,a0:[x0,y0,z0-w],a1:[-w,0,0],a2:[0,w,0],a3:[-w,w,0],dim:1,c:c,f:f});
      if (!etV(x,y,z+1)) threeEnv.addQuad({ge:ge,a0:[x0-w,y0,z0],a1:[w,0,0],a2:[0,w,0],a3:[w,w,0],dim:1,c:c,f:f});
      if (!etV(x+1,y,z)) threeEnv.addQuad({ge:ge,a0:[x0,y0,z0],a1:[0,0,-w],a2:[0,w,0],a3:[0,w,-w],dim:1,c:c,f:f});
      if (!etV(x-1,y,z)) threeEnv.addQuad({ge:ge,a0:[x0-w,y0,z0-w],a1:[0,0,w],a2:[0,w,0],a3:[0,w,w],dim:1,c:c,f:f});
      if ((isplaney&&(y==planeY))||!etV(x,y+1,z)) threeEnv.addQuad({ge:ge,a0:[x0-w,y0+w,z0],a1:[w,0,0],a2:[0,0,-w],a3:[w,0,-w],dim:1,c:c,f:f});
      if (!etV(x,y-1,z)) threeEnv.addQuad({ge:ge,a0:[x0,y0,z0],a1:[-w,0,0],a2:[0,0,-w],a3:[-w,0,-w],dim:1,c:c,f:f});
      count++;
    }
    //onsole.log('voxed.voxMesh count='+count);
    
    if (isplaney) {
      var y=planeY,y0=y*w-0.4+w/2;
      threeEnv.addQuad({ge:ge,a0:[-1,y0+w/10,1],a1:[2,0,0],a2:[0,0,-2],a3:[2,0,-2],dim:1,c:colors[0],f:f});
    }
    
    //Conet.rand=Math.random;
    if (0) {
    var tc=mx*mz*3/10;//750*9;//treecount
    for (var ti=0;ti<tc;ti++) {
      var x0=(Conet.rand()-0.5)*mx*2,
          z0=(Conet.rand()-0.5)*mz*2,
          ix=Math.floor(canvas.width*(x0+mx)/(2*mx)),
          iy=Math.floor(canvas.height*(z0+mz)/(2*mz));
      //onsole.log('generateForest '+ix+' '+iy);
      var di=(iy*canvas.width+ix)*4;
      var g=id.data[di+1];
      //if (Math.abs(z0)<10) continue;
      //g-=10;
      if (g<=0) continue;
      var c=6,r=0.5,ao0=undefined,ao1,col=new THREE.Color(0.4,0.4,0.2),
          h=g/3;//50;
      //r=0.5;//r*r+0.5;
      if (ti%3==0) { h=1+Conet.rand()*2;r=0.5+Conet.rand(); }
      var dx=(Conet.rand()-0.5)*0.1*h,dz=(Conet.rand()-0.5)*0.1*h;
      for (var i=0;i<=c;i++) {
        var a=i*Math.PI*2/c,x=Math.sin(a)*r,z=Math.cos(a)*r;
        //planim.box(x,-0.9,z,1,2,1);
        var a0=[x+x0,-1.8,z+z0],a1=[x+x0+dx,-1.8+h,z+z0+dz];
        if (ao0) 
          threeEnv.addQuad({ge:ge,a0:ao0,a1:a0,a2:ao1,a3:a1,f:threeEnv.pv,c:col});
        ao0=a0;ao1=a1;
      }
    }
    }
    
    
    ge.computeVertexNormals();
    var bge=new THREE.BufferGeometry().fromGeometry(ge);
    var mh={vertexColors:THREE.FaceColors};
    if (isplaney) { mh.transparent=true;mh.opacity=0.75; }
    
    var m=new THREE.Mesh(bge,new THREE.MeshPhongMaterial(
    mh
    //{vertexColors:THREE.FaceColors
    //  ,transparent:true,opacity:0.75
    //}
    ));
    m.position.set(0,0,0);
    m.castShadow=true;
    m.receiveShadow=true;
    return m;
    
    //...
  }
  
  function voxMesh() {
    //...
    if (mesh) base.remove(mesh);
    
    var m=generateMesh();
    
    base.add(m);planim.voxMesh=m;
    m.userData.onclick=onclick;
    mesh=m;
    
    if (Voxed.onVoxMesh) Voxed.onVoxMesh();
    
    return m;
    //...
  }
  function round(v) {
    return Math.floor(v+0.5);//...
  }
  function select(o) {
    this.material=o?planim.m1:planim.m0;
    //console.log('bases.select o='+o);
    //console.log(this);
  }
  function checkIndexColor(ccol) {
    
    if (ccol.ci===undefined) {
      var md=0.001;
      for (var i=colors.length-1;i>=0;i--) {
        var c=colors[i];//,md=0.001;
        if ((Math.abs(c.r-ccol.r)<md)&&(Math.abs(c.g-ccol.g)<md)
          &&(Math.abs(c.b-ccol.b)<md)) { ccol.ci=i;break; }
      }
      if (ccol.ci===undefined) {
        colors.push(ccol);ccol.ci=colors.length-1;
      }
    }
    
    
    //...
  }
  
  function prefix(s,n,s0) {
    while (s.length<n) s=(s0===undefined?'0':s0)+s;
    return s;
    //...
  }
  
  function colToHex(ccol) {
    
    var r=prefix(Math.floor(ccol.r*255+0.5).toString(16),2),
        g=prefix(Math.floor(ccol.g*255+0.5).toString(16),2),
        b=prefix(Math.floor(ccol.b*255+0.5).toString(16),2);
    //if (r.length%2>0) r='0'+r;
    //if (g.length%2>0) g='0'+g;
    //if (b.length%2>0) b='0'+b;
    
    
    var v='#'+r+g+b;
    return v;
    //...
  }
  
  function colIToS(c) {
    
    return '#'+prefix(c.toString(16),6);
    //...
  }
  
  function onclick(e,ij,j) {
    if (!medit.checked) return;
    //if (j!=0) return;//220917 removed because deep8vox clouds made click not work
    var mts=mtool.s,
        add=mts.startsWith('Add'),
        sub=mts.startsWith('Sub'),
        paint=(mts=='Paint');
    //if (add&&(e.type!='click')) return;
    //if (medit1.checked) 
    if (mts.endsWith(' 1'))
    if ((e.type!='touchstart')&&(e.type!='click')) return;//mousedown
    //onet.log('voxed.onclick e.type='+e.type);
    //console.trace();
    //onsole.log('voxed fi='+ij.faceIndex+' uv.x='+f4(ij.uv.x)+' uv.y='+f4(ij.uv.y));
    //onsole.log(ij);
    var p=ij.point,n=ij.face.normal;
    //planim.box(p.x,p.y,p.z,0.1,0.1,0.1);
    if (!add) { n.x*=-1;n.y*=-1;n.z*=-1; }
    
    var x=0.5+p.x/vw+n.x/2,y=0.5+(p.y+0.4)/vw+n.y/2,z=0.5+p.z/vw+n.z/2;
    x=Math.floor(x);y=Math.floor(y)-1;z=Math.floor(z);
    
    //onet.log(f4(x)+' '+f4(y)+' '+f4(z));
    if (mpyshow.checked) {
      if ((y!=planeY)&&(add||sub)) return;
    }
    //onsole.log('voxed.onclick y='+y+' planeY='+planeY);
    
    Conet.log('voxel '+x+' '+y+' '+z);
    
    if (add||paint) checkIndexColor(ccol);
    
    //onsole.log('onclick ccol.ci='+ccol.ci);
    
    if (add) {
      //etV(x,y,z,{x:x,y:y,z:z,c:ccol.ci});
      //onsole.log('...add '+ccol.ci);
      etV(x,y,z,{c:ccol.ci});
      
      //var r=1;
      for (var zh=z-brusha[2];zh<=z+brusha[2];zh++)
      for (var yh=y-brusha[1];yh<=y+brusha[1];yh++)
      for (var xh=x-brusha[0];xh<=x+brusha[0];xh++)
      if (!etV(xh,yh,zh)) etV(xh,yh,zh,{c:ccol.ci});
    } else if (sub) {
      //onsole.log('voxed.onclick etV...null nao.');
      //etV(x,y,z,null);
    
      for (var zh=z-brusha[2];zh<=z+brusha[2];zh++)
      for (var yh=y-brusha[1];yh<=y+brusha[1];yh++)
      for (var xh=x-brusha[0];xh<=x+brusha[0];xh++)
      etV(xh,yh,zh,null);
    } else if (mts.startsWith('Pick')) {
      var ci,c=colors[ci=etV(x,y,z).c];
      console.log('onclick pick ci='+ci);
      //console.log('c.ci='+c.ci);
      if ((c.r!=ccol.r)||(c.g!=ccol.g)||(c.b!=ccol.b)) {
        //ccol=c;ccol.ci=ci;
        //console.log('onclick setting ccol ccol.ci='+ccol.ci);
        Menu.remove();
        //console.log('onclick 0 ccol.ci='+ccol.ci);
        //mcolor.setfunc(c.r+','+c.g+','+c.b);
        mcolor2.oninput(colToHex(c));
        ccol=c;ccol.ci=ci;
        //console.log('onclick 1 ccol.ci='+ccol.ci);
        mtool.s='Paint';
        Menu.draw();
        //onsole.log('onclick 2 ccol.ci='+ccol.ci);
        //onsole.log(ccol);
      }
    } else if (paint) {
      etV(x,y,z).c=ccol.ci;
      var eh;
      for (var zh=z-brusha[2];zh<=z+brusha[2];zh++)
      for (var yh=y-brusha[1];yh<=y+brusha[1];yh++)
      for (var xh=x-brusha[0];xh<=x+brusha[0];xh++)
      if (eh=etV(xh,yh,zh)) eh.c=ccol.ci;
    
    } else if (mts=='Paint range') {
      if (app) app.onclick(x,y,z); else Conet.log('No app.');
    }
    
    //if (isTiles) if ((x>0)&&(y<0)&&(z<0)) calcTiles({x:x,y:y,z:z});
    
    voxMesh();
    
    //onsole.log('onclick end ccol.ci='+ccol.ci);
    
    //console.log(e);
    //...
  }
  function serialize() {
    //---
    if (isTiles) calcTiles({onlyClear:1});
    //--
    var first,data='{"vw":'+vw;
    
    data+=',"colors":[\n';
    for (var ci=0;ci<colors.length;ci++) {
      var c=colors[ci];
      data+=(ci==0?'':',')+'['+f4(c.r)+','+f4(c.g)+','+f4(c.b)+']\n';
    }
    data+=']';
    
    if (!blocks) {
    data+=',"voxels":[\n';first=true;
    for (var k in vh) if (vh.hasOwnProperty(k)) {
      var v=vh[k];
      data+=(first?'':',')+JSON.stringify(v)+'\n';
      first=false;
    }
    data+=']';
    }
    
    data+=',"backgroundColor":"'+colIToS(planim.views[0].bgcol)+'"\n';
    data+=',"groundbox":'+(mgroundbox.checked?1:0)+'\n';
    
    if (blocks) data+=',"blocks":'+JSON.stringify(blocks)+'\n';
    if (userData) data+=',"userData":'+JSON.stringify(userData)+'\n';
    
    data+='}';
    
    console.log('serialize size='+data.length);
    
    if (isTiles) calcTiles();
    
    return data;
    //...
  }
  function load(d) {
    //--
    
    if (Voxed.onBeforeLoad) Voxed.onBeforeLoad();
    
    //var d=JSON.parse(v);
    if (d.vw) vw=d.vw;
    vh={};
    colRedir={};
    
    //if (!d.colors) d.colors=[new THREE.Color(0x666666),new THREE.Color(0xffffff),new THREE.Color(0xff0000),new THREE.Color(0xbb9900),
    //    new THREE.Color(0x118811)];
    
    if (d.colors&&d.colors.length>0) {
      colors=[];
      var dci=0;
      for (var v of d.colors) {
        var r=v[0],g=v[1],b=v[2],didRedir=false;
        for (var i=0;i<colors.length;i++) {
          var ci=colors[i];
          if ((ci.r==r)&&(ci.g==g)&&(ci.b==b)) {
            //onsole.log('load same color, should redirect to '+i);
            colRedir[dci]=i;
            didRedir=true;
            break;
          }
        }
        if (!didRedir) {
          colors.push(new THREE.Color(r,g,b));
          colRedir[dci]=colors.length-1;
        }
        dci++;
      }
    }
    else colors=[new THREE.Color(0x666666),new THREE.Color(0xffffff),new THREE.Color(0xff0000),new THREE.Color(0xbb9900),
        new THREE.Color(0x118811)];
    
    //onsole.log(colRedir);
    
    blocks=undefined;
    if (d.blocks) {
      blocks=d.blocks;
      for (var bi=0;bi<blocks.length;bi++) {
        var b=blocks[bi];//,vol=b.xl*b.yl*b.zl;
        for (var z=0;z<b.zl;z++) for (var y=0;y<b.yl;y++) for (var x=0;x<b.xl;x++) 
          etV(b.x+x,b.y+y,b.z+z,{c:bi%colors.length});
      }
    } else
    if (d.voxels) for (var v of d.voxels) {
      var rc=colRedir[v.c];if (rc!==undefined) v.c=rc;
      if (v.c>=colors.length) v.c=0;
      etV(v.x,v.y,v.z,v);
    }
    
    if (d.grid) for (var v of d.grid) {
      etV(v[0],v[1],v[2],{c:v.length>3?v[3]%colors.length:0});
    }
    //onsole.log(d.colors);
    //onsole.log(colors.length);
    
    if (d.backgroundColor&&mbackground) mbackground.oninput(d.backgroundColor);
    
    var m=mgroundbox;
    if (m) {
    if (!m.checked) { Menu.setChecked(m,1);m.actionf(); }
    if (d.groundbox!==undefined) {
      if (!d.groundbox) { Menu.setChecked(m,0);m.actionf(); }
    }}
    
    userData=d.userData;
    
    if (window.planim&&!planim.url.noapp) {
      if (userData&&userData.snake4d) snake4dInit();
      if (userData&&userData.deepParts) deepPartsInit();
      if (userData&&userData.deep8voxb) {
        if (noOrtho) deep8voxbInit(); else Conet.log('deep8voxb skipped, to run set in url noOrtho=1.');
      }
    }
      //console.log(snake4dApp);
      //app=snake4dApp;
      //app.init();
    
    //console.log(userData);
    
    return {blocks:blocks};
    //voxMesh();
    
    //scriptForest2001Winter();
    //scriptRooms();
    //scriptShadowPoles();
    //...
  }
  function num4(n) {
    var s='',m;
    m=n&0xff;s+=String.fromCharCode(m);n=n>>8;
    m=n&0xff;s+=String.fromCharCode(m);n=n>>8;
    m=n&0xff;s+=String.fromCharCode(m);n=n>>8;
    m=n&0xff;s+=String.fromCharCode(m);//n<<8;
    return s;
    //...
  }
  function vox() {
    
    var pa=[
    0x00000000, 0xffffffff, 0xffccffff, 0xff99ffff, 0xff66ffff, 0xff33ffff, 0xff00ffff, 0xffffccff, 0xffccccff, 0xff99ccff, 0xff66ccff, 0xff33ccff, 0xff00ccff, 0xffff99ff, 0xffcc99ff, 0xff9999ff,
    0xff6699ff, 0xff3399ff, 0xff0099ff, 0xffff66ff, 0xffcc66ff, 0xff9966ff, 0xff6666ff, 0xff3366ff, 0xff0066ff, 0xffff33ff, 0xffcc33ff, 0xff9933ff, 0xff6633ff, 0xff3333ff, 0xff0033ff, 0xffff00ff,
    0xffcc00ff, 0xff9900ff, 0xff6600ff, 0xff3300ff, 0xff0000ff, 0xffffffcc, 0xffccffcc, 0xff99ffcc, 0xff66ffcc, 0xff33ffcc, 0xff00ffcc, 0xffffcccc, 0xffcccccc, 0xff99cccc, 0xff66cccc, 0xff33cccc,
    0xff00cccc, 0xffff99cc, 0xffcc99cc, 0xff9999cc, 0xff6699cc, 0xff3399cc, 0xff0099cc, 0xffff66cc, 0xffcc66cc, 0xff9966cc, 0xff6666cc, 0xff3366cc, 0xff0066cc, 0xffff33cc, 0xffcc33cc, 0xff9933cc,
    0xff6633cc, 0xff3333cc, 0xff0033cc, 0xffff00cc, 0xffcc00cc, 0xff9900cc, 0xff6600cc, 0xff3300cc, 0xff0000cc, 0xffffff99, 0xffccff99, 0xff99ff99, 0xff66ff99, 0xff33ff99, 0xff00ff99, 0xffffcc99,
    0xffcccc99, 0xff99cc99, 0xff66cc99, 0xff33cc99, 0xff00cc99, 0xffff9999, 0xffcc9999, 0xff999999, 0xff669999, 0xff339999, 0xff009999, 0xffff6699, 0xffcc6699, 0xff996699, 0xff666699, 0xff336699,
    0xff006699, 0xffff3399, 0xffcc3399, 0xff993399, 0xff663399, 0xff333399, 0xff003399, 0xffff0099, 0xffcc0099, 0xff990099, 0xff660099, 0xff330099, 0xff000099, 0xffffff66, 0xffccff66, 0xff99ff66,
    0xff66ff66, 0xff33ff66, 0xff00ff66, 0xffffcc66, 0xffcccc66, 0xff99cc66, 0xff66cc66, 0xff33cc66, 0xff00cc66, 0xffff9966, 0xffcc9966, 0xff999966, 0xff669966, 0xff339966, 0xff009966, 0xffff6666,
    0xffcc6666, 0xff996666, 0xff666666, 0xff336666, 0xff006666, 0xffff3366, 0xffcc3366, 0xff993366, 0xff663366, 0xff333366, 0xff003366, 0xffff0066, 0xffcc0066, 0xff990066, 0xff660066, 0xff330066,
    0xff000066, 0xffffff33, 0xffccff33, 0xff99ff33, 0xff66ff33, 0xff33ff33, 0xff00ff33, 0xffffcc33, 0xffcccc33, 0xff99cc33, 0xff66cc33, 0xff33cc33, 0xff00cc33, 0xffff9933, 0xffcc9933, 0xff999933,
    0xff669933, 0xff339933, 0xff009933, 0xffff6633, 0xffcc6633, 0xff996633, 0xff666633, 0xff336633, 0xff006633, 0xffff3333, 0xffcc3333, 0xff993333, 0xff663333, 0xff333333, 0xff003333, 0xffff0033,
    0xffcc0033, 0xff990033, 0xff660033, 0xff330033, 0xff000033, 0xffffff00, 0xffccff00, 0xff99ff00, 0xff66ff00, 0xff33ff00, 0xff00ff00, 0xffffcc00, 0xffcccc00, 0xff99cc00, 0xff66cc00, 0xff33cc00,
    0xff00cc00, 0xffff9900, 0xffcc9900, 0xff999900, 0xff669900, 0xff339900, 0xff009900, 0xffff6600, 0xffcc6600, 0xff996600, 0xff666600, 0xff336600, 0xff006600, 0xffff3300, 0xffcc3300, 0xff993300,
    0xff663300, 0xff333300, 0xff003300, 0xffff0000, 0xffcc0000, 0xff990000, 0xff660000, 0xff330000, 0xff0000ee, 0xff0000dd, 0xff0000bb, 0xff0000aa, 0xff000088, 0xff000077, 0xff000055, 0xff000044,
    0xff000022, 0xff000011, 0xff00ee00, 0xff00dd00, 0xff00bb00, 0xff00aa00, 0xff008800, 0xff007700, 0xff005500, 0xff004400, 0xff002200, 0xff001100, 0xffee0000, 0xffdd0000, 0xffbb0000, 0xffaa0000,
    0xff880000, 0xff770000, 0xff550000, 0xff440000, 0xff220000, 0xff110000, 0xffeeeeee, 0xffdddddd, 0xffbbbbbb, 0xffaaaaaa, 0xff888888, 0xff777777, 0xff555555, 0xff444444, 0xff222222, 0xff111111
    ];
    for (var i=0;i<colors.length;i++) {
      var c=colors[i],r=round(c.r*255),g=round(c.g*255),b=round(c.b*255),mind=Number.MAX_VALUE,minj=1;
      for (var j=0;j<pa.length;j++) {
        var co=pa[j],cr=(co)&0xff,cg=(co>>8)&0xff,cb=(co>>16)&0xff,
            dr=cr-r,dg=cg-g,db=cb-b,d=dr*dr+dg*dg+db*db;
        //if (i==0) console.log('vox pa['+j+'] rgb='+cr+' '+cg+' '+cb);
        if (d<mind) { mind=d;minj=j; }
      }
      c.pi=minj;
      //onsole.log('vox color '+i+' rgb='+r+','+b+','+g+' pi='+minj);
    }
    
    
    
    
    var minx=Number.MAX_VALUE,maxx=-Number.MAX_VALUE,
        miny=Number.MAX_VALUE,maxy=-Number.MAX_VALUE,
        minz=Number.MAX_VALUE,maxz=-Number.MAX_VALUE,
        c=0,withColors=false;
    for (var k in vh) if (vh.hasOwnProperty(k)) {
      var v=vh[k],x=v.x,y=-v.z,z=v.y;
      minx=Math.min(minx,x);maxx=Math.max(maxx,x);
      miny=Math.min(miny,y);maxy=Math.max(maxy,y);
      minz=Math.min(minz,z);maxz=Math.max(maxz,z);
      c++;
    }
    
    console.log('vox x range '+minx+' '+maxx);
    console.log('vox y range '+miny+' '+maxy);
    console.log('vox z range '+minz+' '+maxz);
    console.log('vox number of voxels '+c+' '+num4(c));
    
    var s='VOX '+num4(150)
     +'MAIN'+num4(0)+num4(40+c*4+(withColors?(258*4):0))
     +'SIZE'+num4(12)+num4(0)+num4(1+maxx-minx)+num4(1+maxy-miny)+num4(1+maxz-minz)
     +'XYZI'+num4(4+c*4)+num4(0)+num4(c);
    
    for (var k in vh) if (vh.hasOwnProperty(k)) {
      var v=vh[k],x=v.x,y=-v.z,z=v.y;
      s+=String.fromCharCode(x-minx)+String.fromCharCode(y-miny)+String.fromCharCode(z-minz)
        +String.fromCharCode(colors[v.c].pi);//v.c+1//85);//v.c);
    }
    
    if (withColors) {
      s+='RGBA'+num4(256*4);
      for (var i=0;i<256;i++) {
        var r=100,g=100,b=100,a=255;
        if (i<colors.length) {
          var c=colors[i];r=round(c.r*255);
          g=round(c.g*255);b=round(c.b*255);
        } 
        s+=String.fromCharCode(r)+String.fromCharCode(g)+String.fromCharCode(b)
          +String.fromCharCode(a);
      }
    }
    
    
    //for (var i=0;i<s.length;i++) console.log(i+' '+s.charAt(i)+' '+s.charCodeAt(i));
    
    s=btoa(s);
    
    //---following not necessary anymore with comfortable binary download link
    //if (isConet) Conet.upload({fn:'/three/anim/voxed/export.vox.base64',data:s,log:Conet.log});//.b64
    
    return s;
    //...
  }
  
  function generateLandscape(ps) {
    if (!ps) ps={};
    
    //onsole.log(ps);
    
    va=[];vh={};
    
    
    function mid(p0,p1) {
      var p={x:(p0.x+p1.x)/2,y:(p0.y+p1.y)/2,z:(p0.z+p1.z)/2};
      
      Conet.seed((ps.seed||0)+Math.floor(p.x)+Math.floor(p.z)*100);
      p.y+=(Conet.rand()-0.5)*Math.max(p1.x-p0.x,p1.z-p0.z)*0.5;
      
      return p;
      //...
    }
    
    function setv(p) {
      
      //console.log(p);
      //console.log(v);
      if (p.c!==undefined) if (p.c<0) return;
      var x=Math.floor(p.x+0.5),
          y=Math.floor(p.y+0.5),
          z=Math.floor(p.z+0.5);
      if (!etV(x,y,z)) {
        let h;
        //p.c=undefined;
        etV(x,y,z,h={
          c:(((p.c!==undefined)&&!ps.color3dy?Math.floor(p.c+0.5):
            (((p.c===undefined)?0:Math.floor(p.c+0.5))+y+Math.floor(colors.length/2)))+colors.length*1000)%colors.length});
        //onsole.log(y);
        //onsole.log(h);
      }
      //etV(p.x,p.y,p.z,{c:1});
      //...
      
      
      //---      
      //cells[Math.floor(p.y+0.5)][Math.floor(p.x+0.5)].v=p.v;      
      //...
    }
    
    function q(p0,p1,p2,p3,depth) {
      //var x=(x0+x1)/2,y=(y0+y1)/2,z=(z0+z1)/2;
      
      var dx=p1.x-p0.x,dz=p2.z-p0.z;
      
      if ((dx<0.5)&&(dz<0.5)) {
      
      setv(p0);
      setv(p1);
      setv(p2);
      setv(p3);
      
      } else {
      
        var p4=mid(p0,p1),p5=mid(p0,p2),p6=mid(p1,p3),p7=mid(p2,p3),p8=mid(p4,p7);
        q(p0,p4,p5,p8,depth+1);
        q(p4,p1,p8,p6,depth+1);
        q(p5,p8,p2,p7,depth+1);
        q(p8,p6,p7,p3,depth+1);
        
      
      }
      //fV(p4,v);
      
      //...
    }
    
    
    function midc(p0,p1) {
      var p={x:(p0.x+p1.x)/2,y:(p0.y+p1.y)/2,z:(p0.z+p1.z)/2,c:(p0.c+p1.c)/2};
      
      Conet.seed((ps.seed||0)+Math.floor(p.x)+Math.floor(p.z)*100+Math.floor(p.y)*10000);
      p.c+=(Conet.rand()-0.5)*Math.min(20,Math.max(Math.max(Math.abs(p1.x-p0.x),Math.abs(p1.z-p0.z)),Math.abs(p1.y-p0.y)))*0.5;
      
      return p;
      //...
    }
    
    
    function c(p0,p1,p2,p3,p4,p5,p6,p7,depth) {
      //---
      
      //   0---1
      // 2---3 |
      // | | | |
      // | 4-|-5
      // 6---7
      
      if ((Math.abs(p0.x-p7.x)<0.5)&&(Math.abs(p0.y-p7.y)<0.5)&&(Math.abs(p0.z-p7.z)<0.5)) {
      //if (depth>=6) {
      setv(p0);
      setv(p1);
      setv(p2);
      setv(p3);
      setv(p4);
      setv(p5);
      setv(p6);
      setv(p7);
      } else {
      var p8=midc(p0,p1),p9=midc(p0,p2),p10=midc(p1,p3),p11=midc(p2,p3),p12=midc(p8,p11),
          p13=midc(p4,p5),p14=midc(p4,p6),p15=midc(p5,p7),p16=midc(p6,p7),p17=midc(p13,p16),
          p18=midc(p0,p4),p19=midc(p1,p5),p20=midc(p2,p6),p21=midc(p3,p7),
          p22=midc(p18,p19),p23=midc(p18,p20),p24=midc(p19,p21),p25=midc(p20,p21),p26=midc(p22,p25);
      
      var d1=depth+1;
      c(p0,p8,p9,p12,p18,p22,p23,p26,d1);
      c(p8,p1,p12,p10,p22,p19,p26,p24,d1);
      c(p9,p12,p2,p11,p23,p26,p20,p25,d1);
      c(p12,p10,p11,p3,p26,p24,p25,p21,d1);
      
      c(p18,p22,p23,p26,p4,p13,p14,p17,d1);
      c(p22,p19,p26,p24,p13,p5,p17,p15,d1);
      c(p23,p26,p20,p25,p14,p17,p6,p16,d1);
      c(p26,p24,p25,p21,p17,p15,p16,p7,d1);
      
      /*
      setv(p8);
      setv(p9);
      setv(p10);
      setv(p11);
      setv(p12);
      
      setv(p13);
      setv(p14);
      setv(p15);
      setv(p16);
      setv(p17);
      
      setv(p18);
      setv(p19);
      setv(p20);
      setv(p21);
      
      setv(p22);
      setv(p23);
      setv(p24);
      setv(p25);
      setv(p26);
      */
      }
      
      //...
    }
    
    
    colors=new Array(ps.colorCount||6);
    let gradient=ps.colorGradient||[
      {r:1,g:0,b:0,w:0},
      {r:0,g:1,b:0,w:1}
    ],gw=0;
    for (let g of gradient) { if (g.w===undefined) g.w=1;gw+=g.w; }
    if (gw<=0) { console.error('sum of gradient.weights must be > 0.');return; }
    var cl=colors.length;
    for (let i=0;i<cl;i++) {
      let f=i/(cl-1);
      let gwi=f*gw;
      let gi=0,g;
      while (1) {
        g=gradient[gi];
        if ((gwi<g.w)
          //||((g.w>0)&&(gwi==g.w))
          ||(gi==gradient.length-1)
          ) break;
        gwi-=g.w;gi++;
      }
      let f1=gwi/g.w,f0=1-f1;
      let g0=gradient[gi>0?gi-1:gradient.length-1];
      //onsole.log(f0+' '+f1);
      colors[i]=new THREE.Color(
        g0.r*f0+g.r*f1,
        g0.g*f0+g.g*f1,
        g0.b*f0+g.b*f1
      );
      
      
      ////colors[i]=new THREE.Color(f*0.5,(1-f)*0.5+0.5,f*0.5);
      ////colors[i]=new THREE.Color(f,(1-f),0);
      //colors[i]=new THREE.Color(1-f,f,0);
    }
    
    //{
    //  "count":30,
    //  "seed":0,
    //  "do2d":1,
    //  "colorCount":16,
    //  "colorGradient":[
    //    {"r":0.3,"g":0.3,"b":0,"w":0},
    //    {"r":0,  "g":0.8,"b":0},
    //    {"r":0.4,"g":0.4,"b":0},
    //    {"r":1,  "g":1,  "b":1}
    ////    {"r":1,"g":0,"b":0,"w":0},
    ////    {"r":0,"g":1,"b":0}
    //  ]
    //}
    
    
    
    var v,g;
    if (ps.do2d) {
      v=ps.count||30;//15
      g=1;
      for (var gz=-g;gz<=g;gz++) for (var gx=-g;gx<=g;gx++)
        q({x:(gx-1)*v,y:0,z:(gz-1)*v},
          {x:gx*v,y:0,z:(gz-1)*v},
          {x:(gx-1)*v,y:0,z:gz*v},
          {x:gx*v,y:0,z:gz*v},0);
    //q({x:v,y:0,z:-v},{x:v*2,y:0,z:-v},{x:v,y:0,z:v},{x:v*2,y:0,z:v},0);
    //etV(-10,-10,-10,{c:1});
    //etV(-5,-5,-5,{c:1});
    } else {
      var c0=ps.c0||0,c1=ps.c1||0;
      v=ps.count||30;//30
      var v0=-v,v1=v;
      var v0=0,v1=2*v;
      c(
      {x:v0,y:v0,z:v0,c:c0},
      {x:v1,y:v0,z:v0,c:c0},
      {x:v0,y:v0,z:v1,c:c0},
      {x:v1,y:v0,z:v1,c:c0},
      {x:v0,y:v1,z:v0,c:c1},
      {x:v1,y:v1,z:v0,c:c1},
      {x:v0,y:v1,z:v1,c:c1},
      {x:v1,y:v1,z:v1,c:c1},0);
      //{x:v0,y:v0,z:v0,c:c0},{x:v1,y:v0,z:v0,c:c0},{x:-v,y:-v,z:v,c:c0},{x:v,y:-v,z:v,c:c0},
      //{x:v0,y:v,z:-v,c:-c0},{x:v,y:v,z:-v,c:-c0},{x:-v,y:v,z:v,c:-c0},{x:v,y:v,z:v,c:-c0},0);
    }
    
    //onsole.log(va);
    Conet.log('GenerateLandscape done.');
    
    //...
  }
  function toBlocks() {
    //---
    console.log('voxels '+va.length);
    
    var vab=va.concat();
    
    var blocks=[],c=0;
    //for (var bi=0;bi<200;bi++) {//bi=blockindex
    while (1) {
    
    var mvol=0,mblock=undefined;
    for (var i=0;i<va.length;i++) {
      var v=va[i];
      //onsole.log(v);
      var ml=50;
      for (var zl=1;zl<ml;zl++) {
        var zlOk=false;
        for (var yl=1;yl<ml;yl++) {
          var ylOk=false;
          for (var xl=1;xl<ml;xl++) {
            //onsole.log('testing block dim '+xl+','+yl+','+zl);
            //c++;if (c>1000000) { console.log('canceling c='+c);return; }
            c++;if (c%100000==0) console.log('c:'+c+' blocks:'+blocks.length+' i:'+i+' mvol:'+mvol);
            var xlOk=true;
            top:
            for (var z=0;z<zl;z++) for (var y=0;y<yl;y++) for (x=0;x<xl;x++) if (!etV(v.x+x,v.y+y,v.z+z)) { 
              //console.log('no block with dim '+x+','+y+','+z);
              //return;
              xlOk=false;
              break top; 
            }
            if (!xlOk) break;
            ylOk=true;zlOk=true;
            var vol=xl*yl*zl;
            if (vol>mvol) {
              mvol=vol;
              //onsole.log(c+' block maxvol: '+v.x+' '+v.y+' '+v.z+' dim '+xl+' '+yl+' '+zl);
              mblock={x:v.x,y:v.y,z:v.z,xl:xl,yl:yl,zl:zl};
              //if (mvol>400) { // else it takes too long to search biggest block
              //  xlOk=false;ylOk=false;zlOk=false;
              //  break;
              //}
            }
          }
          if (!ylOk) break;
        }
        if (!zlOk) break;
      }
      if (mvol>400) break; // else it takes too long to search biggest block
    }
    if (!mblock) break;
    //onsole.log(mvol+' '+mblock.xl*mblock.yl*mblock.zl);
    //if (0)
    for (var z=0;z<mblock.zl;z++) for (var y=0;y<mblock.yl;y++) for (var x=0;x<mblock.xl;x++) 
      etV(mblock.x+x,mblock.y+y,mblock.z+z,null);
    blocks.push(mblock);
    }
    
    console.log('blocks '+blocks.length);
    
    //for (var v of vab) etV(v.x,v.y,v.z,v);
    
    if (1)
      for (var bi=0;bi<blocks.length;bi++) {
        var b=blocks[bi],vol=b.xl*b.yl*b.zl;
        if (vol<=4) { blocks.length=bi;break; }
        for (var z=0;z<b.zl;z++) for (var y=0;y<b.yl;y++) for (var x=0;x<b.xl;x++) 
          etV(b.x+x,b.y+y,b.z+z,{c:bi%colors.length});
      }
    else {
      for (var v of vab) etV(v.x,v.y,v.z,v);
      for (var bi=blocks.length-1;bi>=0;bi--) {
        var b=blocks[bi],vol=b.xl*b.yl*b.zl;
        if (vol>4) { blocks.length=bi+1;break; }
        for (var z=0;z<b.zl;z++) for (var y=0;y<b.yl;y++) for (var x=0;x<b.xl;x++) 
          etV(b.x+x,b.y+y,b.z+z,null);
      }
    }
    console.log('blocks '+blocks.length);
    return blocks;
  }
  
  console.log('Voxed 0.2056 ');//FOLDORUPDATEVERSION
  
  if ((!window.planim)||(window.planim.noVoxed)) {
    //window.Voxed=this;
    Voxed.generateLandscape=generateLandscape;
    Voxed.generateMesh     =generateMesh;
    Voxed.etV              =etV;
    Voxed.toBlocks=toBlocks;
    Voxed.load=load;
    
  Voxed.etVh=function(h) {
    if (h===undefined) return vh;
    vh=h;
    //...
  }
  Voxed.etVa=function(a) {
    if (a===undefined) return va;
    va=a;
    //...
  }
  Voxed.getVa=function() {
    return va;
  }
  Voxed.getColors=function() {
    return colors;
  }
    return;
  }
  
  planim.game.calc=function(dt) {
    //console.log(ccol.ci);
    //---
  }
  ;
  
  //...
  var noOrtho=planim.url.noOrtho,f4=planim.f4,base=planim.base,view=planim.addView({ortho:!noOrtho,w:1,h:1,x:0,y:0,cam:new THREE.Vector3(0.1+0.5,-0.1+1,2.5),bg:1,autoRotate:0,
    target:new THREE.Vector3(0,-0.4,0),fov:60,bgcol:bgcoldef,_vr:1,camZoom:5,zoomSpeed:1//22106 5 220911 zoomspeed:5 (without 0.5)
    });
  
  if (noOrtho) {
    view.camera.position.set(3.209,0.915,2.493);
    view.controls.target.set(0.312,-0.626,-1.027);
    //view.controls.panSpeed=0.01;
    view.controls.panSpeed=0.3;
    //view.camera.position.set(3.301,1.042,3.132);
    //view.controls.target.set(0.629,-0.499,-0.561);
  }
  
  //planim.game.rays=1;
  //planim.game.fetchOnKey=1;
  planim.dragRays=true;
  
  
  //---script funcs
  planim.getVoxels=function(ps) {
    //---
    if (ps.x!==undefined) {
      var va=[];
      for (var z=ps.z;z<ps.z+ps.dz;z++)
      for (var y=ps.y;y<ps.y+ps.dy;y++)
      for (var x=ps.x;x<ps.x+ps.dx;x++)
        if ((v=etV(x,y,z))!==undefined) va.push(v);
      var ret=JSON.stringify({voxels:va});
      if (ps.mirX||ps.mirZ||ps.swXZ) {
        va=JSON.parse(ret).voxels;
        var vh;
        for (var v of va) {
          if (ps.swXZ) { vh=v.x;v.x=ps.x+v.z-ps.z;v.z=ps.z+vh-ps.x; }
          if (ps.mirX) v.x=ps.x+(ps.dx-1-(v.x-ps.x));
          if (ps.mirZ) v.z=ps.z+(ps.dz-1-(v.z-ps.z));
        }
        ret=JSON.stringify({voxels:va});
      }
      return ret;
    }
    
    
    var ret=serialize();
    vh={};
    return ret;
    //---
  }
  ;
  planim.putVoxels=function(ps) {
    if (ps.vs) {
    var d=JSON.parse(ps.vs),sw;
    for (var v of d.voxels) {
      if (ps.colRedir) {
        var vc=ps.colRedir[v.c];
        if (vc!==undefined) v.c=vc;
      }
      if (v.c>=colors.length) v.c=0;
      if (ps.mirrorx) v.x=-v.x;
      if (ps.mirrorz) v.z=-v.z;
      if (ps.swapxz) { sw=v.x;v.x=v.z;v.z=sw; }
      v.x+=ps.dx||0;v.y+=ps.dy||0;v.z+=ps.dz||0;
      etV(v.x,v.y,v.z,v);
    }
    }
    
    else if (ps.x!==undefined) {
      var c=ps.c||0;
      if (ps.col) {
        checkIndexColor(ps.col);
        c=ps.col.ci;
      }
      for (var z=ps.z;z<ps.z+ps.dz;z++)
      for (var y=ps.y;y<ps.y+ps.dy;y++)
      for (var x=ps.x;x<ps.x+ps.dx;x++) {
        if (ps.f) { 
          var r=ps.f(2*(x-ps.x)/(ps.dx-1)-1,2*(y-ps.y)/(ps.dy-1)-1,2*(z-ps.z)/(ps.dz-1)-1);
          if (!r) continue;
          if (r.col) { checkIndexColor(r.col);c=r.col.ci; }
        }
        etV(x,y,z,ps.null?null:{c:c});
      }
    }
    
    if (!ps.nomesh) voxMesh();
    //...
  }
  ;
  planim.inpDown=function(inp) {
    //console.log('voxed.inpDown');
    //console.log(inp);
    //...
  }
  ;
  planim.inpMove=function(inp) {
    if (inp.dist===undefined) return;
    //console.log('voxed.inpMove');
    //console.log(inp);
    var f=1,a=-view.camera.rotation.y,
        cosa=Math.cos(a),sina=Math.sin(a),
        x=inp.dx*cosa-inp.dy*sina,
        y=inp.dx*sina+inp.dy*cosa;
    //console.log(a);
    view.camera.position.x-=x*f;
    view.controls.target.x-=x*f;
    view.camera.position.z-=y*f;
    view.controls.target.z-=y*f;
    //...
  }
  ;
  planim.scriptNienhagenText=scriptNienhagenText;//<-temp
  //---
  function snake4dInit() {
    //...
    //if (1) return;
    //---
    var d=userData.snake4d,bo=2,z0=5,
        snake=[[3,3,3,3],[4,3,3,3],[5,3,3,3],[6,3,3,3],[7,3,3,3],[8,3,3,3]],
        coli=6,colen=30,food=[1,3,3,3],mreplay,replay=[],replaying=false,replayi=0,
        replayId;
    
    function line(x0,y0,z0,dx,dy,dz,l,c) {
      //---
      for (var i=0;i<l;i++) etV(x0+i*dx,y0+i*dy,z0+i*dz,{c:c});
      //...
    }
    function box(x0,y0,z0,xl,yl,zl,c) {
      
      line(x0,y0,z0,1,0,0,xl,c);
      line(x0,y0+yl-1,z0,1,0,0,xl,c);
      line(x0,y0,z0+zl-1,1,0,0,xl,c);
      line(x0,y0+yl-1,z0+zl-1,1,0,0,xl,c);
      
      line(x0,y0,z0,0,1,0,yl,c);
      line(x0+xl-1,y0,z0,0,1,0,yl,c);
      line(x0,y0,z0+zl-1,0,1,0,yl,c);
      line(x0+xl-1,y0,z0+zl-1,0,1,0,yl,c);
      
      line(x0,y0,z0,0,0,1,zl,c);
      line(x0+xl-1,y0,z0,0,0,1,zl,c);
      line(x0,y0+yl-1,z0,0,0,1,zl,c);
      line(x0+xl-1,y0+yl-1,z0,0,0,1,zl,c);
      
      //for (var x=0;x<dx;x++) {
      //  etV(x0+x,y0,z0,{c:c});
      //  etV(x0+x,y0+dy-1,z0,{c:c});
      //  etV(x0+x,y0,z0+dz-1,{c:c});
      //  etV(x0+x,y0+dy-1,z0+dz-1,{c:c});
      //}
      
      //...
    }
    function drawPoint(x,y,z,o,c) {
      etV(-d+2-bo+x,bo+1+y   ,z0-d+1+z,{c:c});
      etV(bo+1+x   ,bo+1+y   ,z0-d+1+o,{c:c});
      etV(-d+2-bo+x,-d+2-bo+o,z0-d+1+z,{c:c});
      etV(bo+1+o   ,-d+2-bo+y,z0-d+1+z,{c:c});
      //...
    }
    function drawSnake() {
      //---
      planim.putVoxels({x:-d+2-bo,y:bo+1,z:z0-d+1   ,dx:d-2,dy:d-2,dz:d-2,null:1,nomesh:1});
      planim.putVoxels({x:bo+1,y:bo+1,z:z0-d+1      ,dx:d-2,dy:d-2,dz:d-2,null:1,nomesh:1});
      planim.putVoxels({x:-d+2-bo,y:-d+2-bo,z:z0-d+1,dx:d-2,dy:d-2,dz:d-2,null:1,nomesh:1});
      planim.putVoxels({x:bo+1,y:-d+2-bo,z:z0-d+1   ,dx:d-2,dy:d-2,dz:d-2,null:1,nomesh:1});
      
      
      for (var i=snake.length-1;i>=0;i--) {
        var si=snake[i],c=i==0?coli:coli+1+Math.floor(i*colen/snake.length);
        drawPoint(si[0],si[1],si[2],si[3],c);
        //etV(-d+2-bo+si[0],bo+1+si[1]   ,z0-d+1+si[2],{c:c});
        //etV(bo+1+si[0]   ,bo+1+si[1]   ,z0-d+1+si[3],{c:c});
        //etV(-d+2-bo+si[0],-d+2-bo+si[3],z0-d+1+si[2],{c:c});
        //etV(bo+1+si[3]   ,-d+2-bo+si[1],z0-d+1+si[2],{c:c});
      }
      drawPoint(food[0],food[1],food[2],food[3],2);
      
      voxMesh();
      //...
    }
    function isfree(x,y,z,o) {
      var sd=d-2;
      if ((x<0)||(x>=sd)||(y<0)||(y>=sd)||(z<0)||(z>=sd)||(o<0)||(o>=sd)) return false;
      for (var i=snake.length-1;i>=0;i--) {
        var s=snake[i];
        if ((x==s[0])&&(y==s[1])&&(z==s[2])&&(o==s[3])) return false;
      }
      return true;
      //...
    }
    function placeFood() {
      //---
      var l=d-2;
      while (1) {  
        var x=Math.floor(Math.random()*l),y=Math.floor(Math.random()*l)
           ,z=Math.floor(Math.random()*l),o=Math.floor(Math.random()*l);
        if (isfree(x,y,z,o)) {
          food=[x,y,z,o];
          break;
        }
      }
      //...
    }
    function move() {
      //---
      if (replaying) { Conet.log('To continue game, stop replay.');return; }
      //onsole.log(this.md);
      var s0=snake[0],md=this.md,x1=s0[0]+md[0],y1=s0[1]+md[1],z1=s0[2]+md[2],o1=s0[3]+md[3];
      
      var free=isfree(x1,y1,z1,o1);
      
      Conet.log((free?'Moving ':'Cant move ')+s0[0]+','+s0[1]+','+s0[2]+','+s0[3]+' -> '+x1+','+y1+','+z1+','+o1);
      if (!free) return;
      
      var yum=((x1==food[0])&&(y1==food[1])&&(z1==food[2])&&(o1==food[3]));
      
      snake.splice(0,0,[x1,y1,z1,o1]);
      if (yum) {
        placeFood();
        Conet.log('Got food. Length is '+snake.length+'.');
      } else
        snake.length=snake.length-1;
      
      replay.push(JSON.stringify({snake:snake,food:food}));
      //onsole.log(replay);
      mreplay.ms='Replay length '+(replay.length-1);
      
      
      //planim.putVoxels({x:-d+2-bo,y:bo+1,z:z0-d+1   ,dx:d-2,dy:d-2,dz:d-2,null:1,nomesh:1});
      //planim.putVoxels({x:bo+1,y:bo+1,z:z0-d+1      ,dx:d-2,dy:d-2,dz:d-2,null:1,nomesh:1});
      //planim.putVoxels({x:-d+2-bo,y:-d+2-bo,z:z0-d+1,dx:d-2,dy:d-2,dz:d-2,null:1,nomesh:1});
      //planim.putVoxels({x:bo+1,y:-d+2-bo,z:z0-d+1   ,dx:d-2,dy:d-2,dz:d-2,null:1,nomesh:1});
      drawSnake();
      //voxMesh();
      
      //...
    }
    
    function replayToggle() {
      //---
      replaying=!replaying;
      mreplay.s=replaying?'Stop Replay':'Start Replay';
      
      if (replaying) {
        replayi=-1;
        replayId=setInterval(
      function() {
        //---
        replayi=(replayi+1)%replay.length;
        var h=JSON.parse(replay[replayi]);
        snake=h.snake;
        food=h.food;
        drawSnake();
        
        //onsole.log(replayi);
        //...
      }
        ,100);
      } else {
        clearInterval(replayId);
        
        var h=JSON.parse(replay[replay.length-1]);
        snake=h.snake;
        food=h.food;
        drawSnake(); 
      }
      //...
    }
    
    var vs=planim.getVoxels({x:2,y:-5,z:-9,dx:11,dy:11,dz:1});
    planim.putVoxels({vs:vs,dx:15,dz:5});
    planim.putVoxels({x:2,y:-5,z:-9,dx:11,dy:11,dz:1,null:1});
    
    vs=planim.getVoxels({x:-12,y:-5,z:-9,dx:11,dy:11,dz:1});
    planim.putVoxels({vs:vs,dx:-15,dz:5});
    planim.putVoxels({x:-12,y:-5,z:-9,dx:11,dy:11,dz:1,null:1});
    
    placeFood();
    replay.push(JSON.stringify({snake:snake,food:food}));
    planim.replay=replay;//--- to possibly store replay
    //onsole.log(replay);
    
    var col0=[0.1,0.7,0.1],col1=[0.1,0.1,0.7];
    for (var i=0;i<colen;i++) {
      var f1=i/(colen-1),f0=1-f1;
      colors[coli+1+i]=new THREE.Color(f0*col0[0]+f1*col1[0]
        ,f0*col0[1]+f1*col1[1],f0*col0[2]+f1*col1[2]);
    }
    colors[coli]=new THREE.Color(0.1,0.9,0.1);
    colors[2]=new THREE.Color(0.9,0.1,0.1);
    
    d+=2;
    box(-d+1-bo,bo     ,z0-d,d,d,d,0);
    box(bo     ,bo     ,z0-d,d,d,d,0);
    box(-d+1-bo,-d+1-bo,z0-d,d,d,d,0);
    box(bo     ,-d+1-bo,z0-d,d,d,d,0);
    drawSnake();
    
    Menu.remove();
    var ma=Menu.getMenus(),w=0.07,b=0.01,l='&lt;',r='>';//\u2bc7 2bc8 25c0 25b6
    ma.push(mreplay={s:'Start Replay',fs:0.9,ms:'Replay length 0',actionf:replayToggle});
    ma.push({s:'X'+r,vertCenter:1,ydown:true,xright:true,px:b  ,py:b+b+3*w,pw:w,ph:w,actionf:move,md:[ 1,0,0,0]});
    ma.push({s:l+'X',vertCenter:1,ydown:true,xright:true,px:b+w,py:b+b+3*w,pw:w,ph:w,actionf:move,md:[-1,0,0,0]});
    ma.push({s:'Y'+r,vertCenter:1,ydown:true,xright:true,px:b  ,py:b+b+2*w,pw:w,ph:w,actionf:move,md:[0, 1,0,0]});
    ma.push({s:l+'Y',vertCenter:1,ydown:true,xright:true,px:b+w,py:b+b+2*w,pw:w,ph:w,actionf:move,md:[0,-1,0,0]});
    ma.push({s:'Z'+r,vertCenter:1,ydown:true,xright:true,px:b  ,py:b+b+w  ,pw:w,ph:w,actionf:move,md:[0,0, 1,0]});
    ma.push({s:l+'Z',vertCenter:1,ydown:true,xright:true,px:b+w,py:b+b+w  ,pw:w,ph:w,actionf:move,md:[0,0,-1,0]});
    ma.push({s:'O'+r,vertCenter:1,ydown:true,xright:true,px:b  ,py:b+b    ,pw:w,ph:w,actionf:move,md:[0,0,0, 1]});
    ma.push({s:l+'O',vertCenter:1,ydown:true,xright:true,px:b+w,py:b+b    ,pw:w,ph:w,actionf:move,md:[0,0,0,-1]});
    Menu.roots=ma;
    Menu.draw();
    
    planim.views[0].controls.target.z=0;
    
    if (0)
    app=new function() {
      //...
      this.init=function() {
        //---
        console.log('snake4 init nao');
        //...
      }
      //console.log(this);
      //return this;
    }
    
    //...
  }
  function deepPartsInit() {
    //---
    //onsole.log('NAO');
    
    Conet.download({fn:'/canvas/w3dit/deepParts.json',f:function(v) {
      var va0={},//---grid of deepparts, parallel to va
          ma=[],
          mh=new THREE.Matrix4(),mh0=new THREE.Matrix4(),
          triTurnVerts=[];
      
      //--
      function inQuat(p0,p1,p) {
        return !(
          (p.x<p0.x)||(p.x>p1.x)||
          (p.y<p0.y)||(p.y>p1.y)||
          (p.z<p0.z)||(p.z>p1.z)
        );
        //...
      }
      function renderPos(x,y,z) {
        //...
        var k=x+'_'+y+'_'+z;
        
        if (va0[k]!==undefined) { 
          //onsole.log('va0[k] defined');
          return;
        }
        var sh=(etV(x,y,z)?'1':'0')
          +(etV(x+1,y,z)?'1':'0')
          +(etV(x,y,z+1)?'1':'0')
          +(etV(x+1,y,z+1)?'1':'0')
          +(etV(x,y+1,z)?'1':'0')
          +(etV(x+1,y+1,z)?'1':'0')
          +(etV(x,y+1,z+1)?'1':'0')
          +(etV(x+1,y+1,z+1)?'1':'0');
        
        va0[k]=sh;
        //onsole.log(x+' '+y+' '+z+' -> '+sh);
        
        var i=5,ry=0,pi2=pi/2,sx=1,sy=1,sz=1;
        //if      (sh=='01000000') i=0;
        //else if (sh=='00010000') i=0;
        
        switch (sh) {
        case '01000000':i=0;break;
        case '00010000':i=0;ry=-pi2;break;
        case '10000000':i=0;ry=pi2;break;
        case '00100000':i=0;ry=pi;break;
        
        case '11000000':i=1;break;
        case '00110000':i=1;ry=pi;break;
        case '10100000':i=1;ry=pi2;break;
        case '01010000':i=1;ry=-pi2;break;
        
        case '11010000':i=2;break;
        case '11100000':i=2;ry=pi2;break;
        case '01110000':i=2;ry=-pi2;break;
        case '10110000':i=2;ry=pi;break;
        
        case '11110000':i=4;break;
        
        case '01000100':i=5;break;
        case '10001000':i=5;ry=pi2;break;
        case '00100010':i=5;ry=pi;break;
        case '00010001':i=5;ry=-pi2;break;
        
        case '11001100':i=6;break;
        case '00110011':i=6;ry=pi;break;
        case '10101010':i=6;ry=pi2;break;
        case '01010101':i=6;ry=-pi2;break;
        
        case '10111011':i=7;ry=pi;break;
        case '11011101':i=7;break;
        case '11101110':i=7;ry=pi2;break;
        case '01110111':i=7;ry=-pi2;break;
        
        
        case '11111000':i=9;ry=pi2;break;
        case '11110100':i=9;break;
        case '11110010':i=9;ry=pi;break;
        case '11110001':i=9;ry=-pi2;break;
        
        case '11110011':i=10;ry=pi;break;
        case '11111100':i=10;break;
        case '11111010':i=10;ry=pi2;break;
        case '11110101':i=10;ry=-pi2;break;
        
        case '11111110':i=11;ry=pi2;break;
        case '11111101':i=11;break;
        case '11111011':i=11;ry=pi;break;
        case '11110111':i=11;ry=-pi2;break;
        
        
        
        
        case '11100100':i=12;ry=-pi2;break;
        case '10110001':i=31;ry=pi2;sz=-1;break;
        case '11010001':i=12;ry=pi;break;
        case '01110100':i=31;sz=-1;ry=pi;break;
        case '11011000':i=31;sz=-1;ry=-pi2;break;
        case '01110010':i=12;ry=pi2;break;
        case '10111000':i=12;break;
        case '11100010':i=31;sz=-1;break;
        
        
        
        case '00001000':i=13;ry=pi2;break;
        case '00000100':i=13;break;
        case '00000010':i=13;ry=pi;break;
        case '00000001':i=13;ry=-pi2;break;
        
        case '00001100':i=14;break;
        case '00000011':i=14;ry=pi;break;
        case '00001010':i=14;ry=pi2;break;
        case '00000101':i=14;ry=-pi2;break;
        
        case '00001110':i=15;ry=pi2;break;
        case '00001101':i=15;break;
        case '00001011':i=15;ry=pi;break;
        case '00000111':i=15;ry=-pi2;break;
        
        case '00001111':i=17;break;
        
        case '01111111':i=18;ry=pi;break;
        case '10111111':i=18;ry=pi2;break;
        case '11011111':i=18;ry=-pi2;break;
        case '11101111':i=18;break;
        
        
        case '11001111':i=19;break;
        case '00111111':i=19;ry=pi;break;
        case '10101111':i=19;ry=pi2;break;
        case '01011111':i=19;ry=-pi2;break;
        
        case '11000100':i=22;ry=-pi2;break;
        //case '00110001':i=22;ry=pi2;break;
        case '00110001':i=23;ry=-pi2;sx=-1;break;//--> verts right place, problem: faces point inside, faces must be turned on meshbuild
        case '11001000':i=23;ry=-pi2;sz=-1;break;
        case '00110010':i=22;ry=pi2;break;
        case '10101000':i=22;break;
        case '10100010':i=23;ry=pi;sx=-1;break;
        case '01010100':i=23;sx=-1;break;
        case '01010001':i=22;ry=pi;break;
        
        case '10001111':i=24;sy=-1;ry=pi;sx=-1;break;
        //se '10001111':i=15;sy=-1;ry=pi2;sx=-1;sz=-1;break;//--- geht auch aber falscher schatten
        case '01001111':i=24;sy=-1;ry=pi2;sx=-1;break;
        case '00101111':i=24;sy=-1;ry=-pi2;sx=-1;break;
        case '00011111':i=24;sy=-1;ry=0;sx=-1;break;
        
        case '11011100':i=25;break;
        case '11101100':i=26;sx=-1;break;//---same: case '11101100':i=26;sz=-1;ry=pi;break;
        case '01110011':i=26;sz=-1;break;
        case '10110011':i=25;ry=pi;break;
        
        case '01110101':i=25;ry=-pi2;break;
        case '11010101':i=26;sx=-1;ry=-pi2;break;
        
        case '11101010':i=25;ry=pi2;break;
        case '10111010':i=26;sx=-1;ry=pi2;break;
        
        case '01001100':i=27;ry=-pi2;break;
        case '10001100':i=28;ry=-pi2;sz=-1;break;
        case '00100011':i=27;ry=pi2;break;
        case '00010011':i=28;ry=pi2;sz=-1;break;
        case '10001010':i=27;break;
        case '00101010':i=28;sz=-1;break;
        case '00010101':i=27;ry=pi;break;
        case '01000101':i=28;ry=pi;sz=-1;break;
        
        case '11001101':i=29;break;
        case '11001110':i=30;sx=-1;break;
        case '00111011':i=29;ry=pi;break;
        case '00110111':i=30;ry=pi;sx=-1;break;
        case '10101110':i=29;ry=pi2;break;
        case '10101011':i=30;ry=pi2;sx=-1;break;
        case '01010111':i=29;ry=-pi2;break;
        case '01011101':i=30;ry=-pi2;sx=-1;break;
        
        case '10001011':i=32;break;
        case '01000111':i=33;sx=-1;break;
        case '00011101':i=32;ry=pi;break;
        case '00101110':i=33;ry=pi;sx=-1;break;
        case '00100111':i=32;ry=pi2;break;
        case '10001101':i=33;ry=pi2;sx=-1;break;
        case '01001110':i=32;ry=-pi2;break;
        case '00011011':i=33;ry=-pi2;sx=-1;break;
        
        case '11001010':i=35;sx=-1;break;
        case '11000101':i=34;break;
        case '00110101':i=35;sz=-1;break;
        case '00111010':i=34;ry=pi;break;
        
        case '10101100':i=34;ry=pi2;break;
        case '01011100':i=35;ry=-pi2;sx=-1;break;
        case '01010011':i=34;ry=-pi2;break;
        case '10100011':i=35;ry=pi2;sx=-1;break;
        }
        
        //if (i!=11) i=5;
        
        var m=ma[i];
        mh.makeTranslation(x/10,y/10,z/10);
        
        
        if (ry!=0) {
          mh0.makeRotationY(ry);
          mh.multiply(mh0);
        }
        
        if ((sx!=1)||(sy!=1)||(sz!=1)) {
          mh0.makeScale(sx,sy,sz);//sx,sy,sz);
          mh.multiply(mh0);
        }
        
        
        
        m.mesh.setMatrixAt(m.i,mh);m.i++;
        
        return sh;
        //---
      }
      function fe(v0,v1) {
        return Math.abs(v0-v1)<0.0001;
        //...
      }
      function renderNV() {
        //---
        //onsole.log('renderNV');
        //return;
        
        var g=this.meshes[0].tmesh.geometry;
        //ar minx=1000,maxx=-1000;
        for (var f of g.faces) {
          //onsole.log(f);
          for (var i=0;i<3;i++) {
            var vi=i==0?f.a:(i==1?f.b:f.c),
                v=g.vertices[vi],
                n=f.vertexNormals[i],change=false;
            if (fe(v.x,0.05)||fe(v.x,-0.05)) { n.x=0;change=true; }
            if (fe(v.y,0.05)||fe(v.y,-0.05)) { n.y=0;change=true; }
            if (fe(v.z,0.05)||fe(v.z,-0.05)) { n.z=0;change=true; }
            //if (v.y==0) { n.y=0;change=true; }
            //if (v.z==0) { n.z=0;change=true; }
            if (change) { 
              n.normalize(); 
              //onsole.log('change');
            }
            //else console.log('no change');
            //onsole.log(v);
            //minx=Math.min(minx,v.z);
            //maxx=Math.max(maxx,v.z);
          }
          
          //for (var n of f.vertexNormals) n.set(0,1,0);
          //console.log(v);
          //v.normal.set(0,1,0);
        }
        //onsole.log('minx='+minx+' maxx='+maxx);
        //this.renderNV=undefined;
        //...
      }
      function renderAll() {
        //---
        //onsole.log('renderAll '+va.length+' '+ma.length);
        for (var i=0;i<ma.length;i++) {
          var mai=ma[i],me=mai.mesh;
          mai.i=0;
          //m.rotateY(Math.PI/2);
          //m.position.set(i/10,0,0);//1*i/100,0,0);
          for (var j=0;j<me.count;j++) {
            var x=i%10,y=i/10;
            mh.makeTranslation(1+x/8,-y/8,0);//j/100);
            me.setMatrixAt(j,mh);
          }
          //me.scale.set(2,2,2);
          //base.add(me);
          //if (va.length>2) base.remove(me);
          me.instanceMatrix.needsUpdate=true;
        }
        //if (va.length>2) return;
        va0={};
        //onsole.log(va);
        for (var v of va) {
          //onsole.log(v);
          renderPos(v.x,v.y,v.z);
          renderPos(v.x-1,v.y,v.z);
          renderPos(v.x,v.y,v.z-1);
          renderPos(v.x-1,v.y,v.z-1);
        
          renderPos(v.x,v.y-1,v.z);
          renderPos(v.x-1,v.y-1,v.z);
          renderPos(v.x,v.y-1,v.z-1);
          renderPos(v.x-1,v.y-1,v.z-1);
        }
        //...
      }
      function triTurnVert(x,y,z,u,v) {
        //if (0)
        for (var ve of triTurnVerts) 
          if (fe(ve.p0.x,x)&&fe(ve.p0.y,y)&&fe(ve.p0.z,z)&&fe(ve.u,u)&&fe(ve.v,v)) return ve;
        var ve=Pd5.vertNew(x,y,z,u,v);
        o.verts.push(ve);
        triTurnVerts.push(ve);
        return ve;
        //...
      }
      
      //---
      var o=Pd5.load(v);
      //onsole.log(o);
      o.scale=0.001;o.renderNV=renderNV;
      threeEnv.aipos=undefined;
      threeEnv.base=base;
      
      //threeAddObj(o,0,0,0,2);
      
      var m0=o.meshes[0];
      threeSetMeshMaterial(m0,o);
      //---todo: single out part verts/faces, invoke threeCreateMesh for all
      var fa=m0.fa,pa=[
        {x:-100,y:0,z:-100}//0
        ,{x:0,y:0,z:-100}
        ,{x:100,y:0,z:-100}
        ,{x:300,y:0,z:-100}
        ,{x:0,y:0,z:-200}
        
        ,{x:-100,y:-100,z:-100}//5
        ,{x:0,y:-100,z:-100}
        ,{x:100,y:-100,z:-100}
        ,{x:300,y:-100,z:-100}
      
        ,{x:-100,y:-200,z:-100}//9
        ,{x:0,y:-200,z:-100}
        ,{x:100,y:-200,z:-100}
        ,{x:300,y:-200,z:-100}
      
        ,{x:-100,y:-300,z:-100}//13
        ,{x:0,y:-300,z:-100}
        ,{x:100,y:-300,z:-100}
        ,{x:300,y:-300,z:-100}
        ,{x:0,y:-300,z:-200}
        ,{x:-100,y:-300,z:-300}
        ,{x:0,y:-300,z:-300}
      
        ,{x:300,y:-400,z:-100}//20
        ,{x:300,y:-500,z:-100}
      
        ,{x:300,y:-200,z:-200}
        ,{x:300,y:-200,z:-200,triTurn:1}
        ,{x:100,y:-300,z:-100,triTurn:1}
        
        ,{x:400,y:-100,z:-100}
        ,{x:400,y:-100,z:-100,triTurn:1}
      
        ,{x:300,y:-300,z:-200}
        ,{x:300,y:-300,z:-200,triTurn:1}
      
        ,{x:400,y:-200,z:-100}
        ,{x:400,y:-200,z:-100,triTurn:1}
      
        ,{x:300,y:-200,z:-100,triTurn:1}
      
        ,{x:300,y:-300,z:-100}
        ,{x:300,y:-300,z:-100,triTurn:1}
        
        ,{x:-100,y:-400,z:-100}
        ,{x:-100,y:-400,z:-100,triTurn:1}
      
      ];
      console.log('pa.len='+pa.length);
      var triTurnVerts=[];
      for (var p0 of pa) {
        var fa0=[],p1={x:p0.x+100,y:p0.y+100,z:p0.z+100};
        for (t of fa) {
          if (inQuat(p0,p1,t.v0.p0)&&inQuat(p0,p1,t.v1.p0)&&inQuat(p0,p1,t.v2.p0)) {
            //delete(t.v0.ive2);delete(t.v1.ive2);delete(t.v2.ive2);
            //onsole.log(t);
            if (p0.triTurn) {
              t={
                v0:triTurnVert(t.v0.p0.x,t.v0.p0.y,t.v0.p0.z,t.v0.u,t.v0.v),
                v1:triTurnVert(t.v2.p0.x,t.v2.p0.y,t.v2.p0.z,t.v2.u,t.v2.v),
                v2:triTurnVert(t.v1.p0.x,t.v1.p0.y,t.v1.p0.z,t.v1.u,t.v1.v),
              };
              //o.verts.push(t.v0);
              //o.verts.push(t.v1);
              //o.verts.push(t.v2);
            }
            delete(t.v0.ive2);delete(t.v1.ive2);delete(t.v2.ive2);
            
            fa0.push(t);
          }
        }
        m0.fa=fa0;
        if (fa0.length==0) console.error('fa0.length 0');
        //onsole.log(fa0.length);
        //---
        o.instances=80;
        threeCreateMesh(o,true,0,0,0,1);//-p0.x/1000,-p0.y/1000,-p0.z/1000,1);
        //Pd5.calc(o,0,0,0,1,{x:0,y:0,z:0},0,0,true);
        o.x=-p0.x-50;o.y=-p0.y-50;o.z=-p0.z-50;
        threeEnv.os.push(o);
        //o.renderNV=p0.triTurn?renderNV:undefined;
        threeRender(0);
        threeEnv.os.pop();
        //base.remove(m0.tmesh);
        ma.push({mesh:m0.tmesh,i:0,count:o.instances});
      }
      
      renderAll();
      Voxed.onVoxMesh=renderAll;
      
      //o.animStop=true;
      //threeEnv.nocalc=1;
      //threeEnv.os.push(o);
      
      
      //...
    }
    });
    
    //...
  }
  function deep8voxbInit() {
    //...
    
    function dupO5(ps) {
      //---
      var o=ps.o;
      
      if (!o.cv) {
        o.cv=o.verts.length;
        o.ct=o.meshes[0].fa.length;
        console.log('o.cv='+o.cv);
      }
      
      var vl=o.verts.length;
      
      for (var i=0;i<o.cv;i++) {
        var v=o.verts[i],vn;v._i=i;
        //v.p0.x*=2;
        o.verts.push(vn=Pd5.vertNew(
          v.p0.x+ps.x/o.scale,
          v.p0.y+ps.y/o.scale,
          v.p0.z+ps.z/o.scale,
          v.u,v.v));//vn.ws=[];
      }
      var m=o.meshes[0];
      //var ct=m.fa.length;
      for (var i=0;i<o.ct;i++) {
        var t=m.fa[i],tn;
        //onsole.log(t);
        m.fa.push(tn=Pd5.triNew(
          o.verts[t.v0._i+vl],
          o.verts[t.v1._i+vl],
          o.verts[t.v2._i+vl]));
        tn.p=t.p;
      }
      
      //...
    }
    
    function bbdraw(bb) {
      //---
      //console.log('bbdraw');
      
      var c=bb.c,w=c.width,h=c.height*bb.ar,ct=bb.ct;//c.getContext('2d');
      ct.clearRect(0,0,w,h);
      ct.fillStyle='rgba(0,0,0,0.5)';ct.fillRect(0,0,w,h);//p.c=c;p.ct=ct;
      //ct.font='20px sans-serif';ct.textBaseline='top';ct.fillStyle='#ff0';
      //ct.fillText('-> '+Math.random(),2,2);
      var o=bb.o,f=o.health/o.mhealth;
      //console.log(o);
      //ct.fillStyle='rgba(255,0,0,0.5)';
      var wb=o.bbwb||2,w0=(w-wb*2)*f;
      if (!o.bbtransp) {
        ct.fillStyle='rgba(0,255,0,1)';ct.fillRect(wb,wb,w0,h-wb*2);
        ct.fillStyle='rgba(255,0,0,1)';ct.fillRect(wb+w0,wb,(w-wb*2)-w0,h-wb*2);
      } else {
        ct.fillStyle='rgba(0,255,0,0.3)';ct.clearRect(wb,wb,w0,h-wb*2);ct.fillRect(wb,wb,w0,h-wb*2);
        ct.fillStyle='rgba(255,0,0,0.3)';ct.clearRect(wb+w0,wb,(w-wb*2)-w0,h-wb*2);ct.fillRect(wb+w0,wb,(w-wb*2)-w0,h-wb*2);
      }
      
      if (o.wait) {
      
        for (var i=0;i<o.wait;i++) {
      
          ct.fillStyle='rgba(0,0,0,0.5)';
          var wh=h*0.55,w1=h*0.4,wb=h*0.65;
          ct.fillRect(i*wb+(h-wh)/2,(h-wh)/2,wh,wh);
          if (i<o.waitCounter) {
            ct.fillStyle='rgba(250,250,250,1)';
            ct.fillRect(i*wb+(h-w1)/2,(h-w1)/2,w1,w1);
          }
        }
      
      }
      
      //...
    }
    
    //---
    console.log('deep8voxbInit');
    Sound.vol=0.2;
    
    //var fn='/canvas/w3dit/deep8voxb.json';
    var fn='/shooter/objs/shrub/conifer.json',
        sprite=new THREE.TextureLoader().load('/shooter/boom.png'),
        units=[],posUnit,playerUnit=0,PI=Math.PI,mauto,tanim=200,clh,season=0;
    
    Conet.load(clh={a:[
      //{fn:'/canvas/w3dit/deep8voxb.json',c:1500,sc:0.001,dy:0}
      {fn:'/three/deep/deep8voxb/blockSmall.json',c:1500,sc:0.001,dy:0//c:1500
         //,diff:'/three/deep/deep8voxb/blockSummerTex.json'
         //,diff:'/three/deep/deep8voxb/blockWinterTexDiff.png'
         }
      ,{fn:'/shooter/objs/shrub/conifer.json',c:500,sc:0.004,dy:-0.08}//c:500
      ,{fn:'/shooter/objs/templar/o5.txt',sc:0.5 ,dy:0,dimy:2,animIdle:'stand2',animAttack:'attack2',animHit:'hit',animLost:'lost'
         ,bby:0.23,bbgw:14,mhealth:2,party:1
       }
      ,{fn:'/shooter/objs/bane/o5.txt'   ,sc:0.07,dy:0,dimy:1,animIdle:'stand',animAttack:'hit',animHit:'hit',animLost:'lost',roty:0,rotofs:PI/2,count:7
         ,bby:0.13,bbgw:14,mhealth:4,wait:1,party:2
       }
      //,{fn:'/shooter/objs/bane/o5.txt'   ,sc:0.07,dy:0,dimy:1,animIdle:'stand',roty:0,rotofs:PI/2}
      //,{fn:'/shooter/objs/templar/o5.txt',sc:0.5,dy:0,dimy:2}
    ],
    
    onAll:function() {
      //---
      //onsole.log(this);
      var a=this.a,useInstances=true;
      
      //threeEnv.aipos=undefined;
      threeEnv.base=base;
      var scale=0.5,lights=[],fogs=[];
      
      for (var h of a) {
       for (var j=0;j<(h.count||1);j++) {
        var o=Pd5.load(h.v);
        if (h.diff) o.meshes[0].diff=h.diff;
        o.scale=h.sc*scale;
        if (h.c) {
          if (useInstances) 
            o.instances=h.c;
          else 
          //if (h.c===500) 
          {
            ////onsole.log(o);
            //o.cv=o.verts.length;
            //o.ct=o.meshes[0].fa.length;
            
            ////if (o.bones) Pd5.animStart(o,'idle');
            Pd5.calc(o,0,0.0,0,o.scale,{x:0,y:0,z:0},0,0,true);
            ////o.verts[0].p0.x+=1000;
            ////var cv=o.verts.length;
            //for (var i=0;i<o.cv;i++) {
            //  var v=o.verts[i],vn;v._i=i;
            //  //v.p0.x*=2;
            //  o.verts.push(vn=Pd5.vertNew(v.p0.x+0.11/o.scale,v.p0.y,v.p0.z,v.u,v.v));//vn.ws=[];
            //}
            //var m=o.meshes[0];
            ////var ct=m.fa.length;
            //for (var i=0;i<o.ct;i++) {
            //  var t=m.fa[i],tn;
            //  //onsole.log(t);
            //  m.fa.push(tn=Pd5.triNew(
            //    o.verts[t.v0._i+o.cv],
            //    o.verts[t.v1._i+o.cv],
            //    o.verts[t.v2._i+o.cv]));
            //  tn.p=t.p;
            //}
            //dupO5({o:o,x:0.11,y:0,z:0});
            //dupO5({o:o,x:0.11*2,y:0,z:0});
            
            //Pd5.calc(o,0,0.0,0,o.scale,{x:0,y:0,z:0},0,0,true);
            //o.skipCalc=true;
          }
          //o.noOsAdd=true; 
          o.ps={pos:new THREE.Vector3(0,0,0)};    
        } else {
          //if (h.count) o.stopAfterAnim=1;
          Pd5.animStart(o,h.animIdle);
          Pd5.calc(o,0,0.0,0,1,{x:0,y:0,z:0},0,0,true);
          o.ps={pos:new THREE.Vector3(0,0,0),dir:0};
          Conet.hcopy(h,o.ps);
          if (!o.ps.health) o.ps.health=o.ps.mhealth;
          var oyw=1,ps=o.ps;
          o.ps.bbdraw=bbdraw;
          o.bb=threeBillboardAdd({x:0,y:0,z:0,ar:ps.bbar||(0.1/oyw),s:0.01*(1+(oyw-1)*2),transparent:ps.bbtransp,gw:ps.bbgw});//,cw:o.bbcw});
          o.bb.o=o.ps;
          
          //onsole.log(o);
          units.push(o);
        }
        //threeAddObj(o,0,-0.5+h.dy*scale,-0.5,0.001);
        if (!(h.c&&!useInstances)) 
          threeAddObj(o,0,0,0,1);//0.001);
        h.o=o;
        //onsole.log(h);
       }
      }
      
      function renderAll() {
        //---
        
        var m=new THREE.Matrix4(),m0=new THREE.Matrix4(),
            //o=a[0].o,im=o.meshes[0].tmesh,
            w=0.21*scale,lightI=-1,dy=-1,dz=-0.5,unitI=1;//210
            
        //console.log('deep8voxb render '+va.length+'/'+o.instances);
        //im.count=Math.min(o.instances,va.length);//parseInt(Math.random()*o.instances);
        //im.count=0;
        if (useInstances)
        for (var h of a) h.o.meshes[0].tmesh.count=0;
        
        for (var l of fogs) base.remove(l);
        fogs.length=0;
        
        posUnit=function(o) {
          //...
          var ps=o.ps,v=ps.vpos;
          //ps.pos.set(
          //  v.x*w,
          //  (v.y-0.5)*w+dy,
          //  v.z*w+dz);
            
          planim.tweenAdd({o:ps.pos,
          x:v.x*w,
          y:(v.y-0.5)*w+dy,
          z:v.z*w+dz,
          t:tanim,
          o5:o,onend:tweenIdle
          });
          
          Pd5.animStart(o,'run');
          
          
          //---
        }
        
        
        for (var i=va.length-1;i>=0;i--) {
          var v=va[i];
          Conet.seed(v.x*11+v.y*22+v.z*33);
          if (v.c==10) {
            //onsole.log('init fog');
        
        //if (!view.ortho) 
        {       
        var ge=new THREE.BufferGeometry(),ve=[];
        for (var j=0;j<30;j++) {
          ve.push((Conet.rand()-0.5)*w,(Conet.rand()-0.5)*w,(Conet.rand()-0.5)*w,);
        }
        ge.setAttribute('position',new THREE.Float32BufferAttribute(ve,3));
        var ma=new THREE.PointsMaterial({size:(view.ortho?75:2)*scale,sizeAttenuation:true,map:sprite
        ,alphaTest:0.1
        ,transparent:true});
        var points=new THREE.Points(ge,ma);
        points.position.set(
          v.x*w,
          v.y*w+dy,
          v.z*w+dz
        );
        base.add(points);fogs.push(points);
        }    
        
            continue;
          }
          if (v.c==9) {
            lightI++;
            if (lights.length<=lightI) {
              var l=new THREE.PointLight(0xffffff,2,0.5);
              l.castShadow=true;
              
        l.shadow.mapSize.width = 512; // default
        l.shadow.mapSize.height = 512; // default
        l.shadow.camera.near = 0.01; // default
        l.shadow.camera.far = 10;
                   
              //a[0].o.meshes[0].tmesh.add(l);
              base.add(l);
              lights.push(l);
              //onsole.log('light added'); 
            }
            var l=lights[lightI];
            l.position.set(
              v.x*w,
              v.y*w+dy,
              v.z*w+dz
            );
            continue;
          }
          if ((v.c==11)||(v.c==12)) {
            var ui;
            if (v.c==11) ui=0; else { ui=unitI;unitI++; }
            var o=units[ui],ps=o.ps;
            ps.vpos={x:v.x,y:v.y,z:v.z};
            //ps.pos.set(
            //  v.x*w,
            //  (v.y-0.5)*w+dy,
            //  v.z*w+dz);
            posUnit(o);
            //console.log(v);
          }
          if ((v.c==0)||(v.c==7)) {
            var h=a[(v.c==0)?0:1],o=h.o;
            if (useInstances) {
              var im=o.meshes[0].tmesh;
              if (im.count<o.instances) {
                m.makeTranslation(
                  v.x*w,
                  v.y*w+dy+h.dy*scale,
                  v.z*w+dz
                );
                im.setMatrixAt(im.count,m);
                im.count++;
              }
            } else if (v.c==7) 
            {
              o.dupc=(o.dupc||0)+1;
              //if (o.dupc<50)
              dupO5({o:o,x:v.x*0.11,y:v.y*0.11,z:v.z*0.11});
              //dupO5({o:o,x:0.11*2,y:0,z:0});
              //Pd5.calc(o,0,0.0,0,o.scale,{x:0,y:0,z:0},0,0,true);
            }
          }
        }
        
        for (var h of a) {
          var o=h.o,im=o.meshes[0].tmesh;
          if (useInstances) {
            if (im.instanceMatrix) im.instanceMatrix.needsUpdate=true;
            console.log(im.count+'/'+h.c);
          } else if (h.c) {//==500) {
            console.log('recreate mesh h.c='+h.c+' fa.len='+o.meshes[0].fa.length);
            Pd5.calc(o,0,0.0,0,o.scale,{x:0,y:0,z:0},0,0,true);
            o.skipCalc=true;
            //threeRemoveObj(o);
            threeAddObj(o,0,0,0,1);//0.001);
          }
        }
        
        //im.instanceMatrix.needsUpdate=true;
        
        //...
      }
      
      renderAll();
      Voxed.onVoxMesh=renderAll;
      
      Voxed.onBeforeLoad=function() {
        //---
        for (var h of a) {
          base.remove(h.o.meshes[0].tmesh);
        }
        for (var l of lights) {
          base.remove(l);
        }
        for (var l of fogs) {
          base.remove(l);
        }
        
        //---
        delete(Voxed.onBeforeLoad);
        delete(Voxed.onVoxMesh);
        //...
      }
      
      planim.base.remove(planim.voxMesh);
      
      setInterval(function() {
        //---
        if (mauto.checked) move();
        //...
      }
      ,500);
      //...
    }
    
    });
    
    
    function free(x,y,z,w,h,d) {
      //onsole.log('free '+x+' '+y+' '+z+' --- '+w+' '+h+' '+d);
      for (var xp=0;xp<w;xp++)
      for (var yp=0;yp<h;yp++)
      for (var zp=0;zp<d;zp++) {
        var v=etV(xp+x,yp+y,zp+z);
        if (v===undefined) continue;
        if (!((v.c==11)||(v.c==9)||(v.c==10)||(v.c==12))) {
          //onsole.log('free false');
          return false;
        }
      }
      //onsole.log('free true');
      return true;
      //...
    }
    
    function tweenIdle() {
      Pd5.animStart(this.o5,this.o5.ps.animIdle);//...
    }
    
    function unitAt(x,y,z) {
      //---
      for (var o of units) {
        if (o.ps.health==0) continue;
        var vp=o.ps.vpos;
        if ((vp.x==x)&&(vp.y==y)&&(vp.z==z)) return o;
      }
      return undefined;
      //...
    }
    
    function move() {
      //console.log(this);
      var ps,o;
      
      if (!mauto.checked) {
        ps=units[playerUnit].ps;
        ps.action=(this===mright)?'right':((this===mleft)?'left':'front');
      }
      
      //for (var o of units) { o.ps._health=o.ps.health; }
      
      //for (var o of units) {
      for (var i=0;i<units.length;i++) {
        o=units[i],ps=o.ps;
        if (!ps.vpos) break;
        
        if (ps.health==0) { Pd5.animStart(o,ps.animLost);continue; } 
      
        if (mauto.checked||(i>0)) {
        
          //if (i==1) 
          {
          
            //if (ps.wait) {
              o.bb.update=true;
              ps.waitCounter=(ps.waitCounter||0)+1;
              if (ps.waitCounter>ps.wait) { 
                ps.waitCounter=0;
                //ps.wait=Math.floor(Math.random()*3); 
              } else continue;
            //}
          
            var p0=ps.vpos,p1=units[0].ps.vpos,
                dx=p1.x-p0.x,dy=p1.y-p0.y,dz=p1.z-p0.z;
            
            var dist=Math.sqrt(dx*dx+dz*dz);
            
            var randomWalks=ps.randomWalks;
            if (randomWalks&&(dist==1)) randomWalks=undefined; //if mob can attack player, attack, ignore randomWalks
            
            if ((dist<500)&&!randomWalks) {
            
            var dir;
            if (Math.abs(dx)>Math.abs(dz)) {
              dir=dx>0?1:3;
            } else {
              dir=dz>0?0:2;
            }
            
            var dd=dir-ps.dir;
            if (Math.abs(dd)==3) dd+=dd>0?-4:4;
            ps.action=undefined;
            if (dd>0) ps.action='left';
            if (dd<0) ps.action='right';
            
            if (dd==0) {
              //var dist=Math.sqrt(dx*dx+dz*dz);
              //if (dist>1) 
              ps.action='front';
            }
            
            } else {
            
             if (ps.randomWalks) ps.randomWalks--;
            //ps.dir=dir;
            //ps.roty=ps.dir*Math.PI/2;
            
            //onsole.log(dx+' '+dy+' '+dz);
            //console.log(ps.vpos);
            //console.log(units[0].ps.vpos);
              var r=Math.random();
              ps.action=(r<0.2?'left':(r<0.4?'right':'front'));
            }
          }
        }
      
      if (ps.action=='front') { //if (ps.action=='front')) { 
        var dx=0,dy=0,dz=0;
        if (ps.dir==0) dz=1;
        else if (ps.dir==1) dx=1;
        else if (ps.dir==2) dz=-1;
        else dx=-1;
        var vp=ps.vpos,xn=vp.x+dx,yn=vp.y+dy,zn=vp.z+dz,didmove=false;//,v=etV(vp.x+dx,vp.y+dy,vp.z+dz);
        //if (walkable(v)) {
      
        var o1=unitAt(xn,yn,zn);
        if (o1) {
          //console.log(o1);
          if (o1.ps.party!=o.ps.party) {
          
      Pd5.animStart(o,o.ps.animAttack);setTimeout(function() {
        var o5=o;return function() {
          Pd5.animStart(o5,o5.ps.animIdle);
        }
      }
      (),tanim);
      if (0) {
      Pd5.animStart(o1,o1.ps.animHit);setTimeout(function() {
        var o5=o1;return function() {
          Pd5.animStart(o5,o5.ps.animIdle);
        }
      }
      (),tanim);
      }
          o1.ps.health=Math.max(0,o1.ps.health-1);o1.bb.update=true;
      
          } else ps.randomWalks=5;
             
          //---
        } else {
      
        if (free(xn,yn,zn,1,ps.dimy,1)) {
          if (!free(xn,yn-1,zn,1,1,1)) {
            vp.x+=dx;
            vp.z+=dz;
            posUnit(o);didmove=true;
          } else if (!free(xn,yn-2,zn,1,1,1)) {
            vp.x+=dx;
            vp.z+=dz;
            vp.y--;
            posUnit(o);didmove=true;
          }
        } else if (free(xn,yn+1,zn,1,ps.dimy,1)) {
          vp.x+=dx;
          vp.z+=dz;
          vp.y++;
          posUnit(o);didmove=true;
        }
        if (!didmove&&(i>0)) {
          ps.action=Math.random()<0.5?'left':'right';
          if (!ps.randomWalks) ps.randomWalks=5;
        }
        }  
      }
        if (ps.action=='right') { ps.roty=ps.dir*Math.PI/2;ps.dir=(ps.dir-1+4)%4;planim.tweenAdd({o:ps,key:'roty',value:ps.roty-PI/2,t:tanim,o5:o,onend:tweenIdle});Pd5.animStart(o,'run'); }
        if (ps.action=='left')  { ps.roty=ps.dir*Math.PI/2;ps.dir=(ps.dir+1)%4;  planim.tweenAdd({o:ps,key:'roty',value:ps.roty+PI/2,t:tanim,o5:o,onend:tweenIdle});Pd5.animStart(o,'run'); }
      
      
      
      }
      //ps.roty=ps.dir*Math.PI/2;
      //onsole.log(units[0]);
      //units[0].ay=1.5;
      //...
    }
    
    Menu.remove();
    //var ma=Menu.getMenus(),
    var w=0.1,b=0.01,l='&lt;',r='>',mright,mleft,mfront;
    var ma=[{s:'Caves',ms:'v.0.1',vertCenter:1,sub:[]}];
    
    ma[0].sub.push({s:'Toggle Voxelview',r:1,fs:0.9,actionf:function() {
      //---
      if (base.children.indexOf(planim.voxMesh)!=-1) 
        planim.base.remove(planim.voxMesh);
      else
        planim.base.add(planim.voxMesh);
      //...
    }
    },mauto={ms:'Auto Game',checkbox:1,s:Menu.soff}
    
    ,{s:'Season',vertCenter:1,r:1,actionf:function() {
      //---
      if (0) {
        planim.base.remove(clh.a[0].o.meshes[0].tmesh);
        return;
      }
      //alert(32);
      //console.log(clh.a[0].o);
      var a=[
      '/three/deep/deep8voxb/blockSummerTexDiff.json',
      '/three/deep/deep8voxb/blockAutumnTexDiff.png',
      '/three/deep/deep8voxb/blockWinterTexDiff.png'
      ];
      season=(season+1)%a.length;
      
      Pd5.animText(clh.a[0].o,'diff '+a[season]);
      //...
    }
    },
    
    mRotate,Menu.mFullscreen
    
    );
    
    ma.push(mright={s:r,vertCenter:1,ydown:true,xright:true,px:b  ,py:b+b      ,pw:w,ph:w,actionf:move});
    ma.push(mleft ={s:l,vertCenter:1,ydown:true,xright:true,px:b+w,py:b+b      ,pw:w,ph:w,actionf:move});
    ma.push(mfront={s:'^',vertCenter:1,ydown:true,xright:true,px:b+w/2,py:b+b+w,pw:w,ph:w,actionf:move});
    Menu.roots=ma;Menu.setMenus(ma);
    Menu.draw();
    
    
    if (0)
    Conet.download({fn:fn,f:function(v) {
      var o=Pd5.load(v);
      o.scale=1;
      o.instances=1000;
      
      threeEnv.aipos=undefined;
      threeEnv.base=base;
      
      threeAddObj(o,0,-1,0,0.001);
      
      
      function renderAll() {
        //---
        
        var m=new THREE.Matrix4(),m0=new THREE.Matrix4(),
            im=o.meshes[0].tmesh,w=210;//210
            
        console.log('deep8voxb render '+va.length+'/'+o.instances);
        im.count=Math.min(o.instances,va.length);//parseInt(Math.random()*o.instances);
        for (var i=im.count-1;i>=0;i--) {
          var v=va[i];
          m.makeTranslation(v.x*w,v.y*w,v.z*w);
          im.setMatrixAt(i,m);
        }
        im.instanceMatrix.needsUpdate=true;
        
        //...
      }
      
      renderAll();
      Voxed.onVoxMesh=renderAll;
      
      
      //onsole.log(o);
      //o.scale=0.001;o.renderNV=renderNV;
      //threeEnv.aipos=undefined;
      //threeEnv.base=base;
      //...
    }
    });
    
    //...
  }
  //---
  var app=(function() {
    //--- turnbased game test, viewrange depends on height
    //--- inspired by mib
    
    var y0=-3,marks=[];
    
    this.init=function() {
      //===
      //cfm.sub[0].sub[1].actionf();//cfmp.newf();
      cfmp.loadf('/three/anim/voxed/mib40.json');
      //...
    }
    this.newRandom=function() {
      
      vh={};va=[];vw=0.03*4;
      var b=10,by=1;
      for (var z=-b;z<=b;z++) for (var y=-by+y0;y<=by+y0;y++) for (var x=-b;x<=b;x++)
        //if ((x+b*3+y+z)>2)
        //if ((x==0)||(y==0)||(z==0))
        if (y==y0)
          etV(x,y,z,{x:x,y:y,z:z,c:0});
      
      //console.log(va.length);
      Conet.seed(100);
      //if (0)
      for (var i=0;i<500;i++) {
        var vi=Math.floor(Conet.rand()*va.length),
            v=va[vi];
        if (!(etV(v.x-1,v.y,v.z)||etV(v.x-1,v.y,v.z)
          ||etV(v.x,v.y,v.z-1)||etV(v.x-1,v.y,v.z+1))) {
          i--;continue;
        }
        etV(v.x,v.y,v.z,null);
        etV(v.x,v.y+1,v.z,v);
        //console.log(v);
      }
      var ymax=y0;
      for (var vi=va.length-1;vi>=0;vi--) {
        var v=va[vi];
        ymax=Math.max(ymax,v.y);
        for (var y=v.y-1;y>=y0;y--) etV(v.x,y,v.z,{c:0});
      }
      //onsole.log('ymax='+ymax);
      
      function colf(c,f) {
        return new THREE.Color(c.r*f,c.g*f,c.b*f);//...
      }
      
      for (var v of va) v.c=v.y-y0;
      
      var orange={r:0.8,g:0.3,b:0.1};
      colors=[
        new THREE.Color(0.2,0.2,0.2),
        new THREE.Color(0.4,0.4,0.4),
        new THREE.Color(0.6,0.6,0.6),
        new THREE.Color(0.2,0.8,0.2),
      
        colf(orange,0.25),
        colf(orange,0.5),
        colf(orange,0.75),
        colf(orange,1)
        //new THREE.Color(0.4,0.0,0.2),
        //new THREE.Color(0.6,0.1,0.2),
        //new THREE.Color(0.7,0.2,0.2),
        //new THREE.Color(0.8,0.3,0.2),
        
      ];
      /*colors=[
        new THREE.Color(0.8,0.8,0.8),
        new THREE.Color(0.6,0.8,0.6),
        new THREE.Color(0.4,0.8,0.4),
        new THREE.Color(0.2,0.8,0.2)];*/
      
      voxMesh();//planim.box(0,-0.4,0,1,1,1);
      
      //...
    }
    this.onclick=function(x,y,z) {
      //---
      for (var v of marks) v.c=v.y-y0;
      marks.length=0;
      
      var r=6,ra=[2,4,5,6,8,10];
      for (var zh=-r;zh<=r;zh++)
        for (var yh=-r;yh<=0;yh++)
          for (var xh=-r;xh<=r;xh++) {
            var xp=xh+x,yp=yh+y,zp=zh+z;
            var v=etV(xp,yp,zp);
            if (!v) continue;
            ////if (etV(xp,yp+1,zp)) continue;
            //if (Math.sqrt(xh*xh+zh*zh)>r) continue;
            //if (Math.sqrt(xh*xh+zh*zh)>(r/2-yh/2)) continue;
            if (Math.sqrt(xh*xh+zh*zh)>ra[-yh]) continue;
            v.c=4+yp-y0;
            marks.push(v);
          }
      //...
    }
    
    //planim.views[0].controls.enabled=false;
    
    return this;
    //...
  }
  )();
  app=undefined;
  //----
  function calcTiles(ps) {
    //---
    console.log('calcTiles');
    //onsole.log(etV(1,-16,-2));
    //onsole.log(etV(2,-16,-2));
    if (0) return;
    
    //  6--7  -> e.g.44440000 bottom full grass (for grass c=4)
    // 4--5|
    // || ||
    // |2-|3
    // 0--1
    
    var x0=0,y0=-17,z0=-10,dx=10,dy=10,dz=10,xp,yp,zp,
        v,c,cg,gw=8,th,xn0=-70,yn0=-10,zn0=dz*-8;//-10,
        singleTile=ps?.x!==undefined,xs=0,ys=0,zs=0;
    
    
    if (singleTile) {
      xs=ps.x-x0-2;dx=xs+3;
      ys=ps.y-y0-2;dy=ys+3;
      zs=ps.z-z0-2;dz=zs+3;
    } else 
      planim.putVoxels({x:xn0,y:yn0,z:zn0,dx:-xn0,dy:80,dz:80,'null':1});
    
    if (ps?.onlyClear) return;
    
    var a=[];var count=0;
    for (var z=zs;z<dz;z++) 
    for (var y=ys;y<dy;y++) 
    for (var x=xs;x<dx;x++) {
      xp=x+x0;yp=y+y0;zp=z+z0;
      //if (v=etV(xp,yp,zp)) console.log(v);
      cg=0;
      a[0]=c=(v=etV(xp,yp,zp))?v.c:0;cg+=c;
      a[1]=c=(v=etV(xp+1,yp,zp))?v.c:0;cg=cg*10+c;
      a[2]=c=(v=etV(xp,yp,zp+1))?v.c:0;cg=cg*10+c;
      a[3]=c=(v=etV(xp+1,yp,zp+1))?v.c:0;cg=cg*10+c;
      a[4]=c=(v=etV(xp,yp+1,zp))?v.c:0;cg=cg*10+c;
      a[5]=c=(v=etV(xp+1,yp+1,zp))?v.c:0;cg=cg*10+c;
      a[6]=c=(v=etV(xp,yp+1,zp+1))?v.c:0;cg=cg*10+c;
      a[7]=c=(v=etV(xp+1,yp+1,zp+1))?v.c:0;cg=cg*10+c;
      //if (cg>0) { console.log(cg);console.log(a); }
      th=undefined;
      if (cg==44440000) th={x:1,y:2,z:-8};
    
      if (cg==44000000) th={x:10,y:2,z:-8,swXZ:1,mirX:1};
      if (cg==40400000) th={x:10,y:2,z:-8};
      if (cg== 4040000) th={x:10,y:2,z:-8,mirX:1,mirZ:1};
      if (cg==  440000) th={x:10,y:2,z:-8,swXZ:1,mirZ:1};
    
      if (cg==   40000) th={x:19,y:2,z:-8,swXZ:1,mirZ:1};
      if (cg==  400000) th={x:19,y:2,z:-8};
      if (cg== 4000000) th={x:19,y:2,z:-8,mirX:1,mirZ:1};
      if (cg==40000000) th={x:19,y:2,z:-8,swXZ:1,mirX:1};//swXZ:1,mirX:1};
    
      if (cg==40040000) th={x:28,y:2,z:-8,mirZ:1};
      if (cg== 4400000) th={x:28,y:2,z:-8};
    
      if (cg==44400000) th={x:37,y:2,z:-8};
      if (cg==40440000) th={x:37,y:2,z:-8,swXZ:1,mirZ:1};
      if (cg==44040000) th={x:37,y:2,z:-8,swXZ:1,mirX:1};
      if (cg== 4440000) th={x:37,y:2,z:-8,mirZ:1,mirX:1};
      //------------------------------------------------------------
      if (cg==40404040) th={x:10,y:2,z:-17};
      if (cg== 4040404) th={x:10,y:2,z:-17,mirZ:1,mirX:1};
      if (cg==  440044) th={x:10,y:2,z:-17,swXZ:1,mirZ:1};
      if (cg==44004400) th={x:10,y:2,z:-17,swXZ:1,mirX:1};
      
      if (cg==40004000) th={x:19,y:2,z:-17,swXZ:1,mirX:1};
      if (cg== 4000400) th={x:19,y:2,z:-17,mirZ:1,mirX:1};
      if (cg==  400040) th={x:19,y:2,z:-17};
      if (cg==   40004) th={x:19,y:2,z:-17,swXZ:1,mirZ:1};
    
      if (cg==40044004) th={x:28,y:2,z:-17,mirZ:1};
      if (cg== 4400440) th={x:28,y:2,z:-17};
      
      if (cg==40444044) th={x:37,y:2,z:-17,mirZ:1};
      if (cg== 4440444) th={x:37,y:2,z:-17,mirZ:1,mirX:1};
      if (cg==44404440) th={x:37,y:2,z:-17};
      if (cg==44044404) th={x:37,y:2,z:-17,mirX:1};
      //------------------------------------------------------------
      if (cg==44444040) th={x:10,y:2,z:-26};
      if (cg==44444400) th={x:10,y:2,z:-26,swXZ:1,mirX:1};
      if (cg==44440044) th={x:10,y:2,z:-26,swXZ:1,mirZ:1};
      if (cg==44440404) th={x:10,y:2,z:-26,mirX:1,mirZ:1};
    
      if (cg==44444000) th={x:19,y:2,z:-26,swXZ:1,mirX:1};
      if (cg==44440400) th={x:19,y:2,z:-26,mirX:1,mirZ:1};
      if (cg==44440040) th={x:19,y:2,z:-26};
      if (cg==44440004) th={x:19,y:2,z:-26,swXZ:1,mirZ:1};
      
      if (cg==44444004) th={x:28,y:2,z:-26,mirZ:1};
      if (cg==44440440) th={x:28,y:2,z:-26};
    
      if (cg==44444044) th={x:37,y:2,z:-26,mirZ:1};
      if (cg==44444440) th={x:37,y:2,z:-26};
      if (cg==44440444) th={x:37,y:2,z:-26,mirX:1,mirZ:1}; 
      if (cg==44444404) th={x:37,y:2,z:-26,mirX:1}; 
      //------------------------------------------------------------
      if (cg==40400040) th={x:10,y:2,z:-35};
      if (cg==40404000) th={x:10,y:2,z:-35,mirZ:1};
      if (cg== 4040004) th={x:10,y:2,z:-35,mirX:1};
      if (cg== 4040400) th={x:10,y:2,z:-35,mirX:1,mirZ:1};
      if (cg==44004000) th={x:10,y:2,z:-35,swXZ:1,mirX:1};
      if (cg==44000400) th={x:10,y:2,z:-35,swXZ:1};
      if (cg==  440040) th={x:10,y:2,z:-35,swXZ:1,mirX:1,mirZ:1};
      if (cg==  440004) th={x:10,y:2,z:-35,swXZ:1,mirZ:1};
    
      if (cg==40440040) th={x:37,y:2,z:-35,mirZ:1};
      if (cg==44404000) th={x:37,y:2,z:-35};
      if (cg==44040400) th={x:37,y:2,z:-35,swXZ:1,mirX:1};
      if (cg== 4440004) th={x:37,y:2,z:-35,mirX:1,mirZ:1};
    
      if (cg==44404040) th={x:19,y:2,z:-35,swXZ:1};
      if (cg==40444040) th={x:19,y:2,z:-35,swXZ:1,mirZ:1};
      if (cg==44040404) th={x:19,y:2,z:-35,swXZ:1,mirX:1};
      if (cg== 4440404) th={x:19,y:2,z:-35,swXZ:1,mirX:1,mirZ:1};
      if (cg==40440044) th={x:19,y:2,z:-35,mirZ:1};
      if (cg== 4440044) th={x:19,y:2,z:-35,mirZ:1,mirX:1};
      if (cg==44404400) th={x:19,y:2,z:-35};
      if (cg==44044400) th={x:19,y:2,z:-35,mirX:1};
    
      if (cg==44400400) th={x:28,y:2,z:-35,mirZ:1};
      if (cg== 4440040) th={x:28,y:2,z:-35,mirX:1};
      if (cg==44044000) th={x:28,y:2,z:-35,mirX:1,mirZ:1};
      if (cg==40440004) th={x:28,y:2,z:-35};
      if (cg==44400040) th={x:28,y:2,z:-35,swXZ:1,mirX:1};
      if (cg==44040004) th={x:28,y:2,z:-35,swXZ:1};
      if (cg==40444000) th={x:28,y:2,z:-35,swXZ:1,mirZ:1,mirX:1};
      if (cg== 4440400) th={x:28,y:2,z:-35,swXZ:1,mirZ:1};
    
      if (cg==40040004) th={x:1,y:2,z:-26,mirX:1};
      if (cg== 4400040) th={x:1,y:2,z:-26};
      if (cg== 4400400) th={x:1,y:2,z:-26,mirX:1,mirZ:1};
      if (cg==40044000) th={x:1,y:2,z:-26,mirZ:1};
    
      if (cg==44044004) th={x:1,y:2,z:-17,mirZ:1};
      if (cg== 4440440) th={x:1,y:2,z:-17};
      if (cg==44400440) th={x:1,y:2,z:-17,mirX:1,mirZ:1};
      if (cg==40444004) th={x:1,y:2,z:-17,mirX:1};
    
    
      if (singleTile) 
        planim.putVoxels({x:xn0+x*(gw+bo),y:yn0+y*(gw+bo),z:zn0+z*(gw+bo),dx:8,dy:8,dz:8,'null':1});
      
      if (th) {
        th.dx=gw;th.dy=gw;th.dz=gw;
        var vs=planim.getVoxels(th),bo=0;
        planim.putVoxels({vs:vs,dx:xn0-th.x+x*(gw+bo),dy:yn0-th.y+y*(gw+bo),dz:zn0-th.z+z*(gw+bo)});
        count++;
        if (count%5==1) console.log(count);
      } else if (cg) console.log('unknown cg: '+cg);
    }
    
    
    //...
  }
  planim.calcTiles=calcTiles;
  planim.randomTiles=function(seed) {
    //---
    var dx=7,dy=7,dz=7,x0=1,y0=-17,z0=-1;
    
    Conet.seed(seed||0);
    
    for (var z=0;z<dz;z++) for (var x=0;x<dx;x++) {
      var f=Conet.rand();f*=f*f;
      var h=Math.floor(f*dy);
      for (var y=0;y<dy;y++) {
        //console.log((x+x0)+' '+(y+y0)+' '+(z+z0));
        etV(x+x0,y+y0,z0-z,(y<h)?{c:4}:null);
      }
    }
    voxMesh();
    //...
  }
  ;
  //---init 
  (function() {
    //...
    
    
    function planeChange() {
      planeY+=this._dy;
      mplaney.ms=planeY;
      //console.log(this);
      voxMesh();
    }
    
    isConet=document.URL.indexOf(':7000')!=-1;//---hack
    //console.log(isConet);
    
    //if (0) 
    (groundbox=planim.box(0,-1.9,0,3,0.2,3)).castShadow=false;
    
    //planim.defaultLights();
    planim.pointLight({x:15,y:15,z:15,col:0xffffff,dist:100,int:0.5,castShadow:false});
    
    if (1) {
    var dl=new THREE.DirectionalLight(0xffffee,0.8);//ffe
    dl.position.set(10,100,50);
    dl.castShadow=true;
    if (1) {
    var c=dl.shadow.camera;
    c.near=1;//100;
    c.far=500;//1000;
    c.left=c.bottom=-20;
    c.right=c.top=20;
    dl.shadow.mapSize.width=4*1024;//2048;
    dl.shadow.mapSize.height=4*1024;
    }
    planim.base.add(dl);
    }
    
    if (1) {
    var l=new THREE.HemisphereLight(0x000000,0xeeeeff,1);
    l.position.set(10,100,50);
    planim.base.add(l);
    }
    
    /* mlandscape */ {
      //---
      //let mwidth,mdo2d,mseed,
      let mcfg;
      
      
      var mlandscape=
      /*
      {s:'Caves',sub:[
      
      
      mwidth={s:'Width',prompt:1,ms:20,stay:1,lskey:'voxedCavesWidth',doctrl:'Enter width',setfunc:function(v) {
        this.ms=v;
        //...
      }
      }
      
      ,mseed={s:'Seed',prompt:1,ms:0,stay:1,lskey:'voxedCavesSeed',doctrl:'Enter Seed',setfunc:function(v) {
        this.ms=parseInt(v);
        //...
      }
      }
      
      
      ,mdo2d={s:'',ms:'2D, else 3D',checked:1,stay:1,lskey:'voxedCaves2d',checkbox:1,actionf:function(v) {
        //----
        
      }
      },
      
      */
      
      mcfg={s:'Caves..',ms:'  ',doctrl:'Caves/Landscape config',value:'{\n  "count":20,\n  "seed":0,\n  "do2d":1\n}',lskey:'voxedCavesConfig',ta:1,jsonCheck:1,cstay:1,stay:1,okS:'Generate',cancelS:'Close',setfunc:function(v,onInit) {
        //onsole.log('setfunc v='+v);
        this.ms=v.length+' bytes';
        this.value=v;
        
        if (onInit) return;
        
        generateLandscape(JSON.parse(mcfg.value));
        //blocks=toBlocks();
        
        if (mgroundbox.checked) { 
          mgroundbox.checked=0;
          planim.base.remove(groundbox);
        }
        
        voxMesh();
        Conet.log('Generate done.');
        
        
      }
      }
      
      /*
      
      ,{s:'Generate',stay:1,actionf:function() {
        //generateLandscape(Conet.hcopy(JSON.parse(mcfg.value),{count:mwidth.ms,do2d:mdo2d.checked,seed:mseed.ms}));//20
        generateLandscape(JSON.parse(mcfg.value));
        //blocks=toBlocks();
        
        if (mgroundbox.checked) { 
          mgroundbox.checked=0;
          planim.base.remove(groundbox);
        }
        
        voxMesh();
        Conet.log('Generate done.');
        
        //...
      }
      }
      ]};
      
      
      no water and no yellow, to few colors (above ice dark voxels)
      
      {
        "count":30,
        "seed":0,
        "do2d":1,
        "colorCount":16,
        "colorGradient":[
          {"r":0.3,"g":0.3,"b":0,"w":0},
          {"r":0,  "g":0.8,"b":0},
          {"r":0.4,"g":0.4,"b":0},
          {"r":1,  "g":1,  "b":1}
        ]
      }
      
      with water and yellow
      
      {
        "count":30,
        "seed":1,
        "do2d":1,
        "colorCount":25,
        "colorGradient":[
          {"r":0,  "g":0,  "b":0.1,"w":0},
          {"r":0.0,"g":0.3,"b":0.8,"w":2.5},
          {"r":0,  "g":0.3,"b":0,  "w":0},
          {"r":0,  "g":0.8,"b":0,  "w":1},
          {"r":0.8,"g":0.7,"b":0},
          {"r":0.4,"g":0.3,"b":0,  "w":0.5},
          {"r":1,  "g":1,  "b":1,  "w":1.5}
        ]
      }
      
      simple 2d with 2 colors for deep8 test
      
      //    {"r":0.2,"g":0.2,"b":0.2,"w":0}, //--- too few color contrast, used below with range from yellow to blue
      //    {"r":0.8,"g":0.7,"b":0.3}
      
      
      {
        "count":10,
        "seed":1,
        "do2d":1,
        "colorCount":9,
        "colorGradient":[
          {"r":0.2,"g":0.2,"b":0.9,"w":0},
          {"r":1,"g":0.9,"b":0.4}
        ]
      }
      
      3d open above, closed down coloring based on distance to surface
      
      {
        "count":20,
        "seed":1,
        "do2d":0,
        "colorCount":13,
        "colorGradient":[
          {"r":0.7,"g":0.7,"b":0.7,"w":0},
          {"r":1,"g":0,"b":0},
          {"r":0,"g":1,"b":0,"w":2}
        ],
        "c1":-7,"c0":5
      }
      
      same but coloring based on y and surface dist
      
      {
        "count":20,
        "seed":1,
        "do2d":0,
        "colorCount":40,
        "colorGradient":[
          {"r":0.7,"g":0.7,"b":0.7},
          {"r":1,"g":0,"b":0},
          {"r":0,"g":1,"b":0,"w":2}
        ],
        "c1":-7,"c0":5,
        "color3dy":1
      }
      
      same but count 40
      
      {
        "count":40,
        "seed":1,
        "do2d":0,
        "colorCount":80,
        "colorGradient":[
          {"r":0.7,"g":0.7,"b":0.7},
          {"r":1,"g":0,"b":0},
          {"r":0,"g":1,"b":0,"w":2}
        ],
        "c1":-8,"c0":5,
        "color3dy":1
      }
      
      
      
      */
      //...
    }
    
    /* Menu */ {
      
      var msub=[
      
      cfm=Conet.fileMenu(cfmp={fn:'/three/anim/voxed/files'+(isConet?'':'NoConet')+'.txt',url:'fn',noStartLoad:app,loadList:1,
      loadf:function(fn) {
        if (1)
        Conet.download({fn:fn,f:function(v) {
          load(JSON.parse(v));
          
          //onsole.log(fn);
          if (fn.indexOf('/tile')!=-1) {
            //calcTiles();
            isTiles=true;
          } else isTiles=false;
          
          voxMesh();
        }
        });
      }
      ,savef:!isConet?undefined:function(fn) {
        Conet.upload({fn:fn,data:serialize(),log:Conet.log,logChunk:1});
        //...
      }
      })
      //medit1={checkbox:1,checked:1,ms:'1x edit per click'},
      
      ,{s:'View',sub:[planim.mfullscreen
      ,mRotate={s:'Rotate',r:1,actionf:function() {
        //...
        planim.views[0].controls.autoRotate=!planim.views[0].controls.autoRotate;
        //...
      }
      }
      
      ,mplaney={s:'Plane Y',ms:planeY,r:1,sub:[
      
      mpyshow={checkbox:1,ms:'Show plane y',actionf:voxMesh}
      ,{s:'+10',actionf:planeChange,_dy:10}
      ,{s:'+1',actionf:planeChange,_dy:1}
      ,{s:'-1',actionf:planeChange,_dy:-1}
      ,{s:'-10',actionf:planeChange,_dy:-10}
      
      ]}
      
      ,{s:'Docs',doctrl:'Docs',mcfs:0.07,wrap:0,ta:true,tacols:60,tarows:20
      ,valuef:function() {
        
        return ''+
        '2020-08-18 v.0.792 ... Added color and brush-width menu.\n'+
        '2019-10-16 v.0.423 ... First version online.';
        //...
      }
      }
      
      ]}
      
      ,{s:'Config',sub:[
      
      
      mbackground={s:'Background',doctrl:'Pick color',color:1,bgcol:colIToS(planim.views[0].bgcol),ms:colIToS(planim.views[0].bgcol),oninput:function(v) {
        //var col='0x'+v.substr(1);
        //console.log(col);
        var col=parseInt(v.substr(1),16);
        
        planim.views[0].bgcol=col;
        planim.views[0].renderer.setClearColor(col);
        
        this.bgcol=v;
        this.ms=v;
        
        
        //data.colors[sel.col]=col;
        //mat.needsUpdate=true;
        //console.log(parseInt(col));
      }
      ,valuef:function() {
        return colIToS(planim.views[0].bgcol);
      }
      }
      
      ,mgroundbox={ms:'GroundBox',checkbox:1,checked:1,actionf:function() {
        if (this.checked) {
          planim.base.add(groundbox);
        } else {
          planim.base.remove(groundbox);
        }
      }
      }
      
      ,{s:'Brush',r:1,doctrl:'Set brush (x-width,y-width,z-width)',lskey:'voxbrush',ms:brush,setfunc:function(v) {
        var a=v.split(',');
        for (var i=0;i<a.length;i++) a[i]=parseInt(a[i]);
        brusha=a;brush=v;
        //onsole.log(a);
        this.ms=v;
        //...
      }
      ,valuef:function() {
        return brush;
      }
      }
      
      ]}
      
      ];
      
      cfm.sub.splice(0,0,{s:'New',sub:[
      
      {s:'plain',
      actionf:function() {
        
        vh={};va=[];vw=0.03;
        var b=10,by=1;
        for (var z=-b;z<=b;z++) for (var y=-by;y<=by;y++) for (var x=-b;x<=b;x++)
          //if ((x+b*3+y+z)>2)
          if ((x==0)||(y==0)||(z==0))
            etV(x,y,z,{x:x,y:y,z:z,c:0});
        colors=[new THREE.Color(0.5,0.5,0.5),new THREE.Color(0.2,0.8,0.2)]
        
        voxMesh();//planim.box(0,-0.4,0,1,1,1);
        
        //...
      }
      }
      
      //,{s:'chess-like',actionf:app.newRandom}
      
      ]});
      
      cfm.sub.push(
      
      {s:'Json',ms:'import/export',doctrl:'Json data',mcfs:0.07,ta:true,jsonCheck:1,wrap:0,tacols:30,tarows:20,setfunc:function(v,initLoad) {
        load(v);
        //...
      }
      ,valuef:function() {
        return serialize();
      }
      }
      
      ,{s:'Vox',ms:'export',doctrl:'Download vox file.',mcfs:0.07,wrap:1,text:1,_ta:true,tacols:30,tarows:20
      ,valuef:function() {
        
        var s=vox();//'VOX \u0096\u0097\u0001\u0002'+String.fromCharCode(150);//+'\u2013';
        
        //Conet.upload({fn:'/three/anim/voxed/export.vox',data:btoa(s),log:Conet.log});
        //var b=new Blob([s],{type:'text/plain'});
        //console.log(b);
        //var w=window.open('');
        //w.document.write(s);
        //console.log({s:s});
        //console.log(btoa(s));
        //this.s='2323232';
        //return s;//JSON.stringify(s);
        
        var fn=cfm.curFn,i=fn.lastIndexOf('/');
        if (i!=-1) fn=fn.substr(i+1);
        i=fn.lastIndexOf('.');
        if (i!=-1) fn=fn.substr(0,i);
        fn+='.vox';
        
        return ' <a download="'+fn+'" href="data:application/octet-stream;base64,'+s+'">'+fn+'</a>';
      }
      }
      
      /*
      ,{s:'Obj',ms:'export',doctrl:'Obj data',mcfs:0.07,ta:true,wrap:0,tacols:30,tarows:20
      ,valuef:function() {
        
        var exp=new THREE.OBJExporter();
        var result=exp.parse(mesh);
        
        return result;
      }
      }
      */
      
      );
      
      
      var startEditing=app;//for mib4
      Menu.init([{s:'Voxed',ms:planim.version+'- 0.3013 ',sub:msub}//FOLDORUPDATEVERSION
      
      ,medit={s:'Edit',checked:startEditing,checkbox:1,ms:'Edit',actionf:function(v) {
        planim.views[0].controls.enabled=!this.checked;
        mtool.bgcol=this.checked?'#fff':undefined;
      }
      }
      ,mtool={s:'Add 1',ms:'Edit-tool',autoval:1,setfunc:function(v) {
        this.s=v;
        if (!medit.checked) {
          Menu.setChecked(medit,1);
          medit.actionf();
        }
        //Conet.log('edittool setfunc v='+v);
      }
      ,sub:[{s:'Add 1'},{s:'Add N'},{s:'Sub 1'},{s:'Sub N'},{s:'Paint'},{s:'Pick<span style="font-size:0.5em;">Color</span>'}
      ,{s:'Paint range'}]}
      
      /*
      
      ,mcolor={s:'Color',initLoadVal:ccol.r+','+ccol.g+','+ccol.b,doctrl:'r,g,b e.g. 1,1,0 is yellow',setfunc:function(v,initLoad) {
        //console.log('mcolor.setfunc '+v+' '+initLoad);
        if (!v) return;
        var a=v.split(',');
        ccol=new THREE.Color(parseFloat(a[0]),parseFloat(a[1]),parseFloat(a[2]));
        this.bgcol='rgb('+round(ccol.r*256)+','+round(ccol.g*256)+','+round(ccol.b*256)+')';
        this.ms=v;this.vertCenter=undefined;
        //...
      }
      ,valuef:function() {
        return ccol.r+','+ccol.g+','+ccol.b;
      }
      }
      
      */
      
      
      ,mcolor2={s:'Color',doctrl:'Pick color',color:1,bgcol:colToHex(ccol),ms:colToHex(ccol),oninput:function(v) {
        var col='0x'+v.substr(1);
        console.log(col);
        ccol=new THREE.Color(parseInt(v.substr(1),16));
        
        this.bgcol=v;
        this.ms=v;this.vertCenter=undefined;
        
        
        //data.colors[sel.col]=col;
        //mat.needsUpdate=true;
        //console.log(parseInt(col));
      }
      ,valuef:function() {
        var v=colToHex(ccol);
        console.log('v='+v);
        return v;
      }
      }
      
      ,mlandscape
      
      ],{listen:1,nobeep:1,prompt:1});
      
      
      Menu.cpy=0.08;//--- controls down from stats
      
    }
    
    if (app) app.init();
    
    //var sc=document.createElement('script');
    //sc.src='https://threejs.org/examples/js/exporters/OBJExporter.js';
    //document.body.appendChild(sc);
    
    if (startEditing) medit.actionf();
    
    //script src="https://threejs.org/examples/js/exporters/OBJExporter.js"
    //planim.views[0].controls.autoRotate=true;
    //planim.views[0].renderer.setClearColor(0x75ddff);
    //...
  }
  )();
  //---
}
)();
//console.log('YOIUOkokooko');
//fr o,2
//fr o,2,13,3
//fr o,2,13,7
//fr o,2,13,11
//fr o,2,15
//fr o,2,36,9
//fr o,2,36,11
//fr o,2,36,14
//fr o,2,49
//fr o,2,51
//fr o,2,89,16,7
//fr o,2,89,64,1
//fr o,2,90,3,10
//fr o,2,91,2
//fr o,2,91,4
//fr o,2,91,32,74
//fr o,2,91,32,74,15
//fr o,2,91,32,83
//fr o,2,102
//fr o,2,102,36,31
//fr p,22,68
