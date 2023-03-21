import Cookie from "../cookie/Cookie.mjs";

const SUBMIT_URL = "/submit";

window.addEventListener("load", () => {
    const today = new Date().toISOString().split("T")[0];
    document.querySelector("#start_date").setAttribute("value", today);
    document.querySelector("#end_date").setAttribute("value", today);

    loadCookieValues();
    checkFormValues();

    document.querySelector("input[name='name']").addEventListener("change", checkFormValues);
    document.querySelector("input[name='email']").addEventListener("keyup", emailUpdate);
    document.querySelector("input[name='email']").addEventListener("change", checkFormValues);
    document.querySelector("input[name='verify-email']").addEventListener("change", checkFormValues);
    document.querySelector("select[name='institution']").addEventListener("change", checkFormValues);
    document.querySelector("#duration").addEventListener("change", checkDuration);

    // hijack form submission
    document.querySelector("#main_form").addEventListener("submit", submitForm);
});

async function submitForm(event) {    
    event.preventDefault();
    submit();
    return false;
}

async function submit (event) {
    document.querySelector("idle-throbber").show("Request Processing");

    const data = []
    for(const x of document.querySelectorAll("input")) data.push(`${x.name}=${x.value}`);
    for(const x of document.querySelectorAll("select")) data.push(`${x.name}=${x.value}`);

    const response = await fetch(SUBMIT_URL, {
        method: 'POST',
        cache: 'no-cache',
        redirect: 'manual',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body : data.join("&")
    });

    const result = await response.json();
    document.querySelector("idle-throbber").hide();
    document.querySelector("submit-popup").show(result);
}

function checkDuration() {
    switch (document.querySelector("#duration").value) {
        case "am":
        case "pm":
            document.querySelector("#return").classList.add("hidden");
            break;
        case "full":
            document.querySelector("#return").classList.remove("hidden");
            break;
    }
}

/**
 * Load cookie values into the form components.
 */
function loadCookieValues() {
    if (Cookie.hasCookie("name")) {
        document.querySelector("input[name='name']").value = Cookie.getCookie("name");
    }

    if (Cookie.hasCookie("email")) {
        document.querySelector("input[name='email']").value = Cookie.getCookie("email");
        document.querySelector("input[name='verify-email']").value = Cookie.getCookie("email");
        document.querySelector("#verify-email").classList.add("hidden");
    }

    if (Cookie.hasCookie("inst")) {
        document.querySelector("select[name='institution']").value = Cookie.getCookie("inst");
    }
}

function emailUpdate() {
    const email = document.querySelector("input[name='email']").value;
    const verify = document.querySelector("input[name='verify-email']").value;

    if (email.trim() != verify.trim()) {
        document.querySelector("input[name='verify-email']").value = "";
        document.querySelector("#verify-email").classList.remove("hidden");
        document.querySelector("#submit").setAttribute("disabled", true);
    }
}

function checkFormValues() {
    const name = document.querySelector("input[name='name']").value;
    const email = document.querySelector("input[name='email']").value;
    const verify = document.querySelector("input[name='verify-email']").value;
    const inst = document.querySelector("select[name='institution']").value;

    if (email.trim() !== verify.trim()) {
        document.querySelector("#submit").setAttribute("disabled", true);
        document.querySelector("#verify-email").classList.remove("hidden");
        return;
    }

    if (name.trim() != "" && email.trim() != "" && inst.trim() != "n/a") {
        Cookie.setCookie(`name`, name.trim());
        Cookie.setCookie(`email`, email.trim());
        Cookie.setCookie(`inst`, inst.trim());
        document.querySelector("#submit").removeAttribute("disabled");
    } else {
        document.querySelector("#submit").setAttribute("disabled", true);
    }
}

window.check = checkFormValues;
