//EXAMPLE
import Aurora from "../src/Aurora.js";

const stage = new Aurora.Stage("game", {
    width: window.innerWidth,
    height: window.innerHeight
});

const loader = new Aurora.Images([
    {
        src: "example.png",
        id: "backpack"
    }
]);

const sounds = new Aurora.Sound({
    test: "audio.wav"
});


stage.addEventListener("click", () => {
    stage.pause();
    //sounds.play("test");
});

stage.watchResize();


//STATIC IMAGE
let image = new Aurora.Static(loader.getImage("backpack"), {
    x: 100,
    y: 100
});

image.anchorCenter();

image.setFilter("opacity", "95%")
     .setFilter("contrast", "70%")
     .setFilter("blur", "1px");


//SHAPES
let body = new Aurora.Shape("#00b2e1", "#0085a8", 7);
body.fill = true;
body.circle(500, 500, 45);

let gun = new Aurora.Shape("#999999", "#727272", 7);
gun.fill = true;
gun.rect(body.center.x, body.center.y - 15, 100, 30);

//TEXT
let text = new Aurora.Text("This is an example", "Arial", "blue", 40);
text.textAlign = "center";
text.x = stage.bounds.width / 2;
text.y = stage.bounds.height / 2;

//CONTAINER
let character = new Aurora.Container(gun, body);
character.anchor.x = 500;
character.anchor.y = 500;


//ADD PROPS
stage.addProp(image, character, text).then(() => {
    stage.start(tick);
});


//FUNCTION CALLED EACH TICK
function tick() {
    character.rotation += 1;
    image.x += 1;
    stage.nextFrame();
}