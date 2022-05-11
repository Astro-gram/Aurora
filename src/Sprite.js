export default class Sprite {
    #x
    #y
    #spriteSheet
    #framerate
    #frameBounds
    #animations
    #currentAnimation
    #imagesheet

    static numberOfSprites = 0;

    /**
     * @param {Object} spriteSheet 
     * @param {String} animation 
     */

    constructor(spriteSheet, animation) {
        this.#spriteSheet = spriteSheet;

        this.#framerate = spriteSheet.framerate;
        this.#frameBounds = spriteSheet.frameBounds;
        this.#animations = spriteSheet.animations;

        this.#imagesheet = spriteSheet.images;

        this.#currentAnimation = animation;

        Sprite.numberOfSprites++;

        this.#x = 0;
        this.#y = 0;
    }

    get getBounds() {
        return {
            x: this.#x,
            y: this.#y,
            width: this.#frameBounds.width,
            height: this.#frameBounds.height
        }
    }
}