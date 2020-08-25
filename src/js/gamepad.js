gamepads = () => navigator.getGamepads ? navigator.getGamepads() : [];

isGamepadButtonPressed = buttonIndex => {
    const pads = gamepads();
    for (var i = 0; i < pads.length; i++) {
        if (pads[i].buttons[buttonIndex].pressed) {
            return true;
        }
    }
};

isGamepadAxisNearValue = (axisIndex, targetValue) => {
    const pads = gamepads();
    for (var i = 0; i < pads.length; i++) {
        if (abs(targetValue - pads[i].axes[axisIndex]) < 0.5) {
            return true;
        }
    }
};
