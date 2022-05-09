export default class Stage {
    static stageCreated = false;

    /**
     * @param {String} name 
     * @param {Object} bounds 
     * @param {String} parent 
     */

    constructor(name, bounds, parent = "body") {
        if (Stage.stageCreated) {
            console.error("Stage is already created.");
            return;
        }

        this.#canvasInit(name, bounds, parent);

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
}