INPUT = {
    'jump': () => down[KEYBOARD_SPACE] || isGamepadButtonPressed(0) || isGamepadButtonPressed(1),
    'left': () => down[KEYBOARD_LEFT] || isGamepadButtonPressed(14) || isGamepadAxisNearValue(0, -1),
    'right': () => down[KEYBOARD_RIGHT] || isGamepadButtonPressed(15) || isGamepadAxisNearValue(0, 1),
};
