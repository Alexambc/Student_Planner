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
    
    // Feature Cards Navigation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const section = card.getAttribute('data-section');
            navigateToSection(section);
        });
    });

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
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });

    // Task Form Functionality
    const taskFormContainer = document.getElementById('taskFormContainer');
    const showTaskFormBtn = document.getElementById('showTaskForm');
    const closeTaskFormBtn = document.getElementById('closeTaskForm');
    const cancelTaskBtn = document.getElementById('cancelTask');
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const taskSearch = document.getElementById('taskSearch');
    const filterPriority = document.getElementById('filterPriority');
    const filterCategory = document.getElementById('filterCategory');

    // Show/hide task form
    showTaskFormBtn.addEventListener('click', () => {
        taskFormContainer.classList.add('visible');
    });

    function hideTaskForm() {
        taskFormContainer.classList.remove('visible');
        taskForm.reset();
    }

    closeTaskFormBtn.addEventListener('click', hideTaskForm);
    cancelTaskBtn.addEventListener('click', hideTaskForm);

    // Handle form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const taskData = {
            id: Date.now(),
            title: document.getElementById('taskName').value,
            dueDate: document.getElementById('taskDate').value,
            priority: document.getElementById('taskPriority').value,
            description: document.getElementById('taskDescription').value,
            category: document.getElementById('taskCategory').value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        // Save task to localStorage
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(taskData);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Add task to the UI
        addTaskToUI(taskData);
        
        // Reset and hide form
        hideTaskForm();
    });

    // Add task to UI
    function addTaskToUI(task) {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card ${task.priority}-priority`;
        taskCard.dataset.id = task.id;
        
        const priorityClass = task.priority === 'high' ? 'high' : 
                            task.priority === 'medium' ? 'medium' : 'low';
        
        taskCard.innerHTML = `
            <div class="task-header">
                <h3>${task.title}</h3>
                <span class="priority-badge ${priorityClass}">${task.priority}</span>
            </div>
            <div class="task-details">
                <p class="due-date">Due: ${new Date(task.dueDate).toLocaleDateString()}</p>
                <p class="category">${task.category}</p>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-actions">
                <button class="complete-btn">Complete</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Add event listeners for the buttons
        const completeBtn = taskCard.querySelector('.complete-btn');
        const deleteBtn = taskCard.querySelector('.delete-btn');

        completeBtn.addEventListener('click', () => {
            taskCard.classList.toggle('completed');
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            const taskIndex = tasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
                tasks[taskIndex].completed = !tasks[taskIndex].completed;
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        });

        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                taskCard.remove();
                const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
                const updatedTasks = tasks.filter(t => t.id !== task.id);
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            }
        });

        taskList.appendChild(taskCard);
    }

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        taskList.innerHTML = '';
        tasks.forEach(task => addTaskToUI(task));
    }

    // Initial load
    loadTasks();

    // Search and filter functionality
    function filterTasks() {
        const searchTerm = taskSearch.value.toLowerCase();
        const priorityFilter = filterPriority.value;
        const categoryFilter = filterCategory.value;
        
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const filteredTasks = tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm) ||
                                task.description.toLowerCase().includes(searchTerm);
            const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
            const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
            
            return matchesSearch && matchesPriority && matchesCategory;
        });

        taskList.innerHTML = '';
        filteredTasks.forEach(task => addTaskToUI(task));
    }

    taskSearch.addEventListener('input', filterTasks);
    filterPriority.addEventListener('change', filterTasks);
    filterCategory.addEventListener('change', filterTasks);

    // Initialize home section as active
    navigateToSection('home');

    // Calendar Functionality
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const addEventBtn = document.getElementById('addEventBtn');
    const eventModal = document.getElementById('eventModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelEventBtn = document.getElementById('cancelEvent');
    const eventForm = document.getElementById('eventForm');

    let currentDate = new Date();
    let events = JSON.parse(localStorage.getItem('calendarEvents') || '{}');

    // Initialize calendar
    function updateCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update month display
        currentMonthElement.textContent = new Date(year, month).toLocaleDateString('default', { 
            month: 'long', 
            year: 'numeric' 
        });
        
        // Clear previous calendar
        calendarGrid.innerHTML = '';
        
        // Get first day of month
        const firstDay = new Date(year, month, 1);
        const startingDay = firstDay.getDay();
        
        // Get days in month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Get days in previous month
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Add days from previous month
        for (let i = startingDay - 1; i >= 0; i--) {
            const day = document.createElement('div');
            day.className = 'calendar-day other-month';
            day.innerHTML = `
                <div class="calendar-day-number">${daysInPrevMonth - i}</div>
                <div class="calendar-events"></div>
            `;
            calendarGrid.appendChild(day);
        }
        
        // Add days of current month
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isToday = i === today.getDate() && 
                           month === today.getMonth() && 
                           year === today.getFullYear();
            
            day.className = `calendar-day ${isToday ? 'today' : ''}`;
            day.dataset.date = dateKey;
            
            const eventsHTML = events[dateKey] ? 
                events[dateKey].map(event => `
                    <div class="calendar-event" title="${event.title} - ${event.time}">
                        ${event.title}
                    </div>
                `).join('') : '';
            
            day.innerHTML = `
                <div class="calendar-day-number">${i}</div>
                <div class="calendar-events">${eventsHTML}</div>
            `;
            
            day.addEventListener('click', () => openEventModal(dateKey));
            calendarGrid.appendChild(day);
        }
        
        // Add days from next month
        const totalDays = startingDay + daysInMonth;
        const remainingDays = 42 - totalDays; // 6 rows * 7 days = 42
        for (let i = 1; i <= remainingDays; i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day other-month';
            day.innerHTML = `
                <div class="calendar-day-number">${i}</div>
                <div class="calendar-events"></div>
            `;
            calendarGrid.appendChild(day);
        }
    }

    // Event Modal Functions
    function openEventModal(date = null) {
        eventModal.classList.add('visible');
        if (date) {
            document.getElementById('eventDate').value = date;
        }
    }

    function closeEventModal() {
        eventModal.classList.remove('visible');
        eventForm.reset();
    }

    // Event Handlers
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });

    addEventBtn.addEventListener('click', () => openEventModal());
    closeModalBtn.addEventListener('click', closeEventModal);
    cancelEventBtn.addEventListener('click', closeEventModal);

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const eventData = {
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            description: document.getElementById('eventDescription').value
        };
        
        // Add event to events object
        if (!events[eventData.date]) {
            events[eventData.date] = [];
        }
        events[eventData.date].push(eventData);
        
        // Save to localStorage
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        
        // Update calendar
        updateCalendar();
        
        // Close modal
        closeEventModal();
    });

    // Initialize calendar
    updateCalendar();

    // Auth Functionality
    const signInModal = document.getElementById('signInModal');
    const signUpModal = document.getElementById('signUpModal');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const showSignUpBtn = document.getElementById('showSignUp');
    const showSignInBtn = document.getElementById('showSignIn');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    // Check if user is already signed in
    const isSignedIn = localStorage.getItem('isSignedIn') === 'true';
    if (!isSignedIn) {
        signInModal.classList.add('visible');
    }

    // Add sign in button click handler
    const signInBtn = document.getElementById('signInBtn');
    signInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signInModal.classList.add('visible');
    });

    // Close modal function
    function closeAllModals() {
        signInModal.classList.remove('visible');
        signUpModal.classList.remove('visible');
    }

    // Switch between sign in and sign up
    showSignUpBtn.addEventListener('click', () => {
        signInModal.classList.remove('visible');
        signUpModal.classList.add('visible');
    });

    showSignInBtn.addEventListener('click', () => {
        signUpModal.classList.remove('visible');
        signInModal.classList.add('visible');
    });

    // Close modals when clicking the close button
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Handle sign in
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // In a real app, you would validate credentials with a server
        // For now, we'll just check if the user exists in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('isSignedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));
            closeAllModals();
        } else {
            alert('Invalid email or password');
        }
    });

    // Handle sign up
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Check if email already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.email === email)) {
            alert('Email already registered');
            return;
        }
        
        // Create new user
        const newUser = {
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };
        
        // Save user
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('isSignedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Close modal and show success message
        closeAllModals();
        alert('Account created successfully!');
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', 
            menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
        );
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close mobile menu when clicking a nav link
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
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
