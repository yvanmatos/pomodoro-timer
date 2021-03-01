// Botoes
let timer = document.querySelector("#timer")
const start = document.querySelector(".start")
const stop = document.querySelector(".stop")
const reset = document.querySelector(".reset")

const alarm = new Audio('./imgs/alarm.mp3')


start.addEventListener("click", () => {
    toggle()
})

stop.addEventListener("click", () => {
    toggle()
})

reset.addEventListener("click", () => {
    toggle(true)
    location.reload()
})


// Timer
let type = 'Work'
let timeSpentInCurrentSession = 0;
let workCounter = 0

// Default Values
let workTimeR = "25:00"
let workTime = hmsToSecondsOnly(workTimeR)

let workTimeLeftR = "25:00"
let workTimeLeft = hmsToSecondsOnly(workTimeLeftR)

let shortBreakR = "5:00"
let shortBreak = hmsToSecondsOnly(shortBreakR)

let longBreakR = "15:00"
let longBreak = hmsToSecondsOnly(longBreakR)

let isRunning = false


const saveSettings = () => {

  let workTimeR = (document.querySelector('[name=pomodoro]').value + ":00")
  workTime = hmsToSecondsOnly(workTimeR)

  let workTimeLeftR = (document.querySelector('[name=pomodoro]').value + ":00")
  workTimeLeft = hmsToSecondsOnly(workTimeLeftR)

  let shortBreakR = (document.querySelector('[name=short]').value + ":00")
  shortBreak = hmsToSecondsOnly(shortBreakR)

  let longBreakR = (document.querySelector('[name=long]').value+ ":00")
  longBreak = hmsToSecondsOnly(longBreakR)

  let savedSettings = document.querySelector('#saved-settings')
  savedSettings.innerText = 
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
          console.log(type);
          alarm.play()
          
        } else if (workCounter == 3) {
          workTimeLeft = longBreak;
          type = 'Long';
          workCounter = 0
          console.log(type);
          alarm.play()
          
        } else if(type === 'Break' || (type === 'Long' && workCounter == 0)){
            workTimeLeft = workTime;
            type = 'Work';
            workCounter++
            console.log(type);
            alarm.play()
          }
      }
      displayCurrentTimeLeftInSession();
    }

    function hmsToSecondsOnly(str) {
        let p = str.split(':');
            s = 0, m = 1;
            console.log(p);
        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }
        return s;
    }