import vec from './veccalculator.js'
import spheres from './spheres.js'
import hittable from './hittable.js'
import intervall from './interval';

const infinity = 562949953421310.0;

const raytracer = {
    calcPixel: function (ray, depth) {
        if (depth <= 0)
            return vec.of(0,0,0)
        const something = hitSomething(ray, intervall(0.001, infinity))
        
        if (something.hitEnyThing) {
            const scatter = something.rec.material.scatter(ray, something.rec)
            if (scatter.done)
                return vec.multiplyVec(scatter.attenuation, this.calcPixel(scatter.scattered, depth-1));
            return color(0,0,0);
        }
        const unit_direction = vec.unit_vector(ray.dir);
        const a = 0.5 * (unit_direction.y + 1.0);
        return vec.plusVec(vec.multiplyNum({ x: 1, y: 1, z: 1 }, 1.0 - a), vec.multiplyNum({ x: 0.5, y: 0.7, z: 1 }, a));
    }
}

const hitSomething = (r, ray_t) => {
    const hit_anything = {
        hitEnyThing: false,
        closest_so_far: ray_t.max,
        rec: {}
    }

    spheres.forEach(object => {
        hittable.of(object.pos,object.radius, object.material)
        const hasHit = hittable.hit(r, intervall(ray_t.min, hit_anything.closest_so_far))
        if (hasHit != null) {
            hit_anything.hitEnyThing = true;
            hit_anything.closest_so_far = hasHit.t;
            hit_anything.rec = hasHit;
        }
    })

    return hit_anything
}

export default raytracer