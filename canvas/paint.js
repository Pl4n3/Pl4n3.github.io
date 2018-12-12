var Paint={};
(function(Paint) {
  var canvas,ix,iy,id,iw,ih,oix,oiy,scale,oscale;
  var version='0.1.3618 ';//FOLDORUPDATEVERSION
  var md=false,imx,imy,mx,my,omx,omy,moused=new Array(4),br=0,bg=0,bb=250,bp=0.1,bra=10;
  var touches={},TM_DRAW=1,TM_IMG=2,touchMode=TM_DRAW,touchlast;
  //var menuroots,menus;
  var pickm,merase,mroots,mcolor,munerase,mcanvas,mpr,mbp,mbra,mrect,mmenu,mpage,mgif,mpat,mnorm,msetcol,
      mcut,mgiflb,mgiftr,mbrushnorm,mcolors,mcopybrush,mcutout,mcomain,mtexify,mvertsel,mpolygon,mselmv,
      mbackground,mscript,mnormblend,mstayselv,mrload;
  var replay=false;//var erase=false,unerase=false,replay=false;
  var pra=[],pri=0,prr=-1,prg=-1,prb=-1,prp=-1,prra=-1,priw,prih,prmode,prgif=false,egif;//,skipDemo=true;,prer,pruner
  var sr={x:10,y:10,w:20,h:20};//{x:170,y:110,w:10,h:20};
  var srm=0,movep={x:0,y:0},srid,lsKey='wepaintf',nbid;
  var MDRAW=0,MSELR=1,MMOVE=2,MERASE=3,MUNERASE=4,MREPLAY=5,MCOPYBRUSH=6,MCUTOUT=7,mode=MDRAW;
  var pages,pagei=0,loadpagec=1,loadcs='',brushpat=false,normal;
  var NMDOWN=0,NMUP=1,NMCOL=2,normalMode=NMCOL,eraseConf={bp:0.3,bra:50},drawConf={};
  var normalBlend=false,npi=-1,dpi=-1,spi=-1,drawArea=undefined;
  var prChangeDim=true,prFx=1,prFy=1,prGifNum=20,prGifAlpha=true,prGifDelay=200;
  var light={x:-10,y:-10,z:10};keyd=[],nbm=0;//normalblendmode
  var sal=true,medit3d;//meve=false;//menues and events?//standalone
  var lo,tccanvas,selv=[],wasTcDrag=false,isTouch=false,isInvertgreen=true;//w3dit object
  var oda,pali={},trai=1,addPageAfterLoad=false,loadScale=1,lastBrush={x:0,y:0},copybrush,mtools,getva=[],
      mprocesscs,idimda,idima,adata=[],clearCanv=true,urls={},mTridatavAdd;
  var pal=[
  {r:119,g:17,b:18},//0
  {r:4,g:119,b:242},
  {r:8,g:93,b:180},
  {r:12,g:72,b:119},
  {r:35,g:98,b:139},
  {r:91,g:135,b:163},
  {r:76,g:116,b:130},
  {r:17,g:72,b:86},
  {r:36,g:93,b:103},
  {r:14,g:53,b:59},
  {r:40,g:70,b:74},//10
  {r:63,g:111,b:92},
  {r:27,g:71,b:44},
  {r:12,g:240,b:7},
  {r:46,g:102,b:45},
  {r:180,g:220,b:166},
  {r:28,g:62,b:7},
  {r:48,g:106,b:9},
  {r:39,g:85,b:9},
  {r:95,g:182,b:40},
  {r:71,g:135,b:23},//20
  {r:25,g:41,b:13},
  {r:43,g:65,b:26},
  {r:106,g:146,b:68},
  {r:58,g:85,b:30},
  {r:102,g:121,b:83},
  {r:69,g:105,b:26},
  {r:92,g:117,b:63},
  {r:77,g:96,b:55},
  {r:116,g:136,b:91},
  {r:96,g:141,b:35},//30
  {r:114,g:161,b:46},
  {r:85,g:117,b:37},
  {r:136,g:180,b:39},
  {r:140,g:168,b:73},
  {r:155,g:203,b:31},
  {r:201,g:207,b:124},
  {r:15,g:15,b:10},
  {r:65,g:35,b:4},
  {r:204,g:101,b:8},
  {r:107,g:55,b:5},//40
  {r:170,g:86,b:9},
  {r:248,g:117,b:4},
  {r:144,g:68,b:11},
  {r:191,g:31,b:8},
  {r:245,g:6,b:4},
  {r:249,g:249,b:249},
  {r:192,g:192,b:192},
  {r:168,g:168,b:168},
  {r:136,g:136,b:136},
  {r:124,g:124,b:124},//50
  {r:116,g:116,b:116},
  {r:108,g:108,b:108},
  {r:100,g:100,b:100},
  {r:92,g:92,b:92},
  {r:84,g:84,b:84},
  {r:76,g:76,b:76},
  {r:68,g:68,b:68},
  {r:60,g:60,b:60},
  {r:52,g:52,b:52},
  {r:44,g:44,b:44},//60
  {r:36,g:36,b:36},
  {r:26,g:26,b:26},
  {r:4,g:4,b:4},
  ];
  /*
  var cutouts=[
    //{x:0,   y:0,  w:677,h:1024,cx:338,cy:0,  ps:[{x:2,y:890}]},
    //{x:698, y:441,w:639,h:579, cx:315,cy:500,ps:[{x:24,y:-476},{x:-240,y:-130}]},
    //{x:687, y:9,  w:292,h:436, cx:170,cy:340},
    //{x:985, y:3,  w:219,h:163, cx:60, cy:60, ps:[{x:113,y:26}]},
    //{x:1023,y:207,w:224,h:180, cx:40, cy:40},
  
    {x:0,   y:0,  w:677,h:1024,cx:338+0,  cy:0+0,    ps:[{x:2+338+0,y:890+0+0}]},
    {x:698, y:441,w:639,h:579, cx:315+698,cy:500+441,ps:[{x:24+315+698,y:-476+500+441},{x:-240+315+698,y:-130+500+441}]},
    {x:687, y:9,  w:292,h:436, cx:170+687,cy:340+9},
    {x:985, y:3,  w:219,h:163, cx:60+985, cy:60+3,   ps:[{x:113+60+985,y:26+60+3}]},
    {x:1023,y:207,w:224,h:180, cx:40+1023,cy:40+207},
  ];*/
  var cutout={
    rects:[
    /*
    {x:0,   y:0,  w:677,h:1024,cx:338+0,  cy:0+0,    ps:[{x:2+338+0,y:890+0+0}]},
    {x:698, y:441,w:639,h:579, cx:315+698,cy:500+441,ps:[{x:24+315+698,y:-476+500+441},{x:-240+315+698,y:-130+500+441}]},
    {x:687, y:9,  w:292,h:436, cx:170+687,cy:340+9},
    {x:985, y:3,  w:219,h:163, cx:60+985, cy:60+3,   ps:[{x:113+60+985,y:26+60+3}]},
    {x:1023,y:207,w:224,h:180, cx:40+1023,cy:40+207},
    */
    ],
    bones:[
    /*
    {i:0,p:-1,pp:-1},
    {i:1,p:0,pp:0},
    {i:2,p:1,pp:0},
    {i:3,p:1,pp:1},
    {i:4,p:3,pp:0}
    */
    ]
  },cutoutP;
  var canvlo,wasBrush,acoH={},canvm,cfmenu,tridata=undefined,canvDraw=true,ctdraw,changec=0;
  //{verts:[[0,0],[1,0],[0.5,0.5]],tris:[[0,1,2]]};
  //seg0=cut(0,0,677,1024,338,0,0,0);
  //seg0.segs=[];var s1,s2;
  //seg0.segs.push(s1=cut(698,441,639,579,315,500,340-338,890));//x340//600
  //s1.segs=[];
  //s1.segs.push(     cut(687,9,  292,436,170,340,24,-476));
  //s1.segs.push(s2=cut(985,3,219,163,60,60,-240,-130));//361,230
  //s2.segs=[];
  //s2.segs.push(cut(1023,207,224,180,40,40,113,26));
  //--- tried (but failed) to examine the scroll error http://jsfiddle.net/7ouvucg9/
  
  
  Paint.menuSwitch=function (m,a) {
    //og('menuswitch '+a);
    var replayStarted=false;
    if (a=='Brush'||a=='Pick') {
      //lert('mode='+mode);
      if (mode!=MDRAW) {
        setMode(MDRAW);
        if (drawConf.bra) { bra=drawConf.bra;mbra.s=''+bra; } else drawConf.bra=bra;
        if (drawConf.bp) { bp=drawConf.bp;mbp.s=''+bp; } else drawConf.bp=bp;
      } else {
        pickm=m;
        m.s='Pick';
      }
    } else if (a=='Export') {
      ////self.location=canvas.toDataURL("image/png");
      //if (pages) {
      //  var c=document.createElement('canvas');
      //  c.width=iw*pages.length;
      //  c.height=ih;
      //  var ct=c.getContext('2d');
      //  //ct.fillStyle='#ff0000';
      //  //ct.fillRect(0,0,10,10);
      //  for (var i=0;i<pages.length;i++) {
      //    ct.putImageData(pages[i].id,i*iw,0);
      //  }
      //  window.open(c.toDataURL("image/png"),'PngExport'); 
      //} else 
      //  window.open(canvas.toDataURL("image/png"),'PngExport');
      windowDataUrl(Paint.saveCanvas().toDataURL('image/png'),'PngExport');
    } else if (a=='Info') {
      log('Draw: left mouse drag/1 touch drag<br>Position image: right mouse drag, mousewheel/2 touch drag, distance<br>Pick an other color: click/touch color menu, then image');
    } else if (m==merase) {
      if (mode!=MERASE) {
        setMode(MERASE);
        if (eraseConf.bra) { bra=eraseConf.bra;mbra.s=''+bra; } else eraseConf.bra=bra;
        if (eraseConf.bp) { bp=eraseConf.bp;mbp.s=''+bp; } else eraseConf.bp=bp;
      }
    } else if (m==munerase) {
      if (mode!=MUNERASE) setMode(MUNERASE);
    } else if (a=='Save') { 
      try {
      localStorage[lsKey]=Paint.saveCanvas().toDataURL("image/png");
      //if (pages) 
      localStorage[lsKey+'c']=(pages?pages.length:1);
      var cs='';
      for (var i=0;i<(pages?pages.length:1);i++) {
        var n=pages?pages[i].normal:normal;
        if (n) cs+=(cs.length>0?',':'')+'n'+i;
      }
      localStorage[lsKey+'cs']=cs;
      localStorage[lsKey+'brushpat']=brushpat;
      //if (cutout.rects.length>0) 
      localStorage[lsKey+'cutout']=JSON.stringify(cutout);
      
      log('Saved to localStorage.');
      } catch (e) {
        log(''+e);
      }
      //lert('save');
    } else if (a=='Load') {
      lsLoad();
      //var d=localStorage[lsKey];
      //var c=localStorage[lsKey+'c'];
      //loadcs=localStorage[lsKey+'cs'];
      //if (c) loadpagec=c;
      //brushpat=localStorage[lsKey+'brushpat'];
      //if (brushpat==="false") brushpat=false;
      //var cuous=localStorage[lsKey+'cutout'];
      //if (cuous) try { cutout=JSON.parse(cuous);log('Cutout loaded: '+cutout.rects.length); } 
      //catch (e) { log('Error while loading cutout from localstorage: '+e); }
      ////lert('Load brushpat="'+(brushpat=='false'?'F':'T')+'"');
      //if (d) loadDataUrl(d);
      //else log('No image found in localStorage.');
    } else if (m==mpr||a=='prgif') {
      //pra=pr.split('\n');
      mRemove(m);
      if (!replay) {
        if (pra.length>0) {
          replay=true;replayStarted=true;
          mpr.s='Stop \u25a0';
          //pri=0;
          if (pri==pra.length-1) pri=0;
          if (a=='prgif') prgif=true;
          //mpr.ms=pra.length;
          //log('switchf '+pages[0].pra.length+' '+pages[1].pra.length);
          showProcess();
          mRemove(mcolor);
          mRemove(munerase);
          mRemove(merase);
          mRemove(mbp);mRemove(mbra);
          mroots.push(m);
        }
      }
    } else if (a=='Clear') {
      clear();pra=[];mpr.ms='0';
    } else if (a=='Compress') compress();
    else if (a=='Whale') 
    xhr('paint/process/demo.txt',function(v) {
      prSet(v);
      if (sal) { Menu.cmenu=mpr;Menu.action(); }
    }
    );
    /*
      var r=new XMLHttpRequest();
      r.overrideMimeType('text/plain');
      r.open('GET','paint/process/demo.txt',true);
    r.onreadystatechange=function() {
      if (this.readyState==4) {
        prSet(this.responseText);
        //prgif=true;
        if (sal) { Menu.cmenu=mpr;Menu.action(); }
      }
    }
      try {
      r.send(null)
      } catch (e) { alert(e); }
    } 
    */
    else if (a=='Js Knight') {
      loadDataUrl('paint/jsk_4.png');
    } else if (a=='Rect') {
      if (mode!=MSELR) {
        setMode(MSELR);
        mrectMs();
      } else {
        var ctx = canvas.getContext('2d');
        if (nbm==0) ctx.putImageData(id,0,0);
        srid=ctx.getImageData(sr.x,sr.y,sr.w,sr.h);
        if (nbm>0) {
          for (var i=0;i<pages.length;i++) {
            var page=pages[i];
            ctx.putImageData(page.id,0,0);
            page.srid=ctx.getImageData(sr.x,sr.y,sr.w,sr.h);
          }
        }
        movep.x=sr.x;movep.y=sr.y;
        mrect.s='Move';
        //mrect.ms=movep.x+','+movep.y+'\u00b7'+(movep.x-sr.x)+','+(movep.y-sr.y);
        mode=MMOVE;
        mrectMs();
        draw();
      }
      //draw();
    } else if (a=='Move') {
    //  mrect.s='RScale';
    //} else if (a=='RScale') {
      var ctx=canvas.getContext('2d');
      if (nbm>0) {
        for (var i=0;i<pages.length;i++) {
          var page=pages[i];
          ctx.putImageData(page.id,0,0);
          ctx.putImageData(page.srid,movep.x,movep.y);
          page.id=ctx.getImageData(0,0,iw,ih);
        }
      } else {
        ctx.putImageData(id,0,0);
        ctx.putImageData(srid,movep.x,movep.y);
        id=ctx.getImageData(0,0,iw,ih);
        if (pages) pages[pagei].id=id;
      }
      mode=MSELR;
      mrect.s='Rect';
      mrectMs();
      draw();
    } else if (m==mpage) {
      if (!m.sub) setPage((pagei+1)%pages.length);
    } else if (a=='pageright') setPage((pagei+1)%pages.length);
    else if (a=='pageleft') setPage((pagei-1+pages.length)%pages.length);
    else if (a=='pagedel') {
      if ((pages?pages.length:1)==1) log('Needs >1 pages.'); else {
        pages.splice(pagei,1);
        log('Page '+(pagei+1)+' deleted.');
        setPage(pagei==pages.length?pagei-1:pagei);
      }
      //lert('n/i');
    } else if (a=='Gif') {//||(a=='Gifa')) {
    
       var buf=new Array(10000*1000)
       var pala=new Array(pal.length);
       for (var i=pal.length-1;i>=0;i--) {
         var p=pal[i];
         pala[i]=0xff<<24|p.r<<16|p.g<<8|p.b;
       }
       pali={};oda=undefined;
       var gf=new GifWriter(buf,iw,ih,{loop:0,palette:pala});
       
       
       var pc=pages?pages.length:1;
       var ct=canvas.getContext('2d');
       var id1;
       for (var i=0;i<pc;i++) {
         var id0=pc>1?pages[i].id:id;
         //if (istrans) {       
         //  id1=gifId(id0,ct,br,bg,bb);
         //} else 
         id1=id0;
         ct.putImageData(id1,0,0);
         recordGif(gf,pal,ct,iw,ih);
         //log(i);
       } 
       if (mgiflb.ms=='yes')
       for (var i=pc-2;i>0;i--) {
         var id0=pages[i].id;
         //if (istrans) {
         //  id1=gifId(id0,ct,br,bg,bb);
         //} else 
         id1=id0;
         ct.putImageData(id1,0,0);
         recordGif(gf,pal,ct,iw,ih);
       }
    
       
       
       
       buf=buf.slice(0, gf.end());
       for(var i = 0, chr = {}; i < 256; i++) chr[i] = String.fromCharCode(i);
       for (var v = '', l = buf.length, i = 0; i < l; i++) v += chr[buf[i]];
       windowDataUrl('data:image/gif;base64,'+encode64(v),'Gif');
       
       
       //alert(gf);
       /* 
       var istrans=mgiftr.ms=='yes';//(a=='Gifa');
       var e=new GIFEncoder();
       var pc=pages?pages.length:1;
       if (pc>1) {
         e.setRepeat(0);
         e.setDelay(100);
       }
       //var c=0x0000ff;//
       //br=0;bg=255;bb=0;
       var c=(br<<16)|(bg<<8)|bb;
       //og(br+' '+bg+' '+bb+' -> '+c);
       e.start();
       var ct=canvas.getContext('2d');
       e.setTransparent(istrans?c:null);
       //if (pc>1) 
       var id1;
       for (var i=0;i<pc;i++) {
         var id0=pc>1?pages[i].id:id;
         if (istrans) {
           
           //d0=id0.data;
           //id1=ct.createImageData(id0),d1=id1.data;
           //for (var h=d0.length/4-1;h>=0;h--) {
           //  var isa=d0[h*4+3]<200;
           //  d1[h*4]=isa?br:d0[h*4];
           //  d1[h*4+1]=isa?bg:d0[h*4+1];//d0[h*4+1];
           //  d1[h*4+2]=isa?bb:d0[h*4+2];//d0[h*4+2];
           //  d1[h*4+3]=255;       
           //}
           
           id1=gifId(id0,ct,br,bg,bb);
         } else id1=id0;
         ct.putImageData(id1,0,0);
         e.addFrame(ct);
         //log(i);
       } 
       if (mgiflb.ms=='yes')
       for (var i=pc-2;i>0;i--) {
         var id0=pages[i].id;
         if (istrans) {
           id1=gifId(id0,ct,br,bg,bb);
         } else id1=id0;
         ct.putImageData(id1,0,0);
         e.addFrame(ct);
       }
       if (istrans) ct.putImageData(id,0,0);
       //else e.addFrame(ct);
       //e.setTransparent(c);
       e.finish();
       var b=e.stream().getData();
       var durl='data:image/gif;base64,'+encode64(b);
       window.open(durl,'Gif');
       */
    } else if (a=='brushpat') {
      brushpat=!brushpat;
      m.ms=brushpat?'on':'off';
      log('Pattern brush set to: '+m.ms+'.');
      setMode(MDRAW);
    } else if (a=='brushnorm') {
      normal=!normal;
      if (pages) pages[pagei].normal=normal;
      m.ms=normal?'on':'off';
      log('Normal brush set to: '+m.ms+'.');
      setMode(MDRAW);
    } else if (a=='Pattern') {
      document.body.style.backgroundImage='url('+Paint.saveCanvas(true,true).toDataURL("image/png")+')';
      //background-image:url(paintbg.png);
    } else if (a=='Contrast') {
    
        var d=id.data;
        var n=d.length;
        for (var i=0;i<n;i+=4) {
          var r=(2*d[i]/255)-1;
          var g=(2*d[i+1]/255)-1;
          var b=(2*d[i+2]/255)-1;
          var f=1.5;
          d[i]=  Math.floor(((r<0?-Math.min(1,-r*f):Math.min(1,r*f))+1)*255/2);
          d[i+1]=Math.floor(((r<0?-Math.min(1,-g*f):Math.min(1,g*f))+1)*255/2);
          d[i+2]=Math.floor(((r<0?-Math.min(1,-b*f):Math.min(1,b*f))+1)*255/2);
          //d[i+2]=0;//Math.floor(((r<0?-Math.sqrt(-b):Math.sqrt(b))+1)*255/2);
        //d[i]=255-d[i];
          //d[i+1]=0;
          //d[i+2]=0;
        }
        draw();
    
    } else if (a=='Grey') {
        var d=id.data;
        var n=d.length;
        for (var i=0;i<n;i+=4) {
          var r=d[i];
          var g=d[i+1];
          var b=d[i+2];
          var m=(r+g+b)/3,f0=0.5,f1=1-f0;
          d[i]=  Math.floor(f0*r+f1*m+0.5);
          d[i+1]=Math.floor(f0*g+f1*m+0.5);
          d[i+2]=Math.floor(f0*b+f1*m+0.5);
          //d[i+2]=0;//Math.floor(((r<0?-Math.sqrt(-b):Math.sqrt(b))+1)*255/2);
        //d[i]=255-d[i];
          //d[i+1]=0;
          //d[i+2]=0;
        }
        draw();
    
    } else if (a=='normmode') {
      setNormalMode((normalMode+1)%3);
    } else if (a=='normblend') {
    switch (nbm) {
      case 0:nbm=1;break;
      case 1:nbm=(spi!=-1)?2:0;break;
      case 2:nbm=0;
    }
      //m.ms=nbm==0?'off':(nbm==1?'on':'on *');
      light.x=-10;light.y=-10;
      draw();
    } else if (a=='exportpage') windowDataUrl(Paint.saveCanvas(false,true).toDataURL("image/png"),'PngExport');
    else if (a=='exportpagejpeg') windowDataUrl(Paint.saveCanvas(false,true).toDataURL("image/jpeg"),'JpegExport');
    else if (a=='norminvertgreen') { var d=id.data; for (var i=0;i<d.length;i+=4) d[i+1]=(128-d[i+1])+127; draw(); }
    else if (a=='norminvertred')   { var d=id.data; for (var i=0;i<d.length;i+=4) d[i]=(128-d[i])+127; draw(); }
    else if (startsWith(a,'col_')) {
      var ah=a.substring(4).split(',');
      br=ah[0];bg=ah[1];bb=ah[2];
      mcolorCol();
    }
    else if (a=='Cut') {
      //og('cut');
    
      //ct.fillRect(dx+v.u*iw-2,dy+v.v*ih-2,4,4);
      if (lo) {
        for (var h=lo.verts.length-1;h>=0;h--) {
          var v=lo.verts[h];
          if (v.paintSkip) continue;
          
          v.u=(v.u*iw-sr.x)/sr.w;
          v.v=(v.v*ih-sr.y)/sr.h;
          //v.u-=sr.x/iw;
          //v.u=v.u*sr.w/(iw-sr.x);
        }
      }
      
      
      var ct=canvas.getContext('2d');
      
      if (pages) {
        for (var i=0;i<pages.length;i++) {
          var p=pages[i];
          ct.putImageData(p.id,0,0);
          p.id=ct.getImageData(sr.x,sr.y,sr.w,sr.h);
          p,change=true;
        }
        id=pages[pagei].id;
      } else {
        ct.putImageData(id,0,0);
        id=ct.getImageData(sr.x,sr.y,sr.w,sr.h);
      }
      
      iw=sr.w;ih=sr.h;
      canvas.width=iw;canvas.height=ih;
      canvas.style.width=iw*scale;canvas.style.height=ih*scale;
      ct=canvas.getContext('2d');
      ct.putImageData(id,0,0);
      nbid=undefined;
      draw();
      log('Cut done.');
    } else if ((m==mgiflb)||(m==mgiftr)) m.ms=m.ms=='no'?'yes':'no';
    else if (a=='Set Palette') (function() {
      var rgba2rgb = function (data) {
        var pixels = [];
        var count = 0;
        var len = data.length;
        for ( var i=0; i<len; i+=4 ) {
          pixels[count++] = data[i];
          pixels[count++] = data[i+1];
          pixels[count++] = data[i+2];
        }
        return pixels;
      }
      var data=id.data;
      // Make palette with NeuQuant.js
      var nqInPixels = rgba2rgb(data);
      var len = nqInPixels.length;
      var nPix = len / 3;
      var map = [];
      var nq = new NeuQuant(nqInPixels, len, 10);
      // initialize quantizer
      var palette = nq.process(); // create reduced palette
      pal=[];
      for ( var i=0; i<palette.length; i+=3 ) {
        pal.push({r:palette[i+2],g:palette[i+1],b:palette[i]});
      }
      
      //var palette = rgb2num(paletteRGB);
      //alert(palette.length);
      log('Palette generated ('+pal.length+' colors).');
    }
    )();
    else if (a=='initnorm') {
      setdim(iw,ih,3);
      //setMode(MDRAW);
      setPage(2);
      clearFill(0,0,0,255);
      setPage(1);
      clearFill(127,127,255,255);
      normal=false;
      Paint.menuSwitch(mbrushnorm,mbrushnorm.a);
      log('Diffuse,normal,specular initialized.');
    }
    else if (a=='Copy Brush') {
      if (mode!=MCOPYBRUSH) 
        setMode(MCOPYBRUSH);
      else { copybrush=undefined;draw(); }
      //else 
      //  setMode(MDRAW);
    } else if (a=='Cutout') {
      if (mode!=MCUTOUT) setMode(MCUTOUT);
    } else if (a=='Rect add') {
      cutout.rects.push({x:10,y:10,w:40,h:40,cx:30,cy:30});
      draw();
    } else if (a=='cutoutreset') {
      cutout.rects=[];
      cutout.bones=[];
      draw();
    } else if (m==mtexify) {
      var x0=Number.MAX_VALUE,y0=Number.MAX_VALUE,x1=-x0,y1=-y0;
      for (var h=selv.length-1;h>=0;h--) {
        var v=selv[h];
        x0=Math.min(x0,v.p1.x);y0=Math.min(y0,v.p1.y);
        x1=Math.max(x1,v.p1.x);y1=Math.max(y1,v.p1.y);
      }
      for (var h=selv.length-1;h>=0;h--) {
        var v=selv[h];
        v.u=(sr.x+(v.p1.x-x0)*sr.w/(x1-x0))/iw;
        v.v=(sr.y+(v.p1.y-y0)*sr.h/(y1-y0))/ih;
      }
      draw(true);
      //alert('Texify');
    } else if (m==mvertsel) {
      //console.log(sr);
      var x0=sr.x/iw,x1=(sr.x+sr.w)/iw,y0=sr.y/ih,y1=(sr.y+sr.h)/ih;
      for (var h=0;h<lo.verts.length;h++) {
        var v=lo.verts[h];
        if (v.paintSkip) continue;
        if ((v.u>=x0)&&(v.u<=x1)&&(v.v>=y0)&&(v.v<=y1)) if (selv.indexOf(v)==-1) selv.push(v);
      }
      draw(true);
    } else if (m==mselmv) {
      m.check=!m.check;m.s=m.check?Menu.son:Menu.soff;
    }
    
    
      if (replay&&!replayStarted) {
        replay=false;
        mpr.s='Process \u25ba';
        //mRemove(m);
        mroots.push(mbp);mroots.push(mbra);
        //mroots.push((mode==MERASE)?merase:((mode==MUNERASE)?munerase:mcolor));
        if (mode==MUNERASE) mroots.push(munerase); else mroots.push(mcolor,merase);
        mcolorCol();
        mbra.s=bra;mbp.s=bp;
      }
    
    
    
    //else if (a=='prexport') window.open('data:text/plain,'+pr);
    
    // else if (a=='Canvas...') {
    //  //alert(42);
    //  mroots.splice(0,mroots.length,{s:'Ok'},{s:'Cancel'},{s:'Canvas Dimension',px:0.32,py:0.02,pw:1-0.49,ph:0.14,tf:1,fs:0.75});
    //}
  }
  Paint.saveCanvas=function (half,onlyCanvas,ps) {
    if (!ps) ps={};
    if ((!pages)||onlyCanvas) {
      if (!half) {
        //if (lo) { //so that texture coords dont get exported
        if (false) {
          //so that texture coords,brush,cutouts dont get exported.
          //with canvdraw obsolete and there was an android chrome bug
          var c=document.createElement('canvas');
          c.width=iw;c.height=ih;
          var ct=c.getContext('2d');
          var id0=normalBlend?nbid:getId();
          var d=id0.data;
          log('saveCanvas 1.0 '+d[0]+' '+d[1]+' '+d[2]+' '+d[3]); //---g=125
          ct.putImageData(id0,0,0);
          
          id0=ct.getImageData(0,0,iw,ih);d=id0.data;
          log('saveCanvas 1.1 '+d[0]+' '+d[1]+' '+d[2]+' '+d[3]); //---g=52
                
          return c;
        }
        if (canvm&&!ps.nocanvm) {
          var c=document.createElement('canvas');
          c.width=iw;c.height=ih;
          var ct=c.getContext('2d');
          ct.drawImage(canvas,0,0,iw,ih);
          ct.globalAlpha=canvm.style.opacity;
          ct.drawImage(canvm,0,0,iw,ih);
          //og('saveCanvas 2');
          return c;
        }
        //og('saveCanvas 3');
        return canvas;
      }
      var c=document.createElement('canvas');
      c.width=iw/2;c.height=ih/2;
      var ct=c.getContext('2d');
      ct.drawImage(canvas,0,0,iw/2,ih/2);
      //og('saveCanvas 4');
      return c;
    }
    var c=document.createElement('canvas');
    c.width=iw*pages.length;
    c.height=ih;
    var ct=c.getContext('2d');
    //ct.fillStyle='#ff0000';
    //ct.fillRect(0,0,10,10);
    for (var i=0;i<pages.length;i++) 
      ct.putImageData(pages[i].id,i*iw,0);
    //og('saveCanvas 3');
    return c;
  }
  Paint.getPages=function () {
    return pages;
  }
  Paint.getId=function() {
    return id;
  }
  function setNormalMode(m) {
    normalMode=m;
    Menu.ms(mnorm,m==NMCOL?'color':(m==NMDOWN?'down':'up'));
  }
  function setMode(m) {
    //log('setMode '+m);return;
    //Paint.stacktrace();
    if (mode==MMOVE) {
      mode=MSELR;
      mrect.s='Rect';
      mrectMs();
    }
    
    //switch (m) {
    //  case MDRAW:   mroots.splice(0,mroots.length,mmenu,mpage,mpr,mbp,mbra,mcolor);break;
    //  case MERASE:  mroots.splice(0,mroots.length,mmenu,mpage,mpr,mbp,mbra,merase);break;
    //  case MUNERASE:mroots.splice(0,mroots.length,mmenu,mpage,mpr,mbp,mbra,munerase);break;
    //  case MSELR:   mroots.splice(0,mroots.length,mmenu,mpage,mrect);break;
    //}
    var a;
    switch (m) {
    //case MCOPYBRUSH:a=[mtools,mbp,mbra,mcopybrush];break;//mpr,
    //case MDRAW:   a=[mtools,mbp,mbra,mcolors,mcolor];break;//mpr,merase
    //case MERASE:  a=[mtools,mbp,mbra,mcolor,merase];break;//mpr,
    //case MUNERASE:a=[mtools,mbp,mbra,munerase];break;//mpr,
      case MCOPYBRUSH:a=[mtools,mcopybrush];break;//mpr,
      case MDRAW:   a=[mcolors].concat(mcolors.sub);break;//mcolor//mpr,merase
      case MERASE:  a=[mtools,mcolor,merase,mbp,mbra];break;//mpr,
      case MUNERASE:a=[mtools,munerase,mbp,mbra];break;//mpr,
      case MSELR:   a=[mtools,mrect,mrscale,mrload,mcut,mtexify,mvertsel,mpolygon
        ,mselmv,mstayselv,mTridatavAdd];break;
      case MCUTOUT: a=[mtools,mcomain];break;
    }
    //alert(stacktrace());
    
    mroots.splice(0,mroots.length,mmenu);
    if (pages) mroots.push(mpage);
    for (var i=0;i<a.length;i++) mroots.push(a[i]);
    if (brushpat&&sal) mroots.push(mpat);
    if (!sal) mroots.push(medit3d);
    
    
    
    checkNormalBlend();
    
    
    if (normalBlend) mroots.push(mnormblend);
    if (normal) mroots.push(mnorm);
    
    //}
    mode=m;
    
    draw(true);
  }
  function mprMs(s) {
    //mpr.ms=s;
    //var e=document.getElementById('mprms');
    //if (e) e.innerHTML=s;
    Menu.ms(mpr,s);
  }
  function mrectMs() {
    Menu.ms(mrect,mode==MMOVE?
    mrect.ms=movep.x+','+movep.y+'\u00b7'+(movep.x-sr.x)+','+(movep.y-sr.y)
    :
    (//lo?'Texture Coords':
      sr.x+','+sr.y+'\u00b7'+sr.w+','+sr.h)
    );
  }
  function prSet(s) {
    pra=s.split('\n');pri=0;mprMs(pra.length);
    pri=pra.length;
  }
  function round(v) {
    return Math.floor(0.5+v);
  }
  function gifId(id0,ct,r,g,b) {
    var d0=id0.data;
    var id1=ct.createImageData(id0),d1=id1.data;
    for (var h=d0.length/4-1;h>=0;h--) {
      if (r===undefined) {
        var a=d0[h*4+3]/255,a1=1-a;
        d1[h*4]=round(d0[h*4]*a+255*a1);
        d1[h*4+1]=round(d0[h*4+1]*a+255*a1);
        d1[h*4+2]=round(d0[h*4+2]*a+255*a1);//d0[h*4+2];
        d1[h*4+3]=255;       
      } else {
        var isa=d0[h*4+3]<100;//<200
        d1[h*4]=isa?r:d0[h*4];
        d1[h*4+1]=isa?g:d0[h*4+1];//d0[h*4+1];
        d1[h*4+2]=isa?b:d0[h*4+2];//d0[h*4+2];
        d1[h*4+3]=255;       
      }
    }
    return id1;
  }
  function showProcess() {
    if (!replay) return;
    //og('showProcess a '+pages[0].pra.length+' '+pages[1].pra.length);
    
    var ca=Math.floor(pra.length/200)+1,r,g,b;
    var gifa=Math.floor(pra.length/prGifNum)+1;//10
    //log(ca);
    
    if (pri>=pra.length) { pri=0; }
    
    for (var c=0;c<ca;c++) {
    //og('showProcess b '+pages[0].pra.length+' '+pages[1].pra.length);
    if (pri==0) clear();
    mpr.ms=(pri+1)+'/'+pra.length;
    var p=pra[pri];
    var a=p.split(',');
    var a0=a[0];
    if (a0=='b') brush(parseInt(a[1]),parseInt(a[2]),true);
    else if (a0=='l') brushline(parseFloat(a[1])*prFx,parseFloat(a[2])*prFy,parseFloat(a[3])*prFx,parseFloat(a[4])*prFy,true);
    else if (a0=='c') { br=parseInt(a[1]);bg=parseInt(a[2]);bb=parseInt(a[3]); }
    else if (a0=='p') { bp=parseFloat(a[1]);bra=Math.floor(0.5+parseFloat(a[2])*(prFx+prFy)/2); }
    else if (a0=='e') { 
      //erase=(a[1]=='1');unerase=(a[2]=='1'); 
      if (a[1]=='1') mode=MERASE; else if (a[2]=='1') mode=MUNERASE; else mode=MDRAW;
    }
    else if (a0=='d') {
      var wh=parseInt(a[1]),hh=parseInt(a[2]);
      if (prChangeDim) setdim(wh,hh);  else {
        prFx=iw/wh;prFy=ih/hh;
      }
    }
    pri++;
    if (pri==pra.length) { 
      //og('showProcess '+pages[0].pra.length+' '+pages[1].pra.length);
      break; 
    }
    if (prgif) if (pri%gifa==0) {//2000
      if (!egif) {
        egif=new GIFEncoder();
        //egif.setTransparent(null);
        egif.setRepeat(0);
        egif.setDelay(prGifDelay);//200
        egif.start();
      }
      if (prGifAlpha) { r=0;g=255;b=0;var c=(r<<16)|(g<<8)|b;egif.setTransparent(c); } else egif.setTransparent(null);
      var ct=canvas.getContext('2d');
      var id1=gifId(getId(),ct,r,g,b);
      ct.putImageData(id1,0,0);
      egif.addFrame(ct);
      ct.putImageData(id,0,0);
      //window.open(canvas.toDataURL("image/png"),'PngExport'+pri);
    }
    } 
    //og('showProcess c '+pages[0].pra.length+' '+pages[1].pra.length);
    
    draw();
    mprMs(mpr.ms);
    if (prgif&&pri==pra.length) {
      egif.setDelay(2000);
      if (prGifAlpha) { r=0;g=255;b=0;var c=(r<<16)|(g<<8)|b;egif.setTransparent(c); } else egif.setTransparent(null);
      var ct=canvas.getContext('2d');
      var id1=gifId(getId(),ct,r,g,b);//id
      ct.putImageData(id1,0,0);
      egif.addFrame(ct);
      ct.putImageData(id,0,0);
      egif.finish();
      var b=egif.stream().getData();
      var durl='data:image/gif;base64,'+encode64(b);
      prgif=false;
      console.log('Exporting gif.');
      windowDataUrl(durl,'Gif');
      egif=undefined;
      return;
    }
    //if (pri!=0)
      setTimeout(showProcess,pri==pra.length?3000:10);
    //else window.open(canvas.toDataURL("image/png"),'PngExport'+pri);
  }
  function clearFill(r,g,b,a) {
    if (!id) {
      var ct=canvas.getContext('2d');
      ct.clearRect(0,0,iw,ih);
      ct.fillStyle='rgba('+r+','+g+','+b+','+(a/255)+')';
      ct.fillRect(0,0,iw,ih);
      return;
    }
    var d=id.data;
    for (var h=d.length/4-1;h>=0;h--) {
      var i=h*4;
      d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=a;
    }
    
  }
  function clear(allPages) {
    //var d=id.data;
    if (normal) clearFill(128,128,255,255); else clearFill(0,0,0,0);
    //if (sal) clearFill(0,0,0,0); else clearFill(100,100,100,255);
    
    /*
    if (!normal) {
      var obp=bp,obra=bra;
      var u=255;
      var pal=[[0,0,0],[u,u,u],[u,0,0],[0,u,0],[0,0,u],[u,u,0]];
      bp=1;bra=30;
      for (var h=0;h<pal.length;h++) {
        var p=pal[h];br=p[0];bg=p[1];bb=p[2];brush(bra/2,bra/2+h*bra,true);
      }
      bp=obp;bra=obra;
    }
    */
    
    
    if (id) if (allPages&&pages) {
      var ctx = canvas.getContext('2d');
      pagei=0;
      pages[pagei]={id:id,pra:pra};
      var d=id.data;
      for (var i=1;i<pages.length;i++) {
        var id2=ctx.createImageData(id);
        pages[i]={id:id2,pra:[]};
        for (var h=d.length-1;h>=0;h--) id2.data[h]=d[h];
        //log(i);
      }
    }
    
    draw();
    
  }
  function startsWith(s,sp) {
    if (s.length<sp.length) return false;
    if (s.substring(0,sp.length)==sp) return true;
    return false;
  }
  function loadDataUrl(d,addPages,callback) {
    if (!d) return;
    var isfn=d.length<100;
    //log('Loading '+(isfn?d:d.length+' bytes')+'.');
    var sp=' ';//sal?'&nbsp;':' ';
    var lsh=isfn?d:d.length+sp+'bytes';
    var pcy=1;
    if (isfn) {
      loadpagec=1;
      var i=d.lastIndexOf('_');
      if (i!=-1) {
        loadpagec=parseInt(d.substr(i+1,d.indexOf('.',i)-i-1));
        var i2=d.lastIndexOf('_',i-1);
        if (i2!=-1) {
          pcy=parseInt(d.substr(i2+1,i-i2-1));
          //log('...loadDataUrl i='+i+' i2='+i2+' s2='+s2);
        }
      }
      
      i=d.lastIndexOf('.');
      if (i!=-1) {
        var r=new XMLHttpRequest();
        r.overrideMimeType('text/plain');
        r.open('GET',d.substr(0,i)+'.cutout.txt',true);
    r.onreadystatechange=function() {
      if (this.readyState==4) {
        try {
        cutout=JSON.parse(this.responseText);
        if (mode==MCUTOUT) draw();
        log('Cutout loaded from url: '+(cutout&&cutout.rects?cutout.rects.length:0)+' rects.');
        //alert(this.responseText);
        } catch (e) { log('Error while loading cutout: '+e); }
      }
    }
        try {
        r.send(null)
        } catch (e) { }
      }
    }
    nbm=0;
    //og('loadDataUrl loadpagec='+loadpagec);
    var img=new Image();
    img.onload=function() {
      nbid=undefined;
      //onsole.log('loadDataUrl.onload 0');
      if ((loadpagec>1)||addPages) {
        //alert('whee');
        var pc=loadpagec;
        var c=document.createElement('canvas');
        c.width=this.width;c.height=this.height;
        var ct=c.getContext('2d');
        ct.drawImage(this,0,0);
        iw=this.width/pc;ih=this.height/pcy;
        canvas.width=iw;canvas.height=ih;
        canvas.style.width=iw*scale;canvas.style.height=ih*scale;
        if ((canvm.width!=iw)||(canvm.height!=ih)) { 
          //onsole.log('loadDataUrl.onload resizing canvm');
          canvm.width=iw;canvm.height=ih; 
        }
        canvm.style.width=iw*scale;canvm.style.height=ih*scale;
        
        var pageoffs=0;
        if (addPages&&pages)
          pageoffs=pages.length;
        else 
          pages=new Array(pc*pcy);
        for (var y=0;y<pcy;y++)
        for (var i=0;i<pc;i++) {
          pages[i+(y*pc)+pageoffs]={
            //id:((y+i>0)?undefined:ct.getImageData(i*iw,y*ih,iw,ih))
            id:ct.getImageData(i*iw,y*ih,iw,ih)
            ,pra:[],color:[br,bg,bb]};//color:[100,100,100]};
          //break;
        }
        //onsole.log('loadDataUrl.onload 1');
        pagei=0;
        id=pages[pagei].id;
        draw();
        log(pc*pcy+sp+'Pages'+sp+'loaded'+sp+'('+lsh+').');
        //return;
      } else {
        var done=false;
        if (pages) if (pages.length>1) {
          done=true;
          var ct=canvas.getContext('2d');
          var px=0,py=0;
          if (mode==MSELR) { px=-sr.x;py=-sr.y; }
          ct.drawImage(this,px,py,this.width*loadScale,this.height*loadScale);
          id=ct.getImageData(0,0,iw,ih);
          pages[pagei].id=id;
        }
        if (!done) {
          pagei=0;pages=undefined;
          iw=this.width*loadScale;ih=this.height*loadScale;
          canvas.width=iw;canvas.height=ih;
          canvas.style.width=iw*scale;canvas.style.height=ih*scale;
          if ((canvm.width!=iw)||(canvm.height!=ih)) { canvm.width=iw;canvm.height=ih; }
          canvm.style.width=iw*scale;canvm.style.height=ih*scale;
          //var cm=canvm.getContext('2d');
          //cm.strokeStyle='#f00';
          //cm.strokeRect(0,0,canvm.width,canvm.height);
      
          //console.log(canvm);
          var ct=canvas.getContext('2d');
          ct.drawImage(this,0,0,this.width*loadScale,this.height*loadScale);
          try {
          id=ct.getImageData(0,0,iw,ih);
          } catch (e) {
            log('!!! Security Error');
          }
          /*
          try { 
            //var objImageData = ctx.getImageData(0, 0, img.width, img.height)  
            id=ct.getImageData(0,0,iw,ih);
          } catch (e) { 
            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
            //var objImageData = ctx.getImageData(0, 0, img.width, img.height) 
            id=ct.getImageData(0,0,iw,ih);
          } 
          */	
        
        //mcanvas.ms=iw+'x'+ih;
        }
        if (lo) {
          lo.id=id;
          draw();
        }
        log('Image'+sp+'loaded'+sp+'('+this.width+'x'+this.height+','+sp+lsh+').');//iw,ih
        
        if (addPageAfterLoad) {
          setdim(iw,ih,pages?pages.length+1:2);
          setPage(pages.length-1);
          //log('redim1');
        }
        if (!sal) { scale=50/iw;isize(); }
        
      }
      if (loadcs) {
        //og('loadDataUrl loadcs='+loadcs);
        var a=loadcs.split(',');
        for (var i=0;i<a.length;i++) {
          var sh=a[i];
          if (sh.substr(0,1)=='n') {
          //if (sh.startsWith('n')) {
            //log('---------nnnnn');
            var ihh=parseInt(sh.substring(1));
            if (pages) {
              var page=pages[ihh];
              page.normal=true;
              page.color=[128,128,255];
            }
            if (ihh==0) normal=true;
            nbm=2;//2;
          }
          //log('---'+sh);
        }
      }
      
      
      //og('normal='+normal);
      var pl=pages?pages.length:1;
      mpage.ms=(pagei+1)+'/'+pl;
      if (pl>3) mpage.sub=mpage._sub; else delete mpage.sub;
      setMode(mode);
      //mode=-1;//?
      
      if (sal) {
        Menu.cmenu=mmenu;//mcolor;
        Menu.action();
        Menu.cmenu=mmenu;//mcolor;
        Menu.action();
        //Menu.draw();
      }
      loadpagec=1;
      //og('ih='+ih);
      if (lo) {
        var ln=lo.loadnext;
        if (ln) {
          var m=lo.meshes[lo.selmesh];
          var pc=(pages?pages.length:1);
          setdim(iw,ih,pc+1);
          setPage(pc);
          if (ln=='norm') {
            loadcs='n1';
            lo.loadnext='spec';
          } else delete lo.loadnext;
          loadDataUrl(m[ln]);
        }
      }
      if (callback) callback();
    }
    img.src=d;
    if (isfn) mmenu.ms=d;
    return img;
  }
  function mRemove(m) {
    var ih=mroots.indexOf(m);if (ih!=-1) { mroots.splice(ih,1);return true; }
    return false;
  }
  function log(s) {
    console.log(//'paint.log '+
      s);
    Paint.log(s);
  }
  Paint.log=function(s) {
    //var sh=document.getElementById('log').innerHTML;
    var le=document.getElementById('log');
    if (le) le.innerHTML+=s+'<br>';
  }
  function prCfg() {
    //if (skipDemo) { clear();skipDemo=false;pra=[];pri=0; }
    if (pri<pra.length-1) {
      pra.splice(pri+1,pra.length-1-pri);
    }
    var first=(pra.length==0);
    if ((prr!=br)||(prg!=bg)||(prb!=bb)||first) { pra.push('c,'+br+','+bg+','+bb);prr=br;prg=bg;prb=bb;pri++; }
    if (prp!=bp||prra!=bra||first) { pra.push('p,'+bp+','+bra);prp=bp;prra=bra;pri++; }
    //if (prer!=erase||pruner!=unerase||first) { pra.push('e,'+(erase?1:0)+','+(unerase?1:0));prer=erase;pruner=unerase;pri++; }
    if (prmode!=mode||first) { pra.push('e,'+((mode==MERASE)?1:0)+','+((mode==MUNERASE)?1:0));prmode=mode;pri++; }
    if (priw!=iw||prih!=ih||first) { pra.push('d,'+iw+','+ih);priw=iw;prih=ih;pri++; }
  }
  function drawBrush(imx,imy,x,y) {
    var x0=Math.max(0,Math.floor(Math.min(imx,x))-bra-1),x1=Math.min(iw-1,Math.floor(Math.max(imx,x)+1)+bra+1);
    var y0=Math.max(0,Math.floor(Math.min(imy,y))-bra-1),y1=Math.min(ih-1,Math.floor(Math.max(imy,y)+1)+bra+1);
    drawArea={x0:x0,y0:y0,x1:x1,y1:y1};
    draw();
  }
  function brushline(imx,imy,x,y,nopr) {
    if (!nopr) {
      prCfg();
      pra.push('l,'+strf(imx,10)+','+strf(imy,10)+','+strf(x,10)+','+strf(y,10));pri++;
      mprMs(//(pri+1)+'/'+
        pra.length);
    }
    var dx=imx-x,dy=imy-y;
    var d=Math.sqrt(dx*dx+dy*dy);
    for (var h=0;h<d;h+=Math.floor(bra/3+0.5)+1) 
      brush(Math.floor(x+dx*h/d+0.5),Math.floor(y+dy*h/d+0.5),true);
    if (!nopr&&!(canvDraw&&(mode==MDRAW))) {
      drawBrush(imx,imy,x,y);
    }
    
    if (false)
    if (lo) {
      var m=lo.meshes[lo.selmesh];
      var c=canvlo;
      if (!c) {
        c=document.createElement('canvas');
        c.width=iw;c.height=ih;
        canvlo=c;
      }
      var ct=c.getContext('2d');
      ct.putImageData(id,0,0);
      m.tdiff.image.src=c.toDataURL('image/jpeg');
      m.tdiff.needsUpdate=true;
      lo.drawNew=true;
      //---
    }
  }
  function brush(xp,yp,nopr) {
    if (!nopr) {
      prCfg();
      pra.push('b,'+strf(xp,10)+','+strf(yp,10));pri++;
      mprMs(//(pri+1)+'/'+
        pra.length);
    }
    var r=bra;
    var ba=255;
    
    var iscp=((mode==MCOPYBRUSH)&&copybrush);
    var normalud=normal&&(normalMode!=NMCOL);
    if (canvDraw&&(mode==MDRAW)&&!normalud) {
      //onsole.log('brush '+nopr);
      if (!nopr||!ctdraw) {
        var ct=canvas.getContext('2d');
        //ct.fillStyle='rgba('+br+','+bg+','+bb+','+bp+')';
        ctdraw=ct;
      }
      var ct=ctdraw;
      ct.fillStyle='rgba('+br+','+bg+','+bb+','+bp+')';
      //ct.fillRect(xp-r,yp-r,r*2,r*2);
      ct.beginPath();
      ct.arc(xp,yp,r,0,Math.PI*2);
      ct.fill();
      id=undefined;
    } else
    for (var yr=-r;yr<=r;yr++) for (var xr=-r;xr<=r;xr++) {
      var x=xr+xp,y=yr+yp;
      if ((x<0)||(x>=iw)||(y<0)||(y>=ih)) {
        if (!brushpat) continue;
        x-=Math.floor(x/iw)*iw;
        y-=Math.floor(y/ih)*ih;
        //while (x<0) x+=iw;x%=iw;
        //while (y<0) y+=ih;y%=ih;
      }
      var f1=1-(xr*xr+yr*yr)/(r*r);
      if (f1<0) continue;
      var of1=f1;
      f1*=bp;
      f=1-f1;
      //f=0.9+0.1*f;
      //f=Math.sqrt(Math.sqrt(Math.sqrt(f)));
      //var f1=1-f;
      //f1*=0.1;
      //f=1-f1;
      
      var d=id.data;
      var di=(y*iw+x)*4;
      
      if (iscp) {
        var i2=(((y+copybrush.y+ih)%ih)*iw+(x+copybrush.x+iw)%iw)*4;
        br=d[i2];bg=d[i2+1];bb=d[i2+2];ba=d[i2+3];
      }
      
      
      if (mode==MUNERASE)
        d[di+3]=Math.floor(f1*255+f*d[di+3]+0.5);
      else if (mode==MERASE) 
        d[di+3]=Math.floor(f1*0+f*d[di+3]+0.5);
      else {
        var or=d[di],og=d[di+1],ob=d[di+2],oa=d[di+3];
        
        //var keyU=false,keyD=true;
        if (normalud) {
          var n0x=or*2/255-1,n0y=og*2/255-1,n0z=ob*2/255-1,n0l=Math.sqrt(n0x*n0x+n0y*n0y+n0z*n0z);
          n0x/=n0l;n0y/=n0l;n0z/=n0l;
          
          var h0=255*of1;
          var hx0=255*Math.max(0,1-((xr-1)*(xr-1)+yr*yr)/(r*r));
          var hx1=255*Math.max(0,1-((xr+1)*(xr+1)+yr*yr)/(r*r));
          var hy0=255*Math.max(0,1-(xr*xr+(yr-1)*(yr-1))/(r*r));
          var hy1=255*Math.max(0,1-(xr*xr+(yr+1)*(yr+1))/(r*r));
          var down=(normalMode==NMDOWN);
          var nx=(down?-1:1)*((hx0-h0)+(h0-hx1))/2;
          var ny=(down?-1:1)*(isInvertgreen?-1:1)*((hy0-h0)+(h0-hy1))/2;
          var nz=down?-10:10;
          var nl=Math.sqrt(nx*nx+ny*ny+nz*nz);nx/=nl;ny/=nl;nz/=nl;
          var p=Math.pow(bp,1.5);// 0.1 ~> 0.03
          nx=nx*p+n0x*(1-p);
          ny=ny*p+n0y*(1-p);
          nz=nz*p+n0z*(1-p);
          nl=Math.sqrt(nx*nx+ny*ny+nz*nz);nx/=nl;ny/=nl;nz/=nl;
          
          var nr=Math.floor((nx+1)*128+0.5);
          var ng=Math.floor((ny+1)*128+0.5);
          var nb=Math.floor((nz+1)*128+0.5);
          d[di]=nr;d[di+1]=ng;d[di+2]=nb;d[di+3]=255;
          
          /*
          P4d.m3Set(n0,ro*2f/255f-1f,go*2f/255f-1f,bo*2f/255f-1f);
          P4d.m3Normal(n0,n0);
    
          int h=brushH(x,y);
          n[0]=(keyD?-1:1)*((float)(brushH(x-1,y)-h)+(float)(h-brushH(x+1,y)))/2f;
          n[1]=(keyD?-1:1)*((float)(brushH(x,y-1)-h)+(float)(h-brushH(x,y+1)))/2f;
          n[2]=keyD?-10:10;
          P4d.m3Normal(n,n);
          float p2=Math.max(1,pressure-3);
          p2=p2*p2*p2/1000;
          n[0]=n[0]*p2+n0[0]*(1-p2);
          n[1]=n[1]*p2+n0[1]*(1-p2);
          n[2]=n[2]*p2+n0[2]*(1-p2);
          P4d.m3Normal(n,n);
          normToCol(n,ca);
          bi.setRGB(xp,yp,0xff<<24|ca[0]<<16|ca[1]<<8|ca[2]);
          */
        } else {
        
        
        var nr=Math.floor(f1*br+f*or+0.5);
        var ng=Math.floor(f1*bg+f*og+0.5);
        var nb=Math.floor(f1*bb+f*ob+0.5);
        var na=Math.floor(f1*ba+f*oa+0.5);
        
        //if ((xr==0)&&(yr==0)) log('f1:'+f1+'*bg:'+bg+' + f:'+f+'*og:'+og+' = '+(f1*bg+f*og)+' -> ng:'+ng);
        if (of1>0.75) {
          
          //if ((nr==or)&&(nr!=br)) nr=br;//nr+=br-nr>1?1:-1;
          //if ((ng==og)&&(ng!=bg)) ng=bg;//ng+=bg-ng>1?1:-1;
          //if ((nb==ob)&&(nb!=bb)) nb=bb;//nb+=bb-nb>1?1:-1;
          //if ((na==oa)&&(na!=ba)) na=ba;//na+=ba-na>1?1:-1;
          
          if ((nr==or)&&(nr!=br)) nr+=br-nr>0?1:-1;
          if ((ng==og)&&(ng!=bg)) ng+=bg-ng>0?1:-1;//if ((xr==0)&&(yr==0)) log('ng:'+ng); }
          if ((nb==ob)&&(nb!=bb)) nb+=bb-nb>0?1:-1;
          if ((na==oa)&&(na!=ba)) na+=ba-na>0?1:-1;
        }
        
        
        d[di]=nr;d[di+1]=ng;d[di+2]=nb;d[di+3]=na;
        }
      }
    }
    if (pages) pages[pagei].change=true;
    wasBrush=true;changec++;
  }
  function mcolorCol() {
    mcolors.bgcol='rgb('+br+','+bg+','+bb+')';
    //mcolor.bgcol='rgb('+br+','+bg+','+bb+')';
    ////mcolor.ms=br+'\u00b7'+bg+'\u00b7'+bb;
    if (mcolors.c) mcolors.c.style.backgroundColor=mcolors.bgcol;
    //if (mcolor.c) {
    //  mcolor.c.style.backgroundColor=mcolor.bgcol;
    //  //mcolor.c.style.color=(br+bg+bb)<100?'rgb(250,250,250)':'rgb(0,0,0)';
    //}
  }
  function getId() {
    if (!id) id=canvas.getContext('2d').getImageData(0,0,iw,ih);
    return id;
  }
  function pick(x,y) {
    x=Math.floor(x+0.5);y=Math.floor(y+0.5);
    if ((x>=0)&&(x<iw)&&(y>=0)&&(y<ih)) {
      var d=getId().data;
      var di=(y*iw+x)*4;
      br=d[di];bg=d[di+1];bb=d[di+2];
      //og('Picked: '+br+' '+bg+' '+bb+' '+d[di+3]);
      mcolorCol();
      Menu.ms(msetcol,br+','+bg+','+bb);
      //pickm.c.innerHTML='Color';
      //pickm=undefined;
      //alert(br+' '+bg+' '+bb+' x:'+x+' y:'+y+' d.len:'+d.length);moused[2]=false;
    }
  }
  function setdim(x,y,p) {
    var po=pages?pages.length:1;
    var sameSize=(x==iw&&y==ih);
    if (sameSize&&po==p) return;
    
    var ctx;
    if (!sameSize) {
      iw=x;ih=y;
      canvas.width=iw;canvas.height=ih;
      canvas.style.width=iw*scale;canvas.style.height=ih*scale;
      ctx=canvas.getContext('2d');
      ctx.putImageData(id,0,0);
      id=ctx.getImageData(0,0,iw,ih);
      //log('setdim id=...');
      
      if (pages) {
        for (var h=0;h<pages.length;h++) {
          var page=pages[h];
          if (h==pagei) { page.id=id;continue; }
          ctx.putImageData(page.id,0,0);
          page.id=ctx.getImageData(0,0,iw,ih);
        }
      }
      
    }
    
    //pagei=0;
    if (p==1) {
      pages=undefined;
    //} else pages=new Array(p);
    } else if (p<po) pages.splice(p,po-p);//pages=
    else if (p>po) {
      if (!pages) pages=new Array(p);
      else pages=pages.concat(new Array(p-po));
    }
    //og('setdim pages.len='+(pages?pages.length:1));
    
    if (pages) { //eigentlich muesste jedes id wie bei page0 kopiert werden...
      //pagei=0;
      if (pagei==0&&!pages[pagei]) pages[pagei]={id:id,pra:pra};
      var d=id.data;
      for (var i=0;i<pages.length;i++) {
        var page=pages[i];
        //console.log(page);
        if (!page) { page={color:[0,100,200]};pages[i]=page; }
        
    if (!page.id) { //((!(page.id&&sameSize))) {
      if (!ctx) ctx=canvas.getContext('2d');
      var id2=ctx.createImageData(id);
      page.id=id2;
      page.pra=[];
      for (var h=d.length-1;h>=0;h--) id2.data[h]=d[h];
    }
        //log(i);
      }
    }
    
    if (!sameSize) {
      nbid=undefined;
      if (pages) pages[pagei].id=id;
    }
    
    var pl=pages?pages.length:1;
    
    
    mpage.ms=(pagei+1)+'/'+pl;
    if (pl>3) mpage.sub=mpage._sub; else delete mpage.sub;
  }
  function compress() {
    var pra2=[];
    var i=-1,ox0,oy0,ox1,oy1,odx,ody,ol=false;
    while (true) {
      i++;
      if (i==pra.length) break;
      var p=pra[i];
      var a=p.split(',');
      var a0=a[0];
      if (a0!='l') { 
        if (ol) {
          pra2.push('l,'+strf(ox0,10)+','+strf(oy0,10)+','+strf(ox1,10)+','+strf(oy1,10));
          ol=false;
        }
        pra2.push(p);
        continue; 
      }
      var x0=parseFloat(a[1]),y0=parseFloat(a[2]),x1=parseFloat(a[3]),y1=parseFloat(a[4]);
      var dx=x1-x0,dy=y1-y0,l=Math.sqrt(dx*dx+dy*dy);
      dx/=l;dy/=l;
      if (ol) {
        var newl=false;
        if (Math.abs(ox1-x0)>0.5||Math.abs(oy1-y0)>0.5) newl=true; 
        else if (Math.abs(dx-odx)>0.3||Math.abs(dy-ody)>0.3) newl=true;
        if (newl) {
          //pra2.push('l,'+ox0+','+oy0+','+ox1+','+oy1);
          pra2.push('l,'+strf(ox0,10)+','+strf(oy0,10)+','+strf(ox1,10)+','+strf(oy1,10));
          ox0=x0;oy0=y0;odx=dx;ody=dy;
        }
      } else {
        ox0=x0;oy0=y0;odx=dx;ody=dy;
      }
      ox1=x1;oy1=y1;ol=true;
    }
    //if (ol) pra2.push('l,'+ox0+','+oy0+','+ox1+','+oy1);
    if (ol) pra2.push('l,'+strf(ox0,10)+','+strf(oy0,10)+','+strf(ox1,10)+','+strf(oy1,10));
    log('Compressed '+pra.length+' -> '+pra2.length);
    pra=pra2;
  }
  function strf(f,m) {
    return Math.floor(f*m+0.5)/m;
  }
  function setsr(x,y) {
    x=Math.min(iw,Math.max(0,Math.floor(x+0.5)));
    y=Math.min(ih,Math.max(0,Math.floor(y+0.5)));
    var mw=2;
    if (srm==0||srm==1) {
      var w=sr.w-x+sr.x;
      if (w>mw) { sr.w=w;sr.x=x; } else { sr.x=sr.x+sr.w-mw;sr.w=mw; }
    }
    if (srm==0||srm==3) {
      var h=sr.h-y+sr.y;
      if (h>3) { sr.h=h;sr.y=y; } else { sr.y=sr.y+sr.h-mw;sr.h=mw; }
    }
    if (srm==3||srm==2)  sr.w=Math.max(mw,x-sr.x);
    if (srm==1||srm==2)  sr.h=Math.max(mw,y-sr.y);
    
    draw();
    //Menu.ms(mrect,sr.x+','+sr.y+'\u00b7'+sr.w+','+sr.h);
    mrectMs();
  }
  function encode64(input) {
    	var output = "", i = 0, l = input.length,
    	key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", 
    	chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    	while (i < l) {
    		chr1 = input.charCodeAt(i++);
    		chr2 = input.charCodeAt(i++);
    		chr3 = input.charCodeAt(i++);
    		enc1 = chr1 >> 2;
    		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    		enc4 = chr3 & 63;
    		if (isNaN(chr2)) enc3 = enc4 = 64;
    		else if (isNaN(chr3)) enc4 = 64;
    		output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
    	}
    	return output;
  }
  function setPage(i) {
    if (!pages) return;
    var page=pages[pagei];
    //if (!page) 
    if (page) {
      page.color=[br,bg,bb];
      page.id=getId();
    }
    
    pagei=i;//(pagei+1)%pages.length;
    
    page=pages[pagei];
    br=page.color[0];bg=page.color[1];bb=page.color[2];
    mcolorCol();
    id=pages[pagei].id;
    pra=pages[pagei].pra;pri=pra.length;Menu.ms(mpr,pri);
    draw();
    //m.ms=(pagei+1)+'/'+pages.length;
    Menu.ms(mpage,(pagei+1)+'/'+pages.length);
    
    if (normal^page.normal) {
      //og('setPage setMode '+normal+' '+page.normal);
      normal=page.normal;
      setMode(MDRAW);
    }
    
  }
  function text(s,x,y) {
    var ctx=canvas.getContext('2d');
    ctx.putImageData(id,0,0)
    ctx.fillStyle='rgb('+br+','+bg+','+bb+')';
    ctx.fillText(s,x,y);
    id=ctx.getImageData(0,0,iw,ih);
    if (pages) pages[pagei].id=id;
  }
  function arc(x,y,r) {
    var ctx=canvas.getContext('2d');
    ctx.putImageData(getId(),0,0)
    ctx.strokeStyle='rgb('+br+','+bg+','+bb+')';
    //ctx.fillText(s,x,y);
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.stroke();
    id=ctx.getImageData(0,0,iw,ih);
    if (pages) pages[pagei].id=id;
  }
  function checkNormalBlend() {
    normalblend=false;
    npi=-1;dpi=-1;spi=-1;
    if (pages) if (pages.length>1) {
      for (var i=0;i<pages.length;i++) if (pages[i].normal) npi=i; else if (dpi==-1) dpi=i; else spi=i;
      if ((npi!=-1)&&(dpi!=-1)) normalBlend=true;
    }
  }
  function getv(x,y,nonsel,mad,doVa) {
    if (!mad) mad=500;
    var e=0.01;
    var mav=undefined,va=[];
    var verts=tridata?tridata.verts:lo.verts;
    for (var h=verts.length-1;h>=0;h--) {
      var v=verts[h],vx,vy;
      if (tridata) {
        vx=v[0];vy=v[1];
      } else {
        if (v.paintSkip) continue;
        vx=v.u;vy=v.v;
      }
      var dx=x-vx*iw*scale,dy=y-vy*ih*scale,d=dx*dx+dy*dy;
      if (nonsel) if (selv.indexOf(v)!=-1) continue;
      if (d<mad) {
        mad=d;mav=v;va=[]
      }
      if (doVa&&Math.abs(d-mad)<=e) va.push(v);
    }
    if ((va.length>1)&&!mselmv.check) va.splice(1,va.length-1);
    if (doVa) getva=va;
    //og('getv va.len='+va.length);
    return mav;
  }
  function selectv(x,y) {
    var done=false;
       var mav=getv(x*scale,y*scale,false,isTouch?2000:undefined,true);
       if (mav) {
         if (wasTcDrag&&!mstayselv.checked) selv.splice(0,selv.length);
         wasTcDrag=false;
         //if (selv.indexOf(mav)==-1) selv.push(mav);
         for (var h=getva.length-1;h>=0;h--) {
           var v=getva[h];if (selv.indexOf(v)==-1) selv.push(v);
         }
         for (var h=selv.length-1;h>=0;h--) { 
           var v=selv[h];
           if (tridata) {
             v.ou=v[0];v.ov=v[1]; 
           } else {
             v.ou=v.u;v.ov=v.v; 
           }
         }
         if (tridata) {
           omx=mav[0]*iw;omy=mav[1]*ih;
         } else {
           omx=mav.u*iw;omy=mav.v*ih;
         }
         if (!isTouch) { imx=omx;imy=omy; }
         draw(true);
         done=true;
       } else if (!mstayselv.checked) {
         if (selv.length>0) {
           selv.splice(0,selv.length);
           draw(true);
           done=true;    
         }
       }
    return done;
  }
  function movev(x,y) {
    var mav=getv(x*scale,y*scale,true);
    if (mav) { 
      if (tridata) {
        x=mav[0]*iw;y=mav[1]*ih; 
      } else {
        x=mav.u*iw;y=mav.v*ih; 
      }
    }
    if (!isTouch) { imx=x;imy=y; }
    var dx=(x-omx)/iw,dy=(y-omy)/ih;
    for (var h=selv.length-1;h>=0;h--) { 
      var v=selv[h];
      if (tridata) {
        //onsole.log(v);
        v[0]=v.ou+dx;v[1]=v.ov+dy; 
      } else {
        v.u=v.ou+dx;v.v=v.ov+dy; 
      }
    }
    draw(true);
    wasTcDrag=true;
  }
  function recordGif(gf,pal,ct,gifw,gifh) {
    var da=ct.getImageData(0,0,gifw,gifh).data;
    
    
    var ia=new Array(gifw*gifh);
    var x=gifw,y=gifh-1,mix=10000,max=-10000,miy=10000,may=-10000,w2,h2,changes=false;
    for (var i=ia.length-1;i>=0;i--) {
      var ih=i*4;
      var r=da[i*4],g=da[i*4+1],b=da[i*4+2];
    
      x--;
      if (x<0) { y--;x=gifw-1; }
      
      if (oda) {
        if (r==oda[i*4]&&g==oda[i*4+1]&&b==oda[i*4+2]) { ia[i]=trai;continue; }
      }
      
      var pk=r+' '+g+' '+b;
      
      var bi=pali[pk];
      if (bi===undefined) {
        var bd=Number.MAX_VALUE;
        for (var h=pal.length-1;h>=0;h--) {
          if (h==trai) continue;
          var p=pal[h];
          var dr=p.r-r,dg=p.g-g,db=p.b-b,d=dr*dr+dg*dg+db*db;
          if (d<bd) {
            bd=d;bi=h;
          }
        }
        pali[pk]=bi;
      }
    
          ia[i]=bi;changes=true;
          if (x<mix) mix=x;if (x>max) max=x;if (y<miy) miy=y;if (y>may) may=y;
    
    }
    
    if (!changes) { mix=0;max=0;miy=0;may=0;ia[0]=trai; }
    
    
    
    
    
    w2=max-mix+1;h2=may-miy+1;
    
    
    
    if ((w2<gifw)||(h2<gifh)) {
      var ia2=new Array(w2*h2);
      for (var y=0;y<h2;y++) for (var x=0;x<w2;x++) {
        var ig=(y+miy)*gifw+mix+x;
        ia2[y*w2+x]=ia[ig];
    
      }
      ia=ia2;
    }
    
    oda=da;
    
    gf.addFrame(mix, miy, w2, h2,ia,{delay:10,transparent:trai,disposal:1});
  }
  function cutoutGet(x,y) {
    //--
    var mad=500,mav=undefined;
    if (cutout&&cutout.rects)
    for (var h=cutout.rects.length-1;h>=0;h--) {
      var r=cutout.rects[h];
      var dx=x-r.cx*scale,dy=y-r.cy*scale,d=dx*dx+dy*dy;if (d<mad) { mad=d;mav={x:r.cx,y:r.cy,r:r,ri:h,c:true}; }
      dx=x-r.x*scale;dy=y-r.y*scale;d=dx*dx+dy*dy;if (d<mad) { mad=d;mav={x:r.x,y:r.y,r:r,ri:h,p0:true}; }
      dx=x-(r.x+r.w)*scale;dy=y-(r.y+r.h)*scale;d=dx*dx+dy*dy;if (d<mad) { mad=d;mav={x:r.x+r.w,y:r.y+r.h,r:r,ri:h,p1:true}; }
      if (!r.ps) continue;
      for (var j=r.ps.length-1;j>=0;j--) {
        var p=r.ps[j];
        dx=x-p.x*scale;dy=y-p.y*scale;d=dx*dx+dy*dy;
        if (d<mad) { mad=d;mav=p; }
        //ct.fillRect(p.x+dx-2,p.y+dy-2,4,4);
      }
    
    }
    
    //if (mav) console.log(mav.r);
    
    return mav;
  }
  function xhr(fn,callback) {
    var r=new XMLHttpRequest();
    r.overrideMimeType('text/plain');
    r.open('GET',fn,true);//'paint/process/demo.txt'
    r.onreadystatechange=function() {
      if (this.readyState==4) callback(this.responseText);
    }
    try {
    r.send(null)
    } catch (e) { alert(e); }
  }
  function windowDataUrl(url,s) {
    var img=new Image();img.src=url;
    if (1) {
      var w=window.open();//'','test');//'',s);//'JpegExport');
      //var s=img.style;s.width='100px';s.height='100px';
      var body=w.document.body;
      body.style.backgroundColor='#440';
      body.appendChild(img);
      //w.document.write('Hello World.');
    } else { //tried this since window.open doesnt work with mobile webapp
      var c=document.createElement('div'),s=c.style;
      s.position='absolute';s.left='50px';s.top='50px';
      s.userSelect='auto';s.MozUserSelect='auto';s.WebkitUserSelect='auto';//doesnt work (button not clickable and image not saveable on mobile)
      var b=document.createElement('button');b.innerHTML='close';
    b.onclick=function() {
      document.body.removeChild(c);
    }
      c.appendChild(b);c.appendChild(document.createElement('br'));
      //following oncontextmenu doesnt work, tried to make image saveable
    c.appendChild(img);img.oncontextmenu=function() {
      return true;
    }
      document.body.appendChild(c); 
    }
    //w.document.location='#';//'#'+Math.random();
    //console.log(w.document.location);
    //...
  }
  function lsLoad() {
    //...
    var d=localStorage[lsKey];
    var c=localStorage[lsKey+'c'];
    loadcs=localStorage[lsKey+'cs'];
    if (c) loadpagec=c;
    brushpat=localStorage[lsKey+'brushpat'];
    if (brushpat==="false") brushpat=false;
    var cuous=localStorage[lsKey+'cutout'];
    if (cuous) try { cutout=JSON.parse(cuous);log('Cutout loaded: '+cutout.rects.length); } 
    catch (e) { log('Error while loading cutout from localstorage: '+e); }
    //lert('Load brushpat="'+(brushpat=='false'?'F':'T')+'"');
    if (d) loadDataUrl(d);
    else log('No image found in localStorage.');
    //...
  }
  //---
  function cDown(x,y) {
    if (mode==MMOVE) {
      movep.ox=movep.x;movep.oy=movep.y;
    } else if (mode==MCUTOUT) {
      cutoutP=cutoutGet(x*scale,y*scale);
      draw();
      //alert
    } else if (mode==MSELR) {
      var done=false;
      if (lo||tridata) {
        done=selectv(x,y);
        console.log('paint.cDown done='+done);
      }
      if (!done) {
      var lx=x<sr.x+sr.w/2;
      var ly=y<sr.y+sr.h/2;
      if (lx) {
        if (ly) srm=0; else srm=1;
      } else {
        if (ly) srm=3; else srm=2;
      }
      setsr(x,y);
      }
    } else if (pickm) 
      pick(x,y);
    else if (mode==MCOPYBRUSH&&!copybrush) {
      copybrush={x:x,y:y,abs:true};
      draw();
    } else if (!isTouch) {//---dont draw because e.g. it could be multitouch to scale img..
      if (copybrush) if (copybrush.abs) {
        copybrush.x-=x;//=x-copybrush.x;
        copybrush.y-=y;//=y-copybrush.y;
        copybrush.abs=false;
      }
      if (keyd[16]&&lastBrush)
        brushline(lastBrush.x,lastBrush.y,x,y);
      else
        brush(Math.floor(x+0.5),Math.floor(y+0.5));
      lastBrush.x=x;lastBrush.y=y;
      
      if (!(canvDraw&&(mode==MDRAW))) draw();
      //imx=x;imy=y;
    }
  }
  function cMove(x,y) {
    if (mode==MMOVE) {
      movep.x=Math.floor(movep.ox+x-imx+0.5);
      movep.y=Math.floor(movep.oy+y-imy+0.5);
      mrectMs();
      draw();
    } else if (mode==MCUTOUT) {
      var p=cutoutP;
      x=Math.floor(x);y=Math.floor(y);
      imx=x;imy=y;
      if (p) {
        if (p.p0) {
          p.r.x=x;p.r.y=y;
        } else if (p.p1) {
          p.r.w=Math.max(4,x-p.r.x);p.r.h=Math.max(4,y-p.r.y);
        } else if (p.c) {
          p.r.cx=x;p.r.cy=y;
        } else {
          p.x=x;p.y=y;
        }
        draw();
      }
    } else if (mode==MSELR) {
      if (selv.length==0) {
        setsr(x,y);imx=x;imy=y;
      } else {
        //ggf vorher clip
        movev(x,y);
    
      }
    } else if (pickm) {
      pick(x,y); 
      imx=x;imy=y;
      drawBrush(imx,imy,imx,imy);
    } else {
      var skip=false;
      if (mode==MCOPYBRUSH) if (copybrush) if (copybrush.abs) skip=true;
      if (skip) { imx=x;imy=y;draw(); } else brushline(imx,imy,x,y);
      imx=x;imy=y;
      lastBrush.x=x;lastBrush.y=y;
    }
  }
  function cUp() {
    
    
    if (wasBrush&&lo) {
      var m=lo.meshes[lo.selmesh];
      var c=canvlo;
      if (!c) {
        c=document.createElement('canvas');
        c.width=iw;c.height=ih;
        canvlo=c;
      }
      var ct=c.getContext('2d');
      ct.putImageData(getId(),0,0);//id
      pages[pagei].id=id;
      //onsole.log('paint.cUp');
      //onsole.log(m);
      //nbid=undefined;
      var text=pagei==0?m.tdiff:(pagei==1?m.tnorm:m.tspec);
      text.image.src=c.toDataURL('image/jpeg');
      //m.tdiff.needsUpdate=true;
      //lo.drawNew=true;
      
      draw();
      setPage(pagei);//| this is needed for normalBlendMode to update
    }
    wasBrush=false;
    
    if ((mode==MSELR)&&lo) W3dit.meshUpdate();
    
  }
  function pickEndCheck() {
    
    if (pickm) {
      pickm.s='Brush';
      pickm.c.children[0].innerHTML='Brush';
      pickm=undefined;
      if (canvDraw) canvas.getContext('2d').putImageData(id,0,0);
      return 1;
    }
    return 0;
    
  }
  function mouseMove(e) {
    var x=e.pageX,y=e.pageY;
    mx=x;my=y;
    if (moused[3]) return;
    if (moused[2]) {//moused[3]
    //else if (keyA[18]||moused[2]||(moused[1]&&!keyA[17])) {//alt
      ix=oix+x-omx;
      //y=Math.min(y,window.innerHeight-10);
      iy=oiy+y-omy;
      //log('mouseMove '+oix+' '+oiy+' -> '+ix+' '+iy);
      canvas.style.left=ix;canvas.style.top=iy;
      canvm.style.left=ix+1;canvm.style.top=iy+1;
      //e.preventDefault();
      //e.stopPropagation();
      return;
    }
    if (!md||Menu.press) {
      Menu.search(x,y);
      
      x-=ix;y-=iy;
      
      if (mode==MCUTOUT) {
        var mav=cutoutGet(x,y);
        if (mav) { x=mav.x*scale;y=mav.y*scale; }
        //---
      }
      
      if ((mode==MSELR)&&lo) { //ggf clip to next
        var mav=getv(x,y);
        if (mav) { x=mav.u*iw*scale;y=mav.v*ih*scale; }
        //x=10;y=10;
      }
      x/=scale;y/=scale;
      
      imx=x;imy=y;
      if (keyd[76]) {
        light.x=(x/iw-0.5)*40;
        light.y=(y/ih-0.5)*40;
        drawArea=undefined;
      } else 
        drawArea={x0:0,y0:0,x1:-1,y1:-1};
      if (!(canvDraw&&(mode==MDRAW))) draw();
      
      return;
    }
    if (Menu.mcontrol) return;
    x-=ix;y-=iy;x/=scale;y/=scale;
    //var dx=imx-x,dy=imy-y;
    //var d=Math.sqrt(dx*dx+dy*dy);
    //for (var h=0;h<d;h+=Math.floor(bra/3+0.5)+1) 
    //  brush(Math.floor(x+dx*h/d+0.5),Math.floor(y+dy*h/d+0.5));
    //draw();
    cMove(x,y);
  }
  function mouseUp(e) {
    md=false;
    if (e.which) moused[e.which]=false;
    pickEndCheck();
    //if (pickm) {
    //  pickm.s='Brush';
    //  pickm.c.innerHTML='Brush';
    //  pickm=undefined;
    //}
    
    Menu.mouseUp();
    
    cUp();
    //--alert(canvas.toDataURL("image/png"));
    //--self.location=canvas.toDataURL("image/png");
    //window.open(canvas.toDataURL("image/png"),'PngExport');
    //--later: img.src=dataUrl to load things
  }
  function mouseDown(e) {
    //alert(e.pageX+' '+e.pageY);
    if (Menu.mouseDown()) return;
    wasBrush=false;
    var x=e.pageX,y=e.pageY;
    mx=x;my=y;
    if (e.which) moused[e.which]=true;
    //if (pickm) {//||moused[2]
      ////window.open(canvas.toDataURL("image/png"),'PngExport');
      //self.location=canvas.toDataURL("image/png");
      //x-=ix;y-=iy;x/=scale;y/=scale;
      //pick(x,y);
      //return;
    //}
    if (moused[3]) return;
    if (moused[2]) {//[3]
      oix=ix;oiy=iy;omx=x;omy=y;
      return;
    }
    if (Menu.mcontrol||replay) return;
    md=true;
    x-=ix;y-=iy;x/=scale;y/=scale;
    imx=x;imy=y;
    cDown(x,y);
  }
  function mouseScroll(e) {
    if (Menu.mcontrol) return;
    var up=false;
    if (e.wheelDelta!=undefined) up=e.wheelDelta>0;
    else up=e.detail<0;
    
    //doScale(mx,my,up?1.2:1/1.2);
    var scale0=scale;
    scale*=(up?1.2:1/1.2);
    
    //canvas.style.width=iw*scale;canvas.style.height=ih*scale;
    ix=Math.floor(mx-(mx-ix)*scale/scale0+0.5);
    iy=Math.floor(my-(my-iy)*scale/scale0+0.5);
    isize();
    //canvas.style.top=iy;canvas.style.left=ix;
    //canvas.style.width=iw*scale;canvas.style.height=ih*scale;
    //canvm.style.left=ix+1;canvm.style.top=iy+1;
    //canvm.style.width=iw*scale;canvm.style.height=ih*scale;
    
    //bra=Math.floor(10/scale+0.5);
    
  }
  function touchStart(e) {
    isTouch=true;
    for (var h=0;h<e.touches.length;h++) {
      var t=e.touches[h];
      var x=t.pageX,y=t.pageY;
      imx=(x-ix)/scale;
      imy=(y-iy)/scale;
      //if (h==0) {
        //if (pickm) pick(imx,imy);
        //Menu.touchStart(x,y);
    
      //}
      touches[t.identifier]=touchlast={ox:x,oy:y,oimx:imx,oimy:imy};
      //brush(Math.floor(imx+0.5),Math.floor(imy+0.5));
      //draw();
      //if ((x<200)&&(y<200)) { tryFullscreen();return;  }
      ////sh+=' '+t.identifier+'-'+c;
      //if (c) { c.xt=t.pageX;c.yt=t.pageY; }
      //var c={x:x,y:y,mx:x,my:y,dx:0,dy:0,t:ot};
      //tparts[t.identifier]=c;//h
      //mousep=c;
      //odx=dx;ody=dy;vx=0;vy=0;
    }
    var tl=touchlast;
    var l=e.touches.length;
    if (l==1) {
      if (!Menu.touchStart(touchlast.ox,touchlast.oy)) {
      touchMode=TM_DRAW;
      //if (mode==MSELR) {
      //  selectv(tl.oimx,tl.oimy);
      //  //var mav=getv(tl.oimx*scale,tl.oimy*scale,false,1000);log('>'+mav);
      //}
      cDown(imx,imy);
      }
    } else if (l==2) { 
      oix=ix;oiy=iy;oscale=scale;touchMode=TM_IMG;
      //log('touchStart '+oix+' '+oiy); 
    }
    //lo.t=0;lo.ta=0;aY+=0.2;ida=[];//undefined;
    //log('touchstart '+sh);
    if (!Menu.mcontrol) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
  }
  function touchMove(e) {
    var l=e.touches.length,sdx=0,sdy=0;
    for (var h=0;h<e.touches.length;h++) {
      var t=e.touches[h];
      var x=t.pageX,y=t.pageY;
      if (Menu.press) {
        Menu.search(x,y);
        break;
      }
      var to=touches[t.identifier];
      to.dx=x-to.ox;sdx+=to.dx;to.x=x;
      to.dy=y-to.oy;sdy+=to.dy;to.y=y;
    
      //brush(Math.floor(imx+0.5),Math.floor(imy+0.5));
      //draw();
      if (touchMode==TM_DRAW) {
        cMove((x-ix)/scale,(y-iy)/scale);
        //var imx=(x-ix)/scale;
        //var imy=(y-iy)/scale;
        //if (mode==MSELR) {
        //  movev(imx,imy);
        //} else if (pickm) pick(imx,imy); else {
        //  brushline(to.oimx,to.oimy,imx,imy);
        //  to.oimx=imx;to.oimy=imy;
        //}
      } else if (l==2&&(touchMode==TM_IMG)&&(h==1)) {
        var to0=touches[e.touches[0].identifier];
          
        var mx=(to0.ox+to.ox)/2,my=(to0.oy+to.oy)/2;  
        var dx0=to0.ox-to.ox,dy0=to0.oy-to.oy;
        var l0=Math.sqrt(dx0*dx0+dy0*dy0);
        //var dx1=to0.ox+to0.dx-to.ox-to.dx,dy1=to0.oy+to0.dy-to.oy-to.dy;
        var dx1=to0.x-to.x,dy1=to0.y-to.y;
        var l1=Math.sqrt(dx1*dx1+dy1*dy1);
    
        ix=oix;//ix=Math.floor(oix+sdx/l+0.5);
        iy=oiy;//iy=Math.floor(oiy+sdy/l+0.5);
            
        var dh=l1-l0;
        var f=dh*0.005;//0.005
        if (f>0) f=1+f; else f=1/(1-f);
        scale=oscale*f;
        
    
        ix=Math.floor(mx-(mx-ix)*scale/oscale+0.5);
        iy=Math.floor(my-(my-iy)*scale/oscale+0.5);
        ix=Math.floor(ix+sdx/l+0.5);
        iy=Math.floor(iy+sdy/l+0.5);
        
        canvas.style.width=iw*scale;
        canvas.style.height=ih*scale;
        canvas.style.top=iy;
        canvas.style.left=ix;
    
        canvm.style.left=ix+1;canvm.style.top=iy+1;
        canvm.style.width=iw*scale;canvm.style.height=ih*scale;
        //bra=Math.floor(10/scale+0.5);
        
        //canvas.style.left=ix;canvas.style.top=iy;
        //og('touchMove '+ix+' '+iy);
      }
      //if ((x<200)&&(y<200)) { tryFullscreen();return;  }
      ////sh+=' '+t.identifier+'-'+c;
      //if (c) { c.xt=t.pageX;c.yt=t.pageY; }
      //var c={x:x,y:y,mx:x,my:y,dx:0,dy:0,t:ot};
      //tparts[t.identifier]=c;//h
      //mousep=c;
      //odx=dx;ody=dy;vx=0;vy=0;
    }
    if (!Menu.mcontrol) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
  }
  function touchEnd(e) {
    if (!Menu.touchEnd()&&!replay&&(touchMode==TM_DRAW)) {
      if (mode==MSELR) {
      } else if (pickEndCheck()) {
        //pickm.s='Brush';
        //pickm.c.innerHTML='Brush';
        //pickm=undefined;
      } else if (mode==MDRAW) { //if (touchMode==TM_DRAW) {
        brush(Math.floor(touchlast.oimx+0.5),Math.floor(touchlast.oimy+0.5));
        if (!canvDraw) draw();
      }
      cUp();
    }
    
    if (!Menu.mcontrol) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
    isTouch=false;
  }
  function resize(e) {
    //log('resize');
    Menu.draw();
  }
  function keyDown(e) {
    //log('keyDown '+e.keyCode);
    if (Menu.mcontrol) return;
    if (Menu.keyDown(e)) return;
    var kc=e.keyCode;
    keyd[kc]=true;
    //og('keydown '+kc);
    switch (kc) {
      case 39:if (pages) setPage((pagei+1)%pages.length);Menu.seta(mroots);break;
      case 37:if (pages) setPage((pagei-1+pages.length)%pages.length);Menu.seta(mroots);break;
      case 85:if (normal) setNormalMode(NMUP);break;
      case 68:if (normal) setNormalMode(NMDOWN);break;
    }
    
    
  }
  function keyUp(e) {
    if (Menu.mcontrol) return;
    var kc=e.keyCode;
    keyd[kc]=false;
    switch (kc) {
      case 85:
      case 68:if (normal) setNormalMode(NMCOL);break;
    }
    
    if (lo) W3dit.shortKeys(kc);
  }
  function isize() {
    //onsole.log('isize '+ix+' '+iy);
    canvas.style.top=iy;canvas.style.left=ix;
    canvas.style.width=iw*scale;canvas.style.height=ih*scale;
    
    canvm.style.left=ix+1;canvm.style.top=iy+1;
    canvm.style.width=iw*scale;canvm.style.height=ih*scale;
    
    //...
  }
  function conetLoad(v,atStart,callback,ps) {
    if (!ps) ps={};
    cutout=undefined;
    Conet.download({fn:v,f:function(v0) {
      if (!ps.dataUrlF) adata={};
      var s;
      Menu.setChecked(mprocesscs,false);
      //if (v.endsWith('.json.txt')) {
      if (v.indexOf('.json')!=-1) {
        var d=JSON.parse(v0);
        if (ps.dataUrlF) { ps.dataUrlF(d.data);return; }
        loadDataUrl(d.data,undefined,callback);
        if (d.cutout) cutout=d.cutout;
        tridata=d.tridata;
        if (s=d.background) mbackground.setfunc(s);
        if (s=d.bp) mbp.setfunc(''+s);
        if (s=d.bra) mbra.setfunc(''+s);
        if (s=d.col) msetcol.setfunc(s[0]+','+s[1]+','+s[2]); 
        if (s=d.process) { 
          prSet(s);Menu.setChecked(mprocesscs,true); 
          log('conetLoad d.process.length='+s.length+', pra.len='+pra.length);
        }
        if (s=d.scale) scale=parseFloat(s);
        if (s=d.ix) { ix=parseInt(s);isize(); }
        if (s=d.iy) { iy=parseInt(s);isize(); }
        if (s=d.layerDraw) 
      conetLoad(s,undefined,undefined,{dataUrlF:function(v) {
        //onsole.log('conetLoad.download.layerDraw='+s);
        var img=new Image();
        img.src=v;
        img.onload=function() {
          var ct=canvm.getContext('2d');
          ct.drawImage(img,0,0);
          clearCanv=false;
          //...
        }
        //...
      }
      }); else clearCanv=true;
        
        draw();
        if (d.cutout) if (cutout.carves||(cutout.rects&&(cutout.rects.length>0))) cfmenu.checkListFile(v);
        var sh={data:1,bp:1,bra:1,col:1,background:1,scale:1,ix:1,iy:1,tridata:1,process:1};
        for (var k in d) if (d.hasOwnProperty(k)) if (!sh[k]) adata[k]=d[k];
        //onsole.log('conetLoad adata=');onsole.log(adata);
        //---sth cutout edit loads last loaded cutout on restart
      } else {
        //var i=v0.indexOf(',');
        //console.log('paint.conetLoad '+v0.substr(0,i+1));
        //console.log(atob(v0.substr(i+1)));
        if (ps.dataUrlF) { ps.dataUrlF(v0);return; }
        loadDataUrl(v0,undefined,callback);
      }
    }
    });
    
    //...
  }
  
  Paint.stacktrace=function() {
    function st2(f) {
      return !f ? [] :
      st2(f.caller).concat([f.toString().split('(')[0].substring(9) + '(' + Array.prototype.slice.call(f.arguments).join(',') + ')']);
    }
    log('stacktrace: '+st2(arguments.callee.caller));
  }
  Paint.activate=function() {
    var c=window;//canvas;//window
    c.addEventListener('mousemove',mouseMove,false);
    c.addEventListener('mousedown',mouseDown,false);
    c.addEventListener('mouseup',mouseUp,false);
    c.addEventListener('DOMMouseScroll',mouseScroll,false);
    c.addEventListener('mousewheel',mouseScroll,false);
    c.addEventListener('touchstart',touchStart,{passive:false});//false);
    c.addEventListener('touchmove',touchMove,{passive:false});//false);
    c.addEventListener('touchend',touchEnd,{passive:false});//false);
    c.addEventListener('resize',resize,false);
    c.addEventListener('keydown',keyDown,false);
    c.addEventListener('keyup',keyUp,false);
    //Menu.colBg='rgba(100,100,100,0.4)';
    Menu.init(mroots,{diw:750});
    mrectMs();
    mcolorCol();
    //log('mode='+mode);
    if (mode==-1) mode=MDRAW;//mode was -1 via w3dit, but now no more
    
    //if (idima) {
    if (!idima) { idima={ix:10,iy:10,scale:1}; }
      ix=idima.ix;iy=idima.iy;scale=idima.scale;
      isize();
    //} else idima={ix:ix,iy:iy,scale:scale};
  }
  Paint.deactivate=function() {
    //if (!idimda) idimda={ix:ix,iy:iy,scale:scale};else 
    {
      idima={ix:ix,iy:iy,scale:scale};
      //ix=idimda.ix;iy=idimda.iy;scale=idimda.scale;
      ix=0;iy=100;scale=50/iw;
      isize();
    }
    var c=window;//canvas;//window
    c.removeEventListener('mousemove',mouseMove,false);
    c.removeEventListener('mousedown',mouseDown,false);
    c.removeEventListener('mouseup',mouseUp,false);
    c.removeEventListener('DOMMouseScroll',mouseScroll,false);
    c.removeEventListener('mousewheel',mouseScroll,false);
    c.removeEventListener('touchstart',touchStart,false);
    c.removeEventListener('touchmove',touchMove,false);
    c.removeEventListener('touchend',touchEnd,false);
    c.removeEventListener('resize',resize,false);
    c.removeEventListener('keydown',keyDown,false);
    c.removeEventListener('keyup',keyUp,false);
  }
  Paint.set3d=function(o,sv) {
    lo=o;selv=sv;
    var m=lo.meshes[lo.selmesh];
    //console.log('Paint.set3d '+lo.meshes.length);
    if (m.diff) {
      setdim(iw,ih,1);
      loadDataUrl(m.diff);
      lo.loadnext='norm';
    }
    /*
    if (lo.dns) {
      loadpagec=3;
      loadcs='n1';
      loadDataUrl(lo.dns);
    }
    */
    //alert(id);
    lo.id=id;
  }
  
  Paint.loaded=function(aco,acoH_) {
    if (acoH_) acoH=acoH_;
    sal=!aco;//stand alone=!as component
    var title='Wepaint '+version;
    if (sal) {
      document.title='Wepaint';//title; //better not version in title, else mobile webapp might show old version on startup
      
      /*
      var v0,v1,v2;
      lo={
        verts:[v0={u:0.5,v:0.5},v1={u:0.7,v:0.1},v2={u:0.9,v:0.9},],
        fa:[{v0:v0,v1:v1,v2:v2}]
      };
      */
      urls=Conet.parseUrl();
    } else { 
      //mode=MSELR;sr.x=0;sr.y=0;  //-- if sr isnt set to 0,0, images are loaded with translation..
      mode=MCUTOUT;
    } 
    //alert(-105%100);
    log(title);
    //log('Conet '+Conet.version);
    canvas=document.getElementById('pcanvas');
    //if (!canvas) {
    //  canvas=document.createElement('pcanvas');
    //  canvas.style.cssText='position:absolute;top:10px;left:10px;border-style:solid;border-width:1px;border-color:#000000;background-image:url(paintbg.png);background-attachment:fixed;cursor:none;';
    //  document.body.appendChild(canvas);
    //}
    
    if (!canvas) {
      canvas=document.createElement('canvas');
      canvas.style.cssText='position:absolute;top:10px;left:10px;border-style:solid;border-width:1px;border-color:#000000;background-image:url(paintbg.png);background-attachment:fixed;cursor:none;';
      document.body.appendChild(canvas);
    }
    
    //----
    
    
    //ix=20;iy=20;//120;
    if (sal) { 
      ix=20;iy=20;
      iw=512;ih=512;//iw=256;ih=256; 
      scale=acoH.scale?acoH.scale:1;
    } else { 
      ix=0;iy=100;
      iw=64;ih=64; 
      scale=50/iw;
    }
    //scale=acoH.scale?acoH.scale:(sal?1:0.5);//1
    canvas.width=iw;canvas.height=ih;
    canvas.style.width=iw*scale;canvas.style.height=ih*scale;
    canvas.style.left=ix;canvas.style.top=iy;
    var ctx=canvas.getContext('2d');
    id=ctx.getImageData(0,0,iw,ih);
    clear(true);
    if (normal) {
      br=128;bg=128;bb=255; } 
    else {
      br=0;bg=100;bb=200; }
    
    canvm=document.createElement('canvas');
    canvm.width=iw;canvm.height=ih;
    canvm.style.cssText='position:absolute;top:'+(iy+1)+'px;left:'+(ix+1)+'px;width:'+canvm.width+'px;height:'+canvm.height+'px;';
    
    //var cm=canvm.getContext('2d');
    //cm.strokeStyle='#f00';
    //cm.strokeRect(0,0,iw,ih);
    //cm.strokeRect(iw/4,ih/4,iw/2,ih/2);
    
    document.body.appendChild(canvm);
    
    
    
    //demo();
    var mview,script0='clearFill(0,0,0,0);\n'+
    'brush(10,10);\n'+
    'draw();\n'+
    '//loadScale=0.5;\n';
    
    
    
    //mroots=[];
    
    //if (sal) {
    //  Paint.activate();
    //}
    //window.onkeydown=keyDown;
    //window.onkeyup=keyUp;
    
    
    function cutoutStr() {
      //...
      
      var a=[
        //['rects',['x','y','w','h','cx','cy',['ps',['x','y']]],1],
        //['bones',['i','p','pp','z'],1],
        //'carves',
        ['carves',['p0','p1','bo','dabs','bbo'],1],
        ['rects',['x','y','w','h','cx','cy'],1],
        ['bones',['i','p','z','a','x','y','xs','ys','u','v'],1],
        ['tris',['p0','p1','p2','z']],
        ['anims',['name',['a',['t',['a',['a','x','y','xs','ys']]],1]]]
      ];
      
      function stri(a,o) {
        var s='{';
        var first=true;
        for (var h=0;h<a.length;h++) {
          var v=a[h],k,aa=undefined;
          if (typeof(v)=='string') k=v; else { k=v[0];aa=v; }
          var ok=o[k];
          if (ok===undefined) continue;
          s+=(first?'':',')+'"'+k+'":';first=false;
          if (aa) {
            s+='[';
            for (var i=0;i<ok.length;i++) {
              s+=(i==0?'':',')+stri(v[1],ok[i]);if (v.length==3) s+="\n";
            }
            s+=']';
          } else {
            s+=JSON.stringify(ok);
          }
        }
        s+='}';
        return s;
      }
      
      return stri(a,cutout);
      
      
    }
    
    mbp={s:'0.1',ms:'brush pressure',autoval:true,lskey:'wepaintbp',setfunc:function(v) {
      bp=parseFloat(v);this.s=v;
      if (mode==MERASE) eraseConf.bp=bp;
      if (mode==MDRAW) drawConf.bp=bp;
    }
    ,sub:[{s:'0.01'},{s:'0.03'},{s:'0.05'},{s:'0.075'},{s:'0.1'},{s:'0.2'},{s:'0.3'},{s:'1'}]};
    
    mbra={s:'10',ms:'brush radius',autoval:true,lskey:'wepaintbra',setfunc:function(v) {
      bra=parseInt(v);this.s=v;
      if (mode==MERASE) eraseConf.bra=bra;
      if (mode==MDRAW) drawConf.bra=bra;
    }
    ,sub:[{s:'1'},{s:'2'},{s:'3'},{s:'5'},{s:'10'},{s:'20'},{s:'30'},{s:'50'},{s:'100'}]};
    
    mcolor=pickm={s:'Brush',t_extShadow:'1px 1px 2px rgb(230,230,230)',r_:1,stay:1,vertCenter:1};
    
    mcanvas=
    {s:'Dimension',doctrl:'Canvas Dimension',setfunc:function(v) {
      //alert('canvassetfunc '+v);
      var a=v.split('x');//alert(a.length);
      
      setdim(parseInt(a[0]),parseInt(a[1]),(a.length>2?parseInt(a[2]):1));
      //iw=parseInt(a[0]);ih=parseInt(a[1]);
      //canvas.width=iw;canvas.height=ih;
      //canvas.style.width=iw*scale;canvas.style.height=ih*scale;
      //var ctx=canvas.getContext('2d');
      //ctx.putImageData(id,0,0);
      //id=ctx.getImageData(0,0,iw,ih);
      
      this.ms=v;
      //mode=-1;
      //Menu.cmenu=mcolor;
      //Menu.action();
      setMode(MDRAW);
    }
    ,valuef:function() {
      return iw+'x'+ih+(pages?'x'+pages.length:'x1');
    }
    };
    mcanvas.msf=mcanvas.valuef;
    mtools={s:'Tools',vertCenter:1,sub:[{s:'Brush'},mrect={s:'Rect',ms:'-',msid:'mrectms'},merase={s:'Eraser'},munerase={s:'Uneraser'},mcopybrush={s:'Copy Brush'},mcutout={s:'Cutout'}]};
    mscript={s:'Edit&middot;Run',doctrl:'Run script',cstay:true,lskey_:'paintscript0',mcfs:0.07,ta:true,tacols:50,tarows:20,ms:script0.length,value:script0,setfunc:function(v,initLoad) {
      this.value=v;
      this.ms=v.length;
      //new Function('f0',v)();
      if (!initLoad)
      try {
        eval(v);
      } catch (e) { log(e); }
    }
    }
    mcolors={s:'Color',vertCenter:1,textShadow:'1px 1px 2px rgb(230,230,230)',noinp:1,noTri:1,sub:[mbp,mbra,mcolor]
    ,actionf:function() {
      this.bgcol='';
    }
    };
    var ca=[[0xff,0,0],[0xff,0x99,0x33],[0xff,0xff,0],[0xff,0x33,0xff],
      [0x99,0,0x99],[0,0,0xff],[0,0xcc,0xff],[0x33,0xff,0],[0,0x99,0],
      [0x99,0x66,0],[255,255,255],[175,175,175],[0,0,0]];
    for (var i=0;i<ca.length;i++) {
      var a=ca[i],sh=a[0]+','+a[1]+','+a[2];mcolors.sub.push({s:'',bgcol:'rgb('+sh+')',a:'col_'+sh,pw:0.05,stay:1});
    }
    
    cfmenu=Conet.fileMenu({fn:'paint/files.txt',defFn:'test.png.txt',filesRef:'paint',noStartLoad:sal?0:1
      ,loadf:conetLoad,noh:!sal||!urls.withh,nolistf:lsLoad
    ,savef:function(v) {
      var data=Paint.saveCanvas(undefined,undefined,{nocanvm:1}).toDataURL(
        'image/'+(adata.saveJpg||v.endsWith('.jpeg.json.txt')?'jpeg':'png')),
        pd;
      //if (v.endsWith('.json.txt')) {
      if (v.indexOf('.json')!=-1) {
        data='{'
          +(cutout&&((cutout.rects&&(cutout.rects.length>0))||cutout.carves)?'"cutout":'+cutoutStr()+',':'')
          +(tridata?'"tridata":'+JSON.stringify(tridata)+',':'')
          +(mbackground.ms!='checker'?'"background":"'+mbackground.ms+'",':'')
          +'"bp":'+(drawConf.bp||bp)+','
          +'"bra":'+(drawConf.bra||bra)+','
          +'"col":['+br+','+bg+','+bb+'],'
          +'"scale":'+scale+','
          +'"ix":'+ix+','
          +'"iy":'+iy+','
          +(mprocesscs.checked?'"process":'+(JSON.stringify(pd=pra.join('\n')))+',':'')
          +'"data":"'+data+'"';
        //console.log('loaded.savef adata=');console.log(adata);
        for (var k in adata) if (adata.hasOwnProperty(k)) data+='\n,"'+k+'":'+JSON.stringify(adata[k]);
        data+='}';
      }
      //if (1) console.log(data); else 
      Conet.upload({fn:v,data:data,f:function(d) {
        //onsole.log('paint.save 0');
        //onsole.log('paint.save d="'+d+'"');
        if (d==='') { log('Conet.save error.');return; }
        log('Conet.saved: '+v+' (len='+data.length+').');
        if (pd) {
          log(' d.process.length='+pd.length+', pra.len='+pra.length);
        }
      }
      });
      
    }
    });
    cfmenu.sub.push(
    
    {s:'More IO',sub:[
    //{s:'Load',ms:'file',a:'loadfile',doctrl:'Load file',file:1},
    {s:'Load',ms:'localStorage'},{s:'Save',ms:'localStorage'},
    {s:'Import',doctrl:'(Data)Url',lskey:'paintimport',ta:true,setfunc:function(v,initLoad) {
      this.value=v;
      if (!initLoad) loadDataUrl(v);
    }
    },{s:'Export',ms:'png'},{s:'Export(blend)<br>page',fs:0.75,ms:'png',a:'exportpage'},
    {s:'Export(blend)<br>page',fs:0.75,ms:'jpeg',a:'exportpagejpeg'},
    {s:'Export',ms:'gif',a:'_gifa',sub:[
    {s:'Export',a:'Gif'},
    mgiftr={s:'transparency<br>cur.color',fs:0.75,ms:'no',stay:true},
    mgiflb={s:'loop back',ms:'no',stay:true},
    {s:'Palette...',doctrl:'Palette',ta:true,wrap:true,valuef:function() {
      return JSON.stringify(pal);
    }
    ,setfunc:function(v) {
      try {
      pal=JSON.parse(v);
      } catch (e) { log('Palette edit: '+e); }
    }
    },{s:'Set Palette',ms:'via NeuQuant.js'}]}
    ]}
    
    );
    //------------
    mroots=[mmenu={s:'Menu',vertCenter:1,sub:[
    
    mtools,mbp,mbra,mcolor,//mcolors,
    
    //{s:'Version '+version,fs:1.4,ph:0.02,noinp:1},
    
    cfmenu,
    
    
    //]},
    {s:'Edit',sub:[mcanvas
    ,{s:'Clear',ms:'Bitmap & Process-list'}    
    ,msetcol={s:'Set color',//ms:br+','+bg+','+bb,
      doctrl:'Color R,G,B values'
    ,valuef:function() {
      return br+','+bg+','+bb;
    }
    ,setfunc:function(v) {
      var a=v.split(',');
      br=a[0];bg=a[1];bb=a[2];this.ms=v;
      mcolorCol();
    }
       },
    
       {s:'Pattern<br>brush',fs:0.8,ms:brushpat?'on':'off',a:'brushpat'},
       //{s:'Normals:<br>Invert red',fs:0.8,a:'norminvertred'},
       
       
    {s:'Scale',doctrl:'Scale page(s) to',setfunc:function(v) {
      getId();
      var a=v.split('x');
      var w=a[0],h=a[1];
      var c=document.createElement('canvas');
      c.width=iw;c.height=ih;
      var ct=c.getContext('2d');
      canvas.width=w;canvas.height=h;
      canvas.style.width=w*scale;canvas.style.height=h*scale;
      var ctx=canvas.getContext('2d');
      
      ////id=undefined;getId();
      //var ch=document.createElement('canvas');ch.width=iw;ch.height=ih;var cht=ch.getContext('2d');
      //cht.fillStyle='#0f0';cht.fillRect(0,0,ch.width,ch.height);cht.putImageData(id,0,0);
      //document.body.appendChild(ch);
      
      
      
      //onsole.log('scale.setfunc pages:'+(pages?pages.length:'undef'));
      //onsole.log('id='+id+' getid='+getId());
      for (var i=0;i<(pages?pages.length:1);i++) {
        var page=pages?pages[i]:undefined;
        var idh=page?page.id:id;
        if (!idh) { console.log('no idh continueing');continue; }
        ct.putImageData(idh,0,0);
        ctx.drawImage(c,0,0,w,h);
        idh=ctx.getImageData(0,0,w,h);
        if (page) { page.id=idh;page.change=true; }
        if (i==0) { id=idh;if (lo) lo.id=id; }
      }
      
      
      nbid=undefined;
      
      var xf=w/iw,yf=h/ih;
      for (var i=0;i<cutout.rects.length;i++) {
        var r=cutout.rects[i];
        r.x*=xf;r.y*=yf;r.w*=xf;r.h*=yf;r.cx*=xf;r.cy*=yf;
        if (r.ps) for (var j=0;j<r.ps.length;j++) {
          var p=r.ps[j];
          p.x*=xf;p.y*=yf;
        }
      }
      
      iw=w;ih=h;
      Menu.ms(mcanvas,iw+'x'+ih+'x'+(pages?pages.length:1));
      draw();
      isize();
      log('Scaled to '+v+(cutout.rects.length>0?' (also '+cutout.rects.length+' cutout-rects)':'')+'.');
    }
    ,valuef:function() {
      return iw+'x'+ih;
    }
    },{s:'Filter',sub:[{s:'Contrast'},{s:'Grey'}]},
    
    {s:'Tridata',doctrl:'Tridata e.g. {"verts":[[0,0],[0.5,0.5],[1,0]],"tris":[[0,1,2]]}',cstay:true,r:true,mcfs:0.07,ta:true,wrap:1,tacols:50,tarows:20,setfunc:function(v,initLoad) {
      tridata=v.length==0?undefined:JSON.parse(v);
      draw(true);
    }
    ,valuef:function() {
      return tridata?JSON.stringify(tridata):'';
    }
    },
    
    {s:'Add.Data',doctrl:'Additional data<span style="font-size:0.7em;">&middot;keys:layerDraw,saveJpg</span>',mcfs:0.07,ta:true,wrap:0,tacols:30,tarows:20,setfunc:function(v,initLoad) {
      adata=JSON.parse(v);
      //tridata=v.length==0?undefined:JSON.parse(v);
    }
    ,valuef:function() {
      //var s='';
      //for (var k in adata) if (adata.hasOwnProperty(k)) s+='\n,"'+k+'":'+JSON.stringify(adata[k]);
      //return s;
      return JSON.stringify(adata,undefined,' ');
      //return tridata?JSON.stringify(tridata):'';
    }
    },
    
          
    //mcolors,   
       
       ]},
    
    mview={s:'View',sub:[
    
    {s:'Process',sub:[
    mpr={s:'Process \u25ba',msid:'mprms',ms:pra.length},
    {s:'Compress',ms:'Not lossless'},
    {s:'Import',a:'primport',doctrl:'Process import',ms:'text',ta:true,value:'...',setfunc:function(v) {
      prSet(v);//pra=v.split('\n');pri=0;
      log('Process imported ('+pra.length+').');
    }
    },{s:'Export',a:'prexport',ms:'text',doctrl:'Process export',valuef:function() {
      return pra.join('\n');
    }
    ,ta:true,close:true},{s:'Export',a:'prgif',ms:'process gif'},mprocesscs={ms:'Add to conetSave',checkbox:1}]},
    
       
      {s:'Normals',sub:[
       {s:'Init Pages',a:'initnorm',ms:'diffuse,normal,spec.'},
       mbrushnorm={s:'Normal<br>brush',fs:0.8,ms:normal?'on':'off',a:'brushnorm'},
       {s:'Normals:<br>Invert green',fs:0.8,a:'norminvertgreen'}
      ]},
    
    {s:'Layer',r:1,ms:'opacity 1',autoval:true,lskey:'layropac',setfunc:function(v) {
      v=parseFloat(v);this.ms='opacity '+v;
      canvm.style.opacity=v;
    }
    ,sub:[{s:'0'},{s:'0.25'},{s:'0.5'},{s:'1'}]}
     
      
    ,{s:'ASCII',ms:'Converter',actionf:function() {
      //var i=mview.sub.indexOf(this);if (i!=-1) mview.sub.splice(i,1);
      //alert(23);
      var win=window.open('','Test','left=300,top=50,width=340,height=260,toolbar=no,menubar=no,location=no'),
          doc=win.document,body=doc.body,cc=-1,c,w=15,h=15,ta;
      
      
      function update() {
        if (cc!=changec) {
        console.log('update ascii');
        cc=changec;
        var ct=c.getContext('2d');
        ct.clearRect(0,0,w,h);
        ct.drawImage(canvas,0,0,w,h);
        var id=ct.getImageData(0,0,w,h);
        var s='';
        for (var y=0;y<h/2;y++) {
          for (var x=0;x<w;x++) {
            var i0=(y*2*w+x)*4,r0=id.data[i0]/128,
                i1=((y*2+1)*w+x)*4,r1=id.data[i1]/128;
            s+=(r0<1&&r1<1) ?'\u2588':
              ((r0<1&&r1>=1)?'\u2580':
              ((r0>=1&&r1<1)?'\u2584':'\u2591'));
          }
          s+='\n';
        }
        ta.value=s;
        }
        
        setTimeout(update,100);
      }
      
      
      doc.title='Paint '+this.s+' '+this.ms;
      body.style.backgroundColor='#aaa';
      //#body.innerHTML='djk<b>fsdlf</b>jdlk';
      c=doc.createElement('canvas');c.width=w;c.height=h;c.style.backgroundColor='#0f0';
      c.style.width=(w*5)+'px';c.style.height=(h*5)+'px';
      //body.appendChild(c);
      ta=doc.createElement('textarea');ta.rows=h/2+2;ta.cols=w+2;ta.value='Test';
      ta.style.fontFamily='Courier';ta.style.fontSize='30px';
      body.appendChild(ta);
      
      
      update();
    }
    } 
    
    ,mbackground={s:'Background',fs:0.75,ms:'checker',autoval:true,lskey:'wepaintbg',setfunc:function(v) {
      this.ms=v;
      if (v=='checker') {
        canvas.style.backgroundImage='url(paintbg.png)';
      } else {
        canvas.style.backgroundColor=v;
        canvas.style.backgroundImage='';
      }
    }
    ,sub:[{s:'checker'},{s:'white'},{s:'gray'},{s:'black'}]}
    
    
    ,{s:'Help',a:'Helps',sub:[
      {s:'Demos',sub:[{s:'Whale'},{s:'Js Knight'}]},
      {s:'Info',ms:'Help'}]}
    
    ,{s:'Fullscreen',actionf:function() {
      var c=document.body.parentNode;
      if (c.requestFullscreen) c.requestFullscreen();
      else if (c.mozRequestFullScreen) c.mozRequestFullScreen();
      else if (c.webkitRequestFullScreen) c.webkitRequestFullscreen();
      //...
    }
    }
      
    ]},  
      
    
    Conet.fileMenu({fn:'paint/script/files.txt',defFn:'asciiAnim.txt',noStartLoad_:1,m:{r_:1,s:'Script',sub:[mscript]},
    loadf:function(v,atStart) {
      //log('script loading '+v);
      Conet.download({fn:'paint/script/'+v,f:function(v) {
        if (v===undefined) return;
        mscript.value=v;
        mscript.ms=v.length;
        if (!atStart)
        try {
          eval(v);
        } catch (e) { log(e);console.log(e); }
      }
      });
    }
    ,savef:function(v) {
      if (v===undefined) { log('Script.save: no filename.');return; }
      Conet.upload({fn:'paint/script/'+v,data:mscript.value,log:log});
    }
    })
    
      
    ]},
    
    //mpage={s:'Page',ms:(pagei+1)+'/'+(pages?pages.length:1)},
    
    //mpr={s:'Process \u25ba',msid:'mprms',ms:pra.length},
    mtools,
    
    /*
    mbp={s:'0.1',ms:'brush pressure',autoval:true,lskey:'wepaintbp',setfunc:function(v) {
      bp=parseFloat(v);this.s=v;
      if (mode==MERASE) eraseConf.bp=bp;
      if (mode==MDRAW) drawConf.bp=bp;
    }
    ,sub:[{s:'0.01'},{s:'0.03'},{s:'0.1'},{s:'0.2'},{s:'0.3'},{s:'1'}]},
    mbra={s:'10',ms:'brush radius',autoval:true,lskey:'wepaintbra',setfunc:function(v) {
      bra=parseInt(v);this.s=v;
      if (mode==MERASE) eraseConf.bra=bra;
      if (mode==MDRAW) drawConf.bra=bra;
    }
    ,sub:[{s:'1'},{s:'2'},{s:'3'},{s:'5'},{s:'10'},{s:'20'},{s:'30'},{s:'50'},{s:'100'}]}//3
    ,mcolors,
    */
    
    mcolor//,merase//,mscript
    
    //,{s:'Edit 3D'}
    
    
      ];
      
    if (!sal) mroots.push(medit3d=(acoH.mback?acoH.mback:{s:'\u2192 Edit 3D',a:'Edit 3D'}));  
    
    
    msetcol.msf=msetcol.valuef;
    mpage={s:'Page',msid:'mpagems',ms:(pagei+1)+'/'+(pages?pages.length:1) //2190,2192 / 21d0,21d2
      ,_sub:[{s:'\u21e6',stay:1,a:'pageleft'},{s:'\u21e8',stay:1,a:'pageright'},{s:'Delete',a:'pagedel',stay:1}]
    };
    mpat={s:'Test<br>pattern',fs:0.8,a:'Pattern'};
    mnorm={s:'Normal<br>mode',fs:0.8,ms:'color',a:'normmode',msid:'mnormms'};
    mnormblend={s:'Normal<br>blend',fs:0.8,msf:function() {
      return (nbm==2?'on *':(nbm==1?'on':'off'));
    }
    ,a:'normblend'};
    mcut={s:'Cut'};
    mtexify={s:'Texify'};
    mvertsel={s:'Select verts<br>in rectangle',fs:0.8};
    mpolygon={s:'Polygon'};
    mselmv={s:Menu.son,ms:'Select multiple',fs:1.2,stay:true,check:true};
    mstayselv={s:Menu.soff,ms:'Stay selected',fs:1.2,checkbox:1};
    mrscale={s:'RScale...',doctrl:'Rect Scale',value:1,setfunc:function(v) {
      if (!srid) { alert('First make rect move.');return; }
      //onsole.log('RScale');onsole.log(sr);onsole.log(srid);
      var d=document,c=d.createElement('canvas');c.width=sr.w;c.height=sr.h;
      var ct=c.getContext('2d'),c0=c;ct.putImageData(srid,0,0);
      
      var v=parseFloat(v),w=Math.floor(0.5+sr.w*v),h=Math.floor(0.5+sr.h*v);
      //onsole.log('rscale -> '+w+' '+h);
      c=d.createElement('canvas');c.width=w;c.height=h;ct=c.getContext('2d');
      ct.drawImage(c0,0,0,w,h);srid=ct.getImageData(0,0,w,h);sr.w=w;sr.h=h;
      draw();
      //alert(v);
    }
    };
    
    mrload={s:'RLoad...',doctrl:'Rect load',value:'',setfunc:function(v) {
      if (!srid) { alert('First make rect move.');return; }
      var img=new Image();
      img.onload=function() {
        var w=img.width,h=img.height,c=document.createElement('canvas');c.width=w;c.height=h;
        var ct=c.getContext('2d');ct.drawImage(img,0,0);
        srid=ct.getImageData(0,0,w,h);sr.w=w;sr.h=h;
        draw();
        //...
      }
      
      img.src=v;
      //alert('Loading '+v);
      //...
    }
    };
    mTridatavAdd={s:'Vert add',ms:'Tridata',actionf:function() {
      if (!tridata) tridata={verts:[],tris:[]};
      tridata.verts.push([0.5,0.5]);
      draw(1);
      log('Tridata vert added #'+tridata.verts.length+'.');
      //lert('add tridata vert n/i');
    }
    };
    
    mcomain={s:'Cutout',sub:[
      {s:'Rect add'},
    {s:'Rect del',actionf:function() {
      if (cutoutP===undefined) { log('No rect selected.');return; }
      //alert(32);
      //cutoutP;
      var ri=cutout.rects.indexOf(cutoutP.r);
      
      function bonedel(i) {
        for (var j=cutout.bones.length-1;j>=0;j--) {
          var b=cutout.bones[j];
          if (b.p!=i) continue;
          bonedel(j);
        }
        cutout.bones.splice(i,1);
      }
      
      
      for (var i=cutout.bones.length-1;i>=0;i--) {
        var b=cutout.bones[i];
        if (b.i!=ri) continue;
        bonedel(i);//cutout.bones.splice(i,1);
      }
      
      //cutout.rects=
      cutout.rects.splice(ri,1);
      //onsole.log(cutoutP);
      //onsole.log(cutout.rects.indexOf(cutoutP.r));
      cutoutP=undefined;
      draw();
    }
    },{s:'Point add',actionf:function() {
      if (cutoutP===undefined) { log('No rect selected.');return; }
      var r=cutoutP.r;
      if (!r.ps) r.ps=[];
      r.ps.push({x:r.x+20+r.ps.length*10,y:r.y+20});
      draw();
      //onsole.log(cutoutP);
    }
    },//{s:'Point del'},
      
    
    {s:'Data',doctrl:'Cutout data',ta:true,wrap:false,valuef:cutoutStr
    ,setfunc:function(v) {
      try {
      cutout=JSON.parse(v);
      draw();
      } catch (e) { log('cutout data error: '+e); }
    }
    }
      
    ,{s:'Reset',a:'cutoutreset'}  
      
    ]};
    
    Paint.cfmenu=cfmenu;
    
    if (sal) {
    //setdim(200,200,4);setMode(MDRAW);
    //setMode(MSELR);
    
    Paint.activate();
    //Menu.colBg='rgba(100,100,100,0.4)';
    //  
    //Menu.init(mroots);
    //
    //mrectMs();
    
    //bp=1;br=250;bg=250;bb=250;brush(10,20);
    
    
    Menu.switchf=Paint.menuSwitch;
    //setMode(MSELR);
    
    
    Menu.draw();
    //mcolorCol();
    }
    
    pickm=undefined;
    draw();
    
    //if (sal) Paint.menuSwitch(undefined,'Load');
    /*
    if (lo) {
      if (lo.diff) loadDataUrl(lo.diff)
      //alert(id);
      lo.id=id;
      //setMode(MSELR);mrectMs();
    }
    */
    
    document.onpaste=function(event) {
      if (Menu.mcontrol) return;
      var items = event.clipboardData.items;
      //og(JSON.stringify(items)); // will give you the mime types
      if (items.length==0) { log('Paint.onpaste: items.length==0');return; }
      for (var il=0;il<items.length;il++) {
      var i0=items[il];
      if (i0.type.indexOf('image')===0) {
      var blob=i0.getAsFile();
      var reader=new FileReader();
      reader.onload = function(event2) {
        log('Paint.onpaste data url len: '+event2.target.result.length);
        loadDataUrl(event2.target.result);
        addPageAfterLoad=(pagei==(pages?pages.length-1:0));
      }
      ; 
      reader.readAsDataURL(blob);
      } else {
        console.log('Paint.onpaste: no image.'+il+'/'+items.length);
        //console.log(i0);
      }}
    }
    
    
    //if (sal) { loadDataUrl('paint/monalisa.png');scale=0.7;setMode(MCUTOUT); }
    //Menu.cmenu=mpr;Menu.action();
  }
  function drawTc(ct,dx,dy) {
    var fg=(dx==0)&&(dy==0);
    //var col=fg?'#aaa':'#000';
    var a=(mode==MDRAW?0.1:1);
    var col=fg?'rgba(200,200,200,'+a+')':'rgba(0,0,0,'+a+')';
    ct.strokeStyle=col;
    var m=lo.meshes[lo.selmesh];
    for (var h=m.fa.length-1;h>=0;h--) {
      var f=m.fa[h];
      ct.beginPath();
      ct.moveTo(dx+f.v0.u*iw,dy+f.v0.v*ih);
      ct.lineTo(dx+f.v1.u*iw,dy+f.v1.v*ih);
      ct.lineTo(dx+f.v2.u*iw,dy+f.v2.v*ih);
      ct.lineTo(dx+f.v0.u*iw,dy+f.v0.v*ih);
      ct.stroke();
    }
    ct.fillStyle=col;
    var va=lo.verts;
    //var selv=fg?W3dit.getSelv():undefined;
    for (var h=va.length-1;h>=0;h--) {
      var v=va[h];
      if (v.paintSkip) continue;
      ct.fillRect(dx+v.u*iw-2,dy+v.v*ih-2,4,4);
    }
    
  }
  function drawCutouts(ct,dx,dy) {
    var c=cutout;
    
    if (c.bones&&c.rects) for (var h=c.bones.length-1;h>=0;h--) {
      var b=c.bones[h];
      if (b.p==-1) continue;
      //if (b.i==-1) continue;
      var r=c.rects[b.i];
      var i9=c.bones[b.p].i;
      if (i9==-1) continue;
      if (b.pp===undefined) continue;
      var pp=c.rects[i9].ps[b.pp];
      ct.beginPath();ct.moveTo(r.cx,r.cy);ct.lineTo(pp.x,pp.y);ct.closePath();ct.stroke();
    }
    
    if (c.rects) for (var h=cutout.rects.length-1;h>=0;h--) {
      var r=cutout.rects[h];
      if (dx==0) {
        if (cutoutP&&(r==cutoutP.r)) 
          ct.strokeStyle='#ffff00';
        else
          ct.strokeStyle='#00ff00';
      }
      ct.strokeRect(r.x+dx,r.y+dy,r.w,r.h);
      //ct.strokeRect(r.cx+r.x+dx-4,r.cy+r.y+dy-4,8,8);
      ct.beginPath();ct.arc(r.cx+dx-0.5,r.cy+dy-0.5,4,0,Math.PI*2);ct.closePath();ct.stroke();
      
      if (!r.ps) continue;
      for (var j=r.ps.length-1;j>=0;j--) {
        var p=r.ps[j];
        ct.fillRect(p.x+dx-2,p.y+dy-2,4,4);
      }
      
    }
    if (c.tris)
    for (var h=c.tris.length-1;h>=0;h--) {
      var t=c.tris[h],b0=c.bones[t.p0],b1=c.bones[t.p1],b2=c.bones[t.p2];
      ct.strokeStyle='#0f0';
      ct.beginPath();
      ct.moveTo(b0.u*iw,b0.v*ih);
      ct.lineTo(b1.u*iw,b1.v*ih);
      ct.lineTo(b2.u*iw,b2.v*ih);
      ct.lineTo(b0.u*iw,b0.v*ih);
      ct.stroke();
    }
    var s=iw;//512;
    if (cutout.carves) for (var i=0;i<cutout.carves.length;i++) {
      var c=cutout.carves[i];
      //ct.strokeStyle=selp==c.p0?'#ff0':'#fff';
      ct.beginPath();
      ct.arc((c.p0.x)*s,(c.p0.y)*s,c.p0.r*s,0,360);
      ct.stroke();
      //ct.strokeStyle=selp==c.p1?'#ff0':'#fff';
      ct.beginPath();
      ct.arc((c.p1.x)*s,(c.p1.y)*s,c.p1.r*s,0,360);
      ct.stroke();
      //ct.strokeStyle=selc==c?'#ff0':'#fff';
      ct.beginPath();
      ct.moveTo((c.p0.x)*s,(c.p0.y)*s);
      ct.lineTo((c.p1.x)*s,(c.p1.y)*s);
      ct.stroke();
      ct.fillStyle=ct.strokeStyle;
      ct.fillText(''+i,(c.p0.x)*s,(c.p0.y)*s-2);
    }
    
    
  }
  Paint.drawNewtc=function() {
    draw(true);
  }
  function draw(tcnew) {
    if (!canvas) return;
    if (!canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    
    //console.log('paint.draw');console.trace();
    
    if (clearCanv) {
      var cm=canvm?canvm.getContext('2d'):undefined;
      if (cm) cm.clearRect(0,0,iw,ih);
    }
    
    //og('draw');
    
    /*
    ctx.fillStyle='#cccccc';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    */
    /*
    var normalblend=false;
    if (pages) if (pages.length>1) {
      var npi=-1,dpi=-1;
      for (var i=0;i<pages.length;i++) if (pages[i].normal) npi=i; else dpi=i;
      if ((dpi!=-1)&&(npi!=-1)) {
        normalblend=true;
    */  
    checkNormalBlend();
    //og('draw '+normalBlend+' '+npi+' '+dpi);
    if (nbm==0) normalBlend=false;
    
    //var isDa=drawArea;
    //if (!drawArea) drawArea={x0:0,y0:0,x1:iw-1,y1:ih-1};
    //onsole.log('draw normalBlend='+normalBlend);
    if (normalBlend) {
        if (!nbid) nbid=ctx.createImageData(id);
        var dn=pages[npi].id.data;
        var dd=pages[dpi].id.data;
        var ds=spi!=-1?pages[spi].id.data:undefined;
        var d=nbid.data;
        var lx=light.x,ly=light.y,lz=light.z,ll=Math.sqrt(lx*lx+ly*ly+lz*lz);
        //java: lz=20, but with ambient 10 is ok and better for specular blend
        lx/=ll;ly/=ll;lz/=ll;
        var dl=d.length;
        if (!drawArea) drawArea={x0:0,y0:0,x1:iw-1,y1:ih-1};
        //onsole.log('draw normalblend npi='+npi
        //+' dnv='+dn[((ih-1)*iw+iw-1)*4]+' dn.len='+dn.length);
        //console.log(drawArea);
        //else if (drawArea.x1!=-1) log('drawArea '+drawArea.x0
        //+','+drawArea.y0+'  '+drawArea.x1+','+drawArea.y1);
        
        //for (var i=0;i<dl;i+=4) {
        for (var y=drawArea.y0;y<=drawArea.y1;y++) 
        for (var x=drawArea.x0;x<=drawArea.x1;x++) {
          //d[i]=(dn[i]+dd[i])/2;
          var i=(y*iw+x)*4;
          var r=dd[i],g=dd[i+1],b=dd[i+2],a=dd[i+3];
          //a=255-a;
          
        
          var nx=dn[i]*2/255-1,
              ny=(isInvertgreen?(255-dn[i+1]):dn[i+1])*2/255-1,
              nz=dn[i+2]*2/255-1;
          //if (isInvertgreen) ny=1-ny;
          //d[i+1]=(128-d[i+1])+127;
          var w=nx*lx+ny*ly+nz*lz;
          w=Math.max(0,Math.min(1,w));
          w=w*0.8+0.2;
    
          if (ds&&(nbm==1)) {
            var srh=ds[i],sg=ds[i+1],sb=ds[i+2];
            r=Math.min(255,r+srh);
            g=Math.min(255,g+sg);
            b=Math.min(255,b+sb);
          }
          
          r*=w;//r=Math.floor(r*w+0.5);
          g*=w;//g=Math.floor(g*w+0.5);
          b*=w;//b=Math.floor(b*w+0.5);
          
          
          
          var sh=0.7;
          if (ds&&(w>sh)&&(nbm==2)) {
            var srh=ds[i],sg=ds[i+1],sb=ds[i+2];
            var ws=(w-sh)/(1-sh);
            r=Math.min(255,r+srh*ws);
            g=Math.min(255,g+sg*ws);
            b=Math.min(255,b+sb*ws);
          }
          
          
          r=Math.floor(r+0.5);
          g=Math.floor(g+0.5);
          b=Math.floor(b+0.5);
          
          
          
          //}
          d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=a;
        }
        cm.putImageData(nbid,0,0);//ctx
        if (lo) lo.id=nbid;
    }
    //}
    
    
    //if (!normalBlend) 
    ctx.putImageData(getId(),0,0);
    
    
    //var cm=canvm?canvm.getContext('2d'):undefined;
    //if (cm) cm.clearRect(0,0,iw,ih);
    
    if ((mode==MSELR)&&cm) {
      //var ctr=ctx;
      //cm.clearRect(0,0,iw,ih);
      cm.lineWidth=1;
      cm.strokeStyle='#000000';
      cm.strokeRect(sr.x+1,sr.y+1,sr.w,sr.h);
      cm.strokeStyle='#ffffff';
      cm.strokeRect(sr.x,sr.y,sr.w,sr.h);
    }
    
    if (tridata) {
      var verts=tridata.verts,tris=tridata.tris;
      if (tris) for (var i=tris.length-1;i>=0;i--) {
        var t=tris[i],v0=verts[t[0]],v1=verts[t[1]],v2=verts[t[2]];
        cm.strokeStyle='rgba(0,250,0,0.5)';
        cm.beginPath();
        cm.moveTo(v0[0]*iw,v0[1]*ih);
        cm.lineTo(v1[0]*iw,v1[1]*ih);
        cm.lineTo(v2[0]*iw,v2[1]*ih);
        cm.lineTo(v0[0]*iw,v0[1]*ih);
        cm.stroke();
      }
      for (var i=verts.length-1;i>=0;i--) {
        var ve=verts[i],u=ve[0],v=ve[1],x=u*iw,y=v*ih;
        cm.fillStyle='rgba(0,0,0,0.5)';cm.fillRect(x-1,y-1,4,4);
        cm.fillStyle=selv.indexOf(ve)==-1?'rgba(0,250,0,0.5)':'rgba(250,250,0,0.5)';cm.fillRect(x-2,y-2,4,4);
        if (mode==MSELR) {
          x=Math.max(0,Math.min(iw-20,x));y=Math.max(10,Math.min(ih,y));
          var s=''+i;//u+','+v
          cm.fillStyle='rgba(0,0,0,0.5)';cm.fillText(s,x+1,y+1);
          cm.fillStyle='rgba(0,250,0,0.5)';cm.fillText(s,x,y);
        }
      }
    }
    
    if (acoH.ondraw) acoH.ondraw(canvas);
    
    if (cutout&&((cutout.carves&&(cutout.carves.length>0))||(cutout.rects&&(cutout.rects.length>0)))) {//&&(mode==MCUTOUT)) {
      //var cm=canvm.getContext('2d');
      //cm.clearRect(0,0,iw,ih);
      cm.lineWidth=1;
      cm.strokeStyle='#000000';
      cm.fillStyle='#000000';
      drawCutouts(cm,1,1);
      cm.strokeStyle='#00ff00';
      cm.fillStyle='#00ff00';
      drawCutouts(cm,0,0);
    }
    
    if (mode==MMOVE) {
      ctx.putImageData(srid,movep.x,movep.y);
    }
    
    
    if (lo) {
    
      //var skip=false;
      //if (drawArea) {
      //  ctx.strokeStyle='#000000';
      //  ctx.strokeRect(drawArea.x0,drawArea.y0,drawArea.x1-drawArea.x0,drawArea.y1-drawArea.y0);
      //  if (drawArea.x1-drawArea.x0<iw*0.7) skip=true; 
      //}
      //if (!skip) {
      //var donew=false;
      if (!tccanvas) tcnew=true; else if ((tccanvas.width!=iw)||(tccanvas.height!=ih)) tcnew=true;
        
      if (tcnew) {
        var c=document.createElement('canvas');tccanvas=c;
        c.width=iw;c.height=ih;
        var ct=c.getContext('2d'); 
      
        //drawTc(ct,-1,-1);
        for (var mi=lo.meshes.length-1;mi>=0;mi--) {
          var m=lo.meshes[mi];
          for (var h=m.fa.length-1;h>=0;h--) m.fa[h].mi=mi;
        }
        for (var h=lo.verts.length-1;h>=0;h--) {
          var v=lo.verts[h];
          var skip=v.ts.length>0;
          for (var i=v.ts.length-1;i>=0;i--) if (v.ts[i].mi==lo.selmesh) skip=false;
          v.paintSkip=skip;
          //--
        }
        
        drawTc(ct,1,1);
        drawTc(ct,0,0);
        //var selv=W3dit.getSelv();
        ct.fillStyle='#f00';
        for (var h=selv.length-1;h>=0;h--) {
          var v=selv[h];
          if (v.paintSkip) continue;
          ct.fillRect(v.u*iw-2,v.v*ih-2,4,4);
        }
    
      }
      //ctx.drawImage(tccanvas,0,0);
      cm.drawImage(tccanvas,0,0);
      //}
      
    }
    drawArea=undefined;
    
    if ((mode==MCOPYBRUSH)&&copybrush) {
      var x=copybrush.abs?copybrush.x:imx+copybrush.x;
      var y=copybrush.abs?copybrush.y:imy+copybrush.y;
      ctx.strokeStyle='#00ff00';
      ctx.beginPath();ctx.arc(x-0.5,y-0.5,bra,0,Math.PI*2);ctx.closePath();ctx.stroke();
      ctx.strokeStyle='#000000';
      ctx.beginPath();ctx.arc(x,y,bra,0,Math.PI*2);ctx.closePath();ctx.stroke();
    }
    
    if (!(canvDraw)) //&&(mode==MDRAW))) 
    //---without this, after loading image with canvas under load-menu, a brush is drawn there
    {
      ctx.strokeStyle='#ffffff';
      ctx.beginPath();ctx.arc(imx-0.5,imy-0.5,bra,0,Math.PI*2);ctx.closePath();ctx.stroke();
      ctx.strokeStyle='#000000';
      ctx.beginPath();ctx.arc(imx,imy,bra,0,Math.PI*2);ctx.closePath();ctx.stroke();
    }
  }
  Paint.loadDataUrl=loadDataUrl;
  Paint.cfmLoad=function(s) {
    cfmenu.cfmLoad(s);
  }
  Paint.getCutoutP=function() {
    return cutoutP;
  }
  Paint.etCutout=function(o) {
    if (o) cutout=o;
    return cutout;//...
  }
}
)(Paint);

//fr o,1
//fr o,1,143
//fr o,1,150,32
//fr o,1,152
//fr o,1,175,3
//fr o,1,177
//fr o,1,194,2,22
//fr o,1,194,2,22,3
//fr o,1,201
//fr o,1,201,108
//fr o,1,201,217
//fr o,1,201,217,1
//fr o,1,201,261
//fr o,1,201,272,2
//fr o,1,201,274
//fr o,1,201,329,9
//fr p,14,158
