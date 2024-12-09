//---
(function() {
  //----
  let url=Conet.parseUrl(),
      audioContext,player,presets,timeoutIds={};
  
  console.log('v.0.38 ');//FOLDORUPDATEVERSION
  
  function scriptUrls() {
    //---
    //script src='/sound/webaudiofont/WebAudioFontPlayer.js'>/script>
    //script src='/sound/webaudiofont/0520_FluidR3_GM_sf2_file.js'>/script>
    //script src='/sound/webaudiofont/0550_FluidR3_GM_sf2_file.js'>/script>
    //script src='/sound/webaudiofont/12835_6_FluidR3_GM_sf2_file.js'>/script>
    //script src='/sound/webaudiofont/12840_6_FluidR3_GM_sf2_file.js'>/script>
    //script src='/sound/webaudiofont/12842_6_FluidR3_GM_sf2_file.js'>/script>
    //script src='/sound/webaudiofont/0000_FluidR3_GM_sf2_file.js'>/script>
    
    //script src='https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js'>/script>
    //script src='https://surikov.github.io/webaudiofontdata/sound/0520_FluidR3_GM_sf2_file.js'>/script>
    //script src='https://surikov.github.io/webaudiofontdata/sound/0550_FluidR3_GM_sf2_file.js'>/script>
    //script src='https://surikov.github.io/webaudiofontdata/sound/12835_6_FluidR3_GM_sf2_file.js'>/script>
    //script src='https://surikov.github.io/webaudiofontdata/sound/12840_6_FluidR3_GM_sf2_file.js'>/script>
    //script src='https://surikov.github.io/webaudiofontdata/sound/12842_6_FluidR3_GM_sf2_file.js'>/script>
    //script src='https://surikov.github.io/webaudiofontdata/sound/0000_FluidR3_GM_sf2_file.js'>/script>
    //...
  }
  
  function queueNode(o,ph,depth) {
    //...
    
    var h,parseErr=undefined;
    depth=depth||0;
    
    if (o.sah) h=o.sah; else
    try {
    h=JSON.parse(o.sa.join(''));
    } catch (e) { h={};parseErr=1; }
    
    if (ph) {
      //if (ph.whenAdd&&h.whenAdd) ph.whenAdd+=h.whenAdd;
      Conet.hcopy(ph,h,undefined,{whenAdd:1});//,undefined,undefined,1);
      h.whenAdd=(ph.whenAdd||0)+(h.whenAdd||0);
    }
    
    if (!parseErr) {
    var selectedPreset=presets[h.preset]||window[h.preset]||presets.ahhs;
    //player.adjustPreset(audioContext,selectedPreset);
    //var audioBufferSourceNode=player.queueWaveTable(audioContext,audioContext.destination,selectedPreset,audioContext.currentTime+0,h.pitch,0.4);
    //var audioBufferSourceNode=player.queueWaveTable(audioContext,audioContext.destination,selectedPreset,audioContext.currentTime+0.4,h.pitch,0.2);
    //var audioBufferSourceNode=player.queueWaveTable(audioContext,audioContext.destination,selectedPreset,audioContext.currentTime+0.6,h.pitch,0.2);
    //var audioBufferSourceNode=player.queueWaveTable(audioContext,audioContext.destination,selectedPreset,audioContext.currentTime+0.8,h.pitch,4);
    var pitch=h.pitch;
    if (pitch!==undefined) {
      if (Array.isArray(pitch)) pitch=pitch[0]+pitch[1]*12;
      if (h.pitchAdd) pitch+=h.pitchAdd;
      var when=h.when||0;
      if (h.whenAdd) {//&&(depth!=2)) { 
        when+=h.whenAdd;
        //console.log('Doing whenAdd depth='+depth); 
      }
      if (h.whenMul) when*=h.whenMul;
      if (1) 
        var audioBufferSourceNode=player.queueWaveTable(audioContext,audioContext.destination,selectedPreset,audioContext.currentTime+when,pitch,h.duration||1);
      else { //following maybe with param like node.times4
        player.queueWaveTable(audioContext,audioContext.destination,selectedPreset,audioContext.currentTime+when    ,pitch,0.4);
        player.queueWaveTable(audioContext,audioContext.destination,selectedPreset,audioContext.currentTime+when+0.4,pitch,0.2);
        player.queueWaveTable(audioContext,audioContext.destination,selectedPreset,audioContext.currentTime+when+0.6,pitch,0.2);
        player.queueWaveTable(audioContext,audioContext.destination,selectedPreset,audioContext.currentTime+when+0.8,pitch,4);
      }
      
      if (0&&window.cano) {
      var id=setTimeout(
    function() {
      //---
      delete(timeoutIds[id]);
      var bgcol=o.ogbgcol||o.bgcol;
      o.ogbgcol=bgcol;
      o.bgcol='#0f0';
      setTimeout(
      function() {
        //---
        o.bgcol=bgcol;
        delete(o.ogbgcol);
        //...
      }
      ,500);
      //...
    }
      ,when*1000);
      timeoutIds[id]=1;
      }
    }
    }
    
    if (o.children) for (var oh of o.children) queueNode(oh,h,depth+1);
    
    //---
  }
  function init() {
    //---
    console.log('audio.js init');
    //Conet.hcopy({scx:1,scy:1},view);
    if (window.cano) {
    
    cano.smallScale=0.5;
    cano.onUp=function(o) {
      //...
      if (!cano.audioQueuesStay) {
        player.cancelQueue(audioContext);
        for (var id of Object.keys(timeoutIds)) clearTimeout(id);
        timeoutIds={};
      } //else console.log('audio queues stay');
      queueNode(o);
      //---
    }
    
    }
    
    var AudioContextFunc=window.AudioContext||window.webkitAudioContext;
    audioContext=new AudioContextFunc();
    player=new WebAudioFontPlayer();
    
    presets={
      ahhs:_tone_0520_FluidR3_GM_sf2_file,
      ohit:_tone_0550_FluidR3_GM_sf2_file,
      bassdrum2:_drum_35_6_FluidR3_GM_sf2_file,
      snaredrum2:_drum_40_6_FluidR3_GM_sf2_file,
      closedhihat:_drum_42_6_FluidR3_GM_sf2_file,
      gp:_tone_0000_FluidR3_GM_sf2_file,//---grand piano
    };
    
    for (var preset of Object.values(presets)) player.adjustPreset(audioContext,preset);
    
    //cano.selCount=0;
    //cano.checkDown=1;
    
    //player.adjustPreset(audioContext,_tone_0520_FluidR3_GM_sf2_file);
    //player.adjustPreset(audioContext,_tone_0550_FluidR3_GM_sf2_file);
    
    //...
  }
  //init();
  function loadWebaudiofont() {
    //---
    Conet.load({a:[
    {fn:'/sound/webaudiofont/WebAudioFontPlayer.js'},
    {fn:'/sound/webaudiofont/0520_FluidR3_GM_sf2_file.js'},
    {fn:'/sound/webaudiofont/0550_FluidR3_GM_sf2_file.js'},
    {fn:'/sound/webaudiofont/12835_6_FluidR3_GM_sf2_file.js'},
    {fn:'/sound/webaudiofont/12840_6_FluidR3_GM_sf2_file.js'},
    {fn:'/sound/webaudiofont/12842_6_FluidR3_GM_sf2_file.js'},
    {fn:'/sound/webaudiofont/0000_FluidR3_GM_sf2_file.js'}
    ],onAll:init});
    //...
  }
  //---
  function parseMusicXml(ps) {
    //---
    
    function dget(p,k) {
      return p.getElementsByTagName(k)[0];
      //...
    }
    function dgets(p,k) {
      return dget(p,k).innerHTML;
      //...
    }
    function dgeti(p,k) {
      return parseInt(dget(p,k).innerHTML);
      //...
    }
    
    function parse(v) {
      //---
      console.log('parse');
      let steph={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
      //onsole.log(v.length);
      let parser=new DOMParser();
      let doc=parser.parseFromString(v,'application/xml');
      //onsole.log(doc);
      window.doc=doc;
      let a=doc.children[0];
      //console.log(Object.keys(a));
      let queue=[],trackt={},t=0,doctave=1,preset='gp';//'ohit';'ahhs';
      for (let e of a.children) {
        //onsole.log(e);
        //onsole.log(e.tagName);
        if (e.tagName=='part') {
          //onsole.log(e);
          let meascount=0;
          for (let c of e.children) {
            if (c.tagName=='measure') {
              //meascount++;
              //if (meascount<14) continue;
              //if (meascount>18) break;
              //onsole.log(c);
              for (let c0 of c.children) {
                if (c0.tagName=='forward') t+=dgeti(c0,'duration');
                if (c0.tagName=='backup') t-=dgeti(c0,'duration'); 
                if (c0.tagName=='note') {
                  //onsole.log(c0);
                  let pitch=dget(c0,'pitch');//c0.getElementsByTagName('pitch')[0];
                  //if (!pitch) {
                  //  console.log('no pitch:');
                  //  console.log(c0);
                  //  continue;
                  //}
                  let track=dgets(c0,'voice');//'stem');
                  if (trackt[track]===undefined) trackt[track]=0;
                  let duration=dgeti(c0,'duration');//*0.25;
                  let chord=dget(c0,'chord');
                  if (chord) {
                    //onsole.log('chord!!!');
                    t-=duration;
                  }
                  //if (stem=='up') {
                    //onsole.log(step+' '+steph[step]+' '+octave+' '+stem+' '+duration);
                  if (pitch) {
                    let step=dgets(pitch,'step');
                    let octave=dgeti(pitch,'octave');
                    let alter=dgeti(pitch,'alter');
                    //if (steph[step]===undefined) console.warn('not steph: '+step);
                    //queue.push({sah:{pitch:steph[step]+alter+(octave+doctave)*12,preset:preset,when:t*0.25,duration:duration*0.25}});
                    ps.note({pitch:steph[step]+alter+(octave+doctave)*12,when:t,duration:duration,track:track});
                    //queue.push({sah:{pitch:[steph[step]+alter,octave+doctave],preset:preset,when:t*0.25,duration:duration*0.25}});
                    //queue.push({sah:{pitch:[steph[step],octave],preset:'gp',when:trackt[track],duration:duration}});
                  }
                  trackt[track]+=duration;
                  t+=duration;
                  //}
                  //onsole.log(step.value+' '+octave);
                }
              }
            }
          }
        }
      }
      if (ps.done) ps.done();
      //...
    }
    
    if (ps.fn) Conet.download({fn:ps.fn,f:parse});
    else parse(ps.v);
    //...
  }
  
  
  window.canvAppsAudio={
    loadWebaudiofont:loadWebaudiofont,
    queueNode:queueNode,
    parseMusicXml:parseMusicXml,
  };
  
  if (window.cano) cano.addScriptHook(loadWebaudiofont);
  //window.canoAudioInit=loadWebaudiofont;
  //...
}
)()
//...
//fr o,1
//fr o,1,6
//fr o,1,8
//fr o,1,8,44
//fr o,1,8,44,6
//fr o,1,9
//fr o,1,9,6
//fr o,1,11
//fr o,1,13
//fr o,1,13,6
//fr p,9,71
