import WidgetElement from "../WidgetElement.mjs";

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
        `${data.start_date} to ${data.end_date}\n` +
        `Returning to work on ${data.return_date}\n` +
        `Total weekdays: ${data.weekday_count}\n\n` +
        `Managers have been notified\n` +
        `You will receive a confirmation email`;
    }
}

window.customElements.define('submit-popup', SubmitPopup);
export default SubmitPopup;