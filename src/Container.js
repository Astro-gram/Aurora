import { checkPropTypes } from "./utils.js";

export default class Container {
    #props

    /**
     * @param  {...any} props
     * @description Group multiple props into a container
     */

    constructor(...props) {
        this.#props = checkPropTypes(props, "Container", ["Container"]);

        this.x = 0;
        this.y = 0;
        this.rotationInRadians = false;
        
        this.anchor = {
            x: 0,
            y: 0,
        }

        this.rotation = 0;
    }

    get props() {
        return this.#props;
    }

    get center() {
        let bounds = this.bounds;

        return {
            x: bounds.x + Math.floor(bounds.width / 2),
            y: bounds.y + Math.floor(bounds.height/ 2)
        }
    }

    get bounds() {
        let bound = {
            lowestX: null,
            lowestY: null,
            highestX: null,
            highestY: null,
        };

        if (this.#props.length <= 0) return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };

        const getLowestX = (prev, current) => {
            return current.x > prev.x ? prev : current;
        };

        const getHighestX = (prev, current) => {
            const currentSpot = current.x + current.width + current.strokeWidth;
            const prevSpot = prev.x + prev.width + prev.strokeWidth;

            return currentSpot > prevSpot ? current : prev;
        };

        const getLowestY = (prev, current) => {
            return current.y > prev.y ? prev : current;
        };

        const getHighestY = (prev, current) => {
            const currentSpot = current.y + current.height + current.strokeWidth;
            const prevSpot = prev.y + prev.height + prev.strokeWidth;

            return currentSpot > prevSpot ? current : prev;
        };

        bound.lowestX = this.#props.reduce(getLowestX);
        bound.highestX = this.#props.reduce(getHighestX);
        bound.lowestY = this.#props.reduce(getLowestY);
        bound.highestY = this.#props.reduce(getHighestY);

        let extraWidth = bound.highestX.width;
        let extraHeight = bound.highestY.height;

        extraWidth += Math.floor((bound.highestX.strokeWidth + bound.lowestX.strokeWidth) / 2);
        extraHeight += Math.floor((bound.highestY.strokeWidth + bound.lowestY.strokeWidth) / 2);

        let realignX = Math.floor(bound.lowestX.strokeWidth / 2);
        let realignY = Math.floor(bound.lowestY.strokeWidth / 2);

        if (bound.lowestX.type === "circle") {
            extraWidth += bound.lowestX.height;
            realignX += bound.lowestX.width;
        }

        if (bound.lowestY.type === "circle") {
            extraHeight += bound.lowestY.height;
            realignY += bound.lowestY.height;
        }

        console.log(bound)

        return {
            x: bound.lowestX.x - realignX + this.x,
            y: bound.lowestY.y - realignY + this.y,
            width: bound.highestX.x - bound.lowestX.x + extraWidth,
            height: bound.highestY.y - bound.lowestY.y + extraHeight,
        };
    }

    /**
     * @param {...any}
     * @description Add props to this container
     */

    addProp(...props) {
        this.#props = [...this.#props, ...checkPropTypes(props, "Container")];
    }

    /**
     * @private
     */

    async _process() {
        for (let i = 0; i < this.#props.length; i++) {
            await this.#props[i]._process();
        }
    }

    /**
     * @private
     */

    _print(ctx) {
        for (let i = 0; i < this.#props.length; i++) {
            let prop = this.#props[i];

            prop.x += this.x;
            prop.y += this.y;

            prop.anchor.x = this.anchor.x;
            prop.anchor.y = this.anchor.y;
            prop.rotation = this.rotation;
            prop.rotationInRadians = this.rotationInRadians;

            prop._print(ctx);

            prop.x -= this.x;
            prop.y -= this.y;
        }
    }
}