//------
//--- extern shapes tech form canvNotes.js
//
(function() {
  //----
  console.log('v0.169 ');//FOLDORUPDATEVERSION
  let view=cano.view,posx,posy,scx,scy,width,height,dpr,
      objs=cano.objs,
      tweens=cano.tweens,
      arrowp=[[0,-0.3],[0.7,-0.3],[0.7,-0.6],[1,0],[0.7,0.6],
       [0.7,0.3],[0,0.3]//,[0,-0.3]
      ];
  
  function arrow(ps) {
    //---
    //
    let pos0=ps.pos0,pos1=ps.pos1;
    return {arrow:1,shapes:[{t:0,r:0,g:100,b:0,a:0.4,pos0:pos0,pos1:pos0},{t:ps.t,pos1:pos0},{t:10,pos1:pos1},{t:(ps.duration||60),pos1:pos1},{t:0,pos1:pos0},{t:40,pos1:pos0}]};
    //...
  }
  
  
  function hookObj(o) {
    //---
    //o.onselect=start;
    //o.onselect();
    
    //---- expand meta/makro shapes
    //for (var obj of objs) if (obj.shapeDefs) for (let i=obj.shapeDefs.length-1;i>=0;i--) {
    //  let sd=obj.shapeDefs[i];
    //  console.log(sd);
    //}
    
    //---- shape script
    for (var obj of objs) if (obj.shapeScript) {
      let s=obj.shapeScript.join('\n');
      //onsole.log('shapeScript='+s);
      try { 
      eval(s);
      } catch (e) { console.error(e); }
    }
    
    
    
    o.intern.unHook=function() {
      //---
      //delete(o.onselect);
      //...
    }
    //...
  }
  
  function path(ct,sp) {
    //---
    let start=undefined,ps=sp.points;
    for (let i=0;i<ps.length;i++) {
      let pi=ps[i],x=pi[0],y=pi[1];
      x=width/2+(x+posx+(sp.x||0))*dpr*scx;
      y=height/2+(y+posy+(sp.y||0))*dpr*scy;
      if ((i==0)||(pi.length==3)) {
        if (start) ct.lineTo(start[0],start[1]);
        ct.moveTo(x,y); 
        start=[x,y];
      } else 
        ct.lineTo(x,y);
    }
    if (start) ct.lineTo(start[0],start[1]);
    //...
  }
  
  cano.handlerAdd('draw0',function(dt,ct) {
    //----
    
    posx=view.posx,posy=view.posy,scx=view.scx,scy=view.scy;
    width=view.width;height=view.height;dpr=view.dpr;
    
    for (var obj of objs) if (obj.shapeDefs) {
      if (!obj.intern.shapeDefs) {
        //---remove tweens
        for (var i=tweens.length-1;i>=0;i--) {
          var tw=tweens[i];
          if (tw.mtime) { console.log('removing tween');tweens.splice(i,1); }
        }
        obj.intern.shapeDefs=JSON.parse(JSON.stringify(obj.shapeDefs));
        let vars={};
        //for (var sd of obj.intern.shapeDefs) {
        for (let si=0;si<obj.intern.shapeDefs.length;si++) {
          let sd=obj.intern.shapeDefs[si];
          if (sd.imgText2) {
    /* expand imgText2 */ {
      //---
      //onsole.log('expand nao');
      let sdimg={img:1,shapes:[]},
          sdtext0={text:1,shapes:[]},
          sdtext1={text:1,shapes:[]},
          w=sd.w||20;
      for (let i=0;i<sd.shapes.length;i++) {
        let sp=sd.shapes[i];
        let spi=Conet.hcopy(sp,undefined,undefined,{show:1}),//{t:sp.t,pos:sp.pos};
            spt0=Conet.hcopy(sp,undefined,undefined,{show:1}),
            spt1=Conet.hcopy(sp,undefined,undefined,{show:1});
        if (i==0) { 
          spi.fn=sd.imgfn; 
          spt0.text=sd.text0;spt0.r=0;spt0.g=0;spt0.b=0;spt0.a=0.7;
          spt1.text=sd.text1;spt1.r=0;spt1.g=0;spt1.b=0;spt1.a=0.7;spt1.bold=1;
        }
        if (sp.show===0) { 
          spi.w=0;spi.h=0; 
          spt0.fs=0;
          spt1.fs=0;
        }
        if (sp.show===1) { 
          if (spi.w===undefined) spi.w=w;
          if (spi.h===undefined) spi.h=w; 
          spt0.fs=sd.fs0||2;
          spt1.fs=sd.fs1||3;
        }
        if (spt0.pos) spt0.y=-w/2;
        if (spt1.pos) spt1.y=-w/2-2.5;
        sdimg.shapes.push(spi);
        sdtext0.shapes.push(spt0);
        sdtext1.shapes.push(spt1);
      }
      obj.intern.shapeDefs.push(sdimg);
      obj.intern.shapeDefs.push(sdtext0);
      obj.intern.shapeDefs.push(sdtext1);
      //onsole.log(sdtext0);
      //...
    }
            obj.intern.shapeDefs.splice(si,1);
            si--;
            continue;
          }
          if (sd.id) vars[sd.id]=sd;
          let prevsp=undefined,t=0;
          if (sd.shapes)
          for (var sp of sd.shapes) {
            if (sp.pos) { let p=vars[sp.pos],f=sd.view?-1:1;sp.x=(sp.x||0)+f*p.x;sp.y=(sp.y||0)+f*p.y; }
            if (sp.pos0) { var p=vars[sp.pos0];sp.x0=(sp.x0||0)+p.x;sp.y0=(sp.y0||0)+p.y; }
            if (sp.pos1) { var p=vars[sp.pos1];sp.x1=(sp.x1||0)+p.x;sp.y1=(sp.y1||0)+p.y; }
            if (prevsp) {
            
              //--- initially the plan was to fill up all missing key-values
              // for simple transitions (dont have to check if key is there),
              // but now using tweens, initially only for changing values but
              // then render for random times doesnt work, this needs also tweens
              // for fix values. thus tweens are now made for defined values,
              // without fillup (fillup would just add unnessary fix tweens)
            
              //for (var k of Object.keys(prevsp)) {
              for (var k of Object.keys(sp)) {
                var v=sp[k],pv=prevsp[k];
                //if (v===undefined) sp[k]=pv;
                //else if ((v!=pv)&&(k!='t')) {
                if ((v!==undefined)&&(pv!==undefined)&&(k!='t')) {
                  //console.log('add tween k='+k+' '+pv+' '+v);
                  var tw={mtime:1,o:sd.currentShape,k:k,v0:pv,v1:v,
                    //t:prevsp.t,mt:sp.t
                    t:t,mt:t+sp.t
                  };
                  if (!sp.spring) tw.linear=1;
                  tweens.push(tw);
                  //onsole.log('add tween k='+k+' '+pv+' '+v);
                  //onsole.log(tw);
                }
              }
            } else {
              if (sp.t===undefined) sp.t=0;
              sd.currentShape=JSON.parse(JSON.stringify(sp));
            }
            t+=sp.t;
            prevsp=sp;
          }
          if (t>cano.mtime.range.max) {
            cano.mtime.range.max=t;
            console.log('mtime.max='+t);
          }
        }
        console.log('created intern.shapeDefs');
        //onsole.log(vars);
        //onsole.log(obj.intern.shapeDefs);
      }
      for (var sd of obj.intern.shapeDefs) {
        var sp=sd.currentShape;//shapes[0];//--- next sp generated via mtime
        if (!sp) { //console.log('no currentShape '+sd.isPoly);console.log(sd);
          continue; }
        //onsole.log(sd);
        ct.fillStyle='rgba('+(sp.r||0)+','+(sp.g||0)+','+(sp.b||0)+','+(sp.a||0.5)+')';
        if (sd.isArrow||sd.arrow) {
          //ct.strokeStyle='rgba(0,0,0,0.5)';
          //ct.beginPath();
          //ct.moveTo(width/2+(sp.x0+posx)*dpr*scx,height/2+(sp.y0+posy)*dpr*scy);
          //ct.lineTo(width/2+(sp.x1+posx)*dpr*scx,height/2+(sp.y1+posy)*dpr*scy);
          //ct.stroke();
        
          var dx=sp.x1-sp.x0,dy=sp.y1-sp.y0,len=Math.sqrt(dx*dx+dy*dy);
          var a=Math.atan2(dy,dx),sin=Math.sin(a),cos=Math.cos(a);
        
          ct.beginPath();
          //ct.lineWidth=dpr*scx;
          for (var i=0;i<arrowp.length;i++) {
            var x=arrowp[i][0],y=arrowp[i][1];
            x*=len;y*=10;
            var x1=x*cos-y*sin,y1=x*sin+y*cos;
            x=x1;y=y1;
            x=width /2+(sp.x0+x+posx)*dpr*scx;
            y=height/2+(sp.y0+y+posy)*dpr*scy;
            if (i==0) ct.moveTo(x,y); else ct.lineTo(x,y);
          }
          ct.fill();
          //ct.stroke();
        }
        if (sd.isText||sd.text) {
          let x=width /2+(sp.x+posx)*dpr*scx,
              y=height/2+(sp.y+posy)*dpr*scy,
              h=(sp.fs*dpr*scx);
          ct.font=(sp.bold?'bold ':'')+//'bold '+
            h+'px sans-serif';
          
          let m=ct.measureText(sp.text),
              fist=ct.fillStyle;
          ct.fillStyle='rgba(200,200,200,0.5)';
          ct.fillRect(x-m.width/2,y-h*0.55,m.width,h);
          ct.fillStyle=fist;
          
          ct.textAlign='center';
          ct.textBaseline='middle';
          ct.fillText(sp.text,x,y);
        }
        if (sd.poly) {
          //onsole.log('isPoly');
          //let ps=sp.points;
          ct.beginPath();
          //ct.fillStyle='rgba(50,150,0,0.5)';
          path(ct,sp);//.points);
          //for (let i=0;i<ps.length;i++) {
          //  let pi=ps[i],x=pi[0],y=pi[1];
          //  x=width/2+(x+posx)*dpr*scx;
          //  y=height/2+(y+posy)*dpr*scy;
          //  if ((i==0)||(pi.length==3)) ct.moveTo(x,y); else ct.lineTo(x,y);
          //}
          ct.fill();
          ct.lineWidth=1*dpr*scx;
          ct.strokeStyle='rgba(0,0,0,0.5)';
          ct.stroke();
        }
        if (sd.groupStart) {
          //onsole.log('groupStart '+sp.x);
          ct.save();
         
          if (sp.clipPoints) { 
            ct.beginPath();
            path(ct,sp);//was path(ct,sp.points), not testet with x,y offset
            ct.clip(); 
          }
          
          ct.translate(sp.x*dpr*scx,sp.y*dpr*scy);
          ////if (sp.clipPoints) { ct.beginPath();path(ct,sp.clipPoints);ct.clip(); }
    
          let cx=width/2 +((sp.centerx||0)+posx)*dpr*scx,
              cy=height/2+((sp.centery||0)+posy)*dpr*scy;
          ct.translate(cx,cy);
          ////if (sp.clipPoints) { ct.beginPath();path(ct,sp.clipPoints);ct.clip(); }
    
          ct.scale(sp.scx,sp.scy);
          ct.translate(-cx,-cy);
    
          ////if (sp.clipPoints) { ct.beginPath();path(ct,sp.clipPoints);ct.clip(); }
    
          ////ct.translate(sp.x*dpr*scx,sp.y*dpr*scy);
        }
        if (sd.groupEnd) {
          //onsole.log('groupEnd');
          ct.restore();
        }
        if (sd.img) {
          if (!sd._img) {
            sd._img=new Image();
    Conet.download({fn:sp.fn,sd:sd,f:function(v) {
      //---
      //onsole.log(JSON.parse(v));
      this.sd._img.src=JSON.parse(v).data;
      //onsole.log('img loaded');
      //...
    }
            });
          }
          let x=width /2+(sp.x+posx)*dpr*scx,
              y=height/2+(sp.y+posy)*dpr*scy,
              w=sp.w*dpr*scx,
              h=sp.h*dpr*scy;
          //try {
          ct.drawImage(sd._img,x-w/2,y-h/2,w,h);    
          //} catch (e) {}
          //onsole.log('draw img.');
        }
        if (sd.view) {
          if (sp.x) view.posx=sp.x;
          if (sp.y) view.posy=sp.y;
          if (sp.scx) view.scx=sp.scx;
          if (sp.scy) view.scy=sp.scy;
        }
      }
    }
    ct.textAlign='start';
    ct.textBaseline='alphabetic';
    
    
    //...
  }
  );
  
  
  cano.addScriptHook(hookObj);
  //...
}
)();
//...
//fr o,3
//fr o,3,9
//fr o,3,12
//fr o,3,12,21
//fr o,3,14
//fr o,3,16
//fr o,3,16,168
//fr p,94,98
