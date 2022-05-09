class Sound {
    #instantiatedOnce

    /**
     * @param {Object} audioMap 
     */
    constructor(audioMap) {
        this.audioMap = audioMap;
        this.#instantiatedOnce = false;
    }

    /**
     * @param {String} id 
     */

    play(id) {
        console.log(this.audioMap[id])

        const audio = new Audio(this.audioMap[id]);
        audio.play();
    }

    /**
     * @param {String} id 
     * @param {Boolean} loop 
     * @param {Boolean} instantiateOnce 
     */

    playBackground(id, loop, instantiateOnce = false) {
        if (instantiateOnce && this.#instantiatedOnce) return;

        const audio = new Audio(this.audioMap[id]);
        audio.loop = loop;
        audio.play().catch((err) => {
            console.error(err + "\n\nA common way to solve this problem is to make a start screen with a play button.");
        });

        this.#instantiatedOnce = true;
    }
}

export { Sound };