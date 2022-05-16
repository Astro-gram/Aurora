export default class Images {
    #srcMap

    /**
     * @param {Object} srcMap
     */

    constructor(srcMap) {
        this.#srcMap = srcMap;
    }

    get srcMap() {
        return this.#srcMap;
    }

    /**
     * @param {String} id
     * @returns {String}
     */

    getImage(id) {
        const image = this.#srcMap.filter(src => src.id === id);

        if (image.length === 0) {
            console.warn("Image Not Found...");
            return;
        }

        return image[0].src;
    }

    /**
     * @param {String} id
     */

    removeImage(id) {
        const image = this.#srcMap.filter(src => src.id === id);

        if (image.length === 0) {
            console.warn("Image Not Found...");
            return;
        }

        delete image[0];
    }

    /**
     * @param {String} src 
     * @param {String} id 
     */

    addImage(src, id) {
        if (this.#srcMap.filter(image => image.id === id).length > 0) console.warn(`Image ID: '${id}' duplicated.`);

        this.#srcMap.push({
            src,
            id
        });
    }
}