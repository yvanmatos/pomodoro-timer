// Botoes
let timer = document.querySelector("#timer")
const start = document.querySelector(".start")
const stop = document.querySelector(".stop")
const reset = document.querySelector(".reset")

const pomodoro = document.querySelector("[name=pomodoro]")
const short = document.querySelector("[name=short]")
const long = document.querySelector("[name=long]")
const save = document.querySelector("#submit")

const alarm = new Audio('./imgs/alarm.mp3')
const inputs = document.querySelectorAll("[cl-input]")


// Listeners
start.addEventListener("click", () => {
    toggle()
})

stop.addEventListener("click", () => {
    toggle()
})

reset.addEventListener("click", () => {
    toggle(true)
    error.innerText = " "
    // timer.innerText = workTimeLeft
})

save.addEventListener("click", () => {
    saveSettings();
})

inputs.forEach(e => {
  e.addEventListener("change", () => {
    if(e.value.match(/[a-zA-Z]/g) || "") { 
      save.disabled = true
    } else { 
      save.disabled = false
    }
  })
});


// Timer
let type = 'Work'
let timeSpentInCurrentSession = 0;
let workCounter = 0

// Default Values

const defaultValues = ["25:00", "25:00", "5:00", "15:00"]


let workTimeR = defaultValues[0]
let workTime = hmsToSecondsOnly(workTimeR)

let workTimeLeftR = defaultValues[1]
let workTimeLeft = hmsToSecondsOnly(workTimeLeftR)

let shortBreakR = defaultValues[2]
let shortBreak = hmsToSecondsOnly(shortBreakR)

let longBreakR = defaultValues[3]
let longBreak = hmsToSecondsOnly(longBreakR)

let isRunning = false


const saveSettings = () => {

  let workTimeR = (pomodoro.value + ":00")
  workTime = hmsToSecondsOnly(workTimeR)
  
  let workTimeLeftR = (pomodoro.value + ":00")
  workTimeLeft = hmsToSecondsOnly(workTimeLeftR)
  
  let shortBreakR = (short.value + ":00")
  shortBreak = hmsToSecondsOnly(shortBreakR)
  
  let longBreakR = (long.value+ ":00")
  longBreak = hmsToSecondsOnly(longBreakR)

  if(workTimeLeftR == ":00") {
    return
  }
  
  save.nextElementSibling.innerText = 
  ("WorkTime: " + `${workTimeR}` + "  " +
  "ShortBreak: " + `${shortBreakR}` + "  "+
  "LongBreak: " + `${longBreakR}`)
}

const toggle = (reset) => {
    if(reset) {
        stopClock();
    } else {
        if(isRunning === true) {
            isRunning = false
            clearInterval(clockTimer);
        } else {
            isRunning = true
            clockTimer = setInterval(() => {
                // decrease time left / increase time spent
                stepDown();
                displayCurrentTimeLeftInSession();
            }, 1000)
        }
    }
   
}

const displayCurrentTimeLeftInSession = () => {
    let error = document.querySelector('#error')

    if (isNaN(workTimeLeft)){
      timer.innerText = "Error"
      error.innerText = "Please use positive integers for all timers"
    } else {
    const secondsLeft = workTimeLeft;
    let result = '';
    const seconds = secondsLeft % 60;
    const minutes = parseInt(secondsLeft / 60) % 60;
    let hours = parseInt(secondsLeft / 3600);
    
    // add leading zeroes if it's less than 10
    function addLeadingZeroes(time) {
      return time < 10 ? `0${time}` : time
    }

    if (hours > 0) result += `${hours}:`;
    result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`
    timer.innerText = result.toString();
    }
    
  }

  const stopClock = () => {
    clearInterval(clockTimer);
    isRunning = false;
    workTimeLeft = workTime
    displayCurrentTimeLeftInSession();
    timeSpentInCurrentSession = 0;
  }

  const stepDown = () => {
    if (workTimeLeft > 0) {
      workTimeLeft--;
      timeSpentInCurrentSession++;
      } else if (workTimeLeft === 0) {
        timeSpentInCurrentSession = 0;
        if (type === 'Work' && workCounter != 3) {
          workTimeLeft = shortBreak;
          type = 'Break';
          alarm.play()
          
        } else if (workCounter == 3) {
          workTimeLeft = longBreak;
          type = 'Long';
          workCounter = 0
          alarm.play()
          
        } else if(type === 'Break' || (type === 'Long' && workCounter == 0)){
            workTimeLeft = workTime;
            type = 'Work';
            workCounter++
            alarm.play()
          }
      }
      displayCurrentTimeLeftInSession();
    }

    function hmsToSecondsOnly(string) {
        let p = string.split(':', 2);
            seg = 0, min = 1;
            console.log(p)
        while (p.length > 0) {
            seg += min * parseInt(p.pop(), 10);
            min *= 60;
        }
        return seg;
    }