document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const hoursDisplay = document.getElementById('hours');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const progressBar = document.getElementById('progress-bar');
    
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const setBtn = document.getElementById('set-btn');
    
    const setHoursInput = document.getElementById('set-hours');
    const setMinutesInput = document.getElementById('set-minutes');
    const setSecondsInput = document.getElementById('set-seconds');
    
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    // Timer variables
    let totalSeconds = 0;
    let remainingSeconds = 0;
    let timerInterval = null;
    let isRunning = false;
    
    // Initialize timer with default 25 minutes
    setTimer(0, 25, 0);
    updateDisplay();
    
    // Event Listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    setBtn.addEventListener('click', setTimerFromInputs);
    
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const minutes = parseInt(this.getAttribute('data-minutes'));
            setTimer(0, minutes, 0);
            updateDisplay();
        });
    });
    
    // Timer functions
    function startTimer() {
        if (!isRunning && remainingSeconds > 0) {
            isRunning = true;
            timerInterval = setInterval(updateTimer, 1000);
            startBtn.disabled = true;
            pauseBtn.disabled = false;
        }
    }
    
    function pauseTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    }
    
    function resetTimer() {
        pauseTimer();
        remainingSeconds = totalSeconds;
        updateDisplay();
        startBtn.disabled = false;
    }
    
    function updateTimer() {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay();
            
            // Update progress bar
            const progressPercentage = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
            progressBar.style.width = `${progressPercentage}%`;
            
            // Change color when 20% time remains
            if (remainingSeconds / totalSeconds < 0.2) {
                progressBar.style.backgroundColor = '#e74c3c';
            }
        } else {
            pauseTimer();
            // Play a sound or show notification when timer completes
            alert('Time is up! Take a break.');
            progressBar.style.backgroundColor = '#3498db';
        }
    }
    
    function updateDisplay() {
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        
        hoursDisplay.textContent = hours.toString().padStart(2, '0');
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }
    
    function setTimer(hours, minutes, seconds) {
        totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
        remainingSeconds = totalSeconds;
        progressBar.style.width = '0%';
        progressBar.style.backgroundColor = '#3498db';
    }
    
    function setTimerFromInputs() {
        const hours = parseInt(setHoursInput.value) || 0;
        const minutes = parseInt(setMinutesInput.value) || 0;
        const seconds = parseInt(setSecondsInput.value) || 0;
        
        if (hours === 0 && minutes === 0 && seconds === 0) {
            alert('Please set a valid time');
            return;
        }
        
        setTimer(hours, minutes, seconds);
        updateDisplay();
        pauseTimer();
    }
    
    // Input validation
    [setHoursInput, setMinutesInput, setSecondsInput].forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value) || 0;
            
            if (this === setHoursInput) {
                if (value < 0) value = 0;
                if (value > 23) value = 23;
            } else {
                if (value < 0) value = 0;
                if (value > 59) value = 59;
            }
            
            this.value = value;
        });
    });
});