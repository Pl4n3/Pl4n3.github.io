var Conet={};
(function(Conet) {
  Conet.offline=false;
  Conet.version='1.470 ';//FOLDORUPDATEVERSION
  Conet.files={};
  var uploads={},fns,logc,logs=[],//fn=>data,first
      logSameLineCount=0,ac,downloads={},PI=Math.PI;
  function xhr(p) {
    var x=new XMLHttpRequest(),ps=p.ps||{},omt;
    x.overrideMimeType(omt=(ps.overrideMimeType||'text/plain'));
    //onsole.log('conet.xhr omt='+omt);
    x.open('GET',p.url,true);
    x.onreadystatechange=function() {
      //onsole.log('Conet.xhr '+x.readyState);
      if (x.readyState!=4) return;
      //console.log(x.responseText);
      if (p.f) p.f(x.responseText);//sendChunk();
    }
    try {
    x.send(null);
    } catch (e) { console.log('Conet.xhr err');console.log(e); }
    return x;
  }
  function upload(p) {
    //onsole.log('Conet.upload 0');
    //onsole.trace();
    if (Conet.offline) {
      //onsole.log('Conet.upload 1');
      localStorage['conetd'+p.fn]=p.data;
      localStorage['conetu'+p.fn]='update';
      if (p.f) p.f();
      return;
    }
    
    
    var fn=p.fn,uh=uploads[fn];
    if (uh) {  uh.data=p.data;uh.first=!p.append;return; }//true
    uh={data:p.data,first:!p.append};uploads[fn]=uh;//true
    
    //var fn=p.fn,ser=p.data,first=true;
    
    
    function sendChunk(responseText) {
      var uh=uploads[fn];
      if (!uh.first&&(uh.data.length==0)) {
        xhr({url:fn+'?CONETFC'});
        //setTimeout(function() { xhr({url:fn+'?CONETFC',f:function (s) {alert(s);}}); },1000);
        delete(uploads[fn]);
        if (p.f) p.f(responseText);
        if (p.log) p.log(responseText===''?'Conet-save error.':'Conet-saved: '+p.fn+' '+p.data.length);
        return;
      }
      if (p.log&&p.logChunk) p.log('conet-sendChunk '+uh.data.length);
      if (uh.data===undefined) { console.log('uh.data undefined');return; } //---unclear how
      console.log('conet-sendChunk '+uh.data.length);
      
      var sh,clen=100000;//200000 was ok,400000 err;
      if (uh.data.length>clen) {
        sh=uh.data.substr(0,clen);uh.data=uh.data.substr(clen);
      } else {
        sh=uh.data;uh.data='';
      }
      var url=fn+'?'+(uh.first?'RESET&':'')+'APPEND='+encodeURIComponent(sh);
      uh.first=false;
      xhr({url:url,f:sendChunk});
      /*
      setTimeout(function() {
        xhr({url:url,f:sendChunk});
      }
      ,1000);
      */
    }
    sendChunk();
  }
  function download(p) {
    var noResponseTimer;
    if (p.checkParams) Conet.checkParams(p,{
      fn:1,f:1,cache:1,json:1,usecache:{notWith:['cache','json']},
      checkParams:1, //for now this param needed since planim.loadObj invokes donwload with lots other params
      i:1, //used in taFold.linearView, besser use 'userData' to avoid clashes
      fh:1, //used in Conet.load
    });
    
    
    if (p.cache) {
      var dl=downloads[p.fn];
      if (dl) {
        if (dl.done) {
          p.f(dl.data);
        } else dl.waiting.push(p);
        return;
      }
      downloads[p.fn]={waiting:[]};
    }
    
    var x=xhr({url:p.fn,ps:p,f:function(s) {
      clearTimeout(noResponseTimer);
      if (x.status!=200) {
        console.log('conet.download '+p.fn+': offline (status!=200) '+noResponseTimer);
        if (!p.usecache) { Conet.offline=false;p.f(undefined);return; }//nocache
        Conet.offline=true;
        s=localStorage['conetd'+p.fn];
        if (s!==undefined) p.f(s);
        return;
      }
      Conet.offline=false;
      if (localStorage['conetu'+p.fn]=='update') {
        localStorage['conetu'+p.fn]='';
        s=localStorage['conetd'+p.fn];
        p.f(s);
        console.log('uploading offline changes.');
        upload({fn:p.fn,data:s});
        return;
      }
      if (p.usecache) {
        localStorage['conetd'+p.fn]=s;
        console.log('conet.download set localStorage: conetd'+p.fn);
      }
      if (p.json) s=JSON.parse(s);
      p.f(s);
      if (p.cache) {
        var dl=downloads[p.fn];
        dl.data=s;dl.done=true;
        for (var pw of dl.waiting) pw.f(s);
        delete(dl.waiting);
      }
      
    }
    });
    noResponseTimer=setTimeout(function() {
      console.log('conet.download '+p.fn+': offline (timer)');
      x.abort();
      //---following handling not needed, since after abort above handler is executed
      //offline=true;
      //s=localStorage['conetd'+p.fn];
      //if (s!==undefined) p.f(s);
    }
    ,10000);
  }
  function lz(n) {
    return n<10?'0'+n:n;
  }
  function dir(p) {
    //--
    download({fn:p.fn,f:function (v) {
      var a=v.split('\n'),ra=[];
      for (var i=0;i<a.length;i++) {
        var s=a[i];
        //if (!s.startsWith('<tr><td nowrap><a')) continue;
        var i0=-1;
        //onsole.log(s);
        while (1) {
          i0=s.indexOf('">',i0+1);
          if (i0==-1) { break; }
          var i1=s.indexOf('</a>',i0);
          if (i1==-1) { break; }
          var sh=s.substr(i0+2,i1-i0-2);
          ra.push(sh);//onsole.log(s+' '+i0+' '+i1)
          i0=i1;
        }
      }
      p.f(ra);
      //onsole.log('conet.dir');
      //onsole.log(ra);
    }
    });
    //...
  }
  Conet.fileMenu=function(p) {
    //---m.a are set only for compatibility (e.g. in paint Load,Save else trigger localStorage io)
    //onsole.trace();//('fileMenu 0');
    //---
    function setCurFn(v) {
      m.curFn=v;
      Menu.ms(p.loadMs?mload:m,m.curFn);
      //...
    }
    function mload1() {
      ////m.curFn=this.s;
      ////Menu.ms(m,m.curFn);
      Conet.lastLoadMenu=this;
      var fn=this.a;//this.s;
      if (p.loadList||!p.savef) checkListFile(fn);//| if there is no save, filelist be updated on load
      else setCurFn(fn);//checkListFile(fn);
      p.loadf(fn);
    }
    function mloadUpdate() {
      mload.sub.splice(1,mload.sub.length-1);
      //onsole.log(m.files);
      var firstLoadableIndex=undefined,mn;
      for (var i=0;i<m.files.length;i++) {
        var o=m.files[i],fn=o.fn;
        if (p.noh) if (fn.indexOf('/h/')!=-1) continue;
        if (firstLoadableIndex===undefined) firstLoadableIndex=i;
        var i0=fn.lastIndexOf('/')+1;//if (i0==-1) i0=0;
        var i1=fn.indexOf('.',2);//skip path dots
        if (i1==-1) i1=fn.length;
        if (i1-i0>10) i0=i1-10;
        mload.sub.push(mn={s:fn.substr(i0,i1-i0),ms:fn.substr(0,i0)+'^'+fn.substr(i1)//,fs:0.5
          ,a:fn,actionf:mload1,cfmo:o});
        if (o.isrc) { mn.c2=new Image();mn.c2.src=o.isrc; }
        //if (ps&&ps.urlfn) {
        //  if (fn==ps.urlfn) {
        //    Conet.lastLoadMenu=undefined;
        //    console.log('conet: setting lastLoadMenu for urlfn.');
        //  }
        //}
      }
      return firstLoadableIndex;
    }
    function uploadFilenames() {
      Conet.upload({fn:p.fn,data:JSON.stringify(m.files)});
      //...
    }
    function checkListFile(v) {
      //onsole.log('Conet.checkListFile '+v);
      //onsole.trace();
      //m.curFn=v;
      //Menu.ms(p.loadMs?mload:m,m.curFn);
      setCurFn(v);
      var iv=-1;
      for (var i=m.files.length-1;i>=0;i--) if (m.files[i].fn==v) { iv=i;break; }
      if (iv==0) return;
      if (iv==-1) {
        m.files.splice(0,0,{fn:v});
      } else {
        var h=m.files[iv];
        m.files.splice(iv,1);
        m.files.splice(0,0,h);
      }
      mloadUpdate();
      uploadFilenames();//Conet.upload({fn:p.fn,data:JSON.stringify(m.files)});
      //...
    }
    Conet.fileMenuCount=(Conet.fileMenuCount||0)+1;
    var mload,msid='conetFileMenu'+Conet.fileMenuCount,
        m={s:'<span style="font-size:0.5em;">Conet</span>File',ms:'',msid:(p.loadMs?undefined:msid),sub:[],
          checkListFile:checkListFile};//ms:p.defFn||''
    
    if (p.m) for (var k in p.m) if (p.m.hasOwnProperty(k)) m[k]=p.m[k];
    
    if (p.newf) m.sub.push({s:'New',actionf:p.newf});
    
    m.sub.push(mload={s:'Load',noa:1,a:'conetLoad',sub:[{s:'...',tfHistLskey:p.tfHistLskey,tfDir:p.tfDir,doctrl:'Load'
    
    ,valuef:function() {
      return m.curFn||p.defFn||'';
    }
    ,setfunc:function(v,initLoad) {
      if (initLoad) return;
      checkListFile(v);
      p.loadf(v);
    }
    
    }]});
    
    if (p.loadMs) {
      mload.ms='';mload.msid=msid;
    }
    
    if (p.savef) {
    m.sub.push(
    {s:'Save',a:'conetSave',keys:['83_c'],ms:'<span style="color:#00f">ctrl+s</span>',actionf:function() {
      if (m.curFn!==undefined) checkListFile(m.curFn);
      p.savef(m.curFn);
    }
    });
    m.sub.push({s:'Save as&hellip;',a:'conetSaveAs',doctrl:'Save as'
    ,setfunc:function(v,initLoad) {
      if (initLoad) return;
      //m.curFn=v;
      //Menu.ms(m,m.curFn);
      //var iv=-1;
      //for (var i=m.files.length-1;i>=0;i--) if (m.files[i].fn==v) { iv=i;break; }
      //if (iv==-1) {
      //  m.files.splice(0,0,{fn:v});
      //} else {
      //  var h=m.files[iv];
      //  m.files.splice(h,1);
      //  m.files.splice(0,0,h);
      //}
      //mloadUpdate();
      //Conet.upload({fn:p.fn,data:JSON.stringify(m.files)});
      checkListFile(v);
      p.savef(v);
    }
    ,valuef:function() {
      return m.curFn||p.defFn||'';
    }
    });
    }
    
    if (p.url) {
      //onsole.log('Conet.fileMenu checking url: '+p.url);
      var s=document.URL,i=s.indexOf('?');
      if (i!=-1) {
        s=s.substring(i+1);
        var a=s.split('&'),params={};
        for (i=0;i<a.length;i++) {
          s=a[i];
          var b=s.split('=');
          params[b[0]]=b[1];
        }
        s=params[p.url];
        if (s) {
          console.log('Conet.fileMenu loading via url: '+s+' (history ignored)');
          p.loadf(s);
          return m;// {s:'-'};
        }
      }
    }
    
    Conet.download({fn:p.fn,f:function(v) {
      //onsole.log('Conet.fileMenu '+p.fn+' loaded.');//+v);
      if (v===undefined) {
        if (p.nolistf) p.nolistf();
        //onsole.log('conet.fileMenu.download.f v===undefined');
        var hfn=p.defFn||p.curFn;
        //onsole.log('conet.fileMenu no fn "'+p.fn+'", initing with "'+hfn+'"');
        m.files=(hfn!==undefined?[{fn:hfn}]:[]);
        Conet.upload({fn:p.fn,data:JSON.stringify(m.files)});
      } else {
        //onsole.log('conet.fileMenu found fn "'+p.fn+'": '+v);
        m.files=JSON.parse(v);
        
        //-----
        for (var i=m.files.length-1;i>=0;i--) {
          if (m.files[i].fn.length>100) {
            console.error('Conet.fileMenu: fn.len>100, splicing '+i);
            m.files.splice(i,1);
          }
          //console.log('Conet.fileMenu files-i.len='+m.files[i].fn.length);
        }
      }
      
      //Conet.fmFiles=m.files;//--- this is currently needed for cutouts app.js editmode
      if (p.filesRef) Conet.files[p.filesRef]=m.files;
      
      //onsole.log('Conet.fileMenu '+p.fn+' '+v);
      //onsole.log(Conet.fmFiles);
      
      var urlfn=undefined;
      if (p.loadUrlKey) {
        urlfn=Conet.parseUrl()[p.loadUrlKey];
      }
      
      var firstLoadableIndex=mloadUpdate();//{urlfn:urlfn});
      
      if (urlfn) {
        Conet.lastLoadMenu=undefined;
        setCurFn(urlfn);
        p.loadf(urlfn,1);
        return;
      }
      
      
      if (p.noStartLoad) return;
      //m.curFn=p.curFn?p.curFn:m.files[0].fn;
      //Menu.ms(p.loadMs?mload:m,m.curFn);
      //var url=Conet.parseUrl();
      checkListFile(p.curFn?p.curFn://(url.cfmload?url.cfmload:
        m.files[firstLoadableIndex].fn
        //)
        );//0
      Conet.lastLoadMenu=mload.sub[firstLoadableIndex+1];
      p.loadf(m.curFn,1);
    }
    });
    
    m.cfmLoad=function(s) {
      //console.log('cfmload '+s);
      //console.log(p);
      
      checkListFile(s);
      p.loadf(s);
      
    }
    m.checkListFile=checkListFile;
    m.uploadFilenames=uploadFilenames;
    return m;
  }
  Conet.initEditHistory=function(pf) {
    //---
    download({fn:'/util/edit.txt',f:function(s) {
      fns=JSON.parse(s);
      if (pf) pf();
    }
    });
    
  }
  Conet.initJsonTa=function(ps) {
    var c=ps.c;
    
    if (ps.auto) {
      if (c.value.length==0) return false;
      try {
        JSON.parse(c.value);
      } catch (er) {
        //onsole.log('conet.initJsonTa: no json.');
        return false;
      }
    }
    
    c.oninput=function(e) {
      //---
      //onsole.log(e);
      var c=e.target;//taps;
      try {
        ps.psh=JSON.parse(c.value);
        c.style.backgroundColor='#efa';//bfb
      } catch (er) {
        c.style.backgroundColor='#fbb';
      }
      //console.log(taps.value);
      //---
    }
    //...
    return true;
  }
  
  Conet.load=function(ps) {
    var a=ps.a,fcount=a.length;
    
    function onload(v) {
      //onsole.log('Conet.load.onload v='+v);
      
      if (this.fh) this.fh.v=v;
      
      fcount--;
      if (fcount>0) return;
      
      for (var fh of a) {
        if (fh.onAll) fh.onAll(fh.v);
      }
      if (ps.onAll) ps.onAll();
      //...
    }
    
    
    for (var fh of a) {
      if (fh.fn.endsWith('.js')) {
        var sc=document.createElement('script');
        sc.onload=onload;
        sc.src=fh.fn;
        document.body.appendChild(sc);
      } else 
        download({fn:fh.fn,f:onload,fh:fh});
    }
    
    //...
  }
  
  Conet.log=function(sh,ps) {
    if (!logc) {
      var c=document.createElement('div'),s=c.style;s.fontSize='10px';s.fontFamily='Sans-serif';s.paddingLeft='2px';
      s.position='absolute';c.innerHTML='Log:<br>123...';s.left='2px';s.top='50px';
      s.backgroundColor='rgba(250,250,250,0.3)';//'rgba(255,255,255,0.2)';
      s.userSelect=s.MozUserSelect=s.WebkitUserSelect='none';
      document.body.appendChild(c);Conet.logc=logc=c;
    }
    //logs.push(sh);
    
    var done=false;
    if (ps&&ps.sameline) {
      var i=sh.substr(' ');//---190904 cant work? better lastIndexOf ?
      if (i!=-1) {
        var isl=logs.length-1;//0
        if (logs[isl].startsWith(sh.substr(0,i+1))) {
          logSameLineCount++;
          logs[isl]=sh+' <span style="color:#666;">#'+logSameLineCount+'</span>';
          done=true;
        }
      }
    }
    if (!done) {
      var ml=5;//20
      //ogs.splice(0,0,sh);if (logs.length>ml) logs.length=ml;
      logs.push(sh);while (logs.length>ml) logs.splice(0,1);
      logSameLineCount=0;
    }
    logc.innerHTML='<b>Logs:</b> '+logs.join('<br>');
  }
  Conet.parseUrl=function(s) {
    if (s===undefined) s=document.URL;
    var i0=s.indexOf('?');
    s=(i0==-1?'':s.substr(i0+1));
    var a=s.split('&'),h={};
    for (var i=0;i<a.length;i++) {
      var sh=a[i];
      var i0=sh.indexOf('=');
      if (i0==-1) h[sh]=1; else h[sh.substr(0,i0)]=sh.substr(i0+1);
    }
    return h;
  }
  Conet.updateEditHistory=function(p) {
    var fn=p.fn;
    if (p.fns) fns=p.fns;
    
    if (!fns) {
    Conet.initEditHistory(function() {
      Conet.updateEditHistory(p);
    }
    );
    return;
    }
    
    var d=new Date(),ds=d.getFullYear()+'-'+lz(d.getMonth())+'-'+lz(d.getDate())+' '+lz(d.getHours())+':'
      +lz(d.getMinutes())+':'+lz(d.getSeconds());
    var found=false;
    for (var h=fns.length-1;h>=0;h--) {
      var a=fns[h];
      if (a[0]==fn) {
        fns.splice(h,1);
        a[1]++;a[2]=ds;
        fns.splice(0,0,a);
        found=true;
        break;
      }
    }
    if (!found) fns.splice(0,0,[fn,1,ds]);
    upload({fn:'/util/edit.txt',data:JSON.stringify(fns,undefined,' ')});
    fns=undefined;
    console.log('conet.updateEditHistory');
  }
  Conet.hcopy=function(from,to,ka,woh,keep,ps) {
    //190118 new option ps.delwo do delete keys in a hash
    //       e.g. hcopy(h,h,undef,{deleteThisKey:1},undefined,{delwo:1});
    //(keep it) same as Pd5.hcopy, this is just needed often
    if (!to) to={};
    
    if (ps&&ps.delall) for (var k in to) if (to.hasOwnProperty(k)) delete(to[k]);
    
    if (ka===undefined) {
      for (var k in from) if (from.hasOwnProperty(k)) {
        if (keep) if (to[k]!==undefined) continue;
        if (woh&&woh[k]) {
          if (ps&&ps.delwo) delete(to[k]);
        } else {
          if (ps&&ps.logOverwrite&&(to[k]!==undefined)) {
            console.log('overwriting '+to[k]+' with '+from[k]);
          }
          to[k]=from[k];
        }
      }
      return to;
    }
    for (var ki=0;ki<ka.length;ki++) {
      var k=ka[ki],v=from[k];
      if (v===undefined) continue;
      if (keep) if (to[k]!==undefined) continue;
      to[k]=v;
    }
    return to;
  }
  Conet.xhr=xhr;
  Conet.upload=upload;
  Conet.download=download;
  Conet.dir=dir;
  
  //--------------------------------------------------------
  //---seeded rand from https://stackoverflow.com/questions/
  //   521295/seeding-the-random-number-generator-in-javascript
  var m_w = 123456789,m_z = 987654321,mask = 0xffffffff,seed=1;
  // Takes any integer
  Conet.seed=function(i) {
    seed=i;
    m_w = (123456789 + i) & mask;
    m_z = (987654321 - i) & mask;
  }
  
  // Returns number between 0 (inclusive) and 1.0 (exclusive),
  // just like Math.random().
  Conet.rand=function() {
    if (1) {
      var x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }
    
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
  }
  Conet.rani=function(v) {
    return Math.floor(Conet.rand()*v);
    //...
  }
  //-------------------------------------------------------
  //--- url to a-html (anker)
  
  //---191009 change for taFold-linearView: domain can have -, 
  //---http is mandatory, if too strict for other apps, urlToAnk 
  //---should use different regexp via param
  //var urlRe=/(https?:\/\/)?(www\.)?(\w+\.\w+)(\/[\~\-\.\w]*)*/g;
  var urlRe=/(https?:\/\/)(www\.)?([\-\w]+(\.\w+)+)(\/[\=\&\?\~\-\.\w]*)*/g;
  function urlReplace(match,prot,www,domain,path,offset,string) {
    if ((prot===undefined)&&(www===undefined)&&(path===undefined)) return match;
    return '<a href='+match+'>'+domain+'</a>';
  }
  Conet.urlToAnk=function(s) {
    s=s.replace(urlRe,urlReplace);
    return s;
    //...
  }
  //---
  Conet.beep=function(ps) {
    try {
    if (!ps) ps={};
    if (!ac) ac=new(window.AudioContext||window.webkitAudioContext)();
    var os=ac.createOscillator(),gn=ac.createGain();
    os.connect(gn);gn.connect(ac.destination);
    var vol=ps.vol||Conet.vol||1;
    gn.gain.value=vol;os.frequency.value=ps.freq||400;os.type='sine';
    
    if (ps.freqAtTime) for (var a of ps.freqAtTime) os.frequency.linearRampToValueAtTime(a[0],ac.currentTime+a[1]/1000);
    if (ps.gainAtTime) for (var a of ps.gainAtTime) gn.gain.linearRampToValueAtTime(a[0]*vol,ac.currentTime+a[1]/1000);
    
    os.start();
    setTimeout(
    function() {
      os.stop();//...
    }
    ,ps.time||100);
    
    } catch (e) { Conet.log(''+e); }
    //...
  }
  //---
  Conet.checkParams=function(ps,cfg) {
    //onsole.log('Conet.checkParams');
    for (var k in ps) if (ps.hasOwnProperty(k)) {
      var cf=cfg[k];
      if (cf===undefined) {
        console.log('Conet.checkParams unkown param: \''+k+'\'.');
        if (!Conet.checkParamsTrace) {
          console.trace();
          Conet.checkParamsTrace=1;
        }
        //console.log(ps);
        continue;
      }
      if (cf.notWith) {
        //onsole.log('Conet.checkParams notwith ');
        for (var nw of cf.notWith) {
          if (ps[nw]!==undefined) {
            console.log('Conet.checkParams \''+k+'\' not with \''+nw+'\'.');
          }
        }
      }
    }
    //...
  }
  Conet.calcTweens=function(tweens,dt) {
    //---
    for (var i=tweens.length-1;i>=0;i--) {
      var tw=tweens[i];
      tw.tc=Math.min(tw.t,(tw.tc||0)+dt);
      //if (tw.x0===undefined) { tw.x0=tw.o.x;tw.y0=tw.o.y;tw.z0=tw.o.z; }
      var f1=tw.tc/tw.t;
      f1=0.5-Math.cos(f1*Math.PI)/2;
      var f0=1-f1;
      
      if (tw.key) {
        if (tw.value0===undefined) tw.value0=tw.o[tw.key];
        tw.o[tw.key]=f1*tw.value+f0*tw.value0;
        if (tw.onset) tw.onset();
      } else {  
      if (tw.x0===undefined) { tw.x0=tw.o.x;tw.y0=tw.o.y;tw.z0=tw.o.z; }
      tw.o.set(
        f1*tw.x+f0*tw.x0,
        f1*tw.y+f0*tw.y0,
        f1*tw.z+f0*tw.z0,
      );
      }
      
      if (tw.t==tw.tc) {
        if (tw.onend) tw.onend();
        tweens.splice(i,1);
        tw.ended=true;
      }
    }
    //...
  }
  
  Conet.dAng=function(a0,a1) {
    var da=a0-a1; 
    while (da>PI) da-=PI*2;
    while (da<-PI) da+=PI*2;
    return da;
  }
  
  
  //---
}
)(Conet);
console.log('Conet '+Conet.version);
//fr o,1
//fr o,1,5,4
//fr o,1,6
//fr o,1,6,18
//fr o,1,7,22
//fr o,1,10,3
//fr o,1,10,4
//fr o,1,10,6
//fr o,1,10,7
//fr o,1,10,19
//fr o,1,10,20
//fr o,1,11,1
//fr o,1,18,4
//fr o,1,35
//fr o,1,47,13
//fr o,1,50
//fr o,1,52
//fr p,18,131
