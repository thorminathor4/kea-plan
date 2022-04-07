let currentDepartment, currentStudentSet;
let firstHour = 8, firstMinute = 30;

loadEmptyDays()

function loadEmptyDays(){
	let timeslot0 = document.getElementById('timeslot0');
	for(let i = 0; i < 5; i++){
		let emptyDay = createBreakElement(i, 29);
		timeslot0.appendChild(emptyDay);
		//timeslot0.innerHTML += `<td class="break day${i}" rowspan="29"></td>`;
	}
}

//Uses: departments, currentDepartment
//Calls: clearDays(), getTimeslot(hour, minute), breakToHtml(day, timeslotLength), lessonToHtml(lesson, timeslotLength)
function loadStudentSet(){
	let studentSetTitle = document.getElementById('student-set').value;
	currentStudentSet = studentSetTitle;
	document.querySelector('.student-set-title').innerText = studentSetTitle;
	document.querySelector('title').innerText = `KEA Plan - ${studentSetTitle}`;
	clearDays();
	let filePath = `./Departments/${currentDepartment}/${studentSetTitle}.json`;

	fetch(filePath)
	.then(response => { if(response.ok) return response.json(); })
	.then(studentSet => {
		if(studentSet){
			document.getElementById('student-set-error').innerText = '';
			let lastBreaks = [0, 0, 0, 0, 0];
			let scheduleMatrix = [];

			for(let i = 0; i < 29; i++)
				scheduleMatrix.push([]);

			for(let i in studentSet.lessons)
				addLessonToSchedule(scheduleMatrix, studentSet.lessons[i], lastBreaks);
			
			addLessonsToTable(scheduleMatrix);
		}else{
			document.getElementById('student-set-error').innerText = 'Student Set Not Present';
			loadEmptyDays();
		}
	});
}

function addLessonToSchedule(scheduleMatrix, lesson, lastBreaks){
	let startTimeslot = getTimeslotIndex(lesson.starts);
	let endTimeslot = getTimeslotIndex(lesson.ends);

	//Remove last break added to the day if there is one and the lesson doesn't start in the first timeslot
	if(startTimeslot > 0 && scheduleMatrix.length > 0)
		scheduleMatrix[lastBreaks[lesson.day]].pop();
	
	//Add a new break before the lesson if there is a break before the lesson
	if(startTimeslot > lastBreaks[lesson.day]){
		let breakElement = createBreakElement(lesson.day, startTimeslot - lastBreaks[lesson.day]);
		scheduleMatrix[lastBreaks[lesson.day]].push(breakElement);
	}
	
	//Add the lesson
	let lessonElement = createLessonElement(lesson, endTimeslot - startTimeslot);
	scheduleMatrix[startTimeslot].push(lessonElement);

	//Add a new break after the lesson if the lesson doesn't end in the last timeslot
	if(endTimeslot < 28){
		let breakElement = createBreakElement(lesson.day, 29 - endTimeslot);
		scheduleMatrix[endTimeslot].push(breakElement);
		lastBreaks[lesson.day] = endTimeslot;
	}
}

function addLessonsToTable(scheduleMatrix){
	for(let timeslot in scheduleMatrix){
		let timeslotElements = scheduleMatrix[timeslot];
		let timeslotElement = document.getElementById(`timeslot${timeslot}`);
		for(let col in timeslotElements)
			timeslotElement.appendChild(timeslotElements[col]);
	}
}

function clearDays(){
	for(let i = 0; i < 29; i++){
		let timeslot = document.getElementById(`timeslot${i}`);
		while(timeslot.childNodes.length > 1)
			timeslot.removeChild(timeslot.lastChild);
	}
}

function getTimeslotIndex(timeString){
	let {hour, minute} = parseTimeString(timeString);
	return (hour - firstHour) * 4 + (minute - firstMinute) / 15;
}

function parseTimeString(timeString){
	let colonIndex = timeString.indexOf(':');
	let hour = Number(timeString.slice(0, colonIndex));
	let minute = Number(timeString.slice(colonIndex + 1, timeString.length));
	return {hour, minute};
}

function createBreakElement(day, timeslotLength){
	let breakElement = document.createElement('td');
	breakElement.classList.add('break', `day${day}`);
	breakElement.rowSpan = timeslotLength;
	return breakElement;
}

function createLessonElement(lesson, timeslotLength){
	//Create lesson element
	let lessonElement = document.createElement('td');
	lessonElement.classList.add('lesson', `day${lesson.day}`);
	lessonElement.rowSpan = timeslotLength;

	//Change padding for short lessons
	if(timeslotLength < 3)
		lessonElement.style.padding = "0 10px";

	//Add the start time and end time
	lessonElement.innerText = `${lesson.starts} - ${lesson.ends}`;
	
	//Add seperation
	lessonElement.appendChild(timeslotLength < 5 ? document.createTextNode(', ') : document.createElement('br'));

	//Add the lesson title
	let lessonTitle = document.createElement(timeslotLength < 5 ? 'b' : 'h3');
	lessonTitle.innerText += lesson.title;
	lessonElement.appendChild(lessonTitle);

	if(timeslotLength > 1){
		//Add seperation
		if(timeslotLength < 5)
			lessonElement.appendChild(document.createElement('br'));

		//Add lesson teacher
		lessonElement.appendChild(document.createTextNode(lesson.teachers[0]));
		if(lesson.teachers.length > 1)
			for(let i = 1; i < lesson.teachers.length; i++){
				lessonElement.appendChild(document.createElement('br'));
				lessonElement.appendChild(document.createTextNode(lesson.teachers[i]));
			}

		//Add seperation
		lessonElement.appendChild(timeslotLength < 5 ? document.createTextNode(', ') : document.createElement('br'));
		
		//Add lesson room
		lessonElement.appendChild(document.createTextNode(lesson.room));
	}
	return lessonElement;

	/*
	let innerHtml;
	if(timeslotLength < 2)
		innerHtml = `${timeText}, <b>${lesson.title}</b>`;
	else if(timeslotLength < 5)
		innerHtml = `${timeText}, <b>${lesson.title}</b><br>${lesson.teacher}, ${lesson.room}`;
	else
		innerHtml = `${timeText}<br><h3>${lesson.title}</h3>${lesson.teacher}<br>${lesson.room}`;
	return `<td class="lesson day${lesson.day}" rowspan="${timeslotLength}">${innerHtml}</td>`;
	*/
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