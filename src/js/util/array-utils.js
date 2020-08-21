remove = (array, value) => {
    const index = array.indexOf(value);
    if (index >= 0) {
        array.splice(index, 1);
    }
};
