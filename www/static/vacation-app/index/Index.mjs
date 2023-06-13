import Cookie from "../cookie/Cookie.mjs";

const SUBMIT_URL = "/submit";

window.addEventListener("load", () => {
    const today = new Date().toISOString().split("T")[0];
    document.querySelector("#start_date").setAttribute("value", today);
    document.querySelector("#end_date").setAttribute("value", today);

    checkFormValues();

    document.querySelector("input[name='name']").addEventListener("change", checkFormValues);
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
    const inst = document.querySelector("select[name='institution']").value;

    if (name.trim() != "" && inst.trim() != "n/a") {
        Cookie.setCookie(`name`, name.trim());
        Cookie.setCookie(`email`, email.trim());
        Cookie.setCookie(`inst`, inst.trim());
        document.querySelector("#submit").removeAttribute("disabled");
    } else {
        document.querySelector("#submit").setAttribute("disabled", true);
    }
}

window.check = checkFormValues;
