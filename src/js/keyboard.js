w.down = {};
onkeydown = e => {
    w.down[e.keyCode] = true;

    if (e.keyCode == KEYBOARD_D) {
        G.changeDifficulty();
        beepSound();
    }

    if (e.keyCode == KEYBOARD_T && G.queuedTweet) {
        tweet();
    }
};
onkeyup = e => {
    w.down[e.keyCode] = false;
};
