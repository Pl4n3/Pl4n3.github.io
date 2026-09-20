//------
//--- 
//
(function() {
  //----
  console.log('v0.196 ');//FOLDORUPDATEVERSION
  
  
  function hookObj(o) {
    //---
    console.log('hooking: shapesNiklotSpeech.js');
    
    cano.shapesNiklotSpeech=function(ps) {
      //---
      //onsole.trace();
      //let t=ps.t,i0=ps.i0,sds=ps.sds,episodes=ps.episodes,sc=ps.sc,allShapes=ps.allShapes;
      let obj=ps.obj,episodes=ps.episodes;
      
      let sds=obj.shapeDefs,i0=-1;for (let i=0;i<sds.length;i++) if (sds[i].text1=='Niklot') {
        i0=i;console.log('i0='+i0);break;
      }
      
      let t=40,sNiklot=sds[i0].shapes,sAdolf=sds[i0+1].shapes,sHenry=sds[i0+2].shapes,sSven3=sds[i0+3].shapes,sKnut5=sds[i0+4].shapes,sVald1=sds[i0+5].shapes,
          sView=sds[i0+6].shapes,sView1=sds[i0+7].shapes,sc=5.18;
      let allShapes={sNiklot:sNiklot,sAdolf:sAdolf,sHenry:sHenry,sSven3:sSven3,sKnut5:sKnut5,sVald1:sVald1,sView:sView,sView1:sView1},
          addShapes=cano.addShapes,arrow=cano.arrow;
      
      
      
      function intro() {
        //---
        let dt=130;
        cano.addShapes({allShapes:allShapes,a:[
          ['sView',{t:20,pos:'posDobin',scx:sc,scy:sc},{t:90,pos:'posDobin',scx:sc,scy:sc},{t:10,pos:'posHenry0',scx:7,scy:7},{t:10,pos:'posHenry0',scx:7,scy:7},{t:10,pos:'posZealand',scx:3.5,scy:3.5},{t:80,pos:'posZealand',scx:3.5,scy:3.5}]
        ]});
        if (1) { let sh;sds.splice(i0,0,
          //cano.arrow({pos0:'posDobin',pos1:'posLübeck',t:t,duration:40+dt}),
          {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:13,pos:'posDobin',text:sh='Wendish Crusade',fs:0,
          speech:'Wendish crusade and Danish civilwar. History of Obotrites, Saxons and Danes.'
          },{t:t+10,fs:0},{t:20,spring:1,fs:20},{t:20+dt,fs:20},{t:10,fs:0}]},
          
          {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:35,pos:'posDobin',text:'Danish Civilwar',fs:0},{t:t+10,fs:0},{t:20,spring:1,fs:20},{t:20+dt,fs:20},{t:10,fs:0}]},
          {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:49,pos:'posDobin',text:'History of Obotrites, Saxons and Danes',fs:0},{t:t+10,fs:0},{t:20,spring:1,fs:5},{t:20+dt,fs:5},{t:10,fs:0}]}
          
          
        );i0+=2;episodes.add({t:t,text:'Wendish Crusade & Danish Civilwar',hideCamSel:1,x:10,y:100,w:340,h:240}); }
        t+=90+dt;
        //...
      }
      ;
      function pact1143() {
        //---
        let dt=70;
        cano.addShapes({allShapes:allShapes,a:[
          ['sNiklot',{t:20,pos:'posDobin'},{t:10,pos:'posLübeck',x:5},{t:60+dt,pos:'posLübeck',x:5}],
          ['sAdolf',{t:20,pos:'posLübeck'},{t:10,pos:'posLübeck',x:-5},{t:60+dt,pos:'posLübeck',x:-5}],
          //['sHenry',{t:20,pos:'posHenry0'},{t:70+dt,pos:'posHenry0'}],
          ['sView',{t:20,pos:'posDobin',scx:sc,scy:sc},{t:10,pos:'posLübeck'},{t:60+dt,pos:'posLübeck'}]
        ]});
        if (1) { let sh;sds.splice(i0,0,
          cano.arrow({pos0:'posDobin',pos1:'posLübeck',t:t,duration:40+dt}),
          {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:13,pos:'posLübeck',text:sh='1143 Pact of friendship',fs:0,
          speech:'1143 Pact of friendship between Niklot and Adolf 2nd.'
          },{t:t+10,fs:0},{t:20,spring:1,fs:5},{t:20+dt,fs:5},{t:10,fs:0}]}
        );i0+=2;episodes.add({t:t,text:sh}); }
        t+=90+dt;
        //...
      }
      ;
      
      function luebeckRaid1147() {
        //---
          let dt=70;
          cano.addShapes({allShapes:allShapes,a:[
            ['sNiklot',{t:20,pos:'posDobin'},{t:10,pos:'posLübeck'},{t:60+dt,pos:'posLübeck'}],
            ['sAdolf',{t:20,pos:'posWagrien'},{t:70+dt,pos:'posWagrien'}],
            ['sView',{t:20,pos:'posDobin'},{t:10,pos:'posLübeck'},{t:60+dt,pos:'posLübeck',scx:sc,scy:sc}]
          ]});
          if (1) { let sh;sds.splice(i0,0,
          cano.arrow({pos0:'posDobin',pos1:'posLübeck',t:t,duration:40+dt}),
          {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:13,pos:'posLübeck',text:sh='1147 ⚔ Obotrites raid Lübeck as Adolf II',fs:0,
          speech:'1147 Obotrites raid Lübeck as Adolf 2nd cannot prevent the Wendish crusade.'
          },{t:t+10,fs:0},{t:20,spring:1,fs:5},{t:40+dt,fs:5},{t:10,fs:0}]},
          {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:18.5,pos:'posLübeck',text:'cannot prevent the Wendish crusade.',fs:0},{t:t+10,fs:0},{t:20,spring:1,fs:5},{t:40+dt,fs:5},{t:10,fs:0}]}
          );i0+=3;episodes.add({t:t,text:'1147 Obotrites raid Lübeck'}); }
          t+=90+dt;
        //...
      }
      ;
      function dobin1147() {
        //---
        let dt=90;
          cano.addShapes({allShapes:allShapes,a:[
            ['sNiklot',{t:20,pos:'posDobin'},{t:10,pos:'posDobin',x:8},{t:60+dt,pos:'posDobin',x:8}],
            ['sAdolf',{t:20,pos:'posWagrien'},{t:10,pos:'posDobin',x:-8},{t:60+dt,pos:'posDobin',x:-8}],
            ['sHenry',{t:20,pos:'posHenry0'},{t:10,pos:'posDobin',x:-20},{t:60+dt,pos:'posDobin',x:-20}],
            ['sSven3',{t:20,pos:'posZealand'},{t:10,pos:'posDobin',x:-32},{t:50+dt,pos:'posDobin',x:-32},{t:10,pos:'posZealand',x:0}],
            ['sKnut5',{t:20,pos:'posJutland'},{t:10,pos:'posDobin',x:-44},{t:50+dt,pos:'posDobin',x:-44},{t:10,pos:'posJutland',x:0}],
            ['sView',{t:20,pos:'posLübeck',scx:3,scy:3},{t:10,pos:'posDobin',scx:sc,scy:sc},{t:60+dt,pos:'posDobin',scx:sc,scy:sc}]
          ]});
          if (1) { let sh;sds.splice(i0,0,
          cano.arrow({pos0:'posHenry0',pos1:'posDobin',t:t,duration:40+dt}),
          cano.arrow({pos0:'posWagrien',pos1:'posDobin',t:t,duration:40+dt}),
          cano.arrow({pos0:'posZealand',pos1:'posDobin',t:t,duration:40+dt}),
          cano.arrow({pos0:'posJutland',pos1:'posDobin',t:t,duration:40+dt}),
          //{arrow:1,shapes:[{t:0,r:0,g:100,b:0,a:0.4,pos0:'posHenry0',pos1:'posHenry0'},{t:t,pos1:'posHenry0'},{t:10,pos1:'posDobin'},{t:60,pos1:'posDobin'},{t:0,pos1:'posHenry0'},{t:40,pos1:'posHenry0'}]},
          {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:15,pos:'posDobin',text:sh='1147 ⚔ Wendish crusade: Saxons and Danes besiege',fs:0,
          speech:'1147 Wendish crusade: Saxons and Danes besiege Dobin fortress. Niklot becomes vassal of Henry.'
          },{t:t+10,fs:0},{t:20,spring:1,fs:5},{t:40+dt,fs:5},{t:10,fs:0}]},
          {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:20.5,pos:'posDobin',text:'Dobin fortress. Niklot becomes vassal of Henry.',fs:0},{t:t+10,fs:0},{t:20,spring:1,fs:5},{t:40+dt,fs:5},{t:10,fs:0}]}
          );i0+=6;episodes.add({t:t,text:'1147 Wendish crusade'}); }
          t+=90+dt;
        //...
      }
      ;
      
      function dithmarschen1149() {
        //---
        let dt=70;
          addShapes({allShapes:allShapes,a:[
            ['sAdolf',{t:20,pos:'posWagrien'},{t:10,pos:'posDithmarschen',x:6},{t:60+dt,pos:'posDithmarschen',x:6}],
            ['sHenry',{t:20,pos:'posHenry0'},{t:10,pos:'posDithmarschen',x:-6},{t:50+dt,pos:'posDithmarschen',x:-6},{t:10,pos:'posHenry0',x:0}],
            ['sView',{t:20,pos:'posDobin',scx:3,scy:3},{t:10,pos:'posDithmarschen',scx:sc,scy:sc},{t:60+dt,pos:'posDithmarschen',scx:sc,scy:sc}]
          ]});
          if (1) { let sh;sds.splice(i0,0,
          arrow({pos0:'posHenry0',pos1:'posDithmarschen',t:t,duration:40+dt}),
          arrow({pos0:'posWagrien',pos1:'posDithmarschen',t:t,duration:40+dt}),
          {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:15,pos:'posDithmarschen',text:sh='1149 ⚔ Campaign against Dithmarschen',
          speech:'1149 Henry campaigns against Dithmarschen',fs:0},{t:t+10,fs:0},{t:20,spring:1,fs:5},{t:40+dt,fs:5},{t:10,fs:0}]},
          );i0+=3;episodes.add({t:t,text:'1149 Campaign against Dithmarschen'}); }
          t+=90+dt;
        //...
      }
      ;
      
      function knut1150() {
        //---
        let dt=70;
          addShapes({allShapes:allShapes,a:[
            ['sAdolf',{t:20,pos:'posWagrien'},{t:10,pos:'posKnut1150',x:21},{t:60+dt,pos:'posKnut1150',x:21}],
            ['sSven3',{t:20,pos:'posZealand'},{t:10,pos:'posKnut1150',x:10},{t:50+dt,pos:'posKnut1150',x:10},{t:10,pos:'posZealand',x:0}],
            ['sKnut5',{t:20,pos:'posJutland'},{t:10,pos:'posKnut1150',x:-10},{t:50+dt,pos:'posKnut1150',x:-10},{t:10,pos:'posJutland',x:0}],
            ['sView',{t:20,pos:'posDithmarschen',scx:3,scy:3},{t:10,pos:'posKnut1150',scx:sc,scy:sc},{t:60+dt,pos:'posKnut1150',scx:sc,scy:sc}]
          ]});
          let sh;sds.splice(i0,0,
            arrow({pos0:'posWagrien',pos1:'posKnut1150',t:t,duration:40+dt}),
            arrow({pos0:'posZealand',pos1:'posKnut1150',t:t,duration:40+dt}),
            arrow({pos0:'posJutland',pos1:'posKnut1150',t:t,duration:40+dt}),
            {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:15,pos:'posKnut1150',text:sh='1150 ⚔ Knut attacks, Sven & Adolf defend',fs:0,
            speech:'1150 Knut attacks, Sven & Adolf defend'},{t:t+10,fs:0},{t:20,spring:1,fs:5},{t:40+dt,fs:5},{t:10,fs:0}]},
          );i0+=4;episodes.add({t:t,text:'1150 Knut attacks, Sven & Adolf defend'});
          t+=90+dt;
        //...
      }
      
      
      function kessCirc1151() {
        //---
        let dt=70;
          addShapes({allShapes:allShapes,a:[
            ['sAdolf',{t:20,pos:'posWagrien'},{t:10,pos:'posKessCirc',x:-5},{t:50+dt,pos:'posKessCirc',x:-5},{t:10,pos:'posWagrien',x:0}],
            ['sNiklot',{t:20,pos:'posDobin'},{t:10,pos:'posKessCirc',x:5},{t:50+dt,pos:'posKessCirc',x:5},{t:10,pos:'posDobin',x:0}],
            ['sView',{t:20,pos:'posKnut1150',scx:3,scy:3},{t:10,pos:'posKessCirc',scx:sc,scy:sc},{t:60+dt,pos:'posKessCirc',scx:sc,scy:sc}]
          ]});
          let sh;sds.splice(i0,0,
            arrow({pos0:'posWagrien',pos1:'posKessCirc',t:t,duration:40+dt}),
            arrow({pos0:'posDobin',pos1:'posKessCirc',t:t,duration:40+dt}),
            {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:13,pos:'posKessCirc',text:sh='1151 ⚔ Campaign against Kessinians and Circipanes',fs:0,
            speech:'1151 Niklot and Adolf campaign agains Kessinians and Circipanes.'},{t:t+10,fs:0},{t:20,spring:1,fs:5},{t:40+dt,fs:5},{t:10,fs:0}]},
          );i0+=3;episodes.add({t:t,text:'1151 Campaign vs. Kessinians & Circipanes'});
          t+=90+dt;
        //...
      }
      
      
      function roskilde1157() {
        //---
        let dt=70;
          addShapes({allShapes:allShapes,a:[
            ['sSven3',{t:20,pos:'posZealand'},{t:10,pos:'posRoskilde',x:6},{t:60+dt,pos:'posRoskilde',x:6}],
            ['sKnut5',{t:20,pos:'posJutland'},{t:10,pos:'posRoskilde',x:-6,w:30,h:30},{t:10,x:-6,w:15,h:15,pos:'posRoskilde'},{t:30+dt,w:15,h:15,show:1},{t:20,show:0}],
            ['sVald1',{t:20,pos:'posSchleswig'},{t:10,pos:'posRoskilde',x:-18},{t:10,pos:'posRoskilde',x:-40},{t:50+dt,pos:'posRoskilde',x:-40}],
            ['sView',{t:20,pos:'posKessCirc',scx:3,scy:3},{t:10,pos:'posRoskilde',scx:sc,scy:sc},{t:60+dt,pos:'posRoskilde',scx:sc,scy:sc}]
          ]});
          let sh;sds.splice(i0,0,
            arrow({pos0:'posRoskilde',pos1:'posRoskildeFlight',t:t+10,duration:40+dt}),
            {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:15,pos:'posRoskilde',text:sh='1157 Bloodfest Roskilde, Sven kills Knut, Valdemar flees',
            speech:'1157 Bloodfest Roskilde, Sven kills Knut, Valdemar flees',fs:0},{t:t+10,fs:0},{t:20,spring:1,fs:5},{t:60+dt,fs:5},{t:10,fs:0}]},
          );i0+=2;episodes.add({t:t,text:'1157 Bloodfest Roskilde'});
          t+=90+dt;
        //...
      }
      
      
      
      function grathe1157() {
        //---
        let dt=70;
          addShapes({allShapes:allShapes,a:[
            ['sSven3',{t:20,pos:'posZealand'},{t:10,pos:'posJutland',x:10,w:30,h:30},{t:10,pos:'posJutland',x:10,w:15,h:15},{t:30+dt,w:15,h:15,show:1},{t:20,show:0}],
            ['sKnut5',{t:20,show:0},{t:70+dt}],
            ['sVald1',{t:20,pos:'posSchleswig',x:0},{t:10,pos:'posJutland',x:-10},{t:60+dt,pos:'posJutland',x:-10}],
            ['sView',{t:20,pos:'posRoskilde',scx:3,scy:3},{t:10,pos:'posJutland',scx:sc,scy:sc},{t:60+dt,pos:'posJutland',scx:sc,scy:sc}]
          ]});
          let sh;sds.splice(i0,0,
            arrow({pos0:'posZealand',pos1:'posJutland',t:t,duration:40+dt}),
            {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:15,pos:'posJutland',text:sh='1157 ⚔ Battle of Grathe Heath, Valdemar defeats Sven',fs:0,
            speech:'1157 Battle of Grathe Heath, Valdemar defeats Sven'},{t:t+10,fs:0},{t:20,spring:1,fs:5},{t:40+dt,fs:5},{t:10,fs:0}]},
          );i0+=2;episodes.add({t:t,text:'1157 Battle of Grathe Heath'});
          t+=90+dt;
        //---
      }
      
      function raid1158() {
        //---
        let dt=70;
          addShapes({allShapes:allShapes,a:[
            ['sVald1',{t:20,pos:'posJutland'},{t:10,pos:'posZealand'},{t:60+dt,pos:'posZealand'}],
            ['sNiklot',{t:20,pos:'posDobin'},{t:10,pos:'posKessCirc'},{t:60+dt,pos:'posKessCirc'}],
            ['sView',{t:20,pos:'posJutland',scx:3,scy:3},{t:10,pos:'posRaidDanObo',scx:sc,scy:sc},{t:60+dt,pos:'posRaidDanObo',scx:sc,scy:sc}]
          ]});
          let sh;sds.splice(i0,0,
            arrow({pos0:'posZealand',pos1:'posRaidDanObo',t:t,duration:40+dt}),
            arrow({pos0:'posKessCirc',pos1:'posRaidDanObo',t:t,duration:40+dt}),
            {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:0,pos:'posRaidDanObo',text:sh='1158-1160 ⚔ Raids between Danes and Obotrites',fs:0,
            speech:'1158-1160 Raids between Danes and Obotrites'},{t:t+10,fs:0},{t:20,spring:1,fs:5},{t:40+dt,fs:5},{t:10,fs:0}]},
          );i0+=3;
          episodes.add({t:t,text:'1158-1160 Raids Obotrites vs. Danes'});
          t+=90+dt;
        //---
      }
      
      function werle1160() {
        //---
        let dt=70;
          addShapes({allShapes:allShapes,a:[
            ['sNiklot',{t:20,pos:'posKessCirc'},{t:10,pos:'posWerle',x:8,w:20,h:20},{t:10,pos:'posWerle',x:8,w:10,h:10},{t:30+dt,w:10,h:10,show:1},{t:20,show:0}],
            ['sAdolf',{t:20,pos:'posWagrien'},{t:10,pos:'posWerle',x:-8},{t:60+dt,pos:'posWerle',x:-8}],
            ['sHenry',{t:20,pos:'posHenry0'},{t:10,pos:'posWerle',x:-20},{t:60+dt,pos:'posWerle',x:-20}],
            ['sVald1',{t:20,pos:'posZealand'},{t:10,pos:'posWerle',x:-32},{t:60+dt,pos:'posWerle',x:-32}],
            ['sView',{t:20,pos:'posRaidDanObo',scx:3,scy:3},{t:10,pos:'posWerle',scx:sc,scy:sc},{t:60+dt,pos:'posWerle',scx:sc,scy:sc}]
          ]});
          let sh;sds.splice(i0,0,
            arrow({pos0:'posZealand',pos1:'posWerle',t:t,duration:40+dt}),
            arrow({pos0:'posWagrien',pos1:'posWerle',t:t,duration:40+dt}),
            arrow({pos0:'posHenry0',pos1:'posWerle',t:t,duration:40+dt}),
            {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:15,pos:'posWerle',text:sh='1160 ⚔ Saxons and Danes besiege Werle fortress.',fs:0,
            speech:'1160 Saxons and Danes besiege Werle fortress. Bernhard 1st kills Niklot.'},{t:t+10,fs:0},{t:20,spring:1,fs:5},{t:40+dt,fs:5},{t:10,fs:0}]},
            {text:1,shapes:[{t:0,r:0,g:0,b:0,a:0.7,x:0,y:20.5,pos:'posWerle',text:'Bernhard I. kills Niklot.',fs:0},{t:t+10,fs:0},{t:20,spring:1,fs:5},{t:40+dt,fs:5},{t:10,fs:0}]},
          );i0+=5;
          episodes.add({t:t,text:'1160 Saxons & Danes besiege Werle fortress'});
          t+=90+dt;
        //---
      }
      
      
      
      
      
      intro();
      pact1143();
      luebeckRaid1147();
      dobin1147();
      dithmarschen1149();
      knut1150();
      kessCirc1151();
      roskilde1157();
      grathe1157();
      raid1158();
      werle1160();
      
      console.log(episodes);
      //...
    }
    
    cano.add({
      script:'/anim/arrows/canvApps/shapes.js',
    });
    
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
//fr o,3
//fr o,3,4
//fr o,3,4,3
//fr o,3,4,3,16
//fr o,3,4,3,18
//fr o,3,4,3,43
//fr o,3,4,9
//fr p,22,131
