isGamepadButtonPressed = buttonIndex => {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i].buttons[buttonIndex].pressed) {
            return true;
        }
    }
};

isGamepadAxisNearValue = (axisIndex, targetValue) => {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (var i = 0; i < gamepads.length; i++) {
        if (abs(targetValue - gamepads[i].axes[axisIndex]) < 0.5) {
            return true;
        }
    }
};
