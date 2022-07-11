
window.addEventListener("load", ()=>{
    const today = new Date().toISOString().split("T")[0];
    document.querySelector("#start_date").setAttribute("value", today);
    document.querySelector("#end_date").setAttribute("value", today);
});