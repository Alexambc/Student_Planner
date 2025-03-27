// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;
    let isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Initialize theme
    if (isDarkMode) {
        htmlElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        htmlElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Navigation
    const navLinks = document.querySelectorAll('nav a');
    const contentSections = document.querySelectorAll('.content');
    
    // SPA Navigation
    function navigateToSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update active state in navigation
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector(`nav a[data-section="${sectionId}"]`)?.classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });

    // Form Validation
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const taskName = document.getElementById('taskName').value;
            const email = document.getElementById('email').value;
            const messageElement = document.getElementById('form-message');

            // Simple validation
            if (!taskName.trim()) {
                messageElement.textContent = 'Please enter a task name';
                return;
            }

            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                messageElement.textContent = 'Please enter a valid email address';
                return;
            }

            // If validation passes
            messageElement.textContent = 'Task added successfully!';
            taskForm.reset();
        });
    }

    // Initialize home section as active
    navigateToSection('home');
});

// Function to show sections dynamically
function showSection(sectionId) {
    let sections = document.querySelectorAll(".content");
    sections.forEach(section => section.classList.remove("active"));
    
    document.getElementById(sectionId).classList.add("active");
}

// Function to update text dynamically
function updateText() {
    let textElement = document.getElementById("dynamic-text");
    if (textElement) {
        textElement.textContent = "Text has been updated!";
    } else {
        console.error("Element not found!");
    }
}

// Form validation function
function validateForm() {
    let taskName = document.getElementById("taskName").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("form-message");

    if (taskName === "" || email === "") {
        message.textContent = "Please fill in all fields.";
        message.style.color = "red";
        return false;
    }

    // Simple email validation regex
    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
        message.textContent = "Enter a valid email.";
        message.style.color = "red";
        return false;
    }

    message.textContent = "Form submitted successfully!";
    message.style.color = "green";
    return true;
}

document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const daysInMonth = 30; // Change based on month
    let events = {};

    // Generate Calendar Days
    for (let i = 1; i <= daysInMonth; i++) {
        let day = document.createElement("div");
        day.classList.add("day");
        day.innerHTML = `<strong>${i}</strong>`;
        day.setAttribute("data-day", i);
        day.addEventListener("click", openEventForm);
        calendar.appendChild(day);
    }

    // Event Form Handling
    function openEventForm(event) {
        let day = event.target.getAttribute("data-day");
        let eventText = prompt(`Add an event for day ${day}:`);
        if (eventText) {
            if (!events[day]) events[day] = [];
            events[day].push(eventText);

            let eventEl = document.createElement("span");
            eventEl.classList.add("event");
            eventEl.textContent = eventText;
            event.target.appendChild(eventEl);
        }
    }
});
