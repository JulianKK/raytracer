import vec from './veccalculator.js'
const of = (origin, dir) => {
    return {
        origin: origin,
        dir: dir,
        at: function (t) {
            return vec.plusVec(this.origin, vec.multiplyNum(this.dir, t));
        }
    }
}

const ray = {
    of: of
}

export default ray