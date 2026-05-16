//----
(function() {
  //---
  let flight,
      what='w3dit.Flight v.0.69 ';//FOLDORUPDATEVERSION
  //onsole.log('dungeonGeometry.js');
  //onsole.log(document.currentScript);
  window.w3ditScriptInit({initf:function (ps) {
    //---
    //threeEnv.camera=ps.xrUtil.gps.camera;
    let xrUtil=ps.xrUtil;
    threeEnv.camera=xrUtil.gps.camera;
    let script=document.createElement('script');
    script.onerror=function() {
      //---
      console.log('Script error, fn='+script.src);
      //...
    }
    script.onload=function() {
      //---
      let sc=0.001;
      ps.mesh.scale.set(sc,sc,sc);
      //onsole.log(ps.mesh.scale);
      let url=Conet.parseUrl();
      flight=flightInit({room:ps.mesh,level:url.flightLevel||'fogOfWar',noGamesMenu:1});
      
      let wasPress=false;//count=0,
      
      function xrRay(co,press) {
        //---
        //onsole.log('xrRay 0');
        if (press&&wasPress) return;
        wasPress=press;
        if (!press) return;
        
        //xrUtil.log('xrRay '+count);count++;
        flight.clickGrid(co.object.userData.g);
        //...
      }
      
      flight.marksChanged=function(marks) {
        //---
        //onsole.log('marksChanged '+marks.length);
        let a=xrUtil.rayObjs;
        a.length=0;
        a.push(xrUtil.hudMesh);
        for (let m of marks) {
          m.userData.xrRay=xrRay;
          a.push(m);
        }
        //xrUtil.rayObjs=marks;
        //...
      }
      
      if (1&&(url.file=='file:flight')) {//todo: only via (url) param hide file menu..
      xrUtil.hud.buttons=[
      {s:'Move',x:0.05,y:0.5,w:0.4,h:0.1,ondown:flight.mMove},
      {s:'Attack',dy:0.02,ondown:flight.mAttack},
      {s:'Next Unit',dy:0.02,ondown:flight.mNextUnit},
      {s:'View All',dy:0.02,ondown:flight.mViewAll}
      ];
      xrUtil.setNeedDrawUi();
      }
      //...
    }
    script.src='/three/deep/flight.js';
    document.head.appendChild(script);
    //...
  }
  ,renderf:function(dt) {
    //---
    if (flight) flight.flightRender(dt);
    threeRender(dt);
    //...
  }
  ,what:what});
  //...
}
)();
//----
//fr o,1
//fr o,1,5
//fr o,1,5,5
//fr o,1,5,6
//fr o,1,5,6,9
//fr o,1,5,6,11
//fr o,1,6
//fr p,5,54
