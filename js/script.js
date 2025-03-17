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