var fs = require('fs');

(function(){

	var getDayString = function(day)
	{
		if(day == 0)
			return "Sunday";
		else if(day == 1)
			return "Monday";
		else if(day == 2)
			return "Tuesday";
		else if(day == 3)
			return "Wednesday";
		else if(day == 4)
			return "Thursday";
		else if(day == 5)
			return "Friday";
		else if(day == 6)
			return "Saturday";
	}

	var getMonthString = function(day)
	{
		if(day == 0)
			return "January";
		else if(day == 1)
			return "February";
		else if(day == 2)
			return "March";
		else if(day == 3)
			return "April";
		else if(day == 4)
			return "May";
		else if(day == 5)
			return "June";
		else if(day == 6)
			return "July";
		else if(day == 7)
			return "August";
		else if(day == 8)
			return "September";
		else if(day == 9)
			return "October";
		else if(day == 10)
			return "November";
		else if(day == 11)
			return "December";
	}

	var getTimeString = function(date)
	{
		var end = "A.M.";
		var hrs = date.getHours();
		var mins = date.getMinutes() + "";
		if(hrs > 11)
		{
			end = "P.M.";
			hrs = hrs - 12;
		}
		if(hrs == 0)
			hrs = 12;

		if(mins.length==1)
			mins = "0" + mins;

		return (hrs + ":" + mins + " " +end);
	}

	var readFile = function(cb)
	{
		fs.readFile('./input.txt', 'utf8', function (err, data) {
			if (err) {
				return console.log(err);
			}
			cb(data);
		});
	}

	var transformData = function(data, cb)
	{
		var objArray = [];

		var lines = data.split("\n");
		for (var i = 0; i < lines.length; i++) {
			var objFields = lines[i].split("\t");

			if(objFields.length == 8)
			{

				objArray.push({
					"date" : new Date(objFields[0]),
					"first" : objFields[1],
					"last" : objFields[2],
					"title" : objFields[3],
					"company" : objFields[4],
					"start" : new Date(objFields[0] + " "+ objFields[5]),
					"end" : new Date(objFields[0] + " "+ objFields[6]),
					"description" : objFields[7]
				});
			}
		};

		var dayArray = [];

		objArray.sort(function(a, b){
			if(a.date.getTime() < b.date.getTime())
				return -1;
			else if (a.date.getTime() == b.date.getTime())
			{
				if(a.start.getTime() < b.start.getTime())
					return -1;
				else if(a.start.getTime() == b.start.getTime())
					return 0;
				else
					return 1;
			}
			else
				return 1;

		});

		objArray.map(function(currentValue, index, array){
			var name = currentValue.first != "" ? currentValue.first + " " + currentValue.last : "";
			var introLine = "";

			if(name)
				introLine = name;

			if(currentValue.title != "")
			{
				if(introLine.length > 0)
					introLine += (", " + currentValue.title);
				else
					introLine += currentValue.title;
			}

			if(currentValue.company != "")
			{
				if(introLine.length > 0)
					introLine += (", " + currentValue.company);
				else
					introLine += currentValue.company;
			}

			var time = currentValue.start != "" ? " ("+ getTimeString(currentValue.start) + "-" + getTimeString(currentValue.end)+")" : "";

			introLine += time;

			var ev = {
				intro : introLine,
				description: currentValue.description
			}

			var dayObj = {
				"date" : currentValue.date,
				"events" : [ev]
			};

			var found = false;

			for (var i = 0; i < dayArray.length; i++) {
				if(dayArray[i].date.getTime() == dayObj.date.getTime())
				{
					dayArray[i].events.push(ev)
					found = true;
				}
			};

			if(!found)
				dayArray.push(dayObj);
		})

		for (var i = 0; i < dayArray.length; i++) {
			var d = dayArray[i].date;
			dayArray[i].date = getDayString(d.getDay())+ ", " + getMonthString(d.getMonth()) + " " + d.getDate() + " —"
		};

		cb(dayArray);
	}

	module.exports.readFile = readFile;
	module.exports.transformData = transformData;

})();
