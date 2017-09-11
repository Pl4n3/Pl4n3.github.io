//---
var Sound={};
(function(Sound) {
  Sound.vol=1;
  Sound.mute=false;
  Sound.sounds={};
  var audioPools={},useWebaudio=1,context,audio,osch={};
  
  function getPool(src) {
    var pool=audioPools[src];
    if (!pool) {
      var asrc=(src.indexOf('.')==-1)?'sound/'+src+'.wav':src;//a.src=src;
      
      
      if (useWebaudio) {
        if (!context) context=window.AudioContext?new window.AudioContext():new window.webkitAudioContext();
        pool={};
        //onsole.log('Sound.getPool '+asrc);
        var r=new XMLHttpRequest();
        r.open('GET',asrc,true);
        r.responseType='arraybuffer';
    r.onload=function() {
      //onsole.log('Sound.getPool.onload '+asrc);
      context.decodeAudioData(r.response,function(buffer) {
        //onsole.log('Sound.getPool.onload.decodedAudioData '+asrc);
        pool.buffer=buffer;
        if (pool.playOnload) { delete(pool.playOnload);Sound.play(src,1); }
      }
      ,function() {
        console.log('Sound.getPool.onload.decodeAudioDataError '+asrc);
      }
      );
    }
        r.send();
      } else {
      var a=document.createElement('audio');
      //a.src='file:///C:/q/data/sound/'+src+'.wav';
      a.src=asrc;//if (src.indexOf('.')==-1) a.src='sound/'+src+'.wav'; else a.src=src;
      //alert(a.src);
      a.preload=1;//a.volume=0.3;
      pool=[a];//document.getElementById('audio'+src)];
      }
      
      audioPools[src]=pool;
    }
    return pool;
  }
  Sound.preload=function(src) {
    var f=Sound.sounds[src];
    if (f) {
      var h=f();
      src=h.src;
    }
    getPool(src);
  }
  Sound.play=function(src,vol) {
    //----
    //if (1) return;
    if (Sound.mute) return;
    var f=Sound.sounds[src];
    if (vol===undefined) vol=1;
    vol*=Sound.vol;
    if (f) {
      var h=f();
      src=h.src;
      if (h.vol) vol*=h.vol;
    }
    //og('Sound.play '+vol);
    //----
    var pool=getPool(src);
    
    if (useWebaudio) {
      if (!pool.buffer) 
        pool.playOnload=1;
      else {
        //onsole.log('Sound.play webaudio src='+src+' vol='+vol);
        var source=context.createBufferSource();
        source.buffer=pool.buffer;
        var gain=context.createGain();
        gain.gain.value=vol;
        source.connect(gain);
        gain.connect(context.destination);
        source.start(0);
      }
      return;
    }
    var a;
    for (var h=0;h<pool.length;h++) {
      a=pool[h];
      if (a.paused||a.ended){
        //try { a.currentTime=0; } catch (e) {log(''+e);}
        a.volume=vol;
        a.play();//log('sound0 '+si++);
        a=undefined;
        break;
      }
    }
    //audio.currentTime = 0.0;
    if (a) {
      a=a.cloneNode(true);//a.volume=0.3;
      //onsole.log('vol='+vol);
      a.volume=vol;
      a.play();//log('sound1 '+si++);
      pool.push(a);
      //log('creating audio' + pool.length);
    }
    
  }
  Sound.osc=function(ps) {
    if (!audio) audio=window.AudioContext?new window.AudioContext():new window.webkitAudioContext();
    var gain,vol=0.6*Sound.vol;//0.6;//0.2,0.6
    var oa=[],a=ps.a;
    if (ps.lv===undefined) {
      gain=audio.createGain();
      gain.connect(audio.destination);
    } else {  
      gain=audio.createGain();
      var lgain=audio.createGain(),
          rgain=audio.createGain(),
          merger=audio.createChannelMerger(2);
      lgain.gain.value=ps.lv;
      rgain.gain.value=ps.rv;
      gain.connect(lgain);
      gain.connect(rgain);
      lgain.connect(merger,0,0);
      rgain.connect(merger,0,1);
      merger.connect(audio.destination);
    }
    
    var t=0,at=audio.currentTime;
    var k=a[0];
    gain.gain.setValueAtTime(k.v*vol,at);
    var f=k.fr?k.fr[0]+Math.floor(Math.random()*k.fr[1]):k.f;
    for (var i=0;i<(k.n?k.n:1);i++) {
      var osc=audio.createOscillator();
      osc.frequency.setValueAtTime(f*Math.pow(2,i),at);
      osc.connect(gain);
      osc.type='sawtooth';
      oa.push(osc);
    }
    for (var h=1;h<a.length;h++) {
      var k=a[h];
      t+=k.t;
      if (k.v!==undefined) gain.gain.linearRampToValueAtTime(k.v*vol,at+t/1000);
      var f=undefined;
      if (k.fr) f=k.fr[0]+Math.floor(Math.random()*k.fr[1]);
      else if (k.f!==undefined) f=k.f;
      if (f!==undefined) for (var i=0;i<oa.length;i++) {
        oa[i].frequency.linearRampToValueAtTime(f*Math.pow(2,i),at+t/1000);
      }
    }
    for (var i=0;i<oa.length;i++) oa[i].start(0);
    
    setTimeout(function() {
      for (var i=0;i<oa.length;i++) {
        var osc=oa[i];
        osc.stop(0);
        osc.disconnect(gain);
      }
      //gain.disconnect(audio.destination);
      gain.isDisconnect=true;
    }
    ,t);
    return gain;
  }
  Sound.oscs=function(s) {
    var ps=osch[s];
    if (!ps) { ps={a:JSON.parse(s)};osch[s]=ps; }
    Sound.osc(ps);
  }
}
)(Sound);
//---
//fr o,2
//fr o,2,5
//fr o,2,5,12
//fr o,2,5,12,1
//fr o,2,7
//fr o,2,8
//fr o,2,8,44
//fr o,2,9
//fr p,2,58
