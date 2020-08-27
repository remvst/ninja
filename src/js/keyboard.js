w.down = {};
onkeydown = e => {
    w.down[e.keyCode] = true;

    if (e.keyCode == KEYBOARD_K) {
        G.changeDifficulty();
        beepSound();
    }

    if (e.keyCode == KEYBOARD_T && G.queuedTweet) {
        tweet(G.queuedTweet);
    }
};
onkeyup = e => {
    w.down[e.keyCode] = false;
};
onblur = () => w.down = {};
