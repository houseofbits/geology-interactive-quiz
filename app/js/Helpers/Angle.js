export function lengthSquare(x1, y1, x2, y2) {
    let xDiff = x1 - y1;
    let yDiff = x2 - y2;
    return xDiff * xDiff + yDiff * yDiff;
}

export function radiansToDegrees(radians) {
    const pi = Math.PI;
    return radians * (180 / pi);
}

export function triangleAngles(a, b, c) {

    let a2 = a * a;
    let b2 = b * b;
    let c2 = c * c;

    let alpha = Math.acos((b2 + c2 - a2)/(2*b*c));
    let beta = Math.acos((a2 + c2 - b2)/(2*a*c));
    let gamma = Math.acos((a2 + b2 - c2)/(2*a*b));

    return [
        radiansToDegrees(alpha),
        radiansToDegrees(beta),
        radiansToDegrees(gamma)
    ];
}

