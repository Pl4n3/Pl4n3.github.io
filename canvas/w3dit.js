var W3dit={};
(function (W3dit) {
  var logs=[],cw,ch,cw2,ch2,ot,canvas,cont,width,height,tparts=[],first=true,canv,
      fpst=0,fpsc=0,fpss='',v3h=new Vecmath.Vec3(20,20,20),m4=new Vecmath.Mat4(),
      m0=new Vecmath.Mat4(),hh=0,vh0=new Vecmath.Vec3(0,0,0),vh1=new Vecmath.Vec3(0,0,0),
      vh2=new Vecmath.Vec3(0,0,0),cr=new Vecmath.Vec3(0,0,0),ot=new Date().getTime(),
      mouseP={x:0,y:0},mD=false,aX=0,aY=0,oaX=0,oaY=0,scale=1,oscale=scale,
      tr=new Vecmath.Vec3(0,0,0),otr=new Vecmath.Vec3(tr.x,tr.y,tr.z),v40=new Vecmath.Vec4(),
      keyA=[],moused=[],editv=undefined,selv=[],editw=undefined,selw=[],touches={},
      TM_SCALE=1,TM_ROT=2,TM_POINT=3,TM_TRANSL=4,touchMode=TM_POINT,PI=Math.PI,
      mroot,menuw=150,menuh=75,menus=[],curmenu,menusRestruct=false,mundo={s:'Undo',bgcol:'rgba(200,100,0,0.3)'},
      rmenus=[],matoggle,mselb,sounds={},audioPools={},undo=[],redo=[],sel,tf,ta,noMouse=false,predefined,
      modalS='',modalC=undefined,modalM=undefined,lsKey='we3da',fn,grid=30,dcol={r:230,g:200,b:100},
      bcol={r:100,g:200,b:100},col=undefined,lo,v0=new Vecmath.Vec4(),v1=new Vecmath.Vec4(),
      m0=new Vecmath.Mat4(),m1=new Vecmath.Mat4(),m=new Vecmath.Mat4(),viewBones=false,viewTex=false,
      singleBone=false,agh=menuh,abox={x:0,y:0,w:0,h:0},selak=-1,selakf=0,selakto,
      VERTS=0,BONES=1,WEIGHTS=2,selMode=WEIGHTS,selb=-1,mselbi=0,mselbc='rgba(200,200,0,0.7)',
      isPaint=false,mroots,mmode,version='1.3 ',//FOLDORUPDATEVERSION
      mviewmode,mtest={s:'Mtest'},manims,paintLoaded=false,mfile,mexport,ribbon,dungeonH,onLoadS,
      mload,maklocal,makall,mgrid,clickI=-1,clickCount=0,mx,my,drawNew=true,dtscale=1,mLoadMultiple,
      abCopy={q:new Vecmath.Vec3(0,0,0),t:new Vecmath.Vec3(0,0,0)},mCanvasOverlay,mscript,wasPolygon=false,
      screenshotTimer,screenDumps=[],makeScreenDump=false,selbo=[],//mThreeWires,mThreePoints,wasRibbon=false;
  //------------------------------phys
      physTris=new Array(),ptris,p1=new Vecmath.Vec3(),p2=new Vecmath.Vec3(),p3=new Vecmath.Vec3(),
      b=new Vecmath.Vec3(),a=new Vecmath.Vec3(),rnormal=new Vecmath.Vec3(),bnorm=new Vecmath.Vec3(),
      delta=new Vecmath.Vec3(),a2=new Vecmath.Vec3(),rnorm2=new Vecmath.Vec3(),
      pf=new Vecmath.Vec3(),pt=new Vecmath.Vec3(),pt2=new Vecmath.Vec3(),V_MIN=0.001,hTexI=6,
      genDunKeepView=false,diw=750,url,mswitch,mmain,mloadalso,mcfile,
      addParams=['rotofs','w3ditLoadAlso','bulletCfg','about'];
  //----
  function activate() {
    var c=window;//canvas;//window
    c.addEventListener('DOMMouseScroll',mouseScroll,false);
    c.addEventListener('mousewheel',mouseScroll,false);
    c.addEventListener('touchstart',touchStart,{passive:false});
    c.addEventListener('touchmove',touchMove,{passive:false});
    c.addEventListener('touchend',touchEnd,{passive:false});
    c.addEventListener('keydown',keyDown,false);
    c.addEventListener('keyup',keyUp,false);
    //window.onkeydown=keyDown;
    //window.onkeyup=keyUp;
    if (0) {//emulate touch
    var emumd=0;
    c.addEventListener('mousedown',function(e) {
      emumd=1;
      touchStart({touches:[e]});
    }
    );
    c,addEventListener('mousemove',function(e) {
      if (emumd) touchMove({touches:[e]});
    }
    );
    c.addEventListener('mouseup',function(e) {
      emumd=0;
      touchEnd({touches:[]});
    }
    );
    } else {
      c.addEventListener('mousemove',mouseMove,false);
      c.addEventListener('mousedown',mouseDown,false);
      c.addEventListener('mouseup',mouseUp,false);
    }
  }
  function animSerialize(ao) {
    var s='';
    s+='{"name":"'+ao.name+'","a":[\n';
    for (var h=0;h<ao.a.length;h++) {
      var ak=ao.a[h];
      s+='{"t":'+sfe(ak.t)+(ak.mark?',"mark":'+esc(ak.mark)+'':'')+(ak.text?',"text":'+esc(ak.text)+'':'')+',"bs":[';
      var bs=ak.bs;
      for (var i=0;i<bs.length;i++) {
        var ab=bs[i];
        var t=ab.t,q=ab.q;
        s+='{"t":{"x":'+sfe(t.x)+',"y":'+sfe(t.y)+',"z":'+sfe(t.z)
         +'},"q":{"x":'+sfe(q.x)+',"y":'+sfe(q.y)+',"z":'+sfe(q.z)+'}}'
         +(i<bs.length-1?',':'');
      }
      s+=']}'+(h<ao.a.length-1?',':'')+'\n';
    }
    s+=']}'
    return s;
    //...
  }
  function akTranslate(ab,f,m) {
    var tx=ab.t.x,ty=ab.t.y,tz=ab.t.z;
    var v=(m==0?ab.ot.x:(m==1?ab.ot.y:ab.ot.z))+f*500/scale;if (grid!=0) v=Math.floor(v/grid+0.5)*grid; 
    if (m==0) ab.t.x=v; else if (m==1) ab.t.y=v; else ab.t.z=v; 
    if (maklocal.checked) {
      var b=lo.bones[selb];
      for (var h=lo.bones.length-1;h>=0;h--) {
        var b0=lo.bones[h];
        if (b0.up!=b) continue;
        var ab0=lo.anim[selak].bs[h];
        ab0.t.x-=ab.t.x-tx;
        ab0.t.y-=ab.t.y-ty;
        ab0.t.z-=ab.t.z-tz;
      }
      for (var i=b.ws.length-1;i>=0;i--) {
        var p=b.ws[i].p0;
        p.x-=ab.t.x-tx;
        p.y-=ab.t.y-ty;
        p.z-=ab.t.z-tz;
      }
    }
    if (makall.checked) {
      for (var h=lo.anims.length-1;h>=0;h--) {
        var anim=lo.anims[h].a;
        for (var i=anim.length-1;i>=0;i--) {
          var ab0=anim[i].bs[selb];
          ab0.t.x=ab.t.x;ab0.t.y=ab.t.y;ab0.t.z=ab.t.z;
        }
      }
    }
  }
  function boneDel(b) {
    for (var h=lo.bones.length-1;h>=0;h--) {
      var bh=lo.bones[h];
      if (bh.up==b) boneDel(bh);
    }
    for (var h=b.ws.length-1;h>=0;h--) weightDel(b.ws[h]);
    var bi=lo.bones.indexOf(b);
    lo.bones.splice(bi,1);
    for (var h=lo.anims.length-1;h>=0;h--) {
      var ah=lo.anims[h].a;
      for (var i=ah.length-1;i>=0;i--) 
        ah[i].bs.splice(bi,1);
    }
    selbo.length=0;
  }
  function boneIndex(o,name) {
    for (var h=o.bones.length-1;h>=0;h--) {
      if (o.bones[h].name==name) return h;
    }
    return -1;
  }
  function boneScale_todel(bi,sc) {
    if (1) {
      Pd5.modBone({o:lo,bi:bi,s:sc,rec:1});
    } else {
      var b=lo.bones[bi];//...
      for (var i=0;i<b.ws.length;i++) {
        var w=b.ws[i];
        w.p0.scale1(sc);
      }
      for (var i=0;i<lo.bones.length;i++) {
        var bs=lo.bones[i];
        if (bs.up!=b) continue;
        for (var j=0;j<lo.anims.length;j++) {
          var ao=lo.anims[j];
          for (var h=0;h<ao.a.length;h++) {
            var ak=ao.a[h];
            var t=ak.bs[i].t;
            t.x*=sc;t.y*=sc;t.z*=sc;
          }
        }
        boneScale(i,sc);
      }
    }
    
    
    //s+='"anims":[\n';
    //for (var j=0;j<lo.anims.length;j++) {
    //  var ao=lo.anims[j];
    //  s+='{"name":"'+ao.name+'","a":[\n';
    //  for (var h=0;h<ao.a.length;h++) {
    //    var ak=ao.a[h];
    //    s+='{"t":'+sfe(ak.t)+(ak.mark?',"mark":'+esc(ak.mark)+'':'')+(ak.text?',"text":'+esc(ak.text)+'':'')+',"bs":[';
    //    var bs=ak.bs;
    //    for (var i=0;i<bs.length;i++) {
    //      var ab=bs[i];
    //      var t=ab.t,q=ab.q;
    //      s+='{"t":{"x":'+sfe(t.x)+',"y":'+sfe(t.y)+',"z":'+sfe(t.z)
    //       +'},"q":{"x":'+sfe(q.x)+',"y":'+sfe(q.y)+',"z":'+sfe(q.z)+'}}'
    
    
    
  }
  function boxInside(m,x,y) {
    return (x>=m.x)&&(y>=m.y)&&(x<m.x+m.w)&&(y<m.y+m.h); 
  }
  function bulletTest() {
    for (var h=lo.bones.length-1;h>=0;h--) {
      var b=lo.bones[h];
      for (var i=b.ws.length-1;i>=0;i--) {
        var w=b.ws[i];
        if (!w.mark) continue;
        var ma=w.mark.split(',');
        if (ma.length!=4) continue;
        ma[3]='-2 -2 -2 2 2 2';
        w.mark=ma.join(',');
        //console.log(w.mark);    
      }
    }
  }
  function checkAboxDown(x,y,dx,dy) {
    var os=threeEnv.os;
    if (curmenu!=abox) return;
    //if (curmenu.press) {
      if (selak!=-1) {
        //og('checkAboxDown 1');
        if (dx==undefined) dx=0;
        //onsole.log('dx='+dx+' selakto='+selakto);
        var a=lo.anim[selak];
        //a.t+=0.01;
        //onsole.log('0 a.t='+a.t);
        a.t=Math.max(0,selakto+dx*selakf);
        //onsole.log('1 a.t='+a.t);
        var t=0;
        for (var h=selak;h>=0;h--) t+=lo.anim[h].t;
        lo.ta=t*1000;
        lo.recalc=true;
        for (var oi=0;oi<os.length;oi++) { var o=os[oi];if (o==lo) continue;
          o.ta=lo.ta;o.recalc=true; }
        drawNew=true;
        return;
      }
    if (curmenu.press) {
      //og('checkAboxDown 0');
      selak=-1;
      lo.animStop=true;lo.recalc=true;
      //matoggle.s='42';
      //menuReset();
      lo.ta=((x-abox.x)*lo.aT/abox.w)*1000;
      for (var oi=0;oi<os.length;oi++) { var o=os[oi];if (o==lo) continue;
        o.ta=lo.ta;o.recalc=true;o.animStop=true; }
      if (Menu.checkAddRecent(matoggle)) { menuReset();Menu.init(mroots);Menu.draw(); }
      drawNew=true;
    }
    
  }
  function checkAddRecent(m) {
    var ret=false;
    if (m.r) {
      if (rmenus.indexOf(m)==-1) { rmenus.push(m);m.recent=true;ret=true; }
      while (rmenus.length>3) rmenus.shift().recent=false;
    }
    return ret;
  }
  function checkEditvUndo() {
    //if (!editv) return;
    //if (!editv.op0) return;
    var p0=editv.p0,op0=editv.op0;
    if (op0&&!lo.bones)
    if ((p0.x!=op0.x)||(p0.y!=op0.y)||(p0.z!=op0.z)) {
      undo.push(['v',editv,op0.x,op0.y,op0.z]);
      if (undo.length==1) menuReset();
      
      //og('checkEditvUndo 0');
      //Paint.stacktrace();
      updateMundo();
    }
    editv=undefined;
  }
  function checkSelak() {
    //onsole.warn('checkSelak');
    //og('checkSelak 0');
    if (selak!=-1) {
      //og('checkSelak 1');
      selak=-1;
      //matoggle.s='23';
      Menu.remove();menuReset();
      //Menu.init(mroots);
      Menu.draw();
      //add undo here
      return;
    }
    var ta=lo.ta/1000;
    var md=0.05,mi=-1,t=0,mt;
    for (var h=0;h<lo.anim.length;h++) {
      t+=lo.anim[h].t;
      var d=Math.abs(ta-t);
      if (d<=md) { md=d;mi=h;mt=t; }
    }
    if (mi!=-1) { 
      //og('checkSelak 2');
      lo.ta=mt*1000;lo.recalc=true;selak=mi; 
      //og('checkSelak '+selak);
      var a=lo.anim[mi];
      selakto=a.t;selakf=lo.aT/abox.w;
      menuReset();
    }
  }
  function conetSave() {
    
    function idToDataUrl(id) {
      
      var c=document.createElement('canvas');
      //var id=lo.id;
      c.width=id.width;c.height=id.height;
      var ct=c.getContext('2d'),dh,ifmt=(mfile.ms&&mfile.ms.endsWith('Jpg.txt'))?'image/jpeg':'image/png';
      ct.putImageData(id,0,0);
      return c.toDataURL(ifmt);
      
      
      //...
    }
    
    
    
    if (lo.animFn) {
      var s='{"onlyAnims":1,"bones":[';
      for (var i=0;i<lo.bones.length;i++) s+=(i==0?'':',')+'"'+lo.bones[i].name+'"';
      s+='],\n"anims":[\n',frst=1;
      for (var ao of lo.anims) {
        if (ao.animFn!=lo.animFn) continue;
        s+=(frst?'':',\n')+animSerialize(ao);frst=undefined;
      }
      s+=']}';
      //onsole.log(s);
      //og('Saving extern anims: '+lo.animFn);
      Conet.upload({fn:lo.animFn,data:s,log:log});
      return;
    }
    
    if (!mfile.ms) { log('Conet Save Error: No filename.');return; }
    
    var pages=window.Paint?Paint.getPages():undefined;
    if (lo.meshes&&pages) if ((lo.meshes.length>0)&&(pages.length==3)) {
      var m=lo.meshes[lo.selmesh];
      if (m.diff) if (m.diff.length<1000) if (m.diff.endsWith('.json')) if (pages[0].change||m.diffChange) {
        pages[0].change=false;
        m.diffChange=false;
    
        //var c=document.createElement('canvas');
        //var id=lo.id;
        //c.width=id.width;c.height=id.height;
        //var ct=c.getContext('2d'),dh,ifmt=(mfile.ms&&mfile.ms.endsWith('Jpg.txt'))?'image/jpeg':'image/png';
        //ct.putImageData(pages[0].id,0,0);
        //Conet.upload({fn:m.diff,data:'{"data":"'+(dh=c.toDataURL(ifmt))+'"}',log:log});
        Conet.upload({fn:m.diff,data:'{"data":"'+(dh=idToDataUrl(pages[0].id))+'"}',log:log});
        
      }
      if (m.norm) if (m.norm.length<1000) if (m.norm.endsWith('.json')) if (pages[1].change||m.normChange) {
        pages[1].change=false;
        m.normChange=false;
        Conet.upload({fn:m.norm,data:'{"data":"'+(dh=idToDataUrl(pages[1].id))+'"}',log:log});
      }
      if (m.spec) if (m.spec.length<1000) if (m.spec.endsWith('.json')) if (pages[2].change||m.specChange) {
        pages[2].change=false;
        m.specChange=false;
        Conet.upload({fn:m.spec,data:'{"data":"'+(dh=idToDataUrl(pages[2].id))+'"}',log:log});
      }
    }
    
    
    var s=serialize();
    Conet.upload({fn:mfile.ms,nocache:1,data:s,log:log,f:function() {
      //log('Conet.save '+s.length+' bytes.');
    }
    });
    
    fn='conetBackup';save(1);
    //log('Conet.save0 '+s.length+' bytes.');
  }
  function conetSaveAs(s,mode) {
    mfile.ms=s;
    if (mode=='saveas') delete(lo.animFn);//on saveas ignore animFn, 1) to export full model, 2) else saveas would behave same as save
    conetSave();
  }
  function doNew() {
    fn='Noname';
    loadS('pa:[],fa:[]');
  }
  function strokeRectShadow(ct,x,y,w,h) {
    var st=ct.strokeStyle;
    ct.strokeStyle='#000';
    ct.strokeRect(x+1,y+1,w,h);ct.strokeRect(x-1,y+1,w,h);
    ct.strokeStyle=st;
    ct.strokeRect(x,y,w,h);
    //...
  }
  function draw() {
    if (lo) if (lo.drawNew) { drawNew=true;delete(lo.drawNew); }
    if (!drawNew) {
      setTimeout(draw,10);
      return;
    }
    drawNew=false;
    
    
    
    cw=canvas.width,ch=canvas.height;
    
    if (!canv) {
      canv={width:cw,height:ch};
    }
    //if (false)
    
    if ((canv.width!=cont.clientWidth)||(canv.height!=cont.clientHeight)) {
      canv.width=cont.clientWidth;canv.height=cont.clientHeight;
      var dpr=window.devicePixelRatio || 1;
      var dr=1;//((dpr==1)||(dpr==2))?1:Math.sqrt((dpr*dpr)*6/7);
      canvas.width=canv.width/dr+(dr!=1?2:0);canvas.height=canv.height/dr+(dr!=1?2:0);//*devicePixelRatio;
      cw=canvas.width;ch=canvas.height;
      //og("Canvas "+cw+" x "+ch);
      //log("DevicePixelRatio "+dpr+(dr!=1?" ("+dr+")":""));
      menusRestruct=true;
      for (var h=0;h<menus.length;h++) {
        var me=menus[h];
        me.x=cw-menuw;me.y=h*menuh;me.w=menuw;me.h=menuh;
      }
      
      if (!Menu.mcontrol) Menu.draw();
    }
    
    if (menusRestruct) {
      for (var h=0;h<menus.length;h++) {
        var me=menus[h];
        me.x=cw-menuw-cw/6;me.y=h*menuh;me.w=menuw;me.h=menuh;
      }
      if (mouseP.x!=0||mouseP.y!=0) {
        curmenu=searchMenu(mouseP.x,mouseP.y);
        canvas.style.cursor=curmenu?'pointer':'default';
      }
      menusRestruct=false;
    }
        
    
    var t=new Date().getTime();var dt=t-ot;ot=t;dt*=dtscale;//onsole.log(dt);
    
    if (!canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var fonts='14px Courier';
    ctx.font=fonts;
    if (first) {
      //og("webkitBackingStorePixelRatio="+(ctx.webkitBackingStorePixelRatio||1));
      var backingStorePixelRatio=ctx.webkitBackingStorePixelRatio ||
                            ctx.mozBackingStorePixelRatio ||
                            ctx.msBackingStorePixelRatio ||
                            ctx.oBackingStorePixelRatio ||
                            ctx.backingStorePixelRatio || 1;
      //og("BackingStorePixelRatio "+backingStorePixelRatio);
      first=false;
    }
    
    cw2=cw/2;ch2=ch/2;
    ctx.fillStyle='#ccc';
    ctx.strokeStyle='#000';
    //ctx.fillRect(0,0,cw,ch);
    ctx.clearRect(0,0,cw,ch);
    ctx.lineWidth=1;
    ctx.strokeRect(5,5,cw-10,ch-10);
    
    /*
    if (timg.loaded) {
      
      var iw=timg.width,ih=timg.height,ix=350,iy=10;
      ctx.drawImage(timg,ix,iy);
    
      if (!tid) {
        tid=ctx.getImageData(ix,iy,timg.width,timg.height);
      }
      if (lo) for (var h=lo.fa.length-1;h>=0;h--) {
        var f=lo.fa[h];
        ctx.strokeStyle='#000000';
        ctx.beginPath();
        ctx.moveTo(ix+1+f.v0.u*iw,iy+1+f.v0.v*ih);
        ctx.lineTo(ix+1+f.v1.u*iw,iy+1+f.v1.v*ih);
        ctx.lineTo(ix+1+f.v2.u*iw,iy+1+f.v2.v*ih);
        ctx.lineTo(ix+1+f.v0.u*iw,iy+1+f.v0.v*ih);
        ctx.stroke();
      }
      if (lo) for (var h=lo.fa.length-1;h>=0;h--) {
        var f=lo.fa[h];
        ctx.strokeStyle='#aaa';
        ctx.beginPath();
        ctx.moveTo(ix+f.v0.u*iw,iy+f.v0.v*ih);
        ctx.lineTo(ix+f.v1.u*iw,iy+f.v1.v*ih);
        ctx.lineTo(ix+f.v2.u*iw,iy+f.v2.v*ih);
        ctx.lineTo(ix+f.v0.u*iw,iy+f.v0.v*ih);
        ctx.stroke();
      }
      //texQuad(ctx,20,100,130,210,290,200,190,30);
      //texTri(ctx,20,100,130,210,190,30,true);
    }
    */
    ctx.strokeStyle='#bbb';//'#000';
    
    var fs=24;
    var bfont='bold '+fs+'px Courier';
    ctx.textBaseline='top';
    var colcur='rgba(150,150,50,0.5)';
    
    
    if (lo) { 
    
    var va=lo.verts,vf;
    
    lo.viewWeights=(selMode==WEIGHTS);
    lo.isEdit=true;
    var os=threeEnv.os;
    for (var oi=os.length-1;oi>=0;oi--) {
      var oh=os[oi];
      //var vfh=Pd5.calc(oh,dt,aX,aY,scale,tr,0,0);//cw2,ch2);
      var vfh=Pd5.calc(oh,dt,aX,aY,scale,{x:tr.x+(oh.tr?oh.tr.x:0),y:tr.y,z:tr.z},0,0);//cw2,ch2);//TEMP-FIX
      if (oh==lo) vf=vfh;
    }
    //onsole.log('w3dit.draw '+os.length);
    //in threepd5: Pd5.calc(lo,0,0,0,1,{x:0,y:0,z:0},0,0,true);
    ctx.translate(cw2,ch2);
    
    if (Pd5.dynamicsWorld) Pd5.dynamicsWorld.stepSimulation1(dt/1000);//alert(42); }
    //}
    //var f0=lo.fa[0];
    //var f1=lo.fa[1];
    if (!vf) vf=[];
    
    if (selMode!==BONES) {
    //after create dungeon vf is null here //if (vf)
    for (var h=vf.length-1;h>=0;h--) {
      var f=vf[h];
      //if (tid) {
      //if (false) 
      //if (((f.t==f0)||(f.t==f1))&&tid) 
      if (viewTex&&lo.id) {
        //texTri(ctx,f.fa[4],f.fa[5],f.fa[0],f.fa[1],f.fa[2],f.fa[3],true);
        //texTri(ctx,f.fa[2],f.fa[3],f.fa[4],f.fa[5],f.fa[0],f.fa[1],true,f.t.v0,f.t.v1,f.t.v2);
        texTri(ctx,lo.id,
          Math.floor(f.fa[0]+0.5),Math.floor(f.fa[1]+0.5),
          Math.floor(f.fa[2]+0.5),Math.floor(f.fa[3]+0.5),
          Math.floor(f.fa[4]+0.5),Math.floor(f.fa[5]+0.5),
          true,f.t.v0,f.t.v1,f.t.v2);
        //texTri(ctx,f.fa[2],f.fa[3],f.fa[0],f.fa[1],f.fa[4],f.fa[5],true,f.t.v1,f.t.v0,f.t.v2);
        //texTri(ctx,f.fa[4],f.fa[5],f.fa[2],f.fa[3],f.fa[0],f.fa[1],true,f.t.v2,f.t.v1,f.t.v0);
    
        continue;
      }
      var st='#bbb';
      if (f.t.p) {
        if (f.t.p.coll=='c') st='#00f';
        if (f.t.p.coll=='v') st='#bb0';
      }
      ctx.fillStyle=f.c;
      ctx.strokeStyle='#000';
      ctx.beginPath();ctx.moveTo(f.fa[0]+1,f.fa[1]+1);ctx.lineTo(f.fa[2]+1,f.fa[3]+1);
      ctx.lineTo(f.fa[4]+1,f.fa[5]+1);ctx.lineTo(f.fa[0]+1,f.fa[1]+1);ctx.closePath();ctx.stroke();
      ctx.beginPath();ctx.moveTo(f.fa[0]-1,f.fa[1]+1);ctx.lineTo(f.fa[2]-1,f.fa[3]+1);
      ctx.lineTo(f.fa[4]-1,f.fa[5]+1);ctx.lineTo(f.fa[0]-1,f.fa[1]+1);ctx.closePath();ctx.stroke();
      ctx.strokeStyle=st;ctx.beginPath();ctx.moveTo(f.fa[0],f.fa[1]);ctx.lineTo(f.fa[2],f.fa[3]);
      ctx.lineTo(f.fa[4],f.fa[5]);ctx.lineTo(f.fa[0],f.fa[1]);ctx.closePath();ctx.stroke();
    }
    }
    /*
    for (var h=va.length-1;h>=0;h--) {
      var v=va[h];
      if (v.ts.length==0) { v.vis=true;continue; }
      v.vis=false;
      for (var i=v.ts.length-1;i>=0;i--) if (v.ts[i].vis) { v.vis=true;break; }
    }
    */
    
    
    ctx.strokeStyle='#bbb';
    ctx.fillStyle='#bbb';//#000
    //ctx.strokeStyle='#000';
    if (selMode==VERTS) for (var h=va.length-1;h>=0;h--) {
      var v=va[h];
      if (singleBone) if (v.bi!=selb) continue;
      var p=v.p1;
      if (v.nv) {
        strokeRectShadow(ctx,p.x-2,p.y-2,4,4);
        //ctx.fillText(""+v.nv,p.x+1,p.y+1);
        continue;
      }
      if (v.mark) { strokeRectShadow(ctx,p.x-3,p.y-3,6,6);continue; }
      //if (v.ts.length>0) continue;
      strokeRectShadow(ctx,p.x-1,p.y-1,2,2);//ctx.strokeRect(p.x-1,p.y-1,2,2);//ctx.strokeRect(p.x-2,p.y-2,4,4);
    }
    
    var bones=lo.bones,anim=lo.anim;
    if (bones&&(selMode==BONES)) {
      for (var h=bones.length-1;h>=0;h--) {
        var b=bones[h],p=b.p0.p2;
        ctx.fillRect(p.x-2,p.y-2,4,4);
        ctx.fillText((b.name?b.name+' ':'')+h,p.x+1,p.y+1);
      }
      for (var h=selbo.length-1;h>=0;h--) {
        var b=bones[selbo[h]],p=b.p0.p2;
        ctx.strokeRect(p.x-10,p.y-10,20,20);
      }
    }
    
    ctx.fillStyle='#bbb';//'#000';
    ctx.lineWidth=1;
    
    if ((selMode==WEIGHTS)&&bones) {
      for (var h=bones.length-1;h>=0;h--) {
        var ws=bones[h].ws;
        for (var i=ws.length-1;i>=0;i--) {
          var p=ws[i].p2;
          if (h==selb) ctx.fillRect(p.x-2,p.y-2,4,4);
          else if (!singleBone) ctx.fillRect(p.x-1,p.y-1,2,2);
        }
      }
      for (var h=0;h<selw.length;h++) {
        var w=selw[h];
        ctx.strokeRect(w.p2.x-10,w.p2.y-10,20,20);
        
        if ((w==editw)||(h==selw.length-1)) {//if (selw.length==1) {
          swtext(ctx,'index '+(w.b.ws.indexOf(w))+'/#'+w.b.ws.length+(w.mark?' '+w.mark:''),w.p2.x,w.p2.y);//(selv.length-h-1)w
          var p=selw[h].p0;
          //s=sfe(p.x)+','+sfe(p.y)+','+sfe(p.z)+' Weight';//+' '+sfe(v.u)+','+sfe(v.v);
          swtext(ctx,sfe(p.x)+','+sfe(p.y)+','+sfe(p.z)+' w:'+w.w,w.p2.x,w.p2.y+10);
        } else 
          ctx.fillText(h+(w.mark?' '+w.mark:''),w.p2.x,w.p2.y);//(selv.length-h-1)w
      }
    }
    
    if (((selMode==WEIGHTS))&&bones&&!singleBone) for (var h=va.length-1;h>=0;h--) {
      var v=va[h];
      if (v.ws.length<=1) continue;
      var p=v.p1;
      for (var i=v.ws.length-1;i>=0;i--) {
        var p0=v.ws[i].p2;
        ctx.beginPath();
        ctx.moveTo(p.x,p.y);
        ctx.lineTo(p0.x,p0.y);
        ctx.stroke();
      }
      //ctx.strokeRect(p.x-2,p.y-2,4,4);
    }
    
    
    //ctx.strokeStyle='#000000';
    
    var fst=ctx.fillStyle;
    for (var h=0;h<selv.length;h++) {
      var v=selv[h];
      strokeRectShadow(ctx,v.p1.x-10,v.p1.y-10,20,20);
      /*
      ctx.beginPath();
      ctx.arc(v.p1.x,v.p1.y,12,0,2*PI);
      ctx.closePath();
      ctx.stroke();
      */
      var vsh=selv.length==1?'index '+(lo.verts.indexOf(v))+'/#'+lo.verts.length
        +(v.mark?' '+v.mark:'')
        +(v.ws&&(v.ws.length>1)?' ws:#'+v.ws.length:'')
        +(v.ws&&(v.ws.length>0)?' w0:'+v.ws[0].b.ws.indexOf(v.ws[0]):'')
        +(v.nvi?' nvi:'+v.nvi:'')
        :''+h+(v.mark?' '+v.mark:'');
        
        
      ctx.fillStyle='#000';var dp=1;
      ctx.fillText(vsh,v.p1.x+dp,v.p1.y+dp);ctx.fillText(vsh,v.p1.x-dp,v.p1.y+dp);
      ctx.fillStyle=fst;
      ctx.fillText(vsh,v.p1.x,v.p1.y);//(selv.length-h-1)
      
      //console.log('w3dit.draw v.ws[0]=');
      //console.log(v.ws[0]);
    }
    
    if (selb!=-1) {
      var p=lo.bones[selb].p0.p2;
      ctx.beginPath();
      ctx.arc(p.x,p.y,16,0,2*PI);
      ctx.stroke();  
    }
    
    var ri=ribbon;
    if (ri) {
      
      if (ri.x0<=ri.x1) { ri.xs=ri.x0;ri.w=ri.x1-ri.x0; } else { ri.xs=ri.x1;ri.w=ri.x0-ri.x1; }
      if (ri.y0<=ri.y1) { ri.ys=ri.y0;ri.h=ri.y1-ri.y0; } else { ri.ys=ri.y1;ri.h=ri.y0-ri.y1; }
      
    
      ctx.strokeStyle='rgb(0,0,0)';
      ctx.lineWidth=1;  
      ctx.strokeRect(ri.xs+1,ri.ys+1,ri.w,ri.h);
      
      ctx.strokeStyle='rgb(255,255,255)';
      ctx.lineWidth=1;
      ctx.strokeRect(ri.xs,ri.ys,ri.w,ri.h);
    
      //ctx.strokeStyle='rgb(0,0,0)';
    
    }
    ctx.strokeStyle='#bbb';
    
    ctx.translate(-cw2,-ch2);
    
    if (threeEnv) {
      threeEnv.rotBase.scale.set(1,1,1);
      ////threeEnv.rotBase.scale.set(scale/200,scale/200,scale/200);
      ////threeEnv.rotBase.rotation.y=aY;
      ////threeEnv.rotBase.rotation.x=aX;
      ////threeEnv.base.position.set(tr.x*200,tr.y*200,tr.z*200);
      threeRender();
      
      if (makeScreenDump) {
        var i=new Image();
        var c0=threeEnv.c;
    
        
        var c1=document.createElement('canvas');c1.width=makeScreenDump.w;c1.height=makeScreenDump.h;
        makeScreenDump=undefined;
        var ct1=c1.getContext('2d');
        ct1.drawImage(c0,(c1.width-c0.width)/2,(c1.height-c0.height)/2);
        
        
        //window.open(i.src,'screendump'+screenDumps.length);
        //i.src=c0.toDataURL("image/png");
        i.src=c1.toDataURL("image/png");
        screenDumps.push(i);
        log('ScreenDump #'+screenDumps.length,undefined,true);
      }
    }
    
    
    //------anim gui start
    
    
    if (anim) {
    var bx=100;//40;
    ctx.fillStyle=abox==curmenu?colcur:'rgba(100,100,100,0.5)';
    abox.x=bx;abox.y=ch-agh;abox.w=cw-bx*2,abox.h=agh;
    ctx.fillRect(bx,abox.y,abox.w,agh);
    ctx.font=bfont;
    ctx.fillStyle='rgba(0,0,0,0.5)';
    ctx.fillText('Animation '+lo.anims[lo.selAnim].name+': '+Math.floor(lo.aT*100+0.5)/100+'\\'+Math.floor(lo.at*100+0.5)/100,bx+20,ch-agh+(agh-fs)/2);
    //ctx.strokeStyle='rgba(0,0,0,0.5)';
    ctx.beginPath();ctx.moveTo(bx,ch-agh);ctx.lineTo(cw-bx,ch-agh);ctx.stroke();
    ctx.beginPath();ctx.moveTo(bx,ch-agh);ctx.lineTo(bx,ch);ctx.stroke();
    //ctx.beginPath();ctx.moveTo(cw-bx,ch-agh);ctx.lineTo(cw-bx,ch);ctx.stroke();
    var t=0,x;
    ctx.font=fonts;
    for (var h=0;h<anim.length;h++) {
      var a=anim[h];
      t+=a.t;
      x=bx+t*(cw-bx*2)/lo.aT;
      ctx.beginPath();ctx.moveTo(x,ch-agh);ctx.lineTo(x,ch);ctx.stroke();
      var s=""+h;
      if (h==selak) ctx.font=bfont;
      ctx.fillText(s,x-ctx.measureText(s).width-2,ch-agh+2);
      if (h==selak) ctx.font=fonts;
      
      //if (a.mark) { s='mark:'+a.mark;ctx.fillText(s,x-ctx.measureText(s).width-2,ch-agh+12); }
      if (a.text) ctx.fillText(a.text,x-ctx.measureText(a.text).width-2,ch-agh+12);
    }
    
    //x=bx+(selak!=-1?lo.anim[selak].t2:lo.at)*(cw-bx*2)/lo.aT;
    x=bx+(lo.at<0.01?lo.aT:lo.at)*(cw-bx*2)/lo.aT;
    //ctx.strokeStyle='#ffffff';
    if (selak!=-1) { //ctx.strokeStyle='#ffffff';
      ctx.lineWidth=4; }
    ctx.beginPath();ctx.moveTo(x,ch-agh);ctx.lineTo(x,ch);ctx.stroke();
    ctx.lineWidth=1;
    //ctx.strokeRect(x-10,ch-agh-10,20,agh+12);
    ctx.fillStyle='rgba(0,0,0,0.3)';
    ctx.fillRect(x-10,ch-agh-10,20,agh+12);
    }
    
    //------anim gui end
    }
    
    
    
    
    //-----status 
    
    
    //ctx.font=bfont;
    //ctx.fillStyle='#000';
    var s=mmode.ms;
    
    if (selMode==WEIGHTS) {
      //if (selw.length==1) {
      //  var w=selw[selw.length-1];
      //  var p=w.p0;
      //  s=sfe(p.x)+','+sfe(p.y)+','+sfe(p.z)+' Weight';//+' '+sfe(v.u)+','+sfe(v.v);
      //  if (s.length>20) s=s.substr(0,20);  
      //} else 
      s='W '+(selw.length>0?selw.length+'/':'')+lo.weightCount;
    } else if (selMode==VERTS) {
      //if (selv.length==1) {
      //  var v=selv[selv.length-1];
      //  var p=v.p0;
      //  s='Vert&nbsp;'+lo.verts.indexOf(v)+'&nbsp;'+sfe(p.x)+','+sfe(p.y)+','+sfe(p.z);//+' '+sfe(v.u)+','+sfe(v.v);
      //  //if (s.length>20) s=s.substr(0,20);
      //} else 
      {
        s='V';
        if (selv.length>0) {
          var v=selv[selv.length-1];
          s+='&nbsp;i'+lo.verts.indexOf(v);
          var p=v.p0;
          s+='&nbsp;'+sfe(p.x)+','+sfe(p.y)+','+sfe(p.z);
        }
        if (selv.length>1) s+='&nbsp;'+selv.length;
        if (selv.length==0) s+='&nbsp;'+lo.verts.length;
      }
    } else if (selMode==BONES&&lo.bones) s='B '+lo.bones.length;
    //ctx.fillText(s,350,10);
    if (mmode.ms!=s) Menu.ms(mmode,s);
    
    //-----status zeile end
    
    ctx.font=fonts;
    fpst+=dt;fpsc++;
    if (fpst>1000) {
      fpss=Math.floor(fpsc*1000/fpst+0.5)+' fps';
      fpst=0;fpsc=0;
    }
    
    //log(''+tr);
    
    ctx.fillStyle='#000';
    for (var h=0;h<logs.length;h++)
      ctx.fillText(logs[h],10,22+h*10);
    ctx.font='bold '+fonts;
    ctx.fillText('W3dit - Web 3d editor - '+version+'- '+fpss+Pd5.debugS,10,10);
    
    if (lo) if (lo.anim&&!lo.animStop) drawNew=true;//threeRender();
    if (Pd5.dynamicsWorld) drawNew=true;
    
    setTimeout(draw,10);
  }
  function esc(s) {
    //s=s.replace(/\"/g,'\\\"');
    //s=s.replace(/\n/g,'\\n');
    ////s=s.replace(/\\/g,'\\\\');
    s=JSON.stringify(s);
    return s;
  }
  function fillLoadSel() {
    //onsole.log('fillOadSel');
    sel.options.length=0;
    for (var i=0;i<predefined.length;i++) {
      sel.options[i]=new Option('predefined:'+predefined[i][0]);
    }
    var c=localStorage[lsKey+"1c"]||0;
    //if (c==-1) { c=4;log('fillLoadSel '+c); }
    
    for (var i=0;i<c;i++) 
      //sel.options.push(new Option('localStore:'+localStorage[lsKey+"1"+i]));
      sel.options[i+predefined.length]=new Option('localStorage:'+localStorage[lsKey+"1"+i]);
    
    
    function mloadl() {
      fn=this.ms;//s.substr(6);
      loadS(localStorage[lsKey+"0"+fn]);
      //alert(document.URL);
      //var url=document.URL,ui=url.indexOf('?');
      //if (ui!=-1) url=url.substr(0,ui);
      //window.history.replaceState('page',document.title,url+'?load='+fn);//pushState
      replaceUrl({fn:fn});
      mfile.ms=fn;
      log('Loaded localStorage:'+fn//+', triangles:'+lo.fa.length
        +'.');
      
      var c2menu=this;
      
      if (!this.c2) //ggf icon bauen, wenn nicht vorhanden
      setTimeout(function() {
        menuSetIcon(c2menu);
      }
      ,1000);
    }
    
    
    mload.sub=[];
    for (var i=c-1;i>=0;i--) {
      var sh=localStorage[lsKey+"1"+i];
      mload.sub.push({s:' ',ms:sh,actionf:mloadl,fs:0.7,lskeyimg:'mloadl'+sh});
      //mload.sub.push({s:' ',ms:sh,a:'load_l'+sh,fs:0.7});
    }
    for (var i=0;i<predefined.length;i++) 
      mload.sub.push({s:predefined[i][0],a:'load_p'+i,fs:0.7,ms:'predefined'});
  }
  function fillManims() {
    manims.sub=[];
    if (lo.anims) for (var h=0;h<lo.anims.length;h++) {
      var an=lo.anims[h],m={a:'anim_'+h,s:an.name};
      if (an.animFn) m.ms=an.animFn;
      if (lo.selAnim==h) m.bgcol=mselbc;
      manims.sub.push(m);
    }
  }
  function generateDungeon(keepOld) {
    //doNew();
    //var m={fa:[]};
    //lo={verts:[],va:[],meshes:[m],selmesh:0,isEdit:1};
    if (keepOld) genDunKeepView=true;
    doNew();var m=lo.meshes[0];
    var rH=keepOld?dungeonH:undefined;//=dungeonH;
    var xmin=0,ymin=0,zmin=0,xmax=50,ymax=50,zmax=50;
    if (!rH) {
    rH={xmax:xmax,ymax:ymax,zmax:zmax,xw:3,yw:2,zw:2};
    
    
    var gs=[
      {xp:25,yp:25,zp:25,xw:2,yw:3,zw:2,dir:1}
      //{xp:15,yp:25,zp:25,xw:2,yw:3,zw:2,dir:1}
      ////,{xp:15,yp:30,zp:25,xw:1,yw:1,zw:1,dir:1}
    ];
    //for (var c=0;c<500;c++) {
    var newg=0,nxw,nyw,nzw;
    
    Conet.seed(303);
    while (gs.length>0) {
      for (var gi=gs.length-1;gi>=0;gi--) {
        var g=gs[gi];
        var stop=false;
        for (var z=g.zp;z<g.zp+g.zw;z++) for (var y=g.yp;y<g.yp+g.yw;y++) for (var x=g.xp;x<g.xp+g.xw;x++) {
          var k=z+' '+y+' '+x;
          if (rH[k]) stop=true;
          rH[k]=[x,y,z];
        }
        if (!stop) {
        if (Conet.rand()<0.2) g.dir=Conet.rani(6);//Math.floor(Math.random()*6);
        if (Conet.rand()<0.15) {
          var newdir=Conet.rani(6);//Math.floor(Math.random()*2);
          nxw=1+Conet.rani(3);nyw=1+Conet.rani(3);nzw=1+Conet.rani(3);
          var ng={xp:g.xp,yp:g.yp,zp:g.zp,xw:nxw,yw:nyw,zw:nzw,dir:newdir};
    switch (newdir) {
      case 0:ng.xp-=ng.xw;break;
      case 1:ng.xp+=g.xw;break;
      case 2:ng.yp-=ng.yw;break;
      case 3:ng.yp+=g.yw;break;
      case 4:ng.zp-=ng.zw;break;
      case 5:ng.zp+=g.zw;break;
    }
          gs.push(ng);
        } //else newg=0;
    switch (g.dir) {
      case 0:if (g.xp<=0) stop=true; else g.xp-=g.xw;break;
      case 1:
        if (g.xp+g.xw>=xmax) { stop=true;break; }
        g.xp+=g.xw;
        break;
      case 2:if (g.yp<=0) stop=true; else g.yp-=g.yw;break;
      case 3:if (g.yp+g.yw>=ymax) stop=true; else g.yp+=g.yw;break;
      case 4:if (g.zp<=0) stop=true; else g.zp-=g.zw;break;
      case 5:if (g.zp+g.zw>=zmax) stop=true; else g.zp+=g.zw;break;
    }
        }
        if (stop) gs.splice(gi,1);
      }
    }
    dungeonH=rH;
    }
    if (rH.xmin!==undefined) xmin=rH.xmin;
    if (rH.ymin!==undefined) ymin=rH.ymin;
    if (rH.zmin!==undefined) zmin=rH.zmin;
    if (rH.xmax!==undefined) xmax=rH.xmax;
    if (rH.ymax!==undefined) ymax=rH.ymax;
    if (rH.zmax!==undefined) zmax=rH.zmax;
    
    var w=30;rH.w=w;
    function pa(x,y,z,u,v) {
      return pointAdd(
        x*w-(xmax+1)*w/2,
        y*w-ymax*w/2,
        z*w-(zmax+1)*w/2,
        u,v);
    }
    //var u0=0,v0=0,u1=1,v1=1;
    var u0=0.01,v0=0.51,u1=0.47,v1=0.99;
    for (var z=zmin-2;z<=zmax+2;z++) for (var y=ymin-2;y<=ymax+2;y++) for (var x=xmin-2;x<=xmax+2;x++) {
      var r=rH[z+' '+y+' '+x];
      if (!r) continue;
      var r0=!rH[z+' '+(y-1)+' '+x];
      var r1=!rH[z+' '+(y+1)+' '+x];
      var r2=!rH[z+' '+y+' '+(x-1)];
      var r3=!rH[z+' '+y+' '+(x+1)];
      var r4=!rH[(z-1)+' '+y+' '+x];
      var r5=!rH[(z+1)+' '+y+' '+x];
      //var v0=r0||r2||r4?pa(x,y,z):undefined;
      //var v1=r0||r3||r4?pa((x+1),y,z):undefined;
      //var v2=r0||r3||r5?pa((x+1),y,(z+1)):undefined;
      //var v3=r0||r2||r5?pa(x,y,(z+1)):undefined;
      //var v4=r1||r2||r4?pa(x,(y+1),z):undefined;
      //var v5=r1||r3||r4?pa((x+1),(y+1),z):undefined;
      //var v6=r1||r3||r5?pa((x+1),(y+1),(z+1)):undefined;
      //var v7=r1||r2||r5?pa(x,(y+1),(z+1)):undefined;
      if (r0) { var p0=pa(x,y,z,u0,v0),p1=pa(x+1,y,z+1,u1,v1),p2=pa(x+1,y,z,u1,v0),p3=pa(x,y,z+1,u0,v1);triToggle(p0,p1,p2,true);triToggle(p1,p0,p3,true); } //triToggle(v0,v2,v1,true);triToggle(v2,v0,v3,true);
      if (r1) { var p0=pa(x,y+1,z,u0,v0),p1=pa(x+1,y+1,z,u1,v0),p2=pa(x+1,y+1,z+1,u1,v1),p3=pa(x,y+1,z+1,u0,v1);triToggle(p0,p1,p2,true);triToggle(p0,p2,p3,true); } //triToggle(v4,v5,v6,true);triToggle(v4,v6,v7,true); }
      if (r2) { var p0=pa(x,y,z,u0,v0),p1=pa(x,y+1,z,u1,v0),p2=pa(x,y+1,z+1,u1,v1),p3=pa(x,y,z+1,u0,v1);triToggle(p0,p1,p2,true);triToggle(p0,p2,p3,true); } //triToggle(v0,v4,v7,true);triToggle(v0,v7,v3,true); }
      if (r3) { var p0=pa(x+1,y,z+1,u0,v1),p1=pa(x+1,y+1,z+1,u1,v1),p2=pa(x+1,y+1,z,u1,v0),p3=pa(x+1,y,z,u0,v0);triToggle(p0,p1,p2,true);triToggle(p0,p2,p3,true); } //triToggle(v2,v6,v5,true);triToggle(v2,v5,v1,true); }
      if (r4) { var p0=pa(x+1,y,z,u1,v0),p1=pa(x+1,y+1,z,u1,v1),p2=pa(x,y+1,z,u0,v1),p3=pa(x,y,z,u0,v0);triToggle(p0,p1,p2,true);triToggle(p0,p2,p3,true); } //triToggle(v1,v5,v4,true);triToggle(v1,v4,v0,true); }
      if (r5) { var p0=pa(x,y,z+1,u0,v0),p1=pa(x,y+1,z+1,u0,v1),p2=pa(x+1,y+1,z+1,u1,v1),p3=pa(x+1,y,z+1,u1,v0);triToggle(p0,p1,p2,true);triToggle(p0,p2,p3,true); } //triToggle(v3,v7,v6,true);triToggle(v3,v6,v2,true); }
    }
    //x=rH.x;y=rH.y;z=rH.z;
    //if (x===undefined) x=xmax
    var x=Math.floor((xmin+xmax)/2),y=Math.floor((ymin+ymax)/2),z=Math.floor((zmin+zmax)/2);
    if (keepOld) { x=rH.x;y=rH.y;z=rH.z; }
    
    var d0=0.1,d1=1-d0;
    var p0=pointAdd(0,0,0,0,0);
    var p1=pointAdd(0,0,0,0,0);
    var p2=pointAdd(0,0,0,0,0);
    var p3=pointAdd(0,0,0,0,0);
    var p4=pointAdd(0,0,0,0,0);
    var p5=pointAdd(0,0,0,0,0);
    var p6=pointAdd(0,0,0,0,0);
    var p7=pointAdd(0,0,0,0,0);
    rH.x=x;rH.y=y;rH.z=z;
    rH.p0=p0;rH.p1=p1;rH.p2=p2;rH.p3=p3;rH.p4=p4;rH.p5=p5;rH.p6=p6;rH.p7=p7;
    rH.setpa=function(p,x,y,z) {
      p.p0.x=x*this.w-(this.xmax+1)*this.w/2;
      p.p0.y=y*this.w-this.ymax*this.w/2;
      p.p0.z=z*this.w-(this.zmax+1)*this.w/2;
    }
    rH.setpall=function() {
      var d0=0.1;//,d1=1-d0;
      var x0=d0,x1=this.xw-d0;
      var y0=d0,y1=this.yw-d0;
      var z0=d0,z1=this.zw-d0;
      //rH.p0.p0.x=(rH.x+d0-(rH.xmax+1)/2)*rH.w;
      this.setpa(this.p0,this.x+x0,this.y+y0,this.z+z1);
      this.setpa(this.p1,this.x+x1,this.y+y0,this.z+z1);
      this.setpa(this.p2,this.x+x0,this.y+y1,this.z+z1);
      this.setpa(this.p3,this.x+x1,this.y+y1,this.z+z1);
      this.setpa(this.p4,this.x+x0,this.y+y0,this.z+z0);
      this.setpa(this.p5,this.x+x1,this.y+y0,this.z+z0);
      this.setpa(this.p6,this.x+x0,this.y+y1,this.z+z0);
      this.setpa(this.p7,this.x+x1,this.y+y1,this.z+z0);
    }
    rH.setpall();
    col={r:0,g:250,b:0};
    triToggle(p0,p1,p2,true);triToggle(p1,p3,p2,true);
    triToggle(p0,p4,p1,true);triToggle(p4,p5,p1,true);
    triToggle(p1,p5,p3,true);triToggle(p5,p7,p3,true);
    triToggle(p4,p0,p6,true);triToggle(p0,p2,p6,true);
    triToggle(p4,p6,p5,true);triToggle(p6,p7,p5,true);
    triToggle(p2,p3,p6,true);triToggle(p3,p7,p6,true);
    col=undefined;
    m.comb='objs/beton/t.jpg';
    m.diff='objs/beton/d.jpg';
    m.spec='objs/beton/s.jpg';
    m.norm='objs/beton/n.jpg';
    
    
    //Paint.drawNewtc();
    meshUpdate();
    if (!keepOld) log('Dungeon created.');
  }
  function importS(va,loadedf) {
    if (va.indexOf(':')==-1) {
      //og('load resource.');
      /*
      var x=new XMLHttpRequest();
      x.overrideMimeType('text/plain');
      x.open('GET',va,true);
    x.onreadystatechange=function() {
      if (x.readyState!=4) return;
      loadS(x.responseText,true);
      if (loadedf) loadedf(va,lo);
    }
      try {
      x.send(null);
      } catch (e) { log(e); }
      */
      
      //onsole.log('imports conet load '+va);
      
    Conet.download({fn:va,nocache:1,f:function(s) {
      loadS(s);//,true);
      log('Loaded \''+va+'\', '+lo.meshes[0].fa.length+' tris.');
      lo.fn=va;
      //mfile.ms=va;
      if (loadedf) if (typeof loadedf === 'function') loadedf(va,lo);
      
      //if (va=='w3dit/h/malus0.txt') {
      if (lo.w3ditLoadAlso&&(threeEnv.os.length==1)
        //&&confirm('Also load "'+lo.w3ditLoadAlso+'"?')
        //&&0
      ) {
        if (1) {
        if (mloadalso) Menu.arrayRemove(mmain.sub,mloadalso);
        mmain.sub.push(mloadalso={s:'Load also',ms:lo.w3ditLoadAlso
      ,actionf:function() {
        
        mLoadMultiple.checked=true;
        importS(lo.w3ditLoadAlso,function() {
          mLoadMultiple.checked=false;
          setTimeout(function() {
            mswitch.actionf();
          }
          ,100);
          //...
        }
        );
        
        
        //...
      }
        });
        } else {
        mLoadMultiple.checked=true;
      importS(lo.w3ditLoadAlso,function() {
        mLoadMultiple.checked=false;
        setTimeout(function() {
          mswitch.actionf();
        }
        ,100);
        //...
      }
      );
        //alert(32);
      }}
      
      
    }
      });
      
      return;
    }
    loadS(va,true);
  }
  function interLinePlanef(normal,d,a,b) {
    return -(normal.dot(a)+d)/normal.dot(b);
  }
  function isLocal() {
    return document.URL.substring(0,4)=='file';
  }
  function isolateRemove() {
    for (var h=lo.verts.length-1;h>=0;h--) {
      var v=lo.verts[h];
      if (v.ts.length>0) continue;
      vertDel(v);
    }
    for (var h=lo.bones.length-1;h>=0;h--) {
      var b=lo.bones[h];
      for (var i=b.ws.length-1;i>=0;i--) {
        var w=b.ws[i];
        var found=false;
        for (var j=lo.verts.length-1;j>=0;j--) {
          if (lo.verts[j].ws.indexOf(w)!=-1) { found=true;break; }
        }
        if (found) continue;
        weightDel(w);
      }
    }
    var boneDeleted=true,bdc=0;
    while (boneDeleted) {
      boneDeleted=false;
      for (var h=lo.bones.length-1;h>=1;h--) {
        var b=lo.bones[h];
        if (b.ws.length>0) continue;
        var hasUp=false;
        for (var i=lo.bones.length-1;h>=0;h--) {
          if (lo.bones[i].up==b) { hasUp=true;break; }}
        if (hasUp) continue;
        boneDel(b);
        boneDeleted=true;
        bdc++;
      }
    }
    return bdc;
  }
  function keyDown(ev) {
    var kc=ev.keyCode;
    
    //onsole.log('keyDown '+kc);
    Menu.keyDown(ev);
    //if (kc==17) canvas.style.cursor='crosshair';
    //if (kc==107) doScale(sp.w/2,sp.h/2,1.1);
    //if (kc==109) doScale(sp.w/2,sp.h/2,1/1.1);
    
    //log(kc);
    keyA[kc]=true; 
  }
  function keyUp(ev) {
    var kc=ev.keyCode;
    Menu.keyUp(ev);
    //if (kc==17) canvas.style.cursor='default';
    W3dit.shortKeys(kc);
    keyA[kc]=false; 
  }
  function load(i) {
    var ds;
    var isPre=i<predefined.length;
    if (isPre) {
      fn=predefined[i][0];
      ds=predefined[i][1];
    } else {
      //var sh=sel.value;
      //var pd=sh.substr(0,12)=='predefined: ';
      //var fn=sel.value.substr(12);;
      //tf.value=fn;
      //ta.value=pd?predefined[fn]:localStorage[lsKey+"0"+fn];
      //out(fn+' loaded.');
      fn=sel.value.substring(13);
      ds=localStorage[lsKey+"0"+fn];
      //alert(ds);
      //return;
    }
    loadS(ds);
    
    //alert(document.URL);
    //window.history.pushState('page2', 'Title', '/page2.php');
    
    mfile.ms=fn;
    log('Loaded '+(isPre?'predefined:':'localStorage:')+fn);//+', triangles:'+lo.fa.length+'.');
  }
  function loado(o) {
    editv=undefined;undo=[];selv.splice(0,selv.length);
    if (!genDunKeepView) {
      aX=0;aY=0;tr.set3(0,0,0);scale=1;//later this from file
    } else genDunKeepView=false;  
    //grid=0;
    
    //onsole.log(o);
    
    lo=o;//Pd5.load(ds);
    //lo.animStop=true;
    //lo.recalc=true;
    ////lo.anim=undefined;
    if (!o.bones) selMode=VERTS;
    
    
    if (lo.grid) { grid=lo.grid;mgrid.ms=grid; }
    if (lo.tr) {
      tr.set3(lo.tr.x,lo.tr.y,lo.tr.z);
      lo.tr={x:0,y:0,z:0};
    }
    if (lo.scale) scale=lo.scale;
    lo.selmesh=0;//lo.meshes.length-1;
    if (paintLoaded) {
      Paint.set3d(lo,selv);
      //Paint.drawNewtc(); -> auskommentiert, wird unten in meshUpdate gemacht
    }
    fillManims();
    
    //onsole.log('loado '+lo.anim);
    
    if (lo.anim) {
      lo.animStop=true;
      var a=lo.anim[0];
      lo.ta=a.t*1000;
      selak=0;
      selakto=a.t;selakf=0.001;//lo.aT/abox.w;
      lo.recalc=true;
    }
    
    //check for beam
    if (url.beams) {
      var beams={},ts={};
      for (var i=0;i<o.verts.length;i++) {
        var v=o.verts[i];
        if (!v.mark) continue;
        if (!v.mark.startsWith('{')) continue;
        var mo=JSON.parse(v.mark);mo.v=v;
        var k0=mo.beam;
        if (k0!==undefined) {
          if (!beams[k0]) beams[k0]={};
          beams[k0][mo.k1]=mo;
          continue;
        }
        if (!mo.t) continue;
        if (!ts[mo.t]) ts[mo.t]={};
        if (!ts[mo.t][mo.k0]) ts[mo.t][mo.k0]={};
        ts[mo.t][mo.k0][mo.k1]=mo;
        //k0=mo.box;
        //if (k
        //console.log(v);
      }
    
      var t=ts.box;
      if (t) for (var k in t) {
        var b=t[k],p=b.p.v.p0,d=b.d.v.p0;
        console.log('w3dit.loado box '+k);
        box(p,{x:d.x-p.x,y:d.y-p.y,z:d.z-p.z},{tris:1,u0:0.0528,v0:0.35,u1:0.3468,v1:0.6365});
      }
    
      selv=[];
      for (var k in beams) {
        var b=beams[k],p=b.p0.v.p0,d=b.p1.v.p0,
            po=b.po.v.p0,o={x:po.x-p.x,y:po.y-p.y,z:po.z-p.z};
        console.log('w3dit.loado beam '+k);
        //gate({p:p,d:d,o:o,nocull:1,pab:{noEndPoint:1,noStartPoint:1}});
        var r=gateCorridor({p:p,dir:{x:d.x-p.x,y:d.y-p.y,z:d.z-p.z},o:o,gatedf:0.8,tris:1,u0:0.0528,v0:0.35,u1:0.3468,v1:0.6365});
        selv.push(r.v0);selv.push(r.v1);selv.push(r.v2);selv.push(r.v3);
      }
      
      
      //meshUpdate();
      selv=[];for (var i=0;i<lo.verts.length;i++) selv.push(lo.verts[i]);//selv=lo.verts;
      Pd5.calc(lo,0,0.0,0.0,1,{x:0,y:-1,z:0},0,0,true);
      vertSplitNorm();
      
      //vertSplitNorm();
      //console.log(ts.box);
    }
    //console.log(beams);
    
    //if (lo.verts.length>0) 
    { 
      //				var cw=400,ch=400;//,cw2=cw*3,ch2=ch*3;
      	//		var camera=new THREE.OrthographicCamera(cw*3/-2,cw*3/2,ch*3/2,ch*3/-2,-10000,10000);
      				//camera.position.z=1500;
      //threeEnv.camera=camera;
      //hreeInit();
      //threeEnv.base=new THREE.Object3D();			threeEnv.scene.add(threeEnv.base);
      if (!mLoadMultiple.checked) {
      for (var obi=threeEnv.os.length-1;obi>=0;obi--) {
        var o=threeEnv.os[obi];
        for (var mi=o.meshes.length-1;mi>=0;mi--) {
          var mesh1=o.meshes[mi].tmesh;
          threeEnv.base.remove(mesh1);
        }
      }
      threeEnv.os=[];
      }
      
      Pd5.calc(lo,0,0.0,0.0,1,{x:0,y:-1,z:0},0,0,true);
      Pd5.calcNormals(lo,true);lo.transparent=true;
      threeAddObj(lo,0,0,0,200);			
      //hreeCheckView();//Animate();
      meshUpdate();
    }
    
    if (lo.about) Conet.log('About:'+lo.about);
    //console.log('loado lo.fn='+lo.fn);
    //console.log(lo);
    
  }
  function loadS(ds,dolog) {
    loado(Pd5.load(ds));
    //Pd5.bulletize(lo);
    if (dolog) log('Import done, triangles:'+lo.meshes[0].fa.length+'.');
    if (onLoadS) onLoadS();
  }
  function log(s) {
    //logs.splice(0,0,s);
    //while (logs.length>5) logs.pop();
    Conet.log(s);
    drawNew=true;
  }
  function logDrawNew_del(s) {
    log(s);
    drawNew=true;//...
  }
  function menuReset() {
    //if (1) return;//log('menuReset');
    
    var i=mroots.indexOf(mselb[0]);
    if (selak!=-1&&selb!=-1&&selMode==BONES) {
      if (i==-1) { mroots=mroots.concat(mselb);Menu.init(mroots,{diw:diw});Menu.draw(); }
    } else {
      if (i!=-1) { mroots.splice(i,6);Menu.init(mroots,{diw:diw});Menu.draw(); }
    }
  }
  function menuSetIcon(m) {
    if (!m) m=this;
    var c=document.createElement('canvas'),w=30,h=10;
    c.width=w;c.height=h;
    var ct=c.getContext('2d');
    //ct.fillStyle='#00f';ct.fillRect(0,0,w,h);
    //ct.strokeStyle='#000';ct.strokeRect(0,0,w,h);
    //var c2=threeEnv.c;
    drawNew=true;
    draw();
    ct.drawImage(threeEnv.c,0,0,w,h);//,c2.width,c2.height);//,w,h);
    
    localStorage[m.lskeyimg]=c.toDataURL('image/png');
    
    //console.log('png length='+c.toDataURL('image/png').length);
    //console.log('jpg length='+c.toDataURL('image/jpeg').length);
    //c.style.zIndex=-0.5;
    
    m.c2=c;
  }
  function menuSwitch(m,a) {
    var s=a,os=threeEnv.os;
    
    if (Array.isArray(s)) {
    
      console.error('W3dit.menuswitch: why array?');
      //console.error(s);
    
    
      return;
    }
    
    if (a=='Edit 3D') {
      Paint.deactivate();
      activate();
      Menu.recent=W3dit.brecent;
      Menu.init(W3dit.broots,{diw:diw});
      isPaint=false;
      return;
    } else if (s=='Polygon') {
      if (selv.length!=3&&selv.length!=4) {
        log('To toggle polygons, 3 or 4 points need to be selected.');
      } else {
        var tri=triToggle(selv[0],selv[1],selv[2]);//,true);
        //if (tri) tri.p={coll:'c'};
        if (selv.length==4) triToggle(selv[2],selv[3],selv[0]);//,true);
        undo.push(['t'].concat(selv));
        wasPolygon=true;
        updateMundo(true);
        meshUpdate();//Paint.drawNewtc();
      }
      return;
    }
    
    if (isPaint) return Paint.menuSwitch(m,a);
    if (a=='tc') {
      log('set tc...');
    } else if (a=='Paint') {
      if (!paintLoaded) paintLoad();
    
      var c=window;//canvas;//window
      c.removeEventListener('mousemove',mouseMove,false);
      c.removeEventListener('mousedown',mouseDown,false);
      c.removeEventListener('mouseup',mouseUp,false);
      c.removeEventListener('DOMMouseScroll',mouseScroll,false);
      c.removeEventListener('mousewheel',mouseScroll,false);
      c.removeEventListener('touchstart',touchStart,false);
      c.removeEventListener('touchmove',touchMove,false);
      c.removeEventListener('touchend',touchEnd,false);
      c.removeEventListener('keydown',keyDown,false);
      c.removeEventListener('keyup',keyUp,false);
      W3dit.bmenus=Menu.getMenus();
      W3dit.brecent=Menu.recent;
      W3dit.broots=Menu.roots;
      Menu.recent=[];
      Paint.activate();
      isPaint=true;
      return;
      //Menu.init([{s:'Menu',sub:[{s:'...'}]},{s:'Edit 3D'}]);
    } else 
    
    if (s=='Help') window.open('w3ditDocs.htm');
    else if (s=='Fullscreen') tryFullscreen(); 
    else if (s=='Clear log') logs=[];
    else if (s=='Undo') {
      var u=undo.pop(),u0=u[0];
      //alert(u);
      if (u0=='v') {
        var v=u[1];
        v.p0.x=u[2];v.p0.y=u[3];v.p0.z=u[4];
      } else if (u0=='t') {
        triToggle(u[1],u[2],u[3]);
        if (u.length==5) triToggle(u[3],u[4],u[1]);
      } else if (u0=='pn') {
        vertDel(u[1]);
      } else log(u0);
      if (undo.length==0) {
        var mi=mroots.indexOf(mundo);mroots.splice(mi,1);//Menu.setRoots(mroots);
      } else 
        mundo.ms=undo.length;
    } else if (s=='Save') save();
    else if (s=='Cancel'||s=='Close') unmodal();
    else if (s=='New') {
      doNew();
      replaceUrl({});
      log('New done.');
    //} else if (s=='Polygon') {
      //---
    } else if (s=='Bone del') {
      if (selb==-1) { log('First select a bone.');return; }
      var b=lo.bones[selb];
      boneDel(b);
      selb=-1;
      //---
      meshUpdate();
      Paint.drawNewtc();
    } else if (s=='Bone add') {
      var bup;
      if (lo.bones) {
        if (selb==-1) { log('First select a weight or bone.');return; }
        bup=lo.bones[selb];
      } else {
        lo.bones=[];
        lo.anim=[{t:1,bs:[]}];
        lo.anims=[{name:'idle',a:lo.anim}];
        //log('todo: Init bones.');
        //return;  
      }
      var b={ up:bup,mat:new Vecmath.Mat4(),ws:[],
        p0:{p0:new Vecmath.Vec3(),p1:new Vecmath.Vec3(),p2:new Vecmath.Vec3()},
        t:new Vecmath.Vec3(),q:new Vecmath.Vec3()};
      lo.bones.push(b);
      
      if ((lo.bones.length==1)&&(lo.verts.length>0)) {
        for (var v of lo.verts) {
          var w=Pd5.weightNew(v.p0.x,v.p0.y,v.p0.z,1);
          b.ws.push(w);
          v.ws=[w];
        }
      }
      
      var w=selw.length>0?selw[selw.length-1]:undefined;
      var p0=w?new Vecmath.Vec3(w.p0.x,w.p0.y,w.p0.z):new Vecmath.Vec3(0,0,0);
      for (var h=lo.anims.length-1;h>=0;h--) {
        var ah=lo.anims[h].a;
        for (var i=ah.length-1;i>=0;i--) 
          ah[i].bs.push({
            t:new Vecmath.Vec3(p0.x,p0.y,p0.z),
            q:new Vecmath.Vec3(0,0,0)});
      }
      var wmc=0;
      for (var h=0;h<selw.length;h++) {
        var wh=selw[h];
        var wi=bup.ws.indexOf(wh);
        if (wi==-1) continue;
        bup.ws.splice(wi,1);b.ws.push(wh);
        wh.p0.x-=p0.x;wh.p0.y-=p0.y;wh.p0.z-=p0.z;
        wmc++;
      }
      selb=lo.bones.length-1;
      lo.recalc=true;
      log('Bone #'+lo.bones.length+' added, '+wmc+' Weights moved.');
    } else if (s=='Weight add') {
      //log(32);
      var p0=undefined,b=undefined;
      if (selw.length>0) {
        var wo=selw[selw.length-1];
        p0=new Vecmath.Vec3(wo.p0.x,wo.p0.y,wo.p0.z);
        b=lo.bones[selb];//wo.b;
      } else if (selb!=-1) {
        p0=new Vecmath.Vec3(0,0,0);
        b=lo.bones[selb];
      }
      if (p0) {
        //og('wo.p0='+wo.p0);
        var wn={
          p0:p0,
          p1:new Vecmath.Vec3(),
          p2:new Vecmath.Vec3(),
          b:b,
          w:1,//wo.w,
        };
        b.ws.push(wn);
        //selw=[wn]; -> not because now on click the new weight is selected//editw=wn;
        lo.recalc=true;
        //og('wn.p0='+wn.p0);
        window.w3ditLastWeight=wn;
        log('Weight #'+b.ws.length+' added.');
      } else log('First select a weight or a bone.');
      for (var h=selw.length-2;h>=0;h--) {
        var w=selw[h];
        b.ws.push({
          p0:new Vecmath.Vec3(w.p0.x,w.p0.y,w.p0.z),
          p1:new Vecmath.Vec3(),
          p2:new Vecmath.Vec3(),
          b:b,
          w:1,
        });
        log('Weight #'+b.ws.length+' added.');
      }
    } else if (s=='Verts add') {
      if (!lo.bones) { log('Add multiple verts only works, if there are bones with (multiple) weights.');return; }
      if (selw.length==0) { log('First select weights.');return; }
      for (var h=0;h<selw.length;h++) {
        lo.verts.push({p0:new Vecmath.Vec4(0,0,0,1),p1:new Vecmath.Vec4(0,0,0,1),ts:[],vis:false,u:0.5+Math.random()*0.01,v:0.5+Math.random()*0.01,ws:[selw[h]]});
      }
      lo.recalc=true;
      log('Verts added ('+selw.length+').');
    } else if (s=='Vert add') {
      if (lo.bones) {
      if (selw.length==0) { log('First select weights.');return; }
      var v={p0:new Vecmath.Vec4(0,0,0,1),p1:new Vecmath.Vec4(0,0,0,1),ts:[],vis:false,u:0.5+Math.random()*0.01,v:0.5+Math.random()*0.01,ws:[]};
      for (var h=0;h<selw.length;h++) v.ws.push(selw[h]);
      lo.verts.push(v);
      lo.recalc=true;
      log('Vert added '+lo.verts.length+'.');
      return;
      }
      var v;var vna=[];
      if (selv.length>0) {
        for (var ve of selv) {
          var p=ve.p0;
          v=pointAdd(p.x,p.y,p.z);
          vna.push(v);
        }
        //var p=selv[selv.length-1].p0;
        //v=pointAdd(p.x,p.y,p.z);
      } else {
        //translate2(0,0);
        m4.setIdentity();
        m4.setTranslation3(-tr.x,-tr.y,-tr.z); 
        m0.scale3(1/scale,1/scale,1/scale);
        m4.mul2(m4,m0);
        m0.rotY(-aY);
        m4.mul2(m4,m0);
        m0.rotX(-aX);
        m4.mul2(m4,m0);
    
        v40.set4(0,0,0,1);
        m4.transform1(v40);
    
        v=pointAdd(v40.x,v40.y,v40.z);
        vna.push(v);
      }
      //selv.splice(0,selv.length,v);//[v];
      selv.length=0;
      for (var ve of vna) selv.push(ve);
      undo.push(['pn',v]);
      updateMundo(true);
      log(vna.length+' Verts added, now '+lo.verts.length+'.');
      meshUpdate();//Paint.drawNewtc();
    } else if (s=='Weight del') {
      for (var h=selw.length-1;h>=0;h--) {
        var w=selw[h];
        weightDel(w);
        //for (var i=lo.verts.length-1;i>=0;i--) {
        //  var v=lo.verts[i];
        //  if (v.ws.indexOf(w)!=-1) p_ointDel(v);
        //}
        ////w.b.ws=
        //w.b.ws.splice(w.b.ws.indexOf(w),1);
      }
      selw=[];//editw=undefined;
      meshUpdate();
    } else if (s=='Vert del') {
      var c=selv.length;
      for (var h=selv.length-1;h>=0;h--) vertDel(selv[h]);
      log(c+' verts deleted.');
      meshUpdate();
      //Paint.drawNewtc();
    } else if (m.mGet) {
      if (modalC) {
        //loadS(ta.value);
        m.mSet(tf.value);
        unmodal();
        //log('Import done, triangles:'+fi.length+'.');
      } else {
        tf.value=m.mGet();
        tf.style.visibility='visible';
        modalC=tf;modalS=s;modalM=m;
      }
    } else if (s=='Vert col') {
      if (selv.length==0) log('No points selected.');
      else {
        //og('pppppppp');
        if (!col) col={r:250,g:0,b:0};
        var md=100;//10//100
        //for (var h=0;h<v.ts.length;h++) {
        //  var t=v.ts[h];
        for (var i=0;i<selv.length;i++) {
        var v=selv[i];
        var fi=lo.fa;
        for (var h=0;h<fi.length;h++) {
          var t=fi[h];
          var dx=(t.v0.p0.x+t.v1.p0.x+t.v2.p0.x)/3-v.p0.x;
          var dy=(t.v0.p0.y+t.v1.p0.y+t.v2.p0.y)/3-v.p0.y;
          var dz=(t.v0.p0.z+t.v1.p0.z+t.v2.p0.z)/3-v.p0.z;
          var d=Math.sqrt(dx*dx+dy*dy+dz*dz);
          if (d>md) continue;
          var f0=d/md,f1=1-f0;
          var c0=(t.col?t.col:dcol);
          var c1=col;
          t.col={r:f0*c0.r+f1*c1.r,g:f0*c0.g+f1*c1.g,b:f0*c0.b+f1*c1.b};
          //og(d);
        }}
      }
    } else if (s=='pointcolaround') {
      if (!col) col={r:250,g:0,b:0};
      for (var i=0;i<selv.length;i++) {
        var v=selv[i];
        for (var h=0;h<v.ts.length;h++) 
          v.ts[h].col={r:col.r,g:col.g,b:col.b};
      }
      log(selv.length+' points colored.');
    } else if (m==matoggle) {//s=='animToggle') {
      lo.animStop=!lo.animStop;
      for (var oi=0;oi<os.length;oi++) os[oi].animStop=lo.animStop;
      //m.s=lo.animStop?'\u25ba':'\u25a0';//theorethisch schoen, dann muss aber ueberall umschaltung klappen..
      selak=-1;
      menuReset();
      drawNew=true;
      //log('Anim toggled to '+!lo.animStop+'.');
    } 
    else if (s=='vmmesh') { viewBones=false;viewTex=false;mviewmode.ms='Mesh';lo.recalc=true; }
    else if (s=='vmtex') { viewBones=false;viewTex=true;mviewmode.ms='Texture';lo.recalc=true; }
    else if (s=='vmbones') { viewBones=true;selv.splice(0,selv.length);mviewmode.ms='Bones';lo.recalc=true; }
    else if (s=='View reset') {
      aX=0;aY=0;tr.set3(0,0,0);scale=1;
      log('View reset done.');
    } else if (s=='viewResetRot') {
      aX=0;aY=0;
      log('View reset done.');
    } else if (s=='A.key del') {
      if (selak==-1) log('No animation key selected.');
      else {
        if (selak<lo.anim.length-1) {
          lo.anim[selak+1].t+=lo.anim[selak].t;
        }
        lo.anim.splice(selak,1);
        log('Animation key '+selak+' deleted.');
        selak=-1;
        lo.recalc=true;
      }
    } else if (startsWith(s,'mselb')) {
      mselbi=parseInt(s.substring(5));
      for (var h=0;h<mselb.length;h++) {
        var m=mselb[h];
        if (h==mselbi) { m.bgcol=mselbc; }
        else delete m.bgcol;
      }
    } else if (s=='A.key add') {
      
      
      var rh=Pd5.akeyAdd(lo);
      /*
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
      */
      
      selak=rh.i;selakto=rh.an.t;selakf=lo.aT/abox.w;menuReset();
      lo.recalc=true;
      log('Animation keyframe added at '+i+'.');
      //alert(i);
    } 
    //else if (s=='Vert all') {
    //  selv.splice(0,selv.length);
    //  for (var h=0;h<lo.verts.length;h++) 
    //    selv.push(lo.verts[h]);
    //} //else if (!m.sub&&!m.doctrl) log(s+' not implemented.');
    else if (m==mmode) {
      //alert(42);
      if (lo.bones) {
      selMode=(selMode+1)%3;
      selv.splice(0,selv.length);
      //selb=-1;
      m.ms=(selMode==VERTS?'Verts':(selMode==WEIGHTS?'Weights':'Bones'));
      menuReset();
      drawNew=true;
      }
    } else if (s=='wloomtest') {
      //if (lo.bones) log('Currently not supported for bone-structured models.'); else 
      {
        //if (!isLocal()) alert('Only works with few data.\n\n'+
        //'Reason: 3D Object and texture is converted to a url parameter\nand url-length can be limited (dropbox).\n\n'+
        //'If it not works: Copy/paste from menu-export to wloom-menu-import.');
        var s=document.URL,i=s.indexOf('/canvas/');
        s=s.substr(0,i)+'/shooter/shooter.htm';
        //self.location=
        //window.open(s+'?map=dark&glge=1&pd5='+encodeURIComponent(serialize()));
        //window.open(s+'?map=souls&three=1&pd5='+encodeURIComponent(serialize()));
        window.open(s+'?map='+(lo.bones?'bullet2':'editStatic')+'&three=1&pd5='+encodeURIComponent(serialize()));
      }
    } else if (s=='Dungeon') generateDungeon();
    else if (s=='Bullet Test') {
    onLoadS=function() {
      scale=100;tr.set3(0,-2,0);aY=-3*PI/4;
      Pd5.calc(lo,0,aX,aY,scale,tr,0,0);
      Pd5.bulletize(lo);
      lo.animStop=true;
      //log('from bullet test');
      if (Menu.checkAddRecent(matoggle)) { menuReset();Menu.init(mroots);Menu.draw(); }
      delete onLoadS;
    }
      importS('botnotex.txt');
      //Pd5.bulletize(lo);
      ////menuReset();
    } else if (s=='Load latest') {
      fillLoadSel();
      sel.selectedIndex=sel.options.length-1;
      load(sel.selectedIndex);
      scale=60;
    } else if (s=='Bulletize') Pd5.bulletize(lo);
    else if (s=='singlebone') {
      singleBone=!singleBone;
      m.s=(singleBone?Menu.son:Menu.soff);
    } else if (s=='Mesh change') {
      var pages=Paint.getPages(),change=false;
      for (var h=pages.length-1;h>=0;h--) if (pages[h].change) change=true;
      if (change) if (!confirm('Really? This will discard tex changes!')) return;
      lo.selmesh=(lo.selmesh+1)%lo.meshes.length;
      log('selmesh: '+lo.selmesh);
      Paint.set3d(lo,selv);
      Paint.drawNewtc();
    } else if (startsWith(s,'anim_')) {
      var h=parseInt(s.substr(5));
      if (!lo.animStop) Pd5.animStart(lo,lo.anims[h].a);
      else {
        lo.anim=lo.anims[h].a;
        selak=0;//0;//-1;
        selakto=lo.anim[0].t;
        lo.ta=lo.anim[0].t*1000;
      }
      lo.selAnim=h;
      lo.recalc=true;
      drawNew=true;
      var aname=lo.anims[lo.selAnim].name;
      log('Animation "'+aname+'" selected.');
      //---also set anim of other objs nao
      var os=threeEnv.os;
      if (0)
      if (os.length>1) for (var oi=0;oi<os.length;oi++) {
        var o=os[oi];
        if (o==lo) continue;
        var ah=o.animh[aname];
        if (!ah) continue;
        if (!lo.animStop) Pd5.animStart(o,ah);
        else {
          o.anim=ah;
          o.ta=lo.anim[0].t*1000;
        }
        o.recalc=true;
      }
      //---------------------------------- 
      fillManims();
    } else if (s=='rotreset') {
      if (!((selMode==BONES)&&(selak!=-1)&&(selb!=-1))) return;
      var ab=lo.anim[selak].bs[selb];
      ab.q.x=0;ab.q.y=0;ab.q.z=0;delete(ab.q.w);
      //ab.t.x=0;ab.t.y=0;ab.t.z=0;
      updateSelbMs();
      lo.recalc=true;
    } else if (s=='sameNormals') {
      if (selv.length==0) { log('No verts selected.');return; }
      var isnv=false;
      for (var h=selv.length-1;h>=0;h--) if (selv[h].nv) isnv=true;
      for (var h=selv.length-1;h>=0;h--) if (isnv) delete(selv[h].nv); else if (h>0) selv[h].nv=selv[0];
      log(isnv?'Same normals removed.':'Same normals set.');
    } else 
    if (startsWith(s,'load_p')) {
      var i=parseInt(s.substr(6));
      fn=predefined[i][0];
      loadS(predefined[i][1]);
      mfile.ms=fn;
      log('Loaded predefined:'+fn+', triangles:'+lo.fa.length+'.');
    } else if ((s=='trisToMesh')||(s=='trisToMesh2')) {
      var c=0;
      //for (var m=lo.meshes.length-1;m>=0;m--) {
      var touch=(s=='trisToMesh2');
      for (var m=0;m<lo.meshes.length;m++) {
        if (m==lo.selmesh) continue;
        //for (var h=lo.meshes[m].fa.length-1;h>=0;h--) {
        for (var h=0;h<lo.meshes[m].fa.length;h++) {
          var t=lo.meshes[m].fa[h];
          if (touch) {
            if ((selv.indexOf(t.v0)==-1)&&(selv.indexOf(t.v1)==-1)&&(selv.indexOf(t.v2)==-1)) continue;
          } else {
            if (selv.indexOf(t.v0)==-1) continue;
            if (selv.indexOf(t.v1)==-1) continue;
            if (selv.indexOf(t.v2)==-1) continue;
          }
          lo.meshes[m].fa.splice(h,1);h--;
          lo.meshes[lo.selmesh].fa.push(t);
          c++;
        }
      }
      log('Moved '+c+' tris to current mesh.');
      Paint.drawNewtc();
    } else if (s=='Mesh add') {
      var m=lo.meshes[lo.selmesh];
      lo.meshes.push({
        fa:[],
        diff:m.diff,
        norm:m.norm,
        spec:m.spec,
        comb:m.comb
      });
      log('Mesh '+lo.meshes.length+' added.');
    } else if (s=='vertSplitMesh') {
      //alert(564);
      for (var h=0;h<selv.length;h++) {
        var v=selv[h];
        if (v.ts.length<2) continue;
        var t0=v.ts[0],vnH={};
        for (var i=1;i<v.ts.length;i++) {
          var t=v.ts[i];
          if (t.mi==t0.mi) continue;
          var vn=vnH[t.mi];
          if (!vn) {
            //vertadd
            //console.log('vertSplitMesh add vert');
            vn={p0:new Vecmath.Vec4(0,0,0,1),p1:new Vecmath.Vec4(0,0,0,1),ts:[],vis:false,u:v.u,v:v.v,ws:[]};
            for (var j=0;j<v.ws.length;j++) vn.ws.push(v.ws[j]);
            lo.verts.push(vn);
            vnH[t.mi]=vn;
            log('Vert '+lo.verts.length+' added.');
          }
          if (t.v0==v) t.v0=vn;
          else if (t.v1==v) t.v1=vn;
          else if (t.v2==v) t.v2=vn;
          else alert('vertSplitMesh vert not found!!1');
          v.ts.splice(i,1);i--;
          vn.ts.push(t);
          lo.recalc=true;
        }
      }
    //} else if (s=='vertSplitNorm') {
    //  vertSplitNorm();
    } else if (s=='vertSelMultiMesh') {
      selv.splice(0,selv.length);
      for (var h=0;h<lo.verts.length;h++) {
        var v=lo.verts[h];
        if (v.ts.length<2) continue;
        var mi0=v.ts[0].mi;
        for (var i=1;i<v.ts.length;i++) if (v.ts[i].mi!=mi0) {
          selv.push(v);
          break;
        }
      }
    } else if (s=='meshIsolate') {
      for (var mi=lo.meshes.length-1;mi>=0;mi--) {
        if (mi==lo.selmesh) continue;
        while (lo.meshes[mi].fa.length>0) triRemove2(mi,0);
      }
      var bdc=isolateRemove();
      for (var mi=lo.meshes.length-1;mi>=0;mi--) {
        if (mi==lo.selmesh) continue;
        threeEnv.base.remove(lo.meshes[mi].tmesh);
      }
      if (lo.selmesh<lo.meshes.length-1) lo.meshes.splice(lo.selmesh+1,lo.meshes.length-1-lo.selmesh);
      lo.meshes.splice(0,lo.selmesh);
      lo.selmesh=0;
      selb=-1;
      drawNew=true;
      log('Mesh isolated, '+bdc+' bones deleted.');//+lo.meshes.length);
    } else if (s=='vertIsolate') {
      for (var mi=lo.meshes.length-1;mi>=0;mi--) {
        var m=lo.meshes[mi];
        for (var h=m.fa.length-1;h>=0;h--) {
          var t=m.fa[h];
          //if ((t.v0.mark!='split')||(t.v1.mark!='split')||(t.v2.mark!='split')) triRemove2(mi,h);
          if ((!vertMark(t.v0,'split'))||(!vertMark(t.v1,'split'))||(!vertMark(t.v2,'split'))) triRemove2(mi,h);
        }
      }
      isolateRemove();
      for (var mi=lo.meshes.length-1;mi>=0;mi--) 
        if ((lo.meshes[mi].fa.length==0)&&(lo.meshes.length>1)) lo.meshes.splice(mi,1);
      lo.selmesh=0;
      selb=-1;
      //Paint.drawNewtc();
      meshUpdate();
      log('Vert isolate done.');
      //---
    } 
    //drawNew=true;
    //else if ((m==mThreeWires)||(m==mThreePoints)) { meshUpdate(); }
  }
  function meshUpdate() {
    if (paintLoaded) Paint.drawNewtc();
    if (!threeEnv) return;
    
    threeMeshUpdate(lo,-1);
    /*
    for (var mi=lo.meshes.length-1;mi>=0;mi--) {
      var m=lo.meshes[mi];
      threeEnv.base.remove(m.tmesh);
      //if (m.wmesh) threeEnv.base.remove(m.wmesh);
    }
    Pd5.calc(lo,0,0.0,0.0,1,{x:0,y:-1,z:0},0,0,true);
    Pd5.calcNormals(lo,true);//lo.transparent=true;  
    threeCreateMesh(lo,false,0,0,0,1,undefined);//mThreeWires.checked?threeEnv.wireMat:undefined);
    */
    //for (var mi=lo.meshes.length-1;mi>=0;mi--) {
    //  var m=lo.meshes[mi];
    //  m.wmesh=new THREE.Mesh(m.tmesh.geometry,threeEnv.wireMat);
    //  m.wmesh.scale.set(200,200,200);
    //  threeEnv.base.add(m.wmesh);
    //}
    
    
    //if (mThreePoints.checked) {
    //  var ge=new THREE.Geometry();
    //  for (var h=0;h<lo.verts.length;h++) {
    //    //var p=lo.verts[h].p1;
    //    ge.vertices.push(new THREE.Vector3(0,0,0));//(p.x+tr.x)*200,(-p.y+tr.y)*200,(p.z+tr.z)*200));
    //  }
    //  var pa=new THREE.ParticleSystem(ge,threeEnv.partMat);
    //  pa.sortParticles=true;
    //  threeEnv.base.add(pa);
    //  threeEnv.partGe=ge;
    //  threeEnv.partPs=pa;
    //}
    
    drawNew=true;
    //threeRender();
  }
  function mouseCoords(e) {
    var x=e.pageX,y=e.pageY;
    mx=x;my=y;
  }
  function mouseDown(e) {
    //onsole.log('w3dit.mouseDown');
    if (Menu.mouseDown()||Menu.mcontrol) return;
    if (noMouse) return;
    
    //onsole.log('mouseDown');
    //onsole.log(e.target);
    
    if (e.which) moused[e.which]=true;
    mouseCoords(e);
    var x=mx,y=my;
    mouseP.x=x,mouseP.y=y;
    mD=true;
    if (curmenu) {
      curmenu.press=true;
      //onsole.log('before checkAboxDown');
      checkAboxDown(x,y);
      return;
    }
    //selak=-1;
    //sel.style.visibility='hidden';
    if (mroot.open) menuReset();
    canvas.style.cursor='crosshair';
    //mouseP.x=x,mouseP.y=y;
    oaX=aX;oaY=aY;oscale=scale;
    otr.set1(tr);
    //if ((x<200)&&(y<200)) { tryFullscreen();}
    if (moused[1]) {
      //og("looking for point");
    
      searchEditV(x,y);
    }
  }
  function mouseMove(e) {
    if (noMouse) return;
    mouseCoords(e);
    var x=mx,y=my;
    //drawNew=true;
    if (!mD||Menu.press) { Menu.search(x,y); }//return; }
    if (!mD) {
      var cmh=searchMenu(x,y);
      if (curmenu!=cmh) drawNew=true;
      curmenu=cmh;
      canvas.style.cursor=curmenu?'pointer':'default';
      return;
    }
    if (Menu.mcontrol) return;
    
    var dx=x-mouseP.x;//page.x-
    var dy=y-mouseP.y;//page.y-
    drawNew=true;
    if (curmenu) {
      curmenu.press=boxInside(curmenu,x,y);
      checkAboxDown(x,y,dx,dy);
      return;
    }
    if (modalC) return;
    //var dx=e.pageX-mouseP.x;
    //var dy=e.pageY-mouseP.y;
    if (keyA[16]) {//shift
      var f=(dx+dy)*0.01;
      if (f>0) f=1+f; else f=1/(1-f);
      scale=oscale*f;
    //} else if (keyA[18]||moused[2]||(moused[1]&&editv&&!keyA[17])) {//alt
    
    //-----------20241003 fix sothat ribbon doesnt start while translate
    } else if (keyA[18]||moused[2]) {//alt
      translate(dx,dy,moused[1]&&!keyA[18]);
    } else if (moused[1]&&!keyA[17]) {
      if (ribbon) { ribbon.x1=x-cw2;ribbon.y1=y-ch2;drawNew=true; }
    //} else if (keyA[18]||moused[2]||(moused[1]&&!keyA[17])) {//alt
    //  if (ribbon) { ribbon.x1=x-cw2;ribbon.y1=y-ch2;drawNew=true; }
      else translate(dx,dy,moused[1]&&!keyA[18]);
    //-------------------------------------------------------------
    
    } else if (keyA[17]||moused[3]) {
      aY=oaY+dx*0.01;
      aX=oaX+dy*0.01;
      //if (lo.tmesh) { 
      //  threeEnv.base.rotation.y=aY;
      //  threeEnv.base.rotation.x=aX;
      //  threeRender(); 
      //}
    }
    //if (!mousePart) return;
  }
  function mouseScroll(ev) {
    if (Menu.mcontrol) return;
    var up=false;
    if (ev.wheelDelta!=undefined) up=ev.wheelDelta>0;
    else up=ev.detail<0;
    
    //doScale(mx,my,up?1.2:1/1.2);
    scale*=(up?1.2:1/1.2);
    //onsole.log('w3dit.mouseScroll '+scale);
    drawNew=true;
    //if (lo.tmesh) { threeEnv.base.scale.set(scale/200,scale/200,scale/200);threeRender(); }
    //log(scale);
  }
  function mouseUp(e) {
    if (noMouse) return;
    mouseCoords(e);
    var x=mx,y=my;
    mouseP.x=x,mouseP.y=y;
    if (curmenu) {
      if (curmenu==abox) {
        checkSelak();
      } else if (curmenu.press) {
        //menuPressed(curmenu);
      } else curmenu=undefined;
    } 
    if (!curmenu) {
      curmenu=searchMenu(x,y);
      canvas.style.cursor=curmenu?'pointer':'default';
    }
    mD=false;
    if (moused[1]) {
      if (editv) checkEditvUndo();
      editw=undefined;
      ribbonCheckSelect();
    }
    if (e.which) moused[e.which]=false;
    //og('aX='+aX+' aY='+aY+' scale='+scale+' tr='+tr);
    Menu.mouseUp();
    drawNew=true;
  }
  function paintLoad() {
    Paint.log=log;
    Paint.loaded(true);
    Paint.set3d(lo,selv);
    //Paint.loaded(true);
    paintLoaded=true;
    //...
  }
  function physicsBeam1(radius,nocull) {
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
    
    var tris=lo.meshes[lo.selmesh].fa,rtri;
    
    for (var th=tris.length-1;th>=0;th--) {
      tri=tris[th];
      if (!tri.p0) {
        var t=tri;
        t.p0=t.v0.p0;t.p1=t.v2.p0;t.p2=t.v1.p0;
        p1.sub2(t.p0,t.p1);
        p2.sub2(t.p0,t.p2);
        p3.cross(p1,p2);
        var hf=p3.length();
        t.normal=new Vecmath.Vec3();
        t.normal.scale2(1/hf,p3);
        t.normalD=-t.normal.dot(t.p0);
        //console.log(tri);
      }
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
        //if (radius==0) 
        if (1) inside=w3ditInTri(tri.p0.x,tri.p0.y,tri.p1.x,tri.p1.y,tri.p2.x,tri.p2.y,a2.x,a2.y)
                 &&w3ditInTri(tri.p0.x,tri.p0.z,tri.p1.x,tri.p1.z,tri.p2.x,tri.p2.z,a2.x,a2.z)
                 &&w3ditInTri(tri.p0.y,tri.p0.z,tri.p1.y,tri.p1.z,tri.p2.y,tri.p2.z,a2.y,a2.z);
        else
            inside=(o0=physicsInTri(radius,tri.p0.x,tri.p0.y,tri.p1.x,tri.p1.y,tri.p2.x,tri.p2.y,a2.x,a2.y))
                 &&(o1=physicsInTri(radius,tri.p0.x,tri.p0.z,tri.p1.x,tri.p1.z,tri.p2.x,tri.p2.z,a2.x,a2.z))
                 &&(o2=physicsInTri(radius,tri.p0.y,tri.p0.z,tri.p1.y,tri.p1.z,tri.p2.y,tri.p2.z,a2.y,a2.z));
        //var inside=w3ditInTri3(radius,tri.p0,tri.p1,tri.p2,a2);
        //if (dbg&&inside) {
        //  console.log('physicsBeam1');
        //  console.log(tri.p0+' '+tri.p1+' '+tri.p2+' '+a2);
        //  console.log(o0+' '+o1+' '+o2);
        //}
    
        if (inside&&!nocull)
          if (b.dot(tri.normal)<0)
            inside=false;
        //
        if (inside) {
          jCount++;
          tri.beam=true;
          rtri=tri;
          //beamdebug=beamdebug+'#'+th+' j='+Math.floor(j*100)/100+' '+o0+' '+o1+' '+o2;
          if (tri.mark!=2) {
            //if (tri==debugTri) System.out.println("---in  "+shp);
            tri.mark=2;
          }
          if (minj>j) { minj=j;rnormal.set1(tri.normal); }
          break;
        } else {
        }
      } //else if ((tri==debugTri)&&(tri.mark==2)) {
        //tri.mark=3;
        //System.out.println("   out "+shp);
      //}
    }
    
    
    if (jCount>0) {
      //pbj=j;
      if ((j<0)||(j>1)) return false;
      j=minj;
      a.x+=b.x*j;
      a.y+=b.y*j;
      a.z+=b.z*j;
      return rtri;
    } 
    //pbj=-1;
    return false;
  }
  function physicsBeam2(from,to,nocull) {
    //from=eye,to=cam
    var ft=1;
    //a.set3(from[0]/ft,from[2]/ft,-from[1]/ft);pf.set1(a);
    //pt.set3(to[0]/ft,to[2]/ft,-to[1]/ft);
    //b.set3((to[0]-from[0])/ft,(to[2]-from[2])/ft,(-to[1]+from[1])/ft);
    a.set3(from[0]/ft,from[1]/ft,from[2]/ft);pf.set1(a);
    pt.set3(to[0]/ft,to[1]/ft,to[2]/ft);
    b.set3((to[0]-from[0])/ft,(to[1]-from[1])/ft,(to[2]-from[2])/ft);
    var rtri;
    if (rtri=physicsBeam1(0,nocull)) {//5
      //System.err.println("physicsBeam");
      pt2.set1(a);
      to[0]=a.x*ft;to[1]=-a.z*ft;to[2]=a.y*ft;
      return rtri;//true;
      //to[1]+=100;
    }
    return false;
  }
  function physicsCalc(o,fa,time,dtime) {
    var ft=10;
    //if (fc<20) log(fa+' time='+time+' dtime='+dtime);fc++;
    
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
    
    if ((b.x==0)&(b.y==0)&(b.z==0)) return;//continue;
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
  function physicsInTri(r,xp1,yp1,xp2,yp2,xp3,yp3,xp,yp) {
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
        if (Math.abs(x1-x2)<0.0001) return true;//return false;//true;
        yh=y1+(xp-x1)/(x2-x1)*(y2-y1);
        if (yh-r<=yp) lower=true;
        if (yh+r>=yp) higher=true;
      }
    }
    return lower&&higher;
  }
  function physTriAdd(t) {
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
  function playSound(src,vol) {
    //----
    src='wloom08/sound/'+src;
    //if (true) return;
    var f=sounds[src];
    if (f) {
      var h=f();
      src=h.src;
    }
    if (vol==undefined) vol=1;
    //log('playSound '+src);
    //----
    var pool=audioPools[src];
    var a;
    if (!pool) {
      var a=document.createElement('audio');
      //a.src='file:///C:/q/data/sound/'+src+'.wav';
      //a.src='sound/'+src+'.wav';
      a.src=src+'.wav';
      //alert(a.src);
      a.preload=1;//a.volume=0.3;
      pool=[a];//document.getElementById('audio'+src)];
      audioPools[src]=pool;
    }
    for (var h=0;h<pool.length;h++) {
      a=pool[h];
      if (a.paused||a.ended){
        //try { a.currentTime=0; } catch (e) {log(''+e);}
        a.volume=vol;
        a.play();//log('sound0 '+si++);
        a=undefined;
        break;
      }
    }
    //audio.currentTime = 0.0;
    if (a) {
      a=a.cloneNode(true);a.volume=0.3;
      a.volume=vol;
      a.play();//log('sound1 '+si++);
      pool.push(a);
      //log('creating audio' + pool.length);
    }
    
  }
  function pointAdd(x,y,z,u,v) {
    if (u===undefined) u=0.5+Math.random()*0.01;
    if (v===undefined) v=0.5+Math.random()*0.01;
    var v=Pd5.vertNew(x,y,z,u,v);//{p0:new Vecmath.Vec4(x,y,z,1),p1:new Vecmath.Vec4(0,0,0,1),ts:[],vis:false,u:u,v:v};
    lo.verts.push(v);
    return v;
  }
  function quatv(v0,v1,v2,v3,pa) {
    var t;
    t=triToggle(v0,v1,v2);if (pa&&pa.trip) t.p=pa.trip;
    t=triToggle(v1,v3,v2);if (pa&&pa.trip) t.p=pa.trip;
    //...
  }
  function rand(i) {
    return Math.floor(Math.random()*i);
  }
  function replaceUrl(ps) {
    var url=document.URL,ui=url.indexOf('?');
    if (ui!=-1) url=url.substr(0,ui);
    window.history.replaceState('page',document.title,url+(ps.fn?'?load='+ps.fn:
      (ps.script?'?script='+encodeURIComponent(ps.script):'')));//pushState
  }
  function resize(e) {
    var w=window.innerWidth,h=window.innerHeight;
    threeEnv.renderer.setSize(w,h);
    var c=threeEnv.c;
    c.style.left='0px';//(w-c.width-10)+'px';
    c.style.top='0px';//(h-c.height-10)+'px';
    c.style.width=w+'px';
    c.style.height=h+'px';
    var s=h/2;//450
    
    //---threejs bug? setting new cam make spec light operate with false normals
    //---threeEnv.camera=new THREE.OrthographicCamera(-s*(w/h),s*(w/h),s,-s,-10000,10000);
    var ca=threeEnv.camera;ca.left=-s*(w/h);ca.right=s*(w/h);ca.top=s;ca.bottom=-s;
    ca.updateProjectionMatrix();
    
    drawNew=true;
    //threeRender();
    //console.log(w,h);
  }
  function ribbonCheckSelect() {
    //...
    //onsole.log('ribbonCheckSelect 0');
    if (ribbon&&(ribbon.xs!==undefined)) {
      //onsole.log('ribbonCheckSelect 1');
      if (selMode==VERTS) 
      for (var j=lo.verts.length-1;j>=0;j--) {
        var v=lo.verts[j];
        if (singleBone) if (v.bi!=selb) continue;
        if ((v.p1.x<ribbon.xs)||(v.p1.y<ribbon.ys)||(v.p1.x>=ribbon.xs+ribbon.w)||(v.p1.y>=ribbon.ys+ribbon.h)) continue;
        if (selv.indexOf(v)!=-1) continue;
        selv.push(v);
      }
      else if (selMode==WEIGHTS) for (var j=lo.bones.length-1;j>=0;j--) { var ws=lo.bones[j].ws; for (var k=ws.length-1;k>=0;k--) {
        var w=ws[k];
        if (singleBone) if (w.bi!=selb) continue;
        if ((w.p2.x<ribbon.xs)||(w.p2.y<ribbon.ys)||(w.p2.x>=ribbon.xs+ribbon.w)||(w.p2.y>=ribbon.ys+ribbon.h)) continue;
        if (selw.indexOf(w)!=-1) continue;
        selw.push(w);
      }}
      else {
        selbo=[];
        if (lo.bones) for (var j=lo.bones.length-1;j>=0;j--) {
          var b=lo.bones[j],x=b.p0.p2.x,y=b.p0.p2.y;
          if ((x<ribbon.xs)||(y<ribbon.ys)||(x>=ribbon.xs+ribbon.w)||(y>=ribbon.ys+ribbon.h)) continue;
          selbo.push(j);
        }
        //onsole.log(selbo);
      }
      //wasRibbon=true;
      //console.log('was ribbon');
      //console.log(ribbon);
      ribbon=undefined;
      //drawNew=true;
    }
    
    //...
  }
  function save(nolog) {
    var afn='localStorage:'+fn;
    
    var ih=-1;
    for (var i=0;i<sel.options.length;i++) 
      if (sel.options[i].value==afn) {
        ih=i;break;
      }
    var pdc=predefined.length;
    if (ih==-1) {
      sel.options[sel.options.length]=new Option(afn);
      ih=sel.options.length-1;
      localStorage[lsKey+"1c"]=sel.options.length-pdc;
      for (var i=pdc;i<sel.options.length;i++) 
        localStorage[lsKey+"1"+(i-pdc)]=sel.options[i].value.substring(13);
    }
    sel.selectedIndex=ih;
    try {
    localStorage[lsKey+"0"+fn]=serialize();//'pa:[],fa:[]';
    if (!nolog) log('Saved '+afn+'.');
    } catch (e) { log(e); }
    //sel.addOption("uhu");
    
    //for (var i=0;i<mload.sub.length;i++) {
    //  var m=mload.sub[i];
    //  if (!m.lskeyimg) continue;
    //  if (m.ms!=fn) continue;
    //  menuSetIcon(m);
    //  //onsole.log(m);
    //}
    var m=saveGetMenu(fn);
    if (m) menuSetIcon(m);
  }
  function saveGetMenu(fn) {
    for (var i=0;i<mload.sub.length;i++) {
      var m=mload.sub[i];
      if (!m.lskeyimg) continue;
      if (m.ms!=fn) continue;
      return m;
      //menuSetIcon(m);
      //onsole.log(m);
    }
  }
  function scalePoints(f) {
    for (var h=0;h<lo.verts.length;h++) {
      var v=lo.verts[h];
      //og(v.p0);
      v.p0.scale1(f);
    }
    meshUpdate();
  }
  function searchEditV(x,y) {
    //onsole.log('w3dit.searchEditV '+x+' '+y);
    x-=cw2;y-=ch2;
    //console.log('searchEditV '+x+' '+y);
    var mind=500;//Number.MAX_VALUE;
    var oev=editv;
    editv=undefined;
    if (selMode==BONES) {
      if (!lo.bones) return;
      selb=-1;mind*=2;
      for (var j=lo.bones.length-1;j>=0;j--) {
        var b=lo.bones[j];
        var dx=b.p0.p2.x-x,dy=b.p0.p2.y-y,d=dx*dx+dy*dy;
        if (d>=mind) continue;
        //if (selak!=-1) {
        //  var ab=lo.anim[selak].bs[j];
        //  ab.ot=new Vecmath.Vec3(ab.t.x,ab.t.y,ab.t.z);
        //  ab.oq=new Vecmath.Vec3(ab.q.x,ab.q.y,ab.q.z);
        //}
        mind=d;
        selb=j;  
      }
      
      if ((selak!=-1)&&(selb!=-1)) {
        var ab=lo.anim[selak].bs[selb];
        ab.ot=new Vecmath.Vec3(ab.t.x,ab.t.y,ab.t.z);
        ab.oq=new Vecmath.Vec3(ab.q.x,ab.q.y,ab.q.z);
      }
      
      
      //log(""+selb);
      if (selb==-1) 
        ribbon={x0:x,y0:y,x1:x,y1:y};
      else {
        log('Bone "'+lo.bones[selb].name+'" selected.');
        if (selbo.indexOf(selb)==-1) selbo.push(selb);
        menuReset();
        if (selak!=-1) updateSelbMs();
      }
      drawNew=true;
      return;
    }
    if (viewBones) return;
    var e=0.0001,mina=[];
    if (selMode==WEIGHTS) {
      if (!lo.bones) return;
      var oew=editw;editw=undefined;
      for (var j=lo.bones.length-1;j>=0;j--) {
        if (singleBone&&(j!=selb)) continue;
        var ws=lo.bones[j].ws;
        for (var k=ws.length-1;k>=0;k--) {
          var w=ws[k],dx=w.p2.x-x,dy=w.p2.y-y,d=dx*dx+dy*dy;
          if (d>=mind+e) continue;
          if (d<mind-e) {//if (Math.abs(d-mind)<e) 
            mind=d;mina=[];
          }
          mina.push(w);
          //mind=d;
          if (mina.length==1) editw=w;
        } 
      }
      //onsole.log('searchEditV '+mina.length);
      var done=false;
      if ((mina.length>1)&&(selw.length>0)) {
        var wl=selw[selw.length-1];
        var j=mina.indexOf(wl);
        //onsole.log('j='+j);
        if (j!=-1) {
          editw=mina[(j+1)%mina.length];
          //editv.op0=new Vecmath.Vec3(editv.p0.x,editv.p0.y,editv.p0.z);
          selw[selw.length-1]=editw;
          done=true;
        }
      }
      if (editw) editw.op0=new Vecmath.Vec3(editw.p0.x,editw.p0.y,editw.p0.z);
      if (!done) {
      if (editw) {
        //editw.op0=new Vecmath.Vec3(editw.p0.x,editw.p0.y,editw.p0.z);
        //og('editw.op0 set');
        if (oew!=editw) {
          var i=selw.indexOf(editw); 
          if (i!=-1) { 
            if (i!=clickI) { clickI=i;clickCount=0; } else {
              clickCount++; if (clickCount==1) {
                selw.splice(0,selw.length);i=-1; 
              }
            } 
          } else { clickI=-1;clickCount=0; }
          if (i==-1) selw.push(editw);
        }
        //if (selw.length==1) {
          selb=lo.bones.indexOf(editw.b);
        //}
        ribbon=undefined;
      } else {
        selw=[];
        ribbon={x0:x,y0:y,x1:x,y1:y};
      }
      }
      //og('mousedown weights');
      drawNew=true;
    }
    if (selMode==VERTS) {
      if (wasPolygon) selv.splice(0,selv.length);
      var va=lo.verts;//,e=0.0001,mina=[];
      for (var j=va.length-1;j>=0;j--) {
        var v=va[j];
        if (singleBone&&(v.bi!=selb)) continue;
        var dx=v.p1.x-x,dy=v.p1.y-y,d=dx*dx+dy*dy;
        if (d>=mind+e) { continue; }//>=
        if (d<mind-e) {//if (Math.abs(d-mind)<e) 
          mind=d;mina=[];
        }
        mina.push(v);
        //mind=d;
        if (mina.length==1) editv=v;
      }
      var done=false;
      if ((mina.length>1)&&(selv.length>0)) {
        var vl=selv[selv.length-1];
        var j=mina.indexOf(vl);
        //onsole.log('j='+j);
        if (j!=-1) {
          editv=mina[(j+1)%mina.length];
          editv.op0=new Vecmath.Vec3(editv.p0.x,editv.p0.y,editv.p0.z);
          selv[selv.length-1]=editv;
          Paint.drawNewtc();
          done=true;
        }
      }
      if (!done) {
      if (editv) {
        //console.log(editv);
        //onsole.log('mina.length='+mina.length);//+' '+oev);
        editv.op0=new Vecmath.Vec3(editv.p0.x,editv.p0.y,editv.p0.z);
        //og('searchEdit 0');
        if (oev!=editv) { 
          //og('searchEdit 1 oev='+oev+' editv='+editv);
          var i=selv.indexOf(editv); 
          if (i!=-1) {
            if (i!=clickI) { clickI=i;clickCount=0; } else {
              clickCount++; if (clickCount==1) {
                selv.splice(0,selv.length);//selv.splice(i,1);
                i=-1;
              }
            }
          } else { clickI=-1;clickCount=0; }
          //selv.splice(0,0,editv);while (selv.length>4) selv.pop();
          if (i==-1) selv.push(editv);//while (selv.length>4) selv.shift();
          ////log(selv.length+' '+selv);     
          //for (var h=0;h<editv.ts.length;h++) {
          //  var t=editv.ts[h];
          //  t.col={r:100,g:230,b:0};
          //}
          Paint.drawNewtc();
          drawNew=true;
        }
      } else if (selv.length>0) {
        selv.splice(0,selv.length);
        Paint.drawNewtc();
        drawNew=true;
      }}
      if (editv)
        ribbon=undefined;
      else 
        ribbon={x0:x,y0:y,x1:x,y1:y};
    }
    
    wasPolygon=false;
    //wasRibbon=false;
    
    
    //return editv;
  }
  function searchMenu(x,y) {
    for (var h=menus.length-1;h>=0;h--) {
      var m=menus[h];
      if (boxInside(m,x,y)) return m;
    }
    if (lo) if (lo.anim) if (boxInside(abox,x,y)) return abox;
    return undefined;
  }
  function serialize() {
    var rH=dungeonH;
    if (rH) {
      vertDel(rH.p0);
      vertDel(rH.p1);
      vertDel(rH.p2);
      vertDel(rH.p3);
      vertDel(rH.p4);
      vertDel(rH.p5);
      vertDel(rH.p6);
      vertDel(rH.p7);
    }
    
    //---
    var s='{\n';
    var va=lo.verts;
    
    if (lo.bones) {
    
    s+='"bones":[\n';
    for (var h=0;h<lo.bones.length;h++) {
      var b=lo.bones[h];
      var t=b.t,q=b.q;
      s+='{"up":'+(b.up?lo.bones.indexOf(b.up):-1)+(b.name?',"name":"'+b.name+'"':'')+',"t":{"x":'+sfe(t.x)
       +',"y":'+sfe(t.y)+',"z":'+sfe(t.z)+'},"q":{"x":'+sfe(q.x)+',"y":'+sfe(q.y)+',"z":'+sfe(q.z)+'},"ws":[';
      var wa=b.ws;//b[7];
      for (var i=0;i<wa.length;i++) {
        var w=wa[i];
        s+=(i==0?'':',')+'{"x":'+sfe(w.p0.x)+',"y":'+sfe(w.p0.y)+',"z":'+sfe(w.p0.z)+(w.w!=1?',"w":'+sfe(w.w):'')
         +(w.mark!==undefined?',"mark":"'+w.mark+'"':'')+'}';
      }
      s+=']}'+(h<lo.bones.length-1?',':'')+'\n';
    }
    s+='],\n';
    s+='"vertfmt":2,"verts":[';
    for (var h=0;h<lo.verts.length;h++) {
      var v=lo.verts[h];
      s+=(h==0?'':',')+'{"u":'+sfe(v.u)+',"v":'+sfe(v.v)+',"a":[';
      for (var i=0;i<v.ws.length;i++) {
        var w=v.ws[i],wi=-1,bi=-1;
        for (var j=0;j<lo.bones.length;j++) {
          wi=lo.bones[j].ws.indexOf(w);
          if (wi!=-1) { bi=j;break;}
        }
        s+=(i==0?'':',')+bi+','+wi;
      }
      s+=']';
      if (v.nv) {
        var vi=lo.verts.indexOf(v.nv);
        if (vi!=-1) s+=',"nvi":'+vi;
      }
      if (v.mark) s+=',"mark":'+esc(v.mark)+'';
      s+='}';
      //s+=(h==0?'':',')+'['+v.u+','+v.v+',[';
      //for (var i=0;i<v.ws.length;i++) {
      //  var w=v.ws[i],wi=-1,bi=-1;
      //  for (var j=0;j<lo.bones.length;j++) {
      //    wi=lo.bones[j].ws.indexOf(w);
      //    if (wi!=-1) { bi=j;break;}
      //  }
      //  s+=(i==0?'':',')+bi+','+wi;
      //}
      //s+=']';
      //if (v.nv) {
      //  var vi=lo.verts.indexOf(v.nv);
      //  if (vi!=-1) s+=','+vi;
      //}
      //s+=']';
    }
    s+='],\n';
    
    
    } else {
    
    s+='"pa":[';
    for (var h=0;h<va.length;h++) {
      let v=va[h],ps=undefined;
      if (v.nv) {
        ps={nvi:lo.verts.indexOf(v.nv)};
        if (!v.mark) v.mark='';
      }
      s+=(h==0?'':',')+'['+sfe(v.p0.x)+','+sfe(v.p0.y)+','+sfe(v.p0.z)+','+sfe(v.u)+','+sfe(v.v)+((v.mark!==undefined)?','+esc(v.mark)+'':'')
        +(ps?','+esc(ps):'')+']';
    }
    s+='],\n';
    
    }
    
    //s+='fa:[';
    //for (var h=0;h<lo.fa.length;h++) {
    //  var f=lo.fa[h];
    //  s+=(h==0?'':',')+'['+va.indexOf(f.v0)+','+va.indexOf(f.v2)+','+va.indexOf(f.v1)+(f.col?','+f.col.r+','+f.col.g+','+f.col.b:'')+']';
    //}
    //s+='],\n';
    
    //if (lo.meshes) if (lo.meshes.length>1) {
      s+='"meshes":[';
      for (var mei=0;mei<lo.meshes.length;mei++) {
        var m=lo.meshes[mei];
        s+=(mei>0?'"lf":0},':'')+'{"fa":[';
        for (var h=0;h<m.fa.length;h++) {
          var f=m.fa[h];
          s+=(h==0?'':',')+'['+va.indexOf(f.v0)+','+va.indexOf(f.v2)+','+va.indexOf(f.v1)
            +(f.p?','+JSON.stringify(f.p):(f.col?','+f.col.r+','+f.col.g+','+f.col.b:''))
            +']';
        }
        s+='],\n';
        var pages=window.Paint?Paint.getPages():undefined;
        var isdatai=false,savetex=false;
        if (lo.selmesh==mei) {
          if (m.diff) isdatai=startsWith(m.diff,'data:image/');
          if (!isdatai) {
            var change=false;
            if (pages) for (var h=pages.length-1;h>=0;h--) if (pages[h].change) change=true;
            if (change) if (confirm('Save textures changes? Textures are references now and will be data then.')) {
              //alert(32);
              isdatai=true;
              savetex=true;
            }
          }
        }
        //alert('serialize isdatai='+isdatai);
        //onsole.log('serialize mfile.ms='+mfile.ms);
        if ((m.comb||m.diff||m.spec||m.norm)&&!isdatai) {
          console.log('serialize 0');
          if (m.comb) s+='"comb":"'+m.comb+'",\n';
          if (m.diff) s+='"diff":"'+m.diff+'",\n';
          if (m.spec) s+='"spec":"'+m.spec+'",\n';
          if (m.norm) s+='"norm":"'+m.norm+'",\n';
        } else if (lo.id) {
          console.log('serialize 1');
          //var pages=Paint.getPages();
          //alert('serialize '+pages+' '+(pages?pages.length:''));
          var c;
          var c=document.createElement('canvas');
          var id=lo.id;
          c.width=id.width;c.height=id.height;
          var ct=c.getContext('2d'),dh,ifmt=(mfile.ms&&mfile.ms.endsWith('Jpg.txt'))?'image/jpeg':'image/png';
          if (pages) if (pages.length==3) {
            //c=Paint.saveCanvas();
            //s+='dns:"'+c.toDataURL('image/png')+'",\n';
            ct.putImageData(pages[0].id,0,0);s+='"diff":"'+(dh=c.toDataURL(ifmt))+'",\n';if (savetex) m.diff=dh;
            ct.putImageData(pages[1].id,0,0);s+='"norm":"'+(dh=c.toDataURL(ifmt))+'",\n';if (savetex) m.norm=dh;
            ct.putImageData(pages[2].id,0,0);s+='"spec":"'+(dh=c.toDataURL(ifmt))+'",\n';if (savetex) m.spec=dh;
            c=undefined;
          } 
          if (c) {
            ct.putImageData(Paint.getId(),0,0);s+='"diff":"'+(dh=c.toDataURL(ifmt))+'",\n';
            //window.open(dh,'serialize');
          }
        }
      }
      s+='"lf":0}],\n';
    //}
    
    if (lo.anims) {
    s+='"anims":[\n';
    for (var j=0;j<lo.anims.length;j++) {
      var ao=lo.anims[j];
    //  s+='{"name":"'+ao.name+'","a":[\n';
    //  for (var h=0;h<ao.a.length;h++) {
    //    var ak=ao.a[h];
    //    s+='{"t":'+sfe(ak.t)+(ak.mark?',"mark":'+esc(ak.mark)+'':'')+(ak.text?',"text":'+esc(ak.text)+'':'')+',"bs":[';
    //    var bs=ak.bs;
    //    for (var i=0;i<bs.length;i++) {
    //      var ab=bs[i];
    //      var t=ab.t,q=ab.q;
    //      s+='{"t":{"x":'+sfe(t.x)+',"y":'+sfe(t.y)+',"z":'+sfe(t.z)
    //       +'},"q":{"x":'+sfe(q.x)+',"y":'+sfe(q.y)+',"z":'+sfe(q.z)+'}}'
    //       +(i<bs.length-1?',':'');
    //    }
    //    s+=']}'+(h<ao.a.length-1?',':'')+'\n';
    //  }
    //  s+=']}';
      s+=animSerialize(ao)+(j<lo.anims.length-1?',':'')+'\n';
    }
    s+='],\n';
    }
    if (grid!=0) s+='"grid":'+grid+',\n';
    s+='"tr":{"x":'+sfe(tr.x)+',"y":'+sfe(tr.y)+',"z":'+sfe(tr.z)+'},\n';
    s+='"scale":'+sfe(scale)+',\n';
    
    var ka=addParams.concat(['selAnim']);//['selAnim','rotofs','w3ditLoadAlso'];
    for (var h=0;h<ka.length;h++) {
      var k=ka[h],v=lo[k];
      if (v===undefined) continue;
      s+='"'+k+'":'+JSON.stringify(v)+',\n';
    }
    s+='"lf":0\n}';
    //if (lo.selAnim!==undefined) s+='selAnim:'+lo.selAnim+',\n';
    
    //var isdatai=false;
    //if (lo.diff) isdatai=startsWith(lo.diff,'data:image/');
    //if ((lo.comb||lo.diff||lo.spec||lo.norm)&&!isdatai) {
    //  if (lo.comb) s+='comb:"'+lo.comb+'",\n';
    //  if (lo.diff) s+='diff:"'+lo.diff+'",\n';
    //  if (lo.spec) s+='spec:"'+lo.spec+'",\n';
    //  if (lo.norm) s+='norm:"'+lo.norm+'",\n';
    //} else if (lo.id) {
    //  var pages=Paint.getPages();
    //  //alert('serialize '+pages+' '+(pages?pages.length:''));
    //  var c;
    //  var c=document.createElement('canvas');
    //  var id=lo.id;
    //  c.width=id.width;c.height=id.height;
    //  var ct=c.getContext('2d');
    //  if (pages) if (pages.length==3) {
    //    //c=Paint.saveCanvas();
    //    //s+='dns:"'+c.toDataURL('image/png')+'",\n';
    //    ct.putImageData(pages[0].id,0,0);s+='diff:"'+c.toDataURL('image/png')+'",\n';
    //    ct.putImageData(pages[1].id,0,0);s+='norm:"'+c.toDataURL('image/png')+'",\n';
    //    ct.putImageData(pages[2].id,0,0);s+='spec:"'+c.toDataURL('image/png')+'",\n';
    //    c=undefined;
    //  } 
    //  if (c) {
    //    ct.putImageData(id,0,0);
    //    s+='diff:"'+c.toDataURL('image/png')+'",\n';
    //  }
    //}
    
    return s;
  }
  function sfe(f) {
    //if (f===undefined) return f;
    return strf(f,10000);
  }
  function stacktrace() {
    function st2(f) {
      return !f ? [] : 
          st2(f.caller).concat([f.toString().split('(')[0].substring(9) + '(' + Array.prototype.slice.call(f.arguments).join("\r\n") + ')']);
    }
    return st2(arguments.callee.caller);
  }
  function startsWith(s,s0) {
    if (s.length<s0.length) return false;
    if (s.substring(0,s0.length)==s0) return true;
    return false;
  }
  function strf(f,m) {
    return Math.floor(f*m+0.5)/m;
  }
  function swtext(ct,s,x,y) {
    ct.fillStyle='#000';
    ct.fillText(s,x+1,y+1);
    //ct.fillText(s,x-1,y-1);
    ct.fillStyle='#999';
    ct.fillText(s,x,y);
  }
  function texQuad(ctx,ax,ay,bx,by,cx,cy,dx,dy) {
    texTri(ctx,ax,ay,bx,by,dx,dy,true);
    texTri(ctx,cx,cy,dx,dy,bx,by,false);
  }
  function texTri(ctx,id,ax,ay,bx,by,cx,cy,up,v0,v1,v2) {
    //var id=tid;
    var x0=Math.min(ax,Math.min(bx,cx));
    var y0=Math.min(ay,Math.min(by,cy));
    var x1=Math.max(ax,Math.max(bx,cx));
    var y1=Math.max(ay,Math.max(by,cy));
    //ctx.strokeRect(x0,y0,x1-x0,y1-y0);
    
    //barycentric ztechnique
    ctx.fillStyle='#ff0000';
    var v0x=cx-ax;var v0y=cy-ay;
    var v1x=bx-ax;var v1y=by-ay;
    var d00=v0x*v0x+v0y*v0y;
    var d01=v0x*v1x+v0y*v1y;
    var d11=v1x*v1x+v1y*v1y;
    var invDenom=1/(d00*d11-d01*d01);
    
    var u10=v1.u-v0.u,v10=v1.v-v0.v;
    var u20=v2.u-v0.u,v20=v2.v-v0.v;
    for (var py=y0;py<=y1;py++) for (var px=x0;px<x1;px++) {
      var v2x=px-ax;var v2y=py-ay;
      var d02=v0x*v2x+v0y*v2y;
      var d12=v1x*v2x+v1y*v2y;
      var v=(d11*d02-d01*d12)*invDenom;
      var u=(d00*d12-d01*d02)*invDenom;
      if ((u<0)||(v<0)||(u+v>1)) continue;
      
      //v=1-v;u=1-u;
      //u=1-u;
      //v=1-v;
      
      //if (!up) { u=1-u;v=1-v; }
    
      var u2=v0.u+u*u10+v*u20;
      var v2=v0.v+u*v10+v*v20;
      while (v2<0) v2+=1;
      while (u2<0) u2+=1;
    
          
      var ix=Math.floor(u2*id.width)%id.width;
      var iy=Math.floor(v2*id.height)%id.height;
      var i=(iy*id.width+ix)*4;
      var r=id.data[i];
      if (r===undefined) continue;
      ctx.fillStyle='rgba('+r+','+id.data[i+1]+','+id.data[i+2]+','+(id.data[i+3]/255)
      +')'; 
      //ctx.fillStyle='rgb('+Math.floor(u*200)+','+Math.floor(v*200)+',0)'; 
      ctx.fillRect(px,py,1,1);
    }
    
  }
  function tilt(x,y) {
    //log("Tilt: "+Math.floor(x)+' '+Math.floor(y));
    //for (var i=parts.length-1;i>=0;i--) {
    //  var p=parts[i];
    //  p.xa=y/180;
    //  p.ya=x/180;
    //}
  }
  function toObj() {
    Pd5.calcNormals(lo);
    var verts=lo.verts;
    var s='o Artefakt\n',vs='',ns='';
    for (var h=0;h<verts.length;h++) {
      var v=verts[h];
      vs+='v '+sfe(v.p1.x)+' '+sfe(-v.p1.y)+' '+sfe(v.p1.z)+'\n';
      ns+='vn '+sfe(v.nx)+' '+sfe(v.ny)+' '+sfe(v.nz)+'\n';
    }
    s+=vs+ns+'g Gruppe\n';
    for (var i=0;i<lo.meshes.length;i++) {
      var m=lo.meshes[i];
      for (var h=0;h<m.fa.length;h++) {
        var f=m.fa[h];
        var i0=1+verts.indexOf(f.v0),i2=1+verts.indexOf(f.v1),i1=1+verts.indexOf(f.v2);
        s+='f '+i0+'//'+i0+' '+i1+'//'+i1+' '+i2+'//'+i2+'\n';
      }
    }
    
    return s;
  }
  function toThree() {
    if (!lo) return undefined;
    Pd5.calcNormals(lo);
    var s='{\n';
    s+='"metadata":{"formatVersion":3},\n';
    s+='"scale":10.00,\n';
    s+='"materials":[{\n';
    s+=' "DbgColor":15658734,\n';
    s+=' "DbgIndex":0,\n';
    s+=' "DbgName":"default",\n';
    s+=' "vertexColors":false\n';
    s+='}],\n';
    //s+='"vertices":[0,0,200,0,0,0,-200,0,0],\n';
    s+='"vertices":[';
    var verts=lo.verts;
    var uvs='',nors='';
    for (var h=0;h<verts.length;h++) {
      var v=verts[h];
      s+=(h==0?'':',')+sfe(v.p0.x)+','+sfe(v.p0.y)+','+sfe(v.p0.z);
      uvs+=(h==0?'':',')+sfe(v.u)+','+sfe(1-v.v);
      nors+=(h==0?'':',')+sfe(v.nx)+','+sfe(v.ny)+','+sfe(v.nz);
    }
    s+='],\n';
    s+='"morphTargets":[],\n';
    s+='"normals":['+nors+'],\n';
    s+='"colors":[],\n';
    s+='"uvs":[['+uvs+']],\n';
    //s+='"faces":[42,0,1,2,0,0,1,2,0,0,0]\n';
    s+='"faces":[';
    for (var h=0;h<lo.fa.length;h++) {
      var f=lo.fa[h];
      var i3=verts.indexOf(f.v0)+','+verts.indexOf(f.v1)+','+verts.indexOf(f.v2);
      s+=(h==0?'':',')+'42,'+i3+',0,'+i3+','+i3;
    }
    s+=']\n';
    s+='}\n';
    return s;
  }
  function touchEnd(e) {
    //var sh='';
    //var tp={};
    //og('touchEnd '+curmenu);
    if (!Menu.touchEnd()) {
    
    for (var h=0;h<e.touches.length;h++) {
      var t=e.touches[h];
      ////sh+=' '+t.identifier;
      //tp[t.identifier]=tparts[t.identifier];
    }
    if (e.touches.length==0) {
      touchMode=TM_POINT;
      if (curmenu) {
        if (curmenu==abox) checkSelak();
        else  if (curmenu.press) {
          //menuPressed(curmenu);
        }
        curmenu=undefined;
      }
      if (editv) checkEditvUndo();
      ribbonCheckSelect();
    }
    }
    //tparts=tp;
    //log('touchend '+sh);
    if (!modalC&&!Menu.mcontrol) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
    drawNew=true;
  }
  function touchMove(e) {
    //og('touchmove '+e.touches.length);
    var l=e.touches.length;
    var sdx=0,sdy=0;
    if (curmenu) curmenu.press=false;
    for (var h=0;h<l;h++) {
      var t=e.touches[h];
      if (Menu.press) {
        Menu.search(t.pageX,t.pageY);
        break;
      }
    
      //var c=tparts[t.identifier];
      //if (!c) continue;
      //c.xt=t.pageX;c.yt=t.pageY;
      var to=touches[t.identifier];
      to.dx=t.pageX-to.ox;sdx+=to.dx;
      to.dy=t.pageY-to.oy;sdy+=to.dy;
      
      if (curmenu) {
        if (boxInside(curmenu,t.pageX,t.pageY)) curmenu.press=true;
        checkAboxDown(t.pageX,t.pageY,to.dx,to.dy);
        continue;
      }
      if (modalC) continue;
      //var to=touches[t.identifier];
      //to.dx=dx;sdx+=dx;
      //to.dy=dy;sdy+=dy;
      if (touchMode==TM_POINT||(touchMode==TM_TRANSL&&h==2)) {//(!touchScaling) { //if (l==1) 
        sdx/=l;sdy/=l;
        if (ribbon&&(h==0)) { ribbon.x1=t.pageX-cw2;ribbon.y1=t.pageY-ch2; }
        else
        translate(sdx,sdy,touchMode==TM_POINT);
        drawNew=true;
        //aY=oaY+to.dx*0.004;
        //aX=oaX+to.dy*0.004;
      } else if (l==2&&h==1&&(touchMode==TM_ROT||touchMode==TM_SCALE)) {
        var to0=touches[e.touches[0].identifier];
            
        var dx0=to0.ox-to.ox,dy0=to0.oy-to.oy;
        var l0=Math.sqrt(dx0*dx0+dy0*dy0);
        var dx1=to0.ox+to0.dx-to.ox-to.dx,dy1=to0.oy+to0.dy-to.oy-to.dy;
        var l1=Math.sqrt(dx1*dx1+dy1*dy1);
        
        //var th=100;//treshhold for scaling
        //if (touchMode==TM_ROT&&Math.abs(l1-l0)>th) { 
        //  if (Math.abs(aY-oaY)+Math.abs(aX-oaX)<PI/4) { aY=oaY;aX=oaX; }//small rotations are turned back
        //  touchMode=TM_SCALE; 
        //}
        
        //if (touchMode==TM_SCALE) 
        {
          var dh=l1-l0;
          //if (dh>th) dh-=th; else if (dh<-th) dh+=th; else dh=0;
          var f=dh*0.005;
          if (f>0) f=1+f; else f=1/(1-f);
          scale=oscale*f;
        //} else {
          ////var dx=(to.dx+to0.dx)/2,dy=(to.dy+to0.dy)/2;
          var dx=sdx/2,dy=sdy/2;
          aY=oaY+to.dx*0.01;//0.004;
          aX=oaX+to.dy*0.01;//0.004;
        }
        drawNew=true;
      }
    }
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  function touchStart(e) {
    //var sh='';
    //onsole.log('w3dit.touchStart');
    //console.log(e);
    noMouse=true;
    //drawNew=true;//og('touchStart '+curmenu);
    if (curmenu) return;
    oaX=aX;oaY=aY;oscale=scale;
    var x,y,isMenu=false;
    for (var h=0;h<e.touches.length;h++) {
      var t=e.touches[h];
      x=t.pageX,y=t.pageY;
      //if ((x<200)&&(y<200)) {    tryFullscreen();    return;  }
      curmenu=searchMenu(x,y);
      touches[t.identifier]={ox:x,oy:y};
      if (h==0) isMenu=Menu.touchStart(x,y);
      if (curmenu) { curmenu.press=true;checkAboxDown(x,y);return; } else if (mroot.open) menuReset();
      //touches[t.identifier]={ox:x,oy:y};
      ////sh+=' '+t.identifier+'-'+c;
      //if (c) { c.xt=t.pageX;c.yt=t.pageY; }
      //tparts[t.identifier]=c;//h
    }
    if ((!isMenu)
      &&((e.target===canvas)||(e.target===threeEnv.c))) {//pl180508 so that touching input doesnt invoke searchEditV
    var l=e.touches.length;
    if (l==1) { touchMode=TM_POINT;searchEditV(x,y); }//drawNew=true; }
    else if (l==2) touchMode=TM_ROT;//touchScaling=e.touches.length==2;
    else if (l==3) { touchMode=TM_TRANSL;otr.set1(tr); }
    }
    //log('touchstart '+sh);
    if (!modalC&&!Menu.mcontrol) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
  }
  function translate(dx,dy,isPoint) {
    //og('translate '+dx+' '+dy);
    if (isPoint&&(selMode==BONES)&&(selak!=-1)&&(selb!=-1)) {
      var ab=lo.anim[selak].bs[selb];
      //console.log('translate '+ab.oq.x+' '+dx+' '+dy);
      var f=(dx/cw+dy/ch)*2;
      //onsole.log('translate '+f);
      var v;
    switch (mselbi) {
      case 0:ab.q.x=Math.min(1,Math.max(-1,ab.oq.x+f));delete(ab.q.w);break;
      case 1:ab.q.y=Math.min(1,Math.max(-1,ab.oq.y+f));delete(ab.q.w);break;
      case 2:ab.q.z=Math.min(1,Math.max(-1,ab.oq.z+f));delete(ab.q.w);break;
      case 3:akTranslate(ab,f,0);break;//v=ab.ot.x+f*500/scale;if (grid!=0) v=Math.floor(v/grid+0.5)*grid;ab.t.x=v;break;
      case 4:akTranslate(ab,f,1);break;//v=ab.ot.y+f*500/scale;if (grid!=0) v=Math.floor(v/grid+0.5)*grid;ab.t.y=v;break;
      case 5:akTranslate(ab,f,2);break;//v=ab.ot.z+f*500/scale;if (grid!=0) v=Math.floor(v/grid+0.5)*grid;ab.t.z=v;break;
    }
      if ((makall.checked)&&(mselbi<=2)) {
        for (var h=lo.anims.length-1;h>=0;h--) {
          var anim=lo.anims[h].a;
          for (var i=anim.length-1;i>=0;i--) {
            var ab0=anim[i].bs[selb];
            ab0.q.x=ab.q.x;ab0.q.y=ab.q.y;ab0.q.z=ab.q.z;delete(ab0.q.w);
          }
        }
      }
    
      //mselb[0].ms=Math.random();
      updateSelbMs();
      lo.recalc=true;
      drawNew=true;
      return;
    }
    
    m4.scale3(1/scale,1/scale,1/scale);
    m0.rotY(-aY);
    m4.mul2(m4,m0);
    m0.rotX(-aX);
    m4.mul2(m4,m0);
    
    v40.set4(dx,-dy,0,1);
    m4.transform1(v40);
    
    
    if (isPoint) {
      //if (!lo.bones) return;
      
      if (selMode==WEIGHTS) {
        //og('translate');
        if (!editw) return;
        var op0=editw.op0,p0=editw.p0;
        var x=op0.x+v40.x;
        var y=op0.y+v40.y;
        var z=op0.z+v40.z;  
        if (grid!=0) {
          x=Math.floor(x/grid+0.5)*grid;
          y=Math.floor(y/grid+0.5)*grid;
          z=Math.floor(z/grid+0.5)*grid;
        }
        var dx=x-p0.x,dy=y-p0.y,dz=z-p0.z;
        p0.set3(x,y,z);
        for (var h=selw.length-1;h>=0;h--) {
          var w=selw[h];
          if (w==editw) continue;
          p0=w.p0;
          p0.set3(p0.x+dx,p0.y+dy,p0.z+dz);
        }
        //console.log(editw.op0,editw.p0,x,y,z,grid);
        lo.recalc=true;
        return;
      }
      
      if (!editv||lo.bones) return;
      //editv.p0.add2(editv.op0,v40);
      //var grid=30;
      //editv.p0.x=editv.op0.x+v40.x;
      //editv.p0.y=editv.op0.y+v40.y;
      //editv.p0.z=editv.op0.z+v40.z;  
      var x=editv.op0.x+v40.x;
      var y=editv.op0.y+v40.y;
      var z=editv.op0.z+v40.z;  
      if (grid!=0) {
        x=Math.floor(x/grid+0.5)*grid;
        y=Math.floor(y/grid+0.5)*grid;
        z=Math.floor(z/grid+0.5)*grid;
      }
      var p0=editv.p0,dx=x-p0.x,dy=y-p0.y,dz=z-p0.z;
      p0.set3(x,y,z);//editv.
      for (var h=selv.length-1;h>=0;h--) {
        var v=selv[h];
        if (v==editv) continue;
        p0=v.p0;
        p0.set3(p0.x+dx,p0.y+dy,p0.z+dz);
      }
      //log(''+editv.p0);
    
    } else {
      //onsole.log('translate0 tr='+tr);
      tr.add2(otr,v40);
      //onsole.log('translate1 tr='+tr);
      //hreeCheckView();
      //if (lo.tmesh) {
      //  lo.tmesh.position.x=tr.x*200;
      //  lo.tmesh.position.y=tr.y*200;
      //  lo.tmesh.position.z=tr.z*200;
      //  threeRender();
      //}
      //tr.x=otr.x+v40.x;
      //tr.y=otr.y+v40.y;
      //tr.z=otr.z+v40.z;
    }
    drawNew=true;
  }
  function triRemove(ti,nolog) {
    //var t=lo.meshes[lo.selmesh].fa[ti];
    //  var i;
    //  i=t.v0.ts.indexOf(t);t.v0.ts.splice(i,1);
    //  i=t.v1.ts.indexOf(t);t.v1.ts.splice(i,1);
    //  i=t.v2.ts.indexOf(t);t.v2.ts.splice(i,1);
    //  lo.meshes[lo.selmesh].fa.splice(ti,1);
    triRemove2(lo.selmesh,ti);
      //if (addUndo) 
    if (!nolog) log('Triangle removed len='+lo.meshes[lo.selmesh].fa.length+' i='+ti+'.');
  }
  function triRemove2(mi,ti) {
    var t=lo.meshes[mi].fa[ti];
      var i;
      i=t.v0.ts.indexOf(t);t.v0.ts.splice(i,1);
      i=t.v1.ts.indexOf(t);t.v1.ts.splice(i,1);
      i=t.v2.ts.indexOf(t);t.v2.ts.splice(i,1);
      lo.meshes[mi].fa.splice(ti,1);
    
  }
  function triToggle(v0,v1,v2,skiplog) {
    //var va=[v0,v1,v2];
    var fi=lo.meshes[lo.selmesh].fa;
    var ti=-1;
    for (var h=fi.length-1;h>=0;h--) {
      var f=fi[h];
      if ((f.v0==v0&&f.v1==v1&&f.v2==v2)||(f.v0==v1&&f.v1==v2&&f.v2==v0)||(f.v0==v2&&f.v1==v0&&f.v2==v1)) {
        ti=h;break;
      }
    }
    var t;
    if (ti!=-1) 
      triRemove(ti);
    else {
      //var t;
      fi.push(t=Pd5.triNew(v0,v1,v2,col));
      //fi.push(t={v0:v0,v1:v1,v2:v2,vis:false,col:col});
      //v0.ts.push(t);
      //v1.ts.push(t);
      //v2.ts.push(t);
      //if (addUndo) 
      if (!skiplog) log('Triangle added '+fi.length+'.');
    }
    //if (addUndo) undo.push(['t',v0,v1,v2]);
    return t;
  }
  function tryFullscreen() {
    
    //var docElm = document.getElementById('canvas');
    //var ret;
    var c=document.body;
    var r;
    if (c.requestFullscreen) r=c.requestFullscreen();
    else if (c.mozRequestFullScreen) r=c.mozRequestFullScreen();
    else if (c.webkitRequestFullScreen) r=c.webkitRequestFullScreen();
    log('Trying fullscreen.');
    
  }
  function unmodal() {
    //Paint.stacktrace();
    if (!modalC) return;
    modalC.style.visibility='hidden';
    modalC=undefined;
    modalM=undefined;
  }
  function updateMundo(fromMenu) {
    mundo.ms=undo.length;
    if (mroots.indexOf(mundo)==-1) {
      mroots.push(mundo);
      if (!fromMenu) {
        var m2=Menu.getMenus();
        //lert(m2.indexOf(mundo));
        m2.push(mundo);
        Menu.setMenus(m2);
      }
    }
    //alert(m2);
    if (!fromMenu) Menu.draw();
  }
  function updateSelbMs() {
    if (selb==-1) return;
    var ab=lo.anim[selak].bs[selb];
    Menu.ms(mselb[0],strf(ab.q.x,100));
    Menu.ms(mselb[1],strf(ab.q.y,100));
    Menu.ms(mselb[2],strf(ab.q.z,100));
    Menu.ms(mselb[3],strf(ab.t.x,100));
    Menu.ms(mselb[4],strf(ab.t.y,100));
    Menu.ms(mselb[5],strf(ab.t.z,100));
  }
  function vertDel(v) {
    //onsole.log('vertDel');
    for (var h=v.ts.length-1;h>=0;h--) {
      var t=v.ts[h];
      triRemove2(t.mi,lo.meshes[t.mi].fa.indexOf(t));
    }
    
    if (editv==v) editv=undefined;
    var i=selv.indexOf(v);if (i!=-1) selv.splice(i,1);
    var va=lo.verts;
    i=va.indexOf(v);va.splice(i,1);
    for (var h=lo.verts.length-1;h>=0;h--) if (lo.verts[h].nv==v) delete(lo.verts[h].nv);
  }
  function vertMark(v,s) {
    if (!v.mark) return false;
    return v.mark.indexOf(s)!=-1;
  }
  function vertSplitNorm() {
    Pd5.calcNormals(lo,1);
    for (var h=0;h<selv.length;h++) {
      var v=selv[h];
      //console.log(v.ts.length);
      if (v.ts.length<2) continue;
      var ta=[];//array of (arrays of tris which have same normals)
      for (var i=0;i<v.ts.length;i++) {
        var t=v.ts[i];
        //onsole.log(t.nx+' '+t.ny+' '+t.nz);break;
        if (!t.normnorm) {
          var nl=Math.sqrt(t.nx*t.nx+t.ny*t.ny+t.nz*t.nz);
          //console.log(t.v0);
          t.nx/=nl;t.ny/=nl;t.nz/=nl;
          t.normnorm=1;
        }
        var done=false;
        for (var j=0;j<ta.length;j++) {
          var th=ta[j][0];
          var dx=t.nx-th.nx,dy=t.ny-th.ny,dz=t.nz-th.nz,d=dx*dx+dy*dy+dz*dz;
          //onsole.log(d);
          if (d<0.05) 
          { ta[j].push(t);done=true;break; }
        }
        if (done) continue;
        ta.push([t]);
      }
      //console.log(ta.length);
      for (var i=1;i<ta.length;i++) {
        var vn=pointAdd(v.p0.x,v.p0.y,v.p0.z,v.u,v.v);
        if (v.ws) vn.ws=v.ws.concat([]);
        for (var j=0;j<ta[i].length;j++) {
          var t=ta[i][j];
          if (t.v0==v) t.v0=vn;
          else if (t.v1==v) t.v1=vn;
          else if (t.v2==v) t.v2=vn;
          var ti=v.ts.indexOf(t);v.ts.splice(ti,1);vn.ts.push(t);
          //---
        }
      }
      if (ta.length>1) log('Split vert into '+ta.length+'.');
    }
    //meshUpdate();
  }
  function w3ditInTri(x0,y0,x1,y1,x2,y2,xp,yp) {
    //return false;
    /*
    var p0={x:x0,y:y0},p1={x:x1,y:y1},p2={x:x2,y:y2},p={x:xp,y:yp};
    
    var A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
        var sign = A < 0 ? -1 : 1;
        var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
        var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
        
        return s >= 0 && t >= 0 && (s + t) <= 2 * A * sign;
    */
    
    //http://stackoverflow.com/questions/2049582/how-to-determine-a-point-in-a-2d-triangle
    var A=1/2*(-y1*x2+y0*(-x1+x2)+x0*(y1-y2)+x1*y2);
    var sign=A<0?-1:1;
    var s=(y0*x2-x0*y2+(y2-y0)*xp+(x0-x2)*yp)*sign;
    var t=(x0*y1-y0*x1+(y0-y1)*xp+(x1-x0)*yp)*sign;
    //console.log(s+' '+t);
    return s>=0&&t>=0&&(s+t)<=2*A*sign;
    
  }
  function w3ditInTri3(tp0,tp1,tp2,p) {
    return (w3ditInTri(tp0.x,tp0.y,tp1.x,tp1.y,tp2.x,tp2.y,p.x,p.y))
         &&(w3ditInTri(tp0.x,tp0.z,tp1.x,tp1.z,tp2.x,tp2.z,p.x,p.z))
         &&(w3ditInTri(tp0.y,tp0.z,tp1.y,tp1.z,tp2.y,tp2.z,p.y,p.z));
  }
  function w3ditRemoveInTri(p0,p1,p2) {
    var tris=lo.meshes[lo.selmesh].fa;
    for (var th=tris.length-1;th>=0;th--) {
      t=tris[th];
      if (w3ditInTri3(p0,p1,p2,t.v0.p0)
        &&w3ditInTri3(p0,p1,p2,t.v1.p0)
        &&w3ditInTri3(p0,p1,p2,t.v2.p0)) triRemove(th);
    }
  }
  function w3ditSplitTrisLineIntersect(p0,p1) {
    //console.log('stli 0');
    var tris=lo.meshes[lo.selmesh].fa,r,ph={},sf=100000,rm,v0,v1;
    //for (var u=0;u<2;u++)
    for (var th=tris.length-1;th>=0;th--) {
      t=tris[th];rm=0;
      //v0=t.v0;v1=t.v1;
      r=Vecmath.lineDist([p0,p1,t.v0.p0,t.v1.p0]);
      var tu=0.5,tv=0.5;
      if (r.d<0.00000001) { rm=1;tu=t.v0.u*(1-r.v)+t.v1.u*(r.v);tv=t.v0.v*(1-r.v)+t.v1.v*(r.v); }//console.log('stli0 '+th+' u:'+r.u+' v:'+r.v);
      else {
      v0=t.v1;v1=t.v2;r=Vecmath.lineDist([p0,p1,t.v1.p0,t.v2.p0]);
      if (r.d<0.00000001) { rm=2;tu=t.v1.u*(1-r.v)+t.v2.u*(r.v);tv=t.v1.v*(1-r.v)+t.v2.v*(r.v); }//console.log('stli1 '+th+' u:'+r.u+' v:'+r.v);
      else {
      v0=t.v2;v1=t.v0;r=Vecmath.lineDist([p0,p1,t.v2.p0,t.v0.p0]);
      if (r.d<0.00000001) { rm=3;tu=t.v2.u*(1-r.v)+t.v0.u*(r.v);tv=t.v2.v*(1-r.v)+t.v0.v*(r.v); }//console.log('stli2 '+th+' u:'+r.u+' v:'+r.v);
      }}
      if (!rm) continue;
      //onsole.log('stli doubling '+th+' '+v0.u+'_'+v0.v+' '+v1.u+'_'+v1.v+' -> '+tu+'_'+tv);
      triRemove(th);
      var p=r.pa;
      var k=strf(p.x,sf)+'_'+strf(p.y,sf)+'_'+strf(p.z,sf);
      var v=ph[k],tn;
      if (!v) { v=pointAdd(p.x,p.y,p.z,tu,tv);ph[k]=v; }
      if (rm==1)      { triToggle(v,t.v2,t.v0).p=t.p;triToggle(v,t.v1,t.v2).p=t.p; }
      else if (rm==2) { triToggle(v,t.v2,t.v0).p=t.p;triToggle(v,t.v0,t.v1).p=t.p; }
      else if (rm==3) { triToggle(v,t.v0,t.v1).p=t.p;triToggle(v,t.v1,t.v2).p=t.p; }
    }
    //console.log('stli 1');
    
  }
  function weightDel(w) {
    //onsole.log('weightDel');
    for (var i=lo.verts.length-1;i>=0;i--) {
      var v=lo.verts[i];
      if (v.ws.indexOf(w)!=-1) vertDel(v);
    }
    //w.b.ws=
    w.b.ws.splice(w.b.ws.indexOf(w),1);
  }
  //-----from script beam4
  function quat(p0,p1,p2,p3,pa) {
    var ux=p1.x-p0.x,uy=p1.y-p0.y,uz=p1.z-p0.z,
        vx=p2.x-p0.x,vy=p2.y-p0.y,vz=p2.z-p0.z,
        u=pa.u0||Math.sqrt(ux*ux+uy*uy+uz*uz)/40,
        v=pa.v0||Math.sqrt(vx*vx+vy*vy+vz*vz)/40,
        uo=pa.u1||0,vo=pa.v1||0;
    var v0=pointAdd(p0.x,p0.y,p0.z,uo,vo);
    var v1=pointAdd(p1.x,p1.y,p1.z,u,vo);
    var v2=pointAdd(p2.x,p2.y,p2.z,uo,v);
    var v3=pointAdd(p3.x,p3.y,p3.z,u,v);
    if (pa.tris) { 
      quatv(v0,v1,v2,v3,pa);
      //var t;
      //t=triToggle(v0,v1,v2);if (pa.trip) t.p=pa.trip;
      //t=triToggle(v1,v3,v2);if (pa.trip) t.p=pa.trip;
    }
    return [v0,v1,v3,v2];
  }
  function quad(p,d,pa) {
    var uo=pa.u0||0,vo=pa.v0||0,
        u=pa.u1||((d.x>0?d.x:d.z)/40),v=pa.v1||((d.y>0?d.y:d.z)/40),v0,v1,v2,v3;
    if (d.y==0) {
    v0=pointAdd(p.x,p.y,p.z,uo,vo);//0,0,z0);
    v1=pointAdd(p.x+d.x,p.y,p.z,u,vo);//10*f,0,z0);
    v2=pointAdd(p.x,p.y,p.z+d.z,uo,v);//0,20*f,z0);
    v3=pointAdd(p.x+d.x,p.y,p.z+d.z,u,v);//10*f,20*f,z0);
    } else {
    v0=pointAdd(p.x,p.y,p.z,uo,vo);//0,0,z0);
    v1=pointAdd(p.x+d.x,p.y,p.z+d.z,u,vo);//10*f,0,z0);
    v2=pointAdd(p.x,p.y+d.y,p.z,uo,v);//0,20*f,z0);
    v3=pointAdd(p.x+d.x,p.y+d.y,p.z+d.z,u,v);//10*f,20*f,z0);
    }
    if (pa.tris) { 
      quatv(v0,v1,v2,v3,pa);
      //triToggle(v0,v1,v2);triToggle(v1,v3,v2); 
    }
    return [v0,v1,v3,v2];
  }
  function box(p,d,pa) {
    if (!pa) pa={tris:1};
    //var v0=pointAdd(p.x,p.y,p.z);
    //var v1=pointAdd(p.x+d.x,p.y,p.z);
    //var v2=pointAdd(p.x,p.y+d.y,p.z);
    //var v3=pointAdd(p.x+d.x,p.y+d.y,p.z);
    //var v4=pointAdd(p.x,p.y,p.z+d.z);
    //var v5=pointAdd(p.x+d.x,p.y,p.z+d.z);
    //var v6=pointAdd(p.x,p.y+d.y,p.z+d.z);
    //var v7=pointAdd(p.x+d.x,p.y+d.y,p.z+d.z);
    //triToggle(v0,v2,v1);triToggle(v1,v2,v3);
    //triToggle(v4,v5,v7);triToggle(v7,v6,v4);
    //triToggle(v0,v4,v6);triToggle(v6,v2,v0);
    //triToggle(v5,v1,v3);triToggle(v3,v7,v5);
    //triToggle(v0,v1,v5);triToggle(v5,v4,v0);
    //triToggle(v6,v7,v3);triToggle(v3,v2,v6);
    quad({x:p.x,y:p.y,z:p.z+d.z},{x:d.x,y:d.y,z:0},pa);
    
    //quad({x:p.x+d.x,y:p.y,z:p.z},{x:-d.x,y:d.y,z:0},{tris:1});//wrong uv
    //quat_({x:p.x+d.x,y:p.y,z:p.z},{x:-d.x,y:0,z:0},{x:0,y:d.y,z:0},{tris:1});
    quat({x:p.x+d.x,y:p.y,z:p.z},{x:p.x,y:p.y,z:p.z},{x:p.x+d.x,y:p.y+d.y,z:p.z},{x:p.x,y:p.y+d.y,z:p.z},pa);
    
    quad({x:p.x,y:p.y,z:p.z},{x:0,y:d.y,z:d.z},pa);
    quad({x:p.x+d.x,y:p.y,z:p.z+d.z},{x:0,y:d.y,z:-d.z},pa);
    quad({x:p.x,y:p.y,z:p.z},{x:d.x,y:0,z:d.z},pa);
    quad({x:p.x+d.x,y:p.y+d.y,z:p.z},{x:-d.x,y:0,z:d.z},pa);
    
  }
  function gateCorridor(pa) {
    var p=pa.p,dir=pa.dir,l=Math.sqrt(dir.x*dir.x+dir.y*dir.y+dir.z*dir.z);
    var f=pa.gatedf||(pa.gated/l);
    var r=gate({p:p,d:{x:p.x+dir.x*f,y:p.y+dir.y*f,z:p.z+dir.z*f},o:pa.o});
    corridor(r,dir,pa);
    return r;
  }
  function corridor(r,d,ppa) {
    var p,v0=r.v0,v1=r.v1,v2=r.v2;v3=r.v3,pa={noStartPoint:1,noEndPoint_:1};
    var f=0.01,dxf=d.x*f,dyf=d.y*f,dzf=d.z*f;
    p=v0.p0;var b0=beam(p.x+dxf,p.y+dyf,p.z+dzf,p.x+d.x,p.y+d.y,p.z+d.z,1,pa);if (!b0) return;
    p=v1.p0;var b1=beam(p.x+dxf,p.y+dyf,p.z+dzf,p.x+d.x,p.y+d.y,p.z+d.z,1,pa);if (!b1) return;
    p=v2.p0;var b2=beam(p.x+dxf,p.y+dyf,p.z+dzf,p.x+d.x,p.y+d.y,p.z+d.z,1,pa);if (!b2) return;
    p=v3.p0;var b3=beam(p.x+dxf,p.y+dyf,p.z+dzf,p.x+d.x,p.y+d.y,p.z+d.z,1,pa);if (!b3) return;
    w3ditSplitTrisLineIntersect(b2.w.p0,b3.w.p0);
    w3ditSplitTrisLineIntersect(b1.w.p0,b2.w.p0);w3ditSplitTrisLineIntersect(b2.w.p0,b1.w.p0);
    w3ditSplitTrisLineIntersect(b0.w.p0,b1.w.p0);w3ditSplitTrisLineIntersect(b1.w.p0,b0.w.p0);//---todo
    w3ditSplitTrisLineIntersect(b3.w.p0,b0.w.p0);w3ditSplitTrisLineIntersect(b0.w.p0,b3.w.p0);
    w3ditRemoveInTri(b1.w.p0,b2.w.p0,b3.w.p0);w3ditRemoveInTri(b0.w.p0,b1.w.p0,b3.w.p0);
    w3ditRemoveInTri(b0.w.p0,b2.w.p0,b3.w.p0);w3ditRemoveInTri(b0.w.p0,b1.w.p0,b2.w.p0);
    //console.log(v0.p0);
    quat(v0.p0,v1.p0,b0.w.p0,b1.w.p0,ppa);//{tris:1});//triToggle(b0.w,v0,v1);triToggle(b0.w,v1,b1.w);
    quat(v3.p0,v0.p0,b3.w.p0,b0.w.p0,ppa);//{tris:1});//triToggle(b3.w,v3,v0);triToggle(b3.w,v0,b0.w);
    quat(v1.p0,v2.p0,b1.w.p0,b2.w.p0,ppa);//{tris:1});//triToggle(b1.w,v1,v2);triToggle(b1.w,v2,b2.w);
    quat(v2.p0,v3.p0,b2.w.p0,b3.w.p0,ppa);//{tris:1});//triToggle(b2.w,v2,v3);triToggle(b2.w,v3,b3.w);
  }
  function gate(pa) {
    var p=pa.p,d=pa.d,o=pa.o,pab=pa.pab||{},nocull=pa.nocull||1;
    var b0=beam(p.x,p.y,p.z,d.x,d.y,d.z,nocull,pab);
    var b1=beam(p.x+o.x,p.y,p.z+o.z,d.x+o.x,d.y,d.z+o.z,nocull,pab);
    var b2=beam(p.x+o.x,p.y+o.y,p.z+o.z,d.x+o.x,d.y+o.y,d.z+o.z,nocull,pab);
    var b3=beam(p.x,p.y+o.y,p.z,d.x,d.y+o.y,d.z,nocull,pab);
    //w3ditSplitTrisLineIntersect(b2.w.p0,b3.w.p0);
    //w3ditSplitTrisLineIntersect(b1.w.p0,b2.w.p0);
    //w3ditSplitTrisLineIntersect(b3.w.p0,b0.w.p0);
    
    w3ditSplitTrisLineIntersect(b2.w.p0,b3.w.p0);w3ditSplitTrisLineIntersect(b3.w.p0,b2.w.p0);
    w3ditSplitTrisLineIntersect(b1.w.p0,b2.w.p0);
    w3ditSplitTrisLineIntersect(b0.w.p0,b1.w.p0);w3ditSplitTrisLineIntersect(b1.w.p0,b0.w.p0);//---todo
    w3ditSplitTrisLineIntersect(b3.w.p0,b0.w.p0);w3ditSplitTrisLineIntersect(b0.w.p0,b3.w.p0);
    
    w3ditRemoveInTri(b1.w.p0,b2.w.p0,b3.w.p0);w3ditRemoveInTri(b0.w.p0,b1.w.p0,b3.w.p0);
    w3ditRemoveInTri(b0.w.p0,b2.w.p0,b3.w.p0);w3ditRemoveInTri(b0.w.p0,b1.w.p0,b2.w.p0);
    return {v0:b0.w,v1:b1.w,v2:b2.w,v3:b3.w};
  }
  function beam(x0,y0,z0,x1,y1,z1,nocull,p) {
    var vp0=p.noStartPoint?undefined:pointAdd(x0,y0,z0)
    if (!p.noEndPoint) pointAdd(x1,y1,z1)
    //meshUpdate();
    var from,to;
    var t=physicsBeam2(from=[x0,y0,z0],to=[x1,y1,z1],nocull);
    if (t) {
      var v4=pointAdd(to[0],to[2],-to[1]);
      
      var A=t.v0.p0,B=t.v1.p0,C=t.v2.p0,P=v4.p0;
      var v0=new Vecmath.Vec3();v0.sub2(C,A);
      var v1=new Vecmath.Vec3();v1.sub2(B,A);
      var v2=new Vecmath.Vec3();v2.sub2(P,A);
      var dot00=v0.dot(v0);
      var dot01=v0.dot(v1);
      var dot02=v0.dot(v2);
      var dot11=v1.dot(v1);
      var dot12=v1.dot(v2);
      var invDenom=1/(dot00*dot11-dot01*dot01),
          u=(dot11*dot02-dot01*dot12)*invDenom,
          v=(dot00*dot12-dot01*dot02)*invDenom;
      var t1={u:t.v1.u-t.v0.u,v:t.v1.v-t.v0.v};
      var t2={u:t.v2.u-t.v0.u,v:t.v2.v-t.v0.v};
      var tu=t.v0.u+t1.u*v+t2.u*u,tv=t.v0.v+t1.v*v+t2.v*u;
      v4.u=tu;v4.v=tv;
      //onsole.log('beam '+u+' '+v);
      
      triToggle(t.v0,t.v1,t.v2);
      if (1) {//!dbg
      var tn;
      tn=triToggle(t.v0,t.v1,v4);tn.p=t.p;
      tn=triToggle(t.v1,t.v2,v4);tn.p=t.p;
      tn=triToggle(t.v2,t.v0,v4);tn.p=t.p;
      } else {
        console.log(t);
        console.log(v4);
      }
      return {v:vp0,w:v4};
    }
    //console.log(to);
  }
  //----
  W3dit.getSelv=function() {
    return selv;
  }
  W3dit.loaded=function() {
    document.title='W3dit';
    
    function mvcSelb() {
      return selb!=-1;
    }
    function mvcSelbSelak() {
      return (selb!=-1)&&(selak!=-1);
    }
    
    
    
    var mlh;
    mroot={s:'Menu',sub:[]};
    
    mselb=[{s:'rotX',bgcol:mselbc,a:'mselb0',msid:'mselb0',ms:'0.0'},
    {s:'rotY',a:'mselb1',msid:'mselb1',ms:'0.0'},
    {s:'rotZ',a:'mselb2',msid:'mselb2',ms:'0.0'},
    {s:'X',a:'mselb3',msid:'mselb3',ms:'0.0'},
    {s:'Y',a:'mselb4',msid:'mselb4',ms:'0.0'},
    {s:'Z',a:'mselb5',msid:'mselb5',ms:'0.0'}];
    
    canvas=document.getElementById('canvas');
    cont=canvas.parentNode;
    
    //log('pa0.len='+pa0.len);
    activate();
    
    //alert('"id":"p0"'.replace(/\"/g,'\\\"'));
    
    if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function () {
      tilt(event.beta, event.gamma);
    }
    , true);
    } else if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function () {
      tilt(event.acceleration.x * 2, event.acceleration.y * 2);
    }
    , true);
    } else {
    window.addEventListener('MozOrientation', function () {
      tilt(orientation.x * 50, orientation.y * 50);
    }
    , true);
    }
    
    //canvas=document.getElementById('canvas');
    //cont=canvas.parentNode;
    sel=document.getElementById("sel")
    tf=document.getElementById("tf");
    ta=document.getElementById("ta");
    
    
    predefined=[["Gollum",gollum],["Templar",templar],//['Bane',bane],//["BulletSimple",bulletsimple],
    ['Cube',
    ////'pa:[[-20.0,8.742277E-7,19.999998],[-20.0,8.742277E-7,-8.742278E-7],[-20.0,8.742277E-7,-19.999998],[8.742277E-7,0.0,-19.999998],[2.7538174E-6,62.999996,1.2037318E-13],[-8.742277E-7,0.0,19.999998],[20.0,-8.742277E-7,19.999998],[20.0,-8.742277E-7,8.742278E-7],[20.0,-8.742277E-7,-19.999998],[-60.0,2.622683E-6,-2.6226833E-6],[2.622683E-6,0.0,-59.999996],[-2.622683E-6,0.0,59.999996],[60.0,-2.622683E-6,2.6226833E-6],[-20.000002,8.742277E-7,59.999996],[-60.000004,2.622683E-6,59.999992],[-60.0,2.622683E-6,19.999996],[-60.0,2.622683E-6,-20.0],[-59.999996,2.622683E-6,-60.0],[20.000002,-8.742277E-7,-59.999996],[60.000004,-2.622683E-6,-59.999992],[60.0,-2.622683E-6,-19.999996],[60.0,-2.622683E-6,20.0],[59.999996,-2.622683E-6,60.0],[19.999998,-8.742277E-7,59.999996],[-19.999998,8.742277E-7,-59.999996]],'+
    ////'fa:[[4,1,2],[2,3,4],[7,4,3],[3,8,7],[6,5,4],[4,7,6],[5,0,1],[1,4,5],[5,6,11],[11,0,5],[1,0,9],[9,2,1],[10,8,3],[3,2,10],[12,6,7],[7,8,12],[24,10,2],[9,16,2],[17,24,2],[2,16,17],[8,20,12],[10,18,8],[19,20,8],[8,18,19],[6,12,21],[6,21,22],[22,23,6],[11,6,23],[13,0,11],[15,9,0],[0,13,14],[14,15,0]]'
    ////'pa:[[-20.0,8.742277E-7,19.999998],[-20.0,8.742277E-7,-19.999998],[20.0,-8.742277E-7,19.999998],[20.0,-8.742277E-7,-19.999998],[20.000002,39.999996,19.999998],[20.000002,39.999996,-19.999998],[-19.999998,39.999996,-19.999998],[-19.999998,39.999996,19.999998]],'+
    ////'fa:[[1,3,5],[5,6,1],[3,2,4],[4,5,3],[5,4,7],[7,6,5],[2,0,7],[7,4,2],[0,1,6],[6,7,0],[3,1,0],[0,2,3]]'
    
    
    
    'pa:[[-20,0,20,0,0],[-20,0,-20,0,1],[20,0,20,0,0],[20,0,-20,1,1],[20,40,20,0,0],[20,40,-20,1,0],[-20,40,-20,0,0],[-20,40,20,0,0]],'+
    'fa:[[1,3,5],[5,6,1],[3,2,4],[4,5,3],[5,4,7],[7,6,5],[2,0,7],[7,4,2],[0,1,6],[6,7,0],[3,1,0],[0,2,3]]'
    +',diff:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAOAElEQVR4nO2ae1iVZbqHP1GITELEE5qkZIaRShhmOoQYyKCSZqHhYcYUFqzzea3vhJmi4pGQPMACRZZuzTRGk3HUGLc122Ryd1m7HLPMphlLK7Wxg+Khe/7gMMgWodmOMJv++F3ftRbX9fG+9/Ou533e3/MKZAm0ZQktPYCW1s8AWnoALa1/GwAX5wVxeK2mTu/np7QtAOcWhrF169Y6Fa3M4fnH2zCAnJwchob8DKDtALg4L4hXS9fgcDgoLi5m6NChbQvAX5dGU75+CX3uFihdV8iAPt147dk2BGBv6RK2W6KJ7ClwyGNhQuIoThrbCIC/Lo1mb+kSInsKlE0W+Dg3gaWyjvVPthEA9aNPlsCF7N5sWbeKmUPaAICG0a/9/tWNhTx8X7f//wAaRr9WtyoPtGoAjUWfrFuXB1o1gMaiT9atywMtDuDHrHY1z+u/u1n0a3Ur8kCTAH7MatdA1w+2uZP8qaof/fr/u/57b0UeuAGAdvyoNqJ/YiLX6j2vZbXjqtqOa6oPV1WfuudVtT3Xaj5fU9vxlyXD2F2aS2QPgVdTGh/DR7lj/s95QGh0sjfQPwbZUNf/7aranquqD5fV9lxR21OldqiRH5dUPy7We15U77juc5Xqx54NS3nFGUd4sFD3zhuN52/Z99TlgZ8yj/pqFMA1tR1XVR+uqO25rHSgSmlPlerLJdWPS6ovl1RfqlTfmolVPy+qfvyg+vG96s+3akcuqHfxjdKJc0onzioBfK0E8pUSyJdKEF/KQZyWu3BGCeK0EsxpJYgzcheOLh7Fa96XGNLLl4JkXy4pflxWOtRbJdePszYP/NMAaiN2pWYil2onoNzFN0pA9YDlzpyWu3BaDua03IUvlS58qQTxtdKZs0pnvlI6c0buwudKMH+Re3BSDuFjuTfHpFCOSv14TwrjXbE/70gP8N/iA/xRHEil+CCH3BFUShEcckdwSIzgj+KD/KZkJYWOCYQG+fKhuxen5K58rdzN35ROfKveySXVjyq1A1fUDlxR2/OWx8qExFGcMNx4lTQMaq3qAJxTAvhCCebPSk+OyaEcEe+n0v0gb7gjqXAPZY97OOWuEZS7RrDPFc1/uqN4Q4zkD+4h/EEczBvuSPa7o/idaxivuUaywxnDducoXnbGs8meSIljHMX28ayxT+Il29O8aHuWXNuzLLdPZbl1GkttU1luSyXXNgXPAjObS9fRr2cQ+qSBlLtG8rormoPuwRwR+3NcCuXPck++ULpwVrmbb5ROfLBiHEtkPYXJHWrgVK/Gy3WQqnW5RlVqBy4pflxU/PlW6YjwivMJ1tqeZp51FkazkxnG50kxLCRZv5xfGnKZaMhhumEuGpOI3uTAYrZiMVsxmO1oTBK/Ns5hunEuqcZ5TDFkk2qcz2TDAp4xLGKSIYeJhqWM1ecSr89ntG4NMboCHtMWMULnYbi2iBjdWkbp1hCrW8uadZtIN4kEdg7CbDShWDJZaPs1L9qepcA+kVJHEmXOWPa6hvGmewhviwM5PPcxNq1bw1OD7+JDqQ8fyX34SLqHj6RQjkuhfCjdyzHpXv4k9eMDKYz/EfvzjvgAb4mD2OeKRhiQuZWumj0IaYdaVNHy71lVso2O3cMIi5tFov5FJhsWMNskYzFbkS2ZZFtnssw2lXxbCgX2iRTbk9ngGMtmbwkPhPXB60hig2MsxfZkCuwTybelsMw2lWzrTGRLJhazldkmmcmGBSTqX+RRbTFCtHY9YRnbCUyvaFEAy4tfZYJhCXcEdidBm8tkwwLSTRI2s5k5lnQWW2eQb0vBY59AqSOJLY4EtjnjKHPGsn3tAsYmxuPRRFPmjGWbM44tjgRKHUl47BPIt6Ww2DqDOZZ0bGYz6SaJyYYFjNHnIYzWv0Sk1ss9GTu5I/3NFpn8CHkfqze8Qqfu/Rj4xHSeMSxitknGZjYz15rGMts0VtsnUeIYxxZnPGXOWMpdI9jrGkaF+xF+u3Q28yUL7rH3UuF+hL2uYZS7RlDmjGWLM54SxzhW2yexzDaNudY0bGYzs00yzxgWITxpWMovdAWEZ75McAv9FFYUb+cpQw7+gd1J1i1mpjELi9nKHEs6y2zTWGt/Cq8jiW3OOHa5RrLPFc0BdyQH3YOoFCM4OPdxNq5by/hBgdWf3YM44I5knyuaXa6RbHPG4XUksdb+FMts05hjScditjLTmIWQapxHoj6PodoSQjN24J/+xm2O/t6a6PfloSemkmqch87kRLZkstg6g9X2SXgdSWx3jmK3azj73VEcdA/isBjOEfF+3pfCOCr15RVvMQ+FhfC+FMYR8X4Oi+EcdA9ivzuK3a7hbHeOwutIYrV9EoutM5AtmehMToTZJoWJhsXE1KyCIM2+2zLx+hb31q1buTOwOxN0i5htUnCYjWRbZ5JvS6HEMY5tzjh2u4ZzwP0wlWIER8T7OSr15bjUhxNyb07KIVQUSiQnxnFA35PjUh+OSn2rt3QxggPuh9ntGs42ZxwljnHk21LIts7EYTYi6M0OUo3zSdCvJFLrJSRjFz5pb912AIIgkGqcj97sQLVoWGabisc+gS3OeHa5RrLfHUWlGMG7Un+OSaF8IvfiM7kHnytd+UIJ5p0VE8mRDeQmd+IzuQefyL04JoXyrtSfSjGC/e4odrlGssUZj8c+gWW2qagWDYLNbGamMYvx+uU8qi2mX0YZd6YfaBEAM41Z2Mxm5lufI9+WUrfv73NFc9A9iCPi/RyTQjkph3BK7sYZJYizSiDnlABOzR/A5nWrSR3sxxkliFNyN07KIRyTqou7g+7qfb/MGUupI4l8Wwrzrc8hiBYd6SaJSYYcYnQFDMjcelu2xIYAwsPDSTdJiBYdi60zKLBPZIsjgXLXCA64IzkshnNU6ssnci9Oyd34SunMeSWAC2pHvlP9+V71Z/tGD5H3dee8EsBXSmdOyd34RO7FUakvh8VwDrgjKXeNYIsjgQL7RBZbZyCoFg06k5PJhgXE6VYRkbn59u0GgoAgCISHh1NYWIgm04Bq0bDClkqxPZltzjj2uobVRf+41IfP5B6cUYI4rwTwnXpnzQmyuvw96LExIXEUHxj8Oa8EcEYJ4jO5B8elPnWrYK9rGNuccRTbk1lhS0WYa03DaLaTapxHvD6fwdqNdNfsvi0Aumt2M1i7kXh9PtMzHXg8Huy6WeTZprDBMZYyZywV7keoFCN4XwrjhNybz5WunFUCuaB25KLqx+WsDlzN8uFqlg/Hc8fUnQsuqB05qwTyudKVE3Jv3pfCqBQjqHA/Qpkzlg2OseTZpiC8YJ2F2WxlmvEFxujziNR66akpvy0AemrKidR6GaPPY5rxBbRaHR6Phzn6qXgdSexwxrDfHcXb4kCOSn05KYfwhRLMOSWA71R/qlRfrmb51LlFtf7Ar4b48J3qT+1B76QcwlGpL2+LA9nvjmKHMwZvTR4Q5llnYTFbmW6cS6I+j0htKSG3CUCIppxIbSmJ+jymG+diMVtx6J7D4/GwyDCJnQ0AfCqHcFrpwnklgO9Vf6rUDjUAaq23ap8w8r5ufK9W/wxOK134tAGAnc4YvI5fVgNoTSvAbLbygnUWc/RT8Xg85BrG/6QV8GNWuzp/4APDHc1bAa0lB6Qa52E025lrTSPPNoWFhqfxeApZbRrT7BxwNcuHD3MTWSLrWZPs17wc0JK7QLBmDxGZm4nTrWKyYQE6k/O6XWC54Uk8nkKKTKObtQtUqb6cyQ5j87rVTB3s27xdoKXqACHtEIHpFQzI3EqMroBJhpwb1gErjWMp8hSy3hTbZB3wnerPBbUjr2wqYch9PZpXB7RUJSikHeLO9AP0yyjjUW0x4/XLG60EVxkTKfIUUmp6vNFK8LwSwDklgLNKIL8vkklKiONNffemK8GWOgsIaYfwSXuLkIxdRGq9JOhX3vQssNaUUA3BHHPDs8BppQtfKMF8rnSlcsUUskUji8YFN30WaKnTYK2CNPsIz3yZGF0BEw2Lb3oaLKiFYHr8f50GP5VDOCmHcELuzbvzhrNx3RqeHHR306fBlvYD/NPfIDRjB0O1JSTq85r0A2pXwnpT7HV+QK1q/YCXN20gIqxX035Aa3CEgjV7CM98mV/oCnjSsLRJR6g2JxSZRlMpRvC2OLBOtY7QzsJsEhNGU5zxyM0dodbgCd6R/ib3ZOwkUutltP6lZnmCK41j6+qE/e6oOtV6gr9Zpud50Yo26cGbe4KtxRUOTK8gLGM70dr1jNHnNcsVrq0Tcg3j2emMYYcz5h+u8JxnKSkuZERE6M1d4dbSFxDSDtFVs4cBmVt5VFvc7L5AdcVYfXZo2Bf4j01e+ofde/O+QGvqDCXq85hiyCbDLGI1W5rVGXpP7M8m80iKPIVsNj92XWdoj2cOSQlxVOh6N94Zak29wVWOZ1hjn8SGmq2vOb3Bb9WO/KD68zvLQxR5CtljiajrDf7pxfHkSDqKk30a7w22tu7wYXc470n9+UDqy8dS093h+vcSXrcMpMhTyOuWgfyotuPcgn5srnd/4Ibd4dZ2P+ArpTNfK3fzjdKRHxT/Ju8HNFRDCNs2rb/p/YFWeUOkSvXlSs07bnZDpDkQ/qvIydiEUXxiaARAa7wjdNNIN3g/NbfMGqrCGs76dcW86slh9fJsvPZ4zi0M+/e5JXZj/bT/W54z/Trr3Zut4XDaTwTwr1Zj9wRvxbtP5MZfB0Cj0aCJamUA/pVq8wDOLQzDm61Bo9GQkZFBfHx82wJAlsDhNAFNVLXSHhZYO66NAWhKPwNo6QG0tP4OenMo5dj8c98AAAAASUVORK5CYII="'
    
    //+',diff:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAADd0lEQVRYhe3WX2xTZRzG8W/MEmNiol7UzASJiuDZNFkWNZCNaCOBmTEKmwM3l0oBMTpo18m/9axHIGicBpzDELRnWtwyt54lXGicJrqhot4QHDckxuFaggFKYFPmRruu5/Vi6bK13QooO0ezX/K76Mlp+nmfPGlemJv/yGiaJiav0Z6USQM0F3IO+E9H07Req9UqGhsbhcViMRcwEAis0TStLysr61RDQ0NPUVHReeABo10To2lar9vtPgj0tba2VimK8gvgMJg1PpPTAxyapmW3tLRcAvxG24Cp6QFZAO3t7X3Z2dnnjJWRml7ieWdn52FT9DBdegAdHR0VhvdwuvQATNHD6dJLjKE9nCm9xBjaw0zpgYE9vJ70wIAeprkMTJteYma1hzdzW5nVHt4McFZ7mAyUJCkj0Ij/QwEISZKEz+cTDoejOtMXMvbQnoddLsTz/rMcbCujrauCrh473d+v57sfNnD82/Uc+6qKLzvL0T6y0XygiAOvF6JsWcwWex7253NZW5rL6pJFFC9/iGXW+SwtuJ8nK8ps+1RVjVesK5fn38U98+Zxx5493Jb8+xl7eGITJ844OXPxNS4M7mRgqI6hEZnhiMy1qExktJ5oVCYS9RAZkRm+uourf+xgMLydcMhF6PSrnP5pAz92vcAXbc/RdriYQ+8s4+29T7H7ldLCo6qq6hvXPN2y9lHKVyxk+eL7ePzhe1mQQAcCn1bO2MPhXfw1Wk90zEssXs+Y7iWuK8SFF32m1RXiupf4mJdY1ENkqI6hwZ0MXKjlfN9Wfu19iZ+PvUjPW1X5p5pVVZfXPXH8vRW8++YzvOFZSl3NElyb8tm4daX08hH/x3/eeTvf2BaysmQRxbZHsJXmsrosh1KuB3MjqyvjB4zXMxaTGY16iHTV5ESbVZ/4zJkzMriDgSvbuRzeRjjs5uLvNZw7eqQp9tiDlljQSX/IRbDfxW8hF8GQiyD/Jm6m7XZLerPqE91uKeUwJz/crFeWWEW/c/zz5B0HKohbthmQwot+dn+B3qRUC/+q1INxS3FptrtWEsnIa3vv1jX/IeHIm3ogQ4BTkLXSxLPPP2kU+QssKe8aAkyHPPnBZlFZYhVBp0mAyciz+wtEk1It/DYTAScjv65bIiZ6aCZgApl82TAVUCikAGEO+D8DCoXELXxiTQdMt38DxQMdZu4xhlAAAAAASUVORK5CYII="'
    
    ////'pa:[[0.0,0.0,0.0,0.051,0.105],[20.0,0.0,0.0,0.441,0.105],[0.0,-44.0,0.0,0.051,0.965]],'+
    ////'fa:[[1,2,0]]'
    ],['Baneling',
    
    'pa:[[-138.395,21.074,35.0,0.918,0.895],[-138.395,21.074,-35.0,0.918,0.895],[-177.932,66.205,-35.0,0.928,0.754],[-177.932,66.205,35.0,0.928,0.754],[-154.869,39.878,-50.0,0.926,0.83],[-154.869,39.878,50.0,0.926,0.83],[-105.479,36.615,-45.0,0.85,0.916],[-105.479,36.615,45.0,0.85,0.916],[-154.9,93.029,45.0,0.848,0.721],[-154.9,93.029,-45.0,0.848,0.721],[-128.542,62.941,-60.0,0.856,0.83],[-128.542,62.941,60.0,0.856,0.83],[-95.595,25.332,0.0,0.856,0.98],[-128.511,9.791,0.0,0.946,0.95],[-166.152,29.994,0.0,0.984,0.83],[-187.816,77.488,0.0,0.946,0.679],[-168.079,108.073,0.0,0.856,0.648],[-83.468,59.448,0.0,0.756,0.977],[-88.08,67.713,40.0,0.758,0.893],[-88.08,67.713,-40.0,0.758,0.893],[-106.531,100.775,-50.0,0.754,0.799],[-106.531,100.775,50.0,0.754,0.799],[-124.981,133.836,40.0,0.75,0.695],[-124.981,133.836,-40.0,0.75,0.695],[-131.9,146.234,0.0,0.754,0.633],[-88.965,173.133,0.0,0.664,0.603],[-85.999,159.248,-45.0,0.662,0.664],[-76.115,112.965,-65.0,0.664,0.799],[-85.999,159.248,45.0,0.662,0.664],[-76.115,112.965,65.0,0.664,0.799],[-66.231,66.682,0.0,0.664,0.971],[-40.0,65.0,-55.0,0.576,0.9],[-40.0,65.0,55.0,0.576,0.9],[-40.0,170.0,55.0,0.566,0.648],[-40.0,170.0,-55.0,0.566,0.648],[-40.0,110.0,-75.0,0.575,0.799],[-40.0,110.0,75.0,0.575,0.799],[-40.0,55.0,0.0,0.575,0.965],[-45.0,195.0,0.0,0.588,0.543],[167.213,85.949,-70.0,0.133,0.529],[167.213,85.949,70.0,0.133,0.529],[73.105,3.676,70.0,0.133,0.879],[73.105,3.676,-70.0,0.133,0.879],[106.984,33.294,-95.0,0.107,0.736],[106.984,33.294,95.0,0.107,0.736],[139.488,148.048,90.0,0.273,0.471],[139.488,148.048,-90.0,0.273,0.471],[33.141,41.792,-90.0,0.271,0.871],[33.141,41.792,90.0,0.271,0.871],[67.02,71.41,-120.0,0.272,0.748],[67.02,71.41,120.0,0.272,0.748],[18.084,28.628,0.0,0.268,0.965],[18.084,28.628,0.0,0.268,0.965],[57.575,-16.543,0.0,0.114,0.965],[114.017,-20.33,0.0,0.012,0.845],[166.717,25.743,0.0,0.012,0.633],[198.724,80.291,0.0,0.063,0.452],[198.747,133.442,0.0,0.165,0.347],[170.075,181.431,0.0,0.306,0.316],[10.075,222.242,0.0,0.524,0.452],[96.415,220.306,0.0,0.421,0.362],[82.942,184.606,-75.0,0.383,0.498],[82.942,184.606,75.0,0.383,0.498],[12.274,193.059,-60.0,0.479,0.578],[12.274,193.059,60.0,0.479,0.578],[40.485,107.067,-110.0,0.375,0.758],[-0.178,124.621,-95.0,0.485,0.769],[-0.178,124.621,95.0,0.485,0.769],[40.485,107.067,110.0,0.375,0.758],[14.135,69.031,-75.0,0.365,0.877],[-10.371,65.157,0.0,0.472,0.965],[14.135,69.031,75.0,0.365,0.877],[49.71,62.701,144.045,0.79,0.106],[6.904,80.77,89.473,0.525,0.042],[9.646,46.233,75.484,0.491,0.164],[30.005,76.586,152.225,0.79,0.042],[35.163,47.285,148.373,0.79,0.152],[-8.336,59.806,88.347,0.505,0.106],[16.489,55.31,155.782,0.79,0.106],[24.885,67.197,76.61,0.505,0.106],[60.627,-79.168,159.219,0.857,0.58],[52.202,34.803,188.743,0.957,0.196],[42.47,33.531,160.394,0.838,0.196],[47.306,-8.045,147.901,0.79,0.35],[61.631,-0.142,193.424,0.98,0.328],[62.973,37.735,165.865,0.885,0.194],[75.992,3.767,162.92,0.885,0.326],[29.752,30.344,177.602,0.885,0.194],[31.698,-6.088,178.569,0.885,0.326],[66.863,-71.815,163.098,0.889,0.578],[65.92,-29.73,186.93,0.957,0.438],[39.18,-41.288,177.581,0.885,0.458],[83.474,-31.433,161.932,0.885,0.458],[53.541,-37.378,147.077,0.79,0.46],[71.701,-76.704,155.307,0.857,0.58],[31.697,-42.774,173.867,0.861,0.458],[87.065,-30.455,154.306,0.861,0.458],[79.582,4.745,155.294,0.861,0.326],[24.214,-7.574,174.855,0.861,0.326],[67.411,-83.802,157.099,0.854,0.605],[42.834,66.181,108.372,0.647,0.106],[-1.46,56.326,124.021,0.647,0.106],[23.782,43.673,113.885,0.648,0.174],[16.561,84.694,119.278,0.648,0.02],[49.405,57.266,194.971,0.98,0.108],[36.817,80.96,174.263,0.885,0.02],[19.227,52.579,180.217,0.885,0.106],[63.521,62.434,164.568,0.885,0.106],[39.638,45.9,160.168,0.838,0.152],[0.434,79.513,70.646,0.467,0.861],[18.798,71.995,57.061,0.424,0.891],[-19.597,67.516,64.213,0.508,0.896],[-1.294,60.37,49.996,0.467,0.921],[6.23,57.62,0.0,0.37,0.965],[0.434,79.513,70.646,0.455,0.018],[18.798,71.995,57.061,0.447,0.098],[-19.597,67.516,64.213,0.447,0.098],[-1.294,60.37,49.996,0.441,0.176],[-71.541,20.69,91.911,0.647,0.106],[-116.609,27.014,76.651,0.647,0.106],[-91.703,10.968,71.937,0.648,0.174],[-97.237,41.03,100.74,0.648,0.02],[-65.729,46.169,66.435,0.505,0.106],[-86.591,57.996,76.33,0.525,0.042],[-99.53,50.913,54.99,0.505,0.106],[-78.669,39.086,45.095,0.491,0.164],[-88.619,-3.208,113.572,0.79,0.106],[-122.42,1.535,102.127,0.79,0.106],[-103.938,-9.426,99.62,0.79,0.152],[-107.891,12.047,120.194,0.79,0.042],[-111.42,-25.882,114.897,0.838,0.152],[-111.007,-0.024,124.393,0.885,0.02],[-118.75,-17.395,140.062,0.98,0.108],[-135.683,-14.134,115.932,0.885,0.106],[-90.615,-20.458,131.192,0.885,0.106],[-156.047,-129.623,203.702,0.854,0.605],[-159.042,-60.824,146.696,0.861,0.326],[-102.707,-68.729,165.771,0.861,0.326],[-113.878,-94.778,187.967,0.861,0.458],[-170.213,-86.873,168.892,0.861,0.458],[-159.819,-124.491,198.095,0.857,0.58],[-148.552,-126.072,201.91,0.857,0.58],[-139.367,-103.021,165.464,0.79,0.46],[-120.404,-89.923,190.381,0.885,0.458],[-165.472,-83.598,175.121,0.885,0.458],[-143.755,-70.223,192.017,0.957,0.438],[-153.216,-116.875,200.625,0.889,0.578],[-154.301,-57.549,152.925,0.885,0.326],[-137.497,-32.29,132.637,0.885,0.194],[-109.233,-63.873,168.185,0.885,0.326],[-103.696,-37.034,144.082,0.885,0.194],[-130.058,-81.314,146.968,0.79,0.35],[-118.811,-42.793,129.716,0.838,0.196],[-123.275,-22.466,151.324,0.957,0.196],[-135.338,-44.45,177.842,0.98,0.328],[-118.787,89.1,-178.072,0.98,0.108],[-109.628,100.8,-149.177,0.885,0.02],[-89.296,80.268,-165.576,0.885,0.106],[-134.933,79.326,-150.73,0.885,0.106],[-110.022,64.645,-152.681,0.838,0.152],[-150.411,29.815,-182.052,0.861,0.326],[-93.365,30.993,-200.61,0.861,0.326],[-100.117,3.704,-223.098,0.861,0.458],[-157.163,2.526,-204.54,0.861,0.458],[-140.742,-32.752,-233.897,0.857,0.58],[-129.333,-32.516,-237.609,0.857,0.58],[-124.199,-8.62,-200.913,0.79,0.46],[-107.302,7.498,-225.544,0.885,0.458],[-152.939,6.555,-210.698,0.885,0.458],[-133.436,23.309,-227.28,0.957,0.438],[-135.392,-24.174,-236.307,0.889,0.578],[-146.187,33.844,-188.21,0.885,0.326],[-133.73,61.251,-167.578,0.885,0.194],[-100.55,34.787,-203.056,0.885,0.326],[-99.502,61.958,-178.712,0.885,0.194],[-118.572,14.121,-182.173,0.79,0.35],[-113.655,53.781,-164.541,0.838,0.196],[-121.057,73.339,-186.051,0.957,0.196],[-129.289,49.962,-212.842,0.98,0.328],[-136.163,-37.182,-239.501,0.854,0.605],[-87.578,77.191,-141.089,0.79,0.106],[-121.805,76.484,-129.955,0.79,0.106],[-104.927,64.932,-137.002,0.79,0.152],[-104.338,94.697,-133.303,0.79,0.042],[-70.739,72.87,-108.999,0.647,0.106],[-116.376,71.927,-94.153,0.647,0.106],[-93.086,96.211,-98.617,0.648,0.02],[-93.911,54.539,-103.796,0.648,0.174],[-65.309,68.313,-73.198,0.505,0.106],[-99.537,67.606,-62.063,0.505,0.106],[-81.23,49.484,-65.135,0.491,0.164],[-83.616,86.435,-70.126,0.525,0.042],[48.471,16.064,-177.443,0.98,0.108],[38.398,31.531,-157.157,0.885,0.02],[43.523,2.008,-150.644,0.838,0.152],[65.801,18.312,-152.013,0.885,0.106],[21.156,7.493,-165.931,0.885,0.106],[37.052,-38.854,-201.586,0.861,0.326],[92.859,-25.329,-184.189,0.861,0.326],[105.938,-49.815,-207.111,0.861,0.458],[50.131,-63.339,-224.508,0.861,0.458],[87.391,-90.681,-240.004,0.857,0.58],[98.552,-87.976,-236.524,0.857,0.58],[77.068,-69.133,-202.948,0.79,0.46],[100.68,-46.982,-213.138,0.885,0.458],[56.034,-57.801,-227.055,0.885,0.458],[77.143,-35.755,-229.137,0.957,0.438],[91.114,-81.062,-238.731,0.889,0.578],[42.955,-33.316,-204.134,0.885,0.326],[35.456,-7.478,-179.472,0.885,0.194],[87.6,-22.496,-190.216,0.885,0.326],[68.94,0.636,-169.034,0.885,0.194],[66.566,-11.165,-214.323,0.98,0.328],[66.169,-48.729,-183.847,0.79,0.35],[51.554,-11.792,-165.679,0.838,0.196],[53.164,9.135,-187.114,0.957,0.196],[95.152,-93.409,-242.084,0.854,0.605],[25.438,58.638,-74.575,0.505,0.106],[-8.046,50.523,-85.013,0.505,0.106],[7.965,41.052,-66.932,0.491,0.164],[9.427,68.109,-92.657,0.525,0.042],[44.062,44.361,-102.527,0.647,0.106],[-0.584,33.541,-116.445,0.647,0.106],[20.299,59.884,-121.138,0.648,0.02],[22.82,23.252,-100.747,0.648,0.174],[18.041,19.265,-144.397,0.79,0.106],[33.702,39.021,-147.916,0.79,0.042],[51.525,27.379,-133.959,0.79,0.106],[35.503,12.856,-133.352,0.79,0.152],[-94.719,70.607,43.535,0.703,0.872],[-55.94,67.972,49.894,0.633,0.872],[-77.578,74.439,58.417,0.668,0.836],[-73.081,64.14,35.012,0.668,0.908],[-77.578,74.439,58.417,0.455,0.018],[-55.94,67.972,49.894,0.447,0.098],[-94.719,70.607,43.535,0.447,0.098],[-73.081,64.14,35.012,0.441,0.176],[19.151,71.935,-58.314,0.424,0.891],[1.361,76.871,-72.765,0.467,0.861],[-1.662,62.49,-49.662,0.467,0.921],[-19.451,67.426,-64.113,0.508,0.896],[-55.443,70.177,-47.785,0.633,0.872],[-76.399,80.558,-53.79,0.668,0.836],[-94.459,69.784,-41.599,0.703,0.872],[-73.503,59.403,-35.594,0.668,0.908],[-76.399,80.558,-53.79,0.455,0.018],[-94.459,69.784,-41.599,0.447,0.098],[-55.443,70.177,-47.785,0.447,0.098],[-73.503,59.403,-35.594,0.441,0.176],[1.361,76.871,-72.765,0.455,0.018],[-19.451,67.426,-64.113,0.447,0.098],[-1.662,62.49,-49.662,0.441,0.176],[19.151,71.935,-58.314,0.447,0.098]],'+
    'fa:[[8,3,15],[15,16,8],[11,5,3],[3,8,11],[7,0,5],[5,11,7],[12,13,0],[0,7,12],[2,9,16],[16,15,2],[4,10,9],[9,2,4],[1,6,10],[10,4,1],[13,12,6],[6,1,13],[14,4,2],[2,15,14],[14,15,3],[3,5,14],[1,4,14],[14,13,1],[0,13,14],[14,5,0],[22,8,16],[16,24,22],[21,11,8],[8,22,21],[18,7,11],[11,21,18],[17,12,7],[7,18,17],[28,22,24],[24,25,28],[29,21,22],[22,28,29],[33,28,25],[25,38,33],[36,29,28],[28,33,36],[9,23,24],[24,16,9],[10,20,23],[23,9,10],[6,19,20],[20,10,6],[12,17,19],[19,6,12],[23,26,25],[25,24,23],[20,27,26],[26,23,20],[27,35,34],[34,26,27],[26,34,38],[38,25,26],[53,52,48],[48,41,53],[41,48,50],[50,44,41],[50,45,40],[40,44,50],[45,58,57],[57,40,45],[46,39,57],[57,58,46],[43,39,46],[46,49,43],[42,43,49],[49,47,42],[53,42,47],[47,52,53],[56,40,57],[57,39,56],[55,54,44],[55,44,40],[40,56,55],[43,54,55],[55,56,39],[39,43,55],[54,53,41],[41,44,54],[42,53,54],[54,43,42],[45,62,60],[60,58,45],[50,68,62],[62,45,50],[48,71,68],[68,50,48],[71,48,52],[62,64,59],[59,60,62],[68,67,64],[64,62,68],[64,33,38],[38,59,64],[67,36,33],[33,64,67],[61,46,58],[58,60,61],[63,61,60],[60,59,63],[34,63,59],[59,38,34],[65,49,46],[46,61,65],[66,65,61],[61,63,66],[35,66,63],[63,34,35],[69,47,49],[49,65,69],[99,80,89],[89,94,99],[80,95,91],[91,89,80],[94,89,92],[92,96,94],[89,91,90],[90,92,89],[92,90,84],[84,86,92],[91,88,84],[84,90,91],[91,95,98],[98,88,91],[92,86,97],[97,96,92],[86,84,81],[81,85,86],[97,86,85],[88,87,81],[81,84,88],[88,98,87],[99,94,93],[93,80,99],[95,80,93],[93,94,96],[95,93,83],[83,98,95],[96,97,83],[83,93,96],[98,83,82],[82,87,98],[97,85,82],[82,83,97],[78,101,103],[103,75,78],[101,77,73],[73,103,101],[76,102,101],[101,78,76],[102,74,77],[77,101,102],[79,100,103],[103,73,79],[100,72,75],[75,103,100],[74,102,100],[100,79,74],[102,76,72],[72,100,102],[81,87,106],[106,104,81],[104,106,105],[105,107,104],[87,82,108],[108,106,87],[108,76,78],[78,106,108],[106,78,75],[75,105,106],[107,105,75],[75,72,107],[81,104,107],[107,85,81],[108,107,72],[72,76,108],[85,107,108],[108,82,85],[111,32,36],[36,109,111],[109,36,67],[110,109,68],[68,71,110],[68,109,67],[37,32,111],[111,112,37],[70,37,112],[52,113,71],[113,112,110],[110,71,113],[113,70,112],[113,52,69],[47,69,51],[77,116,114],[114,73,77],[79,73,114],[114,115,79],[77,74,117],[117,116,77],[74,79,115],[115,117,74],[119,124,123],[123,121,119],[120,125,124],[124,119,120],[127,119,121],[121,129,127],[128,120,119],[119,127,128],[118,126,129],[129,121,118],[122,118,121],[121,123,122],[120,128,126],[126,118,120],[125,120,118],[118,122,125],[135,140,146],[146,141,135],[140,139,144],[144,146,140],[141,146,143],[143,138,141],[146,144,145],[145,143,146],[143,145,154],[154,149,143],[144,147,154],[154,145,144],[144,139,136],[136,147,144],[143,149,137],[137,138,143],[154,147,153],[153,149,154],[147,136,148],[148,153,147],[149,153,150],[150,137,149],[132,133,131],[131,134,132],[153,148,133],[133,132,153],[153,132,134],[134,150,153],[133,127,129],[129,131,133],[134,131,129],[129,126,134],[148,152,130],[130,133,148],[130,128,127],[127,133,130],[150,134,130],[130,152,150],[130,134,126],[126,128,130],[135,141,142],[142,140,135],[139,140,142],[141,138,142],[139,142,151],[151,136,139],[138,137,151],[151,142,138],[136,151,152],[152,148,136],[137,150,152],[152,151,137],[179,165,170],[170,164,179],[170,167,169],[169,168,170],[165,162,167],[167,170,165],[164,170,168],[168,163,164],[168,169,178],[178,171,168],[167,173,178],[178,169,167],[162,161,173],[173,167,162],[163,168,171],[171,160,163],[171,178,177],[177,172,171],[173,174,177],[177,178,173],[173,161,174],[160,171,172],[155,157,156],[156,158,155],[172,177,155],[155,158,172],[174,157,155],[155,177,174],[185,186,191],[191,189,185],[190,187,185],[185,189,190],[185,181,183],[183,186,185],[187,182,181],[181,185,187],[184,188,191],[191,186,184],[187,190,188],[188,184,187],[180,184,186],[186,183,180],[182,187,184],[184,180,182],[157,180,183],[183,156,157],[158,156,183],[183,181,158],[172,158,159],[159,176,172],[181,182,159],[159,158,181],[175,160,172],[172,176,175],[163,160,175],[175,166,163],[179,164,166],[166,165,179],[164,163,166],[162,165,166],[162,166,175],[175,161,162],[175,176,174],[174,161,175],[174,176,159],[159,157,174],[159,182,180],[180,157,159],[216,202,207],[207,201,216],[207,204,206],[206,205,207],[202,199,204],[204,207,202],[201,207,205],[205,200,201],[205,206,212],[212,208,205],[204,210,212],[212,206,204],[204,199,198],[198,210,204],[205,208,197],[197,200,205],[208,212,215],[215,209,208],[210,211,215],[215,212,210],[197,208,209],[210,198,211],[192,195,193],[193,196,192],[209,215,192],[192,196,209],[211,195,192],[192,215,211],[216,201,203],[203,202,216],[203,201,200],[199,202,203],[199,203,213],[213,198,199],[200,197,213],[213,203,200],[198,213,214],[214,211,198],[197,209,214],[214,213,197],[211,214,194],[194,195,211],[209,196,194],[194,214,209],[194,228,227],[227,195,194],[194,196,225],[225,228,194],[195,227,226],[226,193,195],[196,193,226],[226,225,196],[227,221,223],[223,226,227],[228,224,221],[221,227,228],[221,217,220],[220,223,221],[224,219,217],[217,221,224],[222,225,226],[226,223,222],[218,222,223],[223,220,218],[224,228,225],[225,222,224],[219,224,222],[222,218,219],[229,18,21],[21,231,229],[29,231,21],[231,29,36],[36,230,231],[36,32,230],[37,30,232],[232,230,37],[32,37,230],[17,18,229],[229,232,17],[30,17,232],[124,235,233],[233,123,124],[122,123,233],[233,234,122],[125,236,235],[235,124,125],[236,125,122],[122,234,236],[238,66,35],[35,240,238],[31,240,35],[238,237,65],[65,66,238],[237,69,65],[113,69,237],[237,239,113],[70,113,239],[239,37,70],[37,239,240],[240,31,37],[17,30,244],[244,243,17],[19,17,243],[37,241,244],[244,30,37],[241,37,31],[243,242,20],[20,19,243],[20,242,27],[241,31,35],[35,242,241],[27,242,35],[188,247,245],[245,191,188],[189,191,245],[245,246,189],[190,248,247],[247,188,190],[246,248,190],[190,189,246],[217,252,249],[249,220,217],[218,220,249],[249,250,218],[219,251,252],[252,217,219],[250,251,219],[219,218,250]],'+
    'diff:"t.jpg"'
    
    
    
    
    ////'pa:[[-102.81632,-76.06944,44.368584],[-53.244957,-44.014286,-116.42184],[61.138237,-85.76128,92.983284],[110.7096,-53.706116,-67.80714],[110.70961,114.272896,-34.318863],[-53.24495,123.964714,-82.933556],[-102.816315,91.90955,77.856865],[61.138245,82.217735,126.471565]],'+
    ////'fa:[[2,0,6],[6,7,2],[0,1,5],[5,6,0],[6,5,4],[4,7,6],[1,3,4],[4,5,1],[3,2,7],[7,4,3],[0,2,3],[3,1,0]]'
    ],[
    "GameLevel",
    'pa:[[-30,-30,0],[-30,-30,-60],[30,-30,0],[30,-30,-60],[30,60,0],[30,60,-60],[-30,60,-60],[-30,90,0],[90,-30,0],[-30,-30,180],[90,-30,180],[-30,90,180],[30,90,0],[90,-30,-60],[90,60,0],[90,90,0],[90,60,-60],[180,-30,0],[180,-30,180],[180,90,0],[180,30,0],[180,-30,90],[240,-30,90],[240,30,0],[240,-30,180],[240,90,180],[240,90,0],[180,90,-90],[240,90,-90],[150,90,-30],[150,90,-90],[-30,90,-30],[-30,90,-90],[240,90,-240],[-30,90,-240],[30,90,-240],[90,90,-240],[90,90,-180],[30,90,-180],[30,60,-180],[30,60,-240],[90,60,-180],[90,60,-240],[-30,-30,-240],[-30,60,-240],[240,-30,-60],[240,-30,-240],[240,60,-240],[240,60,-60],[240,90,-30],[180,90,-30],[240,180,-30],[240,180,-240],[-30,180,-240],[-30,180,-30],[150,180,-30],[150,180,-90],[180,180,-90],[180,180,-30]],'+
    'fa:[[1,3,5],[3,2,4],[4,5,3],[2,0,7],[7,4,2],[2,9,0],[9,2,10],[2,8,10],[11,0,9],[0,11,7],[12,4,7],[13,2,3],[2,13,8],[15,4,12],[4,15,14],[4,16,5],[16,4,14],[8,18,10],[14,17,8],[15,19,14],[16,8,13],[8,16,14],[14,20,17],[20,14,19],[8,21,18],[21,8,17],[23,21,20],[21,23,22],[20,21,17],[21,24,18],[24,21,22],[11,10,25],[10,11,9],[25,18,24],[18,25,10],[25,23,26],[23,25,22],[25,24,22],[28,20,27],[20,28,23],[27,33,28],[33,27,30],[32,29,31],[29,32,30],[37,33,30],[33,37,36],[38,30,32],[30,38,37],[38,34,35],[34,38,32],[37,39,41],[39,37,38],[36,41,42],[41,36,37],[35,42,40],[42,35,36],[38,40,39],[40,38,35],[5,41,39],[41,5,16],[5,6,1],[6,43,1],[43,6,44],[39,6,5],[6,39,44],[39,40,44],[13,46,45],[46,13,43],[3,43,13],[43,3,1],[40,43,44],[43,40,42],[42,46,43],[46,42,47],[48,13,45],[13,48,16],[47,45,46],[45,47,48],[41,48,47],[48,41,16],[42,41,47],[11,12,7],[12,11,15],[11,25,15],[25,19,15],[19,25,26],[49,23,28],[23,49,26],[50,20,19],[20,50,27],[52,28,33],[28,52,51],[51,49,28],[53,35,34],[35,53,36],[52,36,53],[36,52,33],[54,32,31],[32,54,53],[53,34,32],[55,31,29],[31,55,54],[56,29,30],[29,56,55],[57,30,27],[30,57,56],[58,49,51],[49,58,50],[58,27,50],[27,58,57],[26,50,19],[50,26,49],[57,58,51],[57,51,52],[52,56,57],[56,52,53],[56,54,55],[54,56,53]],'+
    'grid:30'
    ]];
    //sel.options[0]=new Option('(cancel)');
    mload={s:'Load'};
    fillLoadSel();
    
    
    var dpr=window.devicePixelRatio || 1,params=Conet.parseUrl();url=params;
    
    
    var mscript={s:'Edit&middot;Run',doctrl:true,lskey_:'w3ditscript1',mcph_:0.35,mcfs:0.07,cos:[
      {v:'<b>Script</b>',x:0.01,y:0.01,w:0.5,h:0.08-0.01,t:'t'},
      {v:'Save in URL',x:0.8,y:0.01,w:0.29,h:0.05,t:'t'},
      {x:0.9,y:0.00,w:0.1,h:0.05,t:'cb'},
      {v:'//...',x:0.01,y:0.06,w:1-0.02,h:0.92,t:'ta'}
    ],setfunc:function(v,initLoad) {
      //
      var s=v?v:this.cos[3].c.value;
      this.cos[3].v=s;
      this.ms=s.length;
      if (initLoad) return;
      //localStorage[this.lskey]=s;
      try {
        eval(s);
        if (this.cos[2].c.checked) replaceUrl({script:s});
      } catch (e) { log(e); }
    }
    };
    
    function dunLoad(v) {
      var rH={xmax:50,ymax:50,zmax:50,xw:3,yw:2,zw:2,x:25,y:25,z:25};
      if (v.startsWith('{')) {
        //alert('Currently not understanding this format: '+v);
        var h=JSON.parse(v).grid,xmin=1000,ymin=1000,zmin=1000,xmax=-1000,ymax=-1000;zmax=-1000;
        if (h instanceof Array) for (var i=0;i<h.length;i++) {
          var a=h[i],z=-a[0],y=a[1],x=a[2];
          rH[z+' '+y+' '+x]=[x,y,z];
          xmin=Math.min(xmin,x);ymin=Math.min(ymin,y);zmin=Math.min(zmin,z);
          xmax=Math.max(xmax,x);ymax=Math.max(ymax,y);zmax=Math.max(zmax,z);
        } else
        for (var k in h) if (h.hasOwnProperty(k)) {
          var a=k.split('_'),z=-parseInt(a[0]),y=parseInt(a[1]),x=parseInt(a[2]);
          rH[z+' '+y+' '+x]=[x,y,z];
          xmin=Math.min(xmin,x);ymin=Math.min(ymin,y);zmin=Math.min(zmin,z);
          xmax=Math.max(xmax,x);ymax=Math.max(ymax,y);zmax=Math.max(zmax,z);
        }
        rH.xmin=xmin;rH.ymin=ymin;rH.zmin=zmin;
        rH.xmax=xmax;rH.ymax=ymax;rH.zmax=zmax;
        rH.x=Math.floor((xmin+xmax)/2);
        rH.y=Math.floor((ymin+ymax)/2);
        rH.z=Math.floor((zmin+zmax)/2);
        //return;
      } else {
      var a=JSON.parse(v.startsWith('[[')?v:'['+v+']');
      //alert(a.length);
      for (var i=0;i<a.length;i++) {
        var ah=a[i];
        for (var j=0;j<(ah[3]||1);j++) {
          var x=ah[0]+j,y=ah[1],z=ah[2];
          rH[z+' '+y+' '+x]=[x,y,z];
        }
      }
      }
      dungeonH=rH;
      generateDungeon(true);
    }
    function dunSave() {
      var rH=dungeonH;
      if (!rH) return undefined;
      var s='';
      for (var z=0;z<rH.zmax;z++) for (var y=0;y<rH.ymax;y++) for (var x=0;x<rH.xmax;x++) {
        if (!rH[z+' '+y+' '+x]) continue;
        var x2;
        for (x2=x+1;x2<rH.xmax;x2++) if (!rH[z+' '+y+' '+x2]) break;
        s+='['+x+','+y+','+z+','+(x2-x)+'],\n';
        x=x2;
      }
      return s.substr(0,s.length-2);
      //return JSON.stringify(dungeonH);
    }
    function vertsMirrorAdd(x,y,z,ox,oy,oz) {
      if (lo.bones) { alert('not for bones');return; }
      var a=[];
      var xv='x',yv='y',zv='z';
      if (isNaN(x.substr(x.length-1))) { xv=x.substr(x.length-1);x=x.substr(0,x.length-1); }
      if (isNaN(y.substr(y.length-1))) { yv=y.substr(y.length-1);y=y.substr(0,y.length-1); }
      if (isNaN(z.substr(z.length-1))) { zv=z.substr(z.length-1);z=z.substr(0,z.length-1); }
      for (var i=0;i<selv.length;i++) {
        let v=selv[i],p=v.p0;
        a.push(pointAdd(
          (ox||0)+x*(xv=='x'?p.x:(xv=='y'?p.y:p.z)),
          (oy||0)+y*(yv=='x'?p.x:(yv=='y'?p.y:p.z)),
          (oz||0)+z*(zv=='x'?p.x:(zv=='y'?p.y:p.z))
          ,v.u,v.v
        ));
      }
      var fa=lo.meshes[lo.selmesh].fa,fal=fa.length,fc=0,inv=false;
      if (x<0) inv=!inv;if (y<0) inv=!inv;if (z<0) inv=!inv;
      for (var i=0;i<fal;i++) {
        var f=fa[i],i0=selv.indexOf(f.v0),i1=selv.indexOf(f.v1),i2=selv.indexOf(f.v2);
        if ((i0!=-1)&&(i1!=-1)&&(i2!=-1)) { fa.push(Pd5.triNew(a[i0],a[inv?i2:i1],a[inv?i1:i2],col));fc++; }
      }
      
      
      selv=a;
      //undo.push(['pn',v]);
      //updateMundo(true);
      log('Verts added '+lo.verts.length+(fc>0?', new tris: '+fc:''));
      //if (fc>0) log('New tris: '+fc);
      meshUpdate();
      //...
    }
    
    mroots=[mmain={s:'Menu',sub:[
    
    mcfile=Conet.fileMenu({fn:'w3dit/files.txt',defFn:'w3dit/lego0.txt',noStartLoad:!params.loadlast,loadf:importS,savef:conetSaveAs,tfHistLskey:'w3ditLoad',tfDir:'..'}),
    
    mfile={s:'IO',sub:[
    {s:'New'},
    
    {s:'Locals.',sub:[
    mload,{s:'Save',a:'Save',ms:'localStorage'},{s:'Save as',ms:'localStorage',doctrl:'Save as'
    ,valuef:function() {
      return fn;
    }
    ,setfunc:function(v) {
      if (v===undefined) return;
      //---
      if (saveGetMenu(v)) if (!confirm('Filename exists, overwrite?')) return;
      
      //log('Saving.');
      
      fn=v;
      save();
      mfile.ms=fn;
    }
    }]},
    
    //Conet.fileMenu({fn:'w3dit/files.txt',defFn:'w3dit/lego0.txt',noStartLoad:1,loadf:importS,savef:conetSaveAs}),
    
    {s:'Import...',doctrl:'Import',lskey:'w3ditimport',ta:true,tacols:36,tarows:15,setfunc:function(v,initLoad) {
      this.value=v;
      if (!initLoad) {
        mfile.ms=v;
        importS(v);
      }
    }
    },
    /*
    {s:'Save as',ms:'Conet',doctrl:'Conet Save as',valuef:function() {
      return mfile.ms?mfile.ms:'objs/...';
    }
    ,setfunc:conetSaveAs},{s:'Save',ms:'Conet',a:'SaveConet',actionf:conetSave},
    */
    
    mexport={s:'<span style="color:#0000aa;">E</span>xport',a:'w3ditexport',r:1,doctrl:'Export',ta:true,tacols:36,tarows:15,close:true,valuef:function() {
      var s=serialize();
      log('Export size: '+s.length+' bytes.');
      return s;
    }
    }
    ,{s:'Export',ms:'Three.js',doctrl:'Export Three.js',ta:true,close:true,valuef:toThree}
    ,{s:'Export',ms:'Obj',doctrl:'Export Obj',ta:true,close:true,valuef:toObj}
    ,{s:'Wloom',ms:'WebGL game test',a:'wloomtest'}]},
    
    //{s:'Edit',sub:[
    
    {s:'Weights',sub:[
      {s:'Weight add',r:true},
      {s:'Weight del',r:true},
      {s:'Weight..',r:true,doctrl:'Weight value'
    ,valuef:function() {
      if (selw.length==0) { log('Select weights.');return undefined; }
      return selw[selw.length-1].w;
    }
    ,setfunc:function(va) {
      var w=parseFloat(va);
      for (var hh=selw.length-1;hh>=0;hh--) selw[hh].w=w;
      lo.recalc=true;
      //alert(va);
    }
      },
      {s:'Mark..',doctrl:'Weight mark',r:true
    ,valuef:function() {
      if (selw.length==0) { log('Select weights.');return undefined; }
      var m=selw[selw.length-1].mark;
      return m===undefined?'':m;
    }
    ,setfunc:function(va) {
      //var w=parseFloat(va);
      for (var hh=selw.length-1;hh>=0;hh--) if (va.length>0) selw[hh].mark=va; else delete(selw[hh].mark);
      //lo.recalc=true;
      //alert(va);
    }
      },
      
    {s:'Scale..',doctrl:'Scale weights (fmt x/x,x,x)',value:1
    ,setfunc:function(v) {
      var a=v.split(','),x,y,z;
      if (a.length==3) {
        x=parseFloat(a[0]);y=parseFloat(a[1]);z=parseFloat(a[2]);
      } else {
        x=parseFloat(a[0]);y=x;z=x;
      }
      for (var i=0;i<selw.length;i++) {
        //onsole.log(selw[i]);
        var p=selw[i].p0;
        p.x*=x;p.y*=y;p.z*=z;
      }
      lo.recalc=true;
      drawNew=true;
      //lert(v);
    }
    },
    
    {s:'Select weights<br>of bone',fs:0.8,actionf:function() {
      //---
      if (selb==-1) return;
      var b=lo.bones[selb];
      for (var w of b.ws) {
        if (selw.indexOf(w)!=-1) continue;
        selw.push(w);
      }
      console.log(selw.length);
      drawNew=true;
      //...
    }
    }  
      
    ]},
    
    {s:'Verts',sub:[
    {s:'Vert add',r:true},
    {s:'Verts add',ms:'1+ weights -> 1+ verts',r:true},
    {s:'Add',ms:'Verts & Tris',r:1,sub:[
    {s:'same pos',actionf:function() {
      vertsMirrorAdd('1','1','1');
    }
    },{s:'x,y,-z',actionf:function () {
      vertsMirrorAdd('1','1','-1');
    }
    },{s:'x,-y,z',actionf:function () {
      vertsMirrorAdd('1','-1','1');
    }
    },{s:'-x,y,z',actionf:function () {
      vertsMirrorAdd('-1','1','1');
    }
    },{s:'variable..',doctrl:'Add Vert-copies (ofs-x,y,z,scale-x,y,z)',value:'0,0,0,"1x","1y","1z"'
    ,setfunc:function(v) {
      var a=JSON.parse('['+v+']');
      console.log(a);
      vertsMirrorAdd(a[3],a[4],a[5],a[0],a[1],a[2]);
    }
    }
    ]},
    {s:'Scale..',doctrl:'Scale Verts (fmt x/x,x,x)',value:1
    ,setfunc:function(v) {
      var a=v.split(','),x,y,z;
      if (a.length==3) {
        x=parseFloat(a[0]);y=parseFloat(a[1]);z=parseFloat(a[2]);
      } else {
        x=parseFloat(a[0]);y=x;z=x;
      }
      for (var i=0;i<selv.length;i++) {
        var p=selv[i].p0;
        p.x*=x;p.y*=y;p.z*=z;
      }
      //lert(v);
    }
    },
    
    {s:'Set..',doctrl:'Set Vert XYZ, *=keep',value:'*,*,*'
    ,setfunc:function(v) {
      var a=v.split(','),x,y,z;
      x=a[0];if (x!='*') x=parseFloat(x);
      y=a[1];if (y!='*') y=parseFloat(y);
      z=a[2];if (z!='*') z=parseFloat(z);
      
      for (var i=0;i<selv.length;i++) {
        var p=selv[i].p0;
        if (x!='*') p.x=x;
        if (y!='*') p.y=y;
        if (z!='*') p.z=z;
      }
      //lert(v);
    }
    },
    
    
    {s:'Vert del',r:true},
          //{s:'Vert col',ms:'Distance blurred'},//r:true},
          //{s:'Vert col',a:'pointcolaround',ms:'Triangles around'},//,r:true},
          //{s:'Vert all'},//later, if there is rubberband this can be removed again
    {s:'TexCoords..',
    doctrl:'u,v values'
    ,valuef:function() {
      if (selv.length!=1) {
        log('Select 1 vert.');
        return undefined;
      }
      var v=selv[0];
      return v.u+','+v.v;
    }
    ,setfunc:function(va) {
      var a=va.split(',');
      var v=selv[0];
      v.u=parseFloat(a[0]);
      v.v=parseFloat(a[1]);
      Paint.drawNewtc();
    }
    //a:'tc'
    },
      {s:'Same<br>normals',fs:0.8,r:1,a:'sameNormals'},
      {s:'Color',sub:[
        {s:'Vert col',ms:'Distance blurred'},//r:true},
        {s:'Vert col',a:'pointcolaround',ms:'Triangles around'},//,r:true},
      ]},
      {s:'Split for<br>each mesh',fs:0.8,a:'vertSplitMesh'},
      {s:'Split for<br>normals',fs:0.8,actionf:vertSplitNorm},//a:'vertSplitNorm'},
      {s:'Select w/ tris<br>of multi mesh',fs:0.8,a:'vertSelMultiMesh'},
    
      {s:'Mark..',r:1,
    doctrl:'Vert mark'
    ,valuef:function() {
      if (selv.length==0) { log('No verts selected.');return; }
      return ''+selv[0].mark;
    }
    ,setfunc:function(va) {
      for (var h=selv.length-1;h>=0;h--) if (va.length==0) delete(selv[h].mark); else selv[h].mark=va;
    }
    //a:'tc'
    },
    {s:'Isolate marked<br>delete other data',fs:0.7,a:'vertIsolate'},
    {s:'Collapse same<br>pos/uv verts to 1',fs:0.7,actionf:function() {
      //alert('hueheu');
      if (selv.length==0) {
        for (var i=0;i<lo.verts.length;i++) selv.push(lo.verts[i]); }
      var c=0;
      for (var i=0;i<selv.length;i++) {
        var vi=selv[i];//,vii=lo.verts.indexOf(vii);
        //onsole.log(vi);break;
        for (var j=selv.length-1;j>i;j--) {
          var vj=selv[j],dx=vi.p1.x-vj.p1.x,dy=vi.p1.y-vj.p1.y,
            dz=vi.p1.z-vj.p1.z,du=vi.u-vj.u,dv=vi.v-vj.v;
          if (dx*dx+dy*dy+dz*dz+du*du+dv*dv>0.001) continue;
          
          for (var h=vj.ts.length-1;h>=0;h--) {
            var t=vj.ts[h];
            if (t.v0==vj) t.v0=vi;
            if (t.v1==vj) t.v1=vi;
            if (t.v2==vj) t.v2=vi;
            vi.ts.push(t);
          }
          vj.ts=[];
          
          //var m=lo.meshes[0];
          //console.log(m.fa.length);
          //for (var h=m.fa.length-1;h>=0;h--) {
          //  var t=m.fa[h];
          //  if (t.v0==vj) t.v0=vi;
          //  if (t.v1==vj) t.v1=vi;
          //  if (t.v2==vj) t.v2=vi;
          //}
          vertDel(vj);c++;
        }
      }
      meshUpdate();
      log('Collapsed '+c+' verts.');
    }
    }]},
    {s:'Mesh',sub:[
      {s:'Mesh add'},
      {s:'Polygon',r:true,keys:[80]},
      {s:'Surrounded tris<br>to current mesh',fs:0.7,a:'trisToMesh'},
      {s:'Surrounded tris<br>properties',fs:0.7,doctrl:'Tri properties'
    ,valuef:function() {
      var touch=false;//(s=='trisToMesh2');
      var s=undefined,diff=false;
      for (var m=0;m<lo.meshes.length;m++) {
        //if (m==lo.selmesh) continue;
        //for (var h=lo.meshes[m].fa.length-1;h>=0;h--) {
        for (var h=0;h<lo.meshes[m].fa.length;h++) {
          var t=lo.meshes[m].fa[h];
          if (touch) {
            if ((selv.indexOf(t.v0)==-1)&&(selv.indexOf(t.v1)==-1)&&(selv.indexOf(t.v2)==-1)) continue;
          } else {
            if (selv.indexOf(t.v0)==-1) continue;
            if (selv.indexOf(t.v1)==-1) continue;
            if (selv.indexOf(t.v2)==-1) continue;
          }
          //lo.meshes[m].fa.splice(h,1);h--;
          //lo.meshes[lo.selmesh].fa.push(t);
          //c++;
          var sh=''+JSON.stringify(t.p);
          console.log(sh);
          if (s===undefined) s=sh; else if (s!==sh) { diff=true;break; }
        }
        if (diff) break;
      }
      return diff?'{"different_values_better_cancel":1}':s;
    }
    ,setfunc:function(v) {
      var touch=false;//(s=='trisToMesh2');
      for (var m=0;m<lo.meshes.length;m++) {
        for (var h=0;h<lo.meshes[m].fa.length;h++) {
          var t=lo.meshes[m].fa[h];
          if (touch) {
            if ((selv.indexOf(t.v0)==-1)&&(selv.indexOf(t.v1)==-1)&&(selv.indexOf(t.v2)==-1)) continue;
          } else {
            if (selv.indexOf(t.v0)==-1) continue;
            if (selv.indexOf(t.v1)==-1) continue;
            if (selv.indexOf(t.v2)==-1) continue;
          }
          t.p=(v==='undefined')?undefined:JSON.parse(v);
        }
      }
      //lo.recalc=true;
      drawNew=true;
    }
      },
      {s:'Touching tris<br>to current mesh',fs:0.7,a:'trisToMesh2'},
      {s:'Change<br>current mesh',fs:0.8,r:true,a:'Mesh change'},
      {s:'Isolate',ms:'Delete other meshes',fs:0.9,a:'meshIsolate'},
      
    {s:'Textures',sub:[
    
    {s:'Diff',doctrl:'Diff'
    ,valuef:function() {
      return lo.meshes[lo.selmesh].diff;
    }
    ,setfunc:function(v) {
      var mesh=lo.meshes[lo.selmesh];
      mesh.diff=v;
      mesh.diffChange=1;
    }
    },
    {s:'Norm',doctrl:'Norm'
    ,valuef:function() {
      return lo.meshes[lo.selmesh].norm;
    }
    ,setfunc:function(v) {
      var mesh=lo.meshes[lo.selmesh];
      mesh.norm=v;
      mesh.normChange=1;
    }
    },
    {s:'Spec',doctrl:'Spec'
    ,valuef:function() {
      return lo.meshes[lo.selmesh].spec;
    }
    ,setfunc:function(v) {
      var mesh=lo.meshes[lo.selmesh];
      mesh.spec=v;
      mesh.specChange=1;
    }
    }
    
    ]},  
      
    {s:'Obj config',ms:'Additional parameters',r:1,jsonCheck:1,fs:1,doctrl:'Obj Params',ta:true,tacols:36,tarows:15
    ,valuef:function() {
      log('possible add. params: '+addParams.join(','));
      var d=Pd5.hcopy(lo,{},addParams);
      
      let bones;
      function replacer(k,v) {
        //---
        //console.log(this);
        //console.log(k);
        if (this===bones) return JSON.stringify(v);
        if (k=='bones') bones=v;
        //if (k=='bones') return JSON.stringify(v);
        return v;
        //...
      }
      
      //let s=JSON.stringify(d);
      //s=s.replaceAll('[','\n[');
      //return s;
      
      //return JSON.stringify(d,replacer,' ');
      //return JSON.stringify(d,undefined,' ');
      return Conet.jsonStringify(d,undefined,undefined,{
        newLine:{'bulletCfg.bones':1,'bulletCfg.pans':1,'bulletCfg.pans.a':1}
      });
    }
    ,setfunc:function(v) {
      try {
      var d=JSON.parse(v);
      for (var i=0;i<addParams.length;i++) lo[addParams[i]]=undefined;
      Pd5.hcopy(d,lo);
      } catch (e) { log(''+e); }
    }
    }
      
      
    ]},
    {s:'Bone',r:true,sub:[
      {s:'Bone add',r:true},
      {s:'Bone del',r:true},
      
    {s:'Name..',doctrl:'Bone name'
    ,valuef:function() {
      if (selb==-1) return;
      return ''+lo.bones[selb].name;
    }
    ,setfunc:function(va) {
      lo.bones[selb].name=va;
    }
    },
    
      
      
    
      {s:(singleBone?Menu.son:Menu.soff),ms:'Single bone edit',a:'singlebone',r:true}
      
      
    ,{s:'Copy',ms:'Bone transform',actionf:function () {
      if (selak==-1) { log('Select animkey first.');return; }
      if (selb!=-1) {
        var ab=lo.anim[selak].bs[selb];
        //new Vecmath.Vec3(0,0,0)
        abCopy.q.set1(ab.q);
        abCopy.t.set1(ab.t);
      }
      //abCopy={q:new Vecmath.Vec3(0,0,0),t:new Vecmath.Vec3(0,0,0)}
      for (let b of lo.bones) delete(b.copyq);
      for (var h=selbo.length-1;h>=0;h--) {
        var bi=selbo[h],b=lo.bones[bi],ab=lo.anim[selak].bs[bi];
        if (!b.copyq) b.copyq=new Vecmath.Vec3(0,0,0);
        if (!b.copyt) b.copyt=new Vecmath.Vec3(0,0,0);
        b.copyq.set1(ab.q);
        b.copyt.set1(ab.t);
      }
      log(selbo.length+' Bone transform copied.');
    }
    //,vcheckf:mvcSelbSelak
    
    },{s:'Paste',ms:'Bone transform',actionf:function() {
      if (selak==-1) return;
      if (selb!=-1) {
        var ab=lo.anim[selak].bs[selb];
        ab.q.x=abCopy.q.x;ab.q.y=abCopy.q.y;ab.q.z=abCopy.q.z;
        ab.t.x=abCopy.t.x;ab.t.y=abCopy.t.y;ab.t.z=abCopy.t.z; 
      }
      var c=0;
      //for (var h=selbo.length-1;h>=0;h--) {
      //  var bi=selbo[h];
      for (let bi=lo.bones.length-1;bi>=0;bi--) {
        let b=lo.bones[bi],ab=lo.anim[selak].bs[bi];
        if (!b.copyq) continue;
        c++;
        ab.q.x=b.copyq.x;ab.q.y=b.copyq.y;ab.q.z=b.copyq.z;
        ab.t.x=b.copyt.x;ab.t.y=b.copyt.y;ab.t.z=b.copyt.z;
      }
      lo.recalc=true;drawNew=true;
      log(c+' Bone transform pasted.');
    }
    //,vcheckf:mvcSelbSelak
    
    }
    
    
    
    ,{s:'Coords..',doctrl:'Coord change,eg x,-2z,y',vcheckf:mvcSelb
    ,valuef:function() {
      return 'x,y,z';
    }
    ,setfunc:function(va) {
      var pa=va.split(',');
      //console.log(pa);
      
      function ch(p,i) {
        var k=pa[i];
        var f=1;
        if (k.length>1) { if (k.substr(0,1)=='-') {
          f=-1;
          k=k.substr(1); 
        }}
        if (k.length>1) {
          f*=parseFloat(k.substr(0,k.length-1));
          k=k.substr(k.length-1);
        }
        return f*(k=='x'?p.x:(k=='y'?p.y:p.z));
      }
      
      function f(i,d) {
        var b=lo.bones[i];
        //onsole.log('f '+i+' '+b.up);
        for (var h=b.ws.length-1;h>=0;h--) {
          var w=b.ws[h];
          var x=ch(w.p0,0),y=ch(w.p0,1),z=ch(w.p0,2);
          w.p0.x=x;w.p0.y=y;w.p0.z=z;
        }
        //if (false)
        if (d>0)
        for (var h=lo.anims.length-1;h>=0;h--) {
          var a=lo.anims[h].a;
          for (var j=a.length-1;j>=0;j--) {
            var ab=a[j].bs[i];
            var x=ch(ab.t,0),y=ch(ab.t,1),z=ch(ab.t,2);
            ab.t.x=x;ab.t.y=y;ab.t.z=z;
          }
        }
        for (var h=lo.bones.length-1;h>=0;h--) {
          var bh=lo.bones[h];
          if (bh.up==b) f(h,d+1);
        }
      }
      
      //onsole.log(lo.anims);
      
      f(selb,0);
      
      lo.recalc=true;
      drawNew=true;
      //alert(va);
    }
    }
    
    ,{s:'Scale..',ms:'with subbones & anims',doctrl:'Scale with subbones & anims',value:1
    ,setfunc:function(v) {
      //boneScale(selb||0,parseFloat(v));
      Pd5.modBone({o:lo,bi:selb||0,s:parseFloat(v),rec:1});
      //console.log(lo.bones[selb||0]);
      //alert(v);
      lo.recalc=true;
      drawNew=true;
    }
    }
    
        //lo.recalc=true;drawNew=true;
    
      
    ]},
    {s:'Anim',sub:[
    //matoggle={s:'\u25ba',r:true,ms:'Toggle animation'},
    
    {s:'New..',doctrl:'New anim name'
    ,valuef:function() {
      if (!lo.anims||(lo.anims.length==0)) return 'anim0';
      return lo.anims[lo.selAnim].name+'_';
    }
    ,setfunc:function(va) {
      //lo.anims[lo.selAnim].name=va;
      for (var h=lo.anims.length-1;h>=0;h--) if (lo.anims[h].name==va) { log('New anim name already exists.');return; }
      var a=[];
      //if (2 models.. HERENAO
      //log('anim new '+threeEnv.os.length);
      //console.log(threeEnv.os);
      var copyAnimBetween2=false;//...todo: make own menu
      if (copyAnimBetween2&&(threeEnv.os.length==2)) {
        var oo=threeEnv.os[0];
        var ah=oo.animh[va];
        if (!ah) { alert('No anim '+va+' found in other object.');return; }
        var ao=ah;//.a
        for (var h=0;h<ao.length;h++) {
          var ako=ao[h],bs=[];
          for (var i=0;i<lo.bones.length;i++) {
            var name=lo.bones[i].name;
            var bi=boneIndex(oo,name);
            if (bi==-1) { alert('No bone '+name+' found in other object.');return; }
            var bo=ako.bs[bi];
            bs.push({t:{x:bo.t.x,y:bo.t.y,z:bo.t.z},q:{x:bo.q.x,y:bo.q.y,z:bo.q.z}});
          }
          a.push({t:ako.t,bs:bs});
        }
        //alert(threeEnv.os.indexOf(lo));
        //return;
      } else {
        var ao=lo.anims[lo.selAnim].a;
        for (var h=0;h<ao.length;h++) {
          var ako=ao[h],bs=[];
          for (var i=0;i<ako.bs.length;i++) {
            var bo=ako.bs[i];
            bs.push({t:{x:bo.t.x,y:bo.t.y,z:bo.t.z},q:{x:bo.q.x,y:bo.q.y,z:bo.q.z}});
          }
          var akon={t:ako.t,bs:bs};
          if (ako.text!==undefined) akon.text=ako.text;
          a.push(akon);
        }
      }
      var na={name:va,a:a};
      if (lo.animFn) na.animFn=lo.animFn;
      lo.anims.push(na);
      console.log(lo.anims);
      lo.anims.sort(function(a,b) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      }
      );
      lo.selAnim=lo.anims.indexOf(na);
      lo.anim=lo.anims[lo.selAnim].a;
      fillManims();
      log('New anim created.');
    }
    },
    
    {s:'Rename..',doctrl:'Anim name'
    ,valuef:function() {
      return lo.anims[lo.selAnim].name;
    }
    ,setfunc:function(va) {
      for (var h=lo.anims.length-1;h>=0;h--) if (lo.anims[h].name==va) { log('Anim name already exists.');return; }
      var an=lo.anims[lo.selAnim];
      an.name=va;
      lo.anims.sort(function(a,b) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      }
      );
      lo.selAnim=lo.anims.indexOf(an);
      fillManims();
    }
    },
    
    {s:'Set fn..',doctrl:'Anim fn'
    ,valuef:function() {
      return lo.anims[lo.selAnim].animFn||'empty, o.animFn='+lo.animFn;
    }
    ,setfunc:function(va) {
      var an=lo.anims[lo.selAnim];
      if (!va) delete(an.animFn); else {
        an.animFn=va;
        if (!lo.animFn) {
          lo.animFn=va;
          log('New lo.animFn (on save only anim is saved).');
        }
      }
      fillManims();
    }
    },
    
    
    {s:'Delete',actionf:function() {
      lo.anims.splice(lo.selAnim,1);
      lo.selAnim=0;
      lo.anim=lo.anims[lo.selAnim].a;
      fillManims();
      selak=-1;
      lo.recalc=true;//drawNew=true;
      log('Anim deleted.');
    }
    },
    
    {fs:0.9,s:'Animkey',r:true,sub:[
    
    mlh={s:'A.key add'},{s:'A.key del'},{s:'Edit..',ms:'ak bone',doctrl:'Edit ak bone'
    
    ,valuef:function() {
      if (!((selMode==BONES)&&(selak!=-1)&&(selb!=-1))) {
        log('Select bone and anim key first.');
        return;
      }
      var ab=lo.anim[selak].bs[selb];
      switch (mselbi) {
        case 0:return ab.q.x;
        case 1:return ab.q.y;
        case 2:return ab.q.z;
        case 3:return ab.t.x;
        case 4:return ab.t.y;
        case 5:return ab.t.z;
      }
    }
    ,setfunc:function(va) {
      var f=parseFloat(va);
      var ab=lo.anim[selak].bs[selb];
      switch (mselbi) {
        case 0:ab.q.x=f;delete(ab.q.w);break;
        case 1:ab.q.y=f;delete(ab.q.w);break;
        case 2:ab.q.z=f;delete(ab.q.w);break;
        case 3:ab.t.x=f;break;
        case 4:ab.t.y=f;break;
        case 5:ab.t.z=f;break;
      }
      updateSelbMs();
      lo.recalc=true;
    }
    
    
    },{s:'Reset',ms:'ak bone rotation',a:'rotreset'}
    ,maklocal={checkbox:1,ms:'pos local'}
    ,makall={checkbox:1,ms:'change for all ak'}
    /*
    ,{s:'Mark..',doctrl:'Anim key mark'
    ,valuef:function() {
      if (selak==-1) {
        log('Select anim key first.');
        return;
      }
      return ''+lo.anim[selak].mark;
    }
    ,setfunc:function(va) {
      lo.anim[selak].mark=va;
    }
    }
    */
    /*
    ,{s:'Text..',doctrl:'Anim key text'
    ,valuef:function() {
      if (selak==-1) {
        log('Select anim key first.');
        return;
      }
      return ''+lo.anim[selak].text;
    }
    ,setfunc:function(va) {
      lo.anim[selak].text=va;
    }
    }
    */
    
    /*
    ,{s:'Text..',r:true,doctrl:true,mcph:0.35,mcfs:0.07,cos:[
      {v:'<b>Anim key text</b>',x:0.01,y:0.01,w:0.5,h:0.08-0.01,t:'t'},
      {v:'//...',x:0.01,y:0.06,w:1-0.02,h:0.92,t:'ta'}]
    ,valuef:function() {
      if (selak==-1) {
        log('Select anim key first.');
        return;
      }
      var s=''+lo.anim[selak].text;
      this.cos[1].v=s;
      if (this.cos[1].c) this.cos[1].c.value=s;
      return 1;
    }
    ,setfunc:function() {
      //
      var s=this.cos[1].c.value;
      //console.log('Animkey text.. s='+s+' v='+v);
      this.cos[1].v=s;
      lo.anim[selak].text=s;
    }
    },
    */
    
    ,{s:'Text..',ms:'buba',fs:1,doctrl:'AkText',ta:true,tacols:36,tarows:15
    ,valuef:function() {
      if (selak==-1) {
        log('Select anim key first.');
        return;
      }
      return ''+lo.anim[selak].text;
    }
    ,setfunc:function(v) {
      lo.anim[selak].text=v;
    }
    }
    
    
    ]}
    
    //,manims={s:'Anims',r:true}
    
        ]}
    
    //]}
    ,manims={s:'Anims',r:true},
    
    
    {s:'View',sub:[
    mviewmode={s:'ViewMode',fs:0.8,r_:true,ms:'Mesh',sub:[{s:'Mesh',a:'vmmesh'},{s:'Texture',a:'vmtex'},{s:'Bones',a:'vmbones'}]},
    {s:'View reset'},{s:'View reset',ms:'only rotation',r:1,a:'viewResetRot'},
    
    {s:'Set View..',doctrl:'Set View aX,aY'
    ,valuef:function() {
      return sfe(aX)+','+sfe(aY);
    }
    ,setfunc:function(v) {
      var a=v.split(',');
      aX=parseFloat(a[0]);
      aY=parseFloat(a[1]);
      //lert(v);
    }
    },
    
    
    
    {s:'Fullscreen'},
    //mThreeWires={checkbox:1,ms:'Three Wires',stay:1,lskey:'threewires',actionf:meshUpdate},
    //mThreePoints={checkbox:1,ms:'Three Points',stay:1,lskey:'threepoints',actionf:meshUpdate},
    {s:'Log view',ms:'Angle, Scale, Transl',r:1,actionf:function() {
      log('aX='+sfe(aX)+' aY='+sfe(aY)+' scale='+sfe(scale)+' tr='+tr);
    }
    }
    ,mswitch={s:'Switch',r:1,ms:'between multiple objs',actionf:function() {
      var os=threeEnv.os,i0=os.indexOf(lo),i1=(i0+1)%os.length;
      lo=os[i1];
      mfile.ms=lo.fn?lo.fn:'';
      mcfile.curFn=mcfile.ms=lo.fn?lo.fn:'';
      fillManims();
      Paint.set3d(lo,selv);
      log('os.len='+os.length+' o.i: '+i0+'->'+i1);
    }
    }
    ,{s:'Dtscale',autoval:1,sub:[{s:'1'},{s:'2'},{s:'3'},{s:'4'},{s:'5'},{s:'6'},{s:'7'},{s:'8'},{s:'9'},{s:'0'}]
    ,setfunc:function(v) {
      v=parseInt(v);
      var vh;
      switch (v) {
      case 0:vh=0;break;
      case 1:vh=0.01;break;
      case 2:vh=0.1;break;
      case 3:vh=0.2;break;
      case 4:vh=0.5;break;
      case 5:vh=1;break;
      case 6:vh=2;break;
      case 7:vh=5;break;
      case 8:vh=10;break;
      case 9:vh=20;break;
      }
      dtscale=vh;//gamespeed=vh;
      log('dtscale='+dtscale);
      
      //alert(v);
    }
    }
    
    ]},
    
    
    Conet.fileMenu({fn:'w3dit/script/files.txt',defFn:'beam0.txt',noStartLoad:!params.startLastScript
    ,loadList:1
    ,m:{r:1,s:'Script',sub:[mscript,
    {s:'\u25ba Run',vertCenter:1,actionf:function() {
      var s=mscript.cos[3].v;
      try {
        eval(s);
      } catch (e) { log(e); }
    }
    }]},
    loadf:function(v,atStart) {
      //log('script loading '+v);
      Conet.download({fn:'w3dit/script/'+v,f:function(v) {
        mscript.cos[3].v=v;
        mscript.ms=v.length;
        //if (!atStart)
        try {
          eval(v);
        } catch (e) { log(e); }
      }
      });
    }
    ,savef:function(v) {
      if (v===undefined) { log('Script.save: no filename.');return; }
      Conet.upload({fn:'w3dit/script/'+v,data:mscript.cos[3].v,log:log});
    }
    }),
    
    
    {s:'Util',sub:[
    
    //{s:'View',sub:[
    //mviewmode={s:'ViewMode',fs:0.8,r_:true,ms:'Mesh',sub:[{s:'Mesh',a:'vmmesh'},{s:'Texture',a:'vmtex'},{s:'Bones',a:'vmbones'}]},
    //{s:'View reset'},{s:'View reset',ms:'only rotation',r:1,a:'viewResetRot'},{s:'Fullscreen'},]},
    
    //{s:'Config',sub:[
    {s:'Clear log'},mgrid={s:'Grid..',ms:grid,lskey:'w3ditGrid',doctrl:'Grid, e.g. 30, 0=none'
    ,valuef:function() {
      return grid;
    }
    ,setfunc:function(v) {
      grid=parseFloat(v);//log('Grid set to '+grid+'.');
      this.ms=grid;
    }
    },{s:'Color',display3:function(ctx) {
      var c=(col?col:dcol);
      ctx.fillStyle='rgb('+c.r+','+c.g+','+c.b+')';
      ctx.fillRect(this.x+2,this.y+2,this.w-4,14);
    }
    ,mGet:function() {
      log('Enter color.');
      var c=(col?col:dcol);
      return c.r+','+c.g+','+c.b;
    }
    ,mSet:function(v) {
      var a=v.split(',');
      col={r:a[0],g:a[1],b:a[2]};
      log('Color set to '+v+'.');
      //---
    }
    }
    
    ,mLoadMultiple={checkbox:1,ms:'Load multiple',r:1}
    
    //m.s=kea[i].off?'\u2610':'\u2611';
    //for (var h=0;h<k;h++) mtracks.sub.push({s:'\u2611',ms:'Track '+(h+1),a:'track',fs:1.5,tracki:h,stay:true});
    
    
    //]}
    ,{s:'Help'/*,a:'help'*/} 
      
      
      ,{s:'Dungeon',a:'_subdun',r:1,fs:0.8,sub:[
    Conet.fileMenu({fn:'deep/filesW3dit.txt',defFn:'deep/map0.txt',noStartLoad:1,
    loadf:function(v,atStart) {
      //log('script loading '+v);
      Conet.download({fn:v,f:function(v) {
        dunLoad(v);
      }
      });
    }
    ,savef:function(v) {
      if (v===undefined) { log('Dungeon.save: no filename.');return; }
      Conet.upload({fn:v,data:dunSave(),log:log});
    }
    }),
    //{s:'Dungeon'}
    {s:'Generate<br>Dungeon',r_:1,fs:0.8,a:'Dungeon'}
    ,{s:'Import<br>Dungeon',fs:0.8,doctrl:'Import',ta:true,tacols:36,tarows:15,setfunc:dunLoad}
    ,{s:'Export<br>Dungeon',fs:0.8,a:'DungeonExport',doctrl:'Export',ta:true,tacols:36,tarows:15,close:true,valuef:dunSave}
    ]},
    {s:'Bulletize',ms:'sets bullet.js structure'},
    {s:'BulletTest',actionf:bulletTest},
    
    {s:'Screendumps',fs:0.8,actionf:function() {
      if (screenDumps.length==0) { alert('No screendumps.');return; }
      var c=document.createElement('canvas'),cdim=screenDumps[0],//threeEnv.c
          cw=cdim.width/2,ch=cdim.height/2;
      c.width=cw*4;c.height=ch*8;
      var ct=c.getContext('2d');
      //ct.fillStyle='rgb(250,0,0)';ct.fillRect(0,0,100,100);
      //for (var h=0;h<screenDumps.length;h++) 
      var h=0;
      for (var y=0;y<8;y++) for (var x=0;x<4;x++) {
        if (h>=screenDumps.length) break;
        ct.drawImage(screenDumps[h],x*cw,y*ch,cw,ch);h++;
      }
      window.open(c.toDataURL("image/png"),'PngExport');
    }
    }
    
    
    ]},
    //manims={s:'Anims',r:true},
    ]},
    mmode={s:'Mode',msid:'mmode',ms:(selMode==VERTS?'Verts':(selMode==WEIGHTS?'Weights':'Bones'))}//keys:[77]
    ,{s:'\u2192 Paint',a:'Paint'}
    ,matoggle={s:'\u25ba',ms:'Toggle animation'}
    ,mCanvasOverlay={checkbox:1,checked:1,ms:'Canvas Overlay',stay:1,actionf:function() {
      canvas.style.visibility=this.checked?'visible':'hidden';
    }
    }
    
    //,{s:'Test Img',ms:'Img Test',actionf:menuSetIcon}
    ];
    
    Menu.init(mroots,{diw:diw});
    
    Menu.tafs=0.1;
    Menu.colBg='rgba(130,130,130,0.8)';
    Menu.colNoinp='#888';
    Menu.switchf=menuSwitch;
    Menu.draw();
    
    
    //var s=document.URL;
    //edit=(s.indexOf('edit')!=-1);
    
    
    			var cw=400,ch=400;//,cw2=cw*3,ch2=ch*3;
    //			var camera=new THREE.OrthographicCamera(cw*3/-2,cw*3/2,ch*3/2,ch*3/-2,-10000,10000);
    			var camera=new THREE.OrthographicCamera(-450*(cw/ch),450*(cw/ch),450,-450,-10000,10000);
    				camera.position.z=1500;
    threeEnv.camera=camera;
    threeEnv.texLoaded=threeRender;
    threeEnv.nocalc=1;
    threeEnv.noRotLight=1;
    threeEnv.noThreeTL=1;
    //threeEnv.path='../shooter/';
    var el=threeInit({cw:cw,ch:ch,noDomAdd:1});
    document.body.insertBefore(el,document.getElementById('canvas'));
    
    threeEnv.rotBase=new THREE.Object3D();			threeEnv.scene.add(threeEnv.rotBase);
    threeEnv.base=new THREE.Object3D();			threeEnv.rotBase.add(threeEnv.base);
    
    el.style.top='450px';
    el.style.backgroundColor='#444';
    
    var te=THREE.ImageUtils.loadTexture('paint/point9x9.png');
    var ma=new THREE.ParticleBasicMaterial({size:5,sizeAttenuation:false,map:te,transparent:true,depthTest:false});
    threeEnv.partMat=ma;
    threeEnv.wireMat=new THREE.MeshBasicMaterial({wireframe:true,depthTest:false});threeEnv.wireMat.depthTest=false;
    threeEnv.partSelMat=new THREE.ParticleBasicMaterial({size:15,sizeAttenuation:false,map:te,transparent:true,depthTest:false});
    //var ge=new THREE.Geometry();
    //ge.vertices.push(new THREE.Vector3(0,0,0));
    //ge.vertices.push(threeEnv.p0=new THREE.Vector3(10000,0,0));
    //var pa=new THREE.ParticleSystem(ge,ma);
    //pa.sortParticles=true;
    //threeEnv.base.add(pa);
    
    
    
    //if (true) {
    
    //var s=document.URL,params={};
    //var i=s.indexOf('?');
    //if (i!=-1) {
    //  s=s.substring(i+1);
    //  var a=s.split('&');
    //  for (i=0;i<a.length;i++) {
    //    s=a[i];
    //    var b=s.split('=');
    //    params[b[0]]=b.length>1?b[1]:'1';
    //  }
    //  //alert(params);
    //}
    
    if (params.script) {
      //alert(decodeURIComponent(params.script));
      var script=decodeURIComponent(params.script);
      mscript.cos[3].v=script;//before: mscript.value
      mscript.ms=script.length;
      try {
        eval(script);
        //replaceUrl({script:v});
      } catch (e) { log(e); }
    }
    
    if (params.load) { //document.URL.indexOf('?load')!=-1) {
      //var i=1;
      var i=3;//sel.options.length-1;
      //onsole.log('w3dit.loaded sel.options=');
      //onsole.log(sel.options);
      if (params.load.length>1) {
        //onsole.log(sel.options[sel.options.length-12]);
        for (var h=sel.options.length-1;h>=0;h--) {
          if (sel.options[h].text=='localStorage:'+params.load) { i=h;break; }
        }
      }
      sel.selectedIndex=i;
      load(i);
    } else doNew();
    
    
    ot=new Date().getTime();
    menuReset();
    draw();
    
    
    
    
    //---temp start config
    //selMode=BONES;
    //checkAddRecent(mlh);menuReset();
    //lo.ta=400;lo.animStop=true;lo.recalc=true;
    
    //checkAddRecent(mselm);selMode=BONES;lo.animStop=true;//lo.recalc=true;//selak=0;
    //selak=0;selakto=lo.anim[selak].t;selakf=lo.aT/abox.w;lo.ta=selakto*1000;lo.recalc=true;
    //selb=1;menuReset();
    if (1) paintLoad();
    
    window.addEventListener('resize',resize);
    resize();
    
    if ((''+document.URL).indexOf('bullettest')!=-1) menuSwitch({},'Bullet Test');
    
    
    
    //threeInit();
    //			threeAnimate();
  }
  W3dit.shortKeys=function(kc) {
    if (Menu.mcontrol) return;
    var shift=keyA[16];
    var ctrl=keyA[17];
    switch (kc) {
      case 69:
        Menu.cmenu=mexport;
        Menu.action();
        Menu.press=undefined;
        Menu.colorCmenu();
        break;
      case 88:
        if (!dungeonH) break;
        if (ctrl) dungeonH.xw=Math.max(1,dungeonH.xw+(shift?-1:1));
        else dungeonH.x+=(shift?-1:1);
        dungeonH.setpall();drawNew=true;
        //og('shortkey '+dungeonH.x+' '+dungeonH.y+' '+dungeonH.z);
        break;
      case 89:
        if (!dungeonH) break;
        if (ctrl) dungeonH.yw=Math.max(1,dungeonH.yw+(shift?-1:1));
        else dungeonH.y+=(shift?-1:1);
        dungeonH.setpall();drawNew=true;
        break;
      case 90:
        if (!dungeonH) break;
        if (ctrl) dungeonH.zw=Math.max(1,dungeonH.zw+(shift?-1:1));
        else dungeonH.z+=(shift?-1:1);
        dungeonH.setpall();drawNew=true;
        break;
      case 32:
        var rH=dungeonH;
        if (!rH) break;
        //og('shorkeys space');
        for (var x=0;x<rH.xw;x++) for (var y=0;y<rH.yw;y++) for (var z=0;z<rH.zw;z++) {
          var k=(rH.z+z)+' '+(rH.y+y)+' '+(rH.x+x);
          if (dungeonH[k]) delete dungeonH[k]; else dungeonH[k]=[rH.x+x,rH.y+y,rH.z+z];
        }
        generateDungeon(true);
        break;
      case 48://0
        break;
    }
    
    
    
    if ((kc>=48)&&(kc<=57)) if (!shift&&!ctrl) {
      var c=kc-48;
      var vh;
    switch (c) {
      case 0:vh=0;break;
      case 1:vh=0.01;break;
      case 2:vh=0.1;break;
      case 3:vh=0.2;break;
      case 4:vh=0.5;break;
      case 5:vh=1;break;
      case 6:vh=2;break;
      case 7:vh=5;break;
      case 8:vh=10;break;
      case 9:vh=20;break;
    }
      dtscale=vh;//gamespeed=vh;
      console.log('dtscale='+dtscale);
    }
    
    
    //og('W3dit.shortkeys key '+kc);
    
  }
  W3dit.serialize1=function(o) {
    lo=o;
    return serialize();//...
  }
  //-----
  W3dit.meshUpdate=meshUpdate;
  console.log('W3dit '+version);
  //---
}
)(W3dit);



//fr o,1
//fr o,1,28,12
//fr o,1,28,14
//fr o,1,28,16
//fr o,1,40,52
//fr o,1,48,70
//fr o,1,48,113
//fr o,1,49,18
//fr o,1,49,18,14
//fr o,1,49,18,14,2
//fr o,1,49,18,18
//fr o,1,127,107
//fr o,1,127,154
//fr o,1,127,155
//fr o,1,127,156
//fr o,1,127,157
//fr o,1,127,159
//fr o,1,127,229
//fr o,1,127,229,4
//fr o,1,127,230
//fr o,1,127,240
//fr o,1,127,250
//fr o,1,127,253
//fr o,1,127,278,42
//fr o,1,127,287
//fr o,1,127,288
//fr o,1,127,380
//fr o,1,127,381
//fr o,1,127,389
//fr o,1,127,403
//fr o,1,127,405
//fr o,1,127,405,1
//fr o,1,127,437
//fr o,1,127,437,1
//fr o,1,129
//fr p,42,17
