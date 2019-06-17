
dsp.Comb = Class.extend({
	
	init: function(size) {
	//	this.setBuff(size);
		//this.buffer = new Array(size);
		//for(i = 0; i < size; i++) {
		//	this.buffer[i] = 0;
		//}
	},
	feedback: 0.1,
	filterstore: 0,
	damp1: 0,
	damp2: 0,
	buffer: 0,
	bufidx:0,
	setBuff: function(size) {
		this.buffer = new Array(size);
		for(i = 0; i < size; i++) {
			this.buffer[i] = 0;
		}
	},
	setDamp: function(val) {
		this.damp1 = val;
		this.damp2 = 1-val;
	},
	setFeedback: function(fb) {
		this.feedback = fb;
	},
	process: function(inp) {

		var output = this.buffer[this.bufidx];
		//undenormalise(output);

		this.filterstore = (output*this.damp2) + (this.filterstore*this.damp1);
		//undenormalise(filterstore);

		this.buffer[this.bufidx] = inp + (this.filterstore*this.feedback);

		if(++this.bufidx>=this.buffer.length) this.bufidx = 0;

		return output;
		//return inp;
		
	}
});

dsp.Allpass = Class.extend({
	
	init: function() {
		
	},
	/*feedback: 0.5,
	buffer: 0,
	bufidx: 0,*/
/*
	setFeedback: function(fb) {
		this.feedback = fb;	
	},

	setBuff: function(size) {
		this.buffer = new Array(size);
		for(i = 0; i < size; i++) {
			this.buffer[i] = 0;
		}
	},*/

	process: function(inp) {
		return inp;
		
		var bufout = this.buffer[this.bufidx];
		//undenormalise(bufout);
		
		var output = -input + bufout;

		this.buffer[this.bufidx] = this.input + (bufout*this.feedback);

		if(++this.bufidx>=this.buffer.length) this.bufidx = 0;

		return output;
	}
});


dsp.Freeverb = Class.extend({
	init: function(spread) {

		this.combs = new Array(8);
		var tunings = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];

		for(i = 0; i < this.combs.length; i++) {
			this.combs[i] = new dsp.Comb(tunings[i]+spread);
			this.combs[i].buffer = new Array(tunings[i]+spread);
			for(j = 0; j < tunings[i]+spread; j++) {
				this.combs[i].buffer[j] = 0;
			}

			//this.combs[i].setBuff(tunings[i]);
		}


		this.allpasses = new Array(4);
		this.allpassTunings = [556, 441, 341, 225];
		for(i = 0; i < this.allpasses.length-1; i++) {
			this.allpassTunings += spread;
			this.allpasses[i] = new dsp.Allpass();
		/*	this.allpasses[i].buffer = new Array(tunings[i]);
			for(j = 0; j < tunings[i]; j++) {
				this.allpasses[i].buffer[j] = 0;
			}*/
		}
		//alert("Creating freeverb " + this.combs.length);
		this.update();
	},

	wet: 0.25,
	dry: 1,
	gain: 1,

	update: function() {
		roomsize = 0.6;
		damp = 0.1;
		for(i = 0; i < this.combs.length; i++) {
			this.combs[i].feedback = roomsize;
		}
		for(i = 0; i < this.combs.length; i++) {
			this.combs[i].setDamp(damp);
		}
	},

	process: function(inp) {
		
		var out = 0;
		input = inp*this.gain;
		for(i = 0; i < this.combs.length; i++) {
			out += this.combs[i].process(inp);
		}
		for(i = 0; i < this.allpasses.length; i++) {
			if(typeof(this.allpasses[i])==='undefined') {
				this.allpasses[i] = new dsp.Allpass();
				this.allpasses[i].buffer = new Array(this.allpassTunings[i]);
				for(j = 0; j < this.allpassTunings[i]; j++) {
					this.allpasses[i].buffer[j] = 0;
				}
			}
			out = this.allpasses[i].process(out);
		}
		return out * this.wet + inp*this.dry;

	}
});