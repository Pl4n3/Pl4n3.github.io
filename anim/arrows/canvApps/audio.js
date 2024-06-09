//---
(function() {
  //----
  let url=Conet.parseUrl(),
      audioContext,player,presets,timeoutIds={};
  
  console.log('v.0.16 ');//FOLDORUPDATEVERSION
  
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
    
    if (o.children) for (var oh of o.children) queueNode(oh,h,depth+1);
    
    //---
  }
  function init() {
    //---
    console.log('audio.js init');
    //Conet.hcopy({scx:1,scy:1},view);
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
  if (window.cano) cano.addScriptHook(loadWebaudiofont);
  //window.canoAudioInit=loadWebaudiofont;
  //...
}
)()
//...
//fr o,1
//fr o,1,6
//fr o,1,8
//fr o,1,8,42
//fr o,1,8,42,6
//fr o,1,9
//fr o,1,9,5
//fr o,1,11
//fr p,11,151
