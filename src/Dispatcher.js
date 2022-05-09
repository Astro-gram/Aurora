export default class Dispatcher {
    #events

    constructor() {
        this.#events = {};
    }

    /**
     * @param {String} event 
     * @param {Function} cb 
     */

    on(event, cb) {
        if (event in this.#events) return;

        this.#events[event] = {
            cb,
            calls: 0,
        };
    }


    /**
     * @param {String} event 
     * @param {*} data 
     */

    dispatch(event, data = null) {
        if (!(event in this.#events)) return;

        const cb = this.#events[event].cb;
        this.#events[event].calls++;
        cb(data);
    }

    /**
     * @param {String} event 
     */

    remove(event) {
        if (!(event in this.#events)) return;

        delete this.#events[event];
    }

    /**
     * @param {String} event 
     */

    eventCalls(event) {
        if (!(event in this.#events)) return;

        return this.#events[event].calls;
    }
}