class Stopwatch {
	constructor(elm, con, ref) {
		this.element = elm;
		this.controller = con;

		this.reference = ref;

		let stopwatch = this;

		this.reference.once("value", function(snapshot) {
			if(snapshot.val()) {
				stopwatch.start = snapshot.val().start;
				stopwatch.stop = snapshot.val().stop;
			}

			if(stopwatch.stop)
				stopwatch.controller.html("Restart").removeClass().addClass("restart");
			else if(stopwatch.start)
				stopwatch.controller.html("Stop").removeClass().addClass("stop");
			else
				stopwatch.controller.html("Start").removeClass().addClass("start");
			
			stopwatch.controller.click(function() {stopwatch.controllerClick()});
		})

		if(this.stop)
			this.controller.html("Restart").removeClass().addClass("restart");
		else if(this.start)
			this.controller.html("Stop").removeClass().addClass("stop");
		else
			this.controller.html("Start").removeClass().addClass("start");


		setInterval(function() {
			stopwatch.setTime();
		}, 1);
	}

	setStart() {
		this.start = new Date();
	}

	setStop() {
		this.stop = new Date();
	}

	restart() {
		this.start = 0;
		this.stop = 0;
	}

	setCurrent() {
		this.current = new Date();
	}

	getDifference() {
		this.setCurrent();

		this.offset = (this.stop || this.current);
		this.difference = this.offset-this.start;

		return this.difference;
	}

	formatStopwatch(time) {
		time%= 24*60*60*1000;
		time = Math.round(time);

		let milliseconds = time;
		let seconds = Math.floor(milliseconds/1000);
		let minutes = Math.floor(seconds/60);
		let hours = Math.floor(minutes/60);

		milliseconds = pad(milliseconds%=1000, 3);
		seconds = pad(seconds%=60, 2);
		minutes = pad(minutes%=60, 2);
		hours = pad(hours%=24, 2);

		this.time = hours+":"+minutes+":"+seconds+"."+milliseconds;
		return this.time;
	}

	setTime() {
		if(this.start)
			this.element.html(this.formatStopwatch(this.getDifference()));
		else
			this.element.html("00:00:00.000");
	}

	controllerClick() {
		if(!this.start) {
			this.setStart();
			this.controller.html("Stop").removeClass().addClass("stop");
		} else if(!this.stop) {
			this.setStop();
			this.controller.html("Restart").removeClass().addClass("restart");
		} else if(confirm("Restart stopwatch?")) {
			this.restart();
			this.controller.html("Start").removeClass().addClass("start");
		}

		this.reference.set({
			start: this.start ? this.start.getTime() : 0,
			stop: this.stop ? this.stop.getTime() : 0
		});
	}

	formatTime(time) {
		let date = new Date(time);

		let hours = pad(date.getHours(), 2);
		let minutes = pad(date.getMinutes(), 2);
		let seconds = pad(date.getSeconds(), 2);
		let milliseconds = pad(date.getMilliseconds(), 2);

		return hours+":"+minutes+":"+seconds+"."+milliseconds;
	}
}

function pad(n, l, p) {
	n = n + '';
	p = p || '0';
	return n.length >= l ? n : new Array(l-n.length+1).join(p)+n;
}