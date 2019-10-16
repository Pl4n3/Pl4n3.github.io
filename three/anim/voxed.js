//----
(function () {
  var mtool,f4=planim.f4,medit,base=planim.base,vw=0.03,mesh,cfmp,//medit1,
      vh={'0_0_0':{x:0,y:0,z:0},'1_0_0':{x:1,y:0,z:0},'2_0_0':{x:2,y:0,z:0},'2_1_0':{x:2,y:1,z:0},},
      colors=[new THREE.Color(0.5,0.5,0.5),new THREE.Color(0.2,0.8,0.2)],
      ccol=colors[0],mcolor;
  
  
  planim.game.calc=function(dt) {
    //---
  }
  ;
  
  //...
  planim.addView({ortho:1,w:1,h:1,x:0,y:0,cam:new THREE.Vector3(0.1,-0.1,2.5),bg:1,autoRotate:0,
    target:new THREE.Vector3(0,-0.4,0),fov:60,bgcol:0x666666,_vr:1,camZoom:5});
  
  //planim.game.rays=1;
  //planim.game.fetchOnKey=1;
  planim.dragRays=true;
  
  function etV(x,y,z,v) {
    var k=x+'_'+y+'_'+z;
    if (v===undefined) return vh[k];
    if (v===null) delete(vh[k]);
    else vh[k]=v;
    //...
  }
  function voxMesh() {
    //...
    if (mesh) base.remove(mesh);
    
    var ge=new THREE.Geometry();
    //threeEnv.addTri({ge:ge,a0:[0,0,0],a1:[-10,0,0],a2:[0,10,0],dim:1});
    
    var //c=new THREE.Color(0.5,0.5,0.5),
        w=vw,f=undefined;//threeEnv.pv;
    
    for (var k in vh) if (vh.hasOwnProperty(k)) {
      var v=vh[k],x=v.x,y=v.y,z=v.z,
          x0=x*w+w/2,y0=y*w-0.4+w/2,z0=z*w+w/2,
          c=colors[v.c||0];
      //onsole.log(v);
      if (!etV(x,y,z-1)) threeEnv.addQuad({ge:ge,a0:[x0,y0,z0-w],a1:[-w,0,0],a2:[0,w,0],a3:[-w,w,0],dim:1,c:c,f:f});
      if (!etV(x,y,z+1)) threeEnv.addQuad({ge:ge,a0:[x0-w,y0,z0],a1:[w,0,0],a2:[0,w,0],a3:[w,w,0],dim:1,c:c,f:f});
      if (!etV(x+1,y,z)) threeEnv.addQuad({ge:ge,a0:[x0,y0,z0],a1:[0,0,-w],a2:[0,w,0],a3:[0,w,-w],dim:1,c:c,f:f});
      if (!etV(x-1,y,z)) threeEnv.addQuad({ge:ge,a0:[x0-w,y0,z0-w],a1:[0,0,w],a2:[0,w,0],a3:[0,w,w],dim:1,c:c,f:f});
      if (!etV(x,y+1,z)) threeEnv.addQuad({ge:ge,a0:[x0-w,y0+w,z0],a1:[w,0,0],a2:[0,0,-w],a3:[w,0,-w],dim:1,c:c,f:f});
      if (!etV(x,y-1,z)) threeEnv.addQuad({ge:ge,a0:[x0,y0,z0],a1:[-w,0,0],a2:[0,0,-w],a3:[-w,0,-w],dim:1,c:c,f:f});
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
    var m=new THREE.Mesh(bge,new THREE.MeshPhongMaterial({vertexColors:THREE.FaceColors}));
    m.position.set(0,0,0);
    m.castShadow=true;
    m.receiveShadow=true;
    base.add(m);
    m.userData.onclick=onclick;
    mesh=m;
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
  function onclick(e,ij,j) {
    if (!medit.checked) return;
    if (j!=0) return;
    var mts=mtool.s,
        add=mts.startsWith('Add'),
        paint=(mts=='Paint');
    //if (add&&(e.type!='click')) return;
    //if (medit1.checked) 
    if (mts.endsWith(' 1'))
    if ((e.type!='touchstart')&&(e.type!='click')) return;//mousedown
    //onet.log('voxed.onclick e.type='+e.type);
    //onsole.log('voxed fi='+ij.faceIndex+' uv.x='+f4(ij.uv.x)+' uv.y='+f4(ij.uv.y));
    //onsole.log(ij);
    var p=ij.point,n=ij.face.normal;
    //planim.box(p.x,p.y,p.z,0.1,0.1,0.1);
    if (!add) { n.x*=-1;n.y*=-1;n.z*=-1; }
    
    var x=0.5+p.x/vw+n.x/2,y=0.5+(p.y+0.4)/vw+n.y/2,z=0.5+p.z/vw+n.z/2;
    x=Math.floor(x);y=Math.floor(y)-1;z=Math.floor(z);
    
    //onet.log(f4(x)+' '+f4(y)+' '+f4(z));
    
    
    if (add||paint) 
      if (ccol.ci===undefined) {
        var md=0.001;
        for (var i=colors.length-1;i>=0;i--) {
          var c=colors[i],md=0.001;
          if ((Math.abs(c.r-ccol.r)<md)&&(Math.abs(c.g-ccol.g)<md)
            &&(Math.abs(c.b-ccol.b)<md)) { ccol.co=i;break; }
        }
        if (ccol.ci===undefined) {
          colors.push(ccol);ccol.ci=colors.length-1;
        }
      }
    if (add) 
      etV(x,y,z,{x:x,y:y,z:z,c:ccol.ci});
    else if (mts.startsWith('Sub')) etV(x,y,z,null);
    else if (mts.startsWith('Pick')) {
      var c=colors[etV(x,y,z).c];
      if ((c.r!=ccol.r)||(c.g!=ccol.g)||(c.b!=ccol.b)) {
        ccol=c;
        Menu.remove();
        mcolor.setfunc(c.r+','+c.g+','+c.b);
        mtool.s='Paint';
        Menu.draw();
        //onsole.log(ccol);
      }
    } else if (paint) etV(x,y,z).c=ccol.ci;
    
    
    voxMesh();
    //console.log(e);
    //...
  }
  function serialize() {
    //--
    var first,data='{"vw":'+vw;
    
    data+=',"colors":[\n';
    for (var ci=0;ci<colors.length;ci++) {
      var c=colors[ci];
      data+=(ci==0?'':',')+'['+f4(c.r)+','+f4(c.g)+','+f4(c.b)+']\n';
    }
    data+=']';
    
    data+=',"voxels":[\n';first=true;
    for (var k in vh) if (vh.hasOwnProperty(k)) {
      var v=vh[k];
      data+=(first?'':',')+JSON.stringify(v)+'\n';
      first=false;
    }
    data+=']';
    data+='}';
    return data;
    //...
  }
  function load(v) {
    //--
    var d=JSON.parse(v);
    if (d.vw) vw=d.vw;
    vh={};
    colRedir={};
    if (d.colors.length>0) {
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
    //onsole.log(colRedir);
    for (var v of d.voxels) {
      var rc=colRedir[v.c];if (rc!==undefined) v.c=rc;
      if (v.c>=colors.length) v.c=0;
      etV(v.x,v.y,v.z,v);
    }
    voxMesh();
    if (1) return;
    //colors.push(new THREE.Color(1,0,0),new THREE.Color(0.2,0.4,0));//,new THREE.Color(1,1,0));
    var vs=planim.getVoxels(),d=50;//vh={};
    planim.putVoxels({vs:vs,dy:-48});//return;
    Conet.seed(100);
    for (var c=0;c<20;c++)
    planim.putVoxels({vs:vs,colRedir:{1:Math.floor(Conet.rand()*3+3)},
      dx:Math.floor(Conet.rand()*d*2)-d,dy:-48,dz:Math.floor(Conet.rand()*d*2)-d,
      mirrorx:Conet.rand()<0.5,mirrorz:Conet.rand()<0.5,swapxz:Conet.rand()<0.5});
    
    //...
  }
  //---script funcs
  planim.getVoxels=function(ps) {
    //---
    var ret=serialize();
    vh={};
    return ret;
    //---
  }
  ;
  planim.putVoxels=function(ps) {
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
    voxMesh();
    //...
  }
  ;
  //---init 
  (function() {
    //...
    
    var isConet=document.URL.indexOf(':7000')!=-1;//---hack
    //console.log(isConet);
    
    planim.box(0,-1.9,0,3,0.2,3).castShadow=false;
    planim.defaultLights();
    planim.pointLight({x:15,y:15,z:15,col:0xffffff,dist:100,int:0.5,castShadow:false});
    
    var msub=[
    
    Conet.fileMenu(cfmp={fn:'/three/anim/voxed/files'+(isConet?'':'NoConet')+'.txt',
    newf:function() {
      
      vh={};vw=0.03;
      var b=10,by=1;
      for (var z=-b;z<=b;z++) for (var y=-by;y<=by;y++) for (var x=-b;x<=b;x++)
        //if ((x+b*3+y+z)>2)
        if ((x==0)||(y==0)||(z==0))
          etV(x,y,z,{x:x,y:y,z:z,c:0});
      voxMesh();//planim.box(0,-0.4,0,1,1,1);
      
      //...
    }
    ,loadf:function(v) {
      if (1)
      Conet.download({fn:v,f:function(v) {
        load(v);
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
    ,{s:'Rotate',r:1,actionf:function() {
      //...
      planim.views[0].controls.autoRotate=!planim.views[0].controls.autoRotate;
      //...
    }
    }]}
    
    ,{s:'Json',ms:'import/export',doctrl:'Json data',mcfs:0.07,ta:true,wrap:0,tacols:30,tarows:20,setfunc:function(v,initLoad) {
      load(v);
      //...
    }
    ,valuef:function() {
      return serialize();
    }
    }
    
    
    ,{s:'Obj',ms:'export',doctrl:'Obj data',mcfs:0.07,ta:true,wrap:0,tacols:30,tarows:20,setfunc:function(v,initLoad) {
      //...
    }
    ,valuef:function() {
      
      var exp=new THREE.OBJExporter();
      var result=exp.parse(mesh);
      
      return result;
    }
    },
    
    
    ];
    
    
    Menu.init([{s:'Voxed',ms:planim.version+'- 0.310 ',sub:msub}//FOLDORUPDATEVERSION
    
    ,medit={s:'Edit',checkbox:1,ms:'Edit',actionf:function(v) {
      planim.views[0].controls.enabled=!this.checked;
      mtool.bgcol=this.checked?'#fff':undefined;
    }
    }
    ,mtool={s:'Sub N',ms:'Edit-tool',autoval:1,setfunc:function(v) {
      this.s=v;
      if (!medit.checked) {
        Menu.setChecked(medit,1);
        medit.actionf();
      }
      //Conet.log('edittool setfunc v='+v);
    }
    ,sub:[{s:'Add 1'},{s:'Add N'},{s:'Sub 1'},{s:'Sub N'},{s:'Paint'},{s:'Pick<span style="font-size:0.5em;">Color</span>'}]}
    
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
    
    ],{listen:1});
    Menu.cpy=0.08;//--- controls down from stats
    cfmp.newf();
    
    var sc=document.createElement('script');
    sc.src='https://threejs.org/examples/js/exporters/OBJExporter.js';
    document.body.appendChild(sc);
    
    //script src="https://threejs.org/examples/js/exporters/OBJExporter.js"
    //planim.views[0].controls.autoRotate=true;
    //...
  }
  )();
  //---
}
)();
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,23
//fr o,1,25
//fr o,1,27
//fr o,1,30
//fr p,12,103
