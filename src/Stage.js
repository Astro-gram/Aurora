export default class Stage {
    #props
    #running
    #propsAdded
    #tick
    #requestID
    #paused
    #ctx
    #canvas
    #bounds

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
        this.#tick = null;
        this.#requestID = null;
        this.#paused = false;

        this.#bounds = this.#setBounds();

        this.#watchBounds();

        Stage.stageCreated = true;
    }

    get paused() {
        return this.#paused;
    }

    get bounds() {
        return this.#bounds;
    }

    #setBounds() {
        const canvasRect = this.#canvas.getBoundingClientRect();
        
        return {
            x: canvasRect.x,
            y: canvasRect.y,
            width: this.#canvas.width,
            height: this.#canvas.height
        }
    }

    #watchBounds() {
        window.addEventListener("resize", () => {
            this.#bounds = this.#setBounds();
        })
    }

    #canvasInit(name, bounds, parent) {
        const canvas = document.createElement("canvas");
        canvas.classList.add(name);

        canvas.width = bounds.width;
        canvas.height = bounds.height;

        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");

        document.querySelector(parent).appendChild(canvas);
    }

    /**
     * @param {String} event 
     * @param {Function} cb 
     */

    addEventListener(event, cb) {
        this.#canvas.addEventListener(event, cb);
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
    }

    async #onPropsProcessed(props) {
        this.#props = [...this.#props, ...props];
        dispatcher.dispatch("sys:propsProcessed", props);
    }

    async #processAllProps(props) {
        for (let i = 0; i < props.length; i++) {
            await props[i]._process();
        }
    }

    /**
     * @param {Function} tick Function that is called each tick
     * @description Starts painting onto the canvas with requestAnimationFrame
     */

    start(tick) {
        if (this.#running) {
            console.warn("Aurora is already running.");
            return;
        }

        if (!this.#propsAdded) {
            console.warn("No props have been added to the stage.");
            return;
        }

        this.#tick = tick;

        this.#requestID = window.requestAnimationFrame(tick);

        this.#running = true;
    }

    nextFrame() {
        if (!this.#running) {
            console.warn("Aurora has not been started yet.");
            return;
        }

        this.#ctx.clearRect(0, 0, this.bounds.width, this.bounds.height);

        this.#props.forEach(prop => {
            prop._print(this.#ctx);
        });

        this.#requestID = window.requestAnimationFrame(this.#tick);
    }

    pause() {
        if (!this.#running) {
            console.warn("Aurora has not been started yet.");
            return;
        }

        if (this.#paused) {
            this.#requestID = window.requestAnimationFrame(this.#tick);
        }
        else {
            window.cancelAnimationFrame(this.#requestID);
        }

        this.#paused = !this.#paused;
    }
}