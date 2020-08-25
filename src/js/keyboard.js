w.down = {};
onkeydown = e => {
    w.down[e.keyCode] = true;

    if (e.keyCode == KEYBOARD_D) {
        changeDifficulty();
        beepSound();
    }
};
onkeyup = e => {
    w.down[e.keyCode] = false;
};
