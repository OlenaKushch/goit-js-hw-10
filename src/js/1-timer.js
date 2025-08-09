import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";


import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


let userSelectedDate = null;
const selector = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      
      if (selectedDate.getTime() <= Date.now()) {
          iziToast.error({
              title: '',
              message: "Please choose a date in the future",
              position: 'bottomRight',
          });
              
          startBtn.disabled = true;
      return;
      } 
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
  },
};

flatpickr(selector, options);

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let intervalId = null;
startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    selector.disabled = true;

    intervalId = setInterval(() => {
        const initTime = Date.now();
        const diff = userSelectedDate.getTime() - initTime;

        if (diff <= 0) {
            clearInterval(intervalId);
            updateTimer(0, 0, 0, 0);
            selector.disabled = false;
            return;
        };
        const { days, hours, minutes, seconds } = convertMs(diff);
        updateTimer(days, hours, minutes, seconds);
    }, 1000);
});

function updateTimer(days, hours, minutes, seconds) {
 daysEl.textContent = String(days).padStart(2, '0');
 hoursEl.textContent = String(hours).padStart(2, '0');
minutesEl.textContent = String(minutes).padStart(2, '0');
secondsEl.textContent = String(seconds).padStart(2, '0');

  
}



function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
