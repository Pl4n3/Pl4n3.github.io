var Mdiv={};
(function(Mdiv) {
  //---
  Mdiv.Cont=function(px,py,pw,ph,p) {
    var md=false,cw=pw||130,ch=ph||150,xpo,ypo,mxo,myo,isResize=false,
        ww=window.innerWidth,wh=window.innerHeight,xp=ww-cw-20,yp=wh-ch-20,
        oscrollLeft,oscrollTop,otc,self=this;
    
    this.buttonClose=function(ps) {
      //...
      if (!ps) ps={};
      var cont=self.c;
      if (!ps.noClear) cont.innerHTML='';
      var c=document.createElement('button');
      //c.innerHTML='X'+(ps.text?'<br>'+ps.text:'');
      //if (ps.text) 
      c.innerHTML=ps.text||'X';
      var s=c.style;s.float='left';s.transform='rotate(90deg);';s.margin='2px';
      //s.position='absolute';s.top='2px';s.left='2px';
      c.onclick=function() {
        cont.parentNode.removeChild(cont);
        if (ps.f) ps.f();
      }
      cont.appendChild(c);
      return c;
      //...
    }
    
    
    if (!p) p={};
    if (px!==undefined) xp=px>0?px:ww-cw+px;
    if (py!==undefined) yp=py>0?py:wh-ch+py;
    p.grid=5;
    function mouseDown(e) {
      var tc=e.target;
      //console.log(tc instanceof HTMLTextAreaElement?'Yes':'No');
      oscrollLeft=tc.scrollLeft;oscrollTop=tc.scrollTop;otc=tc;
      
      var x=e.pageX,y=e.pageY;
      mxo=x;myo=y;
      if (isResize) {
        xpo=cw;ypo=ch;
      } else {
        xpo=xp;ypo=yp;
      }
      //c.innerHTML+=' .';
      md=true;
    }
    function mouseUp(e) {
      md=false;
    }
    function mouseMove(e) {
      var x=e.pageX,y=e.pageY,tc=e.target;
      if (md) if ((tc==otc)&&((oscrollLeft!=tc.scrollLeft)||(oscrollTop!=tc.scrollTop)||(tc instanceof HTMLTextAreaElement)||(tc instanceof HTMLInputElement))) md=false;//mouse on scrollbar
      if (md) {
        if (isResize) {
          cw=xpo+x-mxo;ch=ypo+y-myo;
          cw=Math.floor(cw/p.grid)*p.grid;
          ch=Math.floor(ch/p.grid)*p.grid;
          c.style.width=cw+'px';
          c.style.height=ch+'px';
        } else {
          xp=xpo+x-mxo;yp=ypo+y-myo;
          xp=Math.floor(xp/p.grid)*p.grid;
          yp=Math.floor(yp/p.grid)*p.grid;
          c.style.left=xp+'px';
          c.style.top=yp+'px';
        }
      } else {
        isResize=x-xp>cw-40&&y-yp>ch-40;
        c.style.cursor=isResize?'nw-resize':'move';
      }
    }
    function resize(e) {
      //var ch=document.body,w=ch.clientWidth,h=ch.clientHeight;
      var w=window.innerWidth,h=window.innerHeight;
      //if (xp>(w-cw)/2) { xp+=w-ww;c.style.left=xp+'px'; }
      //if (yp>(h-ch)/2) { yp+=h-wh;c.style.top=yp+'px'; }
      if (xp>(w-cw)/2) xp+=w-ww;
      if (yp>(h-ch)/2) yp+=h-wh;
      
      ww=w;wh=h;
      
      //w-=100;
      if (xp<0) { cw+=xp;xp=0; }
      if (xp+cw>w-10) { xp=w-10-cw;if (xp<0) { cw+=xp;xp=0; } }
      if (yp<0) { ch+=yp;yp=0; }
      if (yp+ch>h-10) { yp=h-10-ch;if (yp<0) { ch+=yp;yp=0; } }
      
      c.style.left=xp+'px'; 
      c.style.top=yp+'px'; 
      c.style.width=cw+'px';
      c.style.height=ch+'px';
      
      
    }
    var c=document.createElement('div');
    c.style.position='absolute';
    c.style.left=xp+'px';
    c.style.top=yp+'px';
    c.style.width=cw+'px';
    c.style.height=ch+'px';
    c.style.backgroundColor='#68c';
    c.style.fontSize='10px';
    c.style.fontFamily='Arial';
    c.style.borderStyle='solid';
    c.style.borderWidth='1px';
    c.style.cursor='move';//'nw-resize';//;
    c.style.userSelect='none';
    c.style.MozUserSelect='none';
    c.style.boxShadow='3px 3px 15px rgb(0,0,0)';
    c.style.overflow='auto';
    //c.innerHTML='<div style="padding:1px;">Mdiv</div>';
    c.addEventListener('mousedown',mouseDown,false);
    window.addEventListener('mouseup',mouseUp,false);
    window.addEventListener('mousemove',mouseMove,false);
    if (!p.ignoreWinResize) window.addEventListener('resize',resize);
    document.body.appendChild(c);
    this.c=c;
    
    //alert('Mdiv.Cont '+x);
  }
}
)(Mdiv);
console.log('Mdiv v.0.17 ');//FOLDORUPDATEVERSION

//fr o,1
//fr o,1,1
//fr o,1,1,4
//fr o,1,1,4,10
//fr p,0,50
