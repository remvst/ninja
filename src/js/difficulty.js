NORMAL_DIFFICULTY = {
    'label': nomangle('NORMAL'),
    'timeFactor': 1,
    'visionFactor': 1
};
EASY_DIFFICULTY = {
    'label': nomangle('EASY'),
    'timeFactor': 0.8,
    'visionFactor': 0.7
};
SUPER_EASY_DIFFICULTY = {
    'label': nomangle('SUPER EASY'),
    'timeFactor': 0.6,
    'visionFactor': 0.5
};
HARD_DIFFICULTY = {
    'label': nomangle('NIGHTMARE'),
    'timeFactor': 1,
    'visionFactor': 10
};

difficultySettings = () => {
    const settings = [
        NORMAL_DIFFICULTY,
        EASY_DIFFICULTY,
        SUPER_EASY_DIFFICULTY,
        HARD_DIFFICULTY
    ]

    if (document.monetization && document.monetization.state === nomangle('started')) {
        settings.push({
            'label': nomangle('PRACTICE'),
            'timeFactor': 1,
            'visionFactor': 1,
            'noSpotters': true
        });
    }

    return settings;
};
