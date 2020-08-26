createNumberGenerator = seed => {
    const ints = new Uint32Array([
        imul(seed, 0x85ebca6b),
        imul(seed, 0xc2b2ae35),
    ]);

    const generateFloat = () => {
        const s0 = ints[0];
        const s1 = ints[1] ^ s0;
        ints[0] = (s0 << 26 | s0 >> 8) ^ s1 ^ s1 << 9;
        ints[1] = s1 << 13 | s1 >> 19;
        return (imul(s0, 0x9e3779bb) >>> 0) / 0xffffffff;
    };

    return {
        'between': (a, b) => generateFloat() * (b - a) + a,
        'floating': generateFloat
    };
};
