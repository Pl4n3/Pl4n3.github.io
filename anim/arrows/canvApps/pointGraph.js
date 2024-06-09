//------
(function() {
  //----
  console.log('v0.470 ');//FOLDORUPDATEVERSION
  let view=cano.view;
  cano.selCount=1000;
  
  function hookObj(o) {
    //---
    let c0,c1,menu,colh={},cola=[];
    //onsole.log(o);
    let emsg='Not initialized, missing children.';
    if (!o.children) { console.log(emsg);return; }
    c0=o.children[0];
    if (!c0) { console.log(emsg);return; }
    c1=c0.children[0];
    if (!c1) { console.log(emsg);return; }
    let svg=o.pointGraph?.svg,
        sound=o.pointGraph?.sound,
        timer=o.pointGraph?.timer,
        duration=o.pointGraph?.duration||1500,
        time=0,tcount=0,timerRunning=false,timerx,
        timerRecorded=false,timerRange;//,timerRecording=false;
    //onsole.log(c0);
    //onsole.log(c1);
    
    function f4(v) {
      return Math.floor(0.5+v*10000)/10000;//...
    }
    
    function searchSVG(o) {
      //...
      for (const a of cola) {
        const i=a.indexOf(o);
        if (i!=-1) {
          //onsole.log('found '+i);
          const a0=a[0];
          if (!a0.edges) return;
          const p2=a0.edges[0].p2;
          if (!p2.pointGraph) return;
          if (!p2.pointGraph.svg) return;
          return p2;
          ////onsole.log('svg');
          ////onsole.log(p2);
          //let pg=o.pointGraph;
          //if (!pg) pg=o.pointGraph={};
          //if (!pg.points) {
          //  Conet.log('Setting pg.points.');
          //  pg.points=[[1,2],[3,4]];
          //}
        }
      }
      //---
    }
    
    //if (!cano.draw0s) cano.draw0s=[];
    function draw0(dt,ct) {
      //----
      //f (svg) console.log('draw0');
      ct.strokeStyle='rgba(250,250,250,0.5)';
      ct.lineWidth=0.5*view.scx*view.dpr;
      let p0=o.intern,p1=c1.intern;
      ct.beginPath();
      ct.moveTo(p0.x,p0.y);
      ct.lineTo(p1.x,p0.y);
      ct.lineTo(p1.x,p1.y);
      ct.stroke();
      
      let w=p1.x-p0.x,h=p1.y-p0.y,b=Math.min(w,h)/10;
      //onsole.log(w+' '+h);
      ct.strokeStyle='rgba(250,250,250,0.5)';
      ct.lineWidth=0.25*view.scx*view.dpr;
      ct.strokeRect(p0.x+b,p0.y+b,w-2*b,h-2*b);
      
      if (timer&&timerRange) {
        ct.strokeStyle='white';
        ct.beginPath();
        let p=timerRange[0].intern;
        ct.moveTo(p.x,p0.y);
        ct.lineTo(p.x,p1.y);
        p=timerRange[1].intern;
        ct.moveTo(p.x,p0.y);
        ct.lineTo(p.x,p1.y);
        ct.stroke();
      }
      
      if (timer&&timerRunning) /* timerdraw */ {
        //if (tcount<2) 
        time+=dt;
        let x=time*w/duration;
        let end=x>w;
        if (timerRange&&!end) end=(p0.x+x)>timerRange[1].intern.x;
        if (end) {
          tcount++;
          if (timerRange) time=duration*(timerRange[0].intern.x-p0.x)/w;
          else time=0;
          x=time*w/duration;
          if (timerRecorded) {
            timerRecorded=false;
            //timerRecording=false;
            scanPoints();
          }
          for (let a of cola) { 
            //onsole.log('setting a._i=undefined;');
            a._i=undefined; }
        }
        if (0&&timerRange) {
          ct.strokeStyle='white';
          ct.beginPath();
          let p=timerRange[0].intern;
          ct.moveTo(p.x,p0.y);
          ct.lineTo(p.x,p1.y);
          ct.stroke();
        }
        ct.strokeStyle='black';
        ct.beginPath();
        ct.moveTo(p0.x+x,p0.y);
        ct.lineTo(p0.x+x,p1.y);
        ct.stroke();
        timerx=p0.x+x;
        for (let a of cola) {
          let first=false;
          if (a._i===undefined) {
            a._i=-1;first=true;
            //onsole.log('a._i:=-1;');
          }
          while (true) {
            let i=a._i+1;
            //onsole.log(i);
            if (i==a.length) { 
              //console.log('i='+i+'==a.len='+a.length);
              break; }
            let p=a[i].intern;
            //onsole.log(p.x+' '+(p0.x+x)+' i='+i+' a.len='+a.length);
            //if (!p) break;//happens during record
            if (p.x>p0.x+x) { break; }
            a._i=i;
            //onsole.log('dosound '+i+' '+time);
            if (first) continue;
            let a0=a[0];
            //if (a0.intern.control) {
            //  a0=a0.intern.control;
            //}
            //else if (a0.children) a0=a0.children[0];
            if (!a0.edges) { //---find controlnode via color
              let o1=o.children[1];
              if (o1&&o1.children) {
                for (let oh of o1.children) {
                  if (oh.bgcol==a0.bgcol) { 
                    //onsole.log('setting a0.intern.control');
                    a0.intern.control=oh;break; 
                  }
                }
                //onsole.log(o1);
              }
            }
            if (a0.intern.control) {
              a0=a0.intern.control;
              let childh=a0.intern.childh;
              if (childh&&childh.mute&&(childh.mute.bgcol=='#fff')) continue;
            }
            if (a0.edges) {
              let p2=a0.edges[0].p2;
              if (p2.children) {//--- s==' '
                //onsole.log(p2.children);
                let s=a[i].s+'',ni;
                if (s.startsWith('{')) {
                  //onsole.log(s);
                  let h=JSON.parse(s);
                  ni=h.i;
                  if (h.hand&&window.canoHands) canoHands(h.hand,p2.children[ni]);
                } else
                  ni=parseInt(s);
                p2=p2.children[ni];
              } 
              p2.timered=true;
              if (p2.onUp) p2.onUp();
              if (cano.onUp) cano.onUp(p2);
              p2.timered=false;
            }
          }
        }
      }
      
      
      //for (let a of Object.values(colh)) {
      //for (let k of Object.keys(colh)) {
      //  let a=colh[k];
      let i=-1;
      for (let a of cola) {
        const p0=a[0],pg=p0.pointGraph,polygon=pg&&pg.polygon,
              cubic=pg&&pg.cubic&&((a.length-1)%3==0),
              fill=polygon||cubic;
        let k=p0.bgcol;
        let p=p0.intern;
        ct.fillStyle='#000';
        ct.textBaseline='bottom';i++;
        let sh=i+(svg?'':' '+((o.pointGraph.names?o.pointGraph.names[k]:undefined)||k));
        ct.fillText(sh,p.x,p.y);
        if (fill) 
          ct.fillStyle=p0.bgcol; 
        else {
          ct.strokeStyle=p0.bgcol;
          ct.lineWidth=0.5*view.scx*view.dpr;
        }
        ct.beginPath();
        ct.moveTo(p.x+p.w/2,p.y+p.h/2);
        if (cubic) for (let i=1;i<a.length;i++) {
          let p1=a[i].intern;i++;
          let p2=a[i].intern;i++;
          let p=a[i].intern;
          ct.bezierCurveTo(p1.x+p1.w/2,p1.y+p1.h/2,  p2.x+p2.w/2,p2.y+p2.h/2,  p.x+p.w/2,p.y+p.h/2);
        }
        else
        for (let i=1;i<a.length;i++) {
          let p=a[i].intern;
          ct.lineTo(p.x+p.w/2,p.y+p.h/2);
        }
        if (fill) ct.fill();
        if (!fill||(pg&&pg.stroke)) {
          if (pg&&pg.stroke) ct.strokeStyle=pg.stroke;
          ct.stroke();
        }
      }
      //onsole.log(c1.x+' '+c1.y);
      //onsole.log(view);
      //...
    }
    function onselect() {
      //---nur bei timer
      //onsole.log(this);
      const o=this;
      const p2=searchSVG(o);
      if (p2) {
      //for (const a of cola) {
      //  const i=a.indexOf(o);
      //  if (i!=-1) {
      //    //onsole.log('found '+i);
      //    const a0=a[0];
      //    if (!a0.edges) return;
      //    const p2=a0.edges[0].p2;
      //    if (!p2.pointGraph) return;
      //    if (!p2.pointGraph.svg) return;
      //    //onsole.log('svg');
      //    //onsole.log(p2);
          let pg=o.pointGraph;
          if (!pg) pg=o.pointGraph={};
          if (!pg.points) {
            Conet.log('Setting pg.points.');
            pg.points=[[1,2],[3,4]];
          }
      //  }
      }
      //...
    }
    function scanPoints() {
      //---
      colh={};cola=[];timerRange=undefined;
      for (let p of cano.objs) {
        if (!((p.x>o.x)&&(p.x<c1.x)&&(p.y>o.y)&&(p.y<c1.y))) continue;
        //c++;
        let a=colh[p.bgcol];
        if (!a) { 
          a=[];colh[p.bgcol]=a;cola.push(a); 
          if (timer&&(p.s=='start')) { 
            timerRange=a;
            //console.log('timerRange set'); 
          }
        }
        a.push(p);
        if (timer) p.onselect=onselect;
      }
      //onsole.log(c+' points found. '+Object.values(colh).length);
      if (svg) {
        if (menu.c) 
          menu.ondraw();//menu.c.innerHTML=toSVG();
          // '<svg height="210" width="500">'+
          // '<polygon points="40,10 90,190 0,210" style="fill:lime;stroke:purple;stroke-width:1" />'+
          // '</svg>';
      }
      o.intern.cola=cola;
      o.intern.scanPoints=scanPoints;
      //if (sound) toSound();
      //...
    }
    function toSVG(ps) {
      //---
      if (!ps) ps={};
      //onsole.log('toSVG');
      //onsole.trace();
      let p0=o,p1=c1;
      let w=p1.x-p0.x,h=p1.y-p0.y,b=(ps.noBorders?0:Math.min(w,h)/10);
      let s='<svg height="'+f4(h-b-b)+'" width="'+f4(w-b-b)+'">\n';
      //for (let k of Object.keys(colh)) { let a=colh[k];
      for (let a of cola) {
        const a0=a[0];
        //let k=a0.bgcol;
        const pg=a0.pointGraph||{};
        if (pg.cubic&&(((a.length-1)%3)==0)) {
          s+='<path d="';
          for (let i=0;i<a.length;i++) {
            let p=a[i],x=f4(p.x+p.w/2-p0.x-b),y=f4(p.y+p.h/2-p0.y-b);
            if (i==0) s+='M '+x+' '+y;
            else {
              s+=' C '+x+' '+y;
              i++;p=a[i];x=f4(p.x+p.w/2-p0.x-b);y=f4(p.y+p.h/2-p0.y-b);
              s+=', '+x+' '+y;
              i++;p=a[i];x=f4(p.x+p.w/2-p0.x-b);y=f4(p.y+p.h/2-p0.y-b);
              s+=', '+x+' '+y;
            }
          }
        } else {
          s+='<'+(pg.polygon?'polygon':'polyline')+' points="';
          for (let i=0;i<a.length;i++) {
            let p=a[i];
            s+=(i==0?'':' ')+f4(p.x+p.w/2-p0.x-b)+','+f4(p.y+p.h/2-p0.y-b);
          }
        }
        s+='"';
        //s+=' style="fill:'+k+';"';//k==a0.bgcol
        s+=' fill="'+a0.bgcol+'"';
        if (pg.stroke) s+=' stroke="'+pg.stroke+'"';
        s+='/>\n';
      }
      s+='</svg>\n';
      return s;
      //...
    }
    function toSound() {
      //---
      //onsole.log('Sound nao.');
      let p0=o,p1=c1;
      let w=p1.x-p0.x,h=p1.y-p0.y,b=Math.min(w,h)/10;
      let fa=[],ga=[];
      for (let i=0;i<cola.length;i++) { for (let p of cola[i]) {
        let x=5*(p.x+p.w/2-p0.x-b);if (x<0) x=0;
        let y=1-(p.y+p.h/2-p0.y-b)/(h-b-b);if (y<0) y=0;if (y>1) y=1;
        if (i==0)
          ga.push([y*y*y,x]);
        else
          fa.push([4000*y,x]);
        //onsole.log(x+' '+y);
      }}
      //console.log(JSON.stringify(fa));
      //console.log(JSON.stringify(ga));
      let bh;
      Conet.beep(bh={
        time:Math.max(fa[fa.length-1][1],ga[ga.length-1][1]),
        freqAtTime:fa,
        gainAtTime:ga,
      });
      //onsole.log(JSON.stringify(bh,undefined,' '));
      //...
    }
    
    //--- menuinit
    if (svg)/* */ {
      Menu.remove();
      let ma=Menu.roots,menus=Menu.getMenus();
      let lineOrder;
      ma.push(menu={s:'SVG',ms:'pointGraph',ondraw:function() {
        this.c.innerHTML=toSVG();
      }
      ,sub:[
      {s:'Export..',vertCenter:1,doctrl:'SVG',ta:1,valuef:function() {
        //---
        let ret=toSVG({noBorders:1});
        for (const co of cano.objs) {
          if (!co.edges) continue;
          console.log(co.edges);
          for (const e of co.edges) {
            if (e.p2===o) {
              console.log('ref to this');
              for (const co0 of cano.objs) {
                let cola0=co0.intern.cola;
                if (!cola0) continue;
                if (cola0===cola) continue;
                //onsole.log(cola0);
                for (const p of cola0[0]) {
                  ret+=JSON.stringify(p.pointGraph.points)+'\n';
                }
              }
            }
          }
        }
        //ret+='[1,2,3]';
        return ret;
        //...
      }
        },
      {s:'LineOrder',vertCenter:1,doctrl:'LineOrder',valuef:function() {
        //---
        let sels=cano.sels;
        if (sels.length==0) { Conet.log('First select a point.');return; }
        let sel0=sels[0],il=-1;
        for (let i=0;i<cola.length;i++) {
          let a=cola[i];
          if (a.indexOf(sel0)!=-1) { il=i;break; }
        }
        this.doctrl='LineOrder, currently '+il+' in 0-'+(cola.length-1);
        //onsole.log(il);
        lineOrder=il;
        return il;
        //...
      }
      ,setfunc:function(v) {
        //...
        let v0=lineOrder,v1=v,objs=cano.objs;
        if ((v0==v1)||(v1<0)||(v1>=cola.length)) return;
        let a0=cola[v0],o0=a0[0];//i0=objs.indexOf(o0);
        let a1=cola[v1],o1=a1[0],i1=objs.indexOf(o1);
        for (let i=0;i<a0.length;i++) {
          let o=a0[i];
          cano.objs.splice(objs.indexOf(o),1);
          cano.objs.splice(i1+i,0,o);
        }
        scanPoints();
        Conet.log('nao set '+v+' from '+lineOrder);
        //---
      }
      }
      ]});
      Menu.roots=ma;
      if (ma[0]===menus[0]) Menu.setMenus(ma);
      Menu.draw();
      //onsole.log(menu);
    }
    if (sound)/* */ {
      //---
      o.onUp=toSound;
      
      //Menu.remove();
      //let ma=Menu.roots,menus=Menu.getMenus();
      //let lineOrder;
      //ma.push(menu={s:'Sound',ms:'pointGraph',actionf:toSound});
      //Menu.roots=ma;
      //if (ma[0]===menus[0]) Menu.setMenus(ma);
      //Menu.draw();
      //...
    }
    if (timer)/* */ {
      o.onUp=function() {
        //---
        timerRunning=!timerRunning;
        if (timerRunning&&timerRange) {
          let p0=o.intern,p1=c1.intern;
          let w=p1.x-p0.x;  
          let t=duration*(timerRange[0].intern.x-p0.x)/w;
          if (time<t) time=t;
        }
        //...
      }
      
      if (o.children.length>1) {
        //---
        const o1=o.children[1];
        if (o1.pointGraph&&o1.pointGraph.copyFromSVG) {
      
      o1.onUp=function() {
        //---
        //onet.log('copy from svg');
        const sels=cano.sels;
        let p2,s0;
        if (!((sels.length>0)&&(p2=searchSVG(s0=sels[0])))) {
          Conet.log('No points found, first select point with points.');
          return;
        }
        
        let cola2=p2.intern.cola;
        let points=[];s0.pointGraph.points=points;
        for (let a2 of cola2) {
          let a=[];
          for (let p of a2) a.push([p.x+p.w/2-p2.x,p.y+p.h/2-p2.y]);
          points.push(a);
        }
        Conet.log('Points from svg copied.');
        //...
      }
      o.children[2].onUp=function() {
        //---
        //onet.log('copy to svg');
        const sels=cano.sels;
        let p2,s0;
        if (!((sels.length>0)&&(p2=searchSVG(s0=sels[0])))) {
          Conet.log('No points found, first select point with points.');
          return;
        }
        
        let cola2=p2.intern.cola;
        let points=s0.pointGraph.points;
        for (let i=0;i<points.length;i++) {
          let a2=cola2[i],a=points[i];
          for (let j=0;j<a.length;j++) {
            let p=a2[j],aj=a[j];
            p.x=aj[0]-p.w/2+p2.x;
            p.y=aj[1]-p.h/2+p2.y;
          }
        }
        p2.intern.scanPoints();
        Conet.log('Points to svg copied.');
        //...
      }
      
        } else {
        cano.audioQueuesStay=1;
        const orec=o1;
        if (orec.children)
        for (let oh of orec.children) 
      (function() {
        //---
        
        const o1=oh;//orec.children[0],
        let edge=undefined,p2=undefined;
        if (o1.edges&&o1.edges.length>0) { edge=o1.edges[0];p2=edge.p2; }
        //onsole.log(o1);
        //o1.intern.recorded=[];
        o1.intern.childh={};
        
        if (o1.children)
        for (let o2 of o1.children) {
          o1.intern.childh[o2.s]=o2;
          //if (o2.s=='del')
        o2.onUp=function() {
          //---
          //if (1) return;
          if ((this.s=='mute')||(this.s=='rec')) {
            this.bgcol=this.bgcol=='#fff'?'#ccc':'#fff';
          }
          if (this.s=='del') {
            console.log('del nao');
            for (let i=cano.objs.length-1;i>=0;i--) {
              let p=cano.objs[i];
              if (!((p.x>o.x)&&(p.x<c1.x)&&(p.y>o.y)&&(p.y<c1.y))) continue;
              if (p.y==o1.y) 
              //if (p.bgcol==o1.bgcol)
                cano.objs.splice(i,1);
            }
            //o1.intern.recorded.length=0;
            scanPoints();
            o1.intern.childh.rec.bgcol='#fff';
            //timerRecording=true;
          }
          //...
        }
        }
        //--
        
        if (p2) {
        let ah=p2.children||[p2];
        for (let p2 of ah) {
        const oOnUp=p2.onUp;
        p2.onUp=function() {
          //---
          if (oOnUp) oOnUp();
          if (!timerRunning) return;
          //if (!timerRecording) return;
          if (o1.intern.childh.rec&&(o1.intern.childh.rec.bgcol!='#fff')) return;
          if (p2.timered) return;//dont record if obj was pressed by timer
          
          //timerRunning=false;
          //console.log('record nao');
          //x=round(width/2 +(o.x+posx)*dpr*scx);//+0.5,
          //(x-width/2)/(dpr*scx)-posx;
          
          let on={
            x:((timerx-view.width/2)/(view.dpr*view.scx))-view.posx,//o1.x+o1.w/10,
            y:o1.y,w:4,h:4,
            s:(ah.length>1)?ah.indexOf(p2):' ',
            bgcol:o1.bgcol};
          
          //onsole.log('record on.x='+on.x);
          
          let a=colh[o1.bgcol];
          //console.log(a);
          if (a)
          for (let oh of a) {
            if (oh.x<=on.x) continue;
            let i=cano.objs.indexOf(oh);
            //onsole.log('inserting at '+i);
            cano.objs.splice(i,0,on);
            on=undefined;
            break;
          }
          
          if (on) cano.objs.push(on);
          
          //if (!o1.intern.firstRecorded) o1.intern.firstRecorded=on;
          //const ra=o1.intern.recorded;
          //ra.push(on);
          //if (ra.length==1) {
            ////on.edges=[{p1:edge.p1,p2:edge.p2}];
            //on.children=[o1];
          //}
          //cano.initObj(on);
          //scanPoints();
          timerRecorded=true;
          //...
        }
        //onsole.log(p2);
        }}
        
        //...
      }
      )();
        
      }
      }
      //...
    }
    
    //--- search points
    scanPoints();
    //onsole.log(c+' points found. '+Object.values(colh).length);
    
    cano.handlerAdd('change',scanPoints);
    cano.handlerAdd('draw0',draw0);
    
    o.intern.unHook=function() {
      //---
      //onsole.log('unhooking');
      //let i=cano.draw0s.indexOf(draw0);
      //cano.draw0s.splice(i,1);
      
      cano.handlerDel('change',scanPoints);
      cano.handlerDel('draw0',draw0);
      if (menu) {
        let i=Menu.roots.indexOf(menu);
        if (i!=-1) Menu.roots.splice(i,1);
      }
      delete(o.onUp);
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
//fr o,1,5
//fr o,1,5,20
//fr o,1,5,23
//fr o,1,5,23,29
//fr o,1,5,25
//fr o,1,5,30,3
//fr o,1,5,32
//fr o,1,5,32,0
//fr o,1,5,32,15
//fr o,1,5,32,15,21
//fr p,6,237
