import WidgetElement from "@html-widget/core";

class SubmitPopup extends WidgetElement {

    constructor() {
        super("submit-popup-template");
    }

    async connectedCallback() {
        await super.connectedCallback();
        console.log(this.dom);
        this.dom.okButton.addEventListener("click", ()=> this.hide());
    }

    show(data){
        super.show();
        this.classList.remove("hidden");
        this.querySelector("#message").innerText = this.buildMessage(data);
    }

    buildMessage(data){
        console.log(data);
        return `Vacation Request Submitted\n` +
        `Starting on ${data.start_date}\n` +
        `Ending on ${data.end_date}\n` + 
        `Total days ${data.weekday_count}`;
    }
}

window.customElements.define('submit-popup', SubmitPopup);
export default SubmitPopup;