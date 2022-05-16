export default class Text {
    #width

    constructor(text, font, color, fontSize) {
        this.text = text;
        this.font = font;
        this.fontSize = fontSize;
        this.color = color;

        this.stroke = false;
        this.fill = true;

        this.strokeWidth = 1;

        this.textAlign = "start";
        this.textBaseline = "alphabetic";

        this.x = 0;
        this.y = 0;
    }

    get metrics() {
        const ctx = document.createElement("canvas").getContext("2d");
        ctx.font = this.processedFont;
        return ctx.measureText(this.text);
    }

    get processedFont() {
        return `${this.fontSize.toString()}px ${this.font}`;
    }

    /**
     * @private
     */

    _process() {
        if (this.text === undefined) {
            console.warn("Empty text detected.");
        }
    }

    /**
     * @private
     */

    _print(ctx) {
        ctx.save();

        ctx.font = this.processedFont;

        ctx.lineWidth = this.strokeWidth;

        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;

        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;

        if (this.stroke) ctx.strokeText(this.text, this.x, this.y);
        if (this.fill) ctx.fillText(this.text, this.x, this.y);

        ctx.restore();
    }
}