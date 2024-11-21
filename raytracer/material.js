import vec from "./veccalculator.js";
import ray from "./ray.js";

const reflectance = (cosine, refraction_index) => {
    // Use Schlick's approximation for reflectance.
    const r0 = (1 - refraction_index) / (1 + refraction_index);
    const r1 = r0*r0;
    return r1 + (1-r1)*Math.pow((1 - cosine),5);
}

const createMatt = (color) => {
    return {
        scatter: (r_in, rec) => {
            const scatter_direction = vec.plusVec(rec.normal, vec.random_unit_vector());
            if (vec.near_zero(scatter_direction)) {
                scatter_direction.x = rec.normal.x;
                scatter_direction.y = rec.normal.y;
                scatter_direction.z = rec.normal.z;
            }
            return {
                scattered: ray.of(rec.p, scatter_direction),
                attenuation: color,
                done: true
            }
        }
    }
}

const createMattAlt = (color) => {
    return {
        scatter: (r_in, rec) => {
            const scatter_direction = vec.plusVec(rec.normal, vec.random_on_hemisphere(rec.normal));
            if (vec.near_zero(scatter_direction)) {
                scatter_direction.x = rec.normal.x;
                scatter_direction.y = rec.normal.y;
                scatter_direction.z = rec.normal.z;
            }
            return {
                scattered: ray.of(rec.p, scatter_direction),
                attenuation: color,
                done: true
            }
        }
    }
}

const createMetal = (color, fuzz) => {
    return {
        scatter: (r_in, rec) => {
            const reflected = vec.plusVec(vec.unit_vector(vec.reflect(r_in.dir, rec.normal)), vec.multiplyNum(vec.random_unit_vector(), fuzz));
            return {
                scattered: ray.of(rec.p, reflected),
                attenuation: color,
                done: true
            }
        }
    }
}

const createGloss = (color, refraction_index) => {
    return {
        scatter: (r_in, rec) => {
            const ri = rec.front_face ? (1.0 / refraction_index) : refraction_index;
            const unit_direction = vec.unit_vector(r_in.dir);
            const cos_theta = Math.min(vec.dot(vec.multiplyNum(unit_direction, -1), rec.normal), 1.0);
            const sin_theta = Math.sqrt(1.0 - cos_theta * cos_theta);

            const cannot_refract = (ri * sin_theta) > 1.0;

            const direction = (cannot_refract || reflectance(cos_theta, ri) > Math.random()) ? vec.reflect(unit_direction, rec.normal) : vec.refract(unit_direction, rec.normal, ri)

            return {
                scattered: ray.of(rec.p, direction),
                attenuation: color,
                done: true
            }
        }
    }
}

export default { createMatt, createMattAlt, createMetal, createGloss }