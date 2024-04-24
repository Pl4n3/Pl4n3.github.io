//------
(function() {
  //----
  console.log('v0.618 ');//FOLDORUPDATEVERSION
  //const colors=['#fa8','#af8','#8af'];
  const colors=['#ff6600','#66cc00','#3399cc'];
  
  /* invoke graph */ {
    //---
    // should one day better be generated: 
    // - showParties,levelUp -> startScreen
    // - initScene,startScreen -> levelMap
    //...
  }
  
  function hookObj(o) {
    //---
    const parties=[],//--- usually 2 maybe at times more (3rd party interferes fight..)
          order=[],bigw=50,bigbo=10,marks=[],// marks has marks & actions
          view=cano.view,arrows=[];
    let orderi=0,actioni=0,selu,actionMarked=[],
        game={punits:[]},//---game state, to be stored and reloaded
        maxVal,levels=[],quickTest=0,currentLevel,cbut='#ff8';//eeb
        lsKey='canvjrpg0',starthp=4;
    
    function draw(dt,ct) {
      //---
      if (parties.length==0) return;
      ct.strokeStyle='rgba(250,250,250,0.5)';
      ct.lineWidth=0.5*view.scx*view.dpr;
      let p0=o.intern,p1=parties[1][0].co.intern;
      ct.beginPath();
      ct.moveTo(p0.x,p0.y);
      ct.lineTo(p1.x,p1.y);
      ct.stroke();
      
      for (const ar of arrows) {
        ct.strokeStyle=ar.col;
        ct.lineWidth=0.5*view.scx*view.dpr;
        //let p0=o.intern,p1=parties[1][0].co.intern;
        const p0=ar.p0,p1=ar.p1,dx=p1.x-p0.x,dy=p1.y-p0.y,a=Math.atan2(dy,dx)-Math.PI/2,
          shape=[{x:0,y:1},{x:1,y:0.5},{x:0.5,y:0.5},{x:0.5,y:0},{x:-0.5,y:0},{x:-0.5,y:0.5},{x:-1,y:0.5}],
          si=Math.sin(a),co=Math.cos(a),d=Math.max(10,Math.sqrt(dx*dx+dy*dy));
        
        //for (const p of shape) {
        ct.fillStyle=ar.col;
        ct.beginPath();
        for (let i=0;i<shape.length;i++) {
          let p=shape[i],x0=p.x*20,y0=p.y*d;
          let x=x0*co-y0*si,y=x0*si+y0*co;
          x=x+p0.x;y=y+p0.y;
          x=view.width/2+(x+view.posx)*view.scx*view.dpr;
          y=view.height/2+(y+view.posy)*view.scy*view.dpr;
          if (i==0) ct.moveTo(x,y); else ct.lineTo(x,y);
        }
        ct.fill();
        
        //ct.beginPath();
        //ct.moveTo(view.width/2+(p0.x+view.posx)*view.scx*view.dpr,view.height/2+(p0.y+view.posy)*view.scy*view.dpr);
        //ct.lineTo(view.width/2+(p1.x+view.posx)*view.scx*view.dpr,view.height/2+(p1.y+view.posy)*view.scy*view.dpr);
        //ct.stroke();  
      }
      
      
      //...
    }
    function mark(ps) {
      //---
      const o=ps.o,i=cano.objs.indexOf(o),bo=ps.bo||2;
      //onsole.log('i='+i);
      const om=cano.initObj({x:o.x-bo,y:o.y-bo,w:o.w+2*bo-0.25,h:o.h+2*bo-0.25,bgcol:ps.bgcol||'#0f0',
        noBorder:1,s:' ',dontmove:1,selectable:false,noserialize:1});
      cano.objs.splice(i,0,om);
      marks.push(om);
      return o;
      //...
    }
    window.mark=mark;
    function colorf(c0,c1) {
      //---
      let d=((3+c1-c0)%3);
      if (d==1) return 4;
      if (d==2) return 1;
      return 2;
      //...
    }
    function markCurrentLevel() {
      //---
      let levelPos=currentLevel.levelPos,o=levels[levelPos.y][levelPos.x];
      mark({o:o,bgcol:'#eee'});
      //...
    }
    function showCurrent() {
      //---
      //onsole.log('showCurrent');
      for (const m of marks) cano.delObj(m); 
      marks.length=0;
      actionMarked.length=0;
      
      const u=selu;//order[orderi];
      //onsole.log(u.color);
      mark({o:u.co,bgcol:'#eee',bo:4});
      mark({o:order[orderi].ordero,bgcol:'#eee',bo:2});
      const ac=u.actions[actioni];
      //onsole.log(ac);
      const markparty=(ac.s=='Heal')?u.pi:1-u.pi;
      for (const u1 of parties[markparty]) {
        //onsole.log(u1.color);
        if (u1.hp==0) continue;
        let cf=colorf(u.color,u1.color);//onsole.log('cf='+cf);
        mark({o:u1.co,bgcol:'#ee0',bo:cf});
        //actionMarked[u1.co]=1;
        u1.co.hp0=Math.max(0,u1.hp-ac.strength*cf/2);
        actionMarked.push(u1.co);
      }
       
      let al=u.actions.length,w=20,bo=5,
          x0=(3*bigw+2*bigbo)/2-al*w-(al-1)*bo,
          y0=parties[parties.length-1][0].co.y+bigw+bigbo;
      for (let i=0;i<al;i++) {
        const ah=u.actions[i];
        const o=cano.initObj({
          x:x0+i*(w+bo),y:y0,sa:[ah.s,'Strength:'+ah.strength],w:w,h:w,
          bgcol:'#888',
          noserialize:1,fs:3,dontmove:1,
          selectable:i!=actioni
        });
        ah.co=o;
        cano.objs.push(o);
        if (i!=actioni) {
          o.intern.ah=ah;
      o.onselect=function() {
        //---
        const i=u.actions.indexOf(this.intern.ah);
        //onsole.log(i);
        actioni=i;
        showCurrent();
        //...
      }
          //mark({o:o,bgcol:'#ee0',bo:1.5});
        } else 
          mark({o:o,bgcol:'#eee',bo:3});
        marks.push(o);
        //mark({o:o,bgcol:(i==actioni)?'#eee':'#ee0'});
      }
      
      if ((u.pi==0)||quickTest) {
        if (actionMarked.length>0) {
      actionMarked.sort(function(a,b) {
        //---
        if (a.hp0<b.hp0) return -1;
        //if (a.hp0>b.hp0) 
        return 1;
        //...
      }
      );
          actionMarked[0].onselect();
        }
      }
      
      markCurrentLevel();
      //...
    }
    function showUnit(u) {
      //---
      const sa=['Unit','HP:'+u.hp];
      for (const ac of u.actions) sa.push(ac.s+':'+ac.strength);
      u.co.sa=sa;
      //...
    }
    function createUnit(ps) {
      //---
      const u={
        color:Conet.rani(3),
        pi:ps.pi,
        ui:ps.ui,
        hp:starthp,//8
        actions:[{s:'Attack',strength:1}]
      };
      //if (Conet.rani(2)==0) u.actions.push({s:'Doubleattack',timeout:1,strength:1});
      //else u.actions.push({s:'Heal',timeout:1,strength:1});
      
      let hpc=3;//was 1, increase to distribute more hp
      for (let i=0;i<ps.level;i++) {
        const j=Conet.rani(hpc+u.actions.length);
        if (j<hpc) u.hp++; else u.actions[j-hpc].strength++;
      }
      u.hpo=u.hp;
      return u;
      //...
    }
    function unitDraw(ct,x,y,w,h) {
      //---
      //onsole.log('unitDraw');
      let u=this.intern.u,bh=h/10;
      ct.fillStyle='#f00';
      ct.fillRect(x,y+h-bh,u.hpo*w/maxVal,bh);
      ct.fillStyle='#0f0';
      ct.fillRect(x,y+h-bh,u.hp*w/maxVal,bh);
      ct.fillStyle='#666';
      for (let i=0;i<u.actions.length;i++) {
        ct.fillRect(x,y+h-bh*(1+u.actions.length-i),u.actions[i].strength*w/maxVal,bh); 
      }
      ct.fillStyle='#000';
      //...
    }
    function showParties(ps) {
      //---
      let w=bigw,bo=bigbo,pc=2,y0=-(pc*w+(pc-1)*bo)/2,
          c=3,x0=-(c*w+(c-1)*bo)/2;
      
      let us=[];
      for (let pi=ps.skip0?1:0;pi<pc;pi++) {
        const c=3,level=currentLevel?currentLevel.level:10;
        //x0=-(c*w+(c-1)*bo)/2;
        //if (pi==1) {
        let group=cano.add({x:x0,y:y0+pi*(w+bo)-7,w:60,h:6,sa:[' ']//,bgcol:'#aaa'
            ,fs:5});
        //}
        parties[pi]=[];
        let lvlc=0;
        for (let ui=0;ui<c;ui++) {
      //    const u={
      //      color:Conet.rani(3),
      //      pi:pi,
      //      ui:ui,
      //      hp:8,
      //      actions:[{s:'Attack',strength:1}]
      //    };
      //    //if (Conet.rani(2)==0) u.actions.push({s:'Doubleattack',timeout:1,strength:1});
      //    //else u.actions.push({s:'Heal',timeout:1,strength:1});
      //    
      //    for (let i=0;i<level;i++) {
      //      const j=Conet.rani(1+u.actions.length);
      //      if (j==0) u.hp++; else u.actions[j-1].strength++;
      //    }
          let u;
          if (pi==pc-1) {
            u=game.punits[ui];
            u.hp=u.hpo;
            u.pi=pc-1;
          } else
            u=createUnit({level:level,ui:ui,pi:pi});
          
          //const sa=['Test','HP:'+u.hp];
          //for (const ac of u.actions) sa.push(ac.s+':'+ac.strength);
          
          const o=cano.initObj({
          x:x0+ui*(w+bo),y:y0+pi*(w+bo),sa:[],w:w,h:w,
          bgcol:colors[u.color],//'rgba(250,250,250,0.5)',
          noserialize:1,fs:7,dontmove:1,
          draw0:unitDraw
          //selectable:false, 
          //noBorder:1
          });
          cano.objs.push(o);
          o.intern.u=u;
      o.onselect=function() {
        //---
        //selu=this.intern.u;actioni=0;showCurrent();
        let co=this;
        //onsole.log(actionMarked);
        if (actionMarked.indexOf(co)==-1) return;
        //onsole.log(this);
        //onsole.log('Doing action now.');
        const u0=order[orderi];
        const ac=u0.actions[actioni];
        //onsole.log(u0);
        //onsole.log(ac);
        const u1=co.intern.u;
        //onsole.log(u1);
        let col='#fff',cf=colorf(u0.color,u1.color);
        if (ac.s=='Attack') {
          u1.hp=Math.max(0,u1.hp-(cf*ac.strength/2));
          col='rgba(250,0,0,0.5)';
          if (u1.hp==0) {
            u1.co.bgcol='#888';
            u1.ordero.bgcol='#888';
            //for (let u of order) if (u===u1) 
          }
        }
        if (ac.s=='Heal') {
          col='rgba(0,250,0,0.5)';
        }
        //onsole.log(u1.hp);
        //1.co.sa=['Update','needed'];
        showUnit(u1);
        const co0=u0.co,co1=u1.co;
        arrows.push({col:col,text:'Attack 20 -> 10',
          p0:{x:co0.x+co0.w/2,y:co0.y+co0.h/2-1},
          p1:{x:co1.x+co1.w/2,y:co1.y+co1.h/2}});
        //console.log(arrows);
        let p=currentLevel.levelPos;
        setTimeout(
        function() {
          //---
          arrows.length=0;
          //---check for gameover
          let shp=[];
          for (let i=0;i<parties.length;i++) {
            let pa=parties[i],hp=0;
            for (let u of pa) hp+=u.hp;
            shp.push(hp);
          }
          //onsole.log(shp);
          if (shp[1]==0) {  //---defeat;
            console.log('Defeat');
            startScreen({defeat:1});
            return;
          }
          
          if (shp[0]==0) {
            console.log('Win');
            startScreen({win:1});
            return;
          }
          
          //---select next in order
          for (let i=order.length;i>0;i--) {
            orderi=(orderi+1)%order.length;
            if (order[orderi].hp>0) break;
          }
          selu=order[orderi];
          showCurrent();
          //...
        }
        ,quickTest?100:(wins(p.x,p.y)?100:1000));
        //...
      }
         
          
          u.co=o;
          showUnit(u);
          us.push(u);
          parties[pi][ui]=u;
          lvlc+=u.hp;
          for (let a of u.actions) lvlc+=a.strength;
        }
        group.sa[0]=((pi==1)?'Your':'Opponent')+' group, Level '+(lvlc-3*(starthp+1))/3;
      }
      cano.selCount=0;
      
      maxVal=0;
      for (let u of us) {
        maxVal=Math.max(maxVal,u.hpo);
        for (let a of u.actions) maxVal=Math.max(maxVal,a.strength);
      }
      return us;
      //...
    }
    function initScene() {
      //---
      cano.clear();
      //marks.length=0; //--- marks are reset in showCurrent()
      
      levelMap({});
      
      let levelPos=currentLevel.levelPos;
      Conet.seed(game.seed+levelPos.y*9999+levelPos.x*99);
      
      let w=bigw,bo=bigbo,pc=2,y0=-(pc*w+(pc-1)*bo)/2,
          c=3,x0=-(c*w+(c-1)*bo)/2,us=[];
      
      us=showParties({});//lobj:lobj}); 
      
      order.length=0;
      while (us.length>0) {
        const i=Conet.rani(us.length);
        order.push(us[i]);us.splice(i,1);
      }
      
      //onsole.log(order);
      const ow=10,obo=3;
      
      cano.add({x:x0,y:y0-ow-bo-7,w:40,h:6,sa:['Turn order'],fs:5});
      
      for (let i=0;i<order.length;i++) {
        const u=order[i];
        const o=cano.initObj({
          x:x0+i*(ow+obo),y:y0-ow-bo,sa:[u.pi,u.ui],w:ow,h:ow,
          bgcol:colors[u.color],
          noserialize:1,fs:4.8,dontmove:1,
          selectable:false,
        });
        cano.objs.push(o);
        u.ordero=o;
        //onsole.log(o);
      }
      //ano.setObjs(cano.objs);
      
      orderi=0;
      selu=order[orderi];
      showCurrent();
      
      //if (lobj) {
      //  let o=levels[levelPos.y][levelPos.x];
      //  mark({o:o,bgcol:'#eee'});
      //}
      
      
      //onsole.log(cano.selCount);
      //...
    }
    function levelSelect() {
      //---
      //onsole.log('levelSelect '+this.level);
      currentLevel=this;
      initScene();
      //...
    }
    
    function wins(x,y) {
      //---
      let m=game.levelMarks['y'+y+'x'+x];
      if (!m) return 0;
      return m.wins;
      //...
    }
    
    
    function levelMap(ps) {
      //---
      
      //onsole.log('init levelmap');
      let w=20,bo=4,yl=6,xl=4;
      levels.length=0;
      for (let y=0;y<yl;y++) {
        let level=(yl-y)*5+5,a=[];
        for (let x=0;x<xl;x++) {
          let o;
          let sel=false;
          if (ps.showSelectable) {
            sel=(y==yl-1)||wins(x-1,y)||wins(x+1,y)||wins(x,y-1)||wins(x,y+1);
          }
          //sel=true;//to test-select all levels
          cano.objs.push(o=cano.initObj({
            x:100+x*(w+bo),y:y*(w+bo)-(yl*w+(yl-1)*bo)/2,sa:['Lvl '+level],w:w,h:w,bgcol:sel?cbut:'#aaa',
            level:level,onselect:sel?levelSelect:undefined,levelPos:{x:x,y:y},fs:4.5,alignCenter:1
          }));
          let m=game.levelMarks['y'+y+'x'+x];
          if (m&&m.wins) o.sa.push('Wins:'+m.wins);
          if (m&&m.losses) o.sa.push('Losses:'+m.losses);
          a.push(o);
        }
        levels.push(a);
      }
      //...
    }
    function newGame(ps) {
      //---
      let punits=game.punits;
      punits.length=0;
      game.seed=ps.seed;Conet.seed(game.seed);
      for (let i=0;i<3;i++) {
        punits.push(createUnit({level:12,ui:i,pi:1}));// start level shall be 12
      }
      game.levelMarks={};//y2x2:{wins:7}}
      //onsole.log(game);
      //...
    }
    function levelUp() {
      //---
      let pts=3,spend,done;
      
      function decinc() {
        //---
        let o=this,inc=(o.sa[0]=='+');
        if (inc&&(pts==0)) return;
        if ((!inc)&&(o.intern.number.sa[0]==0)) return;
        if (pts==0) cano.delObj(done);
        o.intern.number.sa[0]+=inc?1:-1;
        pts-=inc?1:-1;
        if (pts==0) cano.objs.push(done);
        spend.sa[0]='Spend '+pts+' points to level up!';
        //console.log(this);
        //...
      }
      
      spend=cano.add({
        x:-50,y:-15,sa:['Spend '+pts+' points to level up!'],w:100,h:10,bgcol:'#eee',
        fs:8,alignCenter:1
      });
      done=cano.initObj({
        x:52.5,y:-15,sa:['Done!'],w:30,h:10,bgcol:cbut,
        fs:8,alignCenter:1,
      onselect:function() {
        //---
        for (let u of game.punits) {
          for (let i=0;i<u.actions.length+1;i++) {
            if (i==0) u.hpo+=u.numbers[i].sa[0]; else u.actions[i-1].strength+=u.numbers[i].sa[0];
          }
        }
        startScreen({});
        //...
      }
      });
      let bw=7;
      for (let u of game.punits) {
        //onsole.log(u.co);
        let co=u.co,o;
        u.numbers=[];
        for (let i=0;i<u.actions.length+1;i++) {
          let no=cano.add({x:co.x+co.w-bw*2,y:co.y+(i+1)*7,sa:[0],alignCenter:1,bgcol:'#aaa',w:bw,h:bw,fs:6});u.numbers.push(no);
          o=cano.add({x:co.x+co.w-bw*3,y:co.y+(i+1)*7,sa:['-'],alignCenter:1,bgcol:cbut,w:bw,h:bw,fs:6,onselect:decinc});o.intern.number=no;
          o=cano.add({x:co.x+co.w-bw,y:co.y+(i+1)*7,sa:['+'],alignCenter:1,bgcol:cbut,w:bw,h:bw,fs:6,onselect:decinc});o.intern.number=no;
        }
      }
      //...
    }
    function serialize() {
      //---
      for (let u of game.punits) {
        delete(u.co);
        delete(u.ordero);
        delete(u.numbers);
        for (let ac of u.actions) delete(ac.co);
      }
      let sh=JSON.stringify(game);
      localStorage[lsKey]=sh;
      //onsole.log(sh);
      //...
    }
    function startScreen(ps) {
      //---
      cano.clear();
      marks.length=0;
      
      if (ps.win||ps.defeat) {
        let p=currentLevel.levelPos,k='y'+p.y+'x'+p.x;
        let h=game.levelMarks[k];if (!h) { h={};game.levelMarks[k]=h; }
        if (ps.win) 
          h.wins=(h.wins||0)+1;
        else 
          h.losses=(h.losses||0)+1;   
      }
      
      //console.log(game);
      if (!ps.win&&!ps.noserialize) serialize();
      
      //ps.win=false;//to test without levelup
      
      levelMap({showSelectable:!ps.win});
      
      showParties({skip0:1});
      
      if (currentLevel) markCurrentLevel();
      
      if (ps.win) {
        cano.add({
          x:-50,y:-50,sa:['Win'],w:100,h:30,bgcol:'#eee',
          fs:20,alignCenter:1
        });  
      
        levelUp();
      
      } else {
      
        if (ps.defeat) {
          cano.add({
            x:-50,y:-50,sa:['Defeat'],w:100,h:30,bgcol:'#eee',
            fs:20,alignCenter:1
          });  
        }
        cano.add({
          x:-50,y:-15,sa:['Select a mission! ->'],w:100,h:10,bgcol:'#eee',
          fs:8,alignCenter:1
        });  
        cano.add({
          x:-85,y:60,sa:[' Reset game',' Current seed: '+game.seed],w:40,h:10,bgcol:cbut,
          fs:4,alignCenter:1,
      onselect:function() {
        //---
        let n=prompt('Really delete current game?\nEnter seed for new game or cancel reset:',1500);
        if (!n) return;
        newGame({seed:parseInt(n)});
        startScreen({noserialize:1});
        //...
      }
        });  
      }
      //...
    }
    
    /*
    Menu.remove();
    let ma=Menu.roots,menus=Menu.getMenus();
    let lineOrder;
    ma.push(Menu.initMenu({ms:'Inspect',checkbox:1}));
    Menu.roots=ma;
    if (ma[0]===menus[0]) Menu.setMenus(ma);
    Menu.draw();
    */
    
    let v=cano.view;
    v.posx=0;v.posy=0;
    v.scx=3;v.scy=3;
    
    //create player units
    let sh=localStorage[lsKey];
    if (sh) {
      game=JSON.parse(sh);
    } else 
      newGame({seed:1500});
    
    startScreen({noserialize:1});
    //initScene();
    
    cano.handlerAdd('draw1',draw);
    
    
    o.intern.unHook=function() {
      //---
      delete(o.onselect);
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
//fr o,1,7
//fr o,1,7,14,38
//fr o,1,7,14,48
//fr o,1,7,16
//fr o,1,7,18
//fr o,1,7,18,50
//fr o,1,7,18,50,36
//fr o,1,7,19
//fr o,1,7,25
//fr o,1,7,26
//fr o,1,7,27,3
//fr o,1,7,27,12
//fr o,1,7,28
//fr o,1,7,29
//fr o,1,7,29,47
//fr p,67,360
