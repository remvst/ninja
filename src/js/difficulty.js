DIFFICULTY_SETTINGS = [
    // Label, time factor, vision factor
    NORMAL_DIFFICULTY = {'label': nomangle('NORMAL'), 'timeFactor': 1, 'visionFactor': 1},
    {'label': nomangle('EASY'), 'timeFactor': 0.8, 'visionFactor': 0.7},
    {'label': nomangle('SUPER EASY'), 'timeFactor': 0.6, 'visionFactor': 0.5},
    HARD_DIFFICULTY = {'label': nomangle('HARD'), 'timeFactor': 1, 'visionFactor': 10},
];

DIFFICULTY = null;

changeDifficulty = () => {
    DIFFICULTY = DIFFICULTY_SETTINGS[(DIFFICULTY_SETTINGS.indexOf(DIFFICULTY) + 1) % DIFFICULTY_SETTINGS.length];

    // If the difficulty is changed even once, the run becomes invalid
    if (G) {
        G.isRunValid = false;
    }
};

changeDifficulty();
