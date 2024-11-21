import vec from './veccalculator.js'

const sphere = {
    center: { x: 0, y: 0, z: 0 },
    radius: 0.5,
    mat: {},
    hit: function (r, ray_t) {
        const oc = vec.minusVec(this.center, r.origin);
        const a = vec.length_squared(r.dir);
        const h = vec.dot(r.dir, oc);
        const c = vec.length_squared(oc) - this.radius * this.radius;

        const discriminant = h * h - a * c;
        if (discriminant < 0) {
            return null;
        }
            

        const sqrtd = Math.sqrt(discriminant);

        // Find the nearest root that lies in the acceptable range.
        var root = (h - sqrtd) / a;
        if (!ray_t.surrounds(root)) {
            root = (h + sqrtd) / a;
            if (!ray_t.surrounds(root)) {
                return null;
            }
                
        }

        const outwardNomal = vec.devideNum(vec.minusVec(r.at(root), this.center), this.radius)
        const front_face = vec.dot(r.dir, outwardNomal) < 0.0;
    
        return {
            t: root,
            p: r.at(root),
            normal: front_face ? outwardNomal : vec.multiplyNum(outwardNomal, -1),
            material: this.mat,
            front_face: front_face
        };
    },
    of: function (center, radius, mat) {
        this.center = center
        this.radius = radius
        this.mat = mat
    }
}

export default sphere