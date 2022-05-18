import { checkPropTypes } from "../utils.js";

export default class Shape {
    #shapeType

    /**
     * @param {String} fillColor 
     * @param {String} strokeColor 
     * @param {Number} strokeWidth
     * @description Draw shapes which can be rotated, moved, and more.
     */

    constructor(fillColor = "black", strokeColor = "black", strokeWidth = 1) {
        this.#shapeType = null;

        this.anchor = {
            x: 0,
            y: 0,
        }

        this.strokeWidth = strokeWidth;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;

        this.stroke = true;
        this.fill = false;

        this.x = 0;
        this.y = 0;

        this.width = 0;
        this.height = 0;
        this.radius = 0;

        this.id = null;

        this.rotation = 0;
        this.rotationInRadians = false;
    }

    get bounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }


    get type() {
        return this.#shapeType;
    }

    get center() {
        if (this.#shapeType === "circle") return {
            x: this.x,
            y: this.y
        }
        
        else return {
            x: this.x + Math.floor(this.width / 2),
            y: this.y + Math.floor(this.height / 2)
        }

        
    }

    /**
     * @param {Number} anchor
     * @description Anchor x and y to the same value
     */

    anchorAll(anchor) {
        this.anchor.x = anchor;
        this.anchor.y = anchor;
    }

    /**
     * @description Anchor to the center of the shape
     */

    anchorCenter() {
        this.anchor.x = this.x + Math.floor(this.width / 2);
        this.anchor.y = this.y + Math.floor(this.height / 2);
    }

    /**
     * @param {any} prop
     * @description Anchor to another prop
     */

    anchorProp(prop) {
        const otherProp = checkPropTypes([prop], "Shape");

        if (otherProp.length <= 0) return;

        this.anchor.x = otherProp[0].x;
        this.anchor.y = otherProp[0].y;
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} radius
     * @description Draws a circle
     */

    circle(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;

        this.width = radius;
        this.height = radius;

        this.#shapeType = "circle";
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height
     * @description Draws a rectangle
     */

    rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.#shapeType = "rectangle";
    }

    /**
     * @param {Object} data
     * @description Draws a rectangle from a object
     */

    rectFromObject(data) {
        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
        this.height = data.height;

        this.#shapeType = "rectangle";
    }

    /**
     * @param {any} prop
     * @description Get the distances, in pixels, from this prop to another prop
     */

    getDistance(prop) {
        const otherProp = checkPropTypes([prop], "Shape");

        if (otherProp.length <= 0) return;

        return {
            x: otherProp[0].x - this.x,
            y: otherProp[0].y - this.y
        };
    }

    /**
     * @description This is a little time-saving function to flip the current stroke and fill settings. (if fill is true, it will set it to false then set stroke to true and visa-versa)
     */

    flipFillAndStroke() {
        this.stroke = !this.stroke;
        this.fill = !this.fill;
    }

    /**
     * @private
     */

    _process() {
        if (this.#shapeType === null) {
            console.warn("Empty shape detected.");
        }
    }
    
    /**
     * @private
     */

    _print(ctx) {
        if (this.#shapeType === null) {
            return;
        }

        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeColor;

        ctx.beginPath();
        ctx.translate(this.anchor.x, this.anchor.y);
        ctx.rotate(this.rotationInRadians ? this.rotation : this.rotation * Math.PI / 180);

        if (this.#shapeType === "circle") ctx.arc(this.x - this.anchor.x, this.y - this.anchor.y, this.radius, 0, Math.PI * 2);
        else if (this.#shapeType === "rectangle") ctx.rect(this.x - this.anchor.x, this.y - this.anchor.y, this.width, this.height);

        if (this.fill) ctx.fill();
        if (this.stroke) ctx.stroke();

        ctx.setTransform([1, 0, 0, 1, 0, 0]);
    }
}