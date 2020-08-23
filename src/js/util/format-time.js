addZeroes = x => {
    return (x < 10 ? '0' : '') + ~~x;
};

formatTime = seconds => {
    return addZeroes(~~(seconds / 60)) + ':' + addZeroes(~~seconds % 60) + '.' + addZeroes(100 * (seconds % 1));
};
