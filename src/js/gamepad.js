isGamepadButtonPressed = buttonIndex => {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i].buttons[buttonIndex].pressed) {
            return true;
        }
    }
};
