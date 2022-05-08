export default class Stage {
    constructor(name, bounds, parent = "body") {
        this.#canvasInit(name, bounds, parent);
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
}