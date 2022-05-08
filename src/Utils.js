class Sound {
    constructor(audioMap) {
        this.audioMap = audioMap;
    }

    play(id) {
        console.log(this.audioMap[id])

        const audio = new Audio(this.audioMap[id]);
        try {
            audio.play();
        }
        catch {
            audio.play();
        }
    }
}

export { Sound };