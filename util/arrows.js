//--- originally divScale.htm -> scalable divs
var Arrows=function(gps) {
  var sc=1,cont,cont0,to0={},m0=undefined,sel,sel0,log=Conet.log,views=[],viewi=0,
      ot=undefined,at=0,scene={},mtime,touchEnded=false,url,contsleft=0,contstop=0;
  function animateViews() {
    var t=Date.now(),dt=(ot===undefined)?0:(t-ot);ot=t;
    
    //og('animate0 '+at+' '+dt);
    var kt=views[viewi].dt;
    if (kt===undefined) kt=1000;
    at+=dt;if (at>kt) {
      at=at%kt;viewi++;if (viewi>=views.length) viewi=0; 
    }
    //og('animate0 '+at+' '+dt+' '+kt);
    var f1=at/kt,v0=views[viewi];
    if (!v0.linear) f1=Math.sqrt(f1);//f1*=f1;
    var f0=1-f1,v1=views[(viewi+1)%views.length];
    
    //var s=v0.s*f0+v1.s*f1;
    if ((v0.t!==undefined)&&(v1.t!==undefined)) {
      var t=v0.t*f0+v1.t*f1;
      showTime(t);
    }
    
    //cont.style.transform='scale('+s+','+s+')';
    if (v0.s!==undefined) setScale(v0.s*f0+v1.s*f1);
    if (v0.x!==undefined) cont0.scrollLeft=v0.x*f0+v1.x*f1;
    if (v0.y!==undefined) cont0.scrollTop=v0.y*f0+v1.y*f1;
    //setScale(s,(-1)*(v0.x*f0+v1.x*f1),(-1)*(v0.y*f0+v1.y*f1));
    
    //log('animate1 '+viewi+' '+f0);
    setTimeout(animateViews,10);
  }
  function checkEval(c) {
    if (url.eval)
    for (var j=c.childNodes.length-1;j>=0;j--) {
      var cs=c.childNodes[j];
      if (!(cs instanceof HTMLScriptElement)) continue;
      //onsole.log(cs);
      if (cs.text.length>0) {
        //onsole.log('Arrows.div doing eval.');
        try { 
          eval(cs.text);
        } catch (e) {
          console.log(e);
        }
        continue;//return;
      }
      //var c2=document.createElement('script');
      //c2.src=c.src;
      //c2.async=c.async;
      //c1.appendChild(c2);
    }
    
    //...
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
    if (!ps.img) { if (!ps.wrap) s.whiteSpace='nowrap';s.padding='2px'; }
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
      if (ps.src.endsWith('.txt')||ps.src.endsWith('.json')) 
      
    Conet.download({fn:ps.src,f:function(v) {
      //---
      //c.src=ps.src.endsWith('.json.txt')?JSON.parse(v).data:v;
      c.src=(ps.src.indexOf('.json')!=-1)?JSON.parse(v).data:v;
      if (ps.col)
      c.onload=function() {
        //onsole.log('arrows.div.img-onload');
        var ca=document.createElement('canvas'),w=128,h=32;//c.width,h=c.height;
        ca.width=w;ca.height=h;
        var ct=ca.getContext('2d');
        ct.drawImage(c,0,0);
        var id=ct.getImageData(0,0,w,h),co=ps.col;//{r:0,g:1,b:0};
        for (var y=0;y<h;y++) for (var x=0;x<w;x++) {
          var i=(y*w+x)*4,r=id.data[i],g=id.data[i+1],b=id.data[i+2];
          id.data[i+0]=Math.floor(255*co[0]*r/255);
          id.data[i+1]=Math.floor(255*co[1]*g/255);
          id.data[i+2]=Math.floor(255*co[2]*b/255);
        }
        ct.putImageData(id,0,0);
        //ct.fillStyle='#f00';ct.fillRect(0,0,w,h);ct.drawImage(c,0,0);
        c.onload=undefined;
        c.src=ca.toDataURL();
        //onsole.log(id);
        //...
      }
      //---
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
      //console.log('arrows.div '+typeof(ps.edge[0])+' '+typeof(ps.edge[1]));
      var id0=ps.edgeId0;
      if (id0) {
        //onsole.log('arrows.div '+id0);
        var ch=document.getElementById(id0);
        //onsole.log(ch);
        c.edgeC0=ch;
      }
      id0=ps.edgeId1;if (id0) c.edgeC1=document.getElementById(id0);
      cont.childNodes[ps.edge[0]].edges.push(c);
      cont.childNodes[ps.edge[1]].edges.push(c);
      calcEdge0(c);
      s.zIndex=-1;
    }
    
    if (ps.maxWidth) s.maxWidth=ps.maxWidth;
    
    if (ps.css) for (var k of Object.keys(ps.css)) s[k]=ps.css[k];
    
    //if (ps.cont) ps.
    c._arrowsIndex=cont.childNodes.length;
    cont.appendChild(c);
    
    checkEval(c);
    
    return c;
  }
  function elSel(e) {
    var c=e.target,s=c.style;//r=c.getBoundingClientRect();
    if (c.parentNode==cont) {
      sel0=sel;
      sel=c;
      if (!scene.elStick) {
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
      }
      if (c.arrowSel) c.arrowSel();
    }
    //...
  }
  function calcEdge0(ec) {
    var c0=(ec.edgeC0||
          cont.childNodes[ec.edge[0]]),c1=ec.edgeC1||cont.childNodes[ec.edge[1]],
        s0=c0.style,s1=c1.style,
        r0=c0.getBoundingClientRect(),r1=c1.getBoundingClientRect(),
        x0=(-contsleft+cont0.scrollLeft+r0.left)/sc,//parseFloat(s0.left.substr(0,s0.left.length-2)),//+r0.width/sc/2,
        y0=(-contstop+cont0.scrollTop+r0.top)/sc,//parseFloat(s0.top.substr(0,s0.top.length-2)),//+r0.height/sc/2,
        x1=(-contsleft+cont0.scrollLeft+r1.left)/sc,//parseFloat(s1.left.substr(0,s1.left.length-2)),//+r1.width/sc/2,
        y1=(-contstop+cont0.scrollTop+r1.top)/sc,//parseFloat(s1.top.substr(0,s1.top.length-2)),//+r1.height/sc/2,
        s=ec.style,dx=x1-x0,dy=y1-y0,d=Math.sqrt(dx*dx+dy*dy),
        d0=//Math.max(r0.width,
          (r0.height)*1.5/sc/2,
        d1=//Math.max(r1.width,
          (r1.height)*1.5/sc/2,
        f0=0;//d0/d;//,f1=1-f0;
        
    //console.log('arrows.calcEdge0');console.log(c0);console.log(r0);
    ////r0.top/=sc;r0.left/=sc;r0.width/=sc;r0.height/=sc;
    ////console.log((r0.left+cont0.scrollLeft)/sc+' '+(r0.top+cont0.scrollTop)/sc
    ////  +' - '+r0.width/sc+' '+r0.height/sc+' sc:'+sc);
    ////console.log(r1);
    ////s.left=(x0*f1+x1*f0)+'px';s.top=(y0*f1+y1*f0)+'px';
    s.left=(x0+f0*dx)+'px';s.top=(y0+dy*f0)+'px';
    ////s.transform='rotate('+Math.atan2(dy,dx)+'rad)';
    var w=d-d0-d1;//d*(f1-f0);
    s.width=w+'px';s.height='20px';
    s.transform='rotate('+Math.atan2(dy,dx)+'rad) scale(1, '+(ec.ps.arrowWidth||1)+')';
    s.opacity=d>400?0.3:1;
    ////'translate(-'+w/2+'px 0px)';
    ////...
  }
  function elMove(e) {
    if (//gps.elStick||
      scene.elStick) return;
    if (!m0) return;
    //if (m0.sticky) return;
    if (!m0.c) return;
    if (m0.c.ps.sticky) return;
    var s=m0.c.style;
    //s.left=(m0.x*sc-cont0.scrollLeft+e.pageX)+'px';
    //s.top=(m0.y*sc-cont0.scrollTop+e.pageY)+'px';
    //s.left=((m0.x+e.pageX)*sc-cont0.scrollLeft)+'px';
    //s.top=((m0.y+e.pageY)*sc-cont0.scrollTop)+'px';
    if (gps.grid) {
      var grid=gps.grid;///sc;
      s.left=(Math.floor(0.5+(m0.x+(e.pageX+cont0.scrollLeft)/sc)/grid)*grid)+'px';
      s.top= (Math.floor(0.5+(m0.y+(e.pageY+cont0.scrollTop)/sc)/grid)*grid)+'px';
    } else {
      s.left=(m0.x+(e.pageX+cont0.scrollLeft)/sc)+'px';
      s.top=(m0.y+(e.pageY+cont0.scrollTop)/sc)+'px';
    }
    var es=m0.c.edges;
    for (var i=0;i<es.length;i++) {
      calcEdge0(es[i]);
    }
    //calcEdge(m0.c);
    //...
  }
  function clear() {
    var last;
    while (last=cont.lastChild) cont.removeChild(last);
    //...
  }
  function load(vfn) {
    Conet.download({fn:vfn,f:function(v) {
      clear();
      var q;
      try {
        q=JSON.parse(v);
      } catch (e) {
        console.error('Error parsing '+vfn+'.',e);
        return;
      }
      var a=q.os;
      for (var i=0;i<a.length;i++) {
        var o=a[i];//o.cont=cont;o.bo=1;
        div(o);
      }
      views=q.views||[];
      if (q.bgcol) cont0.style.backgroundColor=q.bgcol;
      delete(q.os);delete(q.views);scene=q;
      if (q.tmin) mtime.range.min=q.tmin;
      
      var max=q.tmax;
      if (!max) if (views.length>0) max=views[views.length-1].t;
      if (max) mtime.range.max=max;
      setScale(1);
      if (url.animate) animateViews();
    }
    });
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
    var ew1=e.which==1,ew3=e.which==3;
    //onsole.log('arrows.mousedown scene.elStick='+scene.elStick);
    if (ew3||(scene.elStick&&ew1)) {
      m0={
        x:(e.pageX+cont0.scrollLeft)/sc,
        y:(e.pageY+cont0.scrollTop)/sc,
      };
      //md3=true;
      //console.log('mouseDown '+e.which);
    } //else
    if (ew1) {
      elSel(e);
    }
    if (e.which==2) setScale(1);//---190211 quick way to reset view, howto do similar with touch?
    
    //210330 following commented out for /anim/arrows/webCryppto0.json input fields didnt work
    //e.preventDefault();
    //e.stopPropagation();
  }
  function mouseMove(e) {
    var ew1=e.which==1,ew3=e.which==3;
    //...
    if (m0) {
      if (ew3||(scene.elStick&&ew1)) {
        cont0.scrollLeft=m0.x*sc-e.pageX;
        cont0.scrollTop=m0.y*sc-e.pageY;
      } else
      if (ew1) {
        elMove(e);
      }
    }
    //onsole.log('mouseMove '+e);
    //e.preventDefault(); 210330 see above
  }
  function mouseUp(e) {
    //...
    //if (e.which==3) {
      m0=undefined;
      //onsole.log('mouseUp '+e);
    //}
    
    //210330 see above
    //e.preventDefault();
  }
  function resize(e) {
    var s=cont0.style;
    s.width=window.innerWidth+'px';
    s.height=window.innerHeight+'px';
    setScale(sc);
  }
  function touchStart(e) {
    var ts=e.touches;
    touchEnded=false;
    if (ts.length==2) {
      var t0=ts[0],t1=ts[1],x0=t0.pageX,y0=t0.pageY,
          x1=t1.pageX,y1=t1.pageY,dx=x0-x1,dy=y0-y1;
      to0.x=((x0+x1)/2+cont0.scrollLeft)/sc;
      to0.y=((y0+y1)/2+cont0.scrollTop)/sc;
      to0.d=dx*dx+dy*dy;
      to0.sc=sc;
      //console.log('touchStart '+e.touches.length);
    } else if (ts.length==1) {
      if (scene.elStick) {
        var t0=ts[0],x0=t0.pageX,y0=t0.pageY;
        to0.x=(x0+cont0.scrollLeft)/sc;
        to0.y=(y0+cont0.scrollTop)/sc;    
      } else
        elSel(ts[0]);
    }
    //if (!scene.elStick) e.preventDefault();
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
      if (1) setScale(sc,(x0+x1)/2,(y0+y1)/2); 
      //else {
      //if (gps.minsc) sc=Math.max(sc,gps.minsc);
      //  cont.style.transform='scale('+sc+','+sc+')';
      //  //cont.style.transformOrigin='left top';
        cont0.scrollLeft=to0.x*sc-(x0+x1)/2;
        cont0.scrollTop=to0.y*sc-(y0+y1)/2;
      //}
    } else if (ts.length==1) {
      if (scene.elStick) {
        if (!touchEnded) {
          var t0=ts[0],x0=t0.pageX,y0=t0.pageY;
          cont0.scrollLeft=to0.x*sc-x0;
          cont0.scrollTop=to0.y*sc-y0;
        }
      } else
        elMove(ts[0]);
    }
    e.preventDefault();//...
  }
  function touchEnd(e) {
    touchEnded=true;
    m0=undefined;
    //if (!scene.elStick) e.preventDefault();//...
  }
  function click(e) {
    //onsole.log('arrows.click '+e.detail);
    if (e.detail>1) {
      if (gps.onDoubleClick) gps.onDoubleClick();
    } else 
      if (gps.onClick) gps.onClick();
    //...
  }
  function serialize() {
    var sh='{"os":'//'';
    for (var i=0;i<cont.childNodes.length;i++) {
      var c=cont.childNodes[i];
      if (c.ps.transient) continue;
      var s=c.style,o=Conet.hcopy(c.ps);//{};
      o.s=c.ps.s;//c.innerHTML;
      o.x=s.left;o.y=s.top;o.c=s.backgroundColor;
      if (s.transform.length>0) o.t=s.transform;
      if (c.edge) o.edge=c.edge;
      
      //if (c.ps.src) o.src=c.ps.src;
      //if (c.ps.transformOrigin) o.transformOrigin=c.ps.transformOrigin;
      //if (c.ps.img) o.img=c.ps.img;
      //if (c.ps.keyframes) o.keyframes=c.ps.keyframes;
      
      if (s.width) o.w=s.width;
      sh+=(i==0?'[':'\n,')+JSON.stringify(o);
    }
    sh+=']';
    sh+=',\n"views":';
    
    sh+='[\n';
    for (var i=0;i<views.length;i++) {
      sh+=(i>0?',':' ')+JSON.stringify(views[i])+'\n';
    }
    sh+=']';
    //sh+=JSON.stringify(views,undefined,' ');
    
    for (var k in scene) if (scene.hasOwnProperty(k)) {
      sh+=',\n"'+k+'":'+JSON.stringify(scene[k]);
    }
    sh+='}';
    return sh;
    //...
  }
  function showTime(v) {
    if (mtime) {
      mtime.value=v;
      mtime.s=v;
    }
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
        if (k0.opacity!==undefined) s.opacity=k0.opacity*f0+k1.opacity*f1;
        if (k0.x!==undefined) s.left=(k0.x*f0+k1.x*f1)+'px';
        if (k0.y!==undefined) s.top=(k0.y*f0+k1.y*f1)+'px';
        break;
      }
      //if (v<=a[0].time) s.opacity=a[0].opacity; else s.opacity=a[1].opacity;
    }
    
    var e=document.getElementById(mtime.ctrlTextId);
    if (e&&(views.length>0)) {
      var vi,view,viewPrev,isview=false;
      for (vi=0;vi<views.length;vi++) {
        view=views[vi];
        if (view.t<v) viewPrev=view;
        if (view.t==v) isview=true;
        if (view.t>v) break;
      }
      var s='';
      if (view) {
         
        if (viewPrev) s=viewPrev.t;
        if (isview) s+=(viewPrev?'-':'')+v;
        if (view.t!=v) s+='-'+view.t;
        s=', Views: '+s;
      }
      e.innerHTML='Time'+s;
    }
    //console.log('Time oninput '+v);
  }
  function menuInit() {
    if (gps.menu) {
      Menu.init(gps.menu,{listen:1,diw:750});
      return;
    }
    
    
    var cfm=Conet.fileMenu({
    //curFn:'/anim/arrows/mercer.json.txt',
    fn:'/test/divScaleFiles.json.txt',defFn:'/test/divScale0.json.txt',
    noStartLoad:gps.noStartLoad,loadf:load,loadUrlKey:'cfmload'
    ,savef:url.withSave?function(v) {
      //onsole.log(JSON.stringify(cont.children,undefined,' '));
      Conet.upload({fn:v,data:serialize(),log:log});
    }
    :undefined});
    cfm.sub.push({s:'Export',actionf:function() {
      var s=serialize();console.log(s);
      //window.open('data:text/plain;base64,'+s,'DivScale Export');
      alert(s);
    }
    });
    
    
    var ma=[{s:'Menu',sub:[cfm,
    
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
      //return sel?sel.innerHTML:undefined;
      return sel?sel.ps.s:undefined;
      //if (!sel) { alert('No element selected.');return; }
      //sel.innerHTML=Math.random();
    }
    ,setfunc:function(v) {
      sel.ps.s=v;
      sel.innerHTML=v;//...
      
      checkEval(sel);
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
    
    {s:'KeyFrames..',ta:1,jsonCheck:1,doctrl:'KeyFrames',valuef:function() {
      //onsole.log(sel);
      return sel?JSON.stringify(sel.ps.keyframes||[],undefined,' '):undefined;
      //if (!sel) { alert('No element selected.');return; }
      //sel.innerHTML=Math.random();
    }
    ,setfunc:function(v) {
      if (v===undefined) {
        sel.ps.keyframes=undefined;
        return;
      }  
      try { 
        sel.ps.keyframes=JSON.parse(v);
      } catch (err) { 
        alert(err);
      }
    }
    },
    
    
    
    {s:'Add',ms:'Edge',actionf:function() {
      if (!sel||!sel0) { Conet.log('No 2 selections.');return; }
      var i0=Array.prototype.indexOf.call(cont.childNodes,sel0),
          i1=Array.prototype.indexOf.call(cont.childNodes,sel);
      
      div({x:10+'px',y:10+'px',s:'',c:'',img:1,edge:[i0,i1],src:'/canvas/history/arrow.json.txt',transformOrigin:'center left'});
      //console.log(i0+' '+i1);
      //div({x:10+'px',y:10+'px',s:'Node'+cont.childNodes.length,c:'#fff'});
      //log('Add done');
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
    
    //]}
    
    
    ];
    
    if (1||url.animate||url.mtime) ma.push(//m0.sub.push(
    
    mtime={s:'500',ctrlTextId:'mtimeS',close:1,ms:'Time',doctrl:'Time',range:{min:500,max:1300},value:500
    //r:1 gives bug
    ,setfunc:function(v) {
      alert(v);
    }
    ,oninput:showTime}
    
    );
    
    Menu.init(ma,{listen:1,diw:750});
    
    //...
  }
  function setScale(scale,x,y) {
    scale=Math.floor(scale*100000)/100000;//--- to cut float point errs
    
    
    //onsole.log('arrows.setscale '+scale);
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
    var conts=cont.style;
    conts.transform='scale('+sc+','+sc+')';
    //cont.style.scale=sc+' '+sc;
    
    var xe0=10000,ye0=xe0,xe1=0,ye1=0;
    for (var c of cont.childNodes) {
      var r=c.getBoundingClientRect();
      xe0=Math.min(xe0,r.x);
      ye0=Math.min(ye0,r.y);
      xe1=Math.max(xe1,r.x+r.width);
      ye1=Math.max(ye1,r.y+r.height);
    } 
    var r=cont.getBoundingClientRect();
    var w=xe1-r.x,h=ye1-r.y; 
    //onsole.log('setScale iw='+iw+', w='+w+', scrollLeft(x0*sc-x)='+(x0*sc-x));
    
    //--- to visualize calculated width:
    //--- conts.backgroundColor='#0f0';conts.width=w/sc+'px';conts.height=h/sc+'px';
    
    //var r=cont.getBoundingClientRect();
    //console.log(r);
    
    //cont.style.transformOrigin='left top';
    //onsole.log('arrow.mouseScroll '+sc);//(x0*sc-x)+' '+(y0*sc-y));
    //conts=cont0.style;
    if (w<iw) {
      conts.left=(contsleft=((iw-w)/2))+'px'; 
      cont0.scrollLeft=0;
    } else {
      conts.left=(contsleft=0)+'px';
      cont0.scrollLeft=x0*sc-x;
    }
    if (h<ih) {
      conts.top=(contstop=(ih-h)/2)+'px'; 
      cont0.scrollTop=0;
    } else {
      conts.top=(contstop=0)+'px';
      cont0.scrollTop=y0*sc-y;
    }
    
    
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
  cont0.addEventListener('click',click);
  window.addEventListener('resize',resize);
  resize();
  
  url=Conet.parseUrl();
  if (url.fn) {
    gps.noStartLoad=1;
    load(url.fn);
  }
  if (!gps.nomenu) menuInit();
  //onsole.log(serialize());
  
  //onsole.log('eins,zwei,"drei,vier",fuenf'.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/));
  this.div=div;this.load=load;this.clear=clear;
  this.cont=cont;
  this.mtime=mtime;
  this.cont0=cont0;
  this.setScale=setScale;
  this.getSc=function() {
    return sc;
  }
  this.etSel=function() {
    return sel;//...
  }
  this.etScene=function() {
    return scene;//...
  }
  this.hubFiles=function(ps) {
    
    //--- eventually later in an own script file for anim/arrows/hub.json
    //--- or within that file where the func originated,
    //--- for now for easy editing here
    //---
    
    function pxval(s) {
      return parseFloat(s.substr(0,s.length-2));
    }
    
    
    var c=ps.c,st=c.style,xc=pxval(st.left),yc=pxval(st.top);
    //console.log(pxval(st.left)+' '+pxval(st.top));
    //console.log(c.getBoundingClientRect());
    
    //---below cache:1 not needed anymore
    Conet.download({fn:ps.fn,json:1,f:function(d) {
      yc+=40;
      for (var i=0;i<d.length;i++) {
        var e=d[i];
        if (e.h) continue;
        var cn=arrows.div({
          s:'',transient:1,
          c:'rgba(0,250,0,0.1)',x:xc+'px',y:yc+'px'
        });
        var a=document.createElement('a'),fnh=e.fn;//,fn=e.fn;
        a.href=ps.apref+fnh;
        a.title=fnh;
        //a.style.maxWidth='50px';
        var ih=fnh.lastIndexOf('/');
        if (ih!=-1) fnh=fnh.substr(ih+1);
        a.innerHTML=fnh+'<br>';
        cn.appendChild(a);
        var st=cn.style;
        st.maxWidth='75px';
        st.overflow='hidden';
        var sc=1/(i+1);
        st.transform='scale('+sc+','+sc+')';
        if (e.isrc) {
          var img=new Image();
          img.src=e.isrc;
          img.width=50;
          a.appendChild(img);
          yc+=sc*70;
        } else yc+=sc*16;
      }
    }
    });
    
    //...
  }
  this.version='1.169 ';//FOLDORUPDATEVERSION
  console.log('Arrows '+this.version);
  //...
}
//---

//fr o,1
//fr o,1,4,33
//fr o,1,9
//fr o,1,9,0
//fr o,1,11
//fr o,1,12
//fr o,1,13
//fr o,1,21,10
//fr o,1,21,12
//fr o,1,21,18
//fr o,1,21,24
//fr o,1,21,36
//fr o,1,21,37
//fr o,1,21,42
//fr o,1,78,6
//fr o,1,78,14
//fr p,38,74
