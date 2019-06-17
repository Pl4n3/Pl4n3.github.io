
var bassNote = 0;
var bassWobble = 0;
var snareEnvelope = 0;
var kickEnvelope = 0;
var oscilloscope = new Array(1024);

var bpm = 90;//120

var notes = [40, 41, 28, 28, 28, 28, 27, 25, 35, 78];
var swr = [1, 6, 6, 2, 1, 2, 4, 8, 3, 3];

var swrPos = 0;

//var kickSeq = [1,0,0,0,0,0,1,0, 1,0,0,1,0,0,0,0];
//var kickSeq = [1,0,1,1,1,1,1,0, 1,0,1,1,0,1,1,1]; // <-- moar kicks! :)
var kickSeq =   [1,0,1,0,1,0,1,1, 1,0,1,0,1,0,1,0]; // <-- techno-ish
var kickPos = 0;

var saw1 = new dsp.Oscillator();
var saw2 = new dsp.Oscillator();
var sweep = new dsp.Oscillator();
//sweep.phase = 3.14159;
var snareDecay1 = new dsp.Decay(0.4);
var snareDecay2 = new dsp.Decay(0.97);

var freeverbL = new dsp.Freeverb(0);
var freeverbR = new dsp.Freeverb(23);

var kickDecay = new dsp.Decay(0.85);
var kickOsc = new dsp.Oscillator();

saw1.setType(OSC_SAW);
saw2.setType(OSC_SAW);
sweep.setType(OSC_TRI);
kickOsc.setType(OSC_SIN);

var lpf = new dsp.Filter();
var snareBpf = new dsp.Filter();
snareBpf.setCoeffs(2000, 0.2);
var wobBpf = new dsp.BPF(1500, 0.3);
var normalizer = new dsp.Normalizer();
var nl = new dsp.Normalizer();
var nr = new dsp.Normalizer();
var trig = new dsp.Impulse(bpm/120);
var snareTrig = new dsp.Impulse(bpm/60.0, 0.5);
var kickTrig = new dsp.Impulse(bpm/480.0);
var noise = new dsp.Noise();

var bassFrequency = 0;
var targetFrequency = 0;
function exprange(val, from, to) {
	if (val <= 0) return from;
    if (val >= 1) return to;
    return val * (to-from) + from;
   // return Math.pow(to - from, val)*val + from;
}

function randInt(from, to) {
	return Math.floor(from + Math.random() * (1+to-from));
}
(function(){
function fillBuffer(buffer, channelCount){
	var	l	= buffer.length,i, n;
	if(channelCount!=2) return;
	
	for(i = 0; i < l; i+=channelCount) {


		// tick the sequencer
		var imp = trig.getSample();

		// if time for new note
		if(imp==1) {
			// choose a bass note
			var mn = notes[randInt(0, notes.length-1)];
			targetFrequency = mtof(mn);
		
			bassNote = mn;
			// choose an wobble rate
			sweep.setFrequency(swr[swrPos]);
			swrPos++;
			if(swrPos>=swr.length) swrPos = 0;
		}
		bassFrequency = targetFrequency * 0.0008 + bassFrequency * 0.9992;
		saw1.setFrequency(bassFrequency*1.01);
		saw2.setFrequency(bassFrequency*0.99);

		var wob = saw1.getSample() + saw2.getSample();

		bassWobble = sweep.getSample();
		lpf.setCoeffs(exprange(bassWobble, 100, 4000), 0.0);
		wob = lpf.process(wob);
		wob = normalizer.process(wob) * 0.3;
		wob = wob + wobBpf.process(wob);

		
		
		var kt = kickTrig.getSample();	
		if(kt==1) {
			kt &= kickSeq[kickPos];
			kickPos ++;
			if(kickPos>=kickSeq.length) kickPos = 0;
		}
		var ke = kickDecay.process(kt);

		kickOsc.setFrequency(40 + (ke*ke*ke*200));
		kickEnvelope = ke;


		var kick = clip(kickOsc.getSample()*ke*7);

		var st = snareTrig.getSample();
		var senv = (snareDecay1.process(st)*2+snareDecay2.process(st)*0.05);
		snareEnvelope = senv;
		var snareL = noise.getSample()*senv;
		var snareR = noise.getSample()*senv;

		snareL = clip(snareL*2 + snareBpf.process(4*snareL))*2;
		snareR = clip(snareR*2 + snareBpf.process(4*snareR))*2;

		var wobL = freeverbL.process(wob)*0.6;
		var wobR = freeverbR.process(wob)*0.6;
		buffer[i] = nl.process((wobL + kick + snareL));
		buffer[i+1] = nr.process((wobR + kick + snareR));
		//buffer[i] = kick;
		//buffer[i+1] = kick;
		oscilloscope[i] = buffer[i];
	}
}

	$(document).ready(function() {
	//setTimeout(
var started=false;
document.onclick=function(){
		if (started) return;started=true;
           var bufSize = 1024;
		// firefox can't take such a short buffer run
		if(navigator.userAgent.indexOf("Firefox")!=-1) {
			bufSize = 4096;
		}
		dev		= audioLib.AudioDevice(fillBuffer, 2, bufSize);
		sampleRate	= dev.sampleRate;		
}

//, 1000);
});


}());

