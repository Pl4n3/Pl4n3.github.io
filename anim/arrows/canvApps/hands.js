//------
(function() {
  //----
  console.log('v0.90 ');//FOLDORUPDATEVERSION
  let view=cano.view;
  
  function hookObj(o) {
    //---
    let p0s=[{x:100,y:100},{x:300,y:100}],pointAt=[
      [undefined,undefined,undefined,undefined,undefined],
      [undefined,undefined,undefined,undefined,undefined]
    ];
    
    function drawHands(ct,outline) {
      //---
      
      //rp.x=o.intern.x;
      //rp.y=o.intern.y;
      let f=0.2*view.scx*view.dpr,bo=outline?3*f:0,fw=20*f,fd=10*f,fl=10*f;
      
      for (let hi=0;hi<2;hi++) {
      
      let hi0=(hi==0);
      let col=outline?'black':(!hi0?'yellow':'orange');
      ct.fillStyle=col;
      ct.strokeStyle=col;
      
      let c=0,x=0,y=0,pa=pointAt[hi],p0=p0s[hi];
      for (let i=pa.length-1;i>=0;i--) {
        let p=pa[i];
        if (p===undefined) continue;
        c++;
        x+=p.o.intern.x-(i/4-0.5)*(hi0?(fw*5+fd*3):(fw*5+fd*3));
        y+=p.o.intern.y;
      }
      
      if (c>0) {
        x/=c;y/=c;
        p0.x=x-(hi0?fw*4:0);//-fw*2-fd*1.5;
        p0.y=y+80*f;
      }
      
      ct.fillRect(p0.x-bo,p0.y-bo,fw*4+fd*3+bo*2,fw*2.5+bo*2);
      ct.lineWidth=fw+bo*2;
      ct.lineCap='round';
      ct.beginPath();
      for (let i=0;i<4;i++) {
        let x=i*(fw+fd)+fw/2;
        ct.moveTo(p0.x+x,p0.y);
        let h=hi0?pa[i]:pa[i+1];
        if (h) {
          let p=h.o.intern;
          ct.lineTo(p.x+fw/2,p.y+fw/2);
        } else 
          ct.lineTo(p0.x+x,p0.y-fl);
      }
      ct.moveTo(hi0?p0.x+fw*4+fd*3+fw:p0.x-fw,p0.y+fw*2);
      let h=hi0?pa[4]:pa[0];
      if (h) {
        let p=h.o.intern;
        ct.lineTo(p.x+fw/2,p.y+fw/2);
      } else 
        ct.lineTo(hi0?p0.x+fw*4+fd*3+fw+fd:p0.x-fw-fd,p0.y+fw*2-fl);
      ct.stroke();
      
      }
      //...
    }
    
    cano.handlerAdd('draw0',function(dt,ct) {
      //----
      for (let pa of pointAt) for (let i=pa.length-1;i>=0;i--) {
        let p=pa[i];
        if (p===undefined) continue;
        p.t+=dt;if (p.t>300) pa[i]=undefined;
      }
      
      drawHands(ct,1);
      drawHands(ct,0);
      //onsole.log('x');
      //...
    }
    );
    
    window.canoHands=function(v,o0) {
      //---
      pointAt[v[0]][v[1]]={o:o0,t:0};
      //onsole.log('canoHands got '+v);
      //...
    }
    
    o.intern.unHook=function() {
      //---
      //delete(o.onselect);
      //...
    }
    
    
    
    
    //...
  }
  
  cano.addScriptHook(hookObj);
  //...
}
)();
//...
//fr o,1
//fr o,1,4
//fr o,1,4,6
//fr o,1,4,8
//fr o,1,4,11
//fr o,1,4,13
//fr p,43,32
