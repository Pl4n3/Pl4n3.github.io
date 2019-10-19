//----
(function () {
  var mtool,f4=planim.f4,medit,base=planim.base,vw=0.03,mesh,cfmp,//medit1,
      vh={'0_0_0':{x:0,y:0,z:0},'1_0_0':{x:1,y:0,z:0},'2_0_0':{x:2,y:0,z:0},'2_1_0':{x:2,y:1,z:0},},
      colors=[new THREE.Color(0.5,0.5,0.5),new THREE.Color(0.2,0.8,0.2)],
      ccol=colors[0],mcolor,isConet;
  
  
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
    else {
      v.x=x;v.y=y;v.z=z;
      vh[k]=v;
    }
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
  function checkIndexColor(ccol) {
    
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
    
    
    //...
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
    
    
    if (add||paint) checkIndexColor(ccol);
    if (add) 
      //etV(x,y,z,{x:x,y:y,z:z,c:ccol.ci});
      etV(x,y,z,{c:ccol.ci});
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
    if (isConet) Conet.upload({fn:'/three/anim/voxed/export.vox.base64',data:s,log:Conet.log});//.b64
    
    return s;
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
    }}
    
    if (ps.x!==undefined) {
      var c=ps.c||0;
      if (ps.col) {
        checkIndexColor(ps.col);
        c=ps.col.ci;
      }
      for (var z=ps.z;z<ps.z+ps.dz;z++)
      for (var y=ps.y;y<ps.y+ps.dy;y++)
      for (var x=ps.x;x<ps.x+ps.dx;x++)
        etV(x,y,z,{c:c});
    }
    
    voxMesh();
    //...
  }
  ;
  //---init 
  (function() {
    //...
    
    isConet=document.URL.indexOf(':7000')!=-1;//---hack
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
    
    
    ,{s:'IO',sub:[
    
    {s:'Json',ms:'import/export',doctrl:'Json data',mcfs:0.07,ta:true,wrap:0,tacols:30,tarows:20,setfunc:function(v,initLoad) {
      load(v);
      //...
    }
    ,valuef:function() {
      return serialize();
    }
    }
    
    ,{s:'Vox',ms:'export',doctrl:'Copy data to file, decode base64.',mcfs:0.07,wrap:1,ta:true,tacols:30,tarows:20
    ,valuef:function() {
      
      var s=vox();//'VOX \u0096\u0097\u0001\u0002'+String.fromCharCode(150);//+'\u2013';
      
      //Conet.upload({fn:'/three/anim/voxed/export.vox',data:btoa(s),log:Conet.log});
      //var b=new Blob([s],{type:'text/plain'});
      //console.log(b);
      //var w=window.open('');
      //w.document.write(s);
      //console.log({s:s});
      //console.log(btoa(s));
      return s;//JSON.stringify(s);
    }
    }
    
    ,{s:'Obj',ms:'export',doctrl:'Obj data',mcfs:0.07,ta:true,wrap:0,tacols:30,tarows:20
    ,valuef:function() {
      
      var exp=new THREE.OBJExporter();
      var result=exp.parse(mesh);
      
      return result;
    }
    }
    
    ]}
    
    ];
    
    
    Menu.init([{s:'Voxed',ms:planim.version+'- 0.423 ',sub:msub}//FOLDORUPDATEVERSION
    
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
//fr o,1,26
//fr o,1,33
//fr o,1,33,14
//fr o,1,33,30
//fr p,13,108
