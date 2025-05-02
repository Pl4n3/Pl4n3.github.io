var Conet={};
(function(Conet) {
  Conet.offline=false;
  Conet.version='1.615 ';//FOLDORUPDATEVERSION
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
    
    if (!Conet.checkOnline()) { //no upload possible
      let slog='Uploaded to ls: '+p.fn;
      if (p.log) p.log(slog); else console.log(slog);
      localStorage['conet2d'+p.fn]=p.data;
      if (p.f) p.f();
      let index=JSON.parse(localStorage['conet2index']||'{}');
      if (!index[p.fn]) index[p.fn]={uploads:0};
      index[p.fn].uploads++;
      console.log(index);
      localStorage['conet2index']=JSON.stringify(index);
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
    
    if (!Conet.checkOnline()) {
      let data=localStorage['conet2d'+p.fn];
      if (data) {
        let s='Download from ls: '+p.fn
        if (p.log) p.log(s); else console.log(s);
        p.f(data);
        return;
      }
    }
    
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
        if (0) {
          var i0=fn.lastIndexOf('/')+1;//if (i0==-1) i0=0;
          var i1=fn.indexOf('.',2);//skip path dots
          if (i1==-1) i1=fn.length;
          if (i1-i0>10) i0=i1-10;
          mload.sub.push(mn={s:fn.substr(i0,i1-i0),ms:fn.substr(0,i0)+'^'+fn.substr(i1)//,fs:0.5
            ,a:fn,actionf:mload1,cfmo:o});
        } else {
          let sh=fn;
          //let l=30;
          //for (let i=Math.floor(sh.length/l);i>=1;i--) {
          //  let p=i*l;
          //  sh=sh.substr(0,p)+'<br>'+sh.substr(p); }
          mload.sub.push(mn={s:sh,a:fn,actionf:mload1,cfmo:o,fs:2,pw:0.5,ph:0.02,fixCy:1,vertCenter:0,textAlign:'start'});
        }
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
      p.savef(v,'saveas');
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
    //onsole.log('calcTweens '+tweens.length);
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
  
  Conet.tweensAdd=function(ps) {
    //---
    for (let i=0;i<ps.kv.length;i++) {
      let kvi=ps.kv[i],tw;
      ps.tweens.push(tw={t:ps.t,o:ps.o,key:kvi[0],value:kvi[1]});
      if (ps.onend&&(i==ps.kv.length-1)) {
    tw.onend=function() {
      //---
      Conet.tweensAdd(ps.onend[0]);
      if (ps.onend.length>1) throw('more nextKvs n/i');
      //...
    }
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
  
  
  function jsonStringify(o,replacer,space,ps,path) {
    //--- same as JSON.strinigfy but replacers returnvalue isnt escaped
    //onsole.log(path);
    let s='';
    if (Array.isArray(o)) {
      s+='[';let first=true;
      for (const e of o) {
        if (ps&&ps.newLine) {
          if (ps.newLine[path]) s+='\n';
        }
        s+=(first?'':',')+jsonStringify(e,replacer,space,ps,path);
        first=false; 
      }
      s+=']';
    } else
    if (typeof(o)==='object') {
      s+='{';
      const a=Object.keys(o);let first=true;
      if (path!==undefined) path+='.'; else path='';
      for (const k of a) {
        const npath=path+k;
        if (ps&&ps.newLine) {
          //onsole.log('nl '+ps.newLine[k]);
          if (ps.newLine[npath]) s+='\n';
        }
        s+=(first?'':',')+'"'+k+'":'+jsonStringify(o[k],replacer,space,ps,path+k);
        first=false;
      }
      s+='}';
    } else s=JSON.stringify(o);
    return s;
    //...
  }
  Conet.jsonStringify=jsonStringify;
  //-------------
  async function compress(str) {
    // Convert the string to a byte stream.
    const stream = new Blob([str]).stream();
    
    ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
      const reader = this.getReader()
      try {
        while (true) {
          const {done, value} = await reader.read()
          if (done) return
          yield value
        }
      }
      finally {
        reader.releaseLock()
      }
    }
    
    
    // Create a compressed stream.
    const compressedStream=stream.pipeThrough(
      new CompressionStream('gzip')
    );
    
    //onsole.log(compressedStream);
    
    // Read all the bytes from this stream.
    const chunks = [];
    for await (const chunk of compressedStream) {
      chunks.push(chunk);
    }
    
    //var uint8array = new TextEncoder().encode("someString");
    //var string = new TextDecoder().decode(uint8array);
    
    let ret=await concatUint8Arrays(chunks);
    
    ret=btoa(String.fromCharCode.apply(null,ret));
    
    //--- optimal conversion uint8array <-> base64
    //https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string
    //https://gist.github.com/enepomnyaschih/72c423f727d395eeaa09697058238727
    
    return ret;
  }
  async function decompress(v) {
    // Convert the bytes to a stream.
    
    v=new Uint8Array(atob(v).split('').map(function (c) {
      return c.charCodeAt(0);
    }
    ));
    
    const stream = new Blob([v]).stream();
    
    // Create a decompressed stream.
    const decompressedStream = stream.pipeThrough(
      new DecompressionStream("gzip")
    );
    
    // Read all the bytes from this stream.
    const chunks = [];
    for await (const chunk of decompressedStream) {
      chunks.push(chunk);
    }
    const stringBytes = await concatUint8Arrays(chunks);
    
    // Convert the bytes to a string.
    return new TextDecoder().decode(stringBytes);
  }
  async function concatUint8Arrays(uint8arrays) {
    const blob = new Blob(uint8arrays);
    const buffer = await blob.arrayBuffer();
    return new Uint8Array(buffer);
  }
  Conet.compress=compress;
  Conet.decompress=decompress;
  //const str = "foo".repeat(1000);
  //const compressedBytes = await compress(str);
  //console.log(compressedBytes);
  // => Uint8Array(61) [31, 139, 8, 0, ...]
  //------------
  
  Conet.createDiff=function(ps) {
    //---
    let old={};
    function convert(h) {
      //---
      let r;
      
      if (ps.undiff) {
        for (let k of Object.keys(h)) old[k]=h[k];
        r=JSON.parse(JSON.stringify(old));
        if (ps.fmt) r=ps.fmt(r);
        return r;
      }
      
      r={};
      if (ps.fmt) h=ps.fmt(h);
      for (let k of Object.keys(h)) {
        if (old[k]==h[k]) continue;
        r[k]=h[k];
        old[k]=h[k];
      }
      return r;
      //...
    }
    return {convert:convert};
    //...
  }
  
  Conet.f4=function(v) {
    return Math.floor(0.5+v*10000)/10000;//...
  }
  
  //--- test for minimal object encapsulation without 'new'
  //--- also used in createDiff
  
  /* 
  Conet.count=function(ps) {
    let c=ps.c||0;
    function inc() {
      c++;
      return c;
      //...
    }
    function set(v) {
      c=v;
      //...
    }
    //console.log(this);
    return {inc:inc,set:set};
    //...
  }
  let c0=Conet.count({c:1000});
  console.log('c0.inc '+c0.inc());
  console.log('c0.inc '+c0.inc());
  let c1=Conet.count({c:2000});
  console.log('c1.inc '+c1.inc());
  console.log('c0.inc '+c0.inc());
  c0.set(200);
  console.log('c1.inc '+c1.inc());
  console.log('c0.inc '+c0.inc());
  */
  
  Conet.checkOnline=function() {
    //---
    let online=document.URL.indexOf(':7000')!=-1;
    //--- probably dont set here Conet.offline, as Conet.offline is
    //--- for broken connections to :7000. If connection if ok again
    //--- with Conet.offline, changed files from ls are uploaded to :7000
    return online;
    //...
  }
  
  let handlers=[];
  Conet.handlerAdd=function(k,f) {
    let a=handlers[k];
    if (!a) { a=[];handlers[k]=a; }
    a.push(f);
    //...
  }
  Conet.handlerRun=function(k,p0,p1) {
    //---
    let a=handlers[k];
    if (!a) return;
    for (let f of a) f(p0,p1);
    //...
  }
  Conet.handlerDel=function(k,f) {
    let a=handlers[k];
    let i=a.indexOf(f);
    a.splice(i,1);
    //...
  }
  
  
  Conet.cannonVis=function(ps) {
    let co;
    
    function initCanvas() {
      let c=document.createElement('canvas');
      c.width=500;c.height=500;
      //c.style.backgroundColor='#0f0';
      
      if (ps.cont) ps.cont.appendChild(c);
      else {
        var myWindow=window.open("","MsgWindow","top=100,left=1000,width=550,height=550");
        myWindow.document.body.appendChild(c);
      }
      
      //document.body.appendChild(c);
      canv=c;
      ct=c.getContext('2d');
      ct.strokeStyle='#000';
      ct.strokeRect(0,0,c.width,c.height);
      co={c:c,ct:ct,ps:[]};
      //...
    }
    
    function drawCanvas() {
      //---
      let ct=co.ct,c=co.c;
      let f=30;
      
      for (let ph of co.ps) {
        let p=ph.p,x=p.x*f+c.width/2,y=p.z*-f+c.height/2+100;
        ct.fillStyle='#000';
        ct.fillRect(x,y,5,5);
        ct.fillStyle=ph.c;
        ct.fillRect(x+0.5,y+0.5,4,4);
      }
      //...
    }
    
    initCanvas();
    
    return {
      co:co,
    
    step:function(dt) {
      //---
      if (dt===undefined) dt=10;
      ps.world.step(1.0/60.0,dt/1000,3);
      drawCanvas();
      //...
    }
    
    }
    
    //...
  }
  
  Conet.cannonTest=function(ps) {
    //---
    
    //---
    /*
    let co;
    
    function initCanvas() {
      let c=document.createElement('canvas');
      c.width=500;c.height=500;
      //c.style.backgroundColor='#0f0';
      
      var myWindow=window.open("","MsgWindow","top=100,left=1000,width=550,height=550");
      myWindow.document.body.appendChild(c);
      
      //document.body.appendChild(c);
      canv=c;
      ct=c.getContext('2d');
      ct.strokeStyle='#000';
      ct.strokeRect(0,0,c.width,c.height);
      co={c:c,ct:ct,ps:[]};
      //...
    }
    
    function drawCanvas() {
      //---
      let ct=co.ct,c=co.c;
      let f=30;
      
      for (let ph of co.ps) {
        let p=ph.p,x=p.x*f+c.width/2,y=p.z*-f+c.height/2+100;
        ct.fillStyle='#000';
        ct.fillRect(x,y,5,5);
        ct.fillStyle=ph.c;
        ct.fillRect(x+0.5,y+0.5,4,4);
      }
      //...
    }
    */
    
    console.log('cannon test');
    
    // Setup our world
    var world = new CANNON.World(),size=2.0;
    
    
    var shape = CANNON.Trimesh.createTorus(4, 3.5, 16, 16);
    
    // Create world
    world.gravity.set(0,0,-10);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    
    world.defaultContactMaterial.contactEquationStiffness = 1e7;
    world.defaultContactMaterial.contactEquationRelaxation = 4;
    
    // ground plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    world.add(groundBody);
    //emo.addVisual(groundBody);
    
    // sphere
    var sphereShape = new CANNON.Sphere(1);
    var sphereBody = new CANNON.Body({
      mass: 1,
      shape: sphereShape,
      position: new CANNON.Vec3(3,3,11)
    });
    world.add(sphereBody);
    //emo.addVisual(sphereBody);
    
    // Shape on plane
    var shapeBody = new CANNON.Body({ mass: 1 });
    shapeBody.addShape(shape);
    var pos = new CANNON.Vec3(0,0,size);
    shapeBody.position.set(0,0,size*2);
    shapeBody.velocity.set(0,1,1);
    shapeBody.angularVelocity.set(0,0,0);
    world.add(shapeBody);
    //emo.addVisual(shapeBody);
    
    if (1) {
      let cv=Conet.cannonVis({world:world});
      cv.co.ps.push(
        {p:shapeBody.position,c:'#ff0'},
        {p:sphereBody.position,c:'#fff'});
      return {torus:shapeBody,ball:sphereBody,step:cv.step};
    }
    
    
    initCanvas();
    co.ps.push(
      {p:shapeBody.position,c:'#ff0'},
      {p:sphereBody.position,c:'#fff'});
    
    return {
    torus:shapeBody,ball:sphereBody,
    step:function(dt) {
      //---
      world.step(1.0/60.0,10/1000,3);
      drawCanvas();
      //...
    }
    };
    
    
    
    if (0) {
    setInterval(function() {
      //---
      world.step(1.0/60.0,10/1000,3);
      drawCanvas();
      //...
    }
      ,10);
      return;
    }
    
    
    var fixedTimeStep=1.0/60.0; // seconds
    var maxSubSteps=3;
    
    // Start the simulation loop
    var lastTime;
    (function simloop(time) {
      requestAnimationFrame(simloop);
      console.log(time);
      if (lastTime!==undefined){
         var dt=10/1000;//(time-lastTime)/1000;
         //onsole.log(dt);
         world.step(fixedTimeStep,dt,maxSubSteps);
      }
      
      drawCanvas();
      //onsole.log("Sphere z position: " + sphereBody.position.z);//+' '+x+' '+y);
      
      
      lastTime=time;
    }
    )();
    
    
    
    //...
  }
  
  //---
}
)(Conet);
console.log('Conet '+Conet.version);
//fr o,1
//fr o,1,5,4
//fr o,1,6
//fr o,1,6,30
//fr o,1,7
//fr o,1,7,29
//fr o,1,7,31
//fr o,1,10,3
//fr o,1,10,4
//fr o,1,10,5
//fr o,1,10,6
//fr o,1,10,7
//fr o,1,10,19
//fr o,1,10,20
//fr o,1,10,30
//fr o,1,10,33
//fr o,1,10,34
//fr o,1,11,1
//fr o,1,18,4
//fr o,1,47,13
//fr o,1,52
//fr o,1,52,5
//fr o,1,61,3
//fr o,1,62,2
//fr o,1,106
//fr o,1,114,2
//fr o,1,114,11
//fr p,11,260
