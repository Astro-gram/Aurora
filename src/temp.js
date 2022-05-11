async process() {
    for (let i = 0; i < this.srcMap.length; i++) {
        this.#convertedSrcMap.push({
            src: await this.#createBitmap(this.srcMap[i].src),
            id: this.srcMap[i].id
        })
    }

    this.#processed = true;
    dispatcher.dispatch("sys:loaderComplete");
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