import Aurora from "../src/Aurora.js";

let stage = new Aurora.Stage("game", {
    w: 1000,
    h: 400
});

const srcMap = [
    { src: "test.png", id: "backpack" }
]

let loader = new Aurora.Loader(srcMap, "../game/");

loader.process().then(() => {
    stage.ctx.drawImage(loader.getImage("backpack"), 10, 10);
})