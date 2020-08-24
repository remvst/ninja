w.down = {};
onkeydown = e => {
    w.down[e.keyCode] = true;

    if (e.keyCode == KEYBOARD_D) {
        G.easyMode = !G.easyMode;
        G.isRunValid = true;

        beepSound();
    }
};
onkeyup = e => {
    w.down[e.keyCode] = false;
};
