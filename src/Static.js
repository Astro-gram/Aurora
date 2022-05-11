export default class Static {
    #src
    #loaded
    #bitmap
    #filters
    #convertedFilters
    #dimensions

    /**
     * @param {String} src 
     * @param {Object} position 
     * @param {Object} filters 
     */

    constructor(src, position, filters = {}) {
        this.#src = src;
        this.x = position.x;
        this.y = position.y;

        this.#filters = filters;
        this.#convertedFilters = this.#convertFiltersToString(filters);

        this.#loaded = false;
        this.#bitmap = null;

        this.#dimensions = {};
    }

    get loaded() {
        return this.#loaded;
    }

    get bounds() {
        return {
            width: this.#dimensions.width,
            height: this.#dimensions.height,
            x: this.x,
            y: this.y
        };
    }

    #convertFiltersToString() {
        const filters = Object.keys(this.#filters);
        const values = Object.values(this.#filters);

        let filterString = "";
        
        for (let i = 0; i < filters.length; i++) {
            filterString += filters[i] + `(${values[i]}) `;

            if (i === filters.length - 1) continue;

            filterString.substring(0, filterString.length - 1); //Removes extra space from the back of the string
        }

        return filterString;
    }

    async _process() {
        return new Promise(res => {
            let image = new Image();

            image.src = this.#src;

            this.#dimensions.width = image.width;
            this.#dimensions.height = image.height;
    
            image.onload = () => {
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