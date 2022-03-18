const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthNames = [
	'January', 'Febuary', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];
let firstWeek = 5, lastWeek = 21;
let weeks = generateWeeks(firstWeek, [31, 1], lastWeek);

function generateWeeks(firstWeek, firstDateAndMonth, lastWeek){
	//Load start date
	let date = firstDateAndMonth[0];
	let month = firstDateAndMonth[1];

	//Initialize output
	let weeks = [];

	//Interate from first week to last week
	for(let week = firstWeek; week <= lastWeek; week++){
		//Initialize dates buffer
		let dates = [];
		//Add the the next 5 dates to the buffer
		for(let i = 0; i < 5; i++){
			//Go to next month if date is out of bounds
			if(date > monthLengths[month-1]){
				date -= monthLengths[month-1];
				month++;
			}
			//Add the current date to buffer
			dates.push([date, month]);
			//Go to the next date
			date++;
		}
		//Add the 5 dates in the buffer to the current week
		weeks.push(dates);
		//Skip the weekend
		date += 2;
	}
	return weeks;
}

setWeek(firstWeek, document.querySelector(".week" + firstWeek));

//Uses: updateWeekArrowButton(query,newWeekNumber,boundry)
function setWeek(weekNumber, newWeek){
	//Set new current week
	newWeek.classList.add('current-week');

	//Update previous week button
	updateWeekArrowButton('prev',weekNumber - 1, 4);

	//Update next week button
	updateWeekArrowButton('next',weekNumber + 1, 22);

	//Update week number
	document.querySelector('.week-number').innerText = weekNumber;

	//Update first and last date of week
	let weekDates = weeks[weekNumber - firstWeek];
	let firstDateOfWeek = weekDates[0][0] + '/' + weekDates[0][1];
	let lastDateOfWeek = weekDates[4][0] + '/' + weekDates[4][1];
	document.querySelector('.week-dates').innerText = firstDateOfWeek + ' - ' + lastDateOfWeek;
	
	//Update dates of weekdays
	for(let i in weekDates)
		document.querySelector('.date' + i).innerText = weekDates[i][0] + ' ' + monthNames[weekDates[i][1] - 1];
}

function updateWeekArrowButton(query, newWeekNumber ,boundry){
	//Get button
	let button = document.querySelector('.' + query + '-button')

	//Update week reference and color
	if(newWeekNumber != boundry){
		button.onclick = () => updateWeek(newWeekNumber);
		button.style.color = 'black';
	}else{
		button.onclick = () => {};
		button.style.color = 'gray';
	}

	//Update week number
	document.querySelector('.' + query + '-week').innerText = newWeekNumber;
}

function updateWeek(weekNumber){
	//Stop if the new week is the current week
	let newWeek = document.querySelector('.week' + weekNumber);
	if(newWeek.classList.contains('current-week'))
		return;

	//Update current week button
	let oldWeek = document.querySelector('.current-week');
	oldWeek.classList.remove('current-week');
	setWeek(weekNumber, newWeek);
}