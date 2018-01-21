//---
function initAnimScript() {
  var deep,gridw=0.65,marks=[],selo,lastCamDist,
      path=undefined,pathi,patht,patha0,patha1=undefined,
      matsel=new THREE.MeshPhongMaterial({color:0xdddd00,flatShading:true,
        transparent:true,opacity:0.5}),
      matattack=new THREE.MeshPhongMaterial({color:0xee3333,flatShading:true,
        transparent:true,opacity:0.5}),selg,selt=0,attackMarks=false,
      matwview=new THREE.MeshPhongMaterial({color:0x888888,flatShading:true,
        transparent:true,opacity:0.5}),
      attackRoty,attackt=0,attacko,parties=[
      {bbcol:[150,100,0],col:'#f90'},
      {bbcol:[0,100,200],col:'#0cf',ai_:1}],
      party=0,mturn,os=[],startt,dum0,dum1;
  //...
  function clickMark() {
    if (path) return;
    
    //mesh.material=m0;
    //return;
    
    //onsole.log('clickMark');
    var userData=this,g=userData.g;
    
    g.mesh.material=matsel;selg=g;selt=0;
    
    //console.log(userData.g);
    if (g.mark) {
      var o=selo;
      attackRoty=-Math.atan2(g.z+0.5-o.z-o.zw/2,g.x+0.5-o.x-o.xw/2)+Math.PI/2;
      if (g.os&&g.os.length>0) attacko=g.os[0];
      return;
    }
    //onsole.log(mesh);
    path=deep.pathStart(g,selo);
    pathi=0;patht=0;
    //onsole.log(path);
    updateMarks();
    var o=selo;
    Pd5.animStart(o.o,o.o.animh[o.animRun]);
    //m1.color.set(0xff0000);
    //g.mesh.material=matsel;selg=g;selt=0;
    //onsole.log('path.len='+path.length);
  }
  function addMark(ps) {
    var w=gridw,wh=w-0.05,yf=0.25,g=ps.g;
    var mesh=new THREE.Mesh(new THREE.BoxBufferGeometry(wh,wh*yf,wh),ps.m||m1);var b=mesh;
    mesh.position.set((g.x+0.5)*w,g.y*w-1.8+w/2*yf,(g.z+0.5)*w);
    mesh.updateMatrix();
    mesh.matrixAutoUpdate=false;
    if (selo.vis||(ps.m==matattack)) base.add(mesh);
    marks.push(mesh);
    mesh.userData.g=g;
    mesh.userData.onclick=clickMark;
    g.mesh=mesh;
    //...
  }
  function updateMarks() {
    for (var i=marks.length-1;i>=0;i--) base.remove(marks[i]);
    marks=[];
    
    var rH=deep.rH,c=0;
    for (var k in rH) {
      var g=rH[k],gh=g;
      if (g.len==0) continue;
      if (g.gpos) gh=g.gpos;
      if (gh.len) {
        //if (selo.vis) {
          c++;
          //onsole.log(g);
          addMark({//x:g.x,y:g.y,z:g.z,
            g:g});
        //}
        continue;
      }
      if (gh.mark||gh.dbg) { addMark({g:g,m:matattack});continue; }
    }
    
    
    //...
  }
  function objTargetCampos(o,e) {
    
    var v=views[0],cp=v.camera.position,tp=v.controls.target,
        dx=cp.x-tp.x,dy=cp.y-tp.y,dz=cp.z-tp.z;//,o=this;
    
    //path=undefined;//temp later path is reset after movement
    
    //if (o==selo) {
    if (e.detail>1) {
      var l=Math.sqrt(dx*dx+dy*dy+dz*dz),lr=2*o.orbitCenter*o.scale;
      if (Math.abs(l-lr)<0.01) lr=lastCamDist; else lastCamDist=l;
      dx*=lr/l;
      dy*=lr/l;
      dz*=lr/l;
    }
    var x=o.pos.x,y=o.pos.y+o.orbitCenter*o.scale,z=o.pos.z;
    setTargetCampos(x,y,z,x+dx,y+dy,z+dz);
    
    //...
  }
  function selOMarks(o) {
    
    if (selo&&(selo!=o)) {
      var bb=selo.o.bb;bb.threeMesh.scale.set(bb.s,bb.s,bb.s);bb.update=1;
    }
    
    deep.lenInit();
    if (((o==selo)&&!attackMarks)||o.moveDone) {
      //selo=o;
      deep.checkMarkAttack(o);
      attackMarks=true;
      //onsole.log('click 4');
    } else {
      //selo=o;
      deep.maxlen=4;
      deep.calcLen(o.x,o.y,o.z,0,o)
      attackMarks=false;
      //onsole.log('click 5');
      //onsole.log(deep.rH);
    }
    selo=o;
    //console.log(deep.rH);
    updateMarks();
    
    if ((!attackMarks)&&(marks.length==0)) {
      deep.checkMarkAttack(o);
      attackMarks=true;
      updateMarks();
    }
    
    //console.log('selOMarks');
    //console.log(o);
    //if (o.o) o.o.bb.update=1;
    //---following suboptimal: size of bb relates to distance, bad to relate to selection too
    if (o.o) {
    var bb=o.o.bb;bb.threeMesh.scale.set(bb.s,bb.s*2,bb.s);bb.update=1;
    }
    //...
  }
  function checkSelNext() {
    for (var i=0;i<os.length;i++) {
      var o=os[i];
      if (o.party!=party) continue;
      if (o.attackDone) continue;
      objTargetCampos(o,{});
      selOMarks(o);
      return 1;
    }
    return 0;
    //...
  }
  function click(e) {
    //onsole.log('deep8.click');
    //onsole.log(this);
    if (path) return;
    
    var o=this;
    
    //onsole.log('click 0');
    
    if (attackMarks&(o!=selo)) {
      //check if selo can atack o
      var attackable=false;
      for (var z=o.z+o.zw-1;z>=o.z;z--)
      for (var y=o.y+o.yw-1;y>=o.y;y--)
      for (var x=o.x+o.xw-1;x>=o.x;x--) {
        var g=deep.getR(z,y,x);
        if (g&&g.mark) attackable=true;
      }
      
      if (attackable) {
        var o0=selo;attacko=o;
        attackRoty=-Math.atan2(o.z+o.zw/2-o0.z-o0.zw/2,o.x+o.xw/2-o0.x-o0.xw/2)+Math.PI/2;
        return;
      }
    }
    
    
    objTargetCampos(o,e);
    if (e.detail>1) return;
    //onsole.log('click 1');
    if (o.party!=party) return;
    //onsole.log('click 2');
    if (o.attackDone) return;
    //onsole.log('click 3');
    
    //if (o==selo) {
    
    //selo=o;
    
    
    //aa.c1.x=x+dx;aa.c1.y=y+dy;aa.c1.z=z+dz;
    //aa.t1.x=x;   aa.t1.y=y;   aa.t1.z=z;
    //aa.c0.copy(v.camera.position);
    //aa.t0.copy(v.controls.target);
    //taa=tam;
    
    //for (var i=marks.length-1;i>=0;i--) base.remove(marks[i]);
    //marks=[];
    
    //deep.placeGrid(o0,1);
    
    selOMarks(o);
    //deep.lenInit();
    //if (((o==selo)&&!attackMarks)||o.moveDone) {
    //  //selo=o;
    //  deep.checkMarkAttack(o);
    //  attackMarks=true;
    //  //onsole.log('click 4');
    //} else {
    //  //selo=o;
    //  deep.maxlen=4;
    //  deep.calcLen(o.x,o.y,o.z,0,o)
    //  attackMarks=false;
    //  //onsole.log('click 5');
    //  //onsole.log(deep.rH);
    //}
    //selo=o;
    ////console.log(deep.rH);
    //updateMarks();
    
    
    
    //var rH=deep.rH,c=0;
    //for (var k in rH) {
    //  var g=rH[k],gh=g;
    //  if (g.len==0) continue;
    //  if (g.gpos) gh=g.gpos;
    //  if (gh.len) {
    //    c++;
    //    //onsole.log(g);
    //    addMark({//x:g.x,y:g.y,z:g.z,
    //      g:g});
    //  }
    //}
    //onsole.log('click c='+c);
    
    
    
    //var w=gridw,wh=w*0.9;
    //for (var x=-1;x<=o.xw;x++) for (var z=0;z<2;z++) {
    //  addMark({x:x+o.x,y:o.y,z:o.z+z*(o.zw+1)-1});
      
      //var mesh=new THREE.Mesh(new THREE.BoxGeometry(wh,wh/4,wh),m1);var b=mesh;
      //mesh.position.set((x+o.x+0.5)*w,o.y*w-1.75,(o.z+0.5+z*(o.zw+1)-1)*w);
      //mesh.updateMatrix();
      //mesh.matrixAutoUpdate=false;
      //base.add(mesh);
      //marks.push(mesh);
    //}
    //for (var x=0;x<2;x++) for (var z=0;z<o.zw;z++) 
    //  addMark({x:o.x+x*(o.xw+1)-1,y:o.y,z:z+o.z});
    
  }
  function setpos(o,x,y,z) {
    o.pos.x=(x+o.xw/2)*gridw;
    o.pos.y=y*gridw-1.8;
    o.pos.z=(z+o.zw/2)*gridw;
    //...
  }
  function bbdraw(bb) {
    
    var c=bb.c,w=c.width,h=c.height*bb.ar,ct=bb.ct,o=bb.o;//c.getContext('2d');
    ct.clearRect(0,0,w,h);
    var co=parties[o.party].bbcol;
    ct.fillStyle='rgba('+co[0]+','+co[1]+','+co[2]+','+(0.5)+')';ct.fillRect(0,0,w,h);//p.c=c;p.ct=ct;
    //ct.font='20px sans-serif';ct.textBaseline='top';ct.fillStyle='#ff0';
    //ct.fillText('-> '+Math.random(),2,2);
    var o=bb.o,f=o.health/o.mhealth;
    //console.log(o);
    //ct.fillStyle='rgba(255,0,0,0.5)';
    var wb=4,w0=(w-wb*2)*f,yb=(o==selo?2:4);
    ct.fillStyle='rgba(0,255,0,1)';ct.fillRect(wb,yb,w0,h-yb*2);
    ct.fillStyle='rgba(255,0,0,1)';ct.fillRect(wb+w0,yb,(w-wb*2)-w0,h-yb*2);
    
    
  }
  function initpos(o) {
    //o.pos.x=(o.x+o.xw/2)*gridw;
    //o.pos.y=o.y*gridw-1.8;
    //o.pos.z=(o.z+o.zw/2)*gridw;
    setpos(o,o.x,o.y,o.z);
    o.bb=1;o.vis=true;
    o.bby=(o.yw)*gridw+(o.bby||0);
    o.bbdraw=bbdraw;o.bbwb=3;
    deep.placeGrid(o,1);
    os.push(o);
    return o;
  }
  function gameStart() {
    startt=Date.now();
    game.init();
    setTimeout(checkSelNext,1000);
    //...
  }
  function restart() {
    
    for (var i=os.length-1;i>=0;i--) threeRemoveObj(os[i].o);
    os=[];deep.setRH({});//=new Deep({rH:{}});
    updateMarks();party=0;selo=undefined;attackMarks=false;
    mturn.bgcol=parties[party].col;//...
    if (mturn.c) mturn.c.style.backgroundColor=mturn.bgcol;
    gameStart();
    //...
  }
  function ai() {
    //onsole.log('ai 0');
    if (!checkSelNext()) { turn();return; }
    //onsole.log('ai 1');
    
    var o=selo;
    
    if (attackMarks) {
      var a=[],v=-1000;
      //marks[rani(marks.length)].userData.onclick();
      for (var i=marks.length-1;i>=0;i--) {
        var v0=-1000,g=marks[i].userData.g;
        if (g.os) if (g.os.length>0) {
          var o0=g.os[0];
          v0=-o0.health;
        }
        if (v0<v) continue;
        if (v0>v) { a=[];v=v0; }
        a.push(g);
      }
      a[rani(a.length)].mesh.userData.onclick();
    } else {
      var a=[],v=-1000;
      for (var i=marks.length-1;i>=0;i--) {
        var ud=marks[i].userData,g=ud.g;
        if (1) {
        if (g.gpos) if (!g.len||(g.gpos.len<g.len)) g=g.gpos;
        var a0=deep.checkMarkAttack({x:g.x,y:g.y,z:g.z,xw:o.xw,yw:o.yw,zw:o.zw,ar:o.ar,party:party},1);
        //onsole.log('a0.len='+a0.length);
        var v0=-1000;
        for (var j=a0.length-1;j>=0;j--) {
          var g0=a0[j];
          if (!g0.os) continue;
          if (g0.os.length==0) continue;
          var o0=g0.os[0];
          //onsole.log(o0);
          v0=Math.max(v0,-o0.health);
        }
        if (v0<v) continue;
        if (v0>v) { a=[];v=v0; }
        }
        a.push(ud.g);//not g, after onclick it will be again g
      }
      //onsole.log('ai walk v='+v);
      var ud=a[rani(a.length)].mesh.userData;
      //onsole.log('aiwalk a.len='+a.length+' g o:');
      //onsole.log(ud.g);
      //onsole.log(o);
      //o.attackDone=true;
      //ud.onclick();
    setTimeout(function() {
      ud.onclick();
    }
    ,500);
    }
    
    
    //marks[rani(marks.length)].userData.onclick();
    //onsole.log('ai 2');
    //if (attackMarks) {
    //  //---
    //} else {
    //  //---
    //}
    
  }
  function turn() {
    if (path) return;
    
    Sound.osc({a:
      //[{f:300,v:0,n:1},{t:10,v:1},{t:240,v:0}]
      party!=0?[{fr:[50,100],v:0,n:1},{t:10,v:1},{t:200,v:1},{t:140,v:0,fr:[200,400]}]
      :[{fr:[100,200],v:0,n:1},{t:10,v:1},{t:100,v:1},{t:140,v:0,fr:[25,50]}]
    });//,o);
    
    
    party=(party+1)%parties.length;
    mturn.bgcol=parties[party].col;//...
    mturn.c.style.backgroundColor=mturn.bgcol;
    
    for (var i=os.length-1;i>=0;i--) {
      var o=os[i];if (o.env) continue;
      if (o.party!=party) continue;
      //console.log(o);
      o.moveDone=0;o.attackDone=0;
    }
    
    //selo=undefined;deep.lenInit();updateMarks();
    
    if (parties[party].ai) {
      ai();
    } else checkSelNext();
    //...
  }
  function checkGameInit() {
    if (!(window.Menu&&window.Deep&&game.init)) return;
    
    Menu.init(
    
    [{s:'&#9776;',noTri:true,fs:1.4,pw:0.05,sub:[
    {s:'Restart',fs:1.4,vertCenter:1,actionf:restart},
    {s:'Version 0.539 '//FOLDORUPDATEVERSION
      ,fs:1.2,vertCenter:1,ph:0.02,noinp:1}]},
      mturn={s:'Turn',msid:'mturn',ms:'',
      fs:1.4,vertCenter:1,bgcol:parties[party].col,actionf:turn
    }]
    
    
    ,{listen:1,diw:750});
    
    deep=new Deep({rH:{}});
    gameStart();
    //...
  }
  function calcPartyCount() {
    for (var i=parties.length-1;i>=0;i--) parties[i].os=[];
    for (var i=os.length-1;i>=0;i--) {
      var ohi=os[i];parties[ohi.party].os.push(ohi);
    }
    //...
  }
  function updateObjVis(o) {
    //...
    var vis=deep.checkObjVis(o);
    if (vis!=o.vis) {
      o.vis=vis;
      if (vis) 
        threeReaddObj(o.o);
      else 
        threeRemoveObj(o.o);
    }
    //...
  }
  function updateViews() {
    deep.setViews(parties[0].os);
    dum0.geometry=new DungeonGeometry({rH:deep.rH,dx:0,dy:0,dz:0,blockw:gridw},false);
    dum1.geometry=new DungeonGeometry({rH:deep.rH,dx:0,dy:0,dz:0,blockw:gridw},true);
    //...
    for (var i=os.length-1;i>=0;i--) {
      var o=os[i];
      if (o.party==0) continue;
      updateObjVis(o);
    }
  }
  game.calc=function(dt) {
    if (selg) {
      selt+=dt;
      //matsel.opacity=0.5+0.5*Math.sin(selt*0.03);
      if (selt>200) {
        selg.mesh.material=selg.mark?matattack:m1;
        selg=undefined;
      }
    }
    var o=selo;
    if (attackRoty!==undefined) {
      var da=dAng(attackRoty,o.roty),
          d=(da>0?1:-1)*dt*0.01,finRot=false;
      if (Math.abs(da)<Math.abs(d)) {
        d=da;
        attackRoty=undefined;
        Pd5.animStart(o.o,o.o.animh[o.animAttack]);
        var ao=attacko;
        if (ao) {
          ao.health=Math.max(0,ao.health-o.ap);ao.o.bb.update=1;
          Pd5.animStart(ao.o,ao.o.animh[ao.health==0?ao.animLost:ao.animHit]);
        }
        attackt=500;
        finRot=true;
      }
      o.roty+=d;
      if (finRot) if (party==0) updateViews();
    }
    
    if (attackt>0) {
      attackt-=dt;
      if (attackt<=0) {
        Pd5.animStart(o.o,o.o.animh[o.animIdle]);
        deep.lenInit();
        updateMarks();
        attackMarks=false;
        var ao=attacko;
        if (ao) {
          //ao.health=Math.max(0,ao.health-o.ap);ao.o.bb.update=1;
          if (ao.health==0) {
            //console.log(o);
            //console.log('deep8.calc0 '+os.length);
            threeRemoveObj(ao.o);
            deep.placeGrid(ao,0);
            os.splice(os.indexOf(ao),1);
            //console.log('deep8.calc1 '+os.length);
            calcPartyCount();
            updateViews();
    
    if ((parties[0].os.length==0)||(parties[1].os.length==0)) {
    //if (1) {
      var t=Math.floor(0.5+(Date.now()-startt)/1000),won=parties[0].os.length>0;
      Menu.seta([
      {s:'Game over.<br>You '+(won?'won':'lost')+' in '+Math.floor(t/60)+'min '+t%60+'sec!'
        ,fs:0.8,noinp:1,col:won?'#050':'#800',px:0.05,py:0.05,pw:0.4,ph:0.1},
      {s:'Restart',px:0.05,py:0.13,fs:1.2,vertCenter:1,pw:0.15,ph:0.08,actionf:restart}]);
    }
    
    
    
          } else Pd5.animStart(ao.o,ao.o.animh[ao.animIdle]);
          attacko=undefined;
        }
        o.attackDone=1;
            
        if (!checkSelNext()) {
          //console.log('can turn nao');
          turn();
        }
        return;//because via turn,.. path could be reinited
      }
    }
    
    if (!path) return;
    if (path.length==1) { console.log('path.length==1');return; }
    //matsel.opacity=Math.random();
    var mt=300;//,o=selo;
    patht=Math.min(patht+dt,mt);
    var f1=patht/mt,f0=1-f1,g0=path[pathi],g1=(path.length==1)?g0:path[pathi+1],
        x=g0.x*f0+g1.x*f1,
        y=g0.y*f0+g1.y*f1,
        z=g0.z*f0+g1.z*f1;
    
    if (patha1===undefined) {
      patha0=o.roty;
      patha1=-Math.atan2(g1.z-g0.z,g1.x-g0.x)+Math.PI/2;
      da=dAng(patha1,patha0);
      patha1=patha0+da;
    }
    
    setpos(o,x,y,z);
    o.roty=patha0*f0+patha1*f1;
    
    var v=views[0],cp=v.camera.position,tp=v.controls.target,
        dx=cp.x-tp.x,dy=cp.y-tp.y,dz=cp.z-tp.z;//,o=this;
    var x=o.pos.x,y=o.pos.y+o.orbitCenter*o.scale,z=o.pos.z;
    tp.set(x,y,z);cp.set(x+dx,y+dy,z+dz);
    //setTargetCampos(x,y,z,x+dx,y+dy,z+dz);
    
    //set pos,a
    
    if (patht==mt) {
      patht=0;patha1=undefined;
      pathi++;
      //console.log(pathi);
      if (pathi==path.length-1) {
        path=undefined;
        deep.lenInit();
        deep.placeGrid(o,0);
        o.x=g1.x;o.y=g1.y;o.z=g1.z;
        deep.placeGrid(o,1);
        deep.checkMarkAttack(o);attackMarks=true;
        updateMarks();
        Pd5.animStart(o.o,o.o.animh[o.animIdle]);
        o.moveDone=1;
        
        if (party==0) updateViews(); else updateObjVis(o);    
        
        if (parties[party].ai) ai();
        //objTargetCampos(o,{});
      }
    }
    //console.log(dt);
  }
  //...
  addView({w:1,h:1,x:0,y:0,cam:new THREE.Vector3(-1.5,1.5,3.50),bg:1,fovportrait:1,
    target:new THREE.Vector3(0,-0.40,0),fov:60,bgcol:0x666666,vr:url.vr!='0'});
  resize();
  
  var mesh;
  threeSetMeshMaterial(mesh={diff:'objs/mapGen/d10.jpg',spec:'objs/mapGen/s1.jpg'
    ,norm:'objs/mapGen/n1.jpg'},{});//m0=mesh.material;//m0=
  //console.log(mesh.material);
  
  //box(0,-1.9,0,5.2,0.2,5.2,m0).castShadow=false;
  
  dum0=box(0,-1.8,0,1,1,1,new THREE.MeshPhongMaterial({color:0x888888,flatShading:true,
    transparent:true,opacity:0.5}));//dum0.castShadow=false;
  dum1=box(0,-1.8,0,1,1,1,mesh.material);//dum1.castShadow=false;
  
  var s=document.createElement('script');s.src='/util/deep.js';
  s.onload=checkGameInit;document.body.appendChild(s);
  var s=document.createElement('script');s.src='/menu.js';
  s.onload=checkGameInit;document.body.appendChild(s);
  
  Conet.download({fn:url.fn0||'deep/test0.deep8.js',f:function(v) {
    eval(v);
    checkGameInit();
    //console.log(game);
    //...
  }
  });
  
  
}
initAnimScript();
//console.log('YOIUOkokooko');
//fr o,1
//fr o,1,14
//fr o,1,15
//fr o,1,22
//fr o,1,24
//fr o,1,29
//fr o,1,30
//fr o,1,31
//fr p,36,246
