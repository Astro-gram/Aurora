export default class Stage {
    #props
    #running
    #propsAdded

    static stageCreated = false;

    /**
     * @param {String} name 
     * @param {Object} bounds 
     * @param {String} parent 
     */

    constructor(name, bounds, parent = "body") {
        if (Stage.stageCreated) {
            console.warn("Stage is already created.");
            return;
        }

        this.#canvasInit(name, bounds, parent);

        this.#props = [];
        this.#running = false;
        this.#propsAdded = false;

        Stage.stageCreated = true;
    }

    #canvasInit(name, bounds, parent) {
        const canvas = document.createElement("canvas");
        canvas.classList.add(name);

        canvas.width = bounds.w;
        canvas.height = bounds.h;

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        document.querySelector(parent).appendChild(canvas);
    }

    /**
     * @param {String} event 
     * @param {Function} cb 
     */

    addEventListener(event, cb) {
        this.canvas.addEventListener(event, cb);
    }

    /**
     * @param {*} props 
     */

    addProps(...props) {
        let usedProps = [];

        this.#propsAdded = true;

        //Error checking
        for (let i = 0; i < props.length; i++) {
            const propType = props[i].constructor.name;

            if (propType === "Array" && i === 0) {
                usedProps = props[i];
                break;
            }

            if (propType !== "Static" && propType !== "Sprite") {
                console.warn(`Prop type '${propType}' is not supported.`);
                continue;
            }

            usedProps.push(props[i]);
        }

        this.#props = [...this.#props, ...props];

        this.#processAllProps(usedProps).then(() => this.#onPropsProcessed(usedProps));

        return { then: this.#then };
    }

    #then() {
        console.log("e");
    }

    #onPropsProcessed(props) {
        this.#props = [...this.#props, ...props];
        dispatcher.dispatch("sys:propsProcessed", props);
    }

    async #processAllProps(props) {
        for (let i = 0; i < props.length; i++) {
            await props[i]._process();
        }
    }

    /**
     * @param {Function} tick Function that called each tick
     * @description Starts painting onto the canvas with requestAnimationFrame
     */

    start(tick) {
        if (this.#running) {
            console.warn("Aurora is already running.");
            return;
        }

        if (!this.#propsAdded) {
            console.warn("bad")
        }

        window.requestAnimationFrame(tick);

        this.#running = true;
    }
}