var SAMPLERATE = 44100;
var PI = 3.14159265358979;
var TWOPI = PI*2;
var TWOPI_BY_SAMPLERATE = TWOPI/SAMPLERATE;

function mtof(midiNote) {
	return 440.0 * Math.exp( 0.057762265 * ( midiNote-69.0 ) );
}


var dsp = dsp || {};

// taken from maximillian library
dsp.Filter = Class.extend({
	z: 0,
	x: 0,
	y: 0,
	r: 0,
	c: 0,
	setCoeffs: function(cut, res) {
		this.cutoff = cut/2;
		if(this.cutoff<10) this.cutoff = 10;
		else if(this.cutoff>11025) this.cutoff = 11025;
		this.resonance = map(res, 0, 1, 1, 10);
		if(this.resonance<1) this.resonance = 1;
		this.z=Math.cos(TWOPI*this.cutoff/44100);
		this.c = 2 - 2*this.z;
		this.r = (Math.sqrt(2.0)*Math.sqrt(-Math.pow((this.z-1.0),3.0))+this.resonance*(this.z-1))/(this.resonance*(this.z-1));
	},
	process: function(input) {
	
		this.x = this.x + (input - this.y)*this.c;
		this.y = this.y + this.x;
		this.x = this.x * this.r;
		return this.y;
	}
});
var TWOPI = 6.28318530717959;

dsp.BPF = Class.extend({
	init: function(cutoff, resonance) {
		if(typeof(cutoff)==='undefined') cutoff = 1000;
		if(typeof(resonance)==='undefined') resonance = 0;
		this.setCoeffs(cutoff, resonance);	
	},
	setCoeffs: function(cutoff, resonance) {;
		if (cutoff>(22050)) cutoff=22050;

		if (resonance>=1.0) resonance=0.999999;
		this.cutoff = cutoff;
		this.resonance = resonance;

		this.z=Math.cos(TWOPI*cutoff/44100);	
		this.inputs[0] = (1-this.resonance)*(Math.sqrt(this.resonance*(this.resonance-4.0*Math.pow(this.z,2.0)+2.0)+1));
		this.inputs[1] = 2*this.z*this.resonance;
		this.inputs[2] = Math.pow((this.resonance*-1),2);
	},
	inputs: [0,0,0],
	outputs: [0,0,0],

	process: function(input) {
		
		var output= this.inputs[0] * input + this.inputs[1] * this.outputs[1] + this.inputs[2] * this.outputs[2];
		this.outputs[2]=this.outputs[1];
		this.outputs[1]=output;
		return output;
	}
});

// taken from musicdsp.org
dsp.MoogFilter = Class.extend({
	//Init

	fs: 44100,
	k: 0,
	p: 0,
	
	setCoeffs: function(cut, res) {
		if(cut>this.fs/2-1000) cut = this.fs/2 - 1000;
		var f = 2 * cut / this.fs; //[0 - 1]
		this.k = 3.6*f - 1.6*f*f -1; //(Empirical tunning)
		this.p = (this.k+1)*0.5;
		var scale = Math.exp((1-this.p)*1.386249);
		this.r = res*scale;
	},

	y1:0,
	y2:0,
	y3:0,
	y4:0,
	oldx:0,
	oldy1:0,
	oldy2:0,
	oldy3:0,

	process: function(input) {
		//Loop
		//--Inverted feed back for corner peaking
		x = input - this.r*this.y4;
	
		//Four cascaded onepole filters (bilinear transform)
		this.y1=x*this.p + this.oldx*this.p - this.k*this.y1;
		this.y2=this.y1*this.p+this.oldy1*this.p - this.k*this.y2;
		this.y3=this.y2*this.p+this.oldy2*this.p - this.k*this.y3;
		this.y4=this.y3*this.p+this.oldy3*this.p - this.k*this.y4;
	

		//Clipper band limited sigmoid
		this.y4 = this.y4 - this.y4*this.y4*this.y4/6;
	
		this.oldx = x;
		this.oldy1 = this.y1;
		this.oldy2 = this.y2;
		this.oldy3 = this.y3;
		return this.y4;
	}
});

var OSC_SIN = 1;
var OSC_SAW = 2;
var OSC_SQUARE = 3;
var OSC_TRI = 4;
var OSC_TRI_WARP = 5;
var OSC_SQUARE_WARP = 6;

dsp.Oscillator = Class.extend({


	init: function() {
//		this.osc = this.saw;
		this.osc = this.square;
		this.warpness = PI;
	},
	
	setType: function(type) {
		switch(type) {
			case OSC_SIN: this.osc = Math.sin; break;
			case OSC_SAW: this.osc = this.saw; break;
			case OSC_TRI: this.osc = this.tri; break;
			case OSC_SQUARE: this.osc = this.square; break;
			case OSC_SQUARE_WARP: this.osc = this.squareWarp; break;
			case OSC_TRI_WARP: this.osc = this.triWarp; break;
		}
	},
	square: function(phase) {
//		return Math.sin(phase)+Math.sin(3*phase)*0.333 + Math.sin(5*x)*0.333/2+ Math.sin(7*phase)*0.3333/4
  //     + Math.sin(9*phase)*0.3333/8 + Math.sin(11*phase)*0.3333/16+ Math.sin(13*phase)*0.33333/32;
		return phase<PI?1:-1;
	},
	

	
	saw: function(phase) {
		return ((1.0 - phase/(TWOPI))*2.0) - 1.0;
//		return Math.sin(phase)+Math.sin(2*phase)*0.5 + Math.sin(3*phase)*0.25+ Math.sin(4*phase)*0.125
//        + Math.sin(5*phase)*0.125/2 + Math.sin(6*phase)*0.125/4+ Math.sin(7*phase)*0.125/8;
	},

	tri: function(phase) {
		if(phase<PI) return (-1.0 + (2.0*phase/PI))*2.0;
		else return 2.0*(1.0 - (2.0*(phase-PI)/PI));
	},

	triWarp: function(phase) {
		var a = this.warpness/2;
        var b = TWOPI - a;
        if(phase<a) return map(phase, 0, a, 0, 1);
        else if(phase<b) return map(phase, a, b, 1, -1);
        else return map(phase, b, TWOPI, -1, 0);
	},

	squareWarp: function(phase) {
		return phase<this.warpness?1:-1;
	},
	
	setWarp: function(warpness) {
		this.warpness = PI*2*warpness;
	},
	setFrequency: function(f) {
		
		this.phaseIncrement = f * TWOPI_BY_SAMPLERATE;
	},
	
	phaseIncrement: 0,
	phase: 0,
	osc: null,
	
	getSample: function() {
		this.updatePhase();
		return this.osc(this.phase);
	},
	
	getSamples: function(buf) {
		for(xx = 0; xx < buf.length; xx++) {
			buf[xx] = this.getSample();
		}
	},
	
	updatePhase: function() {
		this.phase += this.phaseIncrement;
		if(this.phase>TWOPI) {
			this.phase -= TWOPI;
		}
	}
});

dsp.Envelope = Class.extend({
	noteIsOn: false,
	attack: 0,
	decay: 0,
	sustain:1,
	release: 0,
	releaseVol: 0,
	setParameters: function(attack, decay, sustain, release) {
	
		// convert to samples
		this.attack = attack*44.1;
		this.decay = decay*44.1;
		this.sustain = sustain;
		this.release = release*44.1;
	},
	noteon: function() {
		this.time = 0;
		this.noteIsOn = true;
	},
	noteoff: function() {
		this.time = 0;
		this.noteIsOn = false;
		this.releaseVolume = this.currentVolume;
	},
	getSample: function() {
		
		this.time++;
		if(this.noteIsOn) {
			if(this.time<this.attack) { // are we attacking?
				this.releaseVol = map(this.time, 0, this.attack, 0, 1);
				return this.releaseVol;
			} else if(this.time<this.attack+this.decay) { // we're decaying
				this.releaseVol = map(this.time, this.attack, this.attack+this.decay, 1, this.sustain);
				return this.releaseVol;
			} else { // we're sustaining
				this.releaseVol = this.sustain;
				return this.sustain;
			}
		} else {
			if(this.time<this.release) {
				var val = map(this.time, 0, this.release, this.releaseVol, 0);
				return val;
			} else {
				return 0;
			}
		}
		
		return 1;
	}
});

dsp.Noise = Class.extend({
	volume: 1,
	colour: 0.5,
	lastX:0,
	getSample: function() {
		var currVal = ((Math.random()*2) - 1)*this.volume;
		var finalVal = this.lastX*0.99 + currVal*0.01;
		
		this.lastX = finalVal;
		//return currVal - finalVal;
		

			var v = this.colour;
			return currVal*v + (1.0-v)*finalVal;
		
	},
	setColour: function(c) {
		this.colour = c;
	}
});




dsp.Distortion = Class.extend({
	volume: 1,
	gain: 0,
	algorithm: null,
	init: function() {
		this.algorithm = this.process1;
	},
	

	// something I found in musicdsp in one of the moog lpf's
	process: function(inp) {
		return this.volume*this.algorithm(inp);
	},
	
	k:0,
	process1: function(inp) {

		var d = (1.0+this.gain)*inp/(1.0+this.gain*Math.abs(inp));
		if(d>1) return 1;
		else if(d<-1) return -1;
		else return d;
	}
});
dsp.Delay = Class.extend({
	buffer: [],
	pos:0,
	
	delay:5000,
	feedback:0.5,
	mix:0.5,
	
	setParameters: function(delay,feedback,mix) {
		this.feedback = feedback;
		this.mix = mix;
		if(this.delay!=delay) {
			this.setDelay(delay);
		}
	},
	
	setDelay: function(delay) {
		this.pos = 0;
		while(this.buffer.length<delay) this.buffer.push(0.0);
		this.delay = delay;
	},
	init: function() {
		this.setParameters(4000, 0.5, 0.5);
	},
	
	process: function(input) {
		this.pos++;
		this.pos %= this.delay;
		var out = this.buffer[this.pos];
		this.buffer[this.pos] = this.feedback*this.buffer[this.pos] + input;
		return input + (out - input)*this.mix;
//		return input;
	}

});

dsp.Impulse = Class.extend({
	init: function(period, phase) {
		if(typeof(phase)==='undefined') phase = 0;
		this.phase = phase;
		this.period = period*44100;
		this.pos = this.period * this.phase;
	},
	phase: 0,
	pos: 0,
	period: 0,
	getSample: function() {
		if(this.pos==0) {
			this.pos++;
			return 1;
		}

		this.pos++;
		if(this.pos>this.period) this.pos = 0;

		return 0;
	}

});


function clip(x) {
	if(x>1) return 1;
	else if(x<-1) return -1;
	return x;
}
dsp.Decay = Class.extend({
	
	init: function(duration) {
		this.decay = 0.999 + duration * 0.0009;
	},

	val: 0,
	process: function(trig) {
		if(trig==1) {
			this.val = 1;
		} else {
			this.val *= this.decay;
		}

		return this.val;
	}
});

// Technique by Larry "RidgeRat" Trammell 3/2006
// http://home.earthlink.net/~ltrammell/tech/pinkalg.htm
// implementation and optimization by David Lowenfels

dsp.PinkNoise = Class.extend({
	init: function() {
	    this.clear();
	    this.offset = this.A[0]+this.A[1]+this.A[2];
	    this.RMI2 = 2.0 / 100000.0;
	},

	rand: function() {
		return Math.random()*100000.0;
	},

	clear: function() {
    	for(  i=0; i< 3; i++ ){
      		this.state[ i ] = 0.0;
    	}
    },
    
  	getSample: function() {
  	// unrolled loop
    var temp = this.rand();
    this.state[0] = this.P[0] * (this.state[0] - temp) + temp;
  
    temp = this.rand();
    this.state[1] = this.P[1] * (this.state[1] - temp) + temp;

    temp = this.rand();        
    this.state[2] = this.P[2] * (this.state[2] - temp) + temp;

    return ( this.A[0]*this.state[0] + this.A[1]*this.state[1] + this.A[2]*this.state[2] )*this.RMI2 - this.offset;
  },
  state: [0.0,0.0,0.0],
  A: [0.02109238, 0.07113478, 0.68873558],
  P: [0.3190,  0.7756,  0.9613  ]




});

dsp.Normalizer = Class.extend({
	init: function() {

	},
	pos: 0,
	maxVol: 0,
	maxVolFollower:0,
	process: function(inp) {
		if(inp>this.maxVol) this.maxVol = inp;
		else this.maxVol *= 0.9998;
		this.maxVolFollower = this.maxVolFollower * 0.9998 + this.maxVol * 0.0002;

		inp *= 1.0/this.maxVolFollower;
		return inp;
	}


});
