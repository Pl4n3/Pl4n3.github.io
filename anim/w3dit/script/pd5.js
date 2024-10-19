//----
(function() {
  //---
  let first=true,manims,selected;
  //---
  function onSelect() {
    //---
    selected=this;
    manims.s=this.o5.anim;
    manims.ms='Pd5 Anims';
    //...
  }
  //---
  window.w3ditScriptInit(function (ps) {
    //---
    //let m=new THREE.Mesh(
    //   new THREE.BoxGeometry(0.1,0.1,0.1),
    //   new THREE.MeshPhongMaterial({flatShading:true,color:0xdddddd,transparent:true,opacity:0.9}));
    //ps.mesh.add(m);
    
    let xrUtil=ps.xrUtil,
        //canv,ct,tex,
        o,mesh,ps0=ps.ps,sceneh=ps.sceneh,
        scriptHandlers=ps.scriptHandlers,mode='diff',
        modes={
          diff:{tex:'map'},
          norm:{tex:'normalMap'},
          spec:{tex:'specularMap'}
        };
    
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
      o.scale=1;
      if (ps0.anim) Pd5.animStart(o,ps0.anim);
      threeEnv.base=ps1.base;
      threeAddObj(o,0,0,0,ps0.sc||1);//0.5
      let ps=ps1.ps;
      if (ps.ay) o.ay=ps.ay;
      o.calcVertNorms=1;
      ps.mesh.userData.o5=o;
      //onsole.log(p);
      
      mesh=o.meshes[0].tmesh;
      
      mesh.userData.rayCol=rayCol;
      mesh.userData.editPoint=ps.mesh;
      ps.scriptHandlers.rayObjsReset();
      //Pd5.animStart(o,{a:[{s:'nay'},{s:'yay'}]});
      
      //...
    }
    
    if (first) {
      first=false;
      xrUtil.log('Script-Pd5 v.0.234 ');//FOLDORUPDATEVERSION
      xrUtil.hud.buttons.push(
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
        });
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
  );
  //...
}
)();
//----
//fr o,1
//fr o,1,3
//fr o,1,5
//fr o,1,5,16
//fr o,1,5,20
//fr o,1,5,28
//fr o,1,5,35
//fr o,1,5,47
//fr p,33,86
