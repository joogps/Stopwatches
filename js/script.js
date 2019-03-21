var config = {
	apiKey: "AIzaSyBDEyHyqlyZpFdUPa5nC5-rpRgqP6V38Wg",
	authDomain: "corrida-de-orien-1551377672387.firebaseapp.com",
	databaseURL: "https://corrida-de-orien-1551377672387.firebaseio.com",
	projectId: "corrida-de-orien-1551377672387",
	storageBucket: "corrida-de-orien-1551377672387.appspot.com",
	messagingSenderId: "514777290502"
};
firebase.initializeApp(config);

var database = firebase.database();

let stopwatches = [];

$(function() {

	let table = $("<table>").addClass("stopwatches");

	for(var i = 1; i <= 6; i++) {
		let tableRow = $("<tr>");

		let group = $("<td>").addClass("group").html("Grupo "+i);
		let time = $("<td>").addClass("time");
		let controller = $("<td>").addClass("controller").append($("<button>"));

		let stopwatch = new Stopwatch(time, controller.find("button"), database.ref("groups/"+i));

		stopwatches.push(stopwatch);

		tableRow.append(group).append(time).append(controller);
		table.append(tableRow);
	}

	let results = $("<tr>").append($("<td>").addClass("show-results").attr("colspan", "3").append($("<button>").html("Resultados")));
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

			let header = $("<tr>").append($("<td>").addClass("header").attr("colspan", "3").html("Resultados"));
			table.append(header);

			for(let [i, stopwatch] of stopwatches.entries()) {
				let row = $("<tr>").addClass(i < 3 ? ["golden", "silver", "bronze"][i] : "");
				let group = stopwatch.element.parent().find(".group");
				let time = stopwatch.element;

				let start = $("<tr>").append($("<td>").html("➡ "+stopwatch.formatTime(stopwatch.start)));
				let end = $("<tr>").append($("<td>").html("⬅ "+stopwatch.formatTime(stopwatch.stop)));
				let startend = $("<td>").append($("<table>").append(start).append(end));

				row.append(group).append(time).append(startend);
				table.append(row);
			}

			let restart = $("<tr>").append($("<td>").addClass("restart-results").attr("colspan", "3").append($("<button>").html("Reiniciar")));
			table.append(restart);

			restart.click(function() {
				if(confirm("Reiniciar todos os cronômetros?")) {
					if(confirm("Tem certeza? Todos os dados serão perdidos.")) {
						database.ref("/").set({});
						location.reload();
					}
				}
			});

			$("body").append(table);
		}
	});

	$("body").append(table);
})