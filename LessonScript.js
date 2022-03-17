let currentDepartment

//Uses: departments, currentDepartment, clearDays(), getTimeslot(hour,minute), breakToHtml(day,timeslotLength), lessonToHtml(lesson,timeslotLength)
function loadStudentSet(){

	let studentSetIndex=document.getElementById('student-set').value
	let studentSet=departments[currentDepartment][studentSetIndex]

	document.querySelector('.student-set-title').innerText=studentSet.title
	document.querySelector('title').innerText='KEA Plan - '+studentSet.title
	clearDays()

	let lastBreak=[0,0,0,0,0]
	let matrix=[]
	for(let i=0;i<29;i++)
		matrix.push([])

	for(i in studentSet.lessons){

		let lesson=studentSet.lessons[i]
		let timespan=lesson.timespan
		let startTimeslot=getTimeslot(timespan[0],timespan[1])
		let endTimeslot=getTimeslot(timespan[2],timespan[3])
		let timeslotLength=endTimeslot-startTimeslot

		if(startTimeslot>0)
			matrix[lastBreak[lesson.day]].pop()
		
		if(startTimeslot>lastBreak[lesson.day]){
			let breakHtml=breakToHtml(lesson.day,startTimeslot-lastBreak[lesson.day])
			matrix[lastBreak[lesson.day]].push(breakHtml)
		}
		
		let lessonHtml=lessonToHtml(lesson,timeslotLength)
		matrix[startTimeslot].push(lessonHtml)

		if(endTimeslot<28){
			let breakHtml=breakToHtml(lesson.day,29-endTimeslot)
			matrix[endTimeslot].push(breakHtml)
			lastBreak[lesson.day]=endTimeslot
		}
	}
	for(row in matrix){
		let timeslotElements=matrix[row]
		let timeslot=document.getElementById('timeslot'+row)
		for(col in timeslotElements){
			timeslot.innerHTML+=timeslotElements[col]
			if(timeslot.lastChild.rowSpan<3)
				timeslot.lastChild.style.padding="0 10px"
		}
	}
}

function clearDays(){
	for(let i=0;i<29;i++){
		let timeslot=document.getElementById('timeslot'+i)
		while(timeslot.childNodes.length>1)
			timeslot.removeChild(timeslot.lastChild)
	}
}

function getTimeslot(hour,minute){return (hour-8)*4-2+(minute/15)}

function breakToHtml(day,timeslotLength){return `<td class="break day${day}" rowspan="${timeslotLength}"></td>`}

function lessonToHtml(lesson,timeslotLength){
	let timespan=lesson.timespan
	let timeText=`${timespan[0]}:${timespan[1]} - ${timespan[2]}:${timespan[3]}`
	let innerHtml
	if(timeslotLength<2) innerHtml=`${timeText}, <b>${lesson.title}</b>`
	else if(timeslotLength<5) innerHtml=`${timeText}, <b>${lesson.title}</b><br>${lesson.teacher}, ${lesson.room}`
	else innerHtml=`${timeText}<br><h3>${lesson.title}</h3>${lesson.teacher}<br>${lesson.room}`
	return `<td class="lesson day${lesson.day}" rowspan="${timeslotLength}">${innerHtml}</td>`
}

//Uses: currentDepartment, studentSetToHtmlOption(studentSet,index)
function loadStudentSets(){
	let department=document.getElementById('department').value
	currentDepartment=department
	let studentSetSelector=document.getElementById('student-set')
	let studentSets=departments[department]
	studentSetSelector.innerHTML=`<option disabled selected>${studentSets.length} Student Set(s)</option>`
	for(i in studentSets){
		studentSetSelector.innerHTML+=studentSetToHtmlOption(studentSets[i],i)
	}
}

function studentSetToHtmlOption(studentSet,index){
	return `<option value="${index}">${studentSet.title}</option>`
}