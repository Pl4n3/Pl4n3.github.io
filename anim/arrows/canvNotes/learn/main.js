//------
(function() {
  //----
  Conet.log('Learn v0.252 ');//FOLDORUPDATEVERSION
  
  function hookObj(o) {
    //---
    let tnote=undefined,mtnote=2000,//-0.5;
        bbot,bchoices=[],bstat,
        colNoinp='#aaa',colInp='#fff',
        tolearni,tolearncur,tolearn=[
          {note:0,noteName:'a'},
          {note:-0.5,noteName:'h'},
          {note:-1,noteName:'c'}
        ],tolearnNext=[],learned,fails,tsum=0;
    //onsole.trace();
    
    function fmtTime(t) {
      //---
      return (Math.floor(0.5+t/100)/10)+' sec';
      //...
    }
    
    function initView() {
      //---
      let v=cano.view;
      v.posx=0;v.posy=0;
      v.scx=3;v.scy=3;
      //...
    }
    
    function draw(ct,x,y,w,h) {
      //---
      //onsole.log('note draw');
      let v=cano.view,sc=v.dpr*v.scy;
      ct.lineWidth=sc;
      ct.strokeStyle='#000';
      //ct.strokeRect(x+sc*5,y+sc*5,w-sc*10,h-sc*10);
      let x0=10*sc;
      ct.beginPath();
      
      for (let i=0;i<5;i++) {
        let y0=h/2+(i-2)*6*sc;
        ct.moveTo(x+x0,y+y0);
        ct.lineTo(x+w-x0,y+y0);
      }
      ct.stroke();
      
      if (tolearncur!==undefined) {
        ct.fillStyle='#000';
        ct.font=(sc*25)+'px sans-serif';
        ct.textAlign='center';
        ct.textBaseline='middle';
        ct.fillText(tolearncur.bass?'\uD834\uDD22':'\uD834\uDD1E',x+w/2-x0,y+h/2);
        ct.textBaseline='alphabetic';
        ct.fillText('\uD834\uDD5D',x+w/2+x0/2,y+h/2+tolearncur.note*6*sc);
      }
      //...
    }
    
    function choice(isTimeout) {
      //---
      let noteName=tolearncur.noteName,ok=this.sa?(this.sa[0]==noteName):false;
      for (let b of bchoices) {
        b.selectable=false;
        b.bgcol=b.sa[0]==noteName?(ok?'#0f0':'#ff0'):((b===this)?'#f00':colNoinp);
      }
      
      tolearn.splice(tolearni,1);
      if (ok) learned++; else { fails++;tolearnNext.push(tolearncur); }
      if (tolearn.length==0) {
        tolearn=tolearnNext;
        tolearnNext=[];
      }
      bstatUpdate();
      
      tsum+=tnote;
      
      if (tolearn.length==0) {
        bbot.sa[0]='Success, all done in '+fmtTime(tsum)+'.';
      } else {
        bbot.sa[0]=(ok?'Success':(isTimeout?'Timeout':'Fail'))+', '+fmtTime(tnote)+', continue.';
        bbot.bgcol=colInp;
        bbot.selectable=true;
      }
      tnote=undefined;
      
      //...
    }
    
    function bstatUpdate() {
      //---
      bstat.sa=['To learn: '+(tolearn.length+tolearnNext.length),'Learned: '+learned+', fails: '+fails];
      //...
    }
    
    function menuInit() {
      //---
      initView();
      
      let y0=-40;
      
      cano.objs.push(
      
      cano.initObj({
        x:-44,y:y0,w:88,h:20,bgcol:colNoinp,selectable:0,
        sa:['Learn App'],alignCenter:1,fs:16,
      }),
      
      cano.initObj({
        x:-44,y:y0+30,w:88,h:10,bgcol:colInp,
        sa:['1. Learn 7 \uD834\uDD1E notenames'],alignCenter:1,fs:6,
      onUp:function() {
        cano.clear();
        
        tolearn=[
          {note:2,noteName:'d'},
          {note:1.5,noteName:'e'},
          {note:1,noteName:'f'},
          {note:0.5,noteName:'g'},
          
          {note:0,noteName:'a'},
          {note:-0.5,noteName:'h'},
          {note:-1,noteName:'c'}
        ];
        
        lessonInit();
        //...
      }
      }),
      
      cano.initObj({
        x:-44,y:y0+50,w:88,h:10,bgcol:colInp,
        sa:['2. Learn 7 \uD834\uDD22 notenames'],alignCenter:1,fs:6,
      onUp:function() {
        cano.clear();
        
        tolearn=[
          {note:2,noteName:'a',bass:1},
          {note:1.5,noteName:'h',bass:1},
          {note:1,noteName:'c',bass:1},
          {note:0.5,noteName:'d',bass:1},
        
          {note:0,noteName:'e',bass:1},
          {note:-0.5,noteName:'f',bass:1},
          {note:-1,noteName:'g',bass:1}
        ];
        
        lessonInit();
        //...
      }
      }),
      
      cano.initObj({
        x:-44,y:y0+70,w:88,h:10,bgcol:colInp,
        sa:['3. Learn 14 \uD834\uDD1E,\uD834\uDD22 notenames'],alignCenter:1,fs:6,
      onUp:function() {
        cano.clear();
        
        tolearn=[
        {note:2,noteName:'d'},
        {note:1.5,noteName:'e'},
        {note:1,noteName:'f'},
        {note:0.5,noteName:'g'},
        
        {note:0,noteName:'a'},
        {note:-0.5,noteName:'h'},
        {note:-1,noteName:'c'},
        
        {note:2,noteName:'a',bass:1},
        {note:1.5,noteName:'h',bass:1},
        {note:1,noteName:'c',bass:1},
        {note:0.5,noteName:'d',bass:1},
        
        {note:0,noteName:'e',bass:1},
        {note:-0.5,noteName:'f',bass:1},
        {note:-1,noteName:'g',bass:1}
            ];
        
        lessonInit();
        //...
      }
      })
      
      );
      //...
    }
    
    function lessonInit() {
      //---
      initView();
      
      tnote=undefined;tolearncur=undefined;tolearnNext=[];learned=0;tsum=0;fails=0;
      
      let bnote=cano.initObj({x:-25,y:-40,w:50,h:50
        ,sa:['Test']
        ,draw:draw
        ,noserialize:1
        ,dontmove:1,selectable:false
        ,bgcol:'#eee'});
      cano.objs.push(bnote);
      
      let a=['c','d','e','f','g','a','h'];
      
      let w=10,bo=3,yp=bnote.y+bnote.h+10,o;
      for (let i=0;i<a.length;i++) {
        cano.objs.push(o=cano.initObj({
          x:i*(w+bo)+bnote.x+bnote.w/2-(w*a.length+bo*(a.length-1))/2,y:yp,w:w,h:w,fs:9,
          noserialize:1,dontmove:1,alignCenter:1,//textW:1,
          sa:[a[i]],bgcol:colNoinp,onUp:choice,selectable:false,
        }));
        bchoices.push(o);
      }
      
      yp+=5+w;
      
      w=88;
      
      cano.objs.push(bbot=cano.initObj({
        x:-w/2,y:yp,w:w,h:10,alignCenter:1,bgcol:colInp,fs:6,
        sa:[
          'Start'//'Choose! [............]'
        ],
      onUp:function() {
        //---
        console.log('bottom button');
        //this.sa[0]='Choose! [............]';
        this.selectable=false;
        this.bgcol=colNoinp;
        tnote=0;
        tolearni=Math.floor(Math.random()*tolearn.length);
        tolearncur=tolearn[tolearni];
        //note=-0.5;noteName='h';
        
        for (let b of bchoices) {
          b.bgcol=colInp;
          b.selectable=true;
        }
        //...
      }
      }));
      
      cano.objs.push(bstat=cano.initObj({
        x:4,y:bnote.y-20,w:40,h:10,bgcol:colNoinp,selectable:false,
        sa:[''],alignCenter:1,fs:4
      }));
      bstatUpdate();
      
      cano.objs.push(cano.initObj({
        x:-44,y:bnote.y-20,w:30,h:10,bgcol:colInp,
        sa:['< Menu'],alignCenter:1,fs:6,
      onUp:function() {
        //---
        cano.clear();
        menuInit();
        //...
      }
      }));
      //...
    }
    
    cano.handlerAdd('draw0',function(dt,ct) {
      //---
      //onsole.log('draw0');
      if (tnote===undefined) return;
      tnote+=dt;
      if (tnote>=mtnote) {
        tnote=mtnote;
        choice(1);
        return;
      }
      let bm=8,b=Math.floor(0.5+tnote*bm/mtnote);
      bbot.sa[0]='Choose! '
        +'\u2588'.repeat(b)
        //+'\u2593'.repeat(b)
        +'\u2591'.repeat(bm-b)+'';
      //...
    }
    );
    
    cano.selCount=1;
    
    //lessonInit();
    menuInit();
    
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
//fr o,1,3
//fr o,1,3,11
//fr o,1,3,13
//fr o,1,3,15
//fr o,1,3,17
//fr o,1,3,19
//fr o,1,3,21
//fr o,1,3,21,15
//fr o,1,3,21,21
//fr o,1,3,21,27
//fr o,1,3,23
//fr o,1,3,23,34
//fr o,1,3,25
//fr o,1,3,33
//fr p,23,167
