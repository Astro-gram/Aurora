import Aurora from "../src/Aurora.js";
import * as constants from "./constants.js";

const stage = new Aurora.Stage("game", constants.stageBounds);
const loader = new Aurora.Loader(constants.srcMap, constants.parentFolder);
const sounds = new Aurora.Sound(constants.audioMap);

stage.addEventListener("click", function() {
    sounds.playBackground("test", true, true);
})

Aurora.dispatcher.on("sys:loaderComplete", () => {
    const crosses = new Aurora.Sprite({
        framerate: 1,
        images: loader.getImage("x"),
        frameBounds: {
            width: 32,
            height: 32
        },
    
        animations: {
            swap: {
                frameCount: 4,
                next: "swap"
            }
        }
    }, "swap");

    console.log(crosses)
});