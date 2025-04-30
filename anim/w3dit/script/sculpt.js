//----
function Sculpt(gps) {
  //----
  let blog,points=[],gridw=0.01;
  
  this.load=function(v,initLoad) {
    //---
    let d=((typeof(v)=='string')?JSON.parse(v):v),skips=0;
    points.length=2;
    grid={};
    //points=points.concat(d.points);
    
    if (d.dpoints) {
    let diff=Conet.createDiff({
    fmt:function(h) {
      //h=JSON.parse(JSON.stringify(h));
      h.position={x:h.px,y:h.py,z:h.pz};
      delete(h.px);
      delete(h.py);
      delete(h.pz);
      return h;
      //...
    }
    ,undiff:1
    });
    //let pointsh=[];
    for (let p of d.dpoints) {
      p=diff.convert(p);//Conet.diff(p);
      //pointsh.push(Conet.diff(p));
      let pos=p.position;
      let gx=Math.floor(pos.x/gridw+0.5);
      let gy=Math.floor(pos.y/gridw+0.5);
      let gz=Math.floor(pos.z/gridw+0.5);
      let gkey=gx+'_'+gy+'_'+gz;
      if (grid[gkey]) { skips++;continue; }
      pos.x=gx*gridw;
      pos.y=gy*gridw;
      pos.z=gz*gridw;
      grid[gkey]=p;
      points.push(p);
    }
    //console.log('undiff result');
    //console.log(pointsh);
    }
    else 
    for (let p of d.points) {
      let pos=p.position;
      let gx=Math.floor(pos.x/gridw+0.5);
      let gy=Math.floor(pos.y/gridw+0.5);
      let gz=Math.floor(pos.z/gridw+0.5);
      let gkey=gx+'_'+gy+'_'+gz;
      if (grid[gkey]) { skips++;continue; }
      pos.x=gx*gridw;
      pos.y=gy*gridw;
      pos.z=gz*gridw;
      grid[gkey]=p;
      points.push(p);
    }
    if (skips) Conet.log(skips+' grid-skipped.');
    //...
  }
  
  this.etPoints=function(pts) {
    if (pts) points=pts;
    return points;
    //...
  }
  
  this.updateBlob=function() {
    //---
    blob.reset();
    for (let i=0;i<points.length;i++) {
      const point=points[i];
      const position=point.position;
      blob.addBall(position.x,position.y,position.z,point.strength,point.subtract,point.color);
    }
    blob.update();
    //...
  }
  
  this.serialize=function() {
    //---
    let s='{';
    
    if (0) {
    s+='"points":[\n';
    for (let i=2;i<points.length;i++)
      s+=JSON.stringify(points[i])+((i<points.length-1)?',':'')+'\n';
    s+='],\n';
    }
    
    
    s+='"dpoints":[\n';
    let diff=Conet.createDiff({
    fmt:function(h) {
      h=JSON.parse(JSON.stringify(h));
      h.px=Conet.f4(h.position.x);
      h.py=Conet.f4(h.position.y);
      h.pz=Conet.f4(h.position.z);
      delete(h.position);
      return h;
      //...
    }
    });
    for (let i=2;i<points.length;i++)
      s+=JSON.stringify(diff.convert(points[i]))+((i<points.length-1)?',':'')+'\n';
    s+=']';
    
    
    s+='}\n';
    return s;
    //...
  }
  
  
  const material = new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    // envMap: reflectionCube,
    roughness: 0.9,
    metalness: 0.0,
    transparent: true,
    vertexColors: true
  });
  
  blob=new MarchingCubes(64,material,false,true,500000);
  this.blob=blob;
  this.points=points;
  //scene=gps.scene;if (scene) scene.add(blob);
  //...
}

(function() {
  //---
  let what='Sculpt v.0.205 ';//FOLDORUPDATEVERSION
  //let sculptUpdate;
  
  if (window.w3ditScriptInit)
  window.w3ditScriptInit({initf:function (ips) {
    //---
    //et sculpt=new Sculpt();
    let xrUtil=ips.xrUtil;
    //onsole.log(sculpt.blob);
    function init(v) {
      //---
      //onsole.log(v.length);
      //xrUtil.log('Sculpt loaded: '+this.fn);
      let sculpt=new Sculpt(),needUpdate=false,ui=undefined,
          lastSelectedPoint;
          //points=[];//---editxr points with ref to sculpt points
      
      function onchange(p) {
        //---
        //onsole.log('update sculpt nao');
        //console.log(this);
        //let p=this.op,
        let sp=this.sculptp.position;
        //onsole.log('von '+sp.x+' '+sp.y+' '+sp.z);
        sp.x=(p.x-pp.x-ofs.x)/2;
        sp.y=(p.y-pp.y-ofs.y)/2;
        sp.z=(p.z-pp.z-ofs.z)/2;
        //onsole.log('zu  '+sp.x+' '+sp.y+' '+sp.z);
        //pts.length=100;
        needUpdate=true;//sculptUpdate=sculpt;//sculpt.updateBlob();
        //sculpt.blob.castShadow=true;
        //sculpt.blob.receiveShadow=true;
        
        //...
      }
      
      Conet.handlerAdd('render',function() {
        //---
        //if (sculptUpdate) { sculptUpdate.updateBlob();sculptUpdate=undefined; }
        if (!needUpdate) return;
        needUpdate=false;
        sculpt.updateBlob();
        //...
      }
      );
      
      Conet.handlerAdd('pointPropsChanged',function(p,pn) {
        //---
        if (!pn) {
          console.log('pointPropsChanged remove');
          let sp=p.userData.sculptp;
          let a=sculpt.etPoints(),i=a.indexOf(sp);
          a.splice(i,1);
          console.log('i='+i);
          needUpdate=true;
          //throw('nyi');
          return;
        }
        
        
        let op=pn.userData.op,newParams=op.sculpt;
        console.log('pointPropsChanged '+(newParams?1:0));
        if (!newParams) return;
        
        let sp;
        if (p) sp=p.userData.sculptp;
        else { //---create new sculptp
          //hrow('n/i');
          sp={position:{}}
          sculpt.etPoints().push(sp);
        }
        
        pn.userData.sculptp=sp;
        let spp=sp.position;
        //sp.color=newParams.color;
        Conet.hcopy(newParams,sp,undefined,{position:1});
        
        spp.x=(op.x-pp.x-ofs.x)/2;
        spp.y=(op.y-pp.y-ofs.y)/2;
        spp.z=(op.z-pp.z-ofs.z)/2;
        
        needUpdate=true;
        pn.userData.onchange=onchange;
        //onsole.log('pointPropsChanged');
        //onsole.log(p);
        //onsole.log(pn);
        //...
      }
      );
      
      xrUtil.hudRemove=function(ps) {
        //---
        let ba=xrUtil.hud.buttons,a=[];
        for (let i=ba.length-1;i>=0;i--) {
          //onsole.log(i);
          let b=ba[i];
          let aleft=b.x ,aright=b.x+b.w  ,atop=b.y ,abottom=b.y+b.h,
              bleft=ps.x,bright=ps.x+ps.w,btop=ps.y,bbottom=ps.y+ps.h;
          //if (RectA.Left < RectB.Right && RectA.Right > RectB.Left &&
          //   RectA.Top > RectB.Bottom && RectA.Bottom < RectB.Top ) 
          //if ((b.x<=(ps.x+ps.w))&&((b.x+b.w)>=ps.x)&&(b.y<=(ps.y+ps.h))&&((b.y+b.h)>=ps.y)) {
          if ((aleft<=bright)&&(aright>=bleft)&&(atop<=bbottom)&&(abottom>=btop)) {
            a.push(b);
            ba.splice(i,1);
          }
        }
        return a;
        //...
      }
      
      
      Conet.handlerAdd('select',function(p) {
        //---
        //onsole.log('select '+p);
        //onsole.log(p);
        lastSelectedPoint=p;
        let sp=p?p.userData.op.sculpt:undefined;
        let ba=xrUtil.hud.buttons;
        if (sp) {
          //---show ui
          if (!ui) {
            ui={};
            ui.prev=xrUtil.hudRemove({x:0.04,y:0.54,w:0.54,h:0.27});
            //onsole.log(a);
            ui.curr=[
               //{x:0.04,y:0.54,w:0.54,h:0.27,s:' '},
               {x:0.05,y:0.55,w:0.23,h:0.08,s:'Strength',noinp:1,align:'left'}
              ,ui.mstrength={dx:0.05,s:'...',align:'left',
        oninput:function(v) {
          //---
          //onsole.log(v);
          //console.log(sp);
          lastSelectedPoint.userData.op.sculpt.strength=parseFloat(v);
          needUpdate=true;
          //console.log(p.userData.sculptp);
          //...
        }
              }
        
              ,{x:0.05,y:0.64,w:0.23,h:0.08,s:'Subtract',noinp:1,align:'left'}
              ,ui.msubtract={dx:0.05,s:'...',align:'left',
        oninput:function(v) {
          //---
          //onsole.log(v);
          lastSelectedPoint.userData.op.sculpt.subtract=parseFloat(v);
          needUpdate=true;
          //...
        }
              }
        
              ,{x:0.05,y:0.73,w:0.23,h:0.08,s:'Color',noinp:1,align:'left'}
              ,ui.mcolor={dx:0.05,s:'...',align:'left',
        oninput:function(v) {
          //---
          lastSelectedPoint.userData.op.sculpt.color=parseInt(v,16);
          needUpdate=true;
          //onsole.log(v);
          //...
        }
              }
        
        
        
            ];
            ba.push.apply(ba,ui.curr);//same: ba.push(...ui.curr);
            //rUtil.log('show sculpt ui');
          }
          ui.mstrength.s=''+sp.strength;
          ui.msubtract.s=''+sp.subtract;
          ui.mcolor.s=sp.color.toString(16);
          xrUtil.setNeedDrawUi();
        } else {
          //---hide ui
          if (ui) {
            xrUtil.tryHideKeyboard();
            for (let b of ui.curr) {
              let i=ba.indexOf(b);
              ba.splice(i,1);
            }
            for (let b of ui.prev) {
              ba.splice(ba.length,0,b);
            }
            ui=undefined;
            //rUtil.log('hide sculpt ui');
          }
        }
        //...
      }
      );
      
      sculpt.etPoints([
        {position:new THREE.Vector3(),strength:0.04,subtract:10,color:new THREE.Color(0.5,0.5,0.5)},
        {position:new THREE.Vector3(),strength:-0.08,subtract:10,color:new THREE.Color(0.2,0.7,0.2)}//new THREE.Color(bgcolors[3].color)}
      ]);
      sculpt.load(v);
      sculpt.updateBlob();
      sculpt.blob.castShadow=true;
      sculpt.blob.receiveShadow=true;
      ips.mesh.add(sculpt.blob);
      let ed=ips.editxr,pp=ips.mesh.position,f=2,ofs={x:-1,y:-1,z:-1};
      //onsole.log(pp);
      let pts=sculpt.etPoints();
      for (let p of pts) {
        //onsole.log(p);
        let pos=p.position;
        let pm=ed.pointAdd({
          x:2*pos.x+pp.x+ofs.x,
          y:2*pos.y+pp.y+ofs.y,
          z:2*pos.z+pp.z+ofs.z,
          noSerialize:1
          ,sculpt:p
          //,inv:1
          });
        pm.userData.editPoint=-1;
        pm.userData.onchange=onchange;
        pm.userData.sculptp=p;
        //points.push(pm);
      }
      ed.rayObjsReset();
      
      ips.mesh.userData.onserialize=function() {
        //---
        let d=sculpt.serialize();
        //for (let p of points) {}
        if (0) {
          let fn=ips.mesh.userData.op.fn;
          ips.xrUtil.log('Saving sculpt '+fn+' '+d.length);//+modes.diff.canv+' '+modes.norm.canv+' '+modes.spec.canv);
          Conet.upload({fn:fn,data:d});
        } else {
          ips.mesh.userData.op.data=JSON.parse(d);
          delete(ips.mesh.userData.op.fn);
        }
        //...
      }
      //...
    }
    //---
    let op=ips.mesh.userData.op;
    if (op.fn)
    Conet.download({fn:op.fn,f:function(v) {
      //---
      //onsole.log(v.length);
      xrUtil.log('Sculpt loaded: '+this.fn);
      init(v);
      //...
    }
    });
    else {
      xrUtil.log('Sculpt via embedded data.');
      init(op.data);
    }
    //...
  }
  ,_renderf:function(dt) {
    //---
    //if (sculptUpdate) { sculptUpdate.updateBlob();sculptUpdate=undefined; }
    //...
  }
  ,what:what
  });
  else console.log(what);
  
  
  //...
}
)();
//----
//fr o,1
//fr o,1,3
//fr o,1,3,8
//fr o,1,9
//fr o,3
//fr o,3,5
//fr o,3,6
//fr p,34,127
