//This is going to wrap all of the classes & functions into 1 object which can be imported.

import Stage from "./Stage.js";
import Images from "./Images.js";
import Dispatcher from "./Dispatcher.js";
import Sound from "./Sound.js";
import Container from "./Container.js";
import Text from "./Text.js";
import Utils from "./utils/Utils.js";

//Graphics
import Static from "./graphics/Static.js";
import Shape from "./graphics/Shape.js";

/**
 * import Sprite from "./graphics/Sprite.js";
 * NOT FINISHED
 */

const dispatcher = new Dispatcher();
window.dispatcher = dispatcher;

export default {
    Stage,
    Images,
    Sound,
    Container,
    Static,
    Shape,
    Text,
    Utils,
    dispatcher
};