
window.addEventListener("load", ()=>{
    const today = new Date().toISOString().split("T")[0];
    console.log(today); 

    document.querySelector("#start_date").setAttribute("value", today);
    document.querySelector("#end_date").setAttribute("value", today);
});