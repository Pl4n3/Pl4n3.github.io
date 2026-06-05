//----
var Arkpark=function (gps) {
  //var arrows,w=gps.w||50,gw=gps.gw||20,gh=gps.gh||20,grid=[],party=0,mturn,ta0,attacko,
  //    gridPath=new GridPath(grid,gw,gh),os=[],selo,path,pathi,
  //    fow=gps.fog!==undefined?gps.fog:true,
  let arrows,w,gw,gh,grid=[],party=0,mturn,ta0,attacko,
      gridPath,os=[],selo,path,pathi,fow,
      parties=[{huerot:140,col:'#0cf'},{huerot:350,col:'#f90',ai:1}],//env=[],
      edit=false,aic=0,version='1.1434 ',//FOLDORUPDATEVERSION
      msg,x0,y0,startt,process,processi=0,pplay=false,
      cano,markattacko,turns,levelGrid=gps.levelGrid,mmenu,url;
  //...
  function nu(v0,v1) {
    if (v0!==undefined) return v0;
    return v1;
    //...
  }
  function remC(c) {
    if (arrows) c.parentNode.removeChild(c);//...
    if (cano) {
      var i=cano.objs.indexOf(c);
      cano.objs.splice(i,1);
    }
  }
  function dist(o0,o1,o0x,o0y) {
    if (o0x===undefined) o0x=o0.x;
    if (o0y===undefined) o0y=o0.y;
    var d=Math.max(0,o0x<o1.x?o1.x-o0x-o0.w+1:o0x-o1.x-o1.w+1)+//dx
          Math.max(0,o0y<o1.y?o1.y-o0y-o0.w+1:o0y-o1.y-o1.w+1);//dy
    //console.log(d);
    return d;
  }
  function rani(m) {
    return Conet.rani(m);//Math.floor(Math.ra ndom()*m);//...
  }
  function ai() {
    aic++;Menu.ms(mturn,'A.I. '+aic);
    if (!selo) 
    for (var i=0;i<os.length;i++) {
    //for (var i=os.length-1;i>=0;i--) {
      var o=os[i];
      if (o.party===party) {
        if (o.stunned) { o.moveDone=true;o.stunned=false;updateText(o);o.wasStunned=1; }
        if (!o.moveDone//||!o.attackDone
        ) { selo=o;break; }
      }
    }
    
    if (!selo) {
      turn();
      return;
    }
    
    var o=selo;
    gridPath.lenInit();
    gridPath.calcLen(o.x,o.y,gridPath.maxlen-(o.movelen||3)-1,o);
    //gridMarks();
    //return;
    var someNeedHeal=false;
    for (var i=os.length-1;i>=0;i--) {
      var oh=os[i];
      if ((oh!=o)&&(oh.party==party)&&(oh.hp<oh.mhp)) { someNeedHeal=true;break; }
    }
    
    var approachTurn=true;
    if (gps.approachOnTurn!==undefined) {
      if (gps.approachOnTurn>=1) 
        approachTurn=(turns%gps.approachOnTurn)==0;
      else 
        approachTurn=false;
    }
    console.log('approachTurn='+approachTurn);
    
    var gs=[],score=0;
    for (var y=0;y<gh;y++) for (var x=0;x<gw;x++) {
      var g=grid[y][x];delete(g.aiAttackO);
      if (g.len==-1) continue;
      var s=o.med?0:g.len;
      //console.log(s);
      
      for (var i=os.length-1;i>=0;i--) {
        var oh=os[i];
        if ((oh===o)||(oh.party===undefined)) continue;
        //if (!o.heal&&((oh.party===party)||(oh.party===undefined))
        //  //||(oh===o)
        //  ) continue;
        var doo=dist(o,oh,x,y);
        
        //if (gps.onestep) {
        //  if (oh.party!=party) s=1000-doo;
        //  continue;
        //}
        
        if ((doo==1)&&((o.heal&&(oh.party==party)&&(oh.hp<oh.mhp)
            )||(!o.heal&&(oh.party!=party)))) { 
          var sh=1000-oh.hp;
          if (sh<s) continue;
          s=sh;//1000-oh.hp;
          g.aiAttackO=o;
          var xh=oh.x;if (x>xh) xh=Math.min(oh.x+oh.w-1,x);
          var yh=oh.y;if (y>yh) yh=Math.min(oh.y+oh.w-1,y);
          g.aiAttackG=grid[yh][xh];
          //break; 
        }//todo: the lower hp, the higher score
        else if (gps.onestep&&approachTurn) { if (oh.party!=party) s=100-doo;continue; }
        else if (o.heal&&(s<500)&&(oh.party==party)&&(oh.hp<oh.mhp)) {
          s+=1/(doo*doo);
        } else if ((!(o.heal&&someNeedHeal))&&(doo<=4)&&(s<500)) {//---abstand nah genug fuer gegner-attacke und nicht selbst attackierend
          if (oh.party!=party) {
            var infight=false;//wenn abstand nah genug fuer gegner aber gegner im kampf, dann trotzdem naehern
            if (!o.heal) 
            for (var j=os.length-1;j>=0;j--) {
              if (j==i) continue;
              var oj=os[j];
              if ((oj.party===oh.party)||(oj.party===undefined)) continue;
              if (dist(oj,oh)==1) { infight=true;break; }
            }
            s+=infight?100:-100;//console.log(oh.party+' '+party);
          } else if (o.heal) s+=100;
        }
      }  
      //onsole.log(s+' '+score);
      if (s<score) continue;
      if (s>score) { if (gs.length>0) gs=[];score=s; }
      gs.push(g);
    }
    //onsole.log('gs.len='+gs.length+' score='+score+' party='+party);
    if (gs.length>0) { pathStart(gs[rani(gs.length)]);return; }
    selo.moveDone=true;//selo.attackDone=true;
    if (selo.wasStunned) selo.wasStunned--;
    selo=undefined;
    ai();
  }
  function attackAnim() {
    var mt=350;
    var t=Date.now()-ta0,fin=false;
    if (t>mt) { t=mt;fin=true; }
    var d=Math.sin(2*Math.PI*t/mt);
    //console.log(t);
    var o=selo,s;//=o.c.style;
    if (arrows) {
      s=o.c.style;
      s.left=(x0+(Math.sin(o.a)*d/4+o.x+(o.w-1)/2)*w-230)+'px';
      s.top=(y0+(-Math.cos(o.a)*d/4+o.y+(o.w-1)/2)*w-230)+'px';
    }
    if (cano) {
      o.c.x=(x0+(Math.sin(o.a)*d/4+o.x+0.1)*w-gw*w/2);
      o.c.y=(y0+(-Math.cos(o.a)*d/4+o.y+0.1)*w-gh*w/2);
    }
    o=attacko;
    if (o) {
      if (arrows) {
        s=o.c.style;
        s.transform='scale('+0.13*o.w+') rotate('+(o.a+d/2)+'rad)';
      }
      if (cano) {
        o.animda=d/2;
      }
    }
    
    if (fin) finishAttack(); else 
    setTimeout(attackAnim,10);
    //...
  }
  function attackStart(g) {
    //selo.attackDone=1;
    //gridPath.lenInit();
    g.mark=2;
    var o=selo,ow=o.w||1;
    o.a=Math.atan2(g.y-(o.y+(ow-1)/2),g.x-(o.x+(ow-1)/2))+Math.PI/2;
    place(o,o);
    if (!parties[party].ai) gridMarks();
    //setTimeout(finishAttack,350);
    ta0=Date.now();attacko=g.os.length>0?g.os[0]:undefined;
    if (attacko) if (attacko.env) attacko=undefined;
    attackAnim();
    if (attacko) Sound.osc({a:[{fr:[250,100],v:0,n:2},{t:10,v:1},{t:150,v:1},{t:140,v:0,fr:[175,50]}]});
    
    //var f0=rani(100,200),f1=rani(25,50);
    Sound.osc({a:[{fr:[100,200],v:0,n:1},{t:10,v:1},{t:100,v:1},{t:140,v:0,fr:[25,50]}]});
    process.push(['attack',os.indexOf(o),g.x,g.y]);
    
    //...
  }
  function updateText(o) {
    if (arrows)
    o.chp.innerHTML=(o.descr?('<b>'+o.descr+'</b><br>'):'')
      +(o.heal?'HEAL':'AP')+' <b style="font-size:2em;">'+o.ap+'</b><br>'
      +'HP <b style="color:'
      +(o.hp==o.mhp?'#080':'#f00')+';font-size:2em;">'+o.hp+'</b>'
      +(o.frags?'<br>'+o.frags+' frags':'')
      +(o.stunned?'<br><b>Stunned</b>':'');
    if (cano) {
      o.c.sa=[];
      if (o.descr) o.c.sa.push(o.descr);
      o.c.sa.push((o.heal?'HEAL':'AP')+':'+o.ap+' HP:'+o.hp
      +(o.frags?' Frags:'+o.frags:'')
      +(o.stunned?' Stunned':''));
    }
    //...
  }
  
  function countParties() {
    //---
    for (var i=parties.length-1;i>=0;i--) parties[i].count=0;
    for (var i=os.length-1;i>=0;i--) {
      var o=os[i];if (o.party===undefined) continue;parties[o.party].count++;
    }
    //...
  }
  
  function finishAttack() {
    console.log('...finishAttack');
    //onsole.trace();
    gridPath.lenInit();
    gridMarks();
    selo.moveDone=1;//---for if there was no move
    selo.attackDone=1;
    var o=attacko,dbg=0;
    if (o) {
      o.hp=Conet.f4(selo.heal?Math.min(o.hp+selo.ap,o.mhp):Math.max(0,o.hp-selo.ap));
      if ((o.party==1)&&!o.wasStunned&&gps.withStun) { 
        var ia=Math.floor(0.5+o.a/1.57),
            facing=((ia==0)&&(selo.y<o.y))||((ia==1)&&(selo.x>o.x))||((ia==2)&&(selo.y>o.y))||((ia==3)&&(selo.x<o.x));
        //onsole.log('arkpark.finishAttack facing='+facing+' ia='+ia);
        if (!facing) { o.stunned=true;updateText(o); }//onsole.log(o); }
      }
      //Sound.osc({a:[{fr:[250,100],v:0,n:2},{t:10,v:1},{t:150,v:1},{t:140,v:0,fr:[175,50]}]});
      if ((o.hp==0)||dbg) {
        //if (selo.frags===undefined) selo.frags=0;
        selo.frags=(selo.frags||0)+1;
        updateText(selo);
        objRemove(o);
        //placeGrid(o,false);
        //var i=os.indexOf(o);
        //os.splice(i,1);
        //remC(o.c);//o.c.parentNode.removeChild(o.c);
        //remC(o.chp);//o.chp.parentNode.removeChild(o.chp);
        
        //check for gameover
        //for (var i=parties.length-1;i>=0;i--) parties[i].count=0;
        //for (var i=os.length-1;i>=0;i--) {
        //  var o=os[i];if (o.party===undefined) continue;parties[o.party].count++;
        //}
        countParties();
        //onet.log('Mobs '+parties[1].count);
        if ((parties[1].count==0)||(parties[0].count==0)||dbg) {
          let sec=Math.floor(0.5+(Date.now()-startt)/1000);
          if (levelGrid) 
            levelGrid.onGameEnd(sec);
          else {
            showMsg('Game over, <b>you '+(parties[0].count==0?'lost! D:':'won! :D')
              +'</b><br>Game time: '+Math.floor(sec/60)+'min, '+sec%60+' sec.'
              +' <button id="newgame">New Game</button>');
            document.getElementById('newgame').onclick=restart;
          }
          return;
        }
      } else {
        updateText(o);
        //o.chp.innerHTML='AP <b style="font-size:2em;">'+o.ap+'</b><br>HP <b style="color:#f00;font-size:2em;">'+o.hp+'</b>';
      }
    }
    attacko=undefined;
    if (parties[party].ai) {
      selo=undefined;ai();
    } else if (gps.onestep) {
      nextUnitOrTurn();
    }
    //...
  }
  function pathStart(g) {
    
    path=[//g.gpos||
      g];var g0=g,g1;
    while (true) {
      var gs=[],x=g0.x,y=g0.y;
      if (y>0) { g1=grid[y-1][x];if ((g1.len!=-1)&&(g1.len<g0.len)) gs.push(g1); }
      if (x>0) { g1=grid[y][x-1];if ((g1.len!=-1)&&(g1.len<g0.len)) gs.push(g1); }
      if (y<gh-1) { g1=grid[y+1][x];if ((g1.len!=-1)&&(g1.len<g0.len)) gs.push(g1); }
      if (x<gw-1) { g1=grid[y][x+1];if ((g1.len!=-1)&&(g1.len<g0.len)) gs.push(g1); }
      if (gs.length==0) break;
      g0=gs[rani(gs.length)];
      path.splice(0,0,//g0.gpos||
        g0);
      //path.push(g0.gpos||g0);
    }
    //onsole.log('click path=');
    //onsole.log(path);
    //-------
    //onsole.log('place selo nao'); 
    //g=g.gpos||g;
    //place(selo,g);
    gridPath.lenInit();
    var ow=selo.w||1;
    for (var i=0;i<path.length;i++) {
      var g=path[i];//,x=g.x,y=g.y;
      //g.len=1;
      for (var y=g.y;y<g.y+ow;y++) for (var x=g.x;x<g.x+ow;x++)
        grid[y][x].len=1;
    }
    if (!parties[party].ai)
      gridMarks();
    pathi=0;
    pathAnim();//setTimeout(pathAnim,500);
    
    //...
  }
  function pathAnim() {
    //if (!path) return;
    let g=path[pathi],o=selo,doTurn=false;
    if (g.y<o.y) o.a=0;
    else if (g.y>o.y) o.a=Math.PI;
    else if (g.x<o.x) o.a=3*Math.PI/2;
    else if (g.x>o.x) o.a=Math.PI/2;
    //o.a=2*Math.ra ndom()*Math.PI;
    place(o,g);
    Sound.osc({a:[{fr:[40,20],v:0,n:1},{t:10,v:1},{t:240,v:0}]});
    pathi++;
    if (pathi<path.length) 
      setTimeout(pathAnim,20); //100
    else {
      console.log('...pathAnim 0 o.moveDone='+o.moveDone+' o.attackDone='+o.attackDone);
      path=undefined;
      gridPath.lenInit();
      o.moveDone=1;
      let gs;
      var fooInRange=gs=checkMarkTarget();
      console.log('...pathAnim 0.5 fooInRange='+fooInRange);
      if (!parties[party].ai) {
        console.log('...pathAnim 1');
        if (gps.onestep) {
          console.log('...pathAnim 2');
          if (fooInRange) { 
            gridMarks();
            if (gs.length==1) { //26-04-16 new auto action if only 1 target
              console.log('...pathAnim autoAttack now');
              gs[0].c.arrowSel();
            }
          } else doTurn=1;
        } else 
          gridMarks();
      }
      
      //if (0) //test dist function
      //for (var i=os.length-1;i>=0;i--) {
      //  var oh=os[i];
      //  if (oh==o) continue;
      //  console.log('pathAnim i='+i+' '+dist(o,oh)+' '+dist(oh,o));
      //}
      
      if (parties[party].ai) {
        //console.log(g);
        if (g.aiAttackG) 
          attackStart(g.aiAttackG);
        //checkMarkTarget();
        else { selo=undefined;ai(); }
      } else if ((g.os.length==2)&&(o.hp<o.mhp)) {
        var o1=g.os[1];
        
        //placeGrid(o1,false);
        //o1.c.parentNode.removeChild(o1.c);
        //os.splice(os.indexOf(o1),1);
        objRemove(o1);
        
        o.hp=o.mhp;
        updateText(o);
        Sound.osc({a:[{fr:[25,50],v:0,n:3},{t:10,v:1},{t:100,v:1},{t:140,v:0,fr:[100,200]}]});
        //console.log(g);
      }
    }
    console.log('...pathAnim doTurn='+doTurn);
    if (doTurn) {
      nextUnitOrTurn();
    }
    //...
  }
  
  function nextUnitOrTurn() {
    //---invoked by pathAnim and finishAttack
    let o=selo,io=os.indexOf(o);
    console.log('...nextUnitOrTurn io='+io);
    for (let i=0;i<os.length;i++) {
    //for (let on of os) {
      let on=os[(io+1+i)%os.length];
      if ((on.party!=party)||(on.moveDone&&on.attackDone)) continue;
      if (on.moveDone) {
        o=on;
        if (!checkMarkTarget()) continue;
      }
      let g=grid[on.y][on.x];
      
      //---next arrowSel/click is for selecting next, not do any mark related thus
      //---delete mark first (where is mark else deleted?)
      //for (var y=0;y<gh;y++) for (var x=0;x<gw;x++) {
      //   var g=grid[y][x];
         delete(g.mark);
      //}
      //-----
      
      g.c.arrowSel();
      //onsole.log('...pathAnim arrowSel='+doTurn);
      return;
    }
    console.log('...nextUntOrTurn real turn');
    turn();
    //...
  }
  
  function checkMarkTarget() {
    //...
    console.log('...checkMarkTarget');
    var o=selo;
    if (o.attackDone) return;
    var ar=o.ar||1,ow=o.w||1;//,fooInRange=false;
    let gs=[];
    for (var y=o.y-ar;y<o.y+ow+ar;y++) for (var x=o.x-ar;x<o.x+ow+ar;x++) {
      if ((x<0)||(y<0)||(x>=gw)||(y>=gh)) continue;
      var dx=x<o.x?x-o.x:(x>o.x+ow-1?x-o.x-ow+1:0),
          dy=y<o.y?y-o.y:(y>o.y+ow-1?y-o.y-ow+1:0);
      if ((dx==0)&&(dy==0)) continue;
      //console.log(dx+' '+dy+' sum '+(Math.abs(dx)+Math.abs(dy)));
      if ((Math.abs(dx)+Math.abs(dy))>ar) continue;
      var g=grid[y][x];
      if (!gps.friendlyFire&&!o.heal)
        if (g.os.length>0) {
          let o0=g.os[0];
          if (o0.party===party) continue;//no friendly fire
          else if (o0.hp>0) gs.push(g);//fooInRange=true; 
        }
      if (o.heal&&(g.os.length>0)) {
        let o0=g.os[0];
        if ((o0.party===party)&&(o0.hp<o0.mhp)) gs.push(g);//fooInRange=true; 
      }
      if (!g.block) g.mark=1;
    }
    markattacko=o;
    return gs.length>0?gs:undefined;//fooInRange;
    //...
  }
  function markMove() {
    var o=selo;
    return gridPath.calcLen(o.x,o.y,gridPath.maxlen-(o.movelen||3)-1,o);
    //...
  }
  function click() {
    //onsole.log('click');console.log(this);
    if (path) return;
    var g=this._g;
    if (edit==2) {
    //if (0) {
      g.block=!g.block;
      gridMarks();
      if ((g.x==0)&&(g.y==0)) {
        var s='[';
        for (var y=0;y<gh;y++) {
          s+='\'';
          for (var x=0;x<gw;x++) {
            s+=grid[y][x].block?'B':' ';
          }
          s+='\''+((y==gh-1)?']':',')+((y+1)%3==0?'\n':'');
        }
        console.log(s);
      }
      return;
    }
    var o=undefined;
    if (g.os.length>0) { var o0=g.os[0];if (!o0.env) o=o0; }//this._o;
    
    if (g.mark) {
      console.log('...click attackStart');
      attackStart(g);
      return;
    }
    
    if (o) {
      if (o.party==party) {
        gridPath.lenInit();
        if (o==selo) {
          if ((markattacko==o)&&!o.moveDone) {
            markattacko=undefined;
            var l=markMove();
            if (l==1) checkMarkTarget();
          } else
            checkMarkTarget();
        } else {
          selo=o;//console.log(o);
          //gridPath.lenInit();
          if (!o.moveDone) {
            var l=markMove();//gridPath.calcLen(o.x,o.y,gridPath.maxlen-(o.movelen||3)-1,o);
            if (l==1) checkMarkTarget();
          } else checkMarkTarget();
        }
        gridMarks();
      }
      return;
    }
    //var g=this._g;
    
    if (g.gpos) if ((g.len==-1)||(g.gpos.len<g.len)) g=g.gpos;
    if (g.len!=-1) pathStart(g);
    //console.log(this._g);
  }
  function freeFor(g,o) {
    if (!g) return false;
    if (g.block) return false;
    if (g.os.length>0) {
      var o0=g.os[0];
      if ((o0!=o)&&!o0.env) return false;
    }
    return true;
  }
  function placeGrid(o,yes) {
    for (var y=o.y;y<o.y+o.w;y++) for (var x=o.x;x<o.x+o.w;x++) {
      var g=grid[y][x],os=g.os;
      if (yes) {
        os.splice(0,0,o);g.block=false;
        o.g0=g;
      } else {
        var i=os.indexOf(o);
        if (i!=-1) os.splice(i,1);
        o.g0=undefined;
      }
    }
    
    
    //...
  }
  function place(o,p) {
    //onsole.log('place');
    //onsole.trace();
    placeGrid(o,false);
    //for (var y=o.y;y<o.y+o.w;y++) for (var x=o.x;x<o.x+o.w;x++) {
    //  var os=grid[y][x].os,i=os.indexOf(o);
    //  if (i!=-1) os.splice(i,1);
    //}
    var f=0.77;
    o.x=p.x;o.y=p.y;
    
    if (arrows) {
    var s=o.c.style;
    if (o.isMedi) {
      //----
      console.log('arkpark.place isMedi');
    } else {
      s.left=(x0*f*0+(o.x+(o.w-1)/2)*w-230)+'px';
      s.top=(y0*f*0+(o.y+(o.w-1)/2)*w-230)+'px';
      s.transform='scale('+(o.sc||0.13)*o.w+') rotate('+o.a+'rad)';//0.13*o.w
    }}
    
    if (cano) {
      o.c.x=((o.x+0.1)*w-gw*w/2);
      o.c.y=((o.y+0.1)*w-gh*w/2);
      //cano.tween(o.c,{t:'move',x:((o.x+0.1)*w-gw*w/2),y:((o.y+0.1)*w-gh*w/2)});
    }
    
    placeGrid(o,true);
    //for (var y=o.y;y<o.y+o.w;y++) for (var x=o.x;x<o.x+o.w;x++) {
    //  var g=grid[y][x];
    //  g.os.push(o);g.block=false;
    //}
    if (o.chp) {
      var sh=o.chp.style;
      sh.left=(x0*0+o.x*w)+'px';
      sh.top=(y0*0+o.y*w)+'px';
    }
    if (fow) if (o.party!=0) objViewCheck(o);
    processPush(['p',os.indexOf(o),p.x,p.y]);
  }
  function gridMarks() {
    for (var y=gh-1;y>=0;y--) for (var x=gw-1;x>=0;x--) {
      g=grid[y][x],view=true;
      
      if (fow) {
        view=false;
        for (var i=os.length-1;i>=0;i--) {
          var o=os[i];
          if (o.party!==0) continue;
          var d=(x<o.x?o.x-x:(x>o.x+o.w-1?x-o.x-o.w+1:0))+
                (y<o.y?o.y-y:(y>o.y+o.w-1?y-o.y-o.w+1:0));
          if (d<5) view=true;
        }
        g.view=view;
        if (view) { g.wview=true; }
      }
      if (gps.showAggroRange) {
        g.aggroRange=false;
        for (var i=os.length-1;i>=0;i--) {
          var o=os[i];
          if (o.party!==1) continue;
          if (o.descr=='MEDIC') continue;
          if (fow&&!o.g0.view) continue;
          var d=(x<o.x?o.x-x:(x>o.x+o.w-1?x-o.x-o.w+1:0))+
              (y<o.y?o.y-y:(y>o.y+o.w-1?y-o.y-o.w+1:0));
          if (d<5) g.aggroRange=true;
        }
      }
      var col;
      //if (g.os.length>0) col=g.os.length>1?'#f00':'#ff0';else 
      if (!view&&!g.wview) 
        col='#444';
      else {
        col=view?'#aaa':'#a90';
        if (g.block) col=view?'#777':'#760';
      }
      //if ((g.len!=-1)&&g.gpos) col='#0a0'; else if (g.len!=-1) col='#0f0';else if (g.gpos) col='#080';
      if (g.aggroRange&&!g.block&&view) col='#b99';
      if ((g.len!=-1)||g.gpos) col='#dd0';//'#0d0';
      if (g.mark) {
        if (selo.heal) 
          col=g.mark==2?'#0f0':'#5b5';
        else
          col=g.mark==2?'#f00':'#b55';
      }
      if (g.os.length>0) if ((g.os[0]==selo)&&(party==0)) 
        col='#ff0';
      if (cano) g.c.bgcol=col;
      if (arrows) g.c.style.backgroundColor=col;
    }
    if (!fow) return;
    for (var i=os.length-1;i>=0;i--) {
      var o=os[i];
      if (o.party===0) continue;
      objViewCheck(o);
    }
    //onsole.log(selo);
    //for (var i=env.length-1;i>=0;i--) {
    //  var o=env[i];
    //  //if (o.party==0) continue;
    //  objViewCheck(o);
    //}
    //...
  }
  function loadImage(fn) {
    var img=new Image();
    Conet.download({fn:fn,f:function(v) {
      if (fn.endsWith('.json')) {
        img.src=JSON.parse(v).data;
      } else
        img.src=v;//...
    }
    })
    return img;
    //...
  }
  function textShadow(ct,s,x,y,d,color) {
    ct.fillStyle='#fff';
    ct.fillText(s,x+d,y+d);
    ct.fillStyle=color||'#000';
    ct.fillText(s,x,y);
    //...
  }
  
  //let cdi=0;
  function canoDraw(ct,x,y,w,h) {
    //---
    var c=this,o=c.userData.o;
    
    //cdi++;
    //if (cdi%1000==0) {
    //  console.log('canoDraw '+cdi);
    //  console.log(o);
    //}
    
    ct.save();
    ct.translate(x+w/2,y+h/2);
    ct.rotate(o.a+(o.animda||0));
    if (c.img) ct.drawImage(c.img,-w/2,-h/2,w,h);
    
    ct.restore();
    var wh=w/o.w,dh=wh/150;
    
    let wb=wh*18/20,hp=o.hp/o.mhp;
    ct.fillStyle='#f00';
    ct.fillRect(x+wh/20+wb*hp,y+wh*17/20,wb*(1-hp),wh*2/20);
    ct.fillStyle='#0f0';
    ct.fillRect(x+wh/20,y+wh*17/20,wb*hp,wh*2/20);
    
    //ct.rotate(-0.1);
    ct.font='bold '+(wh/4)+'px serif';
    ct.textAlign='left';
    ct.textBaseline='bottom';
    ct.fillStyle='#000';
    let y0=y+h-h/8;//y+h
    textShadow(ct,o.ap,x+wh*0.02,y0,dh);
    ct.textAlign='right';
    textShadow(ct,o.hp,x+w-wh*0.02,y0,dh,(o.hp<o.mhp?'#c00':'#080'));
    
    var fh=wh/8,yt=y+wh/30,xt=x+wh/30;
    ct.font='bold '+fh+'px sans-serif';
    ct.textAlign='left';
    ct.textBaseline='top';
    if (o.descr) { textShadow(ct,o.descr,xt,yt,dh);yt+=fh; }
    if (o.stunned) { textShadow(ct,'Stunned',xt,yt,dh);yt+=fh; }
    if (o.frags) { textShadow(ct,'Frags:'+o.frags,xt,yt,dh);yt+=fh; }
    //onsole.log(o.descr);
    //...
  }
  
  function objInit(o) {
    //---
    //onsole.log('objInit os.length='+os.length);//onsole.trace();
    //var o={x:10,y:10};
    if (!o.w) o.w=1;
    if (!o.ap) o.ap=1;
    if (!o.hp) o.hp=5;
    if (!o.mhp) o.mhp=o.hp;
    var bo=(o.party==0)?(Math.floor(Math.min(gw,gh)/2)-2):0;
    
    //newpos:
    if (o.x===undefined) {
    let tries=0;
    newpos:
    while (true) {
      tries++;
      if (tries>=100) { console.log('Tried '+(tries-1)+' times to find free position, skip.');return; }
      var xp=Math.floor(Conet.rand()*(gw-o.w+1-bo*2))+bo,
          yp=Math.floor(Conet.rand()*(gh-o.w+1-bo*2))+bo;
      //onsole.log('objInit o.w='+o.w+' xp='+xp+' yp='+yp);
      for (var y=yp;y<yp+o.w;y++) for (var x=xp;x<xp+o.w;x++) {
        var g=grid[y][x];if (g.block||(g.os.length>0)) continue newpos;
      }
      if (gps.initMinDist)
      for (var oh of os) {
        if ((oh.party==o.party)||(oh.party===undefined)) continue;
        if (dist(o,oh,xp,yp)<gps.initMinDist) continue newpos;
      }
      o.x=xp;o.y=yp;
      break;
    }
    //onsole.log('got pos '+o.x+','+o.y+' tries='+tries);
    }
    //onsole.log('objInit o.w='+o.w+' o.x='+o.x+' o.y='+o.y);
    
    //if (pplay) console.log(o.a);
    if (o.a===undefined) o.a=Math.floor(Conet.rand()*4);//*Math.PI/2;//2*Math.ra ndom()*Math.PI;
    //if (pplay) console.log(o.a);
    processPush(['oinit',Object.assign({},o)]);
    o.a*=Math.PI/2;
    os.push(o);
    var fx=0.77,fy=0.77;
    if (o.env) { fx=0.955;fy=0.97; }//var f=o.env?0.97:0.77;
    //for (var x=0;x<10;x++) for (var y=0;y<10;y++) {
    var c;
    if (arrows) {
    c=arrows.div({src:
      o.src||(o.env?'/canvas/paint/test/medikitSmall.png.txt':'/canvas/cutout/tiles/'+(o.heal?'md':'sw')+'.png.txt')
      //'/canvas/paint/test/medikitSmall.png.txt'
      ,img:1
      ,x:(o.x*w-1000)+'px'//x0*fx
      ,y:(o.y*w)+'px'//y0*fy
      ,t:(o.env?'scale(0.4)':'scale('+0.1*o.w+') rotate('+o.a+'rad)')//0.13*o.w
      ,transformOrigin:'center'});
    c._o=o;c.arrowSel=click;
    o.c=c;
    //if (o.p!=0) 
    if (o.party!==undefined)
      c.style.filter='sepia(100%) hue-rotate('+parties[o.party].huerot+'deg) saturate(5)';
    c.style.pointerEvents='none';
    
    if (!o.env) {
      c=arrows.div({s:'AP <b style="font-size:2em;">'+o.ap+'</b><br>HP <b style="color:#f00;font-size:2em;">'+o.hp+'</b>',x:'100px',y:'100px',w_:w*o.w+'px',h_:'20px',c_:'rgba(255,255,255,0.5)'});
      var s=c.style;
      s.pointerEvents='none';//s.fontWeight='bold';
      s.fontSize='0.5em';
      s.textShadow='0.5px 0.5px 1px #eee';
      o.chp=c;
      updateText(o);
      place(o,o);
    }
    }
    
    if (cano) {
      cano.objs.push(c=cano.initObj({x:0,y:0,w:w*(0.8+o.w-1),h:w*(0.8+o.w-1),bgcol:((o.party!==undefined)?parties[o.party].col:undefined)
        ,img:loadImage(o.src||('/canvas/cutout/tiles/'+(o.heal?'md':'sw')+'.png.txt')),selectable:0,draw:canoDraw,userData:{o:o}}));
      o.c=c;
      updateText(o);
      place(o,o);
    }
    //place(o,o);
    //...
  }
  function objViewCheck(o) {
    var view=false,wview=false;
    for (var y=0;y<o.w;y++) for (var x=0;x<o.w;x++) {
      var g=grid[y+o.y][x+o.x];
      if (g.view) { view=true;break; }
      if (g.wview) wview=true;
    }
    if (arrows) {
    if (o.env) {
      o.c.style.display=view||wview?'initial':'none';
      o.c.style.filter=wview&&!view?'sepia(100%) blur(5px)':'';
    } else 
      o.c.style.display=view?'initial':'none';
    if (o.chp) o.chp.style.display=view?'initial':'none';
    }
    if (cano) {
      var i=cano.objs.indexOf(o.c);
      if (view) {
        if (i==-1) cano.objs.push(o.c);
      } else {
        if (i!=-1) cano.objs.splice(i,1);
      }
    }
    //o.view=view;
  }
  function objRemove(o) {
    placeGrid(o,false);
    var i=os.indexOf(o);
    processPush(['oremove',i]);
    os.splice(i,1);
    remC(o.c);//o.c.parentNode.removeChild(o.c);
    if (o.chp) remC(o.chp);//o.chp.parentNode.removeChild(o.chp);
    //...
  }
  function turn() {
    Menu.ms(mturn,'');
    Sound.osc({a:
      //[{f:300,v:0,n:1},{t:10,v:1},{t:240,v:0}]
      party!=0?[{fr:[50,100],v:0,n:1},{t:10,v:1},{t:200,v:1},{t:140,v:0,fr:[200,400]}]
      :[{fr:[100,200],v:0,n:1},{t:10,v:1},{t:100,v:1},{t:140,v:0,fr:[25,50]}]
    });//,o);
    
    //[{fr:[50,100],v:0,n:1},{t:10,v:1},{t:200,v:1},{t:140,v:0,fr:[200,400]}]
    //var f0=rani(100,200),f1=rani(25,50);
    //sound([{fr:[100,200],v:0,n:1},{t:10,v:1},{t:100,v:1},{t:140,v:0,fr:[25,50]}],o);
    
    party=(party+1)%parties.length;
    if (party==0) {
      turns++;console.log('turns='+turns);
    }
    
    //if (!fow) arrows.setScale(party==0?1:0.3);
    //console.log('arkpark.turn '+arrows.getSc());
    //if (!fow) 
    mturn.bgcol=parties[party].col;//...
    mturn.c.style.backgroundColor=mturn.bgcol;
    var op=undefined;
    for (var i=os.length-1;i>=0;i--) {
      var o=os[i];if (o.env) continue;
      o.moveDone=0;o.attackDone=0;
      if ((o.party==party)&&(o.hp>0)) op=o;
      //if ((o.party==party)&&(o.hp<o.mhp)) { o.hp+=0.25;updateText(o); }
    }
    selo=undefined;
    gridPath.lenInit();
    for (var y=0;y<gh;y++) for (var x=0;x<gw;x++) {
      var g=grid[y][x];
      delete(g.aiAttackO);
      delete(g.aiAttackG);
    }
    gridMarks();
    
    if (parties[party].ai) { aic=0;ai(); }
    else if (gps.onestep&&op) {
      var g=grid[op.y][op.x];
      g.c.arrowSel();
      //.click();
      //console.log(g);
    }
    
    if (gps.spawnMobOnTurn) if (turns%10==0) {
      objInit({party:1,hp:3,descr:'MELEE'});
      countParties();
      Conet.log('Spawned mob, now '+parties[1].count+'.');
    }
    //---
  }
  function setBlock(g) {
    g.block=1;
    if (arrows) g.c.style.backgroundColor='#777';
    if (cano) g.c.bgcol='#777';
    //...
  }
  function gridPattern(x0,y0,a) {
    for (var y=0;y<a.length;y++) {
      var s=a[y];
      for (var x=0;x<s.length;x++) {
        var yg=y+y0,xg=x+x0;
        if ((yg>=gh)||(xg>=gw)) continue;
        var g=grid[yg][xg];
        if (s.substr(x,1)=='B') 
          setBlock(g);
        else g.block=0;
      }
    }
    //...
  }
  function gridRandom() {
    var pw=3,ph=3,pa=[
      [],//['B B','B B','B B'],['BBB','','BBB'],
      ['BBB'],['B','B','B'],['','','BBB'],['  B','  B','  B'],
      ['B B','B'],['BB','','B'],['','B','B B'],[' BB','   ','  B']
    ];
    for (var y=0;y<gh/ph;y++) for (x=0;x<gw/pw;x++) {
      gridPattern(x*pw,y*ph,pa[rani(pa.length)]);
    }
  }
  function mediInit(o) {
    //var ox=11,oy=8;
    o.w=1;o.env=1;o.isMedi=1;
    processPush(['oinit',Object.assign({},o)]);
    var f=0.97;
    var c;
    if (arrows) {
      c=arrows.div({src:
        '/canvas/paint/test/medikitSmall.png.txt'
        ,img:1
        ,x:(x0*0+o.x*w)+'px'//x0*0.955
        ,y:(y0*0+(0.1+o.y)*w)+'px'//y0*f
        //,y:(y0*0+o.y*w)+'px'//y0*f
        ,t:'scale('+0.008*w+')'
        ,_transformOrigin:'center'});
      c.arrowSel=click;
      c.style.pointerEvents='none';
    } else {
      cano.objs.push(c={s:'Medikit',x:(o.x+0.1)*w-gw*w/2,y:(o.y+0.1)*w-gh*w/2,w:w*0.8,h:w*0.8,bgcol:'#ccc'
        ,img:loadImage('/canvas/paint/test/medikitSmall.png.txt'),selectable:0});
    }
    o.c=c;
    var g=grid[o.y][o.x];g.os.push(o);os.push(o);
    //...
  }
  function checkDismissMsg() {
    if (msg===undefined) return;
    remC(msg);
    msg=undefined;
  }
  function showMsg(sh) {
    checkDismissMsg();
    var c=document.createElement('div'),s=c.style;msg=c;
    s.position='absolute';s.top='2px';s.left='2px';//s.pointerEvents='none';
    s.textShadow='1px 1px 1px #000';s.fontSize='14px';s.color='#ccc';s.backgroundColor='rgba(0,0,0,0.3)';s.padding='2px';
    c.innerHTML=sh;
    //'<b style="color:#fff;">Arkenpark</b><span style="color:#fff;"> Turn-Based-Strategy Game Test </span>'
    //  //+' Version '+version//;//+'<br><a href="javascript:alert(23);" style="font-weight:bold;">Start game</a>';
    //  +'<br>1) Click your (blue) units to move and attack.<br>2) Hit "Turn" Button, A.I. processes, Repeat.'
    //  +'<br>3) ...'//Move onto medikits to reset health.
    //  +'<br>4) <span style="text-decoration:line-through;">Profit.</span> Win the game! <button id="disbut">Dismiss introduction</button>';
    document.body.appendChild(c);
  }
  
  function clearGrid() {
    //---
    let objs=undefined;
    if (cano) { objs=cano.objs;
      //objs.length=0; 
      for (let i=objs.length-1;i>=0;i--) {
        let c=objs[i];
        if (levelGrid.objs.indexOf(c)!=-1) continue;
        objs.splice(i,1);
      }
    }
    //...
  }
  
  function initGrid() {
    w=gps.w||50;gw=gps.gw||20;gh=gps.gh||20;
    grid=[];
    gridPath=new GridPath(grid,gw,gh);
    fow=gps.fog!==undefined?gps.fog:true;
    var c;
    Conet.seed(gps.seed||1);
    
    
    if (arrows) { c=arrows.cont;while (c.firstChild) c.removeChild(c.firstChild); }
    //arrows.setScale(1);startt=Date.now();process=[['gameVersion',version]];
    
    //var objs=cano.objs,sels=cano.sels,view=cano.view,url;
    var objs=undefined;
    if (cano) { objs=cano.objs;
      //objs.length=0; 
      clearGrid();
    }
    
    
    selo=undefined;os=[];
    x0=0;y0=0;//x0=gw*w;y0=gh*w;
    //var f=0.77;//4
    for (var y=0;y<gh;y++) {
      grid[y]=[];
      for (var x=0;x<gw;x++) {
        var block=false;//Math.ra ndom()<0.3;
        //if (Math.ran dom()<0.5) continue;
        var c;
        if (arrows) {
          c=arrows.div({s:' ',x:x*w+x0+'px',y:y*w+y0+'px',
            w:(w-0)+'px',h:(w-0)+'px',c:block?'#777':'#aaa'});
          var s=c.style;s.borderStyle='solid';s.borderColor='#888';
          //c.arrowSel=click;//onclick
        }
        if (cano) {
          objs.push(c={s:' ',x:x*w+x0-gw*w/2,y:y*w+y0-gh*w/2,w:w,h:w,dontmove:1,bgcol:'#aaa',onselect:click});
        }
        c.arrowSel=click;
        var g={block:block,c:c,x:x,y:y,len:-1,os:[]};c._g=g;
        grid[y][x]=g;
      }
    }
    if (arrows) arrows.div({s:' ',x:x0*3+'px',y:y0*3+'px'});
    //gridPattern(4,7,['BBBBB','B','BBBBB']);
    
    if (gps.gridPattern||!gps.onestep)
    gridPattern(0,0,gps.gridPattern||[
    '         B          ',
    '         B          ',
    '  BB  B     BBB  BB ',
    '  B  BB     B       ',
    '    BB   BB B       ',
    '  B      B         B',
    '  BB B  BB         B',
    '        B   B       ',
    '            B      B',
    'BBB  BBBB BBB      B',
    '        B B         ',
    '                    ',
    '  BBBB      BBBBBB  ',
    '     B BBBBBB       ',
    '            B       ',
    '  B    BBBB B  B BB ',
    '  B  B B    B  B B  ',
    '  B  B B BBBB  B BB ',
    '       B B     B  B ',
    '       B   BB BB BB ']);
    
    if (gps.randomBlocks) {
      if (!gps.blocks) gps.blocks=[];
      for (let i=0;i<gps.randomBlocks;i++) gps.blocks.push({x:rani(gw),y:rani(gh),notSerialize:1});
    }
    
    if (gps.blocks) {
      for (let i=gps.blocks.length-1;i>=0;i--) {
        let b=gps.blocks[i],g=grid[b.y][b.x];
        setBlock(g);
      }
        
    
    if (1)  
    if (gps.randomBlocks) /* connect holes */ {
      //...
      //onsole.log('...initGrid connect holes');//+gw+' '+gh);
      
      //find 1st monblock cell c0
      let c0,ch;
      for (let y=(gh-1);y>=0;y--) {
        for (let x=(gw-1);x>=0;x--) {
          if (!(ch=grid[y][x]).block) { c0=ch;break; }
        }
        if (c0) break;
      }
      
      //console.log(c0);
      let count=0;
      
      while (1) 
      //for (let j=0;j<5;j++)
      {
      //---find all connected to c0
      for (let y=gh-1;y>=0;y--) for (let x=gw-1;x>=0;x--) delete(grid[y][x].checked);
      let check=[c0],cn,ca=[];
      while (check.length>0) {
        for (let i=check.length-1;i>=0;i--) {
          let c=check[i],x=c.x,y=c.y;
          if (!c.checked&&!c.block) {
            c.checked=1;ca.push(c);//count++;
            //c.c.bgcol='#7f7';
            //setBlock(c);
            //if (x>0) { cn=grid[y][x-1];if (!cn.block&&!cn.checked) check.push(cn); }
            //if (y>0) { cn=grid[y-1][x];if (!cn.block&&!cn.checked) check.push(cn); }
            //if (x<gw-1) { cn=grid[y][x+1];if (!cn.block&&!cn.checked) check.push(cn); }
            //if (y<gh-1) { cn=grid[y+1][x];if (!cn.block&&!cn.checked) check.push(cn); }
            
            if (x>0) { cn=grid[y][x-1];check.push(cn); }
            if (y>0) { cn=grid[y-1][x];check.push(cn); }
            if (x<gw-1) { cn=grid[y][x+1];check.push(cn); }
            if (y<gh-1) { cn=grid[y+1][x];check.push(cn); }
          }
          check.splice(i,1);
        }
      }
      //onsole.log('ca.length='+ca.length);
      
      //---tried opti to remove inner cells from ca so that only border cells are checked for pairs
      //---because calc was slow, but main issue was duplicates in ca; opti didnt helped, made 
      //---calc even slower because there where too few inner cells
      //for (let i=ca.length-1;i>=0;i--) {
      //  let c=ca[i],x=c.x,y=c.y;;
      //  if (x>0) if (!grid[y][x-1].checked) continue;
      //  if (y>0) if (!grid[y-1][x].checked) continue;
      //  if (x<gw-1) if (!grid[y][x+1].checked) continue;
      //  if (y<gh-1) if (!grid[y+1][x].checked) continue;
      //  ca.splice(i,1);
      //}
      //console.log('opti ca.length='+ca.length);
      
      //---find closest pair of nonblock cell, where one is checked, the other not
      let mind=Number.MAX_VALUE,pairs=[];
      for (let i=ca.length-1;i>=0;i--) {
        c0=ca[i];
        for (let y=gh-1;y>=0;y--) for (let x=gw-1;x>=0;x--) {
          if ((x==c0.x)&&(y==c0.y)) continue;
          let c1=grid[y][x];
          if (c1.block||c1.checked) continue;
          let dx=c1.x-c0.x,dy=c1.y-c0.y,d=dx*dx+dy*dy;
          if (d>mind) continue;
          if (d<mind) { pairs.length=0;mind=d; }
          pairs.push([c0,c1]);
        }
      }
      //onsole.log('pairs.length='+pairs.length);
      if (pairs.length==0) break;
      {
        let i=rani(pairs.length);
        let p=pairs[i],c0=p[0],c1=p[1];
        //onsole.log(p);  
        while (c1.x!=c0.x) { c1=grid[c1.y][c1.x+(c1.x>c0.x?-1:1)];delete(c1.block); }
        while (c1.y!=c0.y) { c1=grid[c1.y+(c1.y>c0.y?-1:1)][c1.x];delete(c1.block); }
        count++;
      }
      }
      if (count>0) console.log('Connected '+count+' areas.');
      //---
    }
    
    }
    
    
    //...
  }
  function restart() {
    //---
    
    //---260528 for levelGrid, so that after loss, restart starts with party0
    party=0;
    mturn.bgcol=parties[party].col;
    mturn.c.style.backgroundColor=mturn.bgcol;
    
    //var c=arrows.cont;while (c.firstChild) c.removeChild(c.firstChild);
    //selo=undefined;os=[];x0=gw*w;y0=gh*w,f=0.77;//4
    //for (var y=0;y<gh;y++) {
    //  grid[y]=[];
    //  for (var x=0;x<gw;x++) {
    //    var block=false;//Math.ra ndom()<0.3;
    //    var c=arrows.div({s:' ',x:x*w+x0+'px',y:y*w+y0+'px',
    //      w:(w-0)+'px',h:(w-0)+'px',c:block?'#777':'#aaa'});
    //    var s=c.style;s.borderStyle='solid';s.borderColor='#888';
    //    c.arrowSel=click;//onclick
    //    var g={block:block,c:c,x:x,y:y,len:-1,os:[]};c._g=g;
    //    grid[y][x]=g;
    //  }
    //}
    //arrows.div({s:' ',x:x0*3+'px',y:y0*3+'px'});
    ////gridPattern(4,7,['BBBBB','B','BBBBB']);
    //gridPattern(0,0,['         B          ','         B          ','  BB  B     BBB  BB ',
    //'  B  BB     B       ','    BB   BB B       ','  B      B         B',
    //'  BB B  BB         B','        B   B       ','            B      B',
    //'BBB  BBBB BBB      B','        B B         ','                    ',
    //'  BBBB      BBBBBB  ','     B BBBBBB       ','            B       ',
    //'  B    BBBB B  B BB ','  B  B B    B  B B  ','  B  B B BBBB  B BB ',
    //'       B B     B  B ','       B   BB BB BB ']);
    turns=0;
    initGrid();
    if (arrows) arrows.setScale(1);startt=Date.now();process=[['gameVersion',version]];
    
    if (!edit) {
      //gridRandom();
      //if (1) {
      //  mediInit({x:0,y:0});
      //  mediInit({x:gw-1,y:gh-1});
      //} else {
      var mc=nu(gps.medikits,8);
      while (true) {
        if (mc==0) break;
        var x=rani(gw),y=rani(gh),g=grid[y][x];
        if (g.block||g.os.length>0) continue;
        mediInit({x:x,y:y});mc--;
      }
      //}
      //for (var i=0;i<3;i++) objInit({party:1,hp:8,ap:2,w:2});
      if (gps.objs) {
        for (var o of gps.objs) for (var i=(o.count||1)-1;i>=0;i--) objInit(Conet.hcopy(o));
      } else {
        for (var o of gps.objs0) for (var i=(o.count||1)-1;i>=0;i--) objInit(Conet.hcopy(o));//same as objs
        for (var i=0;i<(gps.meleeCount||3);i++) objInit({x_:11,y:8,party:0,descr:'MELEE'});
        for (var i=0;i<(gps.medicCount||0);i++) {
          var h={x_:11,y:8,party:0,descr:'MEDIC',heal:1,ap:5};
          if (gps.medicImgSrc) h.src=gps.medicImgSrc;
          objInit(h);//{x_:11,y:8,party:0,descr:'MEDIC',heal:1,ap:5,src:'/canvas/cutout/tiles/samTorch.json'});
        }
        if (gps.mobCounts) 
          for (let h of gps.mobCounts) 
            for (let i=0;i<h.c;i++) objInit(Conet.hcopy(h,{party:1,hp:3,descr:'MELEE'}));
        else 
          for (var i=0;i<((gps.mobCount===undefined)?10:gps.mobCount);i++) objInit({party:1,hp:3,descr:'MELEE'});
      }
    } else {
      gridPattern(8,7,['BBBBBB','B     ','BBBBBBB']);var o;
      
      mediInit({x:16,y:8});
      //mediInit(o={x:11,y:11});o.c.style.filter='sepia(100%) hue-rotate('+parties[1].huerot+'deg) saturate(5)';
      //mediInit(o={x:12,y:11});o.c.style.filter='sepia(100%) hue-rotate('+parties[0].huerot+'deg) saturate(5)';
      //mediInit(o={x:13,y:11});o.c.style.filter='grayscale(100%) blur(5px)';
    
      objInit({x:12,y:8,party:0,hp:4,mhp:5});
      objInit({x:9,y:8,party:1,hp:1});
      //objInit({x:15,y:8,party:0});
      //objInit({x:11,y:9,party:0});
      //objInit({x:12,y:8,party:0,hp:1});
    }
    //mediInit({x:10,y:8});mediInit({x:11,y:8});mediInit({x:12,y:8});
    
    //var ox=11,oy=8;f=1;
    //var c=arrows.div({src:
    //  '/canvas/paint/test/medikitSmall.png.txt'
    //  ,img:1,x:(x0*f+ox*w)+'px',y:(y0*f+oy*w)
    //  +'px',t:'scale('+0.4*1+')',transformOrigin:'center'});
    
    
    //objInit({x_:12,y:10,w:2,party:0,ap:2,hp:10});
    ////objInit({x:14,y:10,w:4});
    gridMarks();
    //}
    var angle=0;
    if (0)
    setInterval(function() {
      angle+=0.1;
      c.style.transform='scale('+(0.15)+') rotate('+angle+'rad)';
      //...
    }
    ,50);
    if (arrows) {
    arrows.cont0.scrollTop=(y0*3-window.innerHeight)/2;
    arrows.cont0.scrollLeft=(x0*3-window.innerWidth)/2;
    }
    gridPath.setFreeFor(freeFor);
    //alert('Arkpark turn-based-strategy game test\n1) Click your units (cyan) to move and attack\n2) Hit "Turn" Button');
    //...
    //if (gps.levelGrid) levelGrid();
    
    countParties();
    let p1c0=parties[1].count;
    cano.objs.push({x:0,y:20,w:180,h:20,dontmove:1,bgcol:'#aaa',s:'Number of Mobs',selNoDeco:1,pos:['bottom','center']
    
    ,draw:function(ct,x,y,w,h) {
      //---
      let c=parties[1].count,f=w*c/p1c0;
      
      ct.fillStyle='#aea';
      ct.fillRect(x,y,w-f,h);
      ct.fillStyle='#eaa';
      ct.fillRect(x+(w-f),y,f,h);
      
      ct.font=(14*cano.view.dpr)+'px sans-serif';
      ct.textAlign='center';
      ct.textBaseline='middle';
      ct.fillStyle='#000';
      ct.fillText('Remaining mobs: '+c,x+w/2,y+h/2);
      ct.textAlign='start';
      ct.textBaseline='alphabetic';
      
      //...
    }
    
    });
    
    
    
    //...
  }
  function processPlay() {
    if (!pplay) return;
    if (processi==0) {
      initGrid();
      //gridMarks();
    }
    var p=process[processi],p0=p[0],p1=p[1];
    if (p0=='oinit') {
      p1=Object.assign({},p1);
      if (p1.isMedi) mediInit(p1);
      else objInit(p1);
    } else if (p0=='p') {
      var o=os[p[1]],x=p[2],y=p[3];
      if (y<o.y) o.a=0;
      else if (y>o.y) o.a=Math.PI;
      else if (x<o.x) o.a=3*Math.PI/2;
      else if (x>o.x) o.a=Math.PI/2;
      place(o,{x:x,y:y});
    } else if (p0=='oremove') objRemove(os[p[1]]);
    processi=(processi+1)%process.length;
    gridMarks();
    //if (processi!=0) 
    setTimeout(processPlay,processi==0?1000:10); //else processToggle();
    //...
  }
  function processPush(a) {
    if (pplay) return;
    process.push(a);//...
  }
  function processToggle() {
    //processi=0;if (!pplay) { pplay=true;processPlay();this.s='Stop'; }
    pplay=!pplay;
    if (pplay) { processPlay();this.s='Stop'; } else { this.s='Play'; }
  }
  function load(fn) {
    
    Conet.download({fn:fn,f:function(v) {
      gps=JSON.parse(v);
      restart();
    }
    });
    //...
  }
  //---
  function initLevelGrid() {
    //---
    let levelStarted,levelSelected,lskey='arkpark0_'+(gps.seed||1),info,objs0Init;
    
    console.log('seed='+(gps.seed||1));
    
    if (levelGrid=='3melees') {
      levelGrid={};
      Conet.hcopy(
    
    {onestep:1
    ,fog:1
    ,approachOnTurn:-1
    ,medikits:0
    ,meleeCount:-1 //hack, means 0
    ,objs0:[
      {party:0,descr:'Athos',ap:1,hp:5,mhp:5,w:1},
      {party:0,descr:'Porthos',ap:1,hp:5,mhp:5,w:1},
      {party:0,descr:'Aramis',ap:1,hp:5,mhp:5,w:1}
    ],
    info:'Arkpark Game Test'+
    '<br>'+
    '<br>- Minimal turnbased game with level up.'+
    '<br>'+
    '<br>More details:'+
    '<br>'+
    '<br>- Simple turnbased gameplay.'+
    '<br>- Multiple random generated game levels of increasing difficulty.'+
    '<br>- Maintain a party of units and level up on won games.'+
    '<br>'+
    '<br>Even more details:'+
    '<br>'+
    '<br>- Your units are blue, opponent is orange.'+
    '<br>- Units can move, then attack. Click on them to switch between move/attack.'+
    '<br>- On your turn, your units can be played at variable order, click to select and move/attack.'+
    '<br>- Game levels are set as a grid, simple ones at top, difficult at bottom.'+
    '<br>- At start the top simple levels are playable, if a level is won, the more difficult level below it gets playable.'+
    '<br>- On won game a unit levels up, if a game isn\'t winnable, level up units playing easier games first.'+
    '<br>- Games are random generated with a seed. You can change the seed in the menu to get a whole new campaign.'
    ,
    }
      
      ,gps);
    }
    
    objs0Init=cloneA(gps.objs0);
    //onsole.log(objs0Init);
    
    function cloneA(a) {
      //---
      return JSON.parse(JSON.stringify(a));
      //...
    }
    
    function saveGameState() {
      //---
      let sh=JSON.stringify(levelGrid.persist);
      if (Conet.checkOnline()) Conet.upload({fn:'gamesaves/'+lskey+'.json',data:sh});
      else localStorage[lskey]=sh;
      //...
    }
    
    levelGrid.onGameEnd=function(sec) {
      //---
      let i=levelGrid.objs.indexOf(levelStarted);
      console.log('i='+i);
      let lost=(parties[0].count==0),persist=levelGrid.persist;
      let games=levelGrid.persist.objs[i].games;
      games.push({won:!lost,sec:sec,ts:Conet.dateToString(new Date())});
      
      let wincount=0;for (let g of games) if (g.won) wincount++;
      
      let unitLevelUp='';
      if ((wincount==1)&&!lost) {
        Conet.seed(gps.seed);
        let i0=Conet.rani(persist.objs0.length),i1=Conet.rani(2);
        let u=persist.objs0[i0],k=(i1==0?'ap':'hp');
        u[k]=Conet.f4(u[k]+0.5);
        if (k=='hp') u.mhp=u.hp;
        unitLevelUp='<br><br>Unit level up: '+u.descr+'.'+k+' = '+u[k];
        levelGrid.persist.objs[i].info='Last level up: '+u.descr+'.'+k;
      }
      
      saveGameState();
      //onsole.log('wrote to ls: '+sh);
      
      Conet.alert('Game over, you '+(lost?'lost! D:':'won! :D')
        +'<br>Game time: '+Math.floor(sec/60)+'min, '+sec%60+' sec.'+unitLevelUp);
        
      clearGrid();
      showParty();
      //...
    }
    
    function click() {
      //---
      //console.log(this);
      //console.log('Restart with level '+this.seed);
      console.log('Level seed='+this.level.seed);
      
      //start level at start or on doubleclick
      if (//(!levelStarted)||
        (levelSelected===this)) {
      
        let allPlayable=false;
        if (!allPlayable
          //&&levelStarted
          &&!this.levelGridPs.playable) {
          //alert('This level is currently not playable.\nThe yellow ones are.');
          Conet.alert('This level is currently not playable.<br>The yellow, green or red ones are.');
          return;
        }
      
        if (levelStarted) {
          //let i=levelGrid.objs.indexOf(levelStarted);
          //levelStarted.sa=[levelGrid.persist.objs[i].games.length||' '];
        }
        levelStarted=this;
        //this.sa=['Run'];
        Conet.hcopy(this.level,gps);
        //gps.seed=this.seed;
        restart();
        cano.tweens.push({o:cano.view,t:0,mt:500,k:'posx',v0:cano.view.posx,v1:0});
      }
      
      
      if (levelSelected) {
        //levelSelected.bgcol='#aaa';
      }
      levelSelected=this;
      let i=levelGrid.objs.indexOf(levelSelected);
      //onsole.log(levelGrid.persist.objs[i]);
      info.sa=['Selected level: '+i%lw+','+Math.floor(i/lw)];
      let lpoi=levelGrid.persist.objs[i];
      let games=lpoi.games;
      if (games.length>0) {
        let wins=0,losses=0;
        for (let g of games) if (g.won) wins++; else losses++;
        info.sa.push((wins>0?wins+' wins ':'')+(losses>0?losses+' losses':''));
      }
      if (lpoi.info) info.sa.push(lpoi.info);
      //this.bgcol='#eee';
      //...
    }
    
    function hasWins(x,y) {
      //---
      if ((x<0)||(x>=lw)||(y<0)||(y>=lh)) return false;
      let i=y*lw+x,games=levelGrid.persist.objs[i].games;
      for (let g of games) if (g.won) return true;
      return false;
      //...
    }
    
    //let di=0;
    function draw(ct,x,y,w,h) {
      //---
      //console.log(this);
      let i=this.levelGridPs.i;
      let games=levelGrid.persist.objs[this.levelGridPs.i].games;
      //if (games.length==0) return;
      
      let wins=0,losses=0;
      for (let g of games) if (g.won) wins++; else losses++;
      
      let playable=false;
      if ((Math.floor(i/lw)==0)||(games.length>0)) playable=true;
      else {
        let lx=i%lw,ly=Math.floor(i/lw);
        if (hasWins(lx,ly-1)||hasWins(lx-1,ly)||hasWins(lx+1,ly)) playable=true;
      }
      this.levelGridPs.playable=playable;
      
      ct.fillStyle=wins>0?'#6f0':(losses>0?'#f60':(playable?'#eea':'#aaa'));
      ct.fillRect(x,y,w,h);
      ct.fillStyle='#000';
      
      let v=cano.view,fs=7*v.dpr*v.scy,y0=y+fs/10,x0=x+fs/10;
      
      if (this===levelStarted) {
        ct.lineWidth=fs*1.5;
        ct.strokeStyle='#fff';
        ct.strokeRect(x,y,w-1,h-1);
      }
      
      if (this===levelSelected) {
        ct.lineWidth=fs*1;
        ct.strokeStyle='#ff0';
        ct.strokeRect(x,y,w-1,h-1);
      }
      
      ct.font=fs+'px sans-serif';
      if (wins>0) { ct.fillText(wins+' wins',x0,y0);y0+=fs; }
      if (losses>0) { ct.fillText(losses+' losses',x0,y0);y0+=fs; }
      
      //di++;
      //if (di%10000==0) {
      //  console.log(di);
      //  //onsole.log(cano.view);
      //}
      //onsole.log(this.intern.fsh);
      //...
    }
    
    function resetGameState() {
      //---
      levelGrid.persist={
        objs:[],
        objs0:cloneA(objs0Init),
      };
      gps.objs0=levelGrid.persist.objs0;
      for (let y=0;y<lh;y++) for (let x=0;x<lw;x++) 
        levelGrid.persist.objs.push({games:[]});
        
      saveGameState();
      clearGrid();
      showParty();
      //...
    }
    
    function init(sh) {
      //---
      let initPersist=true;
      
      if (sh) { 
        levelGrid.persist=JSON.parse(sh);
        //onsole.log(levelGrid.persist); 
        if (levelGrid.persist.objs0) gps.objs0=levelGrid.persist.objs0;
        initPersist=false;
      }
      //if (initPersist) levelGrid.persist={objs:[]};
      
      for (let y=0;y<lh;y++)
      for (let x=0;x<lw;x++) {
        let gw=y+5;
        let c={s:' ',//(initPersist?' ':levelGrid.persist.objs[levelGrid.objs.length].games.length||' '),
          x:400+x*w,//(gw+1)*w-gw*w/2
          y:y*w-lh*w/2,
          w:w-b,h:w-b,dontmove:1,bgcol:'#aaa',onselect:click,draw:draw,
          levelGridPs:{
            i:levelGrid.objs.length
          },
          level:{
            seed:(gps.seed||1)+(x+y*lw)*11,
            blocks:[],
            gw:gw,gh:gw,
            randomBlocks:Math.floor(0.5+gw*gw*0.4),
            mobCount:2+Math.floor(0.5+gw*gw/30)+y,
          }};
        levelGrid.objs.push(c);
        //if (initPersist) levelGrid.persist.objs.push({games:[]});
        cano.objs.push(c);
      }
      
      if (initPersist) resetGameState();
      
      let c;
      cano.objs.push(c={x:400,y:lh*w/2+w/2,w:lw*w-b,h:1.5*w,dontmove:1,fs:12,bgcol:'#aaa',s:'Level info.'
      
      ,onselect:function() {
        //---
        //console.log(cano.view);
        //cano.view.posx=0;
        cano.tweens.push({o:cano.view,t:0,mt:500,k:'posx',v0:cano.view.posx,v1:0});
        //alert(23);
        //...
      }
      
      });
      levelGrid.objs.push(c);info=c;
      //
      mmenu.sub.splice(0,0,Menu.initMenu({s:'Gamesave',fs:0.9,_noTri:true,sub:[
      {s:'Ex/Import..',vCenter:1,doctrl:'Export/Import Gamesave',ta:true,jsonCheck:1,
      
      valuef:function() {
        //---
        return JSON.stringify(levelGrid.persist,undefined,' ');
        //...
      }
      
      ,setfunc:function(v) {
        //---
        levelGrid.persist=JSON.parse(v);
        if (levelGrid.persist.objs0) gps.objs0=levelGrid.persist.objs0;
        
        let sh=JSON.stringify(levelGrid.persist);
        if (Conet.checkOnline()) Conet.upload({fn:'gamesaves/'+lskey+'.json',data:sh});
        else localStorage[lskey]=sh;
        //...
      }
      
      }
      ,{s:'Reset',actionf:function() {
        //---
        Conet.prompt('Really reset gamesave?<br>Game progress will get lost.',{onyes:resetGameState});
        //...
      }
      }
      
      ,{s:'Seed..',actionf:function() {
        let s=prompt('Current seed is '+gps.seed+', change it?\n(You can then bookmark url to quickly get back to it.)',gps.seed);
        if (!s) return;
        if (s==gps.seed) return;
        
        let h=JSON.parse(decodeURIComponent(url.file));
        h.seed=parseInt(s);
        s='/anim/arkpark/arkpark.htm?file='+encodeURIComponent(JSON.stringify(h));
        document.location=s;
        //console.log(s);
        //alert(s);
        //...
      }
      }
      
      
      ]}
      
      ));
      
      //mmenu.sub.splice(0,0,Menu.initMenu({s:'Seed..'}));
      
      //
      
      showParty();
      
      //levelGrid.objs[0].onselect();
      //...
    }
    
    function showParty() {
      //---
      levelStarted=undefined;
      
      //cano.objs.push({sa:['Your Party ↴    Start a game →'],alignCenter:1,fs:16,x:-w*4,y:-w*1.65,w:w*8,h:w,dontmove:1,bgcol:'#eea'});
      
      cano.objs.push({sa:['Your Party ↴'],alignCenter:1,fs:16,x:-w*4-w/4,y:-w*1.65,w:w*4,h:w,dontmove:1,bgcol:'#aaa'});
      cano.objs.push({sa:['Start a game →'],alignCenter:1,fs:16,x:w/4,y:-w*1.65,w:w*4,h:w,dontmove:1,bgcol:'#eea'
      
      ,onselect:function() {
        //---
        cano.tweens.push({o:cano.view,t:0,mt:500,k:'posx',v0:cano.view.posx,v1:-400-lw*w/2+b/2});
        //...
      }
      
      });
      
      
      let f=4,bf=0.2,l=gps.objs0.length;
      for (let i=0;i<l;i++) {
        console.log('showParty '+i);
        let o=Conet.hcopy(gps.objs0[i]);
        o.x=i;o.y=0;o.a=Math.PI;//o.mhp=o.hp;o.w=1;
        let c={s:'u'+i,x:(i-l/2+bf/2)*w*f,y:0,w:w*f*(1-bf),h:w*f*(1-bf),dontmove:1,
          bgcol:parties[o.party].col,
          userData:{o:o},draw:canoDraw,
          img:loadImage(o.src||('/canvas/cutout/tiles/'+(o.heal?'md':'sw')+'.png.txt'))
        };
        cano.objs.push(c);
      }
      //...
    }
    
    let w=(gps.w||50)*0.7,//,lw=w*0.7
        b=w*0.15,lw=5,lh=10; 
    
    
    levelGrid.objs=[];
    
    //console.log('initLevelGrid 0');
    //Conet.prompt('Really restart?',{});
    //console.log('initLevelGrid 1');
    
    if (Conet.checkOnline())
    Conet.download({fn:'gamesaves/'+lskey+'.json',f:function(v) {
      //---
      //onsole.log(v);
      init(v);
      //...
    }
      });
    else init(localStorage[lskey]);
      
    //console.log(c);
    //...
  }
  //---
  (function() {
    //...
    url=Conet.parseUrl();
    edit=url.edit;
    if (edit) fow=false;
    Sound.vol=0.1;
    Conet.seed(url.seed?parseInt(url.seed):1);
    
    if (url.file) {
      gps=JSON.parse(decodeURIComponent(url.file));
      levelGrid=gps.levelGrid;
    }
    
    let cfm;
    
    if (!levelGrid) {
    cfm=Conet.fileMenu({fn:'/anim/arkpark/maps/files.txt',defFn:'/anim/arkpark/maps/small.json',url:'fn',noStartLoad:url.file?1:0,
    loadf:load
    ,_savef:function(v) {
      
      //---
      
    }
    });
    
    cfm.sub.push({s:'Ex-/Import',cstay:1,r:1,doctrl:'Export/Import level',ta:true,jsonCheck:1
    ,valuef:function() {
      //---
      let a=[];
      for (let b of gps.blocks) if (!b.notSerialize) a.push(b);
      let h=Conet.hcopy(gps);
      if (a.length>0) h.blocks=a; else delete(h.blocks);
      return JSON.stringify(h,undefined,' ');
      //...
    }
    ,setfunc:function(v) {
      //---
      gps=JSON.parse(v);
      restart();
      //...
    }
    
    });
    }
    
    let mRestart={s:'Restart',fs:1.4,vCenter:1,actionf:function() {
      //---
      Conet.prompt('Really Restart ?',{onyes:restart});
      //...
    }
        },
        mReplay={s:'Replay',vCenter:1,fs:1.2,sub:[
    {s:'Data',fs:1.4,doctrl:'Replay export',ta:true,close_:true,valuef:function() {
      var s='';
      for (var i=0;i<process.length;i++) s+=(i==0?'[':',\n')+JSON.stringify(process[i]);
      s+=']';
      return s;
    }
    ,setfunc:function(v) {
      process=JSON.parse(v);
      console.log('arkpark process len='+process.length);
    }
    },{s:'Play',fs:1.4,vCenter:1,actionf:processToggle
    },{s:'Load Replay<br>Howto win',fs:0.8,actionf:function() {
      
      process=[["gameVersion","1.163 "],
      ["oinit",{"x":17,"y":8,"w":1,"env":1}],
      ["oinit",{"x":11,"y":16,"w":1,"env":1}],
      ["oinit",{"x":13,"y":18,"w":1,"env":1}],
      ["oinit",{"x":1,"y":13,"w":1,"env":1}],
      ["oinit",{"x":8,"y":3,"w":1,"env":1}],
      ["oinit",{"x":4,"y":0,"w":1,"env":1}],
      ["oinit",{"x":4,"y":19,"w":1,"env":1}],
      ["oinit",{"x":4,"y":13,"w":1,"env":1}],
      ["oinit",{"party":1,"hp":8,"ap":2,"w":2,"mhp":8,"x":1,"y":0,"a":3}],
      ["p",8,1,0],
      ["oinit",{"party":1,"hp":8,"ap":2,"w":2,"mhp":8,"x":0,"y":5,"a":1}],
      ["p",9,0,5],
      ["oinit",{"party":1,"hp":8,"ap":2,"w":2,"mhp":8,"x":15,"y":5,"a":2}],
      ["p",10,15,5],
      ["oinit",{"x_":11,"y":10,"party":0,"w":1,"ap":1,"hp":5,"mhp":5,"x":9,"a":3}],
      ["p",11,9,10],
      ["oinit",{"x_":11,"y":11,"party":0,"w":1,"ap":1,"hp":5,"mhp":5,"x":9,"a":0}],
      ["p",12,9,11],
      ["oinit",{"x_":11,"y":11,"party":0,"w":1,"ap":1,"hp":5,"mhp":5,"x":8,"a":2}],
      ["p",13,8,11],
      ["oinit",{"party":1,"hp":3,"w":1,"ap":1,"mhp":3,"x":10,"y":0,"a":0}],
      ["p",14,10,0],
      ["oinit",{"party":1,"hp":3,"w":1,"ap":1,"mhp":3,"x":9,"y":19,"a":3}],
      ["p",15,9,19],
      ["oinit",{"party":1,"hp":3,"w":1,"ap":1,"mhp":3,"x":5,"y":0,"a":1}],
      ["p",16,5,0],
      ["oinit",{"party":1,"hp":3,"w":1,"ap":1,"mhp":3,"x":2,"y":4,"a":3}],
      ["p",17,2,4],
      ["oinit",{"party":1,"hp":3,"w":1,"ap":1,"mhp":3,"x":12,"y":6,"a":2}],
      ["p",18,12,6],
      ["oinit",{"party":1,"hp":3,"w":1,"ap":1,"mhp":3,"x":6,"y":10,"a":3}],
      ["p",19,6,10],
      ["oinit",{"party":1,"hp":3,"w":1,"ap":1,"mhp":3,"x":14,"y":10,"a":0}],
      ["p",20,14,10],
      ["oinit",{"party":1,"hp":3,"w":1,"ap":1,"mhp":3,"x":17,"y":1,"a":0}],
      ["p",21,17,1],
      ["oinit",{"party":1,"hp":3,"w":1,"ap":1,"mhp":3,"x":14,"y":15,"a":2}],
      ["p",22,14,15],
      ["oinit",{"party":1,"hp":3,"w":1,"ap":1,"mhp":3,"x":16,"y":16,"a":2}],
      ["p",23,16,16],
      ["p",13,8,11],
      ["p",13,7,11],
      ["p",13,6,11],
      ["p",13,6,11],
      ["attack",13,6,10],
      ["p",12,9,11],
      ["p",12,8,11],
      ["p",12,7,11],
      ["p",12,7,10],
      ["p",12,7,10],
      ["attack",12,6,10],
      ["p",11,9,10],
      ["p",11,9,11],
      ["p",11,8,11],
      ["p",11,7,11],
      ["p",23,16,16],
      ["p",23,16,17],
      ["p",23,16,18],
      ["p",23,16,19],
      ["p",22,14,15],
      ["p",22,14,14],
      ["p",22,14,13],
      ["p",22,15,13],
      ["p",21,17,1],
      ["p",21,16,1],
      ["p",21,15,1],
      ["p",21,14,1],
      ["p",20,14,10],
      ["p",20,13,10],
      ["p",20,12,10],
      ["p",20,11,10],
      ["p",19,6,10],
      ["p",19,5,10],
      ["p",19,5,11],
      ["p",19,5,11],
      ["attack",19,6,11],
      ["p",18,12,6],
      ["p",18,13,6],
      ["p",18,13,5],
      ["p",18,13,4],
      ["p",17,2,4],
      ["p",17,1,4],
      ["p",17,1,3],
      ["p",17,1,2],
      ["p",16,5,0],
      ["p",16,5,1],
      ["p",16,6,1],
      ["p",16,7,1],
      ["p",15,9,19],
      ["p",15,8,19],
      ["p",15,8,18],
      ["p",15,8,17],
      ["p",14,10,0],
      ["p",14,10,1],
      ["p",14,10,2],
      ["p",14,9,2],
      ["p",10,15,5],
      ["p",10,16,5],
      ["p",10,17,5],
      ["p",10,17,4],
      ["p",9,0,5],
      ["p",9,0,6],
      ["p",9,0,7],
      ["p",9,1,7],
      ["p",8,1,0],
      ["p",8,2,0],
      ["p",8,3,0],
      ["p",8,4,0],
      ["p",12,7,10],
      ["p",12,6,10],
      ["p",12,5,10],
      ["p",12,5,10],
      ["attack",12,5,11],
      ["oremove",19],
      ["p",13,6,11],
      ["p",13,5,11],
      ["p",13,4,11],
      ["p",13,3,11],
      ["p",11,7,11],
      ["p",11,6,11],
      ["p",11,5,11],
      ["p",11,4,11],
      ["p",22,16,19],
      ["p",22,16,18],
      ["p",22,16,17],
      ["p",22,16,16],
      ["p",21,15,13],
      ["p",21,14,13],
      ["p",21,14,14],
      ["p",21,14,15],
      ["p",20,14,1],
      ["p",20,15,1],
      ["p",20,16,1],
      ["p",20,16,0],
      ["p",19,11,10],
      ["p",19,12,10],
      ["p",19,12,11],
      ["p",19,13,11],
      ["p",18,13,4],
      ["p",18,13,5],
      ["p",18,13,6],
      ["p",18,14,6],
      ["p",17,1,2],
      ["p",17,1,1],
      ["p",17,1,0],
      ["p",17,2,0],
      ["p",16,7,1],
      ["p",16,7,2],
      ["p",16,7,3],
      ["p",16,8,3],
      ["p",15,8,17],
      ["p",15,8,16],
      ["p",15,9,16],
      ["p",15,10,16],
      ["p",14,9,2],
      ["p",14,8,2],
      ["p",14,7,2],
      ["p",14,7,3],
      ["p",10,17,4],
      ["p",10,17,5],
      ["p",10,17,6],
      ["p",10,17,7],
      ["p",9,1,7],
      ["p",9,0,7],
      ["p",9,0,6],
      ["p",9,0,5],
      ["p",8,4,0],
      ["p",8,5,0],
      ["p",8,6,0],
      ["p",8,7,0],
      ["p",12,5,10],
      ["p",12,6,10],
      ["p",12,7,10],
      ["p",12,7,11],
      ["p",11,4,11],
      ["p",11,5,11],
      ["p",11,6,11],
      ["p",11,6,12],
      ["p",13,3,11],
      ["p",13,4,11],
      ["p",13,5,11],
      ["p",13,6,11],
      ["p",22,16,16],
      ["p",22,16,15],
      ["p",22,16,14],
      ["p",22,15,14],
      ["p",21,14,15],
      ["p",21,13,15],
      ["p",21,13,14],
      ["p",21,13,13],
      ["p",20,16,0],
      ["p",20,16,1],
      ["p",20,16,2],
      ["p",20,16,3],
      ["p",19,13,11],
      ["p",19,12,11],
      ["p",19,11,11],
      ["p",19,11,12],
      ["p",18,14,6],
      ["p",18,13,6],
      ["p",18,13,5],
      ["p",18,13,4],
      ["p",17,2,0],
      ["p",17,2,1],
      ["p",17,1,1],
      ["p",17,1,2],
      ["p",16,8,3],
      ["p",16,8,4],
      ["p",16,7,4],
      ["p",16,6,4],
      ["p",15,10,16],
      ["p",15,9,16],
      ["p",15,8,16],
      ["p",15,8,17],
      ["p",14,7,3],
      ["p",14,8,3],
      ["p",14,9,3],
      ["p",14,10,3],
      ["p",10,17,7],
      ["p",10,17,6],
      ["p",10,16,6],
      ["p",10,15,6],
      ["p",9,0,5],
      ["p",9,0,6],
      ["p",9,0,7],
      ["p",9,1,7],
      ["p",8,7,0],
      ["p",8,7,1],
      ["p",8,7,2],
      ["p",8,7,3],
      ["p",12,7,11],
      ["p",12,8,11],
      ["p",12,9,11],
      ["p",12,9,10],
      ["p",11,6,12],
      ["p",11,7,12],
      ["p",11,7,11],
      ["p",11,8,11],
      ["p",13,6,11],
      ["p",13,6,12],
      ["p",13,7,12],
      ["p",13,8,12],
      ["p",22,15,14],
      ["p",22,16,14],
      ["p",22,16,15],
      ["p",22,16,16],
      ["p",21,13,13],
      ["p",21,14,13],
      ["p",21,15,13],
      ["p",21,15,14],
      ["p",20,16,3],
      ["p",20,16,4],
      ["p",20,16,5],
      ["p",20,17,5],
      ["p",19,11,12],
      ["p",19,10,12],
      ["p",19,9,12],
      ["p",19,9,12],
      ["attack",19,8,12],
      ["p",18,13,4],
      ["p",18,13,5],
      ["p",18,12,5],
      ["p",18,11,5],
      ["p",17,1,2],
      ["p",17,1,1],
      ["p",17,2,1],
      ["p",17,3,1],
      ["p",16,6,4],
      ["p",16,6,5],
      ["p",16,7,5],
      ["p",16,8,5],
      ["p",15,8,17],
      ["p",15,8,16],
      ["p",14,10,3],
      ["p",14,9,3],
      ["p",14,9,2],
      ["p",14,8,2],
      ["p",10,15,6],
      ["p",10,16,6],
      ["p",10,16,7],
      ["p",10,16,8],
      ["p",9,1,7],
      ["p",9,2,7],
      ["p",9,3,7],
      ["p",9,3,8],
      ["p",8,7,3],
      ["p",12,9,10],
      ["p",12,9,11],
      ["p",12,10,11],
      ["p",12,10,12],
      ["p",12,10,12],
      ["attack",12,9,12],
      ["p",11,8,11],
      ["p",11,9,11],
      ["p",11,9,11],
      ["attack",11,9,12],
      ["p",13,8,12],
      ["attack",13,9,12],
      ["oremove",19],
      ["p",21,16,16],
      ["p",21,16,17],
      ["p",21,16,18],
      ["p",21,16,19],
      ["p",20,15,14],
      ["p",20,14,14],
      ["p",20,14,15],
      ["p",20,14,16],
      ["p",19,17,5],
      ["p",19,18,5],
      ["p",19,18,6],
      ["p",19,18,7],
      ["p",18,11,5],
      ["p",18,11,6],
      ["p",18,11,7],
      ["p",18,11,8],
      ["p",17,3,1],
      ["p",17,4,1],
      ["p",17,5,1],
      ["p",17,6,1],
      ["p",16,8,5],
      ["p",16,7,5],
      ["p",16,6,5],
      ["p",16,6,6],
      ["p",15,8,16],
      ["p",15,8,17],
      ["p",15,8,18],
      ["p",15,8,19],
      ["p",14,8,2],
      ["p",14,9,2],
      ["p",14,9,3],
      ["p",14,10,3],
      ["p",10,16,8],
      ["p",10,15,8],
      ["p",10,15,9],
      ["p",10,14,9],
      ["p",9,3,8],
      ["p",9,3,7],
      ["p",9,4,7],
      ["p",9,5,7],
      ["p",8,7,3],
      ["p",8,7,2],
      ["p",8,7,1],
      ["p",8,7,0],
      ["p",13,8,12],
      ["p",13,7,12],
      ["p",13,6,12],
      ["p",13,6,13],
      ["p",11,9,11],
      ["p",11,9,12],
      ["p",11,8,12],
      ["p",11,7,12],
      ["p",12,10,12],
      ["p",12,10,11],
      ["p",12,9,11],
      ["p",12,8,11],
      ["p",21,16,19],
      ["p",21,16,18],
      ["p",21,16,17],
      ["p",21,16,16],
      ["p",20,14,16],
      ["p",20,14,15],
      ["p",20,14,14],
      ["p",20,14,13],
      ["p",19,18,7],
      ["p",19,17,7],
      ["p",19,16,7],
      ["p",19,16,8],
      ["p",18,11,8],
      ["p",18,11,7],
      ["p",18,11,6],
      ["p",18,11,5],
      ["p",17,6,1],
      ["p",17,5,1],
      ["p",17,5,2],
      ["p",17,4,2],
      ["p",16,6,6],
      ["p",16,7,6],
      ["p",16,7,5],
      ["p",16,8,5],
      ["p",15,8,19],
      ["p",15,9,19],
      ["p",15,10,19],
      ["p",15,10,18],
      ["p",14,10,3],
      ["p",14,9,3],
      ["p",14,8,3],
      ["p",14,8,2],
      ["p",10,14,9],
      ["p",10,14,8],
      ["p",10,14,7],
      ["p",10,14,6],
      ["p",9,5,7],
      ["p",9,6,7],
      ["p",9,6,6],
      ["p",9,6,5],
      ["p",8,7,0],
      ["p",8,6,0],
      ["p",8,5,0],
      ["p",8,4,0],
      ["p",12,8,11],
      ["p",12,9,11],
      ["p",12,10,11],
      ["p",12,11,11],
      ["p",11,7,12],
      ["p",11,8,12],
      ["p",11,9,12],
      ["p",11,10,12],
      ["p",13,6,13],
      ["p",13,6,12],
      ["p",13,7,12],
      ["p",13,8,12],
      ["p",21,16,16],
      ["p",21,16,15],
      ["p",21,16,14],
      ["p",21,15,14],
      ["p",20,14,13],
      ["p",20,15,13],
      ["p",20,16,13],
      ["p",20,17,13],
      ["p",19,16,8],
      ["p",19,17,8],
      ["p",19,18,8],
      ["p",19,18,7],
      ["p",18,11,5],
      ["p",18,12,5],
      ["p",18,13,5],
      ["p",18,13,6],
      ["p",17,4,2],
      ["p",17,4,3],
      ["p",17,3,3],
      ["p",17,3,4],
      ["p",16,8,5],
      ["p",16,8,4],
      ["p",16,7,4],
      ["p",16,6,4],
      ["p",15,10,18],
      ["p",15,10,19],
      ["p",15,9,19],
      ["p",15,8,19],
      ["p",14,8,2],
      ["p",14,8,3],
      ["p",14,8,4],
      ["p",14,8,5],
      ["p",10,14,6],
      ["p",10,14,7],
      ["p",10,15,7],
      ["p",10,15,8],
      ["p",9,6,5],
      ["p",9,6,6],
      ["p",9,6,7],
      ["p",9,5,7],
      ["p",8,4,0],
      ["p",8,3,0],
      ["p",8,2,0],
      ["p",8,1,0],
      ["p",12,11,11],
      ["p",12,12,11],
      ["p",11,10,12],
      ["p",11,11,12],
      ["p",11,11,11],
      ["p",11,11,10],
      ["p",13,8,12],
      ["p",13,9,12],
      ["p",13,10,12],
      ["p",13,11,12],
      ["p",21,15,14],
      ["p",21,16,14],
      ["p",21,16,15],
      ["p",21,16,16],
      ["p",20,17,13],
      ["p",20,16,13],
      ["p",20,15,13],
      ["p",20,15,14],
      ["p",19,18,7],
      ["p",19,18,6],
      ["p",19,18,5],
      ["p",19,18,4],
      ["p",18,13,6],
      ["p",18,13,5],
      ["p",18,13,4],
      ["p",18,13,3],
      ["p",17,3,4],
      ["p",17,3,5],
      ["p",17,4,5],
      ["p",17,4,6],
      ["p",16,6,4],
      ["p",16,7,4],
      ["p",16,7,3],
      ["p",16,7,2],
      ["p",15,8,19],
      ["p",15,8,18],
      ["p",15,8,17],
      ["p",15,8,16],
      ["p",14,8,5],
      ["p",14,7,5],
      ["p",14,6,5],
      ["p",14,5,5],
      ["p",10,15,8],
      ["p",10,16,8],
      ["p",10,17,8],
      ["p",10,17,9],
      ["p",9,5,7],
      ["p",9,4,7],
      ["p",9,3,7],
      ["p",9,2,7],
      ["p",8,1,0],
      ["p",8,0,0],
      ["p",8,0,1],
      ["p",8,0,2],
      ["p",12,12,11],
      ["p",12,13,11],
      ["p",11,11,10],
      ["p",11,12,10],
      ["p",13,11,12],
      ["p",13,11,11],
      ["p",13,12,11],
      ["p",21,16,16],
      ["p",21,16,15],
      ["p",21,16,14],
      ["p",21,17,14],
      ["p",20,15,14],
      ["p",20,15,13],
      ["p",20,16,13],
      ["p",20,17,13],
      ["p",19,18,4],
      ["p",19,18,5],
      ["p",19,18,6],
      ["p",19,18,7],
      ["p",18,13,3],
      ["p",18,13,4],
      ["p",18,13,5],
      ["p",18,14,5],
      ["p",17,4,6],
      ["p",17,4,7],
      ["p",17,5,7],
      ["p",17,6,7],
      ["p",16,7,2],
      ["p",16,7,1],
      ["p",16,8,1],
      ["p",16,8,0],
      ["p",15,8,16],
      ["p",15,8,17],
      ["p",15,8,18],
      ["p",15,8,19],
      ["p",14,5,5],
      ["p",14,4,5],
      ["p",14,4,6],
      ["p",14,4,7],
      ["p",10,17,9],
      ["p",10,17,10],
      ["p",10,18,10],
      ["p",10,18,11],
      ["p",9,2,7],
      ["p",9,1,7],
      ["p",9,0,7],
      ["p",9,0,6],
      ["p",8,0,2],
      ["p",8,0,1],
      ["p",8,0,0],
      ["p",8,1,0],
      ["p",12,13,11],
      ["p",12,13,10],
      ["p",12,13,9],
      ["p",12,13,8],
      ["p",11,12,10],
      ["p",11,13,10],
      ["p",11,13,9],
      ["p",11,14,9],
      ["p",13,12,11],
      ["p",13,12,10],
      ["p",13,13,10],
      ["p",13,13,9],
      ["p",21,17,14],
      ["p",21,16,14],
      ["p",21,15,14],
      ["p",21,14,14],
      ["p",20,17,13],
      ["p",20,17,14],
      ["p",20,16,14],
      ["p",20,16,15],
      ["p",19,18,7],
      ["p",19,18,6],
      ["p",19,18,5],
      ["p",19,17,5],
      ["p",18,14,5],
      ["p",18,14,6],
      ["p",18,14,7],
      ["p",18,13,7],
      ["p",18,13,7],
      ["attack",18,13,8],
      ["p",17,6,7],
      ["p",17,6,8],
      ["p",17,7,8],
      ["p",17,8,8],
      ["p",16,8,0],
      ["p",16,8,1],
      ["p",16,7,1],
      ["p",16,7,2],
      ["p",15,8,19],
      ["p",15,9,19],
      ["p",15,10,19],
      ["p",15,10,18],
      ["p",14,4,7],
      ["p",14,4,8],
      ["p",14,5,8],
      ["p",14,6,8],
      ["p",10,18,11],
      ["p",10,18,12],
      ["p",10,18,13],
      ["p",10,17,13],
      ["p",9,0,6],
      ["p",9,0,5],
      ["p",9,0,4],
      ["p",9,0,3],
      ["p",8,1,0],
      ["p",8,2,0],
      ["p",8,3,0],
      ["p",8,4,0],
      ["p",11,14,9],
      ["p",11,14,8],
      ["p",11,14,7],
      ["p",11,14,7],
      ["attack",11,13,7],
      ["p",12,13,8],
      ["attack",12,13,7],
      ["p",21,14,14],
      ["p",21,14,13],
      ["p",21,15,13],
      ["p",21,16,13],
      ["p",20,16,15],
      ["p",20,16,14],
      ["p",20,15,14],
      ["p",20,15,13],
      ["p",19,17,5],
      ["p",19,17,6],
      ["p",19,17,7],
      ["p",19,17,8],
      ["p",18,13,7],
      ["p",18,13,7],
      ["attack",18,13,8],
      ["p",17,8,8],
      ["p",17,9,8],
      ["p",17,10,8],
      ["p",17,10,7],
      ["p",16,7,2],
      ["p",16,7,3],
      ["p",16,7,4],
      ["p",16,6,4],
      ["p",15,10,18],
      ["p",15,11,18],
      ["p",15,12,18],
      ["p",15,13,18],
      ["p",14,6,8],
      ["p",14,7,8],
      ["p",14,8,8],
      ["p",14,9,8],
      ["p",10,17,13],
      ["p",10,18,13],
      ["p",10,18,12],
      ["p",10,18,11],
      ["p",9,0,3],
      ["p",9,0,2],
      ["p",9,0,1],
      ["p",9,0,0],
      ["p",8,4,0],
      ["p",8,5,0],
      ["p",8,6,0],
      ["p",8,7,0],
      ["p",12,13,8],
      ["attack",12,13,7],
      ["oremove",18],
      ["p",20,16,13],
      ["p",20,16,14],
      ["p",20,16,15],
      ["p",20,16,16],
      ["p",19,15,13],
      ["p",19,15,14],
      ["p",19,14,14],
      ["p",19,14,15],
      ["p",18,17,8],
      ["p",18,16,8],
      ["p",18,15,8],
      ["p",18,14,8],
      ["p",18,14,8],
      ["attack",18,13,8],
      ["p",17,10,7],
      ["p",17,11,7],
      ["p",17,11,6],
      ["p",16,6,4],
      ["p",16,7,4],
      ["p",16,7,3],
      ["p",16,7,2],
      ["p",15,13,18],
      ["p",15,13,17],
      ["p",15,13,16],
      ["p",15,14,16],
      ["p",14,9,8],
      ["p",14,9,7],
      ["p",14,10,7],
      ["p",10,18,11],
      ["p",10,18,12],
      ["p",10,18,13],
      ["p",10,17,13],
      ["p",9,0,0],
      ["p",9,1,0],
      ["p",9,2,0],
      ["p",9,3,0],
      ["p",8,7,0],
      ["p",8,6,0],
      ["p",8,5,0],
      ["p",11,14,7],
      ["attack",11,14,8],
      ["p",12,13,8],
      ["attack",12,14,8],
      ["p",13,13,9],
      ["p",13,14,9],
      ["p",13,14,9],
      ["attack",13,14,8],
      ["oremove",18],
      ["p",19,16,16],
      ["p",19,16,15],
      ["p",19,16,14],
      ["p",19,16,13],
      ["p",18,14,15],
      ["p",18,14,14],
      ["p",18,13,14],
      ["p",18,13,13],
      ["p",17,11,6],
      ["p",17,12,6],
      ["p",17,13,6],
      ["p",17,13,7],
      ["p",17,13,7],
      ["attack",17,13,8],
      ["p",16,7,2],
      ["p",16,8,2],
      ["p",16,9,2],
      ["p",16,9,3],
      ["p",15,14,16],
      ["p",15,14,15],
      ["p",15,14,14],
      ["p",15,13,14],
      ["p",14,10,7],
      ["p",14,11,7],
      ["p",14,11,6],
      ["p",14,12,6],
      ["p",10,17,13],
      ["p",10,18,13],
      ["p",10,18,12],
      ["p",10,18,11],
      ["p",9,3,0],
      ["p",9,2,0],
      ["p",9,1,0],
      ["p",9,0,0],
      ["p",8,5,0],
      ["p",8,6,0],
      ["p",8,7,0],
      ["p",8,7,1],
      ["p",11,14,7],
      ["p",11,14,6],
      ["p",11,13,6],
      ["p",11,13,6],
      ["attack",11,13,7],
      ["p",13,14,9],
      ["p",13,14,8],
      ["p",13,14,7],
      ["p",13,14,7],
      ["attack",13,13,7],
      ["p",12,13,8],
      ["attack",12,13,7],
      ["oremove",17],
      ["p",18,16,13],
      ["p",18,15,13],
      ["p",18,15,14],
      ["p",18,14,14],
      ["p",17,13,13],
      ["p",17,14,13],
      ["p",17,15,13],
      ["p",17,16,13],
      ["p",16,9,3],
      ["p",16,10,3],
      ["p",16,11,3],
      ["p",16,11,4],
      ["p",15,13,14],
      ["p",15,13,15],
      ["p",15,14,15],
      ["p",15,14,16],
      ["p",14,12,6],
      ["p",14,12,6],
      ["attack",14,13,6],
      ["p",10,18,11],
      ["p",10,18,12],
      ["p",10,18,13],
      ["p",10,17,13],
      ["p",9,0,0],
      ["p",9,0,1],
      ["p",9,0,2],
      ["p",9,0,3],
      ["p",8,7,1],
      ["p",8,7,2],
      ["p",8,8,2],
      ["p",8,9,2],
      ["p",12,13,8],
      ["p",12,14,8],
      ["p",12,15,8],
      ["p",12,16,8],
      ["p",12,16,8],
      ["attack",12,17,8],
      ["p",11,13,6],
      ["p",11,13,5],
      ["p",11,12,5],
      ["p",11,12,5],
      ["attack",11,12,6],
      ["p",13,14,7],
      ["p",13,14,6],
      ["p",13,13,6],
      ["p",13,13,6],
      ["attack",13,12,6],
      ["p",18,14,14],
      ["p",18,13,14],
      ["p",18,13,15],
      ["p",18,13,16],
      ["p",17,16,13],
      ["p",17,15,13],
      ["p",17,14,13],
      ["p",17,14,14],
      ["p",16,11,4],
      ["p",16,11,5],
      ["p",16,11,5],
      ["attack",16,12,5],
      ["p",15,14,16],
      ["p",15,14,17],
      ["p",15,14,18],
      ["p",15,13,18],
      ["p",14,12,6],
      ["p",14,12,6],
      ["attack",14,12,5],
      ["p",10,17,13],
      ["p",10,18,13],
      ["p",10,18,12],
      ["p",10,18,11],
      ["p",9,0,3],
      ["p",9,0,4],
      ["p",9,0,5],
      ["p",9,0,6],
      ["p",8,9,2],
      ["p",8,10,2],
      ["p",8,10,1],
      ["p",13,13,6],
      ["attack",13,12,6],
      ["oremove",14],
      ["p",11,12,5],
      ["attack",11,11,5],
      ["p",17,13,16],
      ["p",17,13,15],
      ["p",17,13,14],
      ["p",17,13,13],
      ["p",16,14,14],
      ["p",16,14,13],
      ["p",16,15,13],
      ["p",16,16,13],
      ["p",15,11,5],
      ["p",15,11,5],
      ["attack",15,12,5],
      ["p",14,13,18],
      ["p",14,13,17],
      ["p",14,13,16],
      ["p",14,13,15],
      ["p",10,18,11],
      ["p",10,18,12],
      ["p",10,18,13],
      ["p",10,17,13],
      ["p",9,0,6],
      ["p",9,0,7],
      ["p",9,1,7],
      ["p",9,2,7],
      ["p",8,10,1],
      ["p",8,10,0],
      ["p",8,11,0],
      ["p",8,12,0],
      ["p",12,16,8],
      ["p",12,17,8],
      ["p",12,18,8],
      ["p",12,18,8],
      ["attack",12,17,8],
      ["p",13,13,6],
      ["p",13,12,6],
      ["p",13,11,6],
      ["p",13,11,6],
      ["attack",13,11,5],
      ["p",11,12,5],
      ["attack",11,11,5],
      ["oremove",15],
      ["p",16,13,13],
      ["p",16,13,14],
      ["p",16,14,14],
      ["p",16,14,15],
      ["p",15,16,13],
      ["p",15,15,13],
      ["p",15,14,13],
      ["p",15,13,13],
      ["p",14,13,15],
      ["p",14,13,14],
      ["p",14,14,14],
      ["p",14,15,14],
      ["p",10,17,13],
      ["p",10,18,13],
      ["p",9,2,7],
      ["p",9,3,7],
      ["p",9,3,8],
      ["p",9,3,9],
      ["p",8,12,0],
      ["p",8,13,0],
      ["p",8,14,0],
      ["p",8,15,0],
      ["p",12,18,8],
      ["p",12,17,8],
      ["oremove",0],
      ["p",10,12,5],
      ["p",10,11,5],
      ["p",10,11,4],
      ["p",10,11,3],
      ["p",12,11,6],
      ["p",12,11,5],
      ["p",12,11,4],
      ["p",15,14,15],
      ["p",15,14,16],
      ["p",15,14,17],
      ["p",15,13,17],
      ["p",14,13,13],
      ["p",14,14,13],
      ["p",14,15,13],
      ["p",14,16,13],
      ["p",13,15,14],
      ["p",13,14,14],
      ["p",13,13,14],
      ["p",13,13,15],
      ["p",9,18,13],
      ["p",9,18,12],
      ["p",8,3,9],
      ["p",8,3,10],
      ["p",8,2,10],
      ["p",8,1,10],
      ["p",7,15,0],
      ["p",7,16,0],
      ["p",7,17,0],
      ["p",7,18,0],
      ["p",10,11,3],
      ["p",10,10,3],
      ["p",10,9,3],
      ["p",10,8,3],
      ["oremove",3],
      ["p",10,17,8],
      ["p",10,16,8],
      ["p",10,15,8],
      ["p",10,15,7],
      ["p",11,11,4],
      ["p",11,11,3],
      ["p",11,10,3],
      ["p",11,9,3],
      ["p",14,13,17],
      ["p",14,13,18],
      ["p",14,12,18],
      ["p",14,11,18],
      ["p",13,16,13],
      ["p",13,17,13],
      ["p",13,17,14],
      ["p",13,18,14],
      ["p",12,13,15],
      ["p",12,13,14],
      ["p",12,14,14],
      ["p",12,15,14],
      ["p",8,18,12],
      ["p",8,18,11],
      ["p",8,18,10],
      ["p",8,17,10],
      ["p",7,1,10],
      ["p",7,2,10],
      ["p",7,3,10],
      ["p",7,3,9],
      ["p",6,18,0],
      ["p",6,17,0],
      ["p",6,16,0],
      ["p",6,15,0],
      ["p",10,15,7],
      ["p",10,14,7],
      ["p",10,13,7],
      ["p",10,13,6],
      ["p",14,11,18],
      ["p",14,12,18],
      ["p",14,13,18],
      ["p",14,13,19],
      ["p",13,18,14],
      ["p",13,17,14],
      ["p",13,16,14],
      ["p",13,16,13],
      ["p",12,15,14],
      ["p",12,16,14],
      ["p",12,17,14],
      ["p",12,17,13],
      ["p",8,17,10],
      ["p",8,17,9],
      ["p",8,16,9],
      ["p",8,15,9],
      ["p",7,3,9],
      ["p",7,3,8],
      ["p",7,3,7],
      ["p",7,2,7],
      ["p",6,15,0],
      ["p",6,14,0],
      ["p",6,13,0],
      ["p",6,12,0],
      ["p",11,9,3],
      ["p",11,9,2],
      ["p",11,8,2],
      ["p",11,7,2],
      ["p",10,13,6],
      ["p",10,13,5],
      ["p",10,12,5],
      ["p",10,11,5],
      ["p",14,13,19],
      ["p",14,13,18],
      ["p",14,13,17],
      ["p",14,14,17],
      ["p",13,16,13],
      ["p",13,16,14],
      ["p",13,16,15],
      ["p",13,16,16],
      ["p",12,17,13],
      ["p",12,16,13],
      ["p",12,15,13],
      ["p",12,14,13],
      ["p",8,15,9],
      ["p",8,15,8],
      ["p",8,15,7],
      ["p",8,14,7],
      ["p",7,2,7],
      ["p",7,3,7],
      ["p",7,4,7],
      ["p",7,5,7],
      ["p",6,12,0],
      ["p",6,13,0],
      ["p",6,14,0],
      ["p",6,15,0],
      ["p",10,11,5],
      ["p",10,11,4],
      ["p",10,11,3],
      ["p",10,10,3],
      ["p",14,14,17],
      ["p",14,13,17],
      ["p",14,13,18],
      ["p",14,13,19],
      ["p",13,16,16],
      ["p",13,16,15],
      ["p",13,16,14],
      ["p",13,17,14],
      ["p",12,14,13],
      ["p",12,14,14],
      ["p",12,14,15],
      ["p",12,14,16],
      ["p",8,14,7],
      ["p",8,14,8],
      ["p",8,14,9],
      ["p",8,14,10],
      ["p",7,5,7],
      ["p",7,4,7],
      ["p",7,3,7],
      ["p",7,2,7],
      ["p",6,15,0],
      ["p",6,16,0],
      ["p",6,17,0],
      ["p",6,18,0],
      ["p",11,7,2],
      ["p",11,7,1],
      ["p",11,6,1],
      ["p",11,5,1],
      ["p",9,8,3],
      ["p",9,8,4],
      ["p",9,7,4],
      ["p",9,6,4],
      ["p",10,10,3],
      ["p",10,9,3],
      ["p",10,8,3],
      ["p",10,8,4],
      ["p",14,13,19],
      ["p",14,13,18],
      ["p",14,12,18],
      ["p",14,11,18],
      ["p",13,17,14],
      ["p",13,17,13],
      ["p",13,18,13],
      ["p",13,18,12],
      ["p",12,14,16],
      ["p",12,14,15],
      ["p",12,14,14],
      ["p",12,14,13],
      ["p",8,14,10],
      ["p",8,15,10],
      ["p",8,15,9],
      ["p",8,15,8],
      ["p",7,2,7],
      ["p",7,3,7],
      ["p",7,3,8],
      ["p",7,3,9],
      ["p",6,18,0],
      ["p",6,17,0],
      ["p",6,16,0],
      ["p",6,15,0],
      ["p",11,5,1],
      ["p",11,4,1],
      ["p",11,4,0],
      ["oremove",3],
      ["p",8,6,4],
      ["p",8,6,5],
      ["p",8,6,6],
      ["p",9,8,4],
      ["p",9,8,5],
      ["p",9,7,5],
      ["p",9,7,6],
      ["p",13,11,18],
      ["p",13,12,18],
      ["p",13,13,18],
      ["p",13,13,19],
      ["p",12,18,12],
      ["p",12,18,13],
      ["p",12,17,13],
      ["p",12,17,14],
      ["p",11,14,13],
      ["p",11,14,14],
      ["p",11,14,15],
      ["p",11,14,16],
      ["p",7,15,8],
      ["p",7,16,8],
      ["p",7,16,7],
      ["p",7,17,7],
      ["p",6,3,9],
      ["p",6,3,10],
      ["p",6,2,10],
      ["p",6,1,10],
      ["p",5,15,0],
      ["p",5,14,0],
      ["p",5,13,0],
      ["p",5,12,0],
      ["p",10,4,0],
      ["p",10,4,1],
      ["p",10,4,2],
      ["p",10,4,3],
      ["p",8,6,6],
      ["p",8,6,7],
      ["p",8,5,7],
      ["p",8,5,8],
      ["p",9,7,6],
      ["p",9,7,7],
      ["p",9,6,7],
      ["p",9,5,7],
      ["p",13,13,19],
      ["p",13,13,18],
      ["p",13,13,17],
      ["p",13,13,16],
      ["p",12,17,14],
      ["p",12,18,14],
      ["p",12,18,13],
      ["p",12,18,12],
      ["p",11,14,16],
      ["p",11,14,17],
      ["p",11,13,17],
      ["p",11,13,18],
      ["p",7,17,7],
      ["p",7,16,7],
      ["p",7,16,6],
      ["p",7,15,6],
      ["p",6,1,10],
      ["p",6,0,10],
      ["p",6,0,11],
      ["p",6,0,12],
      ["p",5,12,0],
      ["p",5,13,0],
      ["p",5,14,0],
      ["p",5,15,0],
      ["p",10,4,3],
      ["p",10,3,3],
      ["p",10,3,4],
      ["p",10,3,5],
      ["p",13,13,16],
      ["p",13,13,15],
      ["p",13,13,14],
      ["p",13,13,13],
      ["p",12,18,12],
      ["p",12,18,11],
      ["p",12,18,10],
      ["p",12,17,10],
      ["p",11,13,18],
      ["p",11,12,18],
      ["p",11,11,18],
      ["p",11,10,18],
      ["p",7,15,6],
      ["p",7,16,6],
      ["p",7,17,6],
      ["p",7,17,7],
      ["p",6,0,12],
      ["p",6,0,13],
      ["p",6,1,13],
      ["p",6,2,13],
      ["p",5,15,0],
      ["p",5,16,0],
      ["p",5,17,0],
      ["p",5,18,0],
      ["p",10,3,5],
      ["p",10,4,5],
      ["p",10,4,6],
      ["p",10,4,7],
      ["p",13,13,13],
      ["p",13,13,14],
      ["p",13,13,15],
      ["p",13,13,16],
      ["p",12,17,10],
      ["p",12,18,10],
      ["p",12,18,11],
      ["p",12,18,12],
      ["p",11,10,18],
      ["p",11,10,19],
      ["p",11,9,19],
      ["p",11,8,19],
      ["p",7,17,7],
      ["p",7,17,6],
      ["p",7,17,5],
      ["p",7,16,5],
      ["p",6,2,13],
      ["p",6,1,13],
      ["p",6,0,13],
      ["p",6,0,12],
      ["p",5,18,0],
      ["p",5,17,0],
      ["p",5,16,0],
      ["p",5,15,0],
      ["p",13,13,16],
      ["p",13,14,16],
      ["p",13,14,17],
      ["p",13,14,18],
      ["p",12,18,12],
      ["p",12,19,12],
      ["p",12,19,11],
      ["p",12,19,10],
      ["p",11,8,19],
      ["p",11,9,19],
      ["p",11,10,19],
      ["p",11,10,18],
      ["p",7,16,5],
      ["p",7,15,5],
      ["p",7,14,5],
      ["p",7,14,4],
      ["p",6,0,12],
      ["p",6,0,13],
      ["p",6,0,14],
      ["p",6,0,15],
      ["p",5,15,0],
      ["p",5,14,0],
      ["p",5,13,0],
      ["p",5,12,0],
      ["p",10,4,7],
      ["p",10,4,8],
      ["p",10,4,9],
      ["p",10,4,10],
      ["p",8,5,8],
      ["p",8,4,8],
      ["p",8,4,9],
      ["p",9,5,7],
      ["p",9,4,7],
      ["p",9,3,7],
      ["p",9,3,8],
      ["p",13,14,18],
      ["p",13,14,17],
      ["p",13,14,16],
      ["p",13,14,15],
      ["p",12,19,10],
      ["p",12,19,11],
      ["p",12,19,12],
      ["p",12,19,13],
      ["p",11,10,18],
      ["p",11,11,18],
      ["p",11,12,18],
      ["p",11,13,18],
      ["p",7,14,4],
      ["p",7,15,4],
      ["p",7,16,4],
      ["p",7,17,4],
      ["p",6,0,15],
      ["p",6,0,16],
      ["p",6,0,17],
      ["p",6,0,18],
      ["p",5,12,0],
      ["p",5,13,0],
      ["p",5,14,0],
      ["p",5,15,0],
      ["p",10,4,10],
      ["p",10,3,10],
      ["p",10,3,11],
      ["p",9,3,8],
      ["p",9,3,9],
      ["p",9,3,10],
      ["p",8,4,9],
      ["p",8,4,10],
      ["p",8,4,11],
      ["p",13,14,15],
      ["p",13,14,14],
      ["p",13,15,14],
      ["p",13,16,14],
      ["p",12,19,13],
      ["p",12,18,13],
      ["p",12,17,13],
      ["p",12,16,13],
      ["p",11,13,18],
      ["p",11,13,17],
      ["p",11,13,16],
      ["p",11,14,16],
      ["p",7,17,4],
      ["p",7,17,5],
      ["p",7,17,6],
      ["p",7,17,7],
      ["p",6,0,18],
      ["p",6,0,17],
      ["p",6,0,16],
      ["p",6,0,15],
      ["p",5,15,0],
      ["p",5,14,0],
      ["p",5,13,0],
      ["p",5,12,0],
      ["p",10,3,11],
      ["p",10,2,11],
      ["p",9,3,10],
      ["p",9,2,10],
      ["p",9,1,10],
      ["p",8,4,11],
      ["p",8,4,10],
      ["p",8,3,10],
      ["p",8,2,10],
      ["p",13,16,14],
      ["p",13,17,14],
      ["p",13,18,14],
      ["p",13,19,14],
      ["p",12,16,13],
      ["p",12,15,13],
      ["p",12,15,14],
      ["p",12,14,14],
      ["p",11,14,16],
      ["p",11,13,16],
      ["p",11,13,15],
      ["p",11,13,14],
      ["p",7,17,7],
      ["p",7,16,7],
      ["p",7,16,8],
      ["p",7,16,9],
      ["p",6,0,15],
      ["p",6,0,16],
      ["p",6,0,17],
      ["p",6,0,18],
      ["p",5,12,0],
      ["p",5,11,0],
      ["p",5,10,0],
      ["p",5,10,1],
      ["p",13,19,14],
      ["p",13,18,14],
      ["p",13,18,13],
      ["p",13,18,12],
      ["p",12,14,14],
      ["p",12,14,13],
      ["p",12,15,13],
      ["p",12,16,13],
      ["p",11,13,14],
      ["p",11,13,15],
      ["p",11,13,16],
      ["p",11,14,16],
      ["p",7,16,9],
      ["p",7,16,8],
      ["p",7,16,7],
      ["p",7,16,6],
      ["p",6,0,18],
      ["p",6,1,18],
      ["p",6,2,18],
      ["p",6,3,18],
      ["p",5,10,1],
      ["p",5,10,2],
      ["p",5,9,2],
      ["p",5,8,2],
      ["p",13,18,12],
      ["p",13,18,13],
      ["p",13,18,14],
      ["p",13,19,14],
      ["p",12,16,13],
      ["p",12,17,13],
      ["p",12,18,13],
      ["p",12,19,13],
      ["p",11,14,16],
      ["p",11,14,15],
      ["p",11,14,14],
      ["p",11,14,13],
      ["p",7,16,6],
      ["p",7,16,5],
      ["p",7,15,5],
      ["p",7,14,5],
      ["p",6,3,18],
      ["p",6,3,17],
      ["p",6,3,16],
      ["p",6,3,15],
      ["p",5,8,2],
      ["p",5,7,2],
      ["p",5,7,1],
      ["p",5,7,0],
      ["p",13,19,14],
      ["p",13,19,15],
      ["p",13,19,16],
      ["p",13,18,16],
      ["p",12,19,13],
      ["p",12,19,12],
      ["p",12,19,11],
      ["p",12,18,11],
      ["p",11,14,13],
      ["p",11,15,13],
      ["p",11,15,14],
      ["p",11,16,14],
      ["p",7,14,5],
      ["p",7,14,6],
      ["p",7,14,7],
      ["p",7,14,8],
      ["p",6,3,15],
      ["p",6,3,14],
      ["p",6,4,14],
      ["p",6,5,14],
      ["p",5,7,0],
      ["p",5,7,1],
      ["p",5,7,2],
      ["p",5,8,2],
      ["p",9,1,10],
      ["p",9,1,11],
      ["p",9,1,12],
      ["p",9,1,13],
      ["p",8,2,10],
      ["p",8,1,10],
      ["p",8,1,11],
      ["p",8,1,12],
      ["p",10,2,11],
      ["p",10,1,11],
      ["p",10,0,11],
      ["p",10,0,12],
      ["p",13,18,16],
      ["p",13,19,16],
      ["p",13,19,15],
      ["p",13,19,14],
      ["p",12,18,11],
      ["p",12,18,12],
      ["p",12,18,13],
      ["p",12,18,14],
      ["p",11,16,14],
      ["p",11,15,14],
      ["p",11,15,13],
      ["p",11,14,13],
      ["p",7,14,8],
      ["p",7,14,9],
      ["p",7,13,9],
      ["p",7,13,10],
      ["p",6,5,14],
      ["p",5,8,2],
      ["p",5,9,2],
      ["p",5,10,2],
      ["p",5,10,1],
      ["p",9,1,13],
      ["p",9,2,13],
      ["p",9,3,13],
      ["p",9,4,13],
      ["p",8,1,12],
      ["p",8,1,13],
      ["p",8,2,13],
      ["p",8,3,13],
      ["p",10,0,12],
      ["p",10,1,12],
      ["p",10,1,13],
      ["p",10,2,13],
      ["p",13,19,14],
      ["p",13,19,13],
      ["p",13,19,12],
      ["p",13,19,11],
      ["p",12,18,14],
      ["p",12,19,14],
      ["p",12,19,15],
      ["p",12,19,16],
      ["p",11,14,13],
      ["p",11,14,14],
      ["p",11,14,15],
      ["p",11,14,16],
      ["p",7,13,10],
      ["p",7,14,10],
      ["p",7,14,9],
      ["p",7,14,8],
      ["p",6,5,14],
      ["p",6,4,14],
      ["p",6,3,14],
      ["p",6,3,14],
      ["attack",6,3,13],
      ["p",5,10,1],
      ["p",5,10,0],
      ["p",5,11,0],
      ["p",5,12,0],
      ["p",10,2,13],
      ["p",10,2,14],
      ["p",10,2,14],
      ["attack",10,3,14],
      ["p",8,3,13],
      ["attack",8,3,14],
      ["p",9,4,13],
      ["attack",9,4,14],
      ["p",13,19,11],
      ["p",13,18,11],
      ["p",13,17,11],
      ["p",13,16,11],
      ["p",12,19,16],
      ["p",12,19,15],
      ["p",12,19,14],
      ["p",12,18,14],
      ["p",11,14,16],
      ["p",11,14,15],
      ["p",11,14,14],
      ["p",11,15,14],
      ["p",7,14,8],
      ["p",7,14,9],
      ["p",7,14,10],
      ["p",7,13,10],
      ["p",6,3,14],
      ["p",6,3,14],
      ["attack",6,3,13],
      ["p",5,12,0],
      ["p",5,13,0],
      ["p",5,14,0],
      ["p",5,15,0],
      ["p",8,3,13],
      ["p",8,2,13],
      ["p",8,1,13],
      ["oremove",2],
      ["p",8,4,13],
      ["attack",8,4,14],
      ["p",9,2,14],
      ["attack",9,3,14],
      ["p",12,16,11],
      ["p",12,17,11],
      ["p",12,18,11],
      ["p",12,19,11],
      ["p",11,18,14],
      ["p",11,18,13],
      ["p",11,18,12],
      ["p",11,19,12],
      ["p",10,15,14],
      ["p",10,14,14],
      ["p",10,14,15],
      ["p",10,14,16],
      ["p",6,13,10],
      ["p",6,13,9],
      ["p",6,13,8],
      ["p",6,13,7],
      ["p",5,3,14],
      ["p",5,3,14],
      ["attack",5,4,13],
      ["p",4,15,0],
      ["p",4,16,0],
      ["p",4,17,0],
      ["p",4,18,0],
      ["p",8,4,13],
      ["attack",8,4,14],
      ["p",9,2,14],
      ["attack",9,3,14],
      ["p",7,1,13],
      ["p",7,2,13],
      ["p",7,3,13],
      ["p",7,3,13],
      ["attack",7,3,14],
      ["oremove",5],
      ["p",11,19,11],
      ["p",11,19,10],
      ["p",11,18,10],
      ["p",11,17,10],
      ["p",10,19,12],
      ["p",10,19,13],
      ["p",10,19,14],
      ["p",10,18,14],
      ["p",9,14,16],
      ["p",9,14,15],
      ["p",9,14,14],
      ["p",9,15,14],
      ["p",5,13,7],
      ["p",5,13,6],
      ["p",5,13,5],
      ["p",5,12,5],
      ["p",4,18,0],
      ["p",4,17,0],
      ["p",4,16,0],
      ["p",4,15,0],
      ["p",7,4,13],
      ["p",7,4,14],
      ["p",7,4,15],
      ["p",7,4,16],
      ["p",6,3,13],
      ["p",6,3,14],
      ["p",6,4,14],
      ["p",6,5,14],
      ["p",8,2,14],
      ["p",8,3,14],
      ["p",8,4,14],
      ["p",11,17,10],
      ["p",11,17,9],
      ["p",11,17,8],
      ["p",11,17,7],
      ["p",10,18,14],
      ["p",10,19,14],
      ["p",10,19,15],
      ["p",10,19,16],
      ["p",9,15,14],
      ["p",9,14,14],
      ["p",9,13,14],
      ["p",9,13,15],
      ["p",5,12,5],
      ["p",5,13,5],
      ["p",5,13,6],
      ["p",5,13,7],
      ["p",4,15,0],
      ["p",4,14,0],
      ["p",4,13,0],
      ["p",4,12,0],
      ["p",6,5,14],
      ["p",6,6,14],
      ["p",6,6,13],
      ["p",6,6,12],
      ["p",8,4,14],
      ["p",8,5,14],
      ["p",8,6,14],
      ["p",8,6,13],
      ["p",7,4,16],
      ["p",7,4,15],
      ["p",7,4,14],
      ["p",7,4,13],
      ["oremove",3],
      ["p",10,17,7],
      ["p",10,17,8],
      ["p",10,18,8],
      ["p",10,18,9],
      ["p",9,19,16],
      ["p",9,19,15],
      ["p",9,19,14],
      ["p",9,18,14],
      ["p",8,13,15],
      ["p",8,13,16],
      ["p",8,13,17],
      ["p",8,13,18],
      ["p",4,13,7],
      ["p",4,13,6],
      ["p",4,14,6],
      ["p",4,15,6],
      ["p",3,12,0],
      ["p",3,11,0],
      ["p",3,10,0],
      ["p",3,10,1],
      ["p",5,6,12],
      ["p",5,7,12],
      ["p",5,8,12],
      ["p",5,9,12],
      ["p",7,6,13],
      ["p",7,6,12],
      ["p",7,7,12],
      ["p",7,8,12],
      ["p",6,4,13],
      ["p",6,4,14],
      ["p",6,5,14],
      ["p",6,6,14],
      ["p",10,18,9],
      ["p",10,18,8],
      ["p",10,18,7],
      ["p",10,17,7],
      ["p",9,18,14],
      ["p",9,18,13],
      ["p",9,18,12],
      ["p",9,18,11],
      ["p",8,13,18],
      ["p",8,13,17],
      ["p",8,13,16],
      ["p",8,14,16],
      ["p",4,15,6],
      ["p",4,15,7],
      ["p",4,15,8],
      ["p",4,16,8],
      ["p",3,10,1],
      ["p",3,10,0],
      ["p",3,11,0],
      ["p",3,12,0],
      ["p",6,6,14],
      ["p",6,6,13],
      ["p",6,6,12],
      ["p",6,7,12],
      ["p",10,17,7],
      ["p",10,17,6],
      ["p",10,16,6],
      ["p",10,16,5],
      ["p",9,18,11],
      ["p",9,18,10],
      ["p",9,18,9],
      ["p",9,18,8],
      ["p",8,14,16],
      ["p",8,13,16],
      ["p",8,13,15],
      ["p",8,13,14],
      ["p",4,16,8],
      ["p",4,15,8],
      ["p",4,14,8],
      ["p",4,14,9],
      ["p",3,12,0],
      ["p",3,13,0],
      ["p",3,14,0],
      ["p",3,15,0],
      ["p",5,9,12],
      ["p",5,10,12],
      ["p",5,10,11],
      ["p",5,11,11],
      ["p",7,8,12],
      ["p",7,9,12],
      ["p",7,10,12],
      ["p",7,11,12],
      ["p",6,7,12],
      ["p",6,8,12],
      ["p",6,9,12],
      ["p",6,10,12],
      ["p",10,16,5],
      ["p",10,16,4],
      ["p",10,16,3],
      ["p",10,17,3],
      ["p",9,18,8],
      ["p",9,18,9],
      ["p",9,18,10],
      ["p",9,18,11],
      ["p",8,13,14],
      ["p",8,14,14],
      ["p",8,15,14],
      ["p",8,16,14],
      ["p",4,14,9],
      ["p",4,14,10],
      ["p",4,13,10],
      ["p",4,12,10],
      ["p",4,12,10],
      ["attack",4,11,11],
      ["p",3,15,0],
      ["p",3,16,0],
      ["p",3,17,0],
      ["p",3,18,0],
      ["p",5,11,11],
      ["p",5,11,10],
      ["p",5,11,10],
      ["attack",5,12,10],
      ["p",7,11,12],
      ["p",7,11,11],
      ["p",7,11,11],
      ["attack",7,12,11],
      ["p",10,17,3],
      ["p",10,18,3],
      ["p",10,19,3],
      ["p",10,19,2],
      ["p",9,18,11],
      ["p",9,17,11],
      ["p",9,16,11],
      ["p",9,15,11],
      ["p",8,16,14],
      ["p",8,15,14],
      ["p",8,14,14],
      ["p",8,14,15],
      ["p",4,12,10],
      ["p",4,12,10],
      ["attack",4,11,10],
      ["p",3,18,0],
      ["p",3,17,0],
      ["p",3,16,0],
      ["p",3,15,0],
      ["p",7,11,11],
      ["p",7,11,12],
      ["p",5,11,10],
      ["p",5,11,11],
      ["p",5,10,11],
      ["p",5,9,11],
      ["p",6,10,12],
      ["p",6,10,11],
      ["p",6,11,11],
      ["p",6,11,11],
      ["attack",6,12,11],
      ["p",10,19,2],
      ["p",10,19,1],
      ["p",10,18,1],
      ["p",10,17,1],
      ["p",9,15,11],
      ["p",9,14,11],
      ["p",9,14,10],
      ["p",8,14,15],
      ["p",8,14,16],
      ["p",8,14,17],
      ["p",8,14,18],
      ["p",4,12,10],
      ["p",4,12,10],
      ["attack",4,11,11],
      ["p",3,15,0],
      ["p",3,14,0],
      ["p",3,13,0],
      ["p",3,12,0],
      ["p",6,11,11],
      ["p",6,10,11],
      ["p",5,9,11],
      ["p",5,8,11],
      ["p",5,7,11],
      ["p",5,7,12],
      ["p",10,17,1],
      ["p",10,18,1],
      ["p",10,19,1],
      ["p",10,19,2],
      ["p",9,14,10],
      ["p",9,14,9],
      ["p",9,13,9],
      ["p",9,13,8],
      ["p",8,14,18],
      ["p",8,13,18],
      ["p",8,12,18],
      ["p",8,11,18],
      ["p",4,12,10],
      ["p",4,11,10],
      ["p",4,11,10],
      ["attack",4,10,11],
      ["p",3,12,0],
      ["p",3,11,0],
      ["p",3,10,0],
      ["p",3,10,1],
      ["p",7,11,12],
      ["attack",7,11,11],
      ["p",6,10,11],
      ["p",6,9,11],
      ["p",6,8,11],
      ["p",6,7,11],
      ["p",5,7,12],
      ["p",5,6,12],
      ["p",5,6,13],
      ["p",5,6,14],
      ["p",10,19,2],
      ["p",10,19,3],
      ["p",10,18,3],
      ["p",10,17,3],
      ["p",9,13,8],
      ["p",9,13,9],
      ["p",9,13,10],
      ["p",9,13,11],
      ["p",8,11,18],
      ["p",8,12,18],
      ["p",8,13,18],
      ["p",8,13,17],
      ["p",4,11,10],
      ["p",4,11,10],
      ["attack",4,11,12],
      ["p",3,10,1],
      ["p",3,10,2],
      ["p",3,9,2],
      ["p",3,8,2],
      ["p",5,6,14],
      ["p",5,7,14],
      ["p",5,8,14],
      ["p",5,9,14],
      ["p",6,7,11],
      ["p",6,6,11],
      ["p",6,6,12],
      ["p",6,6,13],
      ["p",7,11,12],
      ["p",7,10,12],
      ["p",7,9,12],
      ["p",7,8,12],
      ["p",10,17,3],
      ["p",10,18,3],
      ["p",10,19,3],
      ["p",10,19,2],
      ["p",9,13,11],
      ["p",9,13,10],
      ["p",9,13,9],
      ["p",9,14,9],
      ["p",8,13,17],
      ["p",8,13,16],
      ["p",8,13,15],
      ["p",8,14,15],
      ["p",4,11,10],
      ["p",4,12,10],
      ["p",4,13,10],
      ["p",4,14,10],
      ["p",3,8,2],
      ["p",3,7,2],
      ["p",3,7,3],
      ["p",3,7,4],
      ["p",5,9,14],
      ["p",5,10,14],
      ["p",5,11,14],
      ["p",5,11,15],
      ["p",6,6,13],
      ["p",6,6,14],
      ["p",6,6,15],
      ["p",6,6,16],
      ["p",7,8,12],
      ["p",7,7,12],
      ["p",7,6,12],
      ["p",7,6,13],
      ["p",10,19,2],
      ["p",10,19,1],
      ["p",10,18,1],
      ["p",10,17,1],
      ["p",9,14,9],
      ["p",9,13,9],
      ["p",9,13,10],
      ["p",9,13,11],
      ["p",8,14,15],
      ["p",8,14,16],
      ["p",8,14,17],
      ["p",8,14,18],
      ["p",4,14,10],
      ["p",4,15,10],
      ["p",4,16,10],
      ["p",4,17,10],
      ["p",3,7,4],
      ["p",3,7,3],
      ["p",3,7,2],
      ["p",3,8,2],
      ["p",5,11,15],
      ["p",5,11,16],
      ["oremove",0],
      ["p",5,6,16],
      ["p",5,6,17],
      ["p",5,6,18],
      ["p",5,5,18],
      ["p",9,17,1],
      ["p",9,16,1],
      ["p",9,16,2],
      ["p",9,16,3],
      ["p",8,13,11],
      ["p",8,12,11],
      ["p",8,11,11],
      ["p",8,10,11],
      ["p",7,14,18],
      ["p",7,13,18],
      ["p",7,13,19],
      ["p",3,17,10],
      ["p",3,17,9],
      ["p",3,17,8],
      ["p",3,17,7],
      ["p",2,8,2],
      ["p",2,9,2],
      ["p",2,10,2],
      ["p",2,10,1],
      ["p",5,5,18],
      ["p",5,5,19],
      ["p",5,4,19],
      ["oremove",1],
      ["p",3,11,16],
      ["p",3,11,15],
      ["p",3,11,14],
      ["p",3,10,14],
      ["p",8,16,3],
      ["p",8,15,3],
      ["p",8,14,3],
      ["p",8,14,4],
      ["p",7,10,11],
      ["p",7,11,11],
      ["p",7,12,11],
      ["p",7,13,11],
      ["p",6,13,19],
      ["p",6,13,18],
      ["p",6,13,17],
      ["p",6,13,16],
      ["p",2,17,7],
      ["p",2,17,6],
      ["p",2,17,5],
      ["p",2,17,4],
      ["p",1,10,1],
      ["p",1,10,0],
      ["p",1,11,0],
      ["p",1,12,0],
      ["p",3,10,14],
      ["p",3,9,14],
      ["p",3,8,14],
      ["p",3,7,14],
      ["p",4,4,19],
      ["p",4,4,18],
      ["p",4,4,17],
      ["p",4,4,16],
      ["p",8,14,4],
      ["p",8,14,5],
      ["p",8,14,6],
      ["p",8,15,6],
      ["p",7,13,11],
      ["p",7,12,11],
      ["p",7,11,11],
      ["p",7,11,12],
      ["p",6,13,16],
      ["p",6,13,17],
      ["p",6,13,18],
      ["p",6,14,18],
      ["p",2,17,4],
      ["p",2,17,5],
      ["p",2,17,6],
      ["p",2,17,7],
      ["p",1,12,0],
      ["p",1,13,0],
      ["p",1,14,0],
      ["p",1,15,0],
      ["p",5,6,13],
      ["p",5,6,12],
      ["p",5,6,11],
      ["p",5,7,11],
      ["p",3,7,14],
      ["p",3,6,14],
      ["p",3,6,13],
      ["p",3,6,12],
      ["p",4,4,16],
      ["p",4,4,15],
      ["p",4,4,14],
      ["p",4,5,14],
      ["p",8,15,6],
      ["p",8,15,7],
      ["p",8,15,8],
      ["p",8,16,8],
      ["p",7,11,12],
      ["p",7,11,11],
      ["p",7,12,11],
      ["p",7,12,10],
      ["p",6,14,18],
      ["p",6,14,17],
      ["p",6,14,16],
      ["p",6,13,16],
      ["p",2,17,7],
      ["p",2,17,8],
      ["p",2,17,9],
      ["p",2,16,9],
      ["p",1,15,0],
      ["p",1,16,0],
      ["p",1,17,0],
      ["p",1,18,0],
      ["p",3,6,12],
      ["p",3,7,12],
      ["p",3,8,12],
      ["p",3,9,12],
      ["p",4,5,14],
      ["p",4,6,14],
      ["p",4,6,13],
      ["p",4,6,12],
      ["p",5,7,11],
      ["p",5,8,11],
      ["p",8,16,8],
      ["p",8,15,8],
      ["p",8,15,9],
      ["p",8,15,10],
      ["p",7,12,10],
      ["p",7,13,10],
      ["p",7,13,11],
      ["p",7,14,11],
      ["p",6,13,16],
      ["p",6,14,16],
      ["p",6,14,17],
      ["p",6,14,18],
      ["p",2,16,9],
      ["p",2,17,9],
      ["p",2,17,10],
      ["p",2,18,10],
      ["p",1,18,0],
      ["p",1,17,0],
      ["p",1,16,0],
      ["p",1,15,0],
      ["p",8,15,10],
      ["p",8,14,10],
      ["p",8,13,10],
      ["p",8,12,10],
      ["p",7,14,11],
      ["p",7,15,11],
      ["p",7,16,11],
      ["p",7,17,11],
      ["p",6,14,18],
      ["p",6,13,18],
      ["p",6,12,18],
      ["p",6,11,18],
      ["p",2,18,10],
      ["p",2,18,11],
      ["p",2,18,12],
      ["p",2,18,13],
      ["p",1,15,0],
      ["p",1,14,0],
      ["p",1,13,0],
      ["p",1,12,0],
      ["p",3,9,12],
      ["attack",3,10,12],
      ["p",5,8,11],
      ["p",5,9,11],
      ["p",5,10,11],
      ["p",5,10,12],
      ["p",4,6,12],
      ["p",4,7,12],
      ["p",4,8,12],
      ["p",4,8,11],
      ["p",8,12,10],
      ["p",8,12,11],
      ["p",8,11,11],
      ["p",8,10,11],
      ["p",8,10,11],
      ["attack",8,10,12],
      ["p",7,17,11],
      ["p",7,17,10],
      ["p",7,18,10],
      ["p",7,19,10],
      ["p",6,11,18],
      ["p",6,10,18],
      ["p",6,10,19],
      ["p",6,9,19],
      ["p",2,18,13],
      ["p",2,17,13],
      ["p",2,16,13],
      ["p",2,15,13],
      ["p",1,12,0],
      ["p",1,13,0],
      ["p",1,14,0],
      ["p",1,15,0],
      ["p",5,10,12],
      ["p",5,11,12],
      ["p",5,11,11],
      ["p",5,11,11],
      ["attack",5,10,11],
      ["p",3,9,12],
      ["p",3,10,12],
      ["p",3,10,12],
      ["attack",3,10,11],
      ["p",4,8,11],
      ["p",4,9,11],
      ["p",4,9,11],
      ["attack",4,10,11],
      ["oremove",8],
      ["p",7,19,10],
      ["p",7,18,10],
      ["p",7,18,11],
      ["p",7,18,12],
      ["p",6,9,19],
      ["p",6,8,19],
      ["p",6,8,18],
      ["p",6,8,17],
      ["p",2,15,13],
      ["p",2,14,13],
      ["p",2,13,13],
      ["p",2,13,14],
      ["p",1,15,0],
      ["p",1,14,0],
      ["p",1,13,0],
      ["p",1,12,0],
      ["p",5,11,11],
      ["p",5,12,11],
      ["p",5,13,11],
      ["p",5,14,11],
      ["p",3,10,12],
      ["p",3,10,11],
      ["p",3,11,11],
      ["p",3,12,11],
      ["p",4,9,11],
      ["p",4,10,11],
      ["p",4,11,11],
      ["p",4,11,10],
      ["p",7,18,12],
      ["p",7,18,11],
      ["p",7,18,10],
      ["p",7,19,10],
      ["p",6,8,17],
      ["p",6,8,16],
      ["p",6,9,16],
      ["p",6,10,16],
      ["p",2,13,14],
      ["p",2,13,15],
      ["p",2,13,16],
      ["p",2,13,17],
      ["p",1,12,0],
      ["p",1,11,0],
      ["p",1,10,0],
      ["p",1,10,1],
      ["p",4,11,10],
      ["p",4,12,10],
      ["p",4,13,10],
      ["p",4,14,10],
      ["p",5,14,11],
      ["p",5,15,11],
      ["p",3,12,11],
      ["p",3,13,11],
      ["p",3,14,11],
      ["p",7,19,10],
      ["p",7,18,10],
      ["p",7,18,9],
      ["p",7,18,8],
      ["p",6,10,16],
      ["p",6,9,16],
      ["p",6,8,16],
      ["p",6,8,17],
      ["p",2,13,17],
      ["p",2,13,16],
      ["p",1,10,1],
      ["p",1,10,0],
      ["p",1,11,0],
      ["p",1,12,0],
      ["p",4,14,10],
      ["p",4,15,10],
      ["p",4,16,10],
      ["p",5,15,11],
      ["p",5,16,11],
      ["p",3,14,11],
      ["p",3,14,10],
      ["p",3,15,10],
      ["p",7,18,8],
      ["p",7,18,9],
      ["p",7,18,10],
      ["p",7,17,10],
      ["p",7,17,10],
      ["attack",7,16,10],
      ["p",6,8,17],
      ["p",6,8,16],
      ["p",6,9,16],
      ["p",6,10,16],
      ["p",2,13,16],
      ["p",2,13,15],
      ["p",2,13,14],
      ["p",1,12,0],
      ["p",1,13,0],
      ["p",1,14,0],
      ["p",1,15,0],
      ["p",3,15,10],
      ["p",3,15,9],
      ["p",3,16,9],
      ["p",3,17,9],
      ["p",3,17,9],
      ["attack",3,17,10],
      ["p",5,16,11],
      ["p",5,17,11],
      ["p",5,17,11],
      ["attack",5,17,10],
      ["p",4,16,10],
      ["attack",4,17,10],
      ["oremove",7],
      ["p",6,10,16],
      ["p",6,11,16],
      ["p",6,11,15],
      ["p",6,11,14],
      ["p",2,13,14],
      ["p",2,13,15],
      ["p",2,13,16],
      ["p",2,13,17],
      ["p",1,15,0],
      ["p",1,14,0],
      ["p",1,13,0],
      ["p",1,12,0],
      ["p",3,17,9],
      ["p",3,17,10],
      ["p",3,18,10],
      ["p",3,18,11],
      ["p",4,16,10],
      ["p",4,17,10],
      ["p",4,18,10],
      ["p",4,19,10],
      ["p",5,17,11],
      ["p",5,17,10],
      ["p",5,18,10],
      ["p",6,11,14],
      ["p",6,10,14],
      ["p",6,9,14],
      ["p",6,8,14],
      ["p",2,13,17],
      ["p",2,13,16],
      ["p",2,13,15],
      ["p",2,13,14],
      ["p",1,12,0],
      ["p",1,13,0],
      ["p",1,14,0],
      ["p",1,15,0],
      ["p",3,18,11],
      ["p",3,18,12],
      ["p",3,18,13],
      ["p",4,19,10],
      ["p",4,19,11],
      ["p",4,19,12],
      ["p",4,19,13],
      ["p",5,18,10],
      ["p",5,18,11],
      ["p",5,18,12],
      ["p",6,8,14],
      ["p",6,9,14],
      ["p",6,10,14],
      ["p",6,11,14],
      ["p",2,13,14],
      ["p",2,13,15],
      ["p",2,13,16],
      ["p",2,13,17],
      ["p",1,15,0],
      ["p",1,15,1],
      ["p",1,15,2],
      ["p",1,15,3],
      ["p",3,18,13],
      ["p",3,17,13],
      ["p",3,16,13],
      ["p",3,15,13],
      ["p",5,18,12],
      ["p",5,18,13],
      ["p",5,17,13],
      ["p",5,16,13],
      ["p",4,19,13],
      ["p",4,18,13],
      ["p",4,17,13],
      ["p",4,17,14],
      ["p",6,11,14],
      ["p",6,10,14],
      ["p",6,9,14],
      ["p",6,8,14],
      ["p",2,13,17],
      ["p",1,15,3],
      ["p",1,14,3],
      ["p",1,13,3],
      ["p",1,13,4],
      ["p",3,15,13],
      ["p",3,14,13],
      ["p",6,8,14],
      ["p",6,7,14],
      ["p",6,6,14],
      ["p",6,6,15],
      ["p",2,13,17],
      ["p",2,13,16],
      ["p",2,13,15],
      ["p",2,13,14],
      ["p",2,13,14],
      ["attack",2,14,13],
      ["p",1,13,4],
      ["p",1,14,4],
      ["p",1,15,4],
      ["p",1,16,4],
      ["p",3,14,13],
      ["attack",3,14,14],
      ["p",4,17,14],
      ["p",4,16,14],
      ["p",4,15,14],
      ["p",4,15,14],
      ["attack",4,14,14],
      ["p",6,6,15],
      ["p",6,5,15],
      ["p",6,4,15],
      ["p",6,4,16],
      ["p",2,13,14],
      ["p",2,13,14],
      ["attack",2,14,13],
      ["p",1,16,4],
      ["p",1,16,5],
      ["p",1,16,6],
      ["p",1,15,6],
      ["p",3,14,13],
      ["attack",3,14,14],
      ["p",4,15,14],
      ["attack",4,14,14],
      ["oremove",2],
      ["p",4,16,13],
      ["p",4,15,13],
      ["p",5,4,16],
      ["p",5,4,17],
      ["p",5,4,18],
      ["p",5,3,18],
      ["p",1,15,6],
      ["p",1,15,5],
      ["p",1,15,4],
      ["p",1,15,3],
      ["p",2,14,13],
      ["p",2,14,14],
      ["p",2,14,15],
      ["p",2,13,15],
      ["p",3,15,14],
      ["p",3,14,14],
      ["p",3,14,15],
      ["p",3,14,16],
      ["p",4,15,13],
      ["p",4,15,14],
      ["p",4,14,14],
      ["p",4,14,15],
      ["p",5,3,18],
      ["p",5,4,18],
      ["p",5,5,18],
      ["p",5,5,19],
      ["p",1,15,3],
      ["p",1,15,2],
      ["p",1,15,1],
      ["p",1,15,0],
      ["p",2,13,15],
      ["p",2,13,16],
      ["p",2,13,17],
      ["p",2,13,18],
      ["oremove",0],
      ["p",2,14,16],
      ["p",2,13,16],
      ["p",2,13,15],
      ["p",2,13,14],
      ["p",3,14,15],
      ["p",3,14,14],
      ["p",3,15,14],
      ["p",3,16,14],
      ["p",4,5,19],
      ["p",4,5,18],
      ["p",4,4,18],
      ["p",4,4,17],
      ["p",0,15,0],
      ["p",0,15,1],
      ["p",0,15,2],
      ["p",0,15,3],
      ["p",1,13,18],
      ["p",1,13,17],
      ["p",1,13,16],
      ["p",1,13,15],
      ["p",2,13,14],
      ["p",2,14,14],
      ["p",2,15,14],
      ["p",2,15,13],
      ["p",3,16,14],
      ["p",3,16,13],
      ["p",3,17,13],
      ["p",3,18,13],
      ["p",4,4,17],
      ["p",4,4,18],
      ["p",4,3,18],
      ["p",4,3,19],
      ["p",0,15,3],
      ["p",0,15,4],
      ["p",0,15,5],
      ["p",0,15,6],
      ["p",1,13,15],
      ["p",1,13,14],
      ["p",1,14,14],
      ["p",1,15,14],
      ["p",4,3,19],
      ["p",4,2,19],
      ["p",4,1,19],
      ["p",4,0,19],
      ["p",0,15,6],
      ["p",0,15,5],
      ["p",0,14,5],
      ["p",0,13,5],
      ["p",2,15,13],
      ["p",2,16,13],
      ["p",2,17,13],
      ["p",2,17,14],
      ["p",3,18,13],
      ["p",3,18,12],
      ["p",3,18,11],
      ["p",3,17,11],
      ["p",1,15,14],
      ["p",1,16,14],
      ["p",1,16,13],
      ["p",1,17,13],
      ["p",4,0,19],
      ["p",4,0,18],
      ["p",4,1,18],
      ["p",4,2,18],
      ["p",0,13,5],
      ["p",0,13,6],
      ["p",0,13,7],
      ["p",0,13,8],
      ["p",1,17,13],
      ["p",1,18,13],
      ["p",1,18,12],
      ["p",1,18,11],
      ["p",2,17,14],
      ["p",2,17,13],
      ["p",2,18,13],
      ["p",2,18,12],
      ["p",4,2,18],
      ["p",4,3,18],
      ["p",4,3,17],
      ["p",4,3,16],
      ["p",0,13,8],
      ["p",0,13,7],
      ["p",0,14,7],
      ["p",0,14,6],
      ["p",3,17,11],
      ["p",3,16,11],
      ["p",1,18,11],
      ["p",1,18,10],
      ["p",1,17,10],
      ["p",1,16,10],
      ["p",2,18,12],
      ["p",2,18,11],
      ["p",2,18,10],
      ["p",2,17,10],
      ["p",4,3,16],
      ["p",4,3,15],
      ["p",4,4,15],
      ["p",4,4,14],
      ["p",0,14,6],
      ["p",0,14,7],
      ["p",0,14,8],
      ["p",0,15,8],
      ["p",0,15,8],
      ["attack",0,16,10],
      ["p",1,16,10],
      ["attack",1,16,9],
      ["p",2,17,10],
      ["p",2,17,9],
      ["p",2,17,9],
      ["attack",2,16,9],
      ["p",3,16,11],
      ["p",3,15,11],
      ["p",3,15,10],
      ["p",3,15,10],
      ["attack",3,15,9],
      ["p",4,4,14],
      ["p",4,3,14],
      ["p",4,3,13],
      ["p",4,2,13],
      ["p",0,15,8],
      ["p",0,14,8],
      ["p",0,13,8],
      ["p",0,13,9],
      ["p",0,13,9],
      ["attack",0,15,10],
      ["oremove",3],
      ["p",2,17,9],
      ["p",2,16,9],
      ["p",2,15,9],
      ["p",2,15,9],
      ["attack",2,14,9],
      ["p",1,16,10],
      ["p",1,15,10],
      ["p",1,15,10],
      ["attack",1,14,10],
      ["p",3,2,13],
      ["p",3,3,13],
      ["p",3,3,14],
      ["p",3,3,15],
      ["p",0,13,9],
      ["p",0,13,10],
      ["p",0,13,10],
      ["attack",0,15,10],
      ["p",2,15,9],
      ["p",2,14,9],
      ["p",2,14,9],
      ["attack",2,14,10],
      ["p",1,15,10],
      ["attack",1,14,10],
      ["p",3,3,15],
      ["p",3,3,14],
      ["p",3,4,14],
      ["p",3,4,13],
      ["p",0,13,10],
      ["p",0,13,10],
      ["attack",0,15,10],
      ["oremove",1],
      ["p",1,14,9],
      ["attack",1,14,10],
      ["oremove",0],
      ["p",1,4,13],
      ["p",1,4,14],
      ["p",1,4,15],
      ["p",1,4,16],
      ["p",0,14,9],
      ["p",0,13,9],
      ["p",0,13,10],
      ["p",0,12,10],
      ["p",1,4,16],
      ["p",1,4,15],
      ["p",1,5,15],
      ["p",1,6,15],
      ["p",0,12,10],
      ["p",0,12,11],
      ["p",0,11,11],
      ["p",0,10,11],
      ["p",1,6,15],
      ["p",1,6,14],
      ["p",1,6,13],
      ["p",1,6,12],
      ["p",0,10,11],
      ["p",0,9,11],
      ["p",0,9,10],
      ["p",0,9,9],
      ["p",1,6,12],
      ["p",1,6,13],
      ["p",1,6,14],
      ["p",1,7,14],
      ["p",0,9,9],
      ["p",0,9,10],
      ["p",0,9,11],
      ["p",0,8,11],
      ["p",1,7,14],
      ["p",1,8,14],
      ["p",1,9,14],
      ["p",1,10,14],
      ["p",0,8,11],
      ["p",0,7,11],
      ["p",0,6,11],
      ["p",0,6,12],
      ["p",1,10,14],
      ["p",1,11,14],
      ["p",1,11,15],
      ["p",1,11,16],
      ["p",0,6,12],
      ["p",0,6,13],
      ["p",0,6,14],
      ["p",0,7,14],
      ["p",1,11,16],
      ["p",1,11,15],
      ["p",0,7,14],
      ["p",0,8,14],
      ["p",0,9,14],
      ["p",0,10,14],
      ["p",1,11,15],
      ["p",1,11,14],
      ["p",1,11,14],
      ["attack",1,10,14],
      ["p",0,10,14],
      ["attack",0,11,14],
      ["p",1,11,14],
      ["p",1,11,14],
      ["attack",1,10,14],
      ["p",0,10,14],
      ["attack",0,11,14],
      ["p",1,11,14],
      ["p",1,11,14],
      ["attack",1,10,14],
      ["p",0,10,14],
      ["attack",0,11,14],
      ["oremove",1]];
      processToggle();
      
      //...
    }
    }
    ]},
    mInfo={s:'Info',fs:1.4,vCenter:1,actionf:function() {
      
      //showMsg('<b style="color:#fff;">Arkenpark</b><span style="color:#fff;"> &middot; Turn-Based-Strategy Game Test </span>'
      //  //+' Version '+version//;//+'<br><a href="javascript:alert(23);" style="font-weight:bold;">Start game</a>';
      //  +'<br>1) Click your (blue) units to move and attack/heal.<br>2) Hit "Turn" Button, A.I. processes, Repeat.'
      //  +'<br>3) ...'//Move onto medikits to reset health.
      //  +'<br>4) <span style="text-decoration:line-through;">Profit.</span> Win the game! <button id="disbut">Close introduction</button>');
      //document.getElementById('disbut').onclick=checkDismissMsg;
      
      Conet.alert(gps.info?gps.info:'Arkenpark\nTurn-Based-Strategy Game Test'
        +'<br>1) Click your (blue) units to move and attack/heal.<br>2) Hit "Turn" Button, A.I. processes, Repeat.'
        +'<br>3) ...'//Move onto medikits to reset health.
        +'<br>4) Win the game!');
      
      //...
    }
    },mVersion={s:'Version '+version,fs:1.2,vertCenter:1,ph:0.02,noinp:1};
    
    let menu=[mmenu={s:'&#9776;',noTri:true,fs:1.4,pw:0.05,sub:
      levelGrid?[mRestart,mInfo,Menu.mFullscreen,mVersion]
      :[cfm,mRestart,mReplay,mInfo,Menu.mFullscreen,mVersion]
    },
      mturn={s:'Turn',msid:'mturn',ms:'',
      fs:1.4,vCenter:1,bgcol:parties[0].col,actionf:turn}];
    
    
    if (gps.canvNotes||!url.arrows) {
      cano=new CanvNotes({nomenu:1});
      cano.smallScale=0.00001;
      cano.selCount=0;
      Menu.init(menu,{listen:1});
      //...
    } else {
      arrows=new Arrows({noStartLoad:1,elStick:1,bgcol:'#888',minsc:0.3,menu:menu});
      arrows.etScene().elStick=1;
    }
    
    if (url.file) {
      if (levelGrid) {
        initLevelGrid();
        //levelGrid.objs[0].onselect();
      } else restart();
    }
    
    
    //if (gps.load) load(gps.load); else if (!gps.noStart) restart();
    
    //...
  }
  )();
  //---
  this.restart=restart;this.rani=rani;
}
//----

//fr o,1
//fr o,1,11
//fr o,1,21
//fr o,1,34,1
//fr o,1,38
//fr o,1,51
//fr o,1,53
//fr o,1,54
//fr o,1,54,109
//fr o,1,56
//fr o,1,58,1
//fr o,1,60
//fr o,1,60,47
//fr o,1,60,49
//fr o,1,60,51
//fr o,1,60,53
//fr o,1,60,58
//fr o,1,60,60
//fr o,1,60,62
//fr o,1,60,62,38
//fr o,1,60,62,46
//fr o,1,60,62,48
//fr o,1,60,62,51
//fr o,1,60,62,54
//fr o,1,60,64
//fr o,1,60,64,8
//fr o,1,60,77
//fr o,1,62
//fr o,1,62,17
//fr o,1,62,21
//fr o,1,62,22
//fr o,1,62,27
//fr o,1,62,36
//fr p,27,707
