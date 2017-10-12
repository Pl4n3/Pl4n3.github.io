//--- originally divScale.htm -> scalable divs
var Arrows=function(gps) {
  var sc=1,cont,cont0,to0={},m0=undefined,sel,log=Conet.log,views=[],viewi=0,ot=undefined,
      at=0,scene={},mtime;
  function animateViews() {
    var t=Date.now(),dt=(ot===undefined)?0:(t-ot);ot=t;
    
    //og('animate0 '+at+' '+dt);
    var kt=1000;
    at+=dt;if (at>kt) {
      at=at%kt;viewi++;if (viewi>=views.length) viewi=0; 
    }
    //og('animate0 '+at+' '+dt+' '+kt);
    var f1=at/kt;
    f1=Math.sqrt(f1);//f1*=f1;
    var f0=1-f1,v0=views[viewi],v1=views[(viewi+1)%views.length];
    
    var s=v0.s*f0+v1.s*f1;
    cont.style.transform='scale('+s+','+s+')';
    cont0.scrollLeft=v0.x*f0+v1.x*f1;
    cont0.scrollTop=v0.y*f0+v1.y*f1;
    
    //log('animate1 '+viewi+' '+f0);
    setTimeout(animateViews,10);
  }
  function div(ps) {
    var c=document.createElement(ps.img?'img':'div'),s=c.style;
    c.ps=ps;
    s.position='absolute';
    //s.left=ps.x+'px';s.top=ps.y+'px';
    s.left=ps.x;s.top=ps.y;
    if (ps.w) s.width=ps.w;
    if (ps.h) s.height=ps.h;
    //s.width=ps.w+'px';s.height=ps.h+'px';
    if (!ps.img) { s.whiteSpace='nowrap';s.padding='2px'; }
    if (ps.c) s.backgroundColor=ps.c;//'#bbb';
    s.transformOrigin=ps.transformOrigin||'top left';//s.edge?
      //'center left';//:'top left';
    //s.transformOrigin='center center';
    if (ps.t) s.transform=ps.t;
    //if (ps.bo) { 
    s.borderWidth='1px';
    if (ps.edge) {
      if (!ps.img) {
        s.borderBottomStyle='solid';
        s.borderRightStyle='solid';
      }
      s.textAlign='center';s.overflow='hidden';
      //s.zIndex=-1;
    } else if (!ps.img) {
      ////s.borderStyle='solid';s.borderWidth='1px';
      //s.zIndex=2;
    }
      
    if (ps.s) c.innerHTML=ps.s;
    if (ps.src) { 
      //if (ps.src.endsWith('.json.txt')) 
      if (ps.src.endsWith('.txt')) 
      
    Conet.download({fn:ps.src,f:function(v) {
      c.src=ps.src.endsWith('.json.txt')?JSON.parse(v).data:v;
    }
        });
      else 
        c.src=ps.src;
      s.opacity=ps.opacity||1;//0.1
      //s.mixBlendMode='multiply'; 
    }
    c.edges=[];
    if (ps.edge) { 
      c.edge=ps.edge;
      cont.childNodes[ps.edge[0]].edges.push(c);
      cont.childNodes[ps.edge[1]].edges.push(c);
      calcEdge0(c);
    }
    //if (ps.cont) ps.
    cont.appendChild(c);
    return c;
  }
  function elSel(e) {
    var c=e.target,s=c.style;//r=c.getBoundingClientRect();
    if (c.parentNode==cont) {
      sel=c;
      //console.log(c.style);//.style.left+' '+c.style.top);
      var xc=parseFloat(s.left.substr(0,s.left.length-2)),
          yc=parseFloat(s.top.substr(0,s.top.length-2));
      //console.log(xc+' '+yc);
      m0={
        //x:(xc-e.pageX+cont0.scrollLeft)/sc,y:(yc-e.pageY+cont0.scrollTop)/sc,
        //x:(xc+cont0.scrollLeft)/sc-e.pageX,y:(yc+cont0.scrollTop)/sc-e.pageY,
        x:xc-(e.pageX+cont0.scrollLeft)/sc,y:yc-(e.pageY+cont0.scrollTop)/sc,
        c:c,
      };
      if (c.arrowSel) c.arrowSel();
    }
    //...
  }
  function calcEdge0(ec) {
    var c0=cont.childNodes[ec.edge[0]],c1=cont.childNodes[ec.edge[1]],
        s0=c0.style,s1=c1.style,
        r0=c0.getBoundingClientRect(),r1=c1.getBoundingClientRect(),
        x0=parseFloat(s0.left.substr(0,s0.left.length-2)),//+r0.width/sc/2,
        y0=parseFloat(s0.top.substr(0,s0.top.length-2)),//+r0.height/sc/2,
        x1=parseFloat(s1.left.substr(0,s1.left.length-2)),//+r1.width/sc/2,
        y1=parseFloat(s1.top.substr(0,s1.top.length-2)),//+r1.height/sc/2,
        s=ec.style,dx=x1-x0,dy=y1-y0,d=Math.sqrt(dx*dx+dy*dy),
        d0=//Math.max(r0.width,
          (r0.height)*1.5/sc/2,
        d1=//Math.max(r1.width,
          (r1.height)*1.5/sc/2,
        f0=d0/d;//,f1=1-f0;
    //r0.top/=sc;r0.left/=sc;r0.width/=sc;r0.height/=sc;
    //console.log((r0.left+cont0.scrollLeft)/sc+' '+(r0.top+cont0.scrollTop)/sc
    //  +' - '+r0.width/sc+' '+r0.height/sc+' sc:'+sc);
    //console.log(r1);
    //s.left=(x0*f1+x1*f0)+'px';s.top=(y0*f1+y1*f0)+'px';
    s.left=(x0+f0*dx)+'px';s.top=(y0+dy*f0)+'px';
    //s.transform='rotate('+Math.atan2(dy,dx)+'rad)';
    var w=d-d0-d1;//d*(f1-f0);
    s.width=w+'px';s.height='20px';
    s.transform='rotate('+Math.atan2(dy,dx)+'rad)';
    //'translate(-'+w/2+'px 0px)';
    //...
  }
  function elMove(e) {
    if (gps.elStick) return;
    if (!m0) return;
    if (!m0.c) return;
    var s=m0.c.style;
    //s.left=(m0.x*sc-cont0.scrollLeft+e.pageX)+'px';
    //s.top=(m0.y*sc-cont0.scrollTop+e.pageY)+'px';
    //s.left=((m0.x+e.pageX)*sc-cont0.scrollLeft)+'px';
    //s.top=((m0.y+e.pageY)*sc-cont0.scrollTop)+'px';
    s.left=(m0.x+(e.pageX+cont0.scrollLeft)/sc)+'px';
    s.top=(m0.y+(e.pageY+cont0.scrollTop)/sc)+'px';
    
    var es=m0.c.edges;
    for (var i=0;i<es.length;i++) {
      calcEdge0(es[i]);
    }
    
    
    //calcEdge(m0.c);
    //...
  }
  function mouseScroll(e) {
    var up=false;
    if (e.wheelDelta!=undefined) up=e.wheelDelta>0;
    else up=e.detail<0;
    
    setScale(sc*(up?1.25:0.8),e.pageX,e.pageY);
    /*
    //onsole.log('mouseScroll '+up);
    //scale(sc*(!up?0.8:1.25),e.pageX,e.pageY);
    var iw=window.innerWidth,ih=window.innerHeight;
    //x/=2;y/=2;//
    //if (y<20) y=0;if (x<20) x=0;
    //x-=20;y-=20;
    //| with iw/ih calculation zoomed focus wanders into center of the screen
    var x=e.pageX,y=e.pageY,
        x0=(((x-iw/2)*1.05+iw/2)+cont0.scrollLeft)/sc,
        y0=(((y-ih/2)*1.05+ih/2)+cont0.scrollTop)/sc;
    //onsole.log('mouseScroll '+x0);//sc+' '+cont0.scrollLeft+' '+cont0.scrollTop);
    
    sc*=!up?0.8:1.25;
    if (gps.minsc) sc=Math.max(sc,gps.minsc);
    cont.style.transform='scale('+sc+','+sc+')';
    //cont.style.scale=sc+' '+sc;
    
    //cont.style.transformOrigin='left top';
    //onsole.log('arrow.mouseScroll '+sc);//(x0*sc-x)+' '+(y0*sc-y));
    cont0.scrollLeft=x0*sc-x;
    cont0.scrollTop=y0*sc-y;
    */
    
    
    e.preventDefault();
  }
  function mouseDown(e) {
    if (e.which==3) {
      m0={
        x:(e.pageX+cont0.scrollLeft)/sc,
        y:(e.pageY+cont0.scrollTop)/sc,
      };
      //md3=true;
      //console.log('mouseDown '+e.which);
    } else
    if (e.which==1) {
      elSel(e);
    }
    e.preventDefault();
    e.stopPropagation();
  }
  function mouseMove(e) {
    //...
    if (m0) {
      if (e.which==3) {
        cont0.scrollLeft=m0.x*sc-e.pageX;
        cont0.scrollTop=m0.y*sc-e.pageY;
      } else
      if (e.which==1) {
        elMove(e);
      }
    }
    //onsole.log('mouseMove '+e);
    e.preventDefault();
  }
  function mouseUp(e) {
    //...
    //if (e.which==3) {
      m0=undefined;
      //onsole.log('mouseUp '+e);
    //}
    e.preventDefault();
  }
  function resize(e) {
    var s=cont0.style;
    s.width=window.innerWidth+'px';
    s.height=window.innerHeight+'px';
  }
  function touchStart(e) {
    var ts=e.touches;
    if (ts.length==2) {
      var t0=ts[0],t1=ts[1],x0=t0.pageX,y0=t0.pageY,
          x1=t1.pageX,y1=t1.pageY,dx=x0-x1,dy=y0-y1;
      to0.x=((x0+x1)/2+cont0.scrollLeft)/sc;
      to0.y=((y0+y1)/2+cont0.scrollTop)/sc;
      to0.d=dx*dx+dy*dy;
      to0.sc=sc;
      //console.log('touchStart '+e.touches.length);
    } else if (ts.length==1) {
      elSel(ts[0]);
    }
    e.preventDefault();
  }
  function touchMove(e) {
    //onsole.log('touchMove '+e.touches.length);
    var ts=e.touches;
    if (ts.length==2) {
      var t0=ts[0],t1=ts[1],x0=t0.pageX,y0=t0.pageY,
          x1=t1.pageX,y1=t1.pageY,dx=x0-x1,dy=y0-y1,d=dx*dx+dy*dy;
      //onsole.log('touchMove '+t0.sc+' '+d+' '+t0.d);
      //scale(to0.sc*(d/to0.d),(x0+x1)/2,(y0+y1)/2);
      sc=to0.sc*(d/to0.d);
      if (gps.minsc) sc=Math.max(sc,gps.minsc);
      cont.style.transform='scale('+sc+','+sc+')';
      //cont.style.transformOrigin='left top';
      cont0.scrollLeft=to0.x*sc-(x0+x1)/2;
      cont0.scrollTop=to0.y*sc-(y0+y1)/2;
    } else if (ts.length==1) elMove(ts[0]);
    e.preventDefault();//...
  }
  function touchEnd(e) {
    m0=undefined;
    e.preventDefault();//...
  }
  function serialize() {
    var sh='{"os":'//'';
    for (var i=0;i<cont.childNodes.length;i++) {
      var c=cont.childNodes[i],s=c.style,o={};
      o.s=c.innerHTML;
      o.x=s.left;o.y=s.top;o.c=s.backgroundColor;
      if (s.transform.length>0) o.t=s.transform;
      if (c.edge) o.edge=c.edge;
      if (s.width) o.w=s.width;
      sh+=(i==0?'[':'\n,')+JSON.stringify(o);
    }
    sh+=']';
    sh+=',\n"views":'+JSON.stringify(views);
    for (var k in scene) if (scene.hasOwnProperty(k)) {
      sh+=',\n"'+k+'":'+JSON.stringify(scene[k]);
    }
    sh+='}';
    return sh;
    //...
  }
  function menuInit() {
    if (gps.menu) {
      Menu.init(gps.menu,{listen:1,diw:750});
      return;
    }
    
    
    var cfm=Conet.fileMenu({fn:'/test/divScaleFiles.json.txt',defFn:'/test/divScale0.json.txt',noStartLoad:gps.noStartLoad,
    loadf:function(v) {
      Conet.download({fn:v,f:function(v) {
        var q=JSON.parse(v);
        var a=q.os;
        for (var i=0;i<a.length;i++) {
          var o=a[i];//o.cont=cont;o.bo=1;
          div(o);
        }
        views=q.views||[];
        if (q.bgcol) cont0.style.backgroundColor=q.bgcol;
        delete(q.os);delete(q.views);scene=q;
      }
      });
    }
    ,savef_:function(v) {
      //onsole.log(JSON.stringify(cont.children,undefined,' '));
      Conet.upload({fn:v,data:serialize(),log:log});
    }
    });
    cfm.sub.push({s:'Export',actionf:function() {
      var s=serialize();console.log(s);
      window.open('data:text/plain;base64,'+s,'DivScale Export');
    }
    });
    
    
    Menu.init([{s:'Menu',sub:[cfm,
    
    {s:'Add',ms:'Node',actionf:function() {
      div({x:10+'px',y:10+'px',s:'Node'+cont.childNodes.length,c:'#fff'});
      //log('Add done');
    }
    },
    
    {s:'Remove',ms:'Node',actionf:function() {
      if (!sel) { log('Select first to remove.');return; }
      var es=sel.edges;
      for (var i=es.length-1;i>=0;i--) {
        var ec=es[i],c0=cont.childNodes[ec.edge[0]],c1=cont.childNodes[ec.edge[1]];
        c0.edges.splice(c0.edges.indexOf(ec),1);
        c1.edges.splice(c1.edges.indexOf(ec),1);
        cont.removeChild(ec);
      }
      cont.removeChild(sel);
      sel=undefined;
      //...
    }
    },
    
    {s:'Text..',doctrl:'Text',ta:1,r:1,valuef:function() {
      return sel?sel.innerHTML:undefined;
      //if (!sel) { alert('No element selected.');return; }
      //sel.innerHTML=Math.random();
    }
    ,setfunc:function(v) {
      sel.innerHTML=v;//...
    }
    },
    
    {s:'Transform..',doctrl:'Transform',valuef:function() {
      return sel?sel.style.transform||'':undefined;
      //if (!sel) { alert('No element selected.');return; }
      //sel.innerHTML=Math.random();
    }
    ,setfunc:function(v) {
      sel.style.transform=v;//...
    }
    },
    
    {s:'BgColor..',doctrl:'BgColor',valuef:function() {
      return sel?sel.style.backgroundColor||'':undefined;
      //if (!sel) { alert('No element selected.');return; }
      //sel.innerHTML=Math.random();
    }
    ,setfunc:function(v) {
      sel.style.backgroundColor=v;//...
    }
    },
    
    
    {s:'Views',sub:[
    {s:'Add',r:1,actionf:function() {
      views.push({x:cont0.scrollLeft,y:cont0.scrollTop,s:sc});
      log('View '+views.length+' added.');
    }
    },{s:'Set Next',r:1,actionf:function() {
      if (views.length==0) { log('No views defined');return; }
      viewi++;if (viewi>=views.length) viewi=0;
      
      var v=views[viewi];
      cont.style.transform='scale('+v.s+','+v.s+')';
      cont0.scrollLeft=v.x;cont0.scrollTop=v.y;
      //log();
      
    }
    },{s:'Animate',actionf:animateViews}
    ]}
    
    ]}
    
    ,mtime={s:'500',r:1,close:1,ms:'Time',doctrl:'Time',range:{min:500,max:1300},value:500
    ,setfunc:function(v) {
      alert(v);
    }
    ,oninput:function(v) {
      mtime.value=v;
      mtime.s=v;
      for (var i=0;i<cont.childNodes.length;i++) {
        var c=cont.childNodes[i],a=c.ps.keyframes,s=c.style;
        if (!a) continue;
        if (a.length==0) continue;
        var t=Math.max(v,a[0].time);
        //console.log(t);
        for (var j=0;j<a.length;j++) {
          var k0=a[j],f0,k1;
          if (j==a.length-1) {
            k1=k0;f0=1;
          } else {
            k1=a[j+1];
            if (t>k1.time) continue;
            f0=1-(t-k0.time)/(k1.time-k0.time);
          }
          var f1=1-f0;
          s.opacity=k0.opacity*f0+k1.opacity*f1;
          break;
        }
        //if (v<=a[0].time) s.opacity=a[0].opacity; else s.opacity=a[1].opacity;
      }
      //console.log('Time oninput '+v);
    }
    }
    
    //]}
    
    
    ],{listen:1,diw:750});
    
    
    //...
  }
  function setScale(scale,x,y) {
    
    //onsole.log('mouseScroll '+up);
    //scale(sc*(!up?0.8:1.25),e.pageX,e.pageY);
    var iw=window.innerWidth,ih=window.innerHeight;
    //x/=2;y/=2;//
    //if (y<20) y=0;if (x<20) x=0;
    //x-=20;y-=20;
    //| with iw/ih calculation zoomed focus wanders into center of the screen
    //var x=e.pageX,y=e.pageY,
    if (x===undefined) x=iw/2;
    if (y===undefined) y=ih/2;
    var x0=(((x-iw/2)*1.05+iw/2)+cont0.scrollLeft)/sc,
        y0=(((y-ih/2)*1.05+ih/2)+cont0.scrollTop)/sc;
    //onsole.log('mouseScroll '+x0);//sc+' '+cont0.scrollLeft+' '+cont0.scrollTop);
    
    sc=scale;//*=!up?0.8:1.25;
    if (gps.minsc) sc=Math.max(sc,gps.minsc);
    cont.style.transform='scale('+sc+','+sc+')';
    //cont.style.scale=sc+' '+sc;
    
    //cont.style.transformOrigin='left top';
    //onsole.log('arrow.mouseScroll '+sc);//(x0*sc-x)+' '+(y0*sc-y));
    cont0.scrollLeft=x0*sc-x;
    cont0.scrollTop=y0*sc-y;
    
    
    //...
  }
  
  if (!gps) gps={};
  var c=document.createElement('div'),s=c.style;cont0=c;
  s.position='absolute';s.left='0px';s.top='0px';s.backgroundColor=gps.bgcol||'#ccc';
  //cont0=div({x:'0px',y:'0px',w:400,h:400,c:'#bbb'});var s=cont0.style;
  //s.fontFamily='Arial';
  s.fontSize='12px';s.overflow='auto';
  document.body.appendChild(cont0);
  
  //| why a second container div? scaling the first would also 
  //| scale its scrollbars
  var c=document.createElement('div');s=c.style;
  //| without following div size would be browser size at startup,
  //| could be bigger than needed space for elements -> empty space right down
  s.position='absolute';s.transformOrigin='left top';
  //s.left='0px';s.width='200px';s.height='100px';s.backgroundColor='#00f';
  //s.transform='scale(5,5)';
  cont0.appendChild(c);cont=c;
  
  //div({x:'0px',y:'0px',w:100,h:50,c:'#fff',bo:1,s:'LEL',cont:cont});
  //div({x:200,y:0,w:100,h:50,c:'#ff0',bo:1,s:'Lkdsj flkjsd<br>flkjsd flj sdjflkds',cont:cont});
  //c=div({x:200,y:50,w:100,h:50,c:'#ff0',bo:1,s:'Lkdsj flkjsd flkjsd<br>flj<br>sdjflkds',cont:cont});
  //s=c.style;s.transform='scale(0.05,0.05)';s.transformOrigin='top left';
  //div({x:400,y:0,w:100,h:50,c:'#fff',bo:1,s:'LEL',cont:cont});
  //div({x:1000,y:1000,w:100,h:50,c:'#0f0',bo:1,s:'Green',cont:cont});
  
  cont0.addEventListener('DOMMouseScroll',mouseScroll);
  cont0.addEventListener('mousedown',mouseDown);
  cont0.addEventListener('mouseup',mouseUp);
  cont0.addEventListener('mousemove',mouseMove);
  cont0.addEventListener('mousewheel',mouseScroll);
  cont0.addEventListener('touchstart',touchStart,{passive:false});
  cont0.addEventListener('touchmove',touchMove,{passive:false});
  cont0.addEventListener('touchend',touchEnd,{passive:false});
  window.addEventListener('resize',resize);
  resize();
  menuInit();
  //onsole.log(serialize());
  
  //onsole.log('eins,zwei,"drei,vier",fuenf'.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/));
  this.div=div;
  this.cont=cont;
  this.mtime=mtime;
  this.cont0=cont0;
  this.setScale=setScale;
  //...
}
//---

//fr o,1
//fr o,1,3,33
//fr o,1,16
//fr p,10,33
