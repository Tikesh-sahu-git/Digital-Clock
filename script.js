document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const hoursElement = document.querySelector('.hours');
    const minutesElement = document.querySelector('.minutes');
    const secondsElement = document.querySelector('.seconds');
    const ampmElement = document.querySelector('.ampm');
    const weekdayElement = document.querySelector('.weekday');
    const monthElement = document.querySelector('.month');
    const dayElement = document.querySelector('.day');
    const yearElement = document.querySelector('.year');
    const timezoneInfoElement = document.querySelector('.timezone-info');
    const progressElement = document.querySelector('.progress');
    const progressTextElement = document.querySelector('.progress-text');
    const timezoneSelect = document.getElementById('timezone');
    const toggleSecondsBtn = document.getElementById('toggle-seconds');
    const toggleMilitaryBtn = document.getElementById('toggle-military');
    const toggleAnalogBtn = document.getElementById('toggle-analog');
    const analogClockContainer = document.querySelector('.analog-clock-container');
    const hourHand = document.querySelector('.hour-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const secondHand = document.querySelector('.second-hand');
    const themeButtons = document.querySelectorAll('.theme-btn');

    // State
    let showSeconds = true;
    let militaryTime = false;
    let currentTimezone = 'local';
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Initialize
    setTheme('light');
    updateClock();
    setInterval(updateClock, 1000);

    // Event Listeners
    timezoneSelect.addEventListener('change', function() {
        currentTimezone = this.value;
        updateClock();
    });

    toggleSecondsBtn.addEventListener('click', function() {
        showSeconds = !showSeconds;
        secondsElement.style.display = showSeconds ? 'inline-block' : 'none';
        document.querySelectorAll('.colon')[1].style.display = showSeconds ? 'inline-block' : 'none';
        this.textContent = showSeconds ? 'Hide Seconds' : 'Show Seconds';
    });

    toggleMilitaryBtn.addEventListener('click', function() {
        militaryTime = !militaryTime;
        ampmElement.style.display = militaryTime ? 'none' : 'inline-block';
        this.textContent = militaryTime ? 'Toggle 12-hour Format' : 'Toggle 24-hour Format';
        updateClock();
    });

    toggleAnalogBtn.addEventListener('click', function() {
        analogClockContainer.classList.toggle('hidden');
        this.textContent = analogClockContainer.classList.contains('hidden') ? 
            'Show Analog Clock' : 'Hide Analog Clock';
    });

    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
        });
    });

    // Functions
    function updateClock() {
        let now;
        
        if (currentTimezone === 'local') {
            now = new Date();
            timezoneInfoElement.textContent = `Timezone: Local (${Intl.DateTimeFormat().resolvedOptions().timeZone})`;
        } else if (currentTimezone === 'UTC') {
            now = new Date(new Date().toUTCString());
            timezoneInfoElement.textContent = 'Timezone: UTC';
        } else {
            try {
                const options = { timeZone: currentTimezone, hour12: false };
                const timeString = new Date().toLocaleString('en-US', options);
                now = new Date(timeString);
                timezoneInfoElement.textContent = `Timezone: ${currentTimezone.split('/')[1].replace('_', ' ')}`;
            } catch (e) {
                console.error('Invalid timezone, falling back to local');
                now = new Date();
                currentTimezone = 'local';
                timezoneSelect.value = 'local';
                timezoneInfoElement.textContent = `Timezone: Local (${Intl.DateTimeFormat().resolvedOptions().timeZone})`;
            }
        }

        // Digital Clock
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        if (!militaryTime) {
            hours = hours % 12;
            hours = hours ? hours : 12; // Convert 0 to 12
        }

        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        ampmElement.textContent = ampm;

        // Date
        const weekday = weekdays[now.getDay()];
        const month = months[now.getMonth()];
        const day = now.getDate();
        const year = now.getFullYear();

        weekdayElement.textContent = weekday;
        monthElement.textContent = month;
        dayElement.textContent = day;
        yearElement.textContent = year;

        // Day progress
        const totalSecondsInDay = 86400;
        const secondsPassed = hours * 3600 + minutes * 60 + seconds;
        const progressPercentage = (secondsPassed / totalSecondsInDay) * 100;

        progressElement.style.width = `${progressPercentage}%`;
        progressTextElement.textContent = `${progressPercentage.toFixed(2)}% of day passed`;

        // Analog Clock
        const analogHours = now.getHours() % 12;
        const analogMinutes = now.getMinutes();
        const analogSeconds = now.getSeconds();

        const hourDegrees = (analogHours * 30) + (analogMinutes * 0.5);
        const minuteDegrees = analogMinutes * 6;
        const secondDegrees = analogSeconds * 6;

        hourHand.style.transform = `rotate(${hourDegrees}deg)`;
        minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
        secondHand.style.transform = `rotate(${secondDegrees}deg)`;
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Store theme preference
        localStorage.setItem('theme', theme);
        
        // Update active button
        themeButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-theme') === theme) {
                button.classList.add('active');
            }
        });
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
});