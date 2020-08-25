INPUT = {
    'jump': () => down[KEYBOARD_SPACE] || isGamepadButtonPressed(0),
    'left': () => down[KEYBOARD_LEFT] || isGamepadButtonPressed(14),
    'right': () => down[KEYBOARD_RIGHT] || isGamepadButtonPressed(15),
};
