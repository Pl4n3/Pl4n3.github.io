//---
(function () {
  //...
  var view=planim.addView({w:1,h:1,x:0,y:0,
    //cam_:new THREE.Vector3(0,-0.10,2.50),
    cam:new THREE.Vector3(-2,1,1),
    bg:1,autoRotate:0,
    target:new THREE.Vector3(0,-0.6,0.0),fov:60,bgcol:0x666666,_vr:1}),stickRoot,stickPath=[],
    camt=-1,ct0=new THREE.Vector3(),ct1=new THREE.Vector3(),cp0=new THREE.Vector3(),cp1=new THREE.Vector3(),cpath,
    beepDown={"time":361.42857142857144,"freqAtTime":[[264,4.642857142857143],[628,19.642857142857142],[480,33.57142857142857],[716,44.285714285714285],[404,63.214285714285715],[228,102.5],[232,136.07142857142858],[328,157.14285714285714],[128,189.64285714285714],[128,236.78571428571428],[36,275],[112,313.92857142857144],[56,355.7142857142857]],"gainAtTime":[[0,5.357142857142857],[0.9383,24.642857142857142],[0.9099,338.2142857142857],[0,361.42857142857144]]},
    beepUp={vol:0.2,"time":492,"freqAtTime":[[940,10.5],[1040,43.5],[420,63],[1160,90],[400,112.5],[1280,133.5],[2120,472.5]],"gainAtTime":[[0,7.5],[0.8986,34.5],[0.8847,457.5],[0,492]]};
  
  
  //planim.game.rays=1;
  //planim.game.fetchOnKey=1;
  function select(o) {
    this.material=o?planim.m1:planim.m0;
    //console.log('bases.select o='+o);
    //console.log(this);
  }
  
  
  planim.box(0,-1.9,0,6,0.2,6).castShadow=false;
  //planim.box(0,0,0,0.2,0.2,0.2);
  planim.box(0,-0.05,-1,0.2,0.2,0.2).select=select;
  planim.box(0.1,0.05,-0.9,0.2,0.2,0.2).select=select;
  planim.defaultLights();
  //planim.loadObjsThenLoop([{fn:'../shooter/objs/templar/o5.txt',pos:new THREE.Vector3(0,-1.8,-1.00),anim:'stand2',scale:0.004,ohkey:'m',roty:0},]);
  
  
  function plant() {
    //---
    
    function randPos(f) {
      return new THREE.Vector3(0*f*Conet.rand(),0*f*Conet.rand(),f*Conet.rand());
      //...
    }
    
    var ge=new THREE.Geometry();
    var cg=new THREE.Color(0.2,0.8,0.1),cb=new THREE.Color(0.6,0.5,0);
    
    Conet.seed(10);
    
    
    
    function leaf(ps) {
      //---
      
      //     0
      //
      // 1   2   3
      //       Z
      // 4   5   6
      //
      //   7 8 9
      //
      //   10 11 12
      
      var sw=0.2, //stick width
        vs=[
        //0
        [new THREE.Vector3(0,1,0)  ,new THREE.Vector3(0,1,0)],
        //1  
        [new THREE.Vector3(1,0,0)  ,new THREE.Vector3(1,0,0)],
        [new THREE.Vector3(0,0,0.1),new THREE.Vector3(0,0,-0.1)],
        [new THREE.Vector3(-1,0,0) ,new THREE.Vector3(-1,0,0)],
        //4
        [new THREE.Vector3(1,-1,0)  ,new THREE.Vector3(1,-1,0)],
        [new THREE.Vector3(0,-1,0.1),new THREE.Vector3(0,-1,-0.1)],
        [new THREE.Vector3(-1,-1,0)  ,new THREE.Vector3(-1,-1,0)],
        //7
        [new THREE.Vector3(sw,-2,0)],//  ,new THREE.Vector3(0.1,-2,0)],
        [new THREE.Vector3(0,-2,sw),new THREE.Vector3(0,-2,-sw)],
        [new THREE.Vector3(-sw,-2,0)],//  ,new THREE.Vector3(-0.1,-2,0)],
        //10
        [new THREE.Vector3(sw,-3,0)],
        [new THREE.Vector3(0,-3,sw),new THREE.Vector3(0,-3,-sw)],
        [new THREE.Vector3(-sw,-3,0)],
      
      ];
      
      
      var f=0.5,
      rp=randPos(f);vs[0][0].add(rp);vs[0][1].add(rp);
      rp=randPos(f);vs[1][0].add(rp);vs[1][1].add(rp);
      rp=randPos(f);vs[2][0].add(rp);vs[2][1].add(rp);
      rp=randPos(f);vs[3][0].add(rp);vs[3][1].add(rp);
      
      rp=randPos(f);vs[4][0].add(rp);vs[4][1].add(rp);
      rp=randPos(f);vs[5][0].add(rp);vs[5][1].add(rp);
      rp=randPos(f);vs[6][0].add(rp);vs[6][1].add(rp);
      
      rp=randPos(f);vs[7][0].add(rp);vs[8][0].add(rp);vs[8][1].add(rp);vs[9][0].add(rp);
      
      //var v=[
      //  new THREE.Vector3(0,1,0),new THREE.Vector3(0,1,0),
      //  new THREE.Vector3(1,0,0),new THREE.Vector3(1,0,0),
      //  new THREE.Vector3(0,0,0.1),new THREE.Vector3(0,0,-0.1),
      //  new THREE.Vector3(-1,0,0),new THREE.Vector3(-1,0,0),
      //];
      
      var f=0.07;
      for (var va of vs) for (var vh of va) {
        vh.y+=3;
        if (ps.m) vh.applyMatrix4(ps.m);
      
        //vh.x+=ps.pos.x;
        //vh.y+=ps.pos.y;
        //vh.z+=ps.pos.z;
        //vh.x*=f;vh.y*=f;vh.z*=f;
      } 
      
      var svs=ps.s.vs;
      vs[10][0]=svs[1][0];
      vs[11][0]=svs[2][0];
      vs[11][1]=svs[2][1];
      vs[12][0]=svs[3][0];
      
      vs[10][0].col=cb;
      vs[11][0].col=cb;
      vs[11][1].col=cb;
      vs[12][0].col=cb;
      
      
      threeEnv.addTri({ge:ge,v0:vs[2][0],v1:vs[1][0],v2:vs[0][0],c:cg});
      threeEnv.addTri({ge:ge,v0:vs[3][0],v1:vs[2][0],v2:vs[0][0],c:cg});
      threeEnv.addTri({ge:ge,v0:vs[2][1],v1:vs[0][1],v2:vs[1][1],c:cg});
      threeEnv.addTri({ge:ge,v0:vs[3][1],v1:vs[0][1],v2:vs[2][1],c:cg});
      
      threeEnv.addQuad({ge:ge,v0:vs[4][0],v1:vs[1][0],v2:vs[5][0],v3:vs[2][0],c:cg});
      threeEnv.addQuad({ge:ge,v0:vs[2][0],v1:vs[3][0],v2:vs[5][0],v3:vs[6][0],c:cg}); //--> Z
      threeEnv.addQuad({ge:ge,v0:vs[2][1],v1:vs[1][1],v2:vs[5][1],v3:vs[4][1],c:cg});
      threeEnv.addQuad({ge:ge,v0:vs[6][1],v1:vs[3][1],v2:vs[5][1],v3:vs[2][1],c:cg});
      
      threeEnv.addQuad({ge:ge,v0:vs[7][0],v1:vs[4][0],v2:vs[8][0],v3:vs[5][0],c:cg});
      threeEnv.addQuad({ge:ge,v0:vs[5][0],v1:vs[6][0],v2:vs[8][0],v3:vs[9][0],c:cg});
      threeEnv.addQuad({ge:ge,v0:vs[5][1],v1:vs[4][1],v2:vs[8][1],v3:vs[7][0],c:cg});
      threeEnv.addQuad({ge:ge,v0:vs[9][0],v1:vs[6][1],v2:vs[8][1],v3:vs[5][1],c:cg});
      
      threeEnv.addQuad({ge:ge,v0:vs[10][0],v1:vs[7][0],v2:vs[11][0],v3:vs[8][0],c:cg});
      threeEnv.addQuad({ge:ge,v0:vs[8][0],v1:vs[9][0],v2:vs[11][0],v3:vs[12][0],c:cg});
      threeEnv.addQuad({ge:ge,v0:vs[8][1],v1:vs[7][0],v2:vs[11][1],v3:vs[10][0],c:cg});
      threeEnv.addQuad({ge:ge,v0:vs[12][0],v1:vs[9][0],v2:vs[11][1],v3:vs[8][1],c:cg});
      
      
      //threeEnv.addTri({ge:ge,v0:vs[5][0],v1:vs[4][0],v2:vs[1][0],c:cg});
      //threeEnv.addTri({ge:ge,v0:vs[5][0],v1:vs[1][0],v2:vs[2][0],c:cg});
      
      
      
      //v0.flat=1;v1.flat=1;v2.flat=1;v3.flat=1;
      //threeEnv.addTri({ge:ge,v0:v2,v1:v1,v2:v0,c:cg});//threeEnv.addTri({ge:ge,a0:p2,a1:p1,a2:p0,c:cg});
      //threeEnv.addTri({ge:ge,v0:v3,v1:v2,v2:v0,c:cg});//threeEnv.addTri({ge:ge,a0:p3,a1:p2,a2:p0,c:cg});
      //threeEnv.addTri({ge:ge,v0:w2,v1:w0,v2:w1,c:cg});//threeEnv.addTri({ge:ge,a0:P2,a1:p0,a2:p1,c:cg});
      //threeEnv.addTri({ge:ge,v0:w3,v1:w0,v2:w2,c:cg});//threeEnv.addTri({ge:ge,a0:p3,a1:p0,a2:P2,c:cg});
      //onsole.log(ge.vertices.length);
      
      
      
      //...
    }
    
    function stickOld(ps) {
      //---
      //   6
      //
      // 0 1 2
      //
      // 3 4 5
      var sw=0.2, //stick width
        vs=[
        //0 -- 7 
        [new THREE.Vector3(sw,1,0)],//  ,new THREE.Vector3(0.1,-2,0)],
        [new THREE.Vector3(0,1,sw),new THREE.Vector3(0,1,-sw)],
        [new THREE.Vector3(-sw,1,0)],//  ,new THREE.Vector3(-0.1,-2,0)],
      ];
      var s0vs=ps.s0?.vs;
      //if (s0vs) vs.push(s0vs[0],s0vs[1],s0vs[6]);else 
      vs.push(
        //3 -- 10
        [new THREE.Vector3(sw,0,0)],
        [new THREE.Vector3(0,0,sw),new THREE.Vector3(0,0,-sw)],
        [new THREE.Vector3(-sw,0,0)],
      );
      vs.push(
        [new THREE.Vector3(0,1+sw,0)]
      );
      ps.vs=vs;
      
      for (var va of vs) for (var vh of va) {
        //vh.y+=3;
        if (ps.m) vh.applyMatrix4(ps.m);
      } 
      
      threeEnv.addQuad({ge:ge,v0:vs[3][0],v1:vs[0][0],v2:vs[4][0],v3:vs[1][0],c:cb});
      threeEnv.addQuad({ge:ge,v0:vs[1][0],v1:vs[2][0],v2:vs[4][0],v3:vs[5][0],c:cb});
      threeEnv.addQuad({ge:ge,v0:vs[1][1],v1:vs[0][0],v2:vs[4][1],v3:vs[3][0],c:cb});
      threeEnv.addQuad({ge:ge,v0:vs[5][0],v1:vs[2][0],v2:vs[4][1],v3:vs[1][1],c:cb});
      
      return ps;
      //...
    }
    
    function stick(ps) {
      //---
      //   0
      //
      // 1 2 3
      //
      // 4 5 6
      var sw=0.2, //stick width
        vs=[
        [new THREE.Vector3(0,1+sw,0)],
        //0 -- 7 
        [new THREE.Vector3(sw,1,0)],//  ,new THREE.Vector3(0.1,-2,0)],
        [new THREE.Vector3(0,1,sw),new THREE.Vector3(0,1,-sw)],
        [new THREE.Vector3(-sw,1,0)],//  ,new THREE.Vector3(-0.1,-2,0)],
      ];
      //if (s0vs) vs.push(s0vs[0],s0vs[1],s0vs[6]);else 
      vs.push(
        //3 -- 10
        [new THREE.Vector3(sw,0,0)],
        [new THREE.Vector3(0,0,sw),new THREE.Vector3(0,0,-sw)],
        [new THREE.Vector3(-sw,0,0)],
      );
      //vs.push(
      //  [new THREE.Vector3(0,1+sw,0)]
      //);
      ps.vs=vs;
      
      for (var va of vs) for (var vh of va) {
        //vh.y+=3;
        if (ps.m) vh.applyMatrix4(ps.m);
      } 
      
      var s0vs=ps.s0?.vs;
      if (s0vs) {
        vs[4][0]=s0vs[1][0];//vs[5]=s0vs[2];vs[6]=s0vs[0];
        vs[5][0]=s0vs[2][0];
        vs[5][1]=s0vs[0][0];
        vs[6][0]=s0vs[3][0];
      }
      
      var s1vs=ps.s1?.vs;
      if (s1vs) {
        vs[4][0]=s1vs[1][0];
        vs[5][0]=s1vs[0][0];
        vs[5][1]=s1vs[2][1];
        vs[6][0]=s1vs[3][0];
      }
      
      
      threeEnv.addQuad({ge:ge,v0:vs[4][0],v1:vs[1][0],v2:vs[5][0],v3:vs[2][0],c:cb});
      threeEnv.addQuad({ge:ge,v0:vs[2][0],v1:vs[3][0],v2:vs[5][0],v3:vs[6][0],c:cb});
      threeEnv.addQuad({ge:ge,v0:vs[2][1],v1:vs[1][0],v2:vs[5][1],v3:vs[4][0],c:cb});
      threeEnv.addQuad({ge:ge,v0:vs[6][0],v1:vs[3][0],v2:vs[5][1],v3:vs[2][1],c:cb});
      
      return ps;
      //...
    }
    
    
    var m=new THREE.Matrix4(),m0=new THREE.Matrix4();
    
    if (0) //spiral
    (function() {
      //---
      
      var sc=0.07;
      
      //m.makeRotationX(0.5);m0.makeTranslation(0,0,0);m.premultiply(m0);  m0.makeScale(sc,sc,sc);m.premultiply(m0);stick({m:m});
      //m.makeRotationX(-0.5);m0.makeTranslation(2.5,0,0);m.premultiply(m0);m0.makeScale(sc,sc,sc);m.premultiply(m0);leaf({m:m});
      //m.makeRotationX(0.5);m0.makeTranslation(0,0,2);m.premultiply(m0);  m0.makeScale(sc,sc,sc);m.premultiply(m0);leaf({m:m});
      //m.makeRotationX(0.5);m0.makeTranslation(2.5,0,2);m.premultiply(m0);m0.makeScale(sc,sc,sc);m.premultiply(m0);leaf({m:m});
      
      //m.makeRotationX(0.5);
      //m0.makeTranslation(0,0,0);m.premultiply(m0);
      //m0.makeScale(sc,sc,sc);
      //m.premultiply(m0);
      
      m.makeTranslation(0,0,0);
      m0.makeScale(sc,sc,sc);m.multiply(m0);
      //m0.makeRotationX(0.5);m.multiply(m0);
      stick({m:m});
      
      for (var i=0;i<125;i++) {
      
      sc=0.95;
      m0.makeTranslation(0,1.1,0);m.multiply(m0);
      m0.makeScale(sc,sc,sc);m.multiply(m0);
      m0.makeRotationX(0.3);m.multiply(m0);
      m0.makeRotationY(0.1);m.multiply(m0);
      stick({m:m});
      
      }
      
      
      //...
    }
    )();
    else if (1)
    (function() {
      //---
      var sc=0.4,stick0;
      
      m.makeTranslation(0,-1.8,0);//y -1.3
      m0.makeScale(sc,sc,sc);m.multiply(m0);
      stick0=stick({m:m,d:0});stickRoot=stick0;
      sc=0.8;
      
      var sticks=[stick0];
      
      //for (var i=0;i<
      //15000
      //;i++) 
      var leafc=0,s0,s1;
      while (1) {
        if (sticks.length==0) break;
        stick0=sticks[0];sticks.splice(0,1);
        
        if (stick0.d==13//2//13
          ) {//13 best 14 small detail and slow generation
          if (Conet.rand()<0.5) {
            m=stick0.m.clone();
            m0.makeTranslation(0,0.5,0);m.multiply(m0);
            leaf({m:m,s:stick0});leafc++;
          } else {
            var vs=stick0.vs;
            threeEnv.addQuad({ge:ge,v0:vs[1][0],v1:vs[0][0],v2:vs[2][0],v3:vs[3][0],c:cb});
            threeEnv.addQuad({ge:ge,v0:vs[3][0],v1:vs[0][0],v2:vs[2][1],v3:vs[1][0],c:cb});
          }
          continue;
        }
      
        var ad=Conet.rand()*1+0.5;
        var a0=Conet.rand()*ad*1.1,a1=a0-ad;
      
        m=stick0.m.clone();
        m0.makeTranslation(0,1.1,0);m.multiply(m0);
        m0.makeScale(sc,sc,sc);m.multiply(m0);
        m0.makeRotationX(a0);m.multiply(m0);
        m0.makeRotationY(Conet.rand());m.multiply(m0);
        sticks.push(s0=stick({m:m,s0:stick0,d:stick0.d+1}));
      
        m=stick0.m.clone();
        m0.makeTranslation(0,1.1,0);m.multiply(m0);
        m0.makeScale(sc,sc,sc);m.multiply(m0);
        m0.makeRotationX(a1);m.multiply(m0);
        m0.makeRotationY(Conet.rand());m.multiply(m0);
        sticks.push(s1=stick({m:m,s1:stick0,d:stick0.d+1}));
        stick0.up=[s0,s1];
      }
      
      //onsole.log(leafc);
      
      //m=stick0.m.clone();
      //m0.makeTranslation(0,1.1,0);m.multiply(m0);
      //m0.makeScale(sc,sc,sc);m.multiply(m0);
      //m0.makeRotationX(0.5);m.multiply(m0);
      //stick({m:m});
      
      //m=stick0.m.clone();
      //m0.makeTranslation(0,1.1,0);m.multiply(m0);
      //m0.makeScale(sc,sc,sc);m.multiply(m0);
      //m0.makeRotationX(-0.5);m.multiply(m0);
      //stick({m:m});
      
      
      //...
    }
    )();
    
    ge.computeVertexNormals();
    var bge=new THREE.BufferGeometry().fromGeometry(ge);
    var m=new THREE.Mesh(
      bge,//ge
      new THREE.MeshPhongMaterial({vertexColors:THREE.FaceColors})//,flatShading:true})
      //new THREE.MeshStandardMaterial({vertexColors:THREE.FaceColors})//,flatShading:true})
      );
    m.position.set(0,0,0);//-0.5,-1);//m.castShadow=true;
    m.castShadow=true;
    m.receiveShadow=true;
    planim.base.add(m);//onsole.log(ge);
    
    //...
  }
  
  function stickView() {
    //---
    var ct=view.controls.target,cp=view.camera.position;
    
    cp0.copy(cp);ct0.copy(ct);
    
    
    if (stickPath.length==0) {
      //view.controls.target.set(0,-0.6,0);
      //view.camera.position.set(-2,1,1);
      cp1.set(-2,1,1);ct1.set(0,-0.6,0);
      cpath.innerHTML='';
    } else {
      var s=stickPath[stickPath.length-1],v=s.vs[0][0];
    
      //console.log(view.controls.target);
      //console.log(view.camera.position);
      //cp0.copy(cp);ct0.copy(ct);
    
      ct1.set(v.x,v.y,v.z);
      
      cp1.subVectors(cp,ct);
      cp1.normalize();
      cp1.multiplyScalar(Math.pow(0.8,stickPath.length));
      cp1.add(ct1);
      
      //cp1.set(v.x-Math.pow(0.8,stickPath.length),v.y,v.z);
      //camt=0;
    
      //console.log(v);
      //view.controls.target.set(v.x,v.y,v.z);
      //view.camera.position.set(v.x-Math.pow(0.8,stickPath.length),v.y,v.z);
      var s='';
      for (var i=1;i<stickPath.length;i++) {
        var s0=stickPath[i-1],s1=stickPath[i];
        s+=' '+((s1==s0.up[0])?0:1);
      }
      cpath.innerHTML='Branch path '+s;
    }
    camt=0;
    //...
  }
  
  planim.game.calc=function(dt) {
    //---
    //console.log(dt);
    if (camt==-1) return;
    var mt=300;
    camt+=dt;if (camt>mt) camt=mt;
    
    var f1=camt/mt,f0=1-f1;
    
    view.controls.target.set(ct0.x*f0+ct1.x*f1,ct0.y*f0+ct1.y*f1,ct0.z*f0+ct1.z*f1);
    view.camera.position.set(cp0.x*f0+cp1.x*f1,cp0.y*f0+cp1.y*f1,cp0.z*f0+cp1.z*f1);
    
    
    if (camt==mt) camt=-1;
    
    //...
  }
  
  
  Menu.init([{s:'Menu',ms:(vs='Tree Version 0.128 '),sub:[//FOLDORUPDATEVERSION
  planim.mfullscreen]}
  ,{s:'LeftUp',ydown:true,xright:true,px:0.13,pw:0.13,ph:0.08,py:0.1,actionf:function() {
    //---
    if (stickPath.length==0) 
      stickPath.push(stickRoot);
    else {
      var st=stickPath[stickPath.length-1];
      if (st.up) stickPath.push(st.up[0]);
    }
    
    stickView();
    Conet.beep(beepUp);
    //...
  }
  }
  ,{s:'RightUp',ydown:true,xright:true,px:0,pw:0.13,ph:0.08,py:0.1,actionf:function() {
    //---
    //view.controls.target.x--;
    //view.camera.position.x--;
    if (stickPath.length==0) 
      stickPath.push(stickRoot);
    else {
      var st=stickPath[stickPath.length-1];
      if (st.up) stickPath.push(st.up[1]);
    }
    //onsole.log(stickPath);
    
    stickView();
    Conet.beep(beepUp);
    //...
  }
  }
  ,{s:'Down',ydown:true,xright:true,px:0.065,pw:0.13,ph:0.08,py:0.02,actionf:function() {
    //-
    //console.log(view.camera.position);
    //view.controls.target.x++;
    //view.camera.position.x++;
    if (stickPath.length>0) 
      stickPath.length=stickPath.length-1;
    
    stickView();
    Conet.beep(beepDown);
    //...
  }
  }
  ],{listen:1,nobeep:1});
  
  //---
  var c=document.createElement('div'),st=c.style;cpath=c;
  st.position='absolute';st.backgroundColor='rgba(0,0,0,0.5)';st.color='#fff';
  //st.top='2px';st.left='82px';
  st.top='52px';st.left='4px';
  c.innerHTML='';
  document.body.appendChild(c);
  //---
  
  plant();
  
  
}
)();
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,24
//fr o,1,24,24
//fr p,30,32
