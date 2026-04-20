"use strict";

/**
 * Base class for custom HTML elements.
 * Extends HTMLElement with shadow DOM support, template cloning,
 * DOM detection, and convenience methods for visibility, querying, and events.
 * Subclasses may implement a `ready()` method which will be called once the page has loaded.
 */
class WidgetElement extends HTMLElement {

    /**
     * Initialize the element using a named template.
     * @param {string} templateId - ID of the <template> element to clone.
     * @param {object} settings
     * @param {boolean} [settings.shadowroot=true] - If true, attach template as a shadow root.
     */
    constructor(templateId, settings) {
        super();
        if (!templateId) return;

        settings = settings || { shadowroot: true };
        if (settings.shadowroot) this.shadowTemplate(templateId);
        else this.copyTemplate(templateId);
    }

    /**
     * Invoked each time the element is appended into a document-connected element.
     * Detects DOM children into this.dom, then calls ready() once the page has loaded.
     * If the page is already loaded, ready() is called immediately.
     */
    async connectedCallback() {
        this.detectDOM();
        if (typeof this.ready === "function") {
            if (document.readyState === "complete") await this.ready();
            else window.addEventListener("load", async () => await this.ready(), { once: true });
        }
    }

    /**
     * Move elements from outside this element into an inner target.
     * If no selector is given, all child nodes are moved.
     * @param {string} selector - Query selector for elements to move. If falsy, moves all child nodes.
     * @param {Element|string} [innerTarget=this.shadowRoot] - Destination element or selector string.
     * @returns {NodeList|null} Moved elements, or null if all child nodes were moved.
     */
    internalize(selector, innerTarget = this.shadowRoot) {
        if (typeof innerTarget === "string") {
            innerTarget = this.querySelector(innerTarget);
        }

        if (!selector) {
            // Snapshot childNodes first — it's a live list and would shift as nodes are removed
            for (const node of [...this.childNodes]) {
                this.removeChild(node);
                innerTarget.append(node);
            }
            return null;
        }

        const outerSelection = this.outerSelectorAll(selector);

        for (let item of outerSelection) {
            item.detach();
            innerTarget.append(item);
        }

        return outerSelection;
    }

    /**
     * Scan all child elements with an ID and map them to this.dom using camelCase keys.
     * e.g. <div id="submit-button"> becomes this.dom.submitButton
     * @returns {object} The populated this.dom map.
     */
    detectDOM() {
        this.dom = {};
        for (const element of this.querySelectorAll("[id]")) {
            this.dom[convertToCamel(element.id)] = element;
        }
        return this.dom;
    }

    /**
     * Collect all data-* attributes on this element into a Map.
     * @returns {Map<string, string>} Map of attribute names (without "data-" prefix) to values.
     */
    dataAttributes() {
        let map = new Map();
        for (let attr of this.attributes) {
            if (attr.name.startsWith("data-")) {
                let name = attr.name.slice(5);
                map.set(name, attr.value)
            }
        }
        return map;
    }

    /**
     * Clone the named template and attach it as a shadow root.
     * No-ops if a shadow root already exists.
     * @param {string} templateId - ID of the <template> element to clone.
     */
    shadowTemplate(templateId) {
        if (this.shadowRoot !== null) return;
        let template = document.getElementById(templateId);
        this.checkTemplate(template, templateId);
        const content = template.content.cloneNode(true);
        this.attachShadow({ mode: "open" }).appendChild(content);
    }

    /**
     * Clone the named template and append its children directly into this element.
     * Children with tag <default-attributes> are treated as attribute defaults, not appended.
     * @param {string} templateId - ID of the <template> element to clone.
     */
    copyTemplate(templateId) {
        let template = document.getElementById(templateId);
        this.checkTemplate(template, templateId);
        const content = template.content.cloneNode(true);
        const children = Array.from(content.childNodes);

        children.forEach(ele => {
            if (ele.tagName) {
                switch (ele.tagName.toLowerCase()) {
                    case "default-attributes":
                        // Apply attributes from this node as defaults (won't overwrite existing attributes)
                        this.copyAttributes(ele);
                        break;
                    default:
                        this.appendChild(ele);
                        break;
                }
            }
        });
    }

    /**
     * Copy attributes from one element onto this element.
     * Skips any attribute that is already set on this element.
     * @param {Element} from - Element to copy attributes from.
     */
    copyAttributes(from) {
        for (const attr of from.attributes) {
            if (this.getAttribute(attr.nodeName)) continue;
            this.setAttribute(attr.nodeName, attr.nodeValue);
        }
    }

    /**
     * Assert that a template element exists and is a <template> tag.
     * Throws a descriptive error if either condition fails.
     * @param {Element|null} template - The element returned by getElementById.
     * @param {string} templateId - The ID that was looked up (used in error messages).
     */
    checkTemplate(template, templateId) {
        if (!template) {
            throw new Error(
                "Template '" +
                templateId +
                "' not found\n" +
                "Has the .ejs directive been added to the source file?\n" +
                "<%- include('../partials/widget-templates'); %>"
            );
        }

        if (template.tagName.toUpperCase() !== "TEMPLATE") {
            throw new Error("Element with id '" + templateId + "' is not a template.");
        }
    }

    /**
     * Get the visibility state of this element based on CSS classes.
     * @returns {boolean|undefined} true if visible, false if hidden, undefined if neither or both classes are present.
     */
    get visible() {
        const v = this.classList.contains(WidgetElement.VISIBLE_CLASS) === true;
        const h = this.classList.contains(WidgetElement.HIDDEN_CLASS) === true;

        if (v && !h) return true;
        if (h && !v) return false;
        return undefined;
    }

    /**
     * Show or hide this element.
     * @param {boolean} value
     */
    set visible(value) {
        if (value) this.show();
        else this.hide();
    }

    /**
     * Show this element by swapping CSS classes.
     */
    show() {
        this.classList.remove(WidgetElement.HIDDEN_CLASS);
        this.classList.add(WidgetElement.VISIBLE_CLASS);
    }

    /**
     * Hide this element by swapping CSS classes.
     */
    hide() {
        this.classList.remove(WidgetElement.VISIBLE_CLASS);
        this.classList.add(WidgetElement.HIDDEN_CLASS);
    }

    /**
     * Set the disabled attribute on this element.
     * @param {boolean} value
     */
    set disabled(value) {
        this.setAttribute(WidgetElement.DISABLED_ATTRIBUTE, value);
    }

    /**
     * Get the disabled attribute on this element.
     * Returns false if the attribute is not present.
     * @returns {boolean|string}
     */
    get disabled() {
        if (!this.hasAttribute(WidgetElement.DISABLED_ATTRIBUTE)) return false;
        return this.getAttribute(WidgetElement.DISABLED_ATTRIBUTE);
    }

    /**
     * Check whether this element is under the mouse at the time of an event.
     * Walks up the DOM from the point under the cursor to check for this element.
     * @param {MouseEvent} event
     * @returns {boolean}
     */
    isUnderMouse(event) {
        let x = event.clientX;
        let y = event.clientY;
        let current = document.elementFromPoint(x, y);

        while (current) {
            if (current === this) return true;
            current = current.parentElement;
        }
        return false;
    }

    /**
     * querySelector on the element itself, bypassing any shadow root override.
     * @param {string} selectors
     * @returns {Element|null}
     */
    outerSelector(selectors) {
        return super.querySelector(selectors);
    }

    /**
     * querySelectorAll on the element itself, bypassing any shadow root override.
     * @param {string} selectors
     * @returns {NodeList}
     */
    outerSelectorAll(selectors) {
        return super.querySelectorAll(selectors);
    }

    /**
     * querySelector scoped to the shadow root if present, otherwise the element itself.
     * @param {string} selectors
     * @returns {Element|null}
     */
    querySelector(selectors) {
        if (this.shadowRoot) {
            return this.shadowRoot.querySelector(selectors);
        } else {
            return super.querySelector(selectors);
        }
    }

    /**
     * querySelectorAll scoped to the shadow root if present, otherwise the element itself.
     * @param {string} selectors
     * @returns {NodeList}
     */
    querySelectorAll(selectors) {
        if (this.shadowRoot) {
            return this.shadowRoot.querySelectorAll(selectors);
        } else {
            return super.querySelectorAll(selectors);
        }
    }

    /**
     * Remove this element from its parent.
     * @returns {Element} This element.
     */
    detach() {
        return this.parentNode.removeChild(this);
    }

    /**
     * Get the index of this element among its siblings.
     * @returns {number}
     */
    index() {
        return Array.from(this.parentElement.children).indexOf(this);
    }

    /**
     * Walk up the DOM tree, crossing shadow root boundaries, to find the closest ancestor matching a selector.
     * Unlike Element.closest(), this will pierce shadow roots by following host elements.
     * @param {string} selector
     * @returns {Element|null} The closest matching ancestor, or null if none found.
     */
    closestParent(selector) {
        let el = this;
        while (el && el !== document && el !== window) {
            const found = el.closest(selector);
            if (found) return found;
            el = el.getRootNode().host;
        }
        return null;
    }

    /**
     * Dispatch a custom event from this element.
     * Defaults to composed:true and bubbles:true so events cross shadow root boundaries.
     * @param {string|Event} event_name - Event name string, or a pre-built Event object.
     * @param {object} [options={}] - EventInit options, merged over the defaults.
     */
    dispatchEvent(event_name, options = {}) {
        // composed:true allows the event to cross shadow DOM boundaries
        // bubbles:true allows it to propagate up the DOM tree
        options = { composed: true, bubbles: true, ...options };
        if (typeof event_name === "string") super.dispatchEvent(new CustomEvent(event_name, options));
        else super.dispatchEvent(event_name);
    }
}

/**
 * Convert a string to a delimited format (e.g. kebab-case).
 * Handles mixed cases, spaces, underscores, and existing delimiters.
 * @param {string} string
 * @param {string} [delimiter="-"]
 * @returns {string}
 */
function convertDelimited(string, delimiter = `-`) {
    string = string.trim();
    string = string.charAt(0).toLocaleLowerCase() + string.slice(1);
    string = string.replace(/[_ -]+/g, delimiter);

    const r1 = RegExp(`[${delimiter}]([A-Z]+)`, `g`);
    string = string.replace(r1, `$1`);
    string = string.replace(/([A-Z]+)/g, `${delimiter}$1`).toLowerCase();

    const r2 = RegExp(`^[${delimiter}]+`);
    string = string.replace(r2, ``);

    return string;
}

/**
 * Convert a delimited or mixed-case string to camelCase.
 * e.g. "submit-button" -> "submitButton", "my_field" -> "myField"
 * @param {string} string
 * @returns {string}
 */
function convertToCamel(string) {
    string = convertDelimited(string, `-`);
    string = string.replace(/(-[a-z])+/g, v => v.toUpperCase());
    string = string.replace(/-+/g, ``);
    string = string.charAt(0).toLowerCase() + string.slice(1);
    return string;
}

WidgetElement.DISABLED_ATTRIBUTE = "widget-disabled";
WidgetElement.HIDDEN_CLASS = "hidden";
WidgetElement.VISIBLE_CLASS = "visible";

if (!window.customElements.get("widget-element")) {
    window.customElements.define("widget-element", WidgetElement);
}

export default WidgetElement;