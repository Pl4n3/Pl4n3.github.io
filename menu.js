//---
var Menu={};
(function(Menu) {
  Menu.switchf=undefined;
  Menu.press=undefined;
  Menu.cmenu=undefined;
  var menus,tfid='menutf',mok,mcancel,lsx=0,lsy=0,touchms=[],keym={},gpbum={},gppress=new Array(16),
      nomouse=false,ccw=1,cch=1,pressed=[],pressids={},ps,mD=false,sx=0,sy=0,
      tsd=[],tsw=100,tsb=50,tsw0=50,oncome,gamepad,tsdPs,keys=[];//tsw=125,tsb=25
  Menu.mcontrol=undefined;
  Menu.color='rgba(0,0,0,1)';
  Menu.borderColor='rgba(0,0,0,1)';
  Menu.colPress='rgba(240,240,100,1)';
  Menu.colBg='rgba(150,150,150,0.9)';//'rgba(0,0,0,0.2)';
  Menu.colOver='rgba(200,200,100,0.9)';//0.2
  Menu.colNoinp='#666';
  Menu.pw=0.13;Menu.ph=0.05;Menu.px=1-Menu.pw-0.02;Menu.py=0.02;Menu.cpy=0.02;
  Menu.tafs=0.1;//0.15;
  Menu.recent=[];
  Menu.roots=[];
  Menu.soff='[ ]';//'\u2610';
  Menu.son='[x]';//'\u2611';
  Menu.pressed=pressed;
  Menu.version='1.496 ';//FOLDORUPDATEVERSION
  Menu.keys=keys;
  function mCloseAll(a) {
    for (var i=0;i<a.length;i++) {
      var mh=a[i];
      if (mh.sub) { mh.open=false;mCloseAll(mh.sub); }
    }
  }
  function mouseDown(e) {
    //if (nomouse)  { console.log('menu.mouseDown nomouse');
    //  e.preventDefault();e.stopPropagation();return; }
    //onsole.log('menu.mouseDown');
    mD=true;
    if (Menu.mouseDown()) {
      //onsole.log('menu.mouseDown stop propagation');
      e.preventDefault();
      e.stopPropagation();
    }
    if (Menu.onMouseDown) Menu.onMouseDown(e);
    //---
  }
  function mouseMove(e) {
    //onsole.log(e);
    scrolls();
    if (!mD||Menu.press) Menu.search(e.pageX-sx,e.pageY-sy);
    //console.log(e.pageX+' '+e.pageY);
    if (Menu.onMouseMove) Menu.onMouseMove(e);
    //---
  }
  function mouseUp(e) {
    //if (nomouse)  { console.log('menu.mouseUp nomouse');
      ////e.preventDefault();e.stopPropagation();
      //return; }
    //onsole.log('menu.mouseUp');
    mD=false;
    Menu.mouseUp();
  }
  function resize(e) {
    //console.log('Menu.resize '+Menu.mcontrol);
    if (Menu.mcontrol) return;//because on mobile switching from tf to pulldown disables keyboards and makes resize
    Menu.draw();
  }
  function rw(v,yvh) {
    return Math.floor(v*(yvh?cch:ccw)+0.5);
  }
  function scrolls() {
    sy=window.pageYOffset||document.scrollTop||0;
    sx=window.pageXOffset||document.scrollLeft||0;
    
    //...
  }
  function setAutovalm(m,avm) {
    if (!m.sub) return;
    for (var i=0;i<m.sub.length;i++) {
      var mi=m.sub[i];
      if (!mi.sub) mi.autovalm=avm;
      setAutovalm(mi,avm);
    }
  }
  function within(m,x,y) {
    return x>=m.cx&&x<m.cx+m.cw&&y>=m.cy&&y<m.cy+m.ch;
  }
  function tsdAutoKeys5(i,left,right,up,down) {
    var c=tsd[i],s=c.tc0.style;
    c.dx=0;
    c.dy=0;
    if (left) c.dx-=1;
    if (right) c.dx+=1;
    if (up) c.dy-=1;
    if (down) c.dy+=1;
    s.display='';
    s.left=(c.cx+tsw/2-tsw0/2+c.dx*tsw/2)+'px';
    s.top =(c.cy+tsw/2-tsw0/2+c.dy*tsw/2)+'px';
    //...
  }
  function tsdAutoKeys() {
    //---
    //onsole.log('naoooo kc'+kc);
    if (tsdPs.autoKeys==2) {
      tsdAutoKeys5(0,keys[65],keys[68],keys[87],keys[83]);
      tsdAutoKeys5(1,keys[37],keys[39],keys[38],keys[40]);
    } else
      tsdAutoKeys5(0,keys[65]||keys[37],keys[68]||keys[39],keys[87]||keys[38],keys[83]||keys[40]);
    
    /*
    var c=tsd[0],s=c.tc0.style;
    c.dx=0;
    c.dy=0;
    if (keys[65]||keys[37]) c.dx-=1;
    if (keys[68]||keys[39]) c.dx+=1;
    if (keys[87]||keys[38]) c.dy-=1;
    if (keys[83]||keys[40]) c.dy+=1;
    s.display='';
    s.left=(c.cx+tsw/2-tsw0/2+c.dx*tsw/2)+'px';
    s.top =(c.cy+tsw/2-tsw0/2+c.dy*tsw/2)+'px';
    */
    //...
  }
  Menu.action=function() {
    //onsole.log('Menu.action');
    var m=Menu.cmenu;
    var a=m.a?m.a:m.s;
    
    var tf=document.getElementById(tfid);
    
    
    Menu.remove();
    /*
    if (m.r) {
      if (Menu.recent.indexOf(m)==-1) {
        m.ms='recent';
        Menu.recent.push(m);
        m.bgcol='rgba(0,100,200,0.3)';
      }
    }
    */
    Menu.checkAddRecent(m);
    //vvvvv
    
    if (m.checkbox) {
      Menu.setChecked(m,!m.checked);
      //m.checked=!m.checked;
      //m.s=m.checked?Menu.son:Menu.soff;
      //if (m.lskey) localStorage[m.lskey]=m.checked?'1':'0';
    }
    
    
    if (m.autovalm) {
      var am=m.autovalm;
      //am.s=a;
      if (am.lskey) localStorage[am.lskey]=a;
      if (am.autoval==2) { am.ms=m.a||m.s; }
      if (am.setfunc) am.setfunc(a);
      //if (am.autoval==2) { am.ms=m.a||m.s; }
      if (am.autovala) { am.a=m.a; }
    } 
    
    var cstay=false;
    
    if ((m==mok)&&Menu.mcontrol) {
      if (Menu.mcontrol.setfunc) {
        if (Menu.mcontrol.cstay) { m.stay=true;cstay=true; }
        Menu.mcontrol.setfunc(tf?tf.value:undefined);
        if (Menu.mcontrol.lskey&&tf) localStorage[Menu.mcontrol.lskey]=tf.value;
        //if (Menu.mcontrol.lskey) localStorage[Menu.mcontrol.lskey]=tf?tf.value:undefined;
        //console.log(Menu.mcontrol);
        if (tf) {
          var k='menuTfpd'+(Menu.mcontrol.tfHistLskey||Menu.mcontrol.s),
              sh=localStorage[k],a=(sh===undefined)?[]:JSON.parse(sh);
          sh=tf.value;
          for (var i=a.length-1;i>=0;i--) if (a[i]==sh) a.splice(i,1);    
          a.splice(0,0,sh);
          if (a.length>30) a.length=30;
          //onsole.log(a);
          localStorage[k]=JSON.stringify(a);
        }
      }
      else alert('Menu.action '+tf.value);
    }
    if (m==mcancel) {
      if (Menu.mcontrol.cancelf) Menu.mcontrol.cancelf();
    }
    if (Menu.switchf) Menu.switchf(m,a);
    if (!cstay) {
      if (Menu.mcontrol) document.body.oncontextmenu=oncome;
      Menu.mcontrol=undefined;
    }
    
    
    //^^^^
    
    if (m.doctrl) {
      //onsole.log('menu.action doctrl '+document.body.oncontextmenu);
      oncome=document.body.oncontextmenu;
      document.body.oncontextmenu=undefined;
      var skip=false;
      if (m.valuef) {
        m.valuefval=m.valuef();
        if (m.valuefval===undefined) skip=true;
      } else if (m.value!==undefined) m.valuefval=m.value;
      //onsole.log('menu.action doctrl skip='+skip+' m.close='+m.close+' ps.prompt='+ps.prompt);
      if (!skip) {
        if (ps.prompt&&!m.ta&&!m.close&&!m.color) {
          var v=prompt(m.doctrl,('valuefval' in m)?m.valuefval:m.ms);
          
          if (!m.stay) { menus=Menu.roots.concat(Menu.recent); }
          mCloseAll(menus);
          if (v&&m.setfunc) m.setfunc(v);
          if (v&&m.lskey) localStorage[m.lskey]=v;
        } else {
        if (!mok) {
          mok={s:m.okS||'Ok',keys:m.ta?[]:[13]};Menu.initLoad([mok]);
          mcancel={s:m.cancelS||'Cancel'};
        }
        if (m.close
          ||!m.setfunc) {//---191018
          menus=[mcancel];mcancel.s='Close';
        } else menus=[mok,mcancel];
        menus.push(
          {s:m.doctrl,px:m.mcpx?m.mcpx:(ps.diw?0.01:0.32),py:Menu.cpy,//0.02,
          pw:m.mcpw?m.mcpw:(ps.diw?0.51:(1-0.49)),
          ph:m.mcph?m.mcph:(m.ta?(ps.diw?0.3:0.44):0.14),tf:1,
          fs:(m.mcfs?m.mcfs:(m.ta?Menu.tafs:0.75)),mctrl:m,yvh:m.mcyvh});
        //onsole.log(menus);
        Menu.mcontrol=m;
      }}
    } else if (m.sub) {
      if (m.open) {
        m.open=false;
        menus=Menu.roots.concat(Menu.recent);
        mCloseAll(menus);
      } else {
        m.open=true;
        for (var i=0;i<m.sub.length;i++) {
          var mh=m.sub[i];
          if (mh.vcheck||mh.vcheckf) {
            //mh.noinp=mh.vcheckf?!mh.vcheckf():!mh.valuef();
            //mh.col=mh.noinp?Menu.colNoinp:Menu.color;
            Menu.setInp(mh,mh.vcheckf?mh.vcheckf():mh.valuef());
            //if (mh.c) mh.c.style.color=mh.col;
          }
        }
        menus=[m].concat(m.sub);
        if (m.autoval) setAutovalm(m,m);//for (var i=0;i<m.sub.length;i++) m.sub[i].autovalm=m;
      }
    } else if (!m.stay) {
      //var ah=;
      //if (Menu.dynf) {
      //  var a2=Menu.dynf();
      //  if (a2) ah=ah.concat(a2);
      //}
    
      menus=Menu.roots.concat(Menu.recent);
      //for (var i=0;i<menus.length;i++) {
      //  var mh=menus[i];
      //  if (mh.sub) mh.open=false;
      //}
      mCloseAll(menus);
    }
    
    if (m.actionf) m.actionf();
    //----
    
    
    Menu.draw();
    Menu.search(lsx,lsy);
    
    if (!ps.nobeep) Conet.beep({vol:0.05,freq:400});
  }
  Menu.arrayRemove=function(a,o) {
    var i=a.indexOf(o);
    a.splice(i,1);
  }
  Menu.buPress=function() {
    var wassub=Menu.cmenu.sub;
    Menu.press=Menu.cmenu;
    Menu.action();
    Menu.press=undefined;
    if (wassub) {
      Menu.cmenu=menus[0];
      Menu.colorCmenu();
    }
  }
  Menu.buToggle=function() {
    if (Menu.cmenu) {
      Menu.colorCmenu(true);
      Menu.cmenu=undefined;
    } else {
      Menu.cmenu=menus[0];
      Menu.colorCmenu();
    }
  }
  Menu.buWalk=function(d) {
    var i=menus.indexOf(Menu.cmenu);
    //log(i+' '+ma.length);
    if (menus.length>1) {
      Menu.colorCmenu(true);
      Menu.cmenu=menus[(i+d+menus.length)%menus.length];
      Menu.colorCmenu();
    }
  }
  Menu.checkAddRecent=function(m) {
    if (!m.r) return false;
    if (Menu.recent.indexOf(m)==-1) {
      //m.ms='recent';
      Menu.recent.push(m);
      //m.bgcol='rgba(0,100,200,0.3)';
      m.bgcol='rgba(0,100,200,0.7)';
      return true;
    }
    return false;
  }
  Menu.colorCmenu=function(notover) {
    if (!Menu.cmenu) return;
    if (!Menu.cmenu.c) return;
    if (notover) Menu.cmenu.c.style.backgroundColor=Menu.cmenu.bgcol?Menu.cmenu.bgcol:Menu.colBg;
    else Menu.cmenu.c.style.backgroundColor=Menu.cmenu==Menu.press?Menu.colPress:(Menu.cmenu.colOver?Menu.cmenu.colOver:Menu.colOver);
  }
  Menu.draw=function() {
    //onsole.log('Menu.draw 0');
    //onsole.trace();
    if (!menus) return;
    //console.log('Menu.draw 1');
    
    var cont=document.body;
    if (ps.listen) {//&&!ps.diw) {
      //ccw=cont.clientWidth;cch=cont.clientHeight;
      ccw=window.innerWidth;cch=window.innerHeight;//---on zoomed pages menu is still top right
    } else {
      ccw=cont.clientWidth;cch=cont.clientHeight;//--- on zoomed pages menu wanders off
    }
    
    for (var i=0;i<tsd.length;i++) {
      var c=tsd[i],s=c.style;
      s.left=(c.cx=(i==0?tsb:(ccw-tsw-tsb)))+'px';s.top=(c.cy=(cch-tsw-tsb))+'px';
    }
    
    //------------------
    var psdiw=ps.diw;
    //ccw=cch;
    var cx=Math.floor(Menu.px*ccw+0.5),
        cy0=Math.floor(Menu.py*ccw+0.5),cy=cy0,diw=psdiw?ps.diw:ccw,//ccw,
        cw=Math.floor(Menu.pw*diw+0.5),
        ch=Math.floor(Menu.ph*diw+0.5),
        //mfs=Math.floor(ch*0.25);
        padding=Math.floor(0.01*diw+0.5);//ccw   
    if (psdiw) {
      //console.log('Menu.draw cont.style.overflow='+cont.style.overflow);
      cx=ccw-cw-(cont.style.overflow=='hidden'?10:25);
      cy0=cy=10; 
    }
    //--------------------
        
    sy=window.pageYOffset||document.scrollTop||0,
    sx=window.pageXOffset||document.scrollLeft||0;    
    //onsole.log('Menu.draw sxy='+sx+' '+sy);
    
    var opsdiw=psdiw;
    
    for (var i=0;i<menus.length;i++) {
      var m=menus[i];
      var c=m.c;
      
    
    //-----------------------  
    var psdiw=m.fullscale?undefined:ps.diw;
    if (psdiw!=opsdiw) {
    //ccw=cch;
    var cx=Math.floor(Menu.px*ccw+0.5),
        //cy0=Math.floor(Menu.py*ccw+0.5),cy=cy0,
        diw=psdiw?ps.diw:ccw,//ccw,
        cw=Math.floor(Menu.pw*diw+0.5),
        ch=Math.floor(Menu.ph*diw+0.5),
        //mfs=Math.floor(ch*0.25);
        padding=Math.floor(0.01*diw+0.5);//ccw
    if (psdiw) {
      //console.log('Menu.draw cont.style.overflow='+cont.style.overflow);
      cx=ccw-cw-(cont.style.overflow=='hidden'?10:25);
      //cy0=cy=10; 
    }
    opsdiw=psdiw;
    }
    //---------------------------- 
      
      
      var mco=m.mctrl;
      var cos=mco?mco.cos:undefined;
      var mfs=Math.floor(ch*0.25*(m.mfs||1));
      if (!c) { c=m.canvc;m.c=c; }
      if (!c) {
        c=document.createElement(m.canv?'canvas':'div');
        if (m.canv) m.canvc=c;
        var s=c.style;
        s.zIndex=5;
        c.style.position='absolute';
        c.style.overflow='hidden';
        //c.style.backgroundColor=m.tf?'rgba(100,100,100,0.6)':'rgba(0,0,0,0.2)';
        //c.style.backgroundColor=(m.bgcol?m.bgcol:Menu.colBg);
        //c.style.color=m.col?m.col:(m.noinp?Menu.colNoinp:Menu.color);
        if (m.tf) {
          if (!cos) c.style.padding=padding;
        } else {
          
          if (!m.log) {
            c.style.textAlign=m.textAlign||'center';
            c.style.userSelect='none';c.style.MozUserSelect='none';c.style.WebkitUserSelect='none';
            c.style.cursor='pointer';
          } else {
            c.style.paddingLeft='2px';
            c.style.overflow='scroll';
          }
          c.style.spacingTop='10px';
        }
        c.style.borderWidth='1px';
        c.style.borderStyle='solid';
        //c.style.boxShadow='3px 3px 10px rgb(34,34,34)';
        if (m.bosh) c.style.boxShadow='4px 4px 15px rgb(34,34,34)';
        if (m.tesh||m.textShadow) c.style.textShadow=(m.textShadow?m.textShadow:'0px 1px 1px rgb(0,0,0)');
        if (m.padding) c.style.padding=m.padding;
        //c.style.verticalAlign='middle';
        //c.style.margin='auto';
        //if (m.tesh) c.style.textShadow='3px 3px 6px rgb(0,0,0)';
    
        //c.style['user-select']='none';
        //c.style['-moz-user-select']='none';
    
        //c.innerHTML=m.s;//'\u25b2';
    //    if (m.mctrl) if (m.mctrl.cos) {
    //      var cos=m.mctrl.cos;
        if (cos) {
          for (var i=0;i<cos.length;i++) {
            var co=cos[i];
            var ch;
            if ('ta'==co.t) {
              ch=document.createElement('textarea');
              //ch.wrap='virtual';
              if (co.fontSize) ch.style.fontSize=co.fontSize;
            } else if ('t'==co.t) {
              //ch=document.createTextNode(co.v);
              ch=document.createElement('span');
              ch.innerHTML=co.v;
            } else if ('cb'==co.t) {
              ch=document.createElement('input');
              ch.type='checkbox';//'checkbox';
            } else {
              ch=document.createElement('input');
              ch.type='text';
              //if (co.v) ch.value=co.v;
              //m.ntf=tf;
            }
            if (co.fontSize) ch.style.fontSize=co.fontSize;
            co.c=ch;
            c.appendChild(ch);
          }
          //c.style.width='800px';
          //c.style.height='500px';
          //onsole.log(c);
        }
        
        m.c=c;
      }
      c.style.color=m.col?m.col:(m.noinp?Menu.colNoinp:Menu.color);
      c.style.backgroundColor=(m.bgcol?m.bgcol:Menu.colBg);
      c.style.borderColor=m.bocol?m.bocol:Menu.borderColor;
      var bowi=m.bowi,bowi0=(bowi?Math.floor(bowi*ch+0.5):1);//||Menu.bowi;
      c.style.borderWidth=bowi0+'px';
      c.style.borderStyle=m.bost?m.bost:'solid';
    
      
      if (!m.shown) {
        document.body.appendChild(c); 
        m.shown=true;
        if (cos) {
          for (var i=0;i<cos.length;i++) {
            var co=cos[i];
            if ('t'!=co.t) {
              co.c.value=co.v?co.v:'';
            }
            if (co.focus) co.c.focus();
          }
        }
        if (mco) if (mco.showf) mco.showf();
      }
    
    
      if (m.px!==undefined) {
      //if (m.pw===undefined) m.pw=0.13;
      //if (m.px===undefined) m.px=1-m.pw-0.02;
      //if (m.ph===undefined) m.ph=0.05;
      ////if (m.py===undefined) m.py=0.02+(m.ph+0.01)*i;
      //if (m.py===undefined) m.py=0.02+(m.ph)*i;
        var ccw7=diw;
        m.cx=Math.floor((m.xcenter?ccw/2-m.px*diw-m.pw*diw/2
          :(m.xright?ccw-m.px*diw-m.pw*diw
          :m.px*ccw7))+0.5);
        m.cw=Math.floor(m.pw*ccw7+0.5)-(cos?0:padding*2);
        m.ch=m.fixh||Math.floor(m.ph*(m.yvh?cch:ccw7)+0.5)-(cos?0:padding*2);
        m.cy=Math.floor(m.py*(m.yvh?cch:ccw7)+0.5);if (m.ydown) m.cy=cch-m.cy-m.ch;
      } else {
        m.cx=(m.pdx||0)+cx-(m.pw?Math.floor(m.pw*diw+0.5)-cw:0);//ccw
        m.cy=cy;//+i*ch;
        m.cw=m.pw?Math.floor(m.pw*diw+0.5):cw;//ccw
        m.ch=m.ph!==undefined?Math.floor(m.ph*diw+0.5):ch-1;
        if (m.fixCy) ch=m.ch+1;
        cy+=ch;
        if (cy+ch+ch>cch) {
          //onsole.log(menus[1]);
          var m1=menus[i-1];//1
          cx-=(m1.pw?m1.pw*diw:cw)+1;
          cy=cy0;
        }
      }
    
      c.style.left=(sx+m.cx)+'px';
      c.style.top=(sy+m.cy)+'px';
      var ctdi=m.mctrl&&ps.diw;
      if (!ctdi) {
        c.style.width=m.cw-(bowi0-1)*2+'px';
        c.style.height=m.ch-(bowi0-1)*2+'px';
      }
      //c.style.lineHeight=m.ch;
      c.style.fontSize=(ctdi?'14':Math.floor((m.fs?m.fs:1)*m.ch*0.5))+'px';//+'px';//0.7
      //onsole.log('Menu.draw '+m.cx);
      //onsole.log(c);
    
         
      if (cos) {
        var bh=0.005;
        var lh=(m.ph-bh)/cos.length;
        var tw=0.35;
        let maxw=0,maxh=0,toh,leh,wih,heh;
        for (var ci=0;ci<cos.length;ci++) {
          var co=cos[ci];
          var cs=co.c.style;
          if (!co.fontSize) cs.fontSize=c.style.fontSize;
          //if (ci==0) {
          cs.position='absolute';
          //cs.top=rw(ci*lh+bh);//(Math.floor(0.06*ccw+0.5));
          //cs.left=rw(tw*m.pw);//Math.floor(0.1*ccw+0.5);
          //cs.width=rw((1-tw)*m.pw-bh);//Math.floor(0.4*ccw+0.5);
          //cs.height=rw(lh-bh);
          cs.top=toh=rw(co.y*m.ph,m.yvh);//(Math.floor(0.06*ccw+0.5));
          cs.left=leh=rw(co.x*m.pw);//Math.floor(0.1*ccw+0.5);
          cs.width=wih=rw(co.w*m.pw);//Math.floor(0.4*ccw+0.5);
          cs.height=heh=rw(co.h*m.ph,m.yvh);
          maxw=Math.max(maxw,leh+wih);
          maxh=Math.max(maxh,toh+heh);
          //onsole.log(cs.top+' '+cs.left+' '+cs.width+' '+cs.height);
          //}
        }
        c.style.width=maxw+padding*2;
        c.style.height=maxh+padding*2;
        //onsole.log('maxw,maxh='+maxw+','+maxh);
      } else { 
      if (m.tf) {
        var e=document.getElementById(tfid);
        var file=mco.file;
        //var value=(e?e.value:(mco.value?mco.value:(mco.valuef?mco.valuefval:(mco.ms?mco.ms:''))));
        var value=(e?e.value:((mco.value!==undefined)?mco.value:(mco.valuef?mco.valuefval:(mco.ms?mco.ms:''))));
        //if (mco.cos) {} else 
        if (mco.co)
          c.innerHTML=m.s+'<br>...';
        else if (mco.text)
          c.innerHTML=m.s+'<br>'+value;
        else if (mco.ta) {
          //var fs=m.fs?m.fs:1;
          c.innerHTML=m.s+'<br><textarea id="'+tfid+'" '+(mco.wrap?'':'wrap="off" ')+'style="'+(mco.wrap?'':
            //-> in firefox this made \n not do wrap, therfore commented out: 'white-space:nowrap;'+
            'overflow:auto;')
            +'width:min(400px,'+(ccw*0.8)+'px);'
            +'font-size:'+c.style.fontSize+'" '+
          'cols='+(mco.tacols?mco.tacols:36)+' rows='+(mco.tarows?mco.tarows:15)+'>'+value+'</textarea>';
          //tacols:36,tarows:15 frueher 20,8
          //'cols='+(mco.tacols?mco.tacols:Math.floor(3/fs+0.5))+' rows='+(mco.tarows?mco.tarows:Math.floor(1.2/fs+0.5))+'>'+value+'</textarea>';
          if (mco.jsonCheck) {
            let ta=document.getElementById(tfid);
            Conet.initJsonTa({c:ta});
            if (0&&window.Frog) {
              console.log('Init frog nao.');
              Frog.draw({ta:ta,_c:c,showTa:true,alwaysTf:1,imgPath:'/test/',w:15,
                ops:[{op:'{}',color:'#ba3',line1:1,line1h:1},{op:'[]',color:'#7c7'}],menus:{},json:1,resetOps:1});
            }
          }
        } else {
          var k='menuTfpd'+(m.mctrl.tfHistLskey||m.mctrl.s),lsv=localStorage[k],sels='';
          //onsole.log('k='+k+' lsv='+lsv);
          if (lsv!==undefined) {
            var a=JSON.parse(lsv);
            sels='<select oninput="document.getElementById(\''+tfid+'\').value=this.value;" style="width:30px;margin:4px;">';
            a.splice(0,0,'');//--- empty selected value at start, else on mobile first value is selected, no input event
            //for (var v of a) sels+='<option>'+v+'</option>';
            for (var i=0;i<a.length;i++) sels+='<option'+(i==0?' selected':'')+'>'+a[i]+'</option>';
            sels+='</select>';
          }
          if (m.mctrl.tfDir) {
            sels+='Dir:'+m.mctrl.tfDir;
          }
          //onsole.log(m);
          
          var s=m.s;
          if (m.mctrl.ctrlTextId) s='<span id="'+m.mctrl.ctrlTextId+'">'+s+'</span>';
          //s=s+' '+m.mctrl.ctrlTextId;
          
          c.innerHTML=s+'<br>'//+'<datalist id="mlist"><option value="ains">eins</option><option value="svai">zwei</option></datalist>'
          +'<input id="'+tfid+'"'+(1?' type="'+(mco.color?'color':(file?'file':'text'))+'"':'')+' value="'+(''+value).replace(/"/g,'&quot;')          
          +'" style="font-size:'+c.style.fontSize+';" size='+(file?2:25)//was 2:15 //+' list="mlist"'
          +' oninput="var m=Menu.mcontrol;if (m.oninput) m.oninput(this.value);"'
          +'></input>'
          +sels//'<select style="width:30px;"><option value="n1">Nummer eins</option><option value="n2">Nummer zwei</option></select>'
          +(mco.range?
            ' Animate <input type=checkbox oninput="Menu.mcontrol.animate=this.checked;" />'
            //+'<input type=text value="1x" size=3 />'
            +'<br><input type="range" min="'+mco.range.min+'" max="'+mco.range.max+'"'
            +' style="width:300px;"'
            +' oninput='//mco==m.mctrl
            +'"var e=document.getElementById(\''+tfid+'\');e.value=this.value;'
            +'var m=Menu.mcontrol;if (m.oninput) m.oninput(this.value);"></input>':'')
          ;     
        } 
        } else if (m.canv) {        
          c.width=m.cw;        c.height=m.ch;
      } else {
        if (m.msf) m.ms=m.msf();
        c.innerHTML=(m.vertCenter?
          '<div style="line-height:'+m.ch+'px">'+m.s+(m.sub&&!m.noTri?(m.open?' \u25b2':' \u25bc'):'')+'</div>':
          m.s+(m.sub&&!m.noTri?(m.open?' \u25b2':' \u25bc'):''))
        +(m.ms!==undefined?'<div'+(m.msid?' id="'+m.msid+'"':'')+' style="font-size:'+mfs+'px'
        +';position:absolute;'+(m.c2?'z-index:10;text-shadow:1px 0px 1px '+(m.tbgcol?m.tbgcol:'#aaa')+';':'')+'top:'
        //+((ch-2*mfs)*(m.mstop||1))+'pt;'
        +((ch-mfs)*(m.mstop||1)-3)+'px;'
        +(m.msCenter?'width:100%;text-align:center;':'left:2pt;')
        +'">'+m.ms+'</div>':'');
        //textShadow=(m.textShadow?m.textShadow:'0px 0px 1px rgb(0,0,0)'
      } 
      }
    
      if (m.c2) {
        //console.log('draw c2 nao.');
        var c2=m.c2//ocument.createElement('div')
            ,s2=c2.style;
        s2.position='absolute';
        s2.top='0px';s2.left='0px';
        s2.width=m.cw+'px';s2.height=m.ch+'px';
        //s2.width='20px';s2.height='20px';
        //s2.backgroundColor='rgba(0,250,0,0.5)';
        c.appendChild(c2);
      }
    
      if (m.ondraw) m.ondraw();
    
    }
    var e=document.getElementById(tfid);
    if (e) {
      e.focus();
      if (mco.jsonTa) Conet.initJsonTa({c:e});
    }
  }
  Menu.gamepad=function() {
    //if (1) return;
    var f=navigator.getGamepads||navigator.webkitGetGamepads;
    var gp=f&&f.apply(navigator)[0];//:undefined;
    //var gp=navigator.webkitGetGamepads && navigator.webkitGetGamepads()[0];
    if (!gp) return;
    //if (gp.buttons[0]) alert(32);
    for (var h=gppress.length-1;h>=0;h--) {
      var v=gp.buttons[h].value;
      if (v^gppress[h]) {
        gppress[h]=v;
        var m=gpbum[h];
        if (m) { m.on=v;if (m.c) m.c.style.backgroundColor=v?Menu.colOver:(m.bgcol?m.bgcol:Menu.colBg); }
      }
    }
    Menu.gp=gp;
    
    /*
    if (gamepad) {
      var on,ch=false,gmi=0.3;
      on=gamepad.axes[0]<-gmi;if (mLeft.on!=on) {mLeft.on=on;ch=true;}
      on=gamepad.axes[0]>gmi;if (mRight.on!=on) {mRight.on=on;ch=true;}
      on=gamepad.axes[1]>gmi;if (mBack.on!=on) {mBack.on=on;ch=true;}
      on=gamepad.axes[1]<-gmi;if (mFront.on!=on) {mFront.on=on;ch=true;}
      //setDebug(gamepad.axes[2]);
      on=gamepad.axes[2]<-gmi;if (mtLeft.on!=on) {mtLeft.on=on;ch=true;};//sometimes doesnt happens...log('left'+on);}
      on=gamepad.axes[2]>gmi;if (mtRight.on!=on) {mtRight.on=on;ch=true;}
      
      for (var h=gppress.length-1;h>=0;h--) {
        gpchange[h]=gamepad.buttons[h]^gppress[h];
        gppress[h]=gamepad.buttons[h];
      }
      
      on=gamepad.buttons[0]||gamepad.buttons[5];if (Menu.cmenu) on=false;
      if (mAction.on!=on) {mAction.on=on;ch=true;}
      
      if (gpchange[13]||gpchange[12]) {
        if (gppress[13]||gppress[12]) {
          if (Menu.cmenu) 
            Menu.buWalk(gppress[12]?-1:1);
          else 
            changeEyemd(gppress[12]);
        }
      }
      if (gpchange[9]&&gppress[9]) Menu.buToggle();
      if (Menu.cmenu&&gpchange[0]&&gppress[0]) Menu.buPress();
      
      if (ch) mColors();
    }
    */
  }
  Menu.getMenus=function() {
    return menus;
  }
  Menu.getTf=function() {
    //---
    return document.getElementById(tfid);
    //...
  }
  Menu.init=function(a,p) {
    console.log('Menu '+Menu.version);
    Menu.initLoad(a);
    Menu.roots=a;
    menus=a.concat(Menu.recent);
    ps=p||{};
    if (!ps.diw) ps.diw=750;
    if (ps.listen) {
      window.addEventListener('resize',resize);
      window.addEventListener('scroll',resize);
      window.addEventListener('mousemove',mouseMove);
      window.addEventListener('mousedown',mouseDown);
      window.addEventListener('mouseup',mouseUp);
      window.addEventListener('keydown',Menu.keyDown);
      window.addEventListener('keyup',Menu.keyUp);
      window.addEventListener('touchstart',Menu.touchStarts,{passive:false});
      window.addEventListener('touchmove',Menu.touchMoves,{passive:false});
      window.addEventListener('touchend',Menu.touchEnds,{passive:false});  
      Menu.draw();
    }
  }
  Menu.initMenu=function(m) {
    //---
    if ((m.ms===undefined)&&m.keys) { 
      m.ms='<span style="color:#338;">Key:</span> ';
      let s=m.keys[0]+'';
      //onsole.log(s);
      if (s.endsWith('_c')) { m.ms+='ctrl+';s=s.substr(0,s.length-2); }
      m.ms+=(s==13)?'ret':String.fromCharCode(s); 
    } 
    if ((m.ms===undefined)&&(m.vertCenter===undefined)&&((m.s||'').indexOf('<br>')==-1)) m.vertCenter=1;
    if (m.lskey) {
      var v=localStorage[m.lskey];
      if (!(v===undefined)) {
        //alert(v);
        if (m.autoval==2) m.ms=v;
        if (m.setfunc) m.setfunc(v,true);
        if (m.checkbox) m.checked=(v=='1');
      }
    }
    if (m.initLoadVal) m.setfunc(m.initLoadVal,true);//--- new param since 191015 voxed.js
    if (m.lskeyimg) {
      var v=localStorage[m.lskeyimg];
      if (v!==undefined) {
        m.c2=new Image();
        m.c2.src=v;
      }
    }
    if (m.img) {
      m.c2=new Image();
      m.c2.src=m.img;
    }
    if (m.checkbox) m.s=m.checked?Menu.son:Menu.soff;
    if (m.keys) for (var h=0;h<m.keys.length;h++) keym[m.keys[h]]=m;
    if (m.gpbu) for (var h=0;h<m.gpbu.length;h++) gpbum[m.gpbu[h]]=m;
    //if (m.noinp) m.col=Menu.colNoinp;
    if (m.sub) Menu.initLoad(m.sub);
    return m;
    //...
  }
  Menu.initLoad=function(a) {
    //onsole.log('initLoad');
    for (var i=0;i<a.length;i++) {
      var m=a[i];
      Menu.initMenu(m);
    }
  }
  Menu.keyDown=function(ev) {
    if (Menu.mcontrol) return;
    var kc=ev.keyCode,ret;
    if (ps.keyLog) 
     console.log('Menu.keyDown '+kc);
    var m=keym[kc+(ev.ctrlKey?'_c':0)];
    if (m) { 
      //onsole.log('Menu.keyDown 0');
      //onsole.log(m);
      if (ev.ctrlKey) ev.preventDefault();
      //
      if (!m.on||m.actionOnEveryKeyDown) {
      m.on=true;
      if (m.c) {
        //m.c.style.backgroundColor=Menu.colOver;
        Menu.cmenu=m;
        Menu.action();
        m.c.style.backgroundColor=Menu.colOver;
        //onsole.log('Menu.keyDown 1 '+Menu.colOver);
      } else {
        if (m.actionf) { m.actionf();ret=1; }
        else {
          Menu.cmenu=m;
          Menu.action();
        }
      }
      }
      //ev.preventDefault();
      //ev.stopPropagation();
    }
    keys[kc]=1;
    //onsole.log('kc='+kc);
    if (tsdPs&&tsdPs.autoKeys) tsdAutoKeys();
    return ret;
    //alert(kc);
  }
  Menu.keyUp=function(ev) {
    var kc=ev.keyCode;
    var m=keym[kc+(ev.ctrlKey?'_c':0)];
    if (m) { m.on=false;if (m.c) m.c.style.backgroundColor=m.bgcol?m.bgcol:Menu.colBg; }
    keys[kc]=0;
    if (tsdPs&&tsdPs.autoKeys) tsdAutoKeys();
  }
  Menu.mouseDown=function() {
    //console.log('Menu.mouseDown 0');
    if (nomouse) return false;
    //console.log('Menu.mouseDown 1');
    if (Menu.cmenu) {
      //console.log('Menu.mouseDown 2');
      //menuAction();
      //cmenu.c.style.backgroundColor='rgba(230,230,0,0.7)';
      Menu.press=Menu.cmenu;
      Menu.press.on=true;
      Menu.colorCmenu();
      return true;
    }
    return false;
  }
  Menu.mouseUp=function() {
    //console.log('Menu.mouseUp 0');
    if (nomouse) return false;
    //console.log('Menu.mouseUp 1 '+Menu.press);
    if (Menu.press) if (Menu.cmenu==Menu.press) {
      //console.log('Menu.mouseUp 2');
      Menu.action();
      Menu.press.on=false;
      Menu.press=undefined;
      Menu.colorCmenu();
      
      return true;
    }
    return false;
  }
  Menu.ms=function(m,s) {
    m.ms=s;
    if (m.msid) {
      var e=document.getElementById(m.msid);
      if (e) e.innerHTML=s;
    }
  }
  Menu.remove=function() {
    //Paint.stacktrace();
    if (!menus) return;
    try {
    for (var h=0;h<menus.length;h++) {
      var mh=menus[h],c=mh.c;
      //console.log('Menu.remove '+
      document.body.removeChild(c);//);
      mh.shown=false; 
    }
    } catch (e) {}
  }
  Menu.removeSub=function(p,c) {
    const i=p.sub.indexOf(c);
    if (i!=-1)
      p.sub.splice(i,1);
    else {
      console.error('couldnt remove menu '+c);
    }
    //...
  }
  Menu.search=function(x,y,justreturn) {
    //onsole.log('Menu.search 0');
    lsx=x;lsy=y;
    var cm=undefined;
    if (!menus) return;
    for (var i=0;i<menus.length;i++) {
      var m=menus[i];
      if (m.tf||m.noinp) continue;
      if (within(m,x,y)) {//(x>=m.cx&&x<m.cx+m.cw&&y>=m.cy&&y<m.cy+m.ch) {
        cm=m;
        break;
      }
    }
    
    //onsole.log('Menu.search '+cm);
    
    if (justreturn) return cm;
    //if (cm) if (cm.noa) {
    //  //cm.on=true;
    //  return cm;
    //}
    
    if (Menu.cmenu!=cm) {
      if (Menu.cmenu) {
        Menu.colorCmenu(true);//cmenu.c.style.backgroundColor=cmenu.bgcol?cmenu.bgcol:'rgba(0,0,0,0.2)';
        if (Menu.cmenu==Menu.press) Menu.cmenu.on=false;
      }
      Menu.cmenu=cm;
      if (Menu.cmenu) {
        Menu.colorCmenu();
        if (Menu.cmenu==Menu.press) Menu.cmenu.on=true;
      }
      //if (cm) cm.c.parentNode.removeChild(cm.c);
      //if (cm) cm.c.style.display='none';
      //onsole.log('Menu.search '+(cm?cm.c.style.backgroundColor:'no cm'));
    }
    
    return cm;
  }
  Menu.seta=function(a) {
    Menu.remove();
    menus=a.concat([]);
    Menu.draw();
  }
  Menu.setChecked=function(m,checked) {
    m.checked=checked;
    m.s=m.checked?Menu.son:Menu.soff;
    if (m.lskey) localStorage[m.lskey]=m.checked?'1':'0';
  }
  Menu.setInp=function(m,inp) {
    m.noinp=!inp;//true;
    //m.col=inp?Menu.color:Menu.colNoinp;
    //if (m.c) m.c.style.color=m.col;
  }
  Menu.setMenus=function(m) {
    menus=m;
  }
  Menu.sim=function(p) {
    //---schedule simulated menu presses
    if (p.m.c) p.m.c.style.backgroundColor=Menu.colPress;
    setTimeout(function() {
      Menu.cmenu=p.m;
      Menu.action();
      var pn=p.next;
      if (pn) {
        if (pn.t===undefined) pn.t=p.t;
        Menu.sim(pn);
      }
      if (p.nextf) p.nextf();
    }
    ,p.t);
  }
  Menu.touchEnd=function() {
    //lert('Menu.touchEnd 0');
    if (Menu.press) {
      if (Menu.cmenu==Menu.press) Menu.action();
      Menu.press.on=false;
      Menu.press=undefined;
      Menu.colorCmenu(true);
      return true;
    }
    //lert('Menu.touchEnd 1');
    //for (var h=0;h<touchms.length;h++) {
    //  touchms[h].on=false;
    //}
    //touchms=[];
    return false;
  }
  Menu.touchEnds=function (e) {
    //onsole.log('Menu.touchEnds');
    if ((pressed.length==0)&&(tsd.length==0)) return;
    for (var h=pressed.length-1;h>=0;h--) pressed[h].stayPressed=false;
    for (var h=tsd.length-1;h>=0;h--) tsd[h].stayPressed=false;
    for (var h=0;h<e.touches.length;h++) {
      var t=e.touches[h];
      pressids[t.identifier].stayPressed=true;
    }
    for (var h=tsd.length-1;h>=0;h--) {
      var c=tsd[h];
      if (c.stayPressed) continue;
      if (c.tident===undefined) continue;
      c.style.borderColor='rgba(200,200,200,0.2)';
      c.tc0.style.display='none';
      c.tc1.style.display='none';
      c.dx=0;c.dy=0;
      delete(c.tident);
    }
    for (var h=pressed.length-1;h>=0;h--) {
      var m=pressed[h];
      if (m.stayPressed) continue;
      if ((Menu.cmenu==m)
        //&&(e.touches.length==0) //200911 auskommentiert,
        //damit menu waehrend touchstick-move funktioniert
      ) Menu.action();
      //else console.log('no action ');
      m.on=false;
      m.c.style.backgroundColor=m.bgcol?m.bgcol:Menu.colBg;
      pressed.splice(h,1);
    }
    if (!ps.touchEndsPropagation) { //---used in /anim/cannon/builder.htm otherwise mdiv inputs dont get focus
      e.preventDefault();
      e.stopPropagation();
      //onsole.log('propag stopped');
    }
  }
  Menu.touchMoves=function(e) {
    var ret=undefined;
    //onsole.log(tsdPs);
    for (var h=0;h<e.touches.length;h++) {
      var t=e.touches[h];
      var c=pressids[t.identifier];
      if (!c) continue;
      if (c.tident===undefined) continue;//no tsd
      var x=t.pageX-sx,y=t.pageY-sy;
      var c0=c.tc1,s=c0.style;
      if (tsdPs.lronlyx&&(c===tsd[1])&&(tsd[0].tident!==undefined)) {
        //onsole.log('1');
        y=c.y0;
      }
      s.left=(x-tsw0/2)+'px';
      s.top=(y-tsw0/2)+'px';s.display='';
      c.dx=2*(x-c.x0)/tsw;
      c.dy=2*(y-c.y0)/tsw;
      //c.style.borderColor='#00f';
      ret=1;
    }
    return ret;
    //...
  }
  Menu.touchStart=function(x,y,multiple) {
    //onsole.log('0');
    nomouse=true;
    var cm=Menu.search(x,y,multiple);
    if (cm) {
      Menu.cmenu=cm;
      Menu.press=cm;
      Menu.press.on=true;//touchms.push(Menu.press);
      Menu.colorCmenu();
      //menuAction();
      return true;
    }
    return false;
  }
  Menu.touchStarts=function(e) {
    //onsole.log('Menu.touchStarts');// sx/sy='+sx+'/'+sy);
    nomouse=true;
    var ret=undefined;//,foundM=false;
    for (var h=0;h<e.touches.length;h++) {
      var t=e.touches[h];
      var x=t.pageX-sx,y=t.pageY-sy;
      if (tsd.length>0) for (var i=tsd.length-1;i>=0;i--) {
        var c=tsd[i];
        if (c.tident!==undefined) continue;
        if (c.noInp) continue;
        if (within(c,x,y)) {
          c.x0=x;c.y0=y;
          var c0=c.tc0,s=c0.style;
          s.left=(x-tsw0/2)+'px';s.top=(y-tsw0/2)+'px';s.display='';
          c0=c.tc1;s=c0.style;
          s.left=(x-tsw0/2)+'px';s.top=(y-tsw0/2)+'px';s.display='';
    
          //c.style.borderColor='#ff0';
          c.tident=t.identifier;
          pressids[t.identifier]=c;
    
          //var c0=c.tc0,s=c0.style;
          //s.left=(x-tsw0/2)+'px';s.top=(y-tsw0/2)+'px';s.display='';
          continue;
        }
      }
      var m=Menu.search(x,y,1);
      if (!m) {
        //onsole.log('Menu.touchStarts no menu at '+x+','+y+' (sx,sy='+sx+','+sy+')');
        continue;//foundM=true;
      }
      Menu.cmenu=m;
      if (pressed.indexOf(m)!=-1) continue;
      m.on=true;
      m.c.style.backgroundColor=Menu.colPress;
      pressed.push(m);
      pressids[t.identifier]=m;
      ret=1;
    }
    //onsole.log('Menu.touchStarts ret='+ret);
    if (ret) {
      e.preventDefault();
      e.stopPropagation();
      //onsole.log('propag stopped');
    }
    return ret;
  }
  Menu.touchSticksInit=function(ps) {
    if (!ps) ps={};tsdPs=ps;
    //console.log(tsdPs);
    
    for (var i=0;i<2;i++) {
      var c=document.createElement('div'),s=c.style;
      s.position='absolute';s.width=tsw+'px';s.height=tsw+'px';c.cw=tsw;c.ch=tsw;
      s.border='solid';s.borderWidth='1px';s.borderColor='rgba(200,200,200,0.2)';
      s.outlineStyle='solid';s.outlineColor='#000';s.outlineWidth='1px';
      tsd.push(c);var tc=c;c.dx=0;c.dy=0;
      if (!ps['skip'+i]) document.body.appendChild(c); else c.noInp=true;
      
      c=document.createElement('div');s=c.style;tc.tc0=c;s.position='absolute';s.width=tsw0+'px';s.height=tsw0+'px';
      s.display='none';s.border='solid';s.borderWidth='1px';s.borderColor='rgba(200,200,200,0.2)';
      s.outlineStyle='solid';s.outlineColor='#000';s.outlineWidth='1px';if (!ps['skip'+i]) document.body.appendChild(c);
      c=document.createElement('div');s=c.style;tc.tc1=c;s.position='absolute';s.width=tsw0+'px';s.height=tsw0+'px';
      s.display='none';s.border='solid';s.borderWidth='1px';s.borderColor='rgba(200,200,200,0.2)';
      s.outlineStyle='solid';s.outlineColor='#000';s.outlineWidth='1px';if (!ps['skip'+i]) document.body.appendChild(c);
    }
    document.body.style.overflow='hidden';
    Menu.draw();
    tsd.ps=ps;
    return tsd;
    //...
  }
  Menu.touchSticksRemove=function() {
    for (var i=0;i<tsd.length;i++) {
      var c=tsd[i];
      document.body.removeChild(c);
      document.body.removeChild(c.tc0);
      document.body.removeChild(c.tc1);
    }
    //onsole.log(tsd.length);
    tsd.length=0;
    //onsole.log('Menu.removeTouchSticks '+tsd.length);
    //onsole.log(tsd);
    //...
  }
  Menu.checkGamepad=function(ps) {
    
    //if (!gamepad) {
      var gamepads=navigator.webkitGetGamepads&&navigator.webkitGetGamepads();
      if (!gamepads) gamepads=navigator.getGamepads&&navigator.getGamepads();
      gamepad=gamepads?gamepads[0]:undefined;
      //if (gamepad) console.log('Listening to '+gamepad.id+'.');
    //}
    
    if (!gamepad) return; 
    
    var tsd0=tsd[0],tsd1=tsd[1],gp=gamepad,f=1,min=0.3*f;
    tsd0.dx=gp.axes[0]*f;if (Math.abs(tsd0.dx)<min) tsd0.dx=0;
    tsd0.dy=gp.axes[1]*f;if (Math.abs(tsd0.dy)<min) tsd0.dy=0;
    tsd1.dx=gp.axes[2]*f;if (Math.abs(tsd1.dx)<min) tsd1.dx=0;
    tsd1.dy=gp.axes[3]*f;if (Math.abs(tsd1.dy)<min) tsd1.dy=0;
    //console.log(gp.axes+' ');
    return gp.buttons;
    //...
  }
  
  //--- often used menus:
  Menu.mFullscreen={s:'Fullscreen',vertCenter:1,actionf:function() {
    var c=document.body,h={navigationUI:'hide'};
    if (c.requestFullscreen) c.requestFullscreen(h);
    else if (c.mozRequestFullScreen) c.mozRequestFullScreen(h);
    else if (c.webkitRequestFullScreen) c.webkitRequestFullscreen(h);
  }
  };
  
  //Menu.setRoots=function(m) {menuroots=m;//menus=a.concat([]);}
  //Menu.setMenuroots=function(a) {menuroots=a;}
}
)(Menu);

//--
//fr o,2
//fr o,2,23
//fr o,2,24
//fr o,2,26
//fr o,2,28
//fr o,2,43
//fr o,2,44
//fr o,2,45
//fr o,2,46
//fr o,2,47
//fr o,2,48
//fr o,2,53
//fr o,2,65
//fr p,15,24
