//----
(function() {
  //---
  window.w3ditScriptInit(function (ps) {
    //---
    //let m=new THREE.Mesh(
    //   new THREE.BoxGeometry(0.1,0.1,0.1),
    //   new THREE.MeshPhongMaterial({flatShading:true,color:0xdddddd,transparent:true,opacity:0.9}));
    //ps.mesh.add(m);
    
    let xrUtil=ps.xrUtil,canv,ct,o,mesh,tex;
    
    
    function scriptPaint(co) {
      //---
      //onsole.log(co);
      if (!canv) {
        xrUtil.log('creating canvas');
        let img=mesh.material.map.image,w=img.width,h=img.height;
        //onsole.log('now create canvas with '+w+' '+h);
        let c=document.createElement('canvas');
        c.width=w;c.height=h;canv=c;
        ct=c.getContext('2d');
        ct.drawImage(img,0,0);
        //ct.fillStyle='#0f0';
        //ct.fillRect(0,0,w,h);
        tex=new THREE.Texture(c);tex.needsUpdate=true;
        mesh.material.map=tex;
      }
      ct.fillStyle='rgba(0,0,250,1)';
      let uv=co.uv,bw=10;
      ct.fillRect((uv.x*canv.width)-bw,((1-uv.y)*canv.height)-bw,bw*2,bw*2);
      tex.needsUpdate=true;
      //onsole.log(co.uv);
      //...
    }
    
    
    xrUtil.log('Script-Pd5 v.0.45 ');//FOLDORUPDATEVERSION
    //onsole.log(ps);
    if (1)
    Conet.download({fn:ps.ps.fn,ps:ps,base:ps.mesh,f:function(v) {
      //---
      //if (1) {
      //  console.log(this);
      //  console.log(v);
      //  return;
      //}
      o=Pd5.load(v);
      //if (1) {
      //  console.log(o);
      //  return;
      //}
      o.scale=1;
      Pd5.animStart(o,'stand2');
      threeEnv.base=this.base;
      threeAddObj(o,0,0,0,0.5);
      let ps=this.ps;
      if (ps.ay) o.ay=ps.ay;
      //o.calcVertNorms=1;
      ps.mesh.userData.o5=o;
      //onsole.log(p);
      
      mesh=o.meshes[0].tmesh;
      
      mesh.userData.scriptPaint=scriptPaint;
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
//fr o,1,1
//fr o,1,1,9
//fr p,4,19
