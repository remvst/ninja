w.down = {};
onkeydown = e => {
    w.down[e.keyCode] = true;
};
onkeyup = e => {
    w.down[e.keyCode] = false;
};
