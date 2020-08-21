limit = (a, b, c) => b < a ? a : (b > c ? c : b);
between = (a, b, c) => b >= a && b <= c;
rnd = (min, max) => random() * (max - min) + min;
pick = a => a[~~(random() * a.length)];
distP = (x1, y1, x2, y2) => sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
dist = (a, b) => distP(a.x, a.y, b.x, b.y);
normalize = x => moduloWithNegative(x, PI);
angleBetween = (a, b) => atan2(b.y - a.y, b.x - a.x);

// Make Math global
const math = Math;
Object.getOwnPropertyNames(math).forEach(n => w[n] = w[n] || math[n]);

TWO_PI = PI * 2;
