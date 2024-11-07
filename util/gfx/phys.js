//----
console.log('Phys 0.80 ');//FOLDORUPDATEVERSION
var Phys=function(gps) {
  //---
  let physTris=new Array(),ptris,
    p1=new Vecmath.Vec3(),p2=new Vecmath.Vec3(),p3=new Vecmath.Vec3(),
    b=new Vecmath.Vec3(),a=new Vecmath.Vec3(),rnormal=new Vecmath.Vec3(),
    bnorm=new Vecmath.Vec3(),delta=new Vecmath.Vec3(),a2=new Vecmath.Vec3(),rnorm2=new Vecmath.Vec3(),
    pf=new Vecmath.Vec3(),pt=new Vecmath.Vec3(),pt2=new Vecmath.Vec3(),physA=new Vecmath.Vec3(),physB=new Vecmath.Vec3(),
    physDbg={},physDbgCount=0,physClusters,
    phf=250,gscale=1,physDampE=0.005,
    //^--params also in  wloom, if wloom scripts changes them, params here needs also be changed
    V_MIN=0.001,
    hTexI=6;
  
  function physClusterInit(p) {
    if ((!physClusters)||physTris.length==0) return;
    var pc=physClusters;
    if (!pc.physTris) pc.physTris=physTris;
    var gr=50;
    var px=Math.floor(0.5+p.x/gr)*gr,py=Math.floor(0.5+p.y/gr)*gr,pz=Math.floor(0.5+p.z/gr)*gr;
    var k=px+' '+py+' '+pz;
    physTris=pc[k];
    if (physTris) return;
    physTris=[];
    for (var i=0;i<pc.physTris.length;i++) {
      var t=pc.physTris[i],
        x=t.p0.x,y=t.p0.y,z=t.p0.z,
        dx=x-px,dy=y-py,dz=z-pz,
        d=dx*dx+dy*dy+dz*dz;//,dmax=Math.max(dmax,d);      
      if (d<50000) physTris.push(t);//splice(i,1);
    }
    physClusters[k]=physTris;
    //og('physClusterInit '+k);
  }
  function physTriAdd(t) {
    //onsole.log('triAdd');
    p1.sub2(t.p0,t.p1);
    p2.sub2(t.p0,t.p2);
    p3.cross(p1,p2);
    var hf=p3.length();
    //if (t.normal==null) 
    t.normal=new Vecmath.Vec3();
    t.normal.scale2(1/hf,p3);
    t.normalD=-t.normal.dot(t.p0);
    physTris.push(t);
  }
  function physicsInTri(r,xp1,yp1,xp2,yp2,xp3,yp3,xp,yp,dbg) {
    if (dbg&&(physDbgCount>10)) dbg=undefined;
    if (dbg) {
      physDbgCount++;
      log('physicsInTri 1) '+xp1+','+yp1+' 2) '+xp2+','+yp2+' 3) '+xp3+','+yp3+' () '+xp+','+yp+' ');
      physDbg={p0:{x:xp1,y:yp1},p1:{x:xp2,y:yp2},p2:{x:xp3,y:yp3},p:{x:xp,y:yp}};
    }
    if (Vecmath.inLine(xp1,yp1,xp2,yp2,xp,yp)
      ||Vecmath.inLine(xp1,yp1,xp3,yp3,xp,yp)) return true;
    var xh,yh,x1=0,y1=0,x2=0,y2=0;
    var h;
    var lower=false;
    var higher=false;
    for (h=0;h<3;h++) {
    switch (h) {
      case 0:x1=xp1;y1=yp1;x2=xp2;y2=yp2;break;
      case 1:x1=xp1;y1=yp1;x2=xp3;y2=yp3;break;
      case 2:x1=xp2;y1=yp2;x2=xp3;y2=yp3;break;
    }
      if (x1>x2) { xh=x1;x1=x2;x2=xh;yh=y1;y1=y2;y2=yh; }
      if ((x1-r<=xp)&(x2+r>=xp)) {
        //if (x1==x2) return true;
        if (Math.abs(x1-x2)<0.0001) { 
          if (y1>y2) { yh=y1;y1=y2;y2=yh; }
          if ((y1-r<=yp)&&(y2+r>=yp)) {
            if (dbg) log('physInTris ret0 true');
            return true; 
          }
          continue;
        }
        yh=y1+(xp-x1)/(x2-x1)*(y2-y1);
        if (yh-r<=yp) lower=true;
        if (yh+r>=yp) higher=true;
      }
    }
    var ret=lower&&higher;
    if (dbg) log('physInTris ret1 '+ret);
    return ret;
  }
  function interLinePlanef(normal,d,a,b) {
    return -(normal.dot(a)+d)/normal.dot(b);
  }
  function physicsBeam1(radius) {
    var jCount=0, j=0;
    var minj=2000;
    var blength=b.length();
    
    if (blength<V_MIN) { b.set3(0,0,0);return false; }
    bnorm.set1(b);
    bnorm.normalize0();
    
    var r2=radius;
    delta.set3(0,0,-radius);
    a2.set3(0,0,0);
    //beamdebug='';    
    
    for (var th=physTris.length-1;th>=0;th--) {
      tri=physTris[th];
      //tri.inside=undefined;
      tri.beam=undefined;
    
      a2.scale2(radius,tri.normal);
      a2.add1(a);
      a2.add1(delta);
    
    
      //if (tri==debugTri) shp="a2="+a2.x+" "+a2.y+" "+a2.z+" b="+b.x+" "+b.y+" "+b.z+" blength="+blength;
      j=interLinePlanef(tri.normal,tri.normalD,a2,b);
      //if (tri==debugTri) shp+=" j="+j;
    
      if ((j<1)&(j>=0)) {//-1)) {
        //if (tri==debugTri) log=shp;
    
        a2.x+=b.x*j;
        a2.y+=b.y*j;
        a2.z+=b.z*j;	
        var o0,o1,o2;
    
        var inside;
        //if (radius==0) {
          ////var ch=0;
          ////if (Vecmath.inTri(tri.p0.x,tri.p0.y,tri.p1.x,tri.p1.y,tri.p2.x,tri.p2.y,a2.x,a2.y)) ch++;
          ////if (Vecmath.inTri(tri.p0.x,tri.p0.z,tri.p1.x,tri.p1.z,tri.p2.x,tri.p2.z,a2.x,a2.z)) ch++
          ////if (Vecmath.inTri(tri.p0.y,tri.p0.z,tri.p1.y,tri.p1.z,tri.p2.y,tri.p2.z,a2.y,a2.z)) ch++;
          ////inside=ch>1;
        //inside=(o0=Vecmath.inTri(tri.p0.x,tri.p0.y,tri.p1.x,tri.p1.y,tri.p2.x,tri.p2.y,a2.x,a2.y))
        //     &&(o1=Vecmath.inTri(tri.p0.x,tri.p0.z,tri.p1.x,tri.p1.z,tri.p2.x,tri.p2.z,a2.x,a2.z))
        //     &&(o2=Vecmath.inTri(tri.p0.y,tri.p0.z,tri.p1.y,tri.p1.z,tri.p2.y,tri.p2.z,a2.y,a2.z));
          //log('-><-');
        //} else
        inside=(o0=physicsInTri(radius,tri.p0.x,tri.p0.y,tri.p1.x,tri.p1.y,tri.p2.x,tri.p2.y,a2.x,a2.y))//,th==98))
             &&(o1=physicsInTri(radius,tri.p0.x,tri.p0.z,tri.p1.x,tri.p1.z,tri.p2.x,tri.p2.z,a2.x,a2.z))//,th==98))
             &&(o2=physicsInTri(radius,tri.p0.y,tri.p0.z,tri.p1.y,tri.p1.z,tri.p2.y,tri.p2.z,a2.y,a2.z));//,th==98));
    
        //if (th==102) log('physicsBeam1 102 '+o0+' '+o1+' '+o2);
        
        if (inside)
          if (b.dot(tri.normal)<0)
            inside=false;
        //
        if (inside) {
          jCount++;
          tri.beam=true;
          //beamdebug=beamdebug+'#'+th+' j='+Math.floor(j*100)/100+' '+o0+' '+o1+' '+o2;
          if (tri.mark!=2) {
            //if (tri==debugTri) System.out.println("---in  "+shp);
            tri.mark=2;
          }
          if (minj>j) { minj=j; }//rnormal.set1(tri.normal); }
          ////console.log('physicsBeam1');
          ////console.log(tri);
          //break;
        } //else { var c=0;if (o0) c++;if (o1) c++;if (o2) c++;if (c==2) tri.mark=1; }
      } //else if ((tri==debugTri)&&(tri.mark==2)) {
        //tri.mark=3;
        //System.out.println("   out "+shp);
      //}
    }
    
    
    
    if (jCount>0) {
      ////pbj=j;
      //if ((j<0)||(j>1)) return false;
      j=minj;
      if ((j<0)||(j>1)) return false;
      a.x+=b.x*j;
      a.y+=b.y*j;
      a.z+=b.z*j;
      return true;
    } 
    //pbj=-1;
    return false;
  }
  function physicsBeam2(from,to,radius) {
    //from=eye,to=cam
    if (window.PhysInspect) for (var ti=physTris.length-1;ti>=0;ti--) physTris[ti].mark=undefined;
    var ft=10;
    a.set3(from[0]/ft,from[2]/ft,-from[1]/ft);pf.set1(a);
    pt.set3(to[0]/ft,to[2]/ft,-to[1]/ft);
    physClusterInit(a);
    b.set3((to[0]-from[0])/ft,(to[2]-from[2])/ft,(-to[1]+from[1])/ft);
    physA.set1(a);physB.set1(b);
    //System.err.println("physicsBeam");
    if (radius===undefined) radius=5;
    if (physicsBeam1(radius)) {//5
      //System.err.println("physicsBeam");
      pt2.set1(a);
      to[0]=a.x*ft;to[1]=-a.z*ft;to[2]=a.y*ft;
      return true;
      //to[1]+=100;
    }
    return false;
  }
  function physicsCalc(o,fa,time,dtime) {
    var ft=10;
    //if (fc<20) log(fa+' time='+time+' dtime='+dtime);fc++;
    //onsole.log('physicsCalc dtime='+dtime);
    //console.log(Conet.f4(fa[0])+' '+Conet.f4(fa[1])+' '+Conet.f4(fa[2])
    //  +' '+Conet.f4(fa[3])+' '+Conet.f4(fa[4])+' '+Conet.f4(fa[5])
    //);
    
    dtime=Math.min(dtime,200);
    var vfak=dtime/1000;
    
    var anz,jCount;
    var hj,j,minj,radius2;//,blength;
    var wasCollTeil,inside;
    var tri;
    var physDaempf=0.99,physFlyDaempf=1;
    var physMass=50*gscale;
    fa[4]=Math.min(500*gscale,fa[4]+physMass*dtime/(20));//teil.v.z=fa[4];///(20*gamespeed));
    b.set3(fa[3]*vfak,fa[5]*vfak,fa[4]*vfak);//P3d.p3Mul(b,teil.v,vfak);
    
    //onsole.log('tris.length='+physTris.length);
    
    var e=physDampE;if ((Math.abs(b.x)<e)&&(Math.abs(b.y)<e)&&(Math.abs(b.z)<e)) { fa[3]=0;fa[4]=0;fa[5]=0;return; }//continue;
    //if ((b.x==0)&(b.y==0)&(b.z==0)) return;//continue;
    a.set3(fa[0]/ft,fa[2]/ft,-fa[1]/ft);//P3d.p3Copy(a,teil.pos);//-
    physClusterInit(a);
    anz=0;
    rnormal.z=0;
    var jsum=0;
    var physC=o.physC?o.physC:1;
    while (true) {
      jCount=0;
      minj=2000;
      var blength=b.length();//P3d.p3Length(b);
    
      if (blength<V_MIN) { b.set3(0,0,0);break; }
      bnorm.set1(b);
      bnorm.normalize0();
      wasCollTeil=false;
    
      //var radius=(o.physRadius?o.physRadius:10)*gscale;//10,20
      var radius=(o.physRadius?o.physRadius:10)*gscale;//10,20
      var r2=radius;//*3/4;
      
      //var ri=0;//for (var ri=0;ri<1;ri++) {
      //delta.set3(0,0,-radius*(1+ri*2));//teil.radius=15;
      a2.set3(0,0,0);
        
    
      for (var th=physTris.length-1;th>=0;th--) {
        tri=physTris[th];
          
    //    if ((th==0)&&standAlone) {
    //      logA[0]="p0="+tri.p[0];
    //      logA[1]="p1="+tri.p[1];
    //      logA[2]="p2="+tri.p[2];
    //      logA[3]="normal="+tri.normal;
    //      logA[4]="normalD="+tri.normalD;
    //    }
    //      
        a2.scale2(radius,tri.normal);//P3d.p3Mul(a2,tri.normal,radius);
        a2.add1(a);
        for (var ri=0;ri<physC;ri++) {
        //for (var ri=(o.physC?o.physC:1)-1;ri>=0;ri--) {
        delta.set3(0,0,-radius*(1+ri*2));//teil.radius=15;
        a2.add1(delta);//      P3d.p3Add(a2,a2,delta);
    //      if (tri==debugTri) shp="a2="+a2.x+" "+a2.y+" "+a2.z+" b="+b.x+" "+b.y+" "+b.z+" blength="+blength;
        j=interLinePlanef(tri.normal,tri.normalD,a2,b);
    //      if (tri==debugTri) shp+=" j="+j;
    
        if ((j<1)&(j>=-1)) {
          //if (tri==debugTri) log=shp;
          //ebene wird geschnitten gucken ob punkt in tri;
          a2.x+=b.x*j;
          a2.y+=b.y*j;
          a2.z+=b.z*j;
          var o0,o1,o2;
    
          inside=(o0=physicsInTri(radius,tri.p0.x,tri.p0.y,tri.p1.x,tri.p1.y,tri.p2.x,tri.p2.y,a2.x,a2.y))
                &(o1=physicsInTri(radius,tri.p0.x,tri.p0.z,tri.p1.x,tri.p1.z,tri.p2.x,tri.p2.z,a2.x,a2.z))
                &(o2=physicsInTri(radius,tri.p0.y,tri.p0.z,tri.p1.y,tri.p1.z,tri.p2.y,tri.p2.z,a2.y,a2.z));
          //log('-'+inside);
    
          if (inside)
            if (b.dot(tri.normal)<0)
              inside=false;
    
          if (inside) {
            jCount++;
            if (tri.mark!=2) {
              //if (tri==debugTri) System.out.println("---in  "+shp);
              tri.mark=2;
            }
            if (minj>j) { minj=j;rnormal.set1(tri.normal); }
          } else {
          }
        }} //else if ((tri==debugTri)&&(tri.mark==2)) {
    //         tri.mark=3;
    //         System.out.println("   out "+shp);
    //       }
      }
      if (jCount>0) {
        j=minj;//log('j='+j,undefined,true);
        jsum+=j;
        a.x+=b.x*j;
        a.y+=b.y*j;
        a.z+=b.z*j;
    
    
        rnorm2.scale2(-1,rnormal);
        hj=-rnorm2.dot(b);
        rnorm2.scale1(hj*(1+anz/3));
        b.add1(rnorm2);        
      } else {
        //dobreak=true; 
        break;
      }
      anz++;
      if (anz>7) {
        //dobreak=true; 
        break;
      }
    }
    //  if (dobreak) break;
    //  }
    
    a.add1(b);
    fa[0]=a.x*ft;fa[1]=-a.z*ft;fa[2]=a.y*ft;//P3d.p3Copy(teil.pos,a);
    
    //if (jsum!=0) log('jsum='+jsum,undefined);
    if (o.jsum==undefined) { o.jsum=0;o.jsumc=0;o.jsumt=0; }
    o.jsum+=jsum;
    o.jsumt+=dtime;
    o.jsumc++;
    if (o.jsumt>100) {
      var ajsum=o.jsum/o.jsumc;
      //log('ajsum='+ajsum,undefined,1);
      o.stuck=ajsum>0.2;
      o.jsum=0;o.jsumc=0;o.jsumt=0;
    }
    
    
    
    
    if (b.length()>V_MIN) {
        bnorm.set1(b);
        bnorm.normalize0();
        a2.set3(fa[3],fa[5],fa[4]);
        var fh=a2.dot(bnorm);//teil0.v
      
        fa[3]=bnorm.x*fh;fa[5]=bnorm.y*fh;fa[4]=bnorm.z*fh;//P3d.p3Mul(teil0.v,bnorm,P3d.p3Skalar(teil0.v,bnorm));
    } else {
      fa[3]=0;fa[5]=0;fa[4]=0;//P3d.p3Set(teil0.v,0,0,0);
    }
      
    var flying=(rnormal.z<=0.1);
    
    if (!flying) {
      var fh=Math.pow(physDaempf,dtime);
      fa[3]*=fh;fa[4]*=fh;fa[5]*=fh;//P3d.p3Mul(teil0.v,teil0.v,(float)Math.pow(physDaempf,dtime));
    } else if (physFlyDaempf!=1) {
      var fh=Math.pow(physFlyDaempf,dtime);
      fa[3]*=fh;fa[4]*=fh;fa[5]*=fh;//P3d.p3Mul(teil0.v,teil0.v,(float)Math.pow(physFlyDaempf,dtime));
    }
    o.flying=flying;
  }
  
  function finishTris(o) {
    var fh=25;
      var go=o.go;
      var fh2=fh*(o.sc||1);
      
      var xmi=Number.MAX_VALUE,xma=-Number.MAX_VALUE;
      var ymi=Number.MAX_VALUE,yma=-Number.MAX_VALUE;
      var zmi=Number.MAX_VALUE,zma=-Number.MAX_VALUE;
    
    //onsole.log('finishTris 0');
    
    //if (false) {
    if (o.o5) {
      var o5=o.o5;
      //if (isGlge) 
      fh2/=10;
      //fh2/=gscale;
      if (o.rot) {
        //alert('phys rot not implemented yet.');
        var m=new Vecmath.Mat4();
        //var v=new Vecmath.Vec3();
        m.rotY(o.rot);
        for (var h=o5.verts.length-1;h>=0;h--) {
          var vh=o5.verts[h];
          vh.p0.set1(vh.p1);
          m.transformV3(vh.p0,vh.p1);
        }
        //o.rot=0;
        //Pd5.calcNormals(o5);//,true);
      }
      
      if (!o5.fa) o5.fa=o5.meshes[0].fa;
      for (var mi=o5.meshes.length-1;mi>=0;mi--) {
        var fa=o5.meshes[mi].fa;
      //onsole.log('finishTris 1');
      //let t=fa[0];
      //console.log(JSON.stringify(t.v0.p0)+' '+JSON.stringify(t.v1.p0)+' '+JSON.stringify(t.v2.p0));
      //console.log(JSON.stringify(t.v0.p1)+' '+JSON.stringify(t.v1.p1)+' '+JSON.stringify(t.v2.p1));
      //onsole.log(o.x+' '+o.y+' '+o.z);
      let ox=o.x||0,oy=o.y||0,oz=o.z||0;
      //onsole.log(ox+' '+oy+' '+oz+' '+fh+' '+fh2);
      for (var h=fa.length-1;h>=0;h--) {
        let t=fa[h];
        if (t.p) if (t.p.coll=='v') continue;
        var p0=t.v0.p1;
        var p1=t.v2.p1;
        var p2=t.v1.p1;
        var x0=p0.x*fh2+ox*fh,y0=p0.z*fh2+oz*fh,z0=p0.y*fh2-oy*fh;
        var x1=p1.x*fh2+ox*fh,y1=p1.z*fh2+oz*fh,z1=p1.y*fh2-oy*fh;
        var x2=p2.x*fh2+ox*fh,y2=p2.z*fh2+oz*fh,z2=p2.y*fh2-oy*fh;
        //if (isGlge) { x0-=250;x1-=250;x2-=250; }
        //if (h==0) console.log('finishPhysTris0 '+x0+','+y0+','+z0+' '+x1+','+y1+','+z1+' '+x2+','+y2+','+z2);
        physTriAdd(t={p0:new Vecmath.Vec3(x0,y0,z0),
                      p1:new Vecmath.Vec3(x1,y1,z1),
                      p2:new Vecmath.Vec3(x2,y2,z2)});
      }}
      
      
      if (o.rot) for (var h=o5.verts.length-1;h>=0;h--) {
        var vh=o5.verts[h];
        vh.p1.set1(vh.p0);
      }
      
      //....
    } else {
    
      for (var mi=o.go.meshes.length-1;mi>=0;mi--) 
      { 
      go=mi==0?o.go:o.go.meshes[mi];
      var ta=go.colltris?go.colltris:go.indices;
      for (var h=ta.length/3-1;h>=0;h--) {
        var i0=ta[h*3]*3;
        var i1=ta[h*3+2]*3;
        var i2=ta[h*3+1]*3;
        var x0=go.fa[i0]*fh2+o.x*fh,y0=go.fa[i0+2]*fh2+o.z*fh,z0=-go.fa[i0+1]*fh2-o.y*fh;
        var x1=go.fa[i1]*fh2+o.x*fh,y1=go.fa[i1+2]*fh2+o.z*fh,z1=-go.fa[i1+1]*fh2-o.y*fh;
        var x2=go.fa[i2]*fh2+o.x*fh,y2=go.fa[i2+2]*fh2+o.z*fh,z2=-go.fa[i2+1]*fh2-o.y*fh;
        xmi=Math.min(xmi,x0,x1,x2);xma=Math.max(xma,x0,x1,x2);
        ymi=Math.min(ymi,y0,y1,y2);yma=Math.max(yma,y0,y1,y2);
        zmi=Math.min(zmi,z0,z1,z2);zma=Math.max(zma,z0,z1,z2);
      }
      }
      //log('xmi='+xmi+' xma='+xma+' '+(xma-xmi));
      var xw=xma-xmi,yw=yma-ymi,zw=zma-zmi;
    
      //lert(xmi+' '+xma+' '+xw);
      var e=1000;//0.001;
      for (var mi=o.go.meshes.length-1;mi>=0;mi--) 
      { 
      go=mi==0?o.go:o.go.meshes[mi];
      var ta=go.colltris?go.colltris:go.indices;
      //onsole.log('finishTris 2');
      for (var h=ta.length/3-1;h>=0;h--) {
        var i0=ta[h*3]*3;
        var i1=ta[h*3+2]*3;
        var i2=ta[h*3+1]*3;
        var x0=go.fa[i0]*fh2+o.x*fh,y0=go.fa[i0+2]*fh2+o.z*fh,z0=-go.fa[i0+1]*fh2-o.y*fh;
        var x1=go.fa[i1]*fh2+o.x*fh,y1=go.fa[i1+2]*fh2+o.z*fh,z1=-go.fa[i1+1]*fh2-o.y*fh;
        var x2=go.fa[i2]*fh2+o.x*fh,y2=go.fa[i2+2]*fh2+o.z*fh,z2=-go.fa[i2+1]*fh2-o.y*fh;
        //if (h==0) log('finishPhysTris '+x0+','+y0+','+z0+' '+x1+','+y1+','+z1+' '+x2+','+y2+','+z2);
        physTriAdd(t={p0:new Vecmath.Vec3(x0,y0,z0),
                      p1:new Vecmath.Vec3(x1,y1,z1),
                      p2:new Vecmath.Vec3(x2,y2,z2)});
                      
        //now we add tris at the edges so that char dont falls through with low fps
        if (usePtd) {
        if ((Math.abs(x0-xma)<e)||(Math.abs(x1-xma)<e)||(Math.abs(x2-xma)<e)) //{
          physTriAdd(t={p0:new Vecmath.Vec3(x0-xw,y0,z0),p1:new Vecmath.Vec3(x1-xw,y1,z1),p2:new Vecmath.Vec3(x2-xw,y2,z2)}); //}
        if ((Math.abs(x0-xmi)<e)||(Math.abs(x1-xmi)<e)||(Math.abs(x2-xmi)<e)) //{
          physTriAdd(t={p0:new Vecmath.Vec3(x0+xw,y0,z0),p1:new Vecmath.Vec3(x1+xw,y1,z1),p2:new Vecmath.Vec3(x2+xw,y2,z2)}); //}
        if ((Math.abs(y0-yma)<e)||(Math.abs(y1-yma)<e)||(Math.abs(y2-yma)<e)) //{
          physTriAdd(t={p0:new Vecmath.Vec3(x0,y0-yw,z0),p1:new Vecmath.Vec3(x1,y1-yw,z1),p2:new Vecmath.Vec3(x2,y2-yw,z2)}); //}
        if ((Math.abs(y0-ymi)<e)||(Math.abs(y1-ymi)<e)||(Math.abs(y2-ymi)<e)) //{
          physTriAdd(t={p0:new Vecmath.Vec3(x0,y0+yw,z0),p1:new Vecmath.Vec3(x1,y1+yw,z1),p2:new Vecmath.Vec3(x2,y2+yw,z2)}); //}
        }
        //if ((Math.abs(z0-zma)<e)||(Math.abs(z1-zma)<e)||(Math.abs(z2-zma)<e)) {
        //  physTriAdd(t={p0:new Vecmath.Vec3(x0,y0,z0-zw),p1:new Vecmath.Vec3(x1,y1,z1-zw),p2:new Vecmath.Vec3(x2,y2,z2-zw)}); }
        //log(t.p0+' '+t.p1+' '+t.p2+' normal='+t.normal+' normalD='+t.normalD);
      }
      }
    }
    
    //console.log(physTris.length);
    //onsole.log(physTris[0]);
  }
  function calc0(o,pha,dt) {
    //---
    //onsole.log('calc0 '+phf);
    
    if ((pha[3]!=0)||(pha[5]!=0)||(o.vy!=0)||o.flying) o.physt=1000;
    
    if (o.physt>0) {
    o.physt-=dt;
    o.pht2+=dt;
    var phdt=Math.min(10,o.pht2);//10
    var cp=0;
    //var maxcnt=25;
    //if (cnt<maxcnt) log('-> '+cnt+' '+pha[0]+' '+pha[1]+' '+pha[2]);
    if (physTris.length>0)
    while (o.pht2>=phdt) {
      o.pht+=phdt;
      o.pht2-=phdt;
      //c++;
      
      //var pha0=pha[0];var pha1=pha[1];var pha2=pha[2];var pha3=pha[3];var pha4=pha[4];var pha5=pha[5];
      
      if (cp<5) physicsCalc(o,pha,o.pht,phdt);
      //if (isNaN(pha[0])) alert(pha0+' '+pha1+' '+pha2+' '+pha3+' '+pha4+' '+pha5+' ');
      cp++;
      //if (cp==2) break;
      //break;
    }
    //if (cnt<maxcnt) log('-> '+cnt+' '+pha[0]+' '+pha[1]+' '+pha[2]);
    //cnt++;
    //debug='c='+c+' o.pht2='+o.pht2;
    
    o.x=pha[0]/phf;//-dox;
    o.y=pha[1]/phf;
    o.z=pha[2]/phf;//-doz;
    o.vy=pha[4];
    o.vx=pha[3];
    o.vz=pha[5];
    return 1;
    //if (isNaN(o.x)) alert('o.x '+pha[0]+' '+phf);
    }
    
    //...
  }
  
  this.etPhf=function(v) {
    if (v) phf=v;
    return phf;
    //...
  }
  
  //
  this.triAdd=physTriAdd;
  this.calc=physicsCalc;
  this.tris=physTris;
  this.finishTris=finishTris;this.calc0=calc0;
  //...
}
//...
//fr o,2
//fr o,2,20
//fr o,2,23
//fr p,54,11
