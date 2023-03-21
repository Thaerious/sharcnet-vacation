import WidgetElement from "../WidgetElement.mjs";

class IdleThrobber extends WidgetElement {

    constructor() {
        super("idle-throbber-template");
    }

    show(message){
        this.classList.remove("hidden");
        this.querySelector("#message").innerText = message;
    }

    hide(){
        this.classList.add("hidden");
    }
}

window.customElements.define('idle-throbber', IdleThrobber);
export default IdleThrobber;