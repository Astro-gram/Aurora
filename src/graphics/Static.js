export default class Static {
    #src
    #loaded
    #bitmap
    #dimensions
    #filters
    #convertedFilters
    #promiseFunc

    /**
     * @param {String} src 
     * @param {Object} position
     * @description Draw static images onto the stage.
     */

    constructor(src, position) {
        this.#src = src;
        this.x = position.x;
        this.y = position.y;

        this.anchor = {
            x: this.x,
            y: this.y
        };

        this.#loaded = false;
        this.#bitmap = null;

        this.#dimensions = {};

        this.id = null;

        this.rotationInRadians = false;
        this.rotation = 0;

        this.#promiseFunc = null;

        this.#filters = {
            blur: "none",
            brightness: "none",
            contrast: "none",
            drowShadow: "none",
            grayscale: "none",
            hueRotate: "none",
            invert: "none",
            opacity: "none",
            saturate: "none",
            sepia: "none"
        };

        this.#convertedFilters = this.#convertFiltersToString(this.filters);
    }

    get loaded() {
        return this.#loaded;
    }

    get bounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.#dimensions.width,
            height: this.#dimensions.height,
        };
    }

    get filters() {
        return this.#filters;
    }

    get convertedFilters() {
        return this.#convertedFilters;
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
        if (!this.#loaded) {
            this.#promiseFunc = this.anchorCenter;
            return;
        }

        this.anchor.x = this.x + Math.floor(this.#dimensions.width / 2);
        this.anchor.y = this.y + Math.floor(this.#dimensions.height / 2);
    }

    /**
     * @param {any} prop
     * @description Anchor to another prop
     */

    anchorProp(prop) {
        const otherProp = checkPropTypes([prop], "Static");

        if (otherProp.length <= 0) return;

        this.anchor.x = otherProp[0].x;
        this.anchor.y = otherProp[0].y;
    }

    /**
     * @param {String} name blur, sepia, invert, etc.
     * @param {String} value 0-100% or 0-infinity pixels
     * @description Set canvas filters onto image
     */

    setFilter(name, value) {
        if (!(name in this.#filters)) {
            console.warn(`Filter '${name}' is not found. Please check spelling.`);
            return;
        }

        this.#filters[name] = value;

        this.#convertedFilters = this.#convertFiltersToString(this.filters);

        return this; //Allows for function stacking
    }

    #convertFiltersToString() {
        const filters = Object.keys(this.filters);
        const values = Object.values(this.filters);

        let filterString = "";
        
        for (let i = 0; i < filters.length; i++) {
            if (values[i] === "none") continue;

            filters[i] = this.#convertFilterToCanvasFormat(filters[i]) || filters[i];

            filterString += filters[i] + `(${values[i]}) `;

            if (i === filters.length - 1) continue;

            filterString.substring(0, filterString.length - 1); //Removes extra space from the back of the string
        }

        return filterString;
    }

    #convertFilterToCanvasFormat(str) {
        if (!/[A-Z]/.test(str)) return;

        const upperCasePosition = str.search(/[A-Z]/);

        return str.replace(/[A-Z]/, `-${str[upperCasePosition].toLowerCase()}`)
    }

    /**
     * @private
     */

    async _process() {
        return new Promise(res => {
            let image = new Image();

            image.src = this.#src;
    
            image.onload = () => {
                this.#dimensions.width = image.width;
                this.#dimensions.height = image.height;

                createImageBitmap(image).then((bitmap) => {
                    this.#loaded = true;
                    this.#bitmap = bitmap;

                    if (this.#promiseFunc !== null) this.#promiseFunc();
                    res();
                })
            }
        })
    }

    /**
     * @private
     */

    _print(ctx) {
        if (!this.#loaded) {
            console.error("Interal Error: Image never got processed.");
            return;
        }

        ctx.filter = this.convertedFilters;
        ctx.translate(this.anchor.x, this.anchor.y);
        ctx.rotate(this.rotationInRadians ? this.rotation : this.rotation * Math.PI / 180);

        ctx.drawImage(this.#bitmap, this.x - this.anchor.x, this.y - this.anchor.y);
        ctx.filter = "none";

        ctx.setTransform([1, 0, 0, 1, 0, 0]);
    }
}