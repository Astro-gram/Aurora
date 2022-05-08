export default class Loader {
    #srcMap
    #convertedSrcMap
    #processed

    constructor(srcMap, parentFolder) {
        this.#srcMap = srcMap;
        this.parentFolder = parentFolder;
        this.#convertedSrcMap = [];
        this.#processed = false;
    }

    get srcMap() {
        return this.#srcMap;
    }

    get processed() {
        return this.#processed;
    }

    getImage(id) {
        if (!this.#processed) {
            console.error("Images have not been processed yet.");
            return;
        }

        const image = this.#convertedSrcMap.filter(src => src.id === id);

        if (image.length === 0) {
            console.error("Image Not Found...");
            return;
        }

        return image[0].src;
    }

    async process() {
        for (let i = 0; i < this.srcMap.length; i++) {
            this.#convertedSrcMap.push({
                src: await this.#createBitmap(this.srcMap[i].src),
                id: this.srcMap[i].id
            })
        }

        this.#processed = true;
    }

    async #createBitmap(imageSrc) {
        return new Promise(res => {
            let image = new Image();
            image.src = imageSrc;

            image.onload = () => {
                createImageBitmap(image).then((bitmap) => {
                    res(bitmap);
                })
            }
        })
    }
}