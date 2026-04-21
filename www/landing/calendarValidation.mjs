// calendarValidation.mjs

const startDate = document.getElementById("start_date");
const endDate = document.getElementById("end_date");

startDate.addEventListener("change", validateDates);
endDate.addEventListener("change", validateDates);

function validateDates() {
    if (startDate.value && endDate.value) {
        if (startDate.value > endDate.value) {
            document.querySelector("#submit").setAttribute("disabled", "");
            document.querySelector("#submit").setAttribute("title", "End date is before start date.");
            document.querySelector("#warning").textContent = "End date is before start date.";
            document.querySelector("#warning").classList.remove("hidden");
        } else {
            document.querySelector("#submit").removeAttribute("disabled");
            document.querySelector("#submit").removeAttribute("title");
            document.querySelector("#warning").classList.add("hidden");
        }
    }
}