window.addEventListener("load", () => {
    const today = new Date().toISOString().split("T")[0];
    document.querySelector("#start_date").setAttribute("value", today);
    document.querySelector("#end_date").setAttribute("value", today);

    document.querySelector("input[name='name']").addEventListener("change", checkValues);
    document.querySelector("input[name='email']").addEventListener("change", checkValues);
    document.querySelector("select[name='institution']").addEventListener("change", checkValues);
    document.querySelector("#duration").addEventListener("change", checkDuration);
});

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

function checkValues() {
    const name = document.querySelector("input[name='name']").value;
    const email = document.querySelector("input[name='email']").value;
    const inst = document.querySelector("select[name='institution']").value;

    if (name.trim() != "" && email.trim() != "" && inst.trim() != "n/a") {
        document.querySelector("#submit").removeAttribute("disabled");
    } else {
        document.querySelector("#submit").setAttribute("disabled", true);
    }
}

function saveValues(){
    
}

window.check = checkValues;
