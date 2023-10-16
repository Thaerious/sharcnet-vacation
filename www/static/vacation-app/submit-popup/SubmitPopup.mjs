import WidgetElement from "../WidgetElement.mjs";

class SubmitPopup extends WidgetElement {

    constructor() {
        super("submit-popup-template");
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.dom.okButton.addEventListener("click", ()=> this.hide());
    }

    show(data){
        super.show();
        this.classList.remove("hidden");
        this.querySelector("#message").innerText = this.buildMessage(data);
    }

    buildMessage(data) {
        if (data.weekday_count == 1) {
            return `Vacation Request Submitted\n` +
                `For ${data.start_date}\n` +
                `Total weekdays: ${data.weekday_count}\n\n` +
                `Managers have been notified\n` +
                `You will receive a confirmation email`;
        }

        if (data.duration === 'full') {
            return `Vacation Request Submitted\n` +
                `From ${data.start_date} to ${data.end_date}\n` +
                `Returning to work on ${data.return_date}\n` +
                `Total weekdays: ${data.weekday_count}\n\n` +
                `Managers have been notified\n` +
                `You will receive a confirmation email`;
        }

        if (data.duration === 'am') {
            return `Vacation Request Submitted\n` +
                `Morning of ${data.start_date}\n` +
                `Total weekdays: ${data.weekday_count}\n\n` +
                `Managers have been notified\n` +
                `You will receive a confirmation email`;
        }

        if (data.duration === 'pm') {
            return `Vacation Request Submitted\n` +
                `Afternoon of ${data.start_date}\n` +
                `Total weekdays: ${data.weekday_count}\n\n` +
                `Managers have been notified\n` +
                `You will receive a confirmation email`;
        }
    }
}

window.customElements.define('submit-popup', SubmitPopup);
export default SubmitPopup;