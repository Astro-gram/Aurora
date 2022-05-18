import { checkPropTypes } from "./utils.js";

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
     * @description This is equalivent to the root of Aurora. All animations, canvas properties, and props are stored and used here.
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

    get propCount() {
        return this.#props.length;
    }

    get props() {
        return this.#props;
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
     * @param {*} props
     * @description Add props into the view on the canvas
     */

    addProp(...props) {
        return new Promise(resolve => {
            let usedProps = checkPropTypes(props, "Stage");

            this.#propsAdded = true;

            this.#processAllProps(usedProps).then(() => this.#onPropsProcessed(usedProps, resolve));
        })
    }

    /**
     * @param {*} prop 
     * @description Removes prop from the stage
     */

    deleteProp(prop) {
        if (!this.#props.includes(prop)) {
            console.warn(`Prop: '${prop.constructor.name}' has been added to stage.`)
            return;
        }

        delete this.#props[this.#props.indexOf(prop)];
    }

    /**
     * @description Removes all props from the stage
     */

    deleteAllProps() {
        this.#props = [];
    }

    /**
     * @param {*} prop 
     * @returns returns true if prop has been added to the stage; returns false if not
     */

    hasProp(prop) {
        return !!(this.#props.includes(prop));
    }

    async #onPropsProcessed(props, resolve) {
        this.#props = [...this.#props, ...props];
        dispatcher.dispatch("sys:propsProcessed", props);
        resolve();
    }

    async #processAllProps(props) {
        for (let i = 0; i < props.length; i++) {
            if (props[i].noProcess) continue;
            await props[i]._process();
        }
    }

    //MICS

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height
     * @description Get the canvas image data
     * @returns {ImageData}
     */

    getStageImageData(x, y, width, height) {
        return this.#ctx.getImageData(x, y, width, height);
    }

    /**
     * @param {Function} cb 
     * @param {Number} debounce Add bounce between each resize event to prevent visual bugs
     * @description Watch for window resizing. Will set the canvas width & height to the windows
     */

    watchResize(cb = null, debounce = 10) {
        window.addEventListener("resize", this.#debounce(() => {
            if (!this.#running) return;

            this.setDimensions(window.innerWidth, window.innerHeight);

            if (cb !== null) cb({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }, debounce));
    }

    /**
     * @param {Number} width 
     * @param {Number} height
     * @description get the width and height of the canvas element
     */

    setDimensions(width, height) {
        this.#canvas.width = width;
        this.#canvas.height = height;
    }

    /**
     * @param {String} event 
     * @param {Function} cb
     * @description Add a regular event listener to the canvas element (click, mousemove, etc.)
     */

    addEventListener(event, cb) {
        this.#canvas.addEventListener(event, cb);
    }

    #debounce(func, wait, immediate) {
        let timeout;
        return function() {
            let context = this;
            let args = arguments;

            let later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };

            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    //ANIMATION SYSTEM

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

    /**
     * @description Run next frame in animation
     */

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

    /**
     * @description Pause/unpause animation
     */

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

    /**
     * @description Stops animation and resets stage to a state as if it was never ran (meaning that all props will stay but it will stop running)
     */

    kill() {
        if (!this.#running) {
            console.warn("Aurora has not been started yet.");
            return;
        }
        
        window.cancelAnimationFrame(this.#requestID);

        this.#running = false;
        this.#paused = false;
        this.tick = null;
        this.#requestID = null;
    }
}