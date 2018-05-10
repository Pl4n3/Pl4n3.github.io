//--- pd5
var Pd5={};
(function(Pd5) {
  var vh0=new Vecmath.Vec3(0,0,0),vh1=new Vecmath.Vec3(0,0,0),vh2=new Vecmath.Vec3(0,0,0),cr=new Vecmath.Vec3(0,0,0);
  var m0=new Vecmath.Mat4(),m1=new Vecmath.Mat4(),m=new Vecmath.Mat4();
  var m4=new Vecmath.Mat4(),PI=Math.PI;
  var dcol={r:230,g:200,b:100};
  var dcols=[{r:230,g:200,b:100},{r:130,g:230,b:100},{r:100,g:150,b:240}];
  var th;//=new Bullet.Transform();
  var mh=new Vecmath.Mat4();
  var mh0=new Vecmath.Mat4();
  var vh0=new Vecmath.Vec3(),ShapeUtils=undefined;
  Pd5.dynamicsWorld=undefined;
  Pd5.debugS='';
  Pd5.boxes=[
    [0,-10,0,200,10,200],
    [145,50,0,10,50,200],
    [-55,50,0,10,50,200],
    [0,50,-145,200,50,10],
    [0,50,55,200,50,10],
  ];
  Pd5.onload=undefined;
  
  //--
  function startsWith(s0,s1) {
    if (s1.length>s0.length) return false;
    if (s0.substr(0,s1.length)==s1) return true;
    return false;
  }
  Pd5.startsWith=startsWith;
  function dist(p0,p1) {
    var dx=p0.x-p1.x,dy=p0.y-p1.y,dz=p0.z-p1.z;
    return dx*dx+dy*dy+dz*dz;
  }
  function distuv(v0,v1) {
    var du=v0.u-v1.u,dv=v0.v-v1.v;
    return du*du+dv*dv;
  }
  function boneNew(h,ps) {
    if (!h) h={};
    if (!ps) ps={};
    var mat=new Vecmath.Mat4();mat.setIdentity();
    Pd5.hcopy({ws:[],mat:mat,q:new Vecmath.Vec3(),t:new Vecmath.Vec3(ps.x||0,0,0),
      p0:{p0:new Vecmath.Vec3(//ps.x||
      0,0,0),p1:new Vecmath.Vec3(0,0,0),p2:new Vecmath.Vec3(0,0,0)}},
      h,undefined,undefined,1);
    return h;
    //...
  }
  function weightNew(x,y,z,w) {
    var we={p0:new Vecmath.Vec3(x,y,z),p1:new Vecmath.Vec3(0,0,0),w:w};
    //...
    return we;
  }
  function rigVerts(lo) {
    
    //first pass: determine bones
    lo.bones=[boneNew({name:'base'})];
    var boneh={},spheres={};//bone-name->array of spheres
    for (var h=0;h<lo.verts.length;h++) {
      var v=lo.verts[h],mo=v.marko;
      v.ws=[];
      if (!v.marko) continue;
      var boneName=v.marko.bone;
      if (boneName) { 
        //onsole.log(v.marko);
        var b=boneNew({name:boneName,up:v.marko.up,_v:v});  
        lo.bones.push(b);
        boneh[boneName]=b;
      }
      var name=mo.bone||mo.bonr;
      if (!name) continue;
      if (mo.radius) {
        //var name=mo.bone||mo.bonr;
        //if (name) {
          var sa=spheres[name];
          if (!sa) { sa=[];spheres[name]=sa; }
          sa.push({p:v.p0,r:mo.radius,mo:mo});
        //}
      }
    }
    //second pass: determine properties (yup,..) of bones
    for (var h=0;h<lo.verts.length;h++) {
      var v=lo.verts[h],mo=v.marko;
      if (!mo) continue;
      var name=mo.bone||mo.bonr;
      if (!name) continue;
      var b=boneh[name];
      if (mo.yup) { console.log('YUP!');b._yup=v; }
      if (mo.ydn) b._ydn=v; 
    }
    //onsole.log(spheres);
    for (var h=1;h<lo.bones.length;h++) {
      var b=lo.bones[h],p=b._v.p0;
      if (b.up) {
        b.up=boneh[b.up];var pu=b.up._v.p0;
        b.t.sub2(p,pu);
      } else {
        b.up=lo.bones[0];
        b.t.set1(p);
      }
    }
    //yup param auf aeste kopieren, ggf hier auch bones sortieren
    var change=1;
    while (change) { 
      change=0;
      for (var h=1;h<lo.bones.length;h++) {
        var b=lo.bones[h];
        //console.log(b.up);
        //if (b._yup) { console.log('b._yup');console.log(b); }
        if (b.up._yup&&!b._yup) { console.log('upyup');b._yup=b.up._yup;change=1; }
        if (b.up._ydn&&!b._ydn) { b._ydn=b.up._ydn;change=1; }
      }
    }
    //|bones are there, now generate weights, alogrithm:
    //| -for each vert add a weight if it is in a bone sphere
    //| -for each bone only nearest sphere (-> only 1 weight)
    //| -if vert is in no sphere it gets a weight for the nearest sphere
    //| -for cones/legs etc. add temp spheres 
    //| -weight function in a sphere quadratic, but never 0
    //| -> loop over verts, then bones, then spheres in a bone..
    
    //if (0)
    for (var h=0;h<lo.verts.length;h++) {
      var v=lo.verts[h],mb=undefined,md=Number.MAX_VALUE,vp0=v.p0;
      for (var i=1;i<lo.bones.length;i++) {
        var b=lo.bones[i],vh=b._yup;
        if (vh) { if (v.p0.y<vh.p0.y) { //console.log('yup');
            continue; }}
        vh=b._ydn;if (vh) if (v.p0.y>vh.p0.y) continue;
        var sa=spheres[b.name],msd=Number.MAX_VALUE,ms=undefined,bp=b._v.p0;
        if (sa) for (var j=0;j<sa.length;j++) {
          var s=sa[j],d=Math.sqrt(dist(s.p,v.p0));
          if (d<md) { md=d;mb=b; }
          if (d>s.r) continue;
          if (d<msd) { msd=d;ms=s; }
        }
        if (!ms) continue;
        //var vh=b._yup;if (vh) {
        //  if (v.y<vh.y) continue;
        //}
        var wp0=new Vecmath.Vec3();wp0.sub2(vp0,bp);
        //onsole.log(wp0);
        var f=(1-msd/ms.r);f*=f;//*f;
        //var w={p0:wp0,p1:new Vecmath.Vec3(0,0,0),w:0.01+(0.99*f)*(ms.mo.spheref||1)};
        var w={p0:wp0,p1:new Vecmath.Vec3(0,0,0),w:ms.mo.fixweight||(0.01+(0.99*f))};
        b.ws.push(w);v.ws.push(w);
        //v.mark=(v.mark||'')+b.name;
      }
      if (v.ws.length>0) continue;
      var wp0=new Vecmath.Vec3();wp0.sub2(vp0,mb._v.p0);
      var w={p0:wp0,p1:new Vecmath.Vec3(0,0,0),w:1};
      mb.ws.push(w);v.ws.push(w);
    }
    
    
    //var b={name:'base',ws:[],mat:new Vecmath.Mat4(),
    //  p0:{p0:new Vecmath.Vec3(0,0,0),p1:new Vecmath.Vec3(0,0,0),p2:new Vecmath.Vec3(0,0,0)}},w;
    if (0) {
    var b=lo.bones[0];//b.mat.setIdentity();
    for (var h=0;h<lo.verts.length;h++) {
      var v=lo.verts[h],p0=v.p0;
      b.ws.push(w=weightNew(p0.x,p0.y,p0.z,1));
      v.ws.push(w);
    }}
    //var b0=boneNew({name:'2nd',up:b},{x:50});
    //lo.bones=[b,b0];
    //lo.anims=[];
    var ak;lo.anim=[ak={t:1,bs:[]}];
    lo.anims=[{name:'idle',a:lo.anim}];
    for (var h=0;h<lo.bones.length;h++) {
      var b=lo.bones[h];
      ak.bs.push({q:new Vecmath.Vec3(b.q.x,b.q.y,b.q.z),t:new Vecmath.Vec3(b.t.x,b.t.y,b.t.z)});
    }
    //onsole.log(lo);
    //...
  }
  Pd5.vertNew=function(x,y,z,u,v) {
    return {p0:new Vecmath.Vec4(x,y,z,1),p1:new Vecmath.Vec4(0,0,0,1),ts:[],vis:false,u:u,v:v};
  }
  Pd5.triNew=function(v0,v1,v2,col) {
    var t={v0:v0,v1:v1,v2:v2,vis:false,col:col};
    v0.ts.push(t);
    v1.ts.push(t);
    v2.ts.push(t);
    return t;
  }
  Pd5.load=function(s) {
    try {
      var h;
      if (s.startsWith('{')) h=JSON.parse(s); else {
        var fh=new Function('','return {'+s+'};');
        h=fh();
      }
      return Pd5.loadh(h);
    } catch (re) {
      //console.warn('Pd5.load error: '+re);
      console.log(re);
      var sh=''+re,i=sh.indexOf('at position');
      if (i!=-1) {
        sh=sh.substr(i+12);
        i=parseInt(sh);
        console.log('Bad json: '+s.substr(Math.max(0,i-10),20));
      }
    }
  }
  Pd5.loadh=function(h) {
    
    //lert(-1);
    var lo=h;//new Function('','return {'+s+'};')();
    //alert(oh);
    
    
    var pa=lo.pa;
    //lert(0);
    
    if (lo.bones) {
    for (var h=0;h<lo.bones.length;h++) {
      var bo=lo.bones[h];
      var b=bo.ws;
      
      bo.up=bo.up==-1?undefined:lo.bones[bo.up];
      bo.mat=new Vecmath.Mat4();
      //bn.x=bo[1];bn.y=bo[2];bn.z=bo[3];bn.qx=bo[4];bn.qy=bo[5];bn.qz=bo[6];
      //var ys=0,zs=0,x2=0;
      var md=20,xmi=-md,xma=md,ymi=-md,yma=md,zmi=-md,zma=md,fh=0.8;
      for (var i=0;i<b.length;i++) {
        var v=b[i];
        var w={p0:new Vecmath.Vec3(v.x,v.y,v.z),p1:new Vecmath.Vec3(0,0,0),w:(v.w?v.w:1)};
        if (v.mark) {
          w.mark=v.mark;
          if (v.mark=='eye') { lo.eyew=w;lo.eyewb=bo; }
        }
        //ys+=v.y;zs+=v.z;x2+=v.x*v.x;
        xmi=Math.min(xmi,v.x*fh);xma=Math.max(xma,v.x*fh);
        ymi=Math.min(ymi,v.y*fh);yma=Math.max(yma,v.y*fh);
        zmi=Math.min(zmi,v.z*fh);zma=Math.max(zma,v.z*fh);
        b[i]=w;
      }
      //ys=ys/b.length*2;zs=zs/b.length*2;
      //x2=Math.sqrt(x2/b.length);
      //if (Math.abs(zs)>Math.abs(ys)) { ys=0;bo.cneg=zs<0; } else { zs=0;bo.cneg=ys<0; }
      bo.ps=[
        {p0:new Vecmath.Vec3(xmi,0,0),p1:new Vecmath.Vec3(0,0,0),p2:new Vecmath.Vec3(0,0,0)},
        {p0:new Vecmath.Vec3(0,0,zmi),p1:new Vecmath.Vec3(0,0,0),p2:new Vecmath.Vec3(0,0,0)},
        {p0:new Vecmath.Vec3(xma,0,0),p1:new Vecmath.Vec3(0,0,0),p2:new Vecmath.Vec3(0,0,0)},
        {p0:new Vecmath.Vec3(0,0,zma),p1:new Vecmath.Vec3(0,0,0),p2:new Vecmath.Vec3(0,0,0)},
        {p0:new Vecmath.Vec3(0,yma,0),p1:new Vecmath.Vec3(0,0,0),p2:new Vecmath.Vec3(0,0,0)},    
        {p0:new Vecmath.Vec3(0,ymi,0),p1:new Vecmath.Vec3(0,0,0),p2:new Vecmath.Vec3(0,0,0)},    
      ];
      bo.p0={p0:new Vecmath.Vec3(0,0,0),p1:new Vecmath.Vec3(0,0,0),p2:new Vecmath.Vec3(0,0,0)};
      //bn.ws=b;
      //lo.bones[h]=bn;
    }
    //lert(1);
    if (lo.vertfmt==2) 
    for (var h=0;h<lo.verts.length;h++) {
      var vh=lo.verts[h];
      var vaa=vh.a;
      var v=Pd5.vertNew(0,0,0,0,0);
      v.ws=[];
      for (var i=0;i<vaa.length/2;i++) {
        var w=lo.bones[vaa[i*2]].ws[vaa[i*2+1]];
        //w.w=vaa[i*3+2];
        v.ws.push(w);
      }
      Pd5.hcopy(vh,v,['u','v','nvi','mark']);
      lo.verts[h]=v;
    } else
    for (var h=0;h<lo.verts.length;h++) {
      var vh=lo.verts[h];
      var vaa=vh[2];
      var v=Pd5.vertNew(0,0,0,0,0);
      v.ws=[];
      v.u=vh[0];
      v.v=vh[1];
      for (var i=0;i<vaa.length/2;i++) {
        var w=lo.bones[vaa[i*2]].ws[vaa[i*2+1]];
        //w.w=vaa[i*3+2];
        v.ws.push(w);
      }
      if (vh.length>3) v.nvi=vh[3];//alert(v.nvi); }
      lo.verts[h]=v;
    }
    for (var h=0;h<lo.verts.length;h++) {
      var v=lo.verts[h];
      if (v.nvi===undefined) continue;
      v.nv=lo.verts[v.nvi];
    }
    
    //lert(2);
    
    } else {
      if (!lo.verts) lo.verts=[];
      for (var h=0;h<pa.length;h++) {
        var p=pa[h],v;
        //p[0]*=10;
        //va.push({p0:new Vecmath.Vec4(p[0],p[1],p[2],1),p1:new Vecmath.Vec4(0,0,0,1),ts:[],vis:false});
        lo.verts.push(v=Pd5.vertNew(p[0],p[1],p[2],p.length>3?p[3]:0,p.length>4?p[4]:0));
        if (p.length>5) {
          v.mark=p[5]; 
          if (v.mark.startsWith('{')) {
            v.marko=JSON.parse(v.mark);
            //onsole.log(v.marko);
          }
        }
      }
      if (document.URL.indexOf('rigVerts')!=-1) rigVerts(lo);
    }
    //lert(3);
    if (!lo.meshes) lo.meshes=[];
    if (lo.fa) {
      lo.meshes.splice(0,0,{fa:lo.fa,comb:lo.comb,diff:lo.diff,spec:lo.spec,norm:lo.norm});
      //alert(lo.meshes.length);
    } //else lo.fa=lo.meshes[0].fa;
    //if (lo.meshes) lo.fa=lo.meshes[0].fa;
    
    
    var va=lo.verts;
    for (var mei=0;mei<lo.meshes.length;mei++) {
      var fa=lo.meshes[mei].fa;
      for (var h=0;h<fa.length;h++) {
        var f=fa[h];
        var v0=va[f[0]],v1=va[f[2]],v2=va[f[1]];
        var t={v0:v0,v1:v1,v2:v2,vis:false};
        if (f.length==6) t.col={r:f[3],g:f[4],b:f[5]};
        if (f.length==4) t.p=f[3];
        fa[h]=t;
        v0.ts.push(t);v1.ts.push(t);v2.ts.push(t);
      }
    }
    
    if (lo.selAnim===undefined) lo.selAnim=0;
    lo.animh={};
    if (lo.anims) {
      //if (lo.selAnim) {
      //  var ah=lo.anims[lo.selAnim];
      //  if (ah) lo.anim=ah.a;
      //}
      if (lo.anims.length>0) lo.anim=lo.anims[lo.selAnim].a; else lo.recalc=true;
      for (var h=0;h<lo.anims.length;h++) {
        var a=lo.anims[h];
        lo.animh[a.name]=a.a;
        
        //change ak.mark to ak.text
        for (var i=0;i<a.a.length;i++) {
          var ak=a.a[i];
          //if (ak.text) console.log('Pd5.loadh ak.text='+ak.text);
          if (ak.mark) {
            ak.text=(ak.text?ak.text+'\n':'')+ak.mark;
            delete(ak.mark);
            //console.log('Pd5.loadh '+ak.mark);
          }
        }
      }
    }
    
    if (Pd5.onload) Pd5.onload(lo);
    //lert(4);
    return lo;
  }
  Pd5.tri=function(v0,v1,v2,vf,c,t) {
    //var v0=t.v0.p1;//ia[0].p1;
    //var v1=t.v1.p1;//ia[1].p1;
    //var v2=t.v2.p1;//ia[2].p1;
    ////var v3=va[ia[3]].p1;
    vh0.set3(v0.x,v0.y,v0.z);
    vh1.set3(v1.x,v1.y,v1.z);
    vh2.set3(v2.x,v2.y,v2.z);
    vh0.sub1(vh1);
    vh2.sub1(vh1);
    cr.cross(vh0,vh2);
    
    if (cr.z<0) return false;//{ t.vis=false;continue; }
    //t.vis=true;
    cr.normalize0();
    var f=new Object();//Vecmath.Face();
    //var c=(t.col?t.col:dcol);
    var fc=cr.z;
    f.c="rgb("+Math.floor(fc*c.r)+","+Math.floor(fc*c.g)+","+Math.floor(fc*c.b)+")";
    /* //specular    
    var fm=0.9;
    var o=fc<fm;
    if (o) {
      fc=fc/fm;
      f.c="rgb("+Math.floor(fc*c.r)+","+Math.floor(fc*c.g)+","+Math.floor(fc*c.b)+")";
    } else {
      fc=(fc-fm)/(1-fm);var f1=(1-fc);
      f.c="rgb("+Math.floor(f1*c.r+fc*250)+","+Math.floor(f1*c.g+fc*250)+","+Math.floor(f1*c.b+fc*250)+")";
    }
    */
    //f.c=fc>1?'rgb(250,250,250)':"rgb("+Math.floor(fc*c.r)+","+Math.floor(fc*c.g)+","+Math.floor(fc*c.b)+")";
    f.z=(v0.z+v1.z+v2.z)/4;//+v3.z
    //f.fa=[v0.x+cw2,ch2-v0.y,v1.x+cw2,ch2-v1.y,v2.x+cw2,ch2-v2.y];//,v3.x+cw2,ch2-v3.y];
    f.fa=[v0.x,v0.y,v1.x,v1.y,v2.x,v2.y];//,v3.x+cw2,ch2-v3.y];
    f.t=t;
    for (var k=0;k<vf.length;k++) if (vf[k].z<f.z) { vf.splice(k,0,f);f=null;break; }
    if (f!=null) vf.push(f);
    return true;
  }
  Pd5.animScaleT=function(anim,f) {
    for (var h=0;h<anim.length;h++) { 
      var a=anim[h];
      if (a.tor===undefined) a.tor=a.t;
      a.t=a.tor*f;
    }
  }
  Pd5.animStart=function(o,anim) {
    if ((o.anim==anim)||!anim) return;
    //console.log('anim start '+anim.length);
    o.anim=anim;
    o.ta=0;o.ca=0;
    
    if (o.cm) return;//else bulletized objects looks strange..
    if (!o.animc) {
      o.animc={bs:new Array(o.bones.length)};
      for (var h=o.animc.bs.length-1;h>=0;h--) {
        o.animc.bs[h]={t:new Vecmath.Vec3(0,0,0),q:new Vecmath.Vec4(0,0,0)};
      }
    }
    for (var h=o.bones.length-1;h>=0;h--) {
      var b=o.bones[h],a=o.animc.bs[h];
      a.t.set1(b.t);a.q.set1(b.q);
    }
  }
  Pd5.animLen=function(anim) {
    var t=0;
    //for (var h=anim.length-1;h>=0;h--) { var a=anim[h];aT+=a.t; }
    for (var h=0;h<anim.length;h++) { var a=anim[h];t+=a.t; }
    return t;
  }
  Pd5.calc=function(lo,dt,aX,aY,scale,tr,cw2,ch2,notris) {
    var o=lo;
    if (o.animStop&&!o.recalc&&!o.isEdit) return;
    var oo=lo.o;
    var va=lo.verts;
    var m=new Vecmath.Mat4();
    var bones,anim;
    var t=0;
    if (lo) {
      bones=lo.bones;
      anim=lo.anim;
    }
    //if (!anim) anim=lo.anims[0].a;//alert(lo.anims.length);
    var inplace=oo&&o.cm;
    
    if (bones&&(!lo.animStop||lo.recalc||o.cm)) {
      var f=o.cm?20/100:1;
    
      //if (!o.cm) {
      var matupdate=false;
      if (anim&&(!lo.animStop||lo.recalc)) {
        var aT=0;
        //for (var h=anim.length-1;h>=0;h--) { var a=anim[h];aT+=a.t; }
        for (var h=0;h<anim.length;h++) { var a=anim[h];aT+=a.t;a.t2=aT; }
        lo.aT=aT;
        if (!lo.ta) lo.ta=0;
        if (!lo.animStop) lo.ta+=dt;
        var t=lo.ta/1000;
        if (t>aT) lo.ca++;
        t=t%aT;lo.at=t;
        var key1=0;//,t2=0;
        for (var h=0;h<anim.length;h++) {
          var a=anim[h];
          var dth=a.t;//t2+=dth;a.t2=t2;
          if (t<dth) { key1=h;break; }
          t-=dth;
        }
        var key0=key1==0?anim.length-1:key1-1;
        var ak0=anim[key0];
        if (lo.animStep) {
          if ((ak0===lo.stepAk)||ak0.skipStep) return;
          lo.stepAk=ak0;
          for (var ii=0;ii<bones.length;++ii) {
            var b=bones[ii];
            var ab0=ak0.bs[ii];
            var t=b.t,t0=ab0.t;
            var q=b.q,q0=ab0.q; 
            t.x=t0.x;t.y=t0.y;t.z=t0.z;
            if (q0.w===undefined) q0.w=Vecmath.qw(q0);
            q.x=q0.x;q.y=q0.y;q.z=q0.z;
          }
        } else {
        if ((key1==0)&&(lo.ca==0)&&lo.animc) ak0=lo.animc;
        var ak1=anim[key1];//if (ak1==undefined) alert(key1);
        var af=t/ak1.t;
        ////af=3*af*af-2*af*af*af; //small smooth
        ////af=1-(af-1)*(af-1)+af*af*(0.1*Math.cos(PI*6*af)-0.1);
        ////af=3*af*af-2*af*af*af+af*af*(0.1*Math.cos(PI*5.5*af));//good, small spring
        //af=3*af*af-2*af*af*af+af*af*(0.2*Math.cos(PI*5.5*af));  //good, big spring
        ////af=3*af*af-2*af*af*af+af*af*(0.15*Math.cos(PI*6*af)-0.15);
        if (lo.interEase) af=1-Math.cos(af*PI*4)*(1-af)*(1-af)*(1-af)*(1-af);
        if (lo.interCos) af=0.5-Math.cos(af*PI)/2; //better smooth
        //if (lo.interCos) af=af*af*af;
        var af1=1-af;
        var abones=bones;//o?o.bones:bones;
        var fm=f;///2;
        for (var ii=0;ii<bones.length;++ii) {
          var b=bones[ii];
          var ab0=ak0.bs[ii];
          var ab1=ak1.bs[ii];
          var t=b.t,t0=ab0.t,t1=ab1.t;//alert('t0='+t0.z+' t1='+t1.z+' '+af+' '+af1);
          var q=b.q,q0=ab0.q,q1=ab1.q; 
          t.x=(t0.x*af1+t1.x*af)/fm;
          t.y=(t0.y*af1+t1.y*af)/fm;
          t.z=(t0.z*af1+t1.z*af)/fm;
          if (q0.w===undefined) q0.w=Vecmath.qw(q0);
          if (q1.w===undefined) q1.w=Vecmath.qw(q1);
          Vecmath.slerp(q0,q1,q,af);
          //q.x=q0.x*af1+q1.x*af;
          //q.y=q0.y*af1+q1.y*af;
          //q.z=q0.z*af1+q1.z*af;
          
          
    //      if (o.cm&&(!b.co||b.testRelMat)&&ii>0) {
    //        //console.log(ii);
    //        //b.mat.setIdentity();
    //        m0.setIdentity();
    //        m0.setTranslation3(t.x/5,t.y/5,t.z/5);
    //        //b.mat.setM4(m0);
    //        m1.quat3(q.x,q.y,q.z);m.mul2s(m0,m1);
    //        b.mat.setM4(m);//m0
    //        continue;
    //      }
    //      if (b.up) m.setM4(b.up.mat);
    //      else {
    //        m.setIdentity();
    //        //if (lo.cm&&inplace
    //        if (inplace) {
    //          m.setTranslation3(oo.x*12.5,oo.y*12.5,oo.z*12.5);//10
    //          m0.rotY(oo.rot+(oo.go.rotofs||0));m.mul1(m0);
    //        }
    //      }
    //      m0.setIdentity();
    //      //m0.setTranslation3(aba.t.x,aba.t.y,aba.t.z);
    //      m0.setTranslation(t);m1.mul2s(m,m0);
    //      m0.quat3(q.x,q.y,q.z);m.mul2s(m1,m0);
    //      //if (!ba[9]) ba[9]=new Vecmath.Mat4();  
    //      b.mat.setM4(m);
        }
        }
        matupdate=true;
        //if (lo.eyew&&ego) if (ego.o5==lo) abones[3].q.x+=camAx/2;
        if (key0!=lo.key0) {
          if (ak0.text) Pd5.animText(lo,ak0.text);//alert(ak0.text);
          lo.key0=key0;
        }
      }
      
      if (!anim&&lo.recalc) matupdate=true;
      lo.recalc=false;
      
      if (matupdate) { //if (matupdate)
        for (var ii=0;ii<bones.length;++ii) {
          var b=bones[ii],q=b.q,t=b.t;
          if (o.cm&&(!b.co||b.testRelMat)&&ii>0) {
            //console.log(ii);
            //b.mat.setIdentity();
            m0.setIdentity();
            m0.setTranslation3(t.x/5,t.y/5,t.z/5);
            ////b.mat.setM4(m0);
            m1.quat3(q.x,q.y,q.z);
            //m1.quat4(q.x,q.y,q.z,q.ws);
            m.mul2s(m0,m1);
            b.mat.setM4(m);//m0
            continue;
          }
          if (b.up) m.setM4(b.up.mat);
          else {
            m.setIdentity();
            //if (lo.cm&&inplace
            if (inplace) {
              m.setTranslation3(oo.x*12.5,oo.y*12.5,oo.z*12.5);//10
              m0.rotY(oo.rot+(oo.go.rotofs||0));m.mul1(m0);
            }
          }
          m0.setIdentity();
          //m0.setTranslation3(aba.t.x,aba.t.y,aba.t.z);
          m0.setTranslation(t);m1.mul2s(m,m0);
          //if (ii>0) m0.quat4(q.x,q.y,q.z,q.ws); else//m.mul2s(m1,m0);
          m0.quat3(q.x,q.y,q.z);
          m.mul2s(m1,m0);
          //if (!ba[9]) ba[9]=new Vecmath.Mat4();  
          b.mat.setM4(m);
        }
      }
      
      //Pd5.debugS='';
      
      m1.setIdentity();
      if (inplace) {
        m1.rotY(-(oo.rot+(oo.go.rotofs||0)));
        m0.setIdentity();
        if (o.cm) {
          var f9=2.5;//was2, for wloom actually 2.5/gscale would be correct factor..
          m0.setTranslation3(-oo.x*f9,-oo.y*f9,-oo.z*f9);
        } else 
          m0.setTranslation3(-oo.x*10,-oo.y*10,-oo.z*10);
        m1.mul1(m0);
      }
      
      
      for (var h=0;h<bones.length;h++) {
        var ba=bones[h];
        
        if (o.cm) {
          //m=ba.mat;
          if (!ba.co) {
            //if (inplace) { 
              //m.setM4(m1);m.mul1(ba.mat); 
            //} //else 
            if (ba.up) if (ba.up.comat) {
              m.setM4(ba.up.comat);
              m.mul1(ba.mat);
            }
            //m.setM4(m1);
    
            //continue;
          } else {
          
            //if (inplace) 
            m.setM4(m1);//eigentlich if (inplace)..
            //else m.setIdentity();
          
            ba.co.getWorldTransform(o.cm);
            var or=o.cm.origin;
            m0.setM3(o.cm.basis);
            //if (h==2) 
            //Pd5.debugS+=' | '+or;
            m0.m03=or.x*f;
            m0.m13=or.y*f;
            m0.m23=or.z*f;
            m.mul1(m0);
          
            m0.setIdentity();
            m0.setTranslation3(-ba.cx*f,-ba.cy*f,-ba.cz*f);
            m.mul1(m0);
          }
          if (!ba.comat) ba.comat=new Vecmath.Mat4();
          ba.comat.setM4(m);
        } else {
        
        //var aba=abones[h];
        //////var wa=ba[7];
        //////if (ba[8]==null) ba[8]=new Array(wa.length);
        ////if (ba[0]!=-1) m.setM4(bones[ba[0]][9]);
        //if (ba.up) m.setM4(ba.up.mat);
        //else  m.setIdentity();
        //m0.setIdentity();
        ////m0.setTranslation3(aba.t.x,aba.t.y,aba.t.z);
        //m0.setTranslation(aba.t);m1.mul2s(m,m0);
        //m0.quat3(aba.q.x,aba.q.y,aba.q.z);m.mul2s(m1,m0);
        ////if (!ba[9]) ba[9]=new Vecmath.Mat4();  
        //ba.mat.setM4(m);
        ////for (var mi=1-1;mi>=0;mi--) {
        ////  var bi=mi==0?7:8+mi*2;
          if (inplace) {
            m.setM4(m1);
            m.mul1(ba.mat);
          } else m.setM4(ba.mat);
        } 
          
        //m.transformV3(ba.p0.p0,ba.p0.p1);
        var wa=ba.ws;//ba[bi];
        if (lo.viewBones) for (var i=ba.ps.length-1;i>=0;i--) {
          var p=ba.ps[i];
          m.transformV3(p.p0,p.p1);
        } else for (var i=wa.length-1;i>=0;i--) {
          var w=wa[i];
          if (lo.isEdit) w.bi=h;//only in editor needed
          //if (i==1) w.p1.set3(10,0,0);else
          //if (((i==9)&&(h==1))||((i==8)&&(h==1))) w.p1.set3(10,0,0); else 
          vh0.set1(w.p0);
          //if (o.cm) { vh0.x-=ba.cx/5;vh0.y-=ba.cy/5;vh0.z-=ba.cz/5; }
          m.transformV3(vh0,w.p1);
          //m.transformV3(w.p0,w.p1);
          //if (((i==9)&&(h==1))||((i==8)&&(h==1))||((i==10)&&(h==2))) Pd5.debugS+=' | '+vh0;//w.p0;
        }
        var p=ba.p0;
        m.transformV3(p.p0,p.p1);
        //}
      }
    
      //if (!o.testNoAnim)//testNoAnim
      if (o.cm) {
        if (o.anim&&(!o.animStop||o.bulletStick)&&!o.testNoAnim) {//&&!o.animStop) {
          var x0=0,ym0=0,z0=0,x1=0,ym1=0,z1=0;
          var yl0=Number.MAX_VALUE,yl1=Number.MAX_VALUE;
          var yu0=Number.MIN_VALUE,yu1=Number.MIN_VALUE;
          var pc0l=0;
          for (var h=0;h<o.bones.length;h++) {
            var b=o.bones[h];
            if (!b.co) continue;
            
            if (b.noAnim) {
              if (b.pc0) {
                Pd5.dynamicsWorld.removeConstraint(b.pc0);
                delete b.pc0;
              }
              continue;
            }
            
            if (!b.pc0) {
              var body=b.co;//Bullet.RigidBody.upcast(b.co);
              var bodyb=new Bullet.RigidBody(0,null,body.collisionShape);
              b.pc0=new Bullet.HingeConstraint(body,bodyb,new Vecmath.Vec3(0,0,0),new Vecmath.Vec3(0,0,0),new Vecmath.Vec3(0,1,0),new Vecmath.Vec3(0,1,0));
              Pd5.dynamicsWorld.addConstraint(b.pc0,false);
              //onsole.log('Pd5.calc new pc0 '+h);
            }
            var body=b.pc0.rbA;
            b.pc0.rbA.getWorldTransform(th);
            x0+=th.origin.x;
            yl0=Math.min(yl0,th.origin.y);
            yu0=Math.max(yu0,th.origin.y);
            ym0+=th.origin.y;
            z0+=th.origin.z;
            var m=b.mat;
            x1+=m.m03;//12
            yl1=Math.min(yl1,m.m13);//13
            yu1=Math.max(yu1,m.m13);//13
            ym1+=m.m13;//13
            z1+=m.m23;//14
            pc0l++;
          }
          x0=(x0-x1)/pc0l;
          ym0/=pc0l;
          ym1/=pc0l;
          var dy=0;//-15;//(yu1-yl1)-19;//18.5f;//(yu1-yl1)+yl0;//(yu1-yu0)+yl0;//-13.5
          z0=(z0-z1)/pc0l;
          for (var h=0;h<o.bones.length;h++) {
            var b=o.bones[h];
            if (!b.co||b.noAnim) continue;
            var body=b.pc0.rbA;
            var m=mh;
            ////m.scale3(5,5,5);////m.setIdentity();//P4d.matIdentity(m);
            ////m.mul1(b.mat);//P4d.matMul(m,s.mat);
            //if (b.testRelMat) {
            //  m.setM4(ba.up.comat);
            //  m.mul1(ba.mat);
            //} else 
              m.setM4(b.mat);
            ////if (h==2) Pd5.debugS+=' t.o '+Vecmath.fs(m.m03)+' '+Vecmath.fs(m.m13)+' '+Vecmath.fs(m.m23);
            mh0.setIdentity();vh0.set3(0,b.cy,0);mh0.setTranslation(vh0);m.mul1(mh0);//P4d.matTranslate(m,0,s.cy,0);
            var bodyb=b.pc0.rbB;
            b.ct.origin.set3(m.m03,dy+m.m13,m.m23);
            //if (h==2) Pd5.debugS+=' t.o '+Vecmath.fs(m.m03)+' '+Vecmath.fs(m.m13)+' '+Vecmath.fs(m.m23);
            var m3=b.ct.basis;
            m3.m00=m.m00;m3.m01=m.m01;m3.m02=m.m02;
            m3.m10=m.m10;m3.m11=m.m11;m3.m12=m.m12;
            m3.m20=m.m20;m3.m21=m.m21;m3.m22=m.m22;
            //onsole.log('Pd5.calc b.ct='+b.ct);
            bodyb.worldTransform.setT(b.ct);//setWorldTransform(s.t);
            body.setActivationState(Bullet.CollisionObject.DISABLE_DEACTIVATION);
          }    
        } else {
          for (var h=0;h<o.bones.length;h++) {
            var b=o.bones[h];
            
            //following code tries to keep coll objs activated
            //if (!b.co) continue;
            //if (!b.cobody) b.cobody=Bullet.RigidBody.upcast(b.co);
            //b.cobody.setActivationState(Bullet.CollisionObject.DISABLE_DEACTIVATION);
            //if (b.co) b.co.setActivationState(Bullet.CollisionObject.DISABLE_DEACTIVATION);
             
    
            if (!b.pc0) continue;
            Pd5.dynamicsWorld.removeConstraint(b.pc0);
            delete b.pc0;
            //onsole.log('Pd5.calc del pc0 '+h);
          }
        }
      }
    
    
      if (!lo.viewBones) 
      for (var h=lo.verts.length-1;h>=0;h--) {
        var v=lo.verts[h];
        var p0=v.p0;
        p0.set3(0,0,0);
        var sw=0;
        for (var i=v.ws.length-1;i>=0;i--) {
          var w=v.ws[i],wp1=w.p1,ww=w.w;
          p0.x+=wp1.x*ww;p0.y+=wp1.y*ww;p0.z+=wp1.z*ww;sw+=ww;
        }
        p0.x/=sw;p0.y/=sw;p0.z/=sw;
      }
    }
    
    //if (true) return;
    //if (!o.isEdit) return;
    
    var vf=new Array();
    //for (var i=6;i>=0;i--) {
    
    //if (lo.cm&&oo) {
      //aY=-(oo.rot+(oo.go.rotofs||0));
      ////log(oo.rot+(oo.go.rotofs||0));
      //tr.x=-oo.x*2;tr.y=-oo.y*2;tr.z=-oo.z*2;
    //}
    
      //var a=hh;hh+=0.0018*dt;
    if (lo.aX!==undefined) aX+=lo.aX;
    m4.rotX(aX);
    m0.rotY(aY);m4.mul2(m4,m0);
    if (lo.aZ!==undefined) {
      m0.rotZ(lo.aZ);m4.mul2(m4,m0);
    }
    m0.scale3(scale,scale,scale);
    m4.mul2(m4,m0);
    m0.setIdentity();
    m0.setTranslation(tr);
    m4.mul2(m4,m0);
    
    if (bones) for (var j=bones.length-1;j>=0;j--) {
      var p=bones[j].p0;
      m4.transformV3(p.p1,p.p2);
      p.p2.x=cw2+p.p2.x;
      p.p2.y=ch2-p.p2.y;
    }
    
    var tris=!notris;
    
    
    if (tris&&lo.viewBones&&bones) for (var j=bones.length-1;j>=0;j--) {
      var b=bones[j];
      var ps=b.ps;
      for (var k=ps.length-1;k>=0;k--) {
        var p=ps[k];
        m4.transformV3(p.p1,p.p2);
        p.p2.x=cw2+p.p2.x;
        p.p2.y=ch2-p.p2.y;
      }
      Pd5.tri(ps[0].p2,ps[4].p2,ps[1].p2,vf,dcol);
      Pd5.tri(ps[1].p2,ps[4].p2,ps[2].p2,vf,dcol);
      Pd5.tri(ps[2].p2,ps[4].p2,ps[3].p2,vf,dcol);
      Pd5.tri(ps[3].p2,ps[4].p2,ps[0].p2,vf,dcol);
      Pd5.tri(ps[0].p2,ps[1].p2,ps[5].p2,vf,dcol);
      Pd5.tri(ps[1].p2,ps[2].p2,ps[5].p2,vf,dcol);
      Pd5.tri(ps[2].p2,ps[3].p2,ps[5].p2,vf,dcol);
      Pd5.tri(ps[3].p2,ps[0].p2,ps[5].p2,vf,dcol);
      //tri(ps[0].p2,ps[2].p2,ps[1].p2,vf,b.cneg?bcol:dcol);
    }
    
    if (lo.isEdit&&bones) { // w.b is also needed in bone mode(menu: bone del) //if (lo.viewWeights&&bones) { 
      var wco=0;
      for (var j=bones.length-1;j>=0;j--) {
        var b=bones[j],ws=b.ws;
        //var ws=bones[j].ws;
        for (var k=ws.length-1;k>=0;k--) {
          var w=ws[k];
          wco++;
          w.b=b;
          if (!w.p2) w.p2=new Vecmath.Vec3(0,0,0);
          m4.transformV3(w.p1,w.p2);
          w.p2.x=cw2+w.p2.x;
          w.p2.y=ch2-w.p2.y;
        }
      }
      lo.weightCount=wco;
    }
    
    //if (lo.isEdit&&!lo.viewBones)
    if (!lo.viewBones)
    for (var j=va.length-1;j>=0;j--) {
      var v=va[j];
      m4.transform2(v.p0,v.p1);
      v.p1.x=cw2+v.p1.x;
      v.p1.y=ch2-v.p1.y;
      v.bi=(v.ws?(v.ws.length==1?v.ws[0].bi:-1):-1);
    }
    //var col={r:130,g:230,b:100};
    if (tris&&!lo.viewBones) {
      for (var mi=lo.meshes.length-1;mi>=0;mi--) {
        var fi=lo.meshes[mi].fa;//lo.fa;#
        //var col=dcols[(-lo.selmesh+mi+dcols.length)%dcols.length];
        var col=dcols[lo.selmesh===undefined?0:(-lo.selmesh+mi+lo.meshes.length)%lo.meshes.length];
        //if (!col) console.log(lo.meshes.length+' '+lo.selmesh);
        for (var j=fi.length-1;j>=0;j--) {
          var t=fi[j];
          t.vis=Pd5.tri(t.v0.p1,t.v1.p1,t.v2.p1,vf,t.col?t.col:col,t);
        }
      }
    }
    lo.calced=true;
    return vf;
  }
  Pd5.calcNormals=function(lo,noVerts) {
    var ve=lo.verts;
    if (!noVerts) for (var h=ve.length-1;h>=0;h--) {
      var v=ve[h];v.nx=0;v.ny=0;v.nz=0;
    }
    for (var mi=lo.meshes.length-1;mi>=0;mi--) {
    var fa=lo.meshes[mi].fa;
    for (var h=fa.length-1;h>=0;h--) {
      var t=fa[h],v0=t.v0,v1=t.v2,v2=t.v1;
      //var p0=v0.p0,p1=v1.p0,p2=v2.p0;//or p1?
      var p0=v0.p1,p1=v1.p1,p2=v2.p1;//or p1?
      var x0=p0.x,y0=p0.y,z0=p0.z;
      var x1=p1.x,y1=p1.y,z1=p1.z;
      var x2=p2.x,y2=p2.y,z2=p2.z;
      x0-=x1;y0-=y1;z0-=z1;
      x2-=x1;y2-=y1;z2-=z1;
      x1=-(y0*z2-z0*y2);//with p0: +
      y1=(z0*x2-x0*z2);
      z1=-(x0*y2-y0*x2);//with p0: +
      //if (norm) {
      //  var l=Math.sqrt(x1*x1+y1*y1+z1*z1);
      //  x1/=l;y1/=l;z1/=l;
      //}
      t.nx=x1;t.ny=y1;t.nz=z1;
      if (!noVerts) {
        if (v0.nv) v0=v0.nv;
        if (v1.nv) v1=v1.nv;
        if (v2.nv) v2=v2.nv;
        v0.nx+=x1;v0.ny+=y1;v0.nz+=z1;
        v1.nx+=x1;v1.ny+=y1;v1.nz+=z1;
        v2.nx+=x1;v2.ny+=y1;v2.nz+=z1;
      }
    }}
    if (!noVerts) {
      var hasnv=false;
      for (var h=ve.length-1;h>=0;h--) {
        var v=ve[h];
        if (v.nv) { hasnv=true;continue; }
        var x=v.nx,y=v.ny,z=v.nz,f=Math.sqrt(x*x+y*y+z*z);
        v.nx/=f;v.ny/=f;v.nz/=f; 
      }
      if (hasnv) for (var h=ve.length-1;h>=0;h--) {
        var v=ve[h];
        if (!v.nv) continue; 
        v.nx=v.nv.nx;v.ny=v.nv.ny;v.nz=v.nv.nz;
      }
    }
    
    /*
      for (var h=tris.length/3;h>=0;h--) {
        var i0=tris[h*3];ih=nvh[i0];if (ih) i0=ih;
        var i2=tris[h*3+1];ih=nvh[i2];if (ih) i2=ih;
        var i1=tris[h*3+2];ih=nvh[i1];if (ih) i1=ih;
        var x0=fa[i0*3],y0=fa[i0*3+1],z0=fa[i0*3+2];
        var x1=fa[i1*3],y1=fa[i1*3+1],z1=fa[i1*3+2];
        var x2=fa[i2*3],y2=fa[i2*3+1],z2=fa[i2*3+2];
        x0-=x1;y0-=y1;z0-=z1;
        x2-=x1;y2-=y1;z2-=z1;
        x1=y0*z2-z0*y2;
        y1=z0*x2-x0*z2;
        z1=x0*y2-y0*x2;
        na[i0*3]+=x1;na[i0*3+1]+=y1;na[i0*3+2]+=z1;
        na[i1*3]+=x1;na[i1*3+1]+=y1;na[i1*3+2]+=z1;
        na[i2*3]+=x1;na[i2*3+1]+=y1;na[i2*3+2]+=z1;
      }
      for (var h=na.length/3-1;h>=0;h--) {
        if (nvh[h]) continue;
        var x=na[h*3];
        var y=na[h*3+1];
        var z=na[h*3+2];
        var f=Math.sqrt(x*x+y*y+z*z);
        na[h*3]/=f;
        na[h*3+1]/=f;
        na[h*3+2]/=f;
      }
    */
    
    
  }
  Pd5.animText=function(o,st) {
    //onsole.log('Pd5.animText '+st);
    //var matChange=false;
    var a=st.split('\n');
    for (var i=a.length-1;i>=0;i--) {
      var s=a[i],sa=s.split(' '),sa0=sa[0];
      if (sa0=='diff') { var m=o.meshes[sa.length>2?parseInt(sa[2]):0];if (m) { m.diff=sa[1];m.matChange=true; }}
      else if (sa0=='norm') { var m=o.meshes[sa.length>2?parseInt(sa[2]):0];if (m) { m.norm=sa[1];m.matChange=true; }}
      else if (sa0=='spec') { var m=o.meshes[sa.length>2?parseInt(sa[2]):0];if (m) { m.spec=sa[1];m.matChange=true; }}
      else if (sa0=='osc') {
        if (window.Sound) Sound.oscs(s.substr(sa0.length+1));
      }
    }
    for (var i=o.meshes.length-1;i>=0;i--) {
      var m=o.meshes[i];
      if (!m.matChange) continue;
      delete(m.matChange);
      if (m.tmesh) { threeSetMeshMaterial(m,o);m.tmesh.material=m.material; }
    }
  }
  Pd5.bulletBox=function(b) {
    var groundShape = new Bullet.BoxShape(new Vecmath.Vec3(b[3],b[4],b[5]));//200,10,200));
    var groundTransform = new Bullet.Transform();
    groundTransform.setIdentity();
    if (b.length>6) groundTransform.setRotation({x:0,y:0,z:1,w:b[6]});
    groundTransform.origin.set3(b[0],b[1],b[2]);//0,-10,0);//0,-25,0
    var localInertia = new Vecmath.Vec3(0,0,0);
    //var myMotionState = new Bullet.MotionState(groundTransform);
    var cInfo = new Bullet.RigidBodyConstructionInfo(0,null,groundShape,localInertia);
    var body = new Bullet.RigidBody(cInfo);
    body.setWorldTransform(groundTransform);
    Pd5.dynamicsWorld.addRigidBody(body);
  }
  Pd5.bulletize=function(o) {
    th=new Bullet.Transform();
    var f2=1/20;//ragdoll_scale/translationscale
    var f3=f2*100;
    //var ret='';
    if (!o) return;
    if (!o.bones) return; 
    
    var dynamicsWorld=Pd5.dynamicsWorld;
    
    if (!dynamicsWorld) {
    var collision_config = new Bullet.CollisionConfiguration();
    var dispatcher = new Bullet.Dispatcher(collision_config);
    var worldAabbMin = new Vecmath.Vec3(-10000, -10000, -10000);
    var worldAabbMax = new Vecmath.Vec3(10000, 10000, 10000);
    var overlappingPairCache = new Bullet.BroadphaseInterface(worldAabbMin, worldAabbMax, 0xfffe, 0xffff, 16384, null);
    var constraintSolver = new Bullet.ConstraintSolver();
    dynamicsWorld = new Bullet.CollisionWorld(dispatcher, overlappingPairCache, constraintSolver, collision_config);
    dynamicsWorld.setGravity(new Vecmath.Vec3(0,-30,0));//0,-30,0
    Pd5.dynamicsWorld=dynamicsWorld;
    
    var boxes=Pd5.boxes;
    
                    
    for (var h=0;h<boxes.length;h++) {
      var b=boxes[h];
      Pd5.bulletBox(b);
    }
    }
    //alert('bulletTest '+dynamicsWorld);
    
    o.cm=new Bullet.Transform();
    
    var mH={},sH={},sh,mH2={};
    for (var bi=0;bi<o.bones.length;bi++) {
      var b=o.bones[bi];
      b.cr=1;b.cl=2;
      for (var wi=0;wi<b.ws.length;wi++) {
        var w=b.ws[wi];
        var m=w.mark;
        if (m===undefined) continue;
        w.bi=bi;
        if (startsWith(m,'j6')) mH[m]=w;
        else if (startsWith(m,'s')) mH[m+','+bi]=w;
        //alert('bulletTest mark '+m);
      }
    }
    
    for (var s in mH) if (mH.hasOwnProperty(s)) {
      var sa=s.split(','),s0=sa[0],s1=(sa.length>1?sa[1]:undefined);
      if (s0=='sl') {
        var w1=mH[s];
        var shh='';
        if (sa.length>2) {
          shh=s1;
          //alert(s1);
          s1=sa[2];
        }
        var wrx=mH['srx,'+s1],w0=mH['s0,'+s1];
        //alert('bulletTest wrx '+wrx+';srx,'+s1);
        if (!w0) w0={p0:new Vecmath.Vec3(0,0,0)};//alert('w0==null');
        var b=o.bones[parseInt(s1)];
        b.ox=(w1.p1.x-(w1.p0.x+w0.p0.x)/2+w0.p0.x);
        b.oy=(w1.p1.y-(w1.p0.y+w0.p0.y)/2+w0.p0.y);
        b.cr=wrx.p0.distTo(w1.p0);
        b.cl=w1.p0.distTo(w0.p0);
        sh=" (radlen "+b.cr+" "+b.cl+") (origin "+b.ox+" "+b.oy+" 0"+(shh.length>0?shh:"")+")";
        sH[s1]=sh;
        //alert('bulletTest sh='+sh);
        mH2['s1_'+s1]=w1;
        mH2['s0_'+s1]=w0;
        if (shh.length>0) b.cshh=shh;
      }
    }
    
    
    function vf(s) {
      if (s=="e") return Bullet.BulletGlobals.SIMD_EPSILON;
      if (s=="-e") return -Bullet.BulletGlobals.SIMD_EPSILON;
      return parseFloat(s);
    }
    
    
    
    var wiH={};
    for (var bi=1;bi<o.bones.length;bi++) {
      var b=o.bones[bi];
      //ret+='(s (name '+bi+')';
      var parenti=o.bones.indexOf(b.up)-1;
      //if (parenti!=-1) ret+=' (parent '+parenti+')';
      
      var s=sH[''+bi];
      //if (s) ret+=s;
      
      var l=mH2['s1_'+bi];
      var w0=mH2['s0_'+bi];
      if (!w0) {
        continue;//alert('bulletTest no w0 for joint '+bi);
      } else { 
        var cfh=f3;
        b.cx=cfh*(l.p0.x+w0.p0.x)/2;
        b.cy=cfh*(l.p0.y+w0.p0.y)/2;
        b.cz=cfh*(l.p0.z+w0.p0.z)/2;
        //ret+=' (center '+b.cx+' '+b.cy+' '+b.cz+')';
      }
      
      
    
      //alert(b.cr*f3+' '+b.cl*f3);
      var shape=new Bullet.CapsuleShape(b.cr*f3,b.cl*f3);
      //onsole.log('Pd5.bulletize... shape '+b.cr*f3+' , '+b.cl*f3);
      var positionOffset=new Vecmath.Vec3(0,0,0);//10f);
      var tmpTrans = new Bullet.Transform();
      var offset = new Bullet.Transform();
      offset.setIdentity();
      offset.origin.set1(positionOffset);
      var transform=new Bullet.Transform();
      transform.setIdentity();
      transform.origin.set3(b.ox*f3,b.oy*f3,0);
      //nsole.log('Pd5.bulletize... origin '+b.ox*f3+' , '+b.oy*f3);
      if (b.cshh) {
        var ov=b.cshh.split(' ');
        if (ov[0]=='ezyx') Bullet.MatrixUtil.setEulerZYX(transform.basis,vf(ov[1]),vf(ov[2]),vf(ov[3]));
      }
    //        if (ov.length>4) {
    //          if (ov[4]=='ezyx') Bullet.MatrixUtil.setEulerZYX(transform.basis,vf(ov,5),vf(ov,6),vf(ov,7));
    //        }
      tmpTrans.mul2(offset, transform);
      var mass=1;
      var isDynamic = (mass != 0);
       
      var localInertia = new Vecmath.Vec3();
      localInertia.set3(0,0,0);
      if (isDynamic) {
        shape.calculateLocalInertia(mass, localInertia);
      }
        
      var myMotionState = new Bullet.MotionState(tmpTrans);
      var rbInfo = new Bullet.RigidBodyConstructionInfo(mass, myMotionState, shape, localInertia);
      rbInfo.additionalDamping = true;
      var body = new Bullet.RigidBody(rbInfo);
            
      dynamicsWorld.addRigidBody(body);
    //        this.coH[s.name]=body;
      body.setDamping(0.05,0.85);
      //body.setDamping(10,10);
      body.deactivationTime=0.8;
      body.setSleepingThresholds(1.6,2.5);
      b.co=body;
      b.ct=new Bullet.Transform();
      //alert(ret);
      //ret='';
    }
    
    //Pl4n3.Ragdoll.e=Bullet.BulletGlobals.SIMD_EPSILON;
    
    
    
    for (var s in mH) if (mH.hasOwnProperty(s)) {
      var sa=s.split(','),s0=sa[0],s1=(sa.length>1?sa[1]:undefined);
      if (s0=='j6') {
        var s2=sa[2];
        if (s2=='b') continue;
        var w0=mH[s];
        var w1=mH[s0+','+s1+',b'];
        var l0=mH2['s1_'+w0.bi];
        var l1=mH2['s1_'+w1.bi];
        var n0=mH2['s0_'+w0.bi];
        var n1=mH2['s0_'+w1.bi];
        if (!l0) { alert('bulletTest no s1 l0');continue; }
        if (!l1) { alert('bulletTest no s1 l1');continue; }
        //var sh0=(w0.p0.x-(l0.p0.x+n0.p0.x)/2)+' '+(w0.p0.y-(l0.p0.y+n0.p0.y)/2)+' '+(w0.p0.z-(l0.p0.z+n0.p0.z)/2);
        //var sh1=(w1.p0.x-(l1.p0.x+n1.p0.x)/2)+' '+(w1.p0.y-(l1.p0.y+n1.p0.y)/2)+' '+(w1.p0.z-(l1.p0.z+n1.p0.z)/2);
        //alert('(j6 '+w0.bi+' '+w1.bi+' '+sh0+' '+sh1+' '+sa[3]+')');
        var localA = new Bullet.Transform(), localB = new Bullet.Transform();var tmp = new Vecmath.Vec3();
        var useLinearReferenceFrameA = true;
        localA.setIdentity();
        localB.setIdentity();
        var v0=sa[3].split(' ');
        //alert(sa[3]);
        //todo: ezyx
        
        var psh="";
        var hp=6;
        while (true) {
          if (v0.length>hp) psh=v0[hp]; else break;
          if (startsWith(psh,'ezyx')) {
            //alert(psh.substr(4,1));
            Bullet.MatrixUtil.setEulerZYX(psh.substr(4,1)=='a'?localA.basis:localB.basis,
              vf(v0[hp+1]),vf(v0[hp+2]),vf(v0[hp+3]));
            hp+=4;
          } else { alert("unknown:"+psh);break; }
        }
    
        
        
        localA.origin.set3((w0.p0.x-(l0.p0.x+n0.p0.x)/2)*f3, (w0.p0.y-(l0.p0.y+n0.p0.y)/2)*f3, (w0.p0.z-(l0.p0.z+n0.p0.z)/2)*f3);
        localB.origin.set3((w1.p0.x-(l1.p0.x+n1.p0.x)/2)*f3, (w1.p0.y-(l1.p0.y+n1.p0.y)/2)*f3, (w1.p0.z-(l1.p0.z+n1.p0.z)/2)*f3);
        var joint6DOF = new Bullet.Generic6DofConstraint(o.bones[w0.bi].co,o.bones[w1.bi].co,localA,localB,useLinearReferenceFrameA);
        tmp.set3(vf(v0[0]),vf(v0[1]),vf(v0[2]));
        joint6DOF.setAngularLowerLimit(tmp);
        tmp.set3(vf(v0[3]),vf(v0[4]),vf(v0[5]));
        joint6DOF.setAngularUpperLimit(tmp);
        
        Pd5.dynamicsWorld.addConstraint(joint6DOF,true);
      }
    }
    
    
    //  else if (s0=='j6') { //pl131020
    //    if (!test0) {
    //    var localA = new Bullet.Transform(), localB = new Bullet.Transform();var tmp = new Vecmath.Vec3();
    //    var useLinearReferenceFrameA = true;
    //    localA.setIdentity();
    //    localB.setIdentity();
    //    
    //    var psh="";
    //    var hp=15;
    //    while (true) {
    //      if (v0.length>hp) psh=v0[hp]; else break;
    //      if (Pl4n3.startsWith(psh,'ezyx')) {
    //        Bullet.MatrixUtil.setEulerZYX(Pl4n3.endsWith(psh,"a")?localA.basis:localB.basis,vf(v0,hp+1),vf(v0,hp+2),vf(v0,hp+3));
    //        hp+=4;
    //      } else { alert("unknown:"+psh);break; }
    //    }
    //    var f0=parseFloat(v0[3]);
    //    var f1=parseFloat(v0[4]);
    //    localA.origin.set3(vf(v0,3)*f2, vf(v0,4)*f2, vf(v0,5)*f2);
    //    localB.origin.set3(vf(v0,6)*f2, vf(v0,7)*f2, vf(v0,8)*f2);
    //    var joint6DOF = new Bullet.Generic6DofConstraint(this.coH[v0[1]],this.coH[v0[2]],localA,localB,useLinearReferenceFrameA);
    //    
    //    tmp.set3(vf(v0,9),vf(v0,10),vf(v0,11));//-BulletGlobals.SIMD_EPSILON, -BulletGlobals.SIMD_EPSILON, -BulletGlobals.SIMD_EPSILON);
    //    joint6DOF.setAngularLowerLimit(tmp);
    //    tmp.set3(vf(v0,12),vf(v0,13),vf(v0,14));//BulletGlobals.SIMD_PI * 0.7f, BulletGlobals.SIMD_EPSILON, BulletGlobals.SIMD_EPSILON);
    //    joint6DOF.setAngularUpperLimit(tmp);
    //    
    //    dynamicsWorld.addConstraint(joint6DOF,true);
    //    }
    
    
    
    //for (Enumeration en=mH.keys();en.hasMoreElements();) {
    //  String s=(String)en.nextElement();
    //  StringTokenizer st=new StringTokenizer(s,",");
    //  String s0=st.nextToken();
    //  String s1=st.hasMoreTokens()?st.nextToken():null;
    //  if (s0.equals("j6")) {
    //    String s2=st.nextToken();
    //    if (s2.equals("b")) continue;
    //    Weight w0=(Weight)mH.get(s);
    //    Weight w1=(Weight)mH.get(s0+","+s1+",b");
    //    //AnimJoint aj1=((DKey)md5.selAnim.keys.lastElement()).getAnimJoint(w1.joint);
    //    //pw.println("(j6 "+w0.joint.name+" "+w1.joint.name+" "+(-(w0.po[0]-aj1.pos[0]))+" "+(-(w0.po[1]-aj1.pos[1]))+" "+(-(w0.po[2]-aj1.pos[2]))+" "+-w1.po[0]+" "+-w1.po[1]+" "+-w1.po[2]+" "+st.nextToken()+")");
    //    Weight l0=(Weight)mH2.get("sl_"+w0.joint.name);
    //    Weight l1=(Weight)mH2.get("sl_"+w1.joint.name);
    //    Weight n0=(Weight)mH2.get("s0_"+w0.joint.name);
    //    Weight n1=(Weight)mH2.get("s0_"+w1.joint.name);
    //    if (l0==null) { outErr("no sl for "+w0.joint.name+". cant export j6 "+s1+".");continue; }
    //    if (l1==null) { outErr("no sl for "+w1.joint.name+". cant export j6 "+s1+".");continue; }
    //    String sh0=//(n0!=null?
    //      (w0.po[0]-(l0.po[0]+n0.po[0])/2)+" "+(w0.po[1]-(l0.po[1]+n0.po[1])/2)+" "+(w0.po[2]-(l0.po[2]+n0.po[2])/2);//:(w0.po[0]-l0.po[0]/2)+" "+(w0.po[1]-l0.po[1]/2)+" "+(w0.po[2]-l0.po[2]/2));
    //    String sh1=//(n1!=null?
    //      (w1.po[0]-(l1.po[0]+n1.po[0])/2)+" "+(w1.po[1]-(l1.po[1]+n1.po[1])/2)+" "+(w1.po[2]-(l1.po[2]+n1.po[2])/2);//:(w1.po[0]-l1.po[0]/2)+" "+(w1.po[1]-l1.po[1]/2)+" "+(w1.po[2]-l1.po[2]/2));
    //    pw.println("(j6 "+w0.joint.name+" "+w1.joint.name+" "+sh0+" "+sh1+" "+st.nextToken()+")");
    //  }
    //}
    
    //o.animStop=false;
  }
  //---
  Pd5.hcopy=function(from,to,ka,woh,keep) {
    if (ka===undefined) {
      for (var k in from) if (from.hasOwnProperty(k)) {
        if (keep) if (to[k]!==undefined) continue;
        if (!(woh&&woh[k])) to[k]=from[k];
      }
      return to;
    }
    for (var ki=0;ki<ka.length;ki++) {
      var k=ka[ki],v=from[k];
      if (v===undefined) continue;
      if (keep) if (to[k]!==undefined) continue;
      to[k]=v;
    }
    return to;
  }
  Pd5.modAnims=function(bi,ph) {
    var o=ph.o;
    for (var i=o.anims.length-1;i>=0;i--) {
      var a=o.anims[i].a;
      for (var j=a.length-1;j>=0;j--) {
        var p=a[j].bs[bi].t;
        if (ph.s) { p.x*=ph.s;p.y*=ph.s;p.z*=ph.s; }
        if (ph.dy) p.y+=ph.dy;
        if (ph.sx) p.x*=ph.sx;
        if (ph.sy) p.y*=ph.sy;
        if (ph.sz) p.z*=ph.sz;
        //a[j].bs[h].t=p;
        //log(j);
      }
    }
    
  }
  Pd5.modBone=function(ph) {
    var o=ph.o;
    var b=ph.b?ph.b:o.bones[ph.bi];
    for (var h=b.ws.length-1;h>=0;h--) {
      var p=b.ws[h].p0;
      if (ph.s) { p.x*=ph.s;p.y*=ph.s;p.z*=ph.s; }
      if (ph.sx) p.x*=ph.sx;
      if (ph.sy) p.y*=ph.sy;
      if (ph.sz) p.z*=ph.sz;
    }
    if (!o) return;
    var bi=o.bones.indexOf(b);
    //log(bi);
    for (var h=o.bones.length-1;h>=0;h--) {
      var bh=o.bones[h];
      if (bh.up!=b) continue;
      if (ph.rec) { ph.b=bh;Pd5.modBone(ph); }
      //alert(o.anims.length);
      //log(h);
      Pd5.modAnims(h,ph);
    }
  }
  Pd5.akeyAdd=function(lo) {
    var tn=(lo.ta/1000)%lo.aT;
    var t=0;
    var i=-1;
    for (var h=0;h<lo.anim.length;h++) {
      var a=lo.anim[h];
      t+=a.t;
      if (t>tn) { i=h;break; }
    }
    var ao=lo.anim[i];
    var an={t:ao.t-(t-tn),bs:[]};
    for (var h=0;h<lo.bones.length;h++) {
      var b=lo.bones[h];
      an.bs.push({t:{x:b.t.x,y:b.t.y,z:b.t.z},q:{x:b.q.x,y:b.q.y,z:b.q.z}});
    }
    ao.t=t-tn;
    lo.anim.splice(i,0,an);
    
    return {i:i,an:an};
  }
  Pd5.combine=function(o0,o1,key) {
    //remove structures from o0
    //if (false) 
    //console.log(o1);
    
    function wMarkDel(w,key) {
      //return w.mark==key;
      if (!w.mark) return false;
      return w.mark.indexOf(key)!=-1;
    }
    
    
    //if (false) 
    {
    for (var h=o0.verts.length-1;h>=0;h--) {
      var v=o0.verts[h];
      var del=false;
      //for (var i=v.ws.length-1;i>=0;i--) if (v.ws[i].mark==key) { del=true;break; }
      for (var i=v.ws.length-1;i>=0;i--) if (wMarkDel(v.ws[i],key)) { del=true;break; }
      //if (v.mark=='pant0r') del=true;
      if (del) v.del=true;  
    }
    for (var mi=o0.meshes.length-1;mi>=0;mi--) {
      var m=o0.meshes[mi];
      for (var h=m.fa.length-1;h>=0;h--) {
        var t=m.fa[h];
        if (t.v0.del||t.v1.del||t.v2.del) m.fa.splice(h,1);
      }
    }
    
    //if (false) {
    
    for (var h=o0.verts.length-1;h>=0;h--) {
      var v=o0.verts[h];
      if (v.del) o0.verts.splice(h,1);
    }
    
    
    for (var h=o0.bones.length-1;h>=0;h--) {
      var b=o0.bones[h];
      for (var i=b.ws.length-1;i>=0;i--) {
        var w=b.ws[i];
        //if (w.mark==key) b.ws.splice(i,1);
        if (wMarkDel(w,key)) b.ws.splice(i,1);
      }
    }
    //}
    }
    //add animkeys (they must have mark 'combineInsert' in o1)
    function aktext(s) {
      var at=s.split('\n');var ten='';
      for (var j=0;j<at.length;j++) {
        var th=at[j];
        if (startsWith(th,'diff ')||startsWith(th,'norm ')||startsWith(th,'spec ')) th+=' '+o0.meshes.length;
        ten+=(j>0?'\n':'')+th;
      }
      //console.log('aktext '+ten);
      return ten;
    }
    for (var h=o0.anims.length-1;h>=0;h--) {
      var a0=o0.anims[h];
      var a1=o1.animh[a0.name];
      if (!a1) continue;
      
      //if (a0.a.length==a1.length) continue;
      
      
      //onsole.log('nao');
      //for (var i=a1.length-1;i>=0;i--) {
      var t0=0,t1=0,a0i=-1;
      for (var i=0;i<a1.length;i++) {
        a0i++;
        var ak1=a1[i];
        var ak0n=a0.a[a0i];
        var cont=false;
        if (!ak1.text) cont=true;//continue;//mark
        else if (ak1.text.indexOf('combineInsert')==-1) {
          ak0n.text=(ak0n.text===undefined?'':ak0n.text+'\n')+aktext(ak1.text);
          cont=true;//mark
        }
        if (!cont) {
          o0.anim=a0.a;
        
          if (i==a1.length-1) alert('last animkey cant have combineInsert');
          var ak1n=a1[i+1];
          if (ak1n.text) if (ak1n.text.indexOf('combineInsert')!=-1) alert('cannot handle combineInsert neighbors yet');//mark
          //var ak0n=a0.a[a0i];
            
          o0.ta=(t0+(ak1.t*ak0n.t/(ak1.t+ak1n.t)))*1000;
          Pd5.calc(o0,0,0,0,1,{x:0,y:0,z:0},undefined,undefined,true);
          ////Pd5.akeyAdd(o0).an.text='combineInsert';//mark
          //var at=ak1.text.split('\n');var ten='';
          //for (var j=0;j<at.length;j++) {
          //  var th=at[j];
          //  if (startsWith(th,'diff ')||startsWith(th,'norm ')||startsWith(th,'spec ')) th+=' '+o0.meshes.length;
          //  ten+=(j>0?'\n':'')+th;
          //}
          //Pd5.akeyAdd(o0).an.text=ten;//ak1.text;//mark
          Pd5.akeyAdd(o0).an.text=aktext(ak1.text);
          console.log('Pd5.combine added animKey.');
        }
        t0+=a0.a[a0i].t;
        t1+=ak1.t;
      }
    }
    o0.anim=o0.anims[o0.selAnim?o0.selAnim:0].a;
    
    //identify which o1.bone belonges to which o0.bone and which o1.bone is new
    var b0h={};
    for (var h=o0.bones.length-1;h>=0;h--) {
      var b=o0.bones[h];
      b.bi=h;
      if (b.name) b0h[b.name]=b;
    }
    var c=0;
    for (var h=o1.bones.length-1;h>=0;h--) {
      var b=o1.bones[h];
      if (!b.name) { c++;continue; }
      var b0=b0h[b.name];
      if (b0) { //copy weights
        //console.log('Pd5.combine b0.ws.length0='+b0.ws.length);
        b0.ws=b0.ws.concat(b.ws);
        //console.log('Pd5.combine b0.ws.length1='+b0.ws.length);
      } else {
        c++;
        console.log('Pd5.combine original index of a new bone '+h);
        b.up=b0h[b.up.name];
        o0.bones.push(b);
        b.combineAdded=true;
        for (var i=o0.anims.length-1;i>=0;i--) {
          var a0=o0.anims[i];
          var a1=o1.animh[a0.name];
          for (var j=a0.a.length-1;j>=0;j--) {
            var a0k=a0.a[j];
            var a1k=a1?a1[j]:undefined;
            a0k.bs.push(a1k?a1k.bs[h]:{t:{x:0,y:0,z:0},q:{x:0,y:0,z:0}});
          }
        }
      }
    }
    console.log('Pd5.combine added '+c+' bones.');
    
    //o1.ta=0;
    //o1.recalc=true;
    o1.isEdit=true;Pd5.calc(o1,0,0,0,1,{x:0,y:0,z:0},undefined,undefined,true);//to have w.bi
    
    
    //c=0;
    //for (var h=0;h<o1.verts.length;h++) {
    //  var v=o1.verts[h];
    //  var skip=false;
    //  for (var i=v.ws.length-1;i>=0;i--) if (!v.ws[i].b.combineAdded) { skip=true;break; }
    //  if (skip) continue;
    //  c++;
    //  v.ts=[];//--temp
    //  o0.verts.push(v);
    //}
    //console.log('Pd5.combine added '+c+' verts.');
    
    
    //check for replace verts
    //if (false) 
    {
    o0.isEdit=true;Pd5.calc(o0,0,0,0,1,{x:0,y:0,z:0},undefined,undefined,true);//to have w.bi
    
    
    var cvh={};
    for (var h=o1.verts.length-1;h>=0;h--) {
      var v=o1.verts[h];
      if (!v.mark) continue;
      var ma=v.mark.split(',');
      for (var i=ma.length-1;i>=0;i--) {
        var s=ma[i],ih=s.indexOf(':');
        if (ih==-1) v[s]=1; else v[s.substr(0,ih)]=s.substr(ih+1);
      }
      var cv=v[key+'r'];
      if (cv&&(cv!=1)) cvh[cv]=v;
    }
    //console.log(cvh);
    c=0;var normalc=0;
    //if (false) 
    for (var h=o0.verts.length-1;h>=0;h--) {
      var v=o0.verts[h];
      if (!v.mark) continue;
      var ma=v.mark.split(',');
      for (var i=ma.length-1;i>=0;i--) {
        var s=ma[i],ih=s.indexOf(':');
        if (ih==-1) v[s]=1; else v[s.substr(0,ih)]=s.substr(ih+1);
      }
      //if (v.mark!='pant0r') continue;
      var cv=v[key+'r']||v[key+'n'];
      if (!cv) continue;
      var vnn=undefined,vnc=0;
      if (cv!=1) {
        vnn=cvh[cv];
        if (!vnn) { alert('Pd5.combine couldnt find vert '+cv);continue; }
      } else {
        var wna=[];
        //console.log(v);
        for (var i=v.ws.length-1;i>=0;i--) {
          var w=v.ws[i];
          //console.log(w.p0);
          for (var j=w.b.ws.length-1;j>=0;j--) {
            var wn=w.b.ws[j];
            if (wn==w) continue;
            if (dist(wn.p0,w.p0)>0.0000001) continue;
            //onsole.log(dist(wn.p0,w.p0));
            if (wna[j]) alert('Pd5.combine cannot handle multiweights yet');
            wna[i]=wn;
          }
        }
        if (wna.length==0) {
          alert('Pd5.combine wna.length==0 vert.index='+h);
          continue;
        }
        for (var i=o1.verts.length-1;i>=0;i--) {
          var vn=o1.verts[i];
          if (vn.ws.length!=wna.length) continue;
          var skip=false;
          for (var j=wna.length-1;j>=0;j--) 
            if (vn.ws.indexOf(wna[j])==-1) { skip=true;break; }
          if (skip) continue;
          if (vnn) {
            if (distuv(v,vn)<distuv(v,vnn)) vnn=vn;
            //lert('choose vn according to nearest tc '+distuv(v,vn)+' '+distuv(v,vnn));
          } else vnn=vn;
          vnc++;
        }
      }
      
      if (v[key+'n']) {
        if (v.nv) { vnn.nv=v.nv; } else { vnn.nv=v; } normalc++;
        ////console.log('Pd5.combine vnn.nvi='+vnn.nvi);
        continue;
      }
      
      
      //---now all tris of v must be reconnected to vnn, then remove v ((((and if vnc==1 remove its weights)))
      for (var mi=o0.meshes.length-1;mi>=0;mi--) {
        var m=o0.meshes[mi];
        for (var i=m.fa.length-1;i>=0;i--) {
          var t=m.fa[i];
          if (t.v0==v) { v.ts.splice(v.ts.indexOf(t),1);t.v0=vnn;vnn.ts.push(t); }
          if (t.v1==v) { v.ts.splice(v.ts.indexOf(t),1);t.v1=vnn;vnn.ts.push(t); }
          if (t.v2==v) { v.ts.splice(v.ts.indexOf(t),1);t.v2=vnn;vnn.ts.push(t); }
        }
      }
      //onsole.log('Pd5.combine replace vert marks '+v.mark+' -> '+vnn.mark);//vnn.mark=v.mark;
      o0.verts.splice(h,1);
      c++;
      //alert(v.ws.length);
      //v.ws=[];
    }
    console.log('Pd5.combine replaced '+c+' verts.');
    if (normalc>0) console.log('Pd5.combine normal-set '+normalc+' verts.');
    }
    
    //if (false) 
    {
    o0.verts=o0.verts.concat(o1.verts);
    //---
    for (var i=o0.verts.length-1;i>=0;i--) {
      var v=o0.verts[i];
      if (!v.nv) continue;
      v.nvi=o0.verts.indexOf(v.nv);
    }
    
    //console.log(m1.fa[0].v0.ws[0]);
    
    //var mn={fa:[]}
    //var m1=o1.meshes[0];
    //Pd5.hcopy(m1,mn,['comb','diff','norm','spec']);
    //! o0.meshes=o0.meshes.concat(o1.meshes);
    
    for (var h=0;h<o1.meshes.length;h++) {
      var m1=o1.meshes[h];
      var done=false;
      for (var i=0;i<o0.meshes.length;i++) {
        var m0=o0.meshes[i];
        if (m1.diff==m0.diff) { 
          console.log('Pd5.combine merging o1.mesh '+h);
          m0.fa=m0.fa.concat(m1.fa);done=true;break; }
      }
      if (!done) { console.log('Pd5.combine adding o1.mesh '+h+' fa.len='+m1.fa.length);o0.meshes.push(m1); }
    }
    }
    
    console.log('Pd5.combine done. '+o0.meshes.length);
  }
  Pd5.loadCombine=function(ch) {
    //---
    function combine(ch) {
      for (var h=0;h<ch.a.length;h++) ch.a[h].o=Pd5.load(ch.a[h].d);
      //log(a[0].o.bones.length+' '+a[1].o.bones.length);
      Pd5.combine(ch.a[0].o,ch.a[1].o,ch.key);
      //alert(a[0].o);
      //loadPd5({o5:ch.a[0].o,x:0,y:0,z:0,v:1,ego:1,rotofs:PI,s:8,sasc:0.07,rot:PI,eyeh:0.33});
      ch.cloadf(ch.a[0].o,ch);
    }
    function sload(fn,i,ch) {
      var x=new XMLHttpRequest();
      x.overrideMimeType('text/plain');
      x.open('GET',fn,true);
      x.onreadystatechange=function() {
        if (x.readyState!=4) return;
        ch.a[i].d=x.responseText;//loadS(x.responseText,true);
        for (var h=ch.a.length-1;h>=0;h--) if (!ch.a[h].d) return;
        combine(ch);
      }
      try { x.send(null); } catch (e) { log(e); }
    }
    for (var h=0;h<ch.a.length;h++) sload(ch.a[h].fn,h,ch);
    //---
  }
  //----
  Pd5.triOptPlane=function(o,ti,dbg) {
    ShapeUtils=THREE.ShapeUtils;
    var fa=o.meshes[0].fa,v0=new Vecmath.Vec3(),v1=new Vecmath.Vec3(),e=0.0001;
    //var ti=902;//902;//904
    var t=fa[ti];
    //onsole.log(t.v0.p0);onsole.log(t.v1.p0);onsole.log(t.v2.p0);
    function norm(t) {
      var p0=t.v0.p0,p1=t.v1.p0,p2=t.v2.p0;
      v0.set3(p1.x-p0.x,p1.y-p0.y,p1.z-p0.z);
      v1.set3(p2.x-p0.x,p2.y-p0.y,p2.z-p0.z);
      var v=new Vecmath.Vec3();
      v.cross(v0,v1);
      v.normalize0();
      return v;
    }
    function eq(v0,v1) {
      return Math.abs(v0-v1)<e;
    }
    function eqve(v0,v1) {
      //var dx=Math.abs(v0.x-v1.x),dy=Math.abs(v0.y-v1.y),dz=Math.abs(v0.z-v1.z);
      //return (dx<e)&&(dy<e)&&(dz<e);
      return eq(v0.x,v1.x)&&eq(v0.y,v1.y)&&eq(v0.z,v1.z);
    }
    function angle(p0,p1,p2) {
      v0.set3(p1.x-p0.x,p1.y-p0.y,p1.z-p0.z);
      v1.set3(p2.x-p0.x,p2.y-p0.y,p2.z-p0.z);
      v0.normalize0();
      v1.normalize0();
      return Math.acos(v1.dot(v0));
    }
    t.n=norm(t);
    var e0=new Vecmath.Vec3(),e1=new Vecmath.Vec3(),wu=Math.sqrt(0.5);
    if (eq(t.n.y,-1)) { e0.set3(1,0,0);e1.set3(0,0,-1); } else 
    if (eq(t.n.z,-1)) { e0.set3(1,0,0);e1.set3(0,1,0); } else 
    if (eq(t.n.x,-1)) { e0.set3(0,1,0);e1.set3(0,0,1); } else 
    if (eq(t.n.x,1)) { e0.set3(0,1,0);e1.set3(0,0,-1); } else 
    if (eq(t.n.x,wu)&&eq(t.n.y,wu)) { e0.set3(0,1,0);e1.set3(0,0,-1); } else
    {
    //console.log(t.n);
    if (eq(t.n.x,0)) e0.set3(1,0,0); else e0.set3(0,1,0);
    if (eq(t.n.y,0)) e1.set3(0,-1,0); else e1.set3(0,0,1);
    }
    //console.log(t.n);console.log(e0);console.log(e1);
    fa.splice(ti,1);
    //if (1) return;
    var ta=[t],a=[],va=[];
    
    //---collect tris,vs
    
    while (ta.length>0) {
      var t=ta[0];
      for (var i=fa.length-1;i>=0;i--) {
        var t0=fa[i],c=0;
        if (eqve(t.v0.p0,t0.v0.p0)||eqve(t.v0.p0,t0.v1.p0)||eqve(t.v0.p0,t0.v2.p0)) c++;
        if (eqve(t.v1.p0,t0.v0.p0)||eqve(t.v1.p0,t0.v1.p0)||eqve(t.v1.p0,t0.v2.p0)) c++;
        if (eqve(t.v2.p0,t0.v0.p0)||eqve(t.v2.p0,t0.v1.p0)||eqve(t.v2.p0,t0.v2.p0)) c++;
        if (c<2) continue;
        t0.n=norm(t0);
        if (!eqve(t.n,t0.n)) continue;
        fa.splice(i,1);
        ta.push(t0);
      }
      ta.splice(0,1);
      a.push(t);
      if (va.indexOf(t.v0)==-1) va.push(t.v0);
      if (va.indexOf(t.v1)==-1) va.push(t.v1);
      if (va.indexOf(t.v2)==-1) va.push(t.v2);
    }
    
    //fa=fa.concat(a);o.meshes[0].fa=fa;//--for debug display things
    
    //---combine vs
    
    for (var i=0;i<va.length;i++) {
      var vi=va[i];
      for (var j=va.length-1;j>i;j--) {
        var vj=va[j];
        //if (i==j) continue;
        if (!eqve(vi.p0,vj.p0)) continue;
        for (var k=vj.ts.length-1;k>=0;k--) {
          var t=vj.ts[k];
          if (t.v0==vj) t.v0=vi;
          if (t.v1==vj) t.v1=vi;
          if (t.v2==vj) t.v2=vi;
        }
        vi.ts=vi.ts.concat(vj.ts);
        o.verts.splice(o.verts.indexOf(vj),1);
        va.splice(j,1);
      }
    }
    
    //---dont remove, start outline nao
    //---begin with v where as!=pim2pi
    //---find next v bei checking neihbors: choose v with min-count of neigbors
    //og('pd5Opt00 '+a.length+' '+va.length);
    
    
    //if (1) return;
    //---remove vs with anglesum==2PI
    
    for (var i=va.length-1;i>=0;i--) {
      var v=va[i],as=0;
      for (var j=v.ts.length-1;j>=0;j--) {
        var t=v.ts[j];
        if (t.v0==v) as+=angle(v.p0,t.v1.p0,t.v2.p0);
        else if (t.v1==v) as+=angle(v.p0,t.v0.p0,t.v2.p0);
        else if (t.v2==v) as+=angle(v.p0,t.v1.p0,t.v0.p0);
        else console.log('wut');
      }
      v.as=as;
      if (eq(as,2*PI)) {
        v.del=1;
        va.splice(i,1);
        //o.verts.splice(o.verts.indexOf(v),1);
        continue;
      }
      //onsole.log(as+' '+v.ts.length);
    }
    
    var laa=[];
    for (var i=va.length-1;i>=0;i--) {
      var v=va[i],vh;
      if (eq(v.as,PI)||v.inla) continue;
      //og('Starting '+i);
      var la=[];
      while (1) {
        la.push(v);v.inla=1;
        //if (la.length==60) break;
        for (var j=v.ts.length-1;j>=0;j--) {
          var t=v.ts[j];
          t.v0.nc=0;t.v1.nc=0;t.v2.nc=0;
        }
        for (var j=v.ts.length-1;j>=0;j--) {
          var t=v.ts[j];
          if ((vh=t.v0)!=v) vh.nc=vh.nc==0?2:vh.nc+1;
          if ((vh=t.v1)!=v) vh.nc=vh.nc==0?2:vh.nc+1;
          if ((vh=t.v2)!=v) vh.nc=vh.nc==0?2:vh.nc+1;
        }
        var minnc=Number.MAX_VALUE,vn=undefined;
        for (var j=v.ts.length-1;j>=0;j--) {
          var t=v.ts[j];
          if ((vh=t.v0)!=v) if (!vh.del) if (vh.nc<=minnc) { if (vh.nc<minnc) { minnc=vh.nc;vn=undefined;} if (!vh.inla) vn=vh; }
          if ((vh=t.v1)!=v) if (!vh.del) if (vh.nc<=minnc) { if (vh.nc<minnc) { minnc=vh.nc;vn=undefined;} if (!vh.inla) vn=vh; }
          if ((vh=t.v2)!=v) if (!vh.del) if (vh.nc<=minnc) { if (vh.nc<minnc) { minnc=vh.nc;vn=undefined;} if (!vh.inla) vn=vh; }
          //if ((vh=t.v2)!=v) if (!vh.del) if (vh.nc<=minnc) { if (vh.nc<minnc) { minnc=vh.nc;vn=undefined;} if (la.indexOf(vh)==-1) vn=vh; }
          //if ((vh=t.v2)!=v) log(vh.nc);
        }
        //if (!vn) break;
        //console.log(v);console.log(vn);
        if (!vn||!eq(vn.as,PI)) {
          while (eq(v.as,PI)) { la.splice(la.length-1,1);v=la[la.length-1]; }
          //o.verts.push(vh=Pd5.vertNew((v.p0.x+vn.p0.x)/2,150,(v.p0.z+vn.p0.z)/2,0,0));vh.del=1;fa.push(Pd5.triNew(v,vh,vn));
        }
        if (!vn) break;
        v=vn;
      }
      laa.push(la);
      //log('vn='+vn);
      //break;
    }
    var outline=[],holes=[];va=[];
    //for (var j=0;j<Math.min(1,laa.length);j++) {
    //var ShapeUtils=THREE.ShapeUtils||THREE.Shape.Utils;
    for (var j=0;j<laa.length;j++) {
      var la=laa[j],lta=[],uvd=80;
      //og(j+' la.len='+la.length);
      if (1)//j==0)
      for (var i=0;i<la.length;i++) {
        var v=la[i],
            x=e0.dot(v.p0),
            y=e1.dot(v.p0),
            vt=new THREE.Vector2(x,y);//v.p0.x,v.p0.z);
        vt.v=v;
        v.u=x/uvd;v.v=y/uvd;
        //v.u=v.p0.x/uvd;v.v=v.p0.z/uvd;
        lta.push(vt);//va.push(v);
      }
      //else 
      //for (var i=la.length-1;i>=0;i--) {
      //  //var x=e0.dot(v.p0),y=e1.dot(v.p0);;
      //  var v=la[i],x=e0.dot(v.p0),y=e1.dot(v.p0),vt=new THREE.Vector2(x,y);vt.v=v;
      //  v.u=x/uvd;v.v=y/uvd;
      //  lta.push(vt);//va.push(v);
      //}
      if (1)
      //if (!THREE.Shape.Utils.isClockWise(lta)) {
      if (ShapeUtils.isClockWise(lta)^(j==0)) {
        //var ahi=[];for (var i=lta.length-1;i>=0;i--) ahi.push(lta[i]);lta=ahi;
        lta=lta.reverse();
        //og('reorder');
      }
      //if (j>0) console.log(lta);
      //og(ShapeUtils.isClockWise(lta));
      if (j==0) outline=lta; else holes.push(lta);
    }
    //for (var j=0;j<laa.length;j++) {var la=laa[j]; for (var i=0;i<la.length;i++) va.push(la[i]); }
    for (var i=0;i<outline.length;i++) va.push(outline[i].v); 
    for (var j=0;j<holes.length;j++) {var la=holes[j]; for (var i=0;i<la.length;i++) va.push(la[i].v); }
    //onsole.log(ShapeUtils);
    var taa=ShapeUtils.triangulateShape(outline,holes);
    //console.log(taa);
    //og('triangulated:'+taa.length);
    //var la=laa[0];
    for (var i=0;i<taa.length;i++) {
      var ah=taa[i];
      fa.push(Pd5.triNew(va[ah[0]],va[ah[2]],va[ah[1]]));
    }
    
    //if (dbg) {alert(JSON.stringify(outline));}
    
    //og('pd5Opt01 '+a.length+' '+va.length);
    if (1) return;
    
    for (var i=a.length-1;i>=0;i--) {
      var t=a[i],c=0;
      if (t.v0.del) c++;if (t.v1.del) c++;if (t.v2.del) c++;
      if (c<2) continue;
    var ti;
    t.v0.ts.splice(ti=t.v0.ts.indexOf(t),1);if (ti==-1) log('TI-1');
    t.v1.ts.splice(ti=t.v1.ts.indexOf(t),1);if (ti==-1) log('TI-1');
    t.v2.ts.splice(ti=t.v2.ts.indexOf(t),1);if (ti==-1) log('TI-1');
      fa.splice(fa.indexOf(t),1);//debug
      a.splice(i,1);
    }
    
    log('pd5Opt02 '+a.length+' '+va.length);
    
    if (1) return;
    
    //---remove vs with anglesum==PI
    //for (var i=0;i<va.length;i++) {
    var deldone=true,c2=0;
    while (deldone) {
     deldone=false;
     c2++;if (c2>0) break;
     for (var i=va.length-1;i>0;i--) {
      var v=va[i];
      if (eq(v.as,PI)) continue;
      for (var j=v.ts.length-1;j>=0;j--) {
        var t=v.ts[j],vn=undefined;
        if (v==t.v0) { if (eq(t.v1.as,PI)) vn=t.v1; else if (eq(t.v2.as,PI)) vn=t.v2; }
        else if (v==t.v1) { if (eq(t.v0.as,PI)) vn=t.v0; else if (eq(t.v2.as,PI)) vn=t.v2; }
        else if (v==t.v2) { if (eq(t.v0.as,PI)) vn=t.v0; else if (eq(t.v1.as,PI)) vn=t.v1; }
        if (!vn) continue;
        //---found nextvert with pi, now remove tri with vert & nextvert
        var ti;
        t.v0.ts.splice(ti=t.v0.ts.indexOf(t),1);if (ti==-1) log('TI-1');
        t.v1.ts.splice(ti=t.v1.ts.indexOf(t),1);if (ti==-1) log('TI-1');
        t.v2.ts.splice(ti=t.v2.ts.indexOf(t),1);if (ti==-1) log('TI-1');
        a.splice(a.indexOf(t),1);
        fa.splice(fa.indexOf(t),1);//debug
        
        //v.ts.splice(j,1);
        //---now delete nextvert, move all its tris to vert
        //for (var k=vn.ts.length-1;k>=0;k--) {
        for (var k=0;k<vn.ts.length;k++) {
          var tn=vn.ts[k];
          if (tn==t) alert('NOOOOO');//{ console.log('tn==t');console.log(v);console.log(vn);return;continue; }
          if (tn.v0==vn) tn.v0=v; else if (tn.v1==vn) tn.v1=v; else tn.v2=v;
          v.ts.push(tn);
        }
        //if (!eq(vn.as,PI)) log('NAO!');
        var vi=va.indexOf(vn);
        if (vi==-1) {
          alert('NOOO');//log('NAO -1 '+vn);console.log('NAO -1');console.log(vn);console.log(v);
        } else {
          //if (!eq(va[vi].as,PI)) log('NAO!2');
          vn.delby=v;
          va.splice(vi,1);
          o.verts.splice(o.verts.indexOf(vn),1);
          deldone=true;
        }
        //break;
      }
      if (deldone) i-=2;//break;//i-=2; //---TODO: WHY DIFFERENT RESULT?
     }
    }
    
    log('pd5Opt1 '+a.length+' '+va.length);
    
    if (1) return;
    
    //console.log(THREE.Shape.Utils);
    //--- now trace outline,holes from verts
    //    problematic e.g. howto get right vert order from a quad (4 verts, 2 tris)?
    //    maybe va has already right order, just queue verts that are connected
    //    first check api for triangulate
    
    //--- in va construct v.n from v.ts
    
    for (var i=va.length-1;i>=0;i--) {
      var v=va[i];v.ne=[];
      log('vert '+i);
      if (1) for (var j=v.ts.length-1;j>=0;j--) {
        var t=v.ts[j];
        //log('  t '+a.indexOf(t));
    //if (v==t.v0) { if ((!t.v1.del)&&(v.ne.indexOf(t.v1)==-1)&&(t.v1!=v)) v.ne.push(t.v1);if ((!t.v2.del)&&(v.ne.indexOf(t.v2)==-1)&&(t.v2!=v)) v.ne.push(t.v2); }
    //if (v==t.v1) { if ((!t.v0.del)&&(v.ne.indexOf(t.v0)==-1)&&(t.v0!=v)) v.ne.push(t.v0);if ((!t.v2.del)&&(v.ne.indexOf(t.v2)==-1)&&(t.v2!=v)) v.ne.push(t.v2); }
    //if (v==t.v2) { if ((!t.v1.del)&&(v.ne.indexOf(t.v1)==-1)&&(t.v1!=v)) v.ne.push(t.v1);if ((!t.v0.del)&&(v.ne.indexOf(t.v0)==-1)&&(t.v0!=v)) v.ne.push(t.v0); }
        if (v==t.v0) { if ((!t.v1.del)&&(v.ne.indexOf(t.v1)==-1)) v.ne.push(t.v1);if ((!t.v2.del)&&(v.ne.indexOf(t.v2)==-1)) v.ne.push(t.v2); }
        if (v==t.v1) { if ((!t.v0.del)&&(v.ne.indexOf(t.v0)==-1)) v.ne.push(t.v0);if ((!t.v2.del)&&(v.ne.indexOf(t.v2)==-1)) v.ne.push(t.v2); }
        if (v==t.v2) { if ((!t.v1.del)&&(v.ne.indexOf(t.v1)==-1)) v.ne.push(t.v1);if ((!t.v0.del)&&(v.ne.indexOf(t.v0)==-1)) v.ne.push(t.v0); }
      }
      //log(i+' '+v.ne.length+' '+v.as);
      for (var j=0;j<v.ne.length;j++) log(' ne '+va.indexOf(v.ne[j]));
      //onsole.log(v);
    }
    
    //if (1) return;
    
    a=[];var v=va[0];
    while (1) {
      a.push(v);va.splice(va.indexOf(v),1);
      var vn=undefined;
      for (var i=v.ne.length-1;i>=0;i--) {
        var vh=v.ne[i];
        if (a.indexOf(vh)==-1) {
          vn=vh;break;
        }
      }
      if (!vn) break;
      v=vn;
    }
    
    log('a.len='+a.length);
  }
  Pd5.triOpt=function(o) {
    var fa=o.meshes[0].fa,fah=[];
    for (var i=0;i<fa.length;i++) { fa[i].check=true;fah.push(fa[i]); }
    //var t1=o.meshes[0].fa[904];
    Pd5.triOptPlane(o,0);//904);//20
    //if (1)
    //for (var j=0;j<119;j++)
    var change=true;
    while (change) {
    change=false;
    for (var i=0;i<fa.length;i++) {
      if (fa[i].check) {
        //og('pd5Opt next '+i+' '+fah.indexOf(fa[i]));
        Pd5.triOptPlane(o,i);
        change=true;
        break;
      }
    }
    }
    //pd5OptPlane(o,o.meshes[0].fa.indexOf(t1));
  }
}
)(Pd5);


//---
//fr o,2
//fr o,2,31
//fr o,2,37
//fr o,2,40,75
//fr o,2,46
//fr o,2,46,44
//fr o,2,47,1
//fr o,2,47,2
//fr o,2,47,2,3
//fr p,60,508
