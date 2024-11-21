const minusVec = (vecA, vecB) => {
    return { x: vecA.x - vecB.x, y: vecA.y - vecB.y, z: vecA.z - vecB.z }
}
const devideNum = (vecA, devisor) => {
    return { x: vecA.x / devisor, y: vecA.y / devisor, z: vecA.z / devisor }
}
const multiplyNum = (vecA, devisor) => {
    return { x: vecA.x * devisor, y: vecA.y * devisor, z: vecA.z * devisor }
}
const multiplyVec = (vecA, vecB) => {
    return { x: vecA.x * vecB.x, y: vecA.y * vecB.y, z: vecA.z * vecB.z }
}
const plusNum = (vecA, num) => {
    return { x: vecA.x + num, y: vecA.y + num, z: vecA.z + num }
}
const plusVec = (vecA, vecB) => {
    return { x: vecA.x + vecB.x, y: vecA.y + vecB.y, z: vecA.z + vecB.z }
}
const length = (vecA) => {
    return Math.sqrt(length_squared(vecA));
}
const length_squared = (vecA) => {
    return vecA.x * vecA.x + vecA.y * vecA.y + vecA.z * vecA.z;
}
const unit_vector = (vecA) => {
    return devideNum(vecA, length(vecA));
}
const refract = (uv, n, etai_over_etat) => {
    const cos_theta = Math.min(dot(multiplyNum(uv, -1), n), 1.0);
    const r_out_perp =  multiplyNum(plusVec(uv, multiplyNum(n, cos_theta)), etai_over_etat);
    const r_out_parallel =  multiplyNum(n, -Math.sqrt(Math.abs(1.0 - length_squared(r_out_perp))));
    return plusVec(r_out_perp, r_out_parallel);
}

const dot = (vecA, vecB) => {
    return vecA.x * vecB.x
        + vecA.y * vecB.y
        + vecA.z * vecB.z;
}

const of = (x, y, z) => {
    return {
        x: x,
        y: y,
        z: z
    }
}

const random = () => {
    return of(Math.random(), Math.random(), Math.random());
}

const randomMinMax = (min, max) => {
    const minMax = () => {
        return Math.random() * (max - min) + min;
    }
    return of(minMax(), minMax(), minMax());
}

const random_unit_vector = () => {
    while (true) {
        const p = randomMinMax(-1, 1);
        const lensq = length_squared(p)
        if (1e-160 < lensq && lensq <= 1)
            return devideNum(p, Math.sqrt(lensq));
    }
}

const random_on_hemisphere = (normal) => {
    const on_unit_sphere = random_unit_vector();
    if (dot(on_unit_sphere, normal) > 0.0) // In the same hemisphere as the normal
        return on_unit_sphere;
    else
        return multiplyNum(on_unit_sphere, -1);
}

const near_zero = (vecA) => {
    const s = 1e-8;
    return (Math.abs(vecA.x) < s) && (Math.abs(vecA.y) < s) && (Math.abs(vecA.z) < s);
}

const reflect = (v, n) => {
    const dotIt = dot(v,n) * 2
    const multi = multiplyNum(n, dotIt)
    return minusVec(v, multi)
}

const cross = (u, v) => {
    return of(u.y * v.z - u.z * v.y,
                u.z * v.x - u.x * v.z,
                u.x * v.y - u.y * v.x);
    }

const vec = {
    minusVec: minusVec,
    devideNum: devideNum,
    multiplyNum: multiplyNum,
    plusNum: plusNum,
    plusVec: plusVec,
    length: length,
    length_squared: length_squared,
    unit_vector: unit_vector,
    dot: dot,
    of: of,
    random_on_hemisphere: random_on_hemisphere,
    random_unit_vector,
    near_zero: near_zero,
    reflect: reflect,
    multiplyVec: multiplyVec,
    reflect: reflect,
    refract: refract,
    cross: cross
}

export default vec