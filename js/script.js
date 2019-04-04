var config = {
	apiKey: "AIzaSyB8tfCs5WvbLmQ4dND1L2Eqgs8mBtaT5So",
	authDomain: "stopwatch-8d91e.firebaseapp.com",
	databaseURL: "https://stopwatch-8d91e.firebaseio.com",
	projectId: "stopwatch-8d91e",
	storageBucket: "stopwatch-8d91e.appspot.com",
	messagingSenderId: "1041012173394"
};
firebase.initializeApp(config);

var database = firebase.database();

let stopwatches = [];

$(function() {
	let table = $("<table>").addClass("stopwatches");

	for(var i = 1; i <= 6; i++) {
		let tableRow = $("<tr>").addClass("stopwatch-row");

		let group = $("<td>").addClass("group").html("Stopwatch "+i);
		let time = $("<td>").addClass("time");
		let controller = $("<td>").addClass("controller").append($("<button>"));

		let stopwatch = new Stopwatch(time, controller.find("button"), database.ref("groups/"+i));

		stopwatches.push(stopwatch);

		tableRow.append(group).append(time).append(controller);
		table.append(tableRow);
	}

	let results = $("<tr>").append($("<td>").addClass("show-results").attr("colspan", "3").append($("<button>").html("Results")));
	$(table).append(results);

	results.find("td").find("button").click(function() {
		let howManyFinished = 0;

		for(let stopwatch of stopwatches)
			howManyFinished+= stopwatch.stop ? 1 : 0;

		if(howManyFinished > 0) {
			$("body").empty();

			let finishedStopwatches = [];
			for(let stopwatch of stopwatches) {
				if(stopwatch.stop)
					finishedStopwatches.push(stopwatch)
			}

			stopwatches = finishedStopwatches;

			stopwatches.sort((a, b) => (a.difference > b.difference) ? 1 : (a.color === b.color) ? ((a.group > b.group) ? 1 : -1) : -1);
			
			let table = $("<table>").addClass("results");

			let header = $("<tr>").append($("<td>").addClass("header").attr("colspan", "3").html("Results"));
			table.append(header);

			let totalTime = 0;

			for(let [i, stopwatch] of stopwatches.entries()) {
				let row = $("<tr>").addClass(i < 3 ? ["golden", "silver", "bronze"][i] : "").addClass("result");
				let group = stopwatch.element.parent().find(".group");
				let time = stopwatch.element;

				totalTime+= parseInt(stopwatch.getDifference());

				let start = $("<tr>").append($("<td>").html("Start: "+stopwatch.formatTime(stopwatch.start)));
				let end = $("<tr>").append($("<td>").html("Stop: "+stopwatch.formatTime(stopwatch.stop)));
				let startend = $("<td>").append($("<table>").append(start).append(end));

				row.append(group).append(time).append(startend);
				table.append(row);
			}

			let timeAverage = stopwatches[0].formatStopwatch(totalTime/stopwatches.length);
			let average = $("<tr>").append($("<td>").attr("colspan", 3).html("Average: "+timeAverage).addClass("average"));
			table.append(average);

			let restart = $("<tr>").append($("<td>").addClass("restart-results").attr("colspan", "3").append($("<button>").html("Restart")));
			table.append(restart);

			restart.click(function() {
				if("Restart all stopwatches?") {
					if(confirm("Are you sure? All data will be lost.")) {
						database.ref("/").set({});
						location.reload();
					}
				}
			});

			$("body").append(table);

			$(".result").fitText(1.75);
			$(".result > td > table > tr > td").fitText(1.85);
			$(".average").fitText(2.5);
			$(".header").fitText(2);
			$(".restart-results > button").fitText(2);
		}
	});

	$("body").append(table);

	$(".stopwatch-row > td, .stopwatch-row > td > button").fitText(1.5);
	$(".show-results > button").fitText(1.75);
})