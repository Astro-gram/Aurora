//This is going to wrap all of the classes & functions into 1 object which can be imported.

import Stage from "./Stage.js";
import Images from "./Images.js";
import Sprite from "./Sprite.js";
import Dispatcher from "./Dispatcher.js";
import Static from "./Static.js";

import { Sound } from "./Sound.js";

const dispatcher = new Dispatcher();

window.dispatcher = dispatcher;

export default {
    Stage,
    Images,
    Sprite,
    Sound,
    Static,
    dispatcher
};