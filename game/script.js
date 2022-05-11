import Aurora from "../src/Aurora.js";
import * as constants from "./constants.js";

const stage = new Aurora.Stage("game", constants.stageBounds);
const loader = new Aurora.Images(constants.srcMap, constants.parentFolder, false);
const sounds = new Aurora.Sound(constants.audioMap);

stage.addEventListener("click", function() {
    sounds.playBackground("test", true, true);
    console.log("stage got clicked")
})



Aurora.dispatcher.on("sys:propsProcessed", (usedProps) => {
    console.log(usedProps)
})

let testStatic = new Aurora.Static(loader.getImage("backpack"), {x: 0, y: 0})

stage.addProps(testStatic).then()


stage.start(test)


function test() {
    console.log("test")
}