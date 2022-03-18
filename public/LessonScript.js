let currentDepartment, currentStudentSet;

loadEmptyDays()

function loadEmptyDays(){
	let timeslot0 = document.getElementById('timeslot0');
	for(let i = 0; i < 5; i++)
		timeslot0.innerHTML += `<td class="break day${i}" rowspan="29"></td>`;
}

//Uses: departments, currentDepartment
//Calls: clearDays(), getTimeslot(hour, minute), breakToHtml(day, timeslotLength), lessonToHtml(lesson, timeslotLength)
function loadStudentSet(){

	let studentSetTitle = document.getElementById('student-set').value;
	currentStudentSet = studentSetTitle;
	document.querySelector('.student-set-title').innerText = studentSetTitle;
	document.querySelector('title').innerText = 'KEA Plan - ' + studentSetTitle;
	clearDays();

	let filePath = `./Departments/${currentDepartment}/${studentSetTitle}.json`;
	console.log(filePath);

	fetch(filePath)
	.then(response => response.json())
	.then(studentSet => {

		console.log(studentSet);

		let lastBreaks = [0, 0, 0, 0, 0];
		let scheduleMatrix = [];

		for(let i = 0; i < 29; i++)
			scheduleMatrix.push([]);

		for(let i in studentSet.lessons){
			let lesson = studentSet.lessons[i];
			let timespan = lesson.timespan;
			let startTimeslot = getTimeslot(timespan[0], timespan[1]);
			let endTimeslot = getTimeslot(timespan[2], timespan[3]);
			let timeslotLength = endTimeslot - startTimeslot;

			console.log("loaded timespan");
			if(startTimeslot > 0)
				scheduleMatrix[lastBreaks[lesson.day]].pop();
			
			if(startTimeslot > lastBreaks[lesson.day]){
				let breakHtml = breakToHtml(lesson.day, startTimeslot - lastBreaks[lesson.day]);
				scheduleMatrix[lastBreaks[lesson.day]].push(breakHtml);
			}
			
			let lessonHtml = lessonToHtml(lesson, timeslotLength);
			scheduleMatrix[startTimeslot].push(lessonHtml);

			if(endTimeslot < 28){
				let breakHtml = breakToHtml(lesson.day, 29 - endTimeslot);
				scheduleMatrix[endTimeslot].push(breakHtml);
				lastBreaks[lesson.day] = endTimeslot;
			}
			//addLessonToSchedule(scheduleMatrix, studentSet.lessons[i], lastBreaks);
		}

		console.log(scheduleMatrix);
		
		for(let row in scheduleMatrix){
			let timeslotElements = scheduleMatrix[row];
			let timeslot = document.getElementById('timeslot' + row);
			for(let col in timeslotElements){
				timeslot.innerHTML += timeslotElements[col];
				if(timeslot.lastChild.rowSpan < 3)
					timeslot.lastChild.style.padding = "0 10px";
			}
		}

		//addLessonsToTable(scheduleMatrix);

	}).catch(error => {
		console.error(error);
		document.getElementById('student-set-error').innerText = 'Student Set Not Present';
		loadEmptyDays();
	});
}

function addLessonToSchedule(scheduleMatrix, lesson){
	let timespan = lesson.timespan;
	let startTimeslot = getTimeslot(timespan[0], timespan[1]);
	let endTimeslot = getTimeslot(timespan[2], timespan[3]);
	let timeslotLength = endTimeslot - startTimeslot;

	if(startTimeslot > 0)
		scheduleMatrix[lastBreaks[lesson.day]].pop();
	
	if(startTimeslot > lastBreaks[lesson.day]){
		let breakHtml = breakToHtml(lesson.day, startTimeslot - lastBreaks[lesson.day]);
		scheduleMatrix[lastBreak[lesson.day]].push(breakHtml);
	}
	
	let lessonHtml = lessonToHtml(lesson, timeslotLength);
	scheduleMatrix[startTimeslot].push(lessonHtml);

	if(endTimeslot < 28){
		let breakHtml = breakToHtml(lesson.day, 29 - endTimeslot);
		scheduleMatrix[endTimeslot].push(breakHtml);
		lastBreaks[lesson.day] = endTimeslot;
	}
}

function addLessonsToTable(scheduleMatrix){
	for(let row in scheduleMatrix){
		let timeslotElements = scheduleMatrix[row];
		let timeslot = document.getElementById('timeslot' + row);
		for(let col in timeslotElements){
			timeslot.innerHTML += timeslotElements[col];
			if(timeslot.lastChild.rowSpan < 3)
				timeslot.lastChild.style.padding = "0 10px";
		}
	}
}

function clearDays(){
	for(let i = 0; i < 29; i++){
		let timeslot = document.getElementById('timeslot' + i);
		while(timeslot.childNodes.length > 1)
			timeslot.removeChild(timeslot.lastChild);
	}
}

function getTimeslot(hour, minute){
	return (hour - 8) * 4 - 2 + (minute / 15);
}

function breakToHtml(day, timeslotLength){
	return `<td class="break day${day}" rowspan="${timeslotLength}"></td>`;
}

function lessonToHtml(lesson, timeslotLength){
	let timespan = lesson.timespan;
	for(let i in timespan)
		timespan[i] = String(timespan[i]).padStart(2, '0');
	let timeText = `${timespan[0]}:${timespan[1]} - ${timespan[2]}:${timespan[3]}`;
	let innerHtml;
	if(timeslotLength < 2)
		innerHtml = `${timeText}, <b>${lesson.title}</b>`;
	else if(timeslotLength < 5)
		innerHtml = `${timeText}, <b>${lesson.title}</b><br>${lesson.teacher}, ${lesson.room}`;
	else
		innerHtml = `${timeText}<br><h3>${lesson.title}</h3>${lesson.teacher}<br>${lesson.room}`;
	return `<td class="lesson day${lesson.day}" rowspan="${timeslotLength}">${innerHtml}</td>`;
}

//Calls: currentDepartment, studentSetToHtmlOption(studentSet, index)
function loadDepartment(){
	let department = document.getElementById('department').value;
	currentDepartment = department;
	fetch(`./Departments/${currentDepartment}/${currentDepartment}.json`)
	.then(response => response.json())
	.then(department => {
		let studentSetSelector = document.getElementById('student-set');
		let studentSets = department.studentSets;
		studentSetSelector.innerHTML = `<option disabled selected>${studentSets.length} Student Sets</option>`;
		for(let i in studentSets)
			studentSetSelector.innerHTML += studentSetToHtmlOption(studentSets[i]);
	});
}

function studentSetToHtmlOption(studentSet){
	return `<option value="${studentSet}">${studentSet}</option>`;
}