export default class Static {
    #src
    #loaded
    #bitmap
    #convertedFilters
    #dimensions
    #filters

    /**
     * @param {String} src 
     * @param {Object} position
     */

    constructor(src, position) {
        this.#src = src;
        this.x = position.x;
        this.y = position.y;

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

        this.#loaded = false;
        this.#bitmap = null;

        this.#dimensions = {};
    }

    get loaded() {
        return this.#loaded;
    }

    get filters() {
        return this.#filters;
    }

    get bounds() {
        return {
            width: this.#dimensions.width,
            height: this.#dimensions.height,
            x: this.x,
            y: this.y
        };
    }

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

                    res();
                })
            }
        })
    }

    _print(ctx) {
        if (!this.#loaded) {
            console.error("Interal Error: Images never got processed.");
            return;
        }

        ctx.filter = this.#convertedFilters;
        ctx.drawImage(this.#bitmap, this.x, this.y);
        ctx.filter = "none";
    }
}