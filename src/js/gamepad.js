gamepads = () => (navigator.getGamepads ? Array.from(navigator.getGamepads()) : []).filter(x => !!x);

isGamepadButtonPressed = buttonIndex => {
    const pads = gamepads();
    for (var i = 0; i < pads.length; i++) {
        try {
            if (pads[i].buttons[buttonIndex].pressed) {
                return true;
            }
        } catch (e) {}
    }
};

isGamepadAxisNearValue = (axisIndex, targetValue) => {
    const pads = gamepads();
    for (var i = 0; i < pads.length; i++) {
        try {
            if (abs(targetValue - pads[i].axes[axisIndex]) < 0.5) {
                return true;
            }
        } catch (e) {}
    }
};
