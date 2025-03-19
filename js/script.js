document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll("nav ul li a");
    const sections = document.querySelectorAll(".content");

    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const sectionId = this.getAttribute("data-section");

            sections.forEach(section => {
                section.classList.remove("active");
            });

            document.getElementById(sectionId).classList.add("active");
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
