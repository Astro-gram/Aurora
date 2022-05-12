import Aurora from "../src/Aurora.js";
import * as constants from "./constants.js";

const stage = new Aurora.Stage("game", constants.stageBounds);
const loader = new Aurora.Images(constants.srcMap, constants.parentFolder);
const sounds = new Aurora.Sound(constants.audioMap);

stage.addEventListener("click", () => {
    stage.pause();
})

stage.addEventListener("mousemove", (e) => {
    backpack.x = e.clientX - stage.bounds.x;
    backpack.y = e.clientY - stage.bounds.y;
})

let backpack = new Aurora.Static(loader.getImage("backpack"), {
    x: stage.bounds.width / 2,
    y: stage.bounds.height / 2,
})


backpack
    .setFilter("blur", "1px")
    .setFilter("saturate", "200%")

stage.addProps(backpack);
stage.start(tick);

function tick() {
    stage.nextFrame();
}