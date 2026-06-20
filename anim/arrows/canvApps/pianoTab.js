//---fold nodes
//---
(function() {
  //----
  console.log('cano.pianoTab.js v0.123 ');//FOLDORUPDATEVERSION
  let view=cano.view;
  
  function fsRect(ct,x,y,w,h) {
    ct.fillRect(x,y,w,h);
    ct.strokeRect(x,y,w,h);
    //...
  }
  
  function hookObj(o) {
    //---
    let objs=cano.objs,
        r={x:30,y:0,w:200,h:200},tw=4,th=tw,//,grid=[],
        playing=0,py=0;
        
    cano.audioQueuesStay=1;
    
    o.onUp=function() {
      //---
      //onsole.log('sddfs');
      playing=!playing;
      //...
    }
    
    cano.handlerAdd('draw0',function(dt,ct) {
      //----
      
      let f=view.scx*view.dpr;
      ct.lineWidth=0.1*f;
      let p0=o.intern;
      
      ct.fillStyle='rgba(250,250,250,0.5)';
      //ct.fillRect(p0.x+r.x*f,p0.y+r.y*f,r.w*f,r.h*f);
      
      ct.strokeStyle='rgba(0,0,0,0.5)';
      //ct.strokeRect(p0.x+r.x*f,p0.y+r.y*f,r.w*f,r.h*f);
      fsRect(ct,p0.x+r.x*f,p0.y+r.y*f,r.w*f,r.h*f);
      
      let c=r.w/tw;
      for (let i=0;i<c;i++) {
        let i0=i%12;
        ct.fillStyle=((i0==1)||(i0==3)||(i0==6)||(i0==8)||(i0==10))
         ?'rgba(0,0,0,0.5)':'rgba(250,250,250,0.5)';
        fsRect(ct,p0.x+r.x*f+i*tw*f,p0.y+r.y*f,tw*f,r.h*f);
      }
      
      c=r.h/th;
      for (let i=0;i<c;i++) {
        ct.strokeStyle=(i%4==0)?'#000':'rgba(0,0,0,0.2)';
        ct.lineWidth=(i%16==0?0.5:(i%8==0?0.25:0.1))*f;
        ct.beginPath();
        ct.moveTo(p0.x+r.x*f      ,p0.y+r.y*f+i*th*f);
        ct.lineTo(p0.x+r.x*f+r.w*f,p0.y+r.y*f+i*th*f);
        ct.stroke();
      }
      
      ct.lineWidth=0.1*f;
      
      
      if (playing&&cano.onUp) {
        let py1=py+dt*0.01;
        let y0=Math.floor(py/th),
            y1=Math.floor(py1/th);
        for (let y=y0;y<=y1;y++) {
          if ((y*th)<py) continue;
          //onsole.log('play '+y);
          
          for (let oh of cano.objs) {
            //onsole.log(oh);
            let yh=Math.floor((oh.y-o.y)/th),
                xh=Math.floor((oh.x-o.x-r.x)/tw);
            if ((xh<0)||(yh!=y)) continue;
            //onsole.log(xh+' '+yh);
            cano.onUp(oh);
          }
          
          //if (!grid[y]) continue;
          //for (let n of grid[y]) if (n) cano.onUp(n);//console.log(n);
        }
        if (py1>r.h) py1=0;
        py=py1;
      }
      
      ct.fillStyle='rgba(0,0,0,0.3)';
      ct.fillRect(p0.x+r.x*f,p0.y+r.y*f,r.w*f,py*f)
      
      
      //ct.beginPath();
      //ct.moveTo(p0.x,p0.y);
      //ct.lineTo(p0.x+200*f,p0.y+30*f);
      //ct.stroke();
      
      //onsole.log(c);
      //...
    }
    );
    
    let wasChange=false;
    cano.handlerAdd('change',function(oc) {
      //---
      wasChange=true;
      //...
    }
    );
    
    cano.handlerAdd('click',function(e,oc) {
      //---
      if (wasChange) {
        wasChange=false;
        console.log('wasChange -> skip click.');
        return;
      }
      //onsole.log('click');
      //console.log(oc);
      //onsole.log(e);
      let f=view.scx*view.dpr,p0=o.intern;
      let x=Math.floor((e.x-p0.x-r.x*f)/(tw*f));
      let y=Math.floor((e.y-p0.y-r.y*f)/(th*f));
      if ((x<0)||(y<0)||(x>=(r.w/tw))||(y>=(r.h/th))) return;
      //onsole.log(x+' '+y);
      //onsole.log(o);
      let og=oc;//grid[y]&&grid[y][x];
      
      py=y*th;
      if (og) { 
        //cano.delObj(og);
        //delete(grid[y][x]);
        return; 
      }
      
      //if (!grid[y]) grid[y]=[];
      let on=cano.add({
        x:o.x+r.x+x*tw,
        y:o.y+r.y+y*th,
        w:tw,
        h:th,
        sa:['{"pitch":['+(x%12)+','+(Math.floor(x/12)+3)+'],','"preset":"gp"}'],
        bgcol:'rgba(0,250,0,0.5)',
        //noserialize:1,
        //selectable:0,
        dontmove:1,
      });
      //grid[y][x]=on;
      cano.onUp(on);
      //py=y*th;
      //...
    }
    );
    
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
//fr o,2
//fr o,2,4
//fr o,2,6
//fr o,2,6,7
//fr o,2,6,9
//fr o,2,6,13
//fr o,2,6,16
//fr o,2,6,19
//fr p,39,53
