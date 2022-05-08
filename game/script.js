import Aurora from "../src/Aurora.js";
import * as constants from "./constants.js";

const stage = new Aurora.Stage("game", constants.stageBounds);
const loader = new Aurora.Loader(constants.srcMap, constants.parentFolder);
const sounds = new Aurora.Sound(constants.audioMap);

loader.process().then(() => {
    stage.ctx.drawImage(loader.getImage("backpack"), 10, 10);
})

sounds.play("test");