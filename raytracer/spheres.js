import material from "./material.js"
import vec from "./veccalculator.js"


const spheres = [
    {"pos": vec.of( 0.0, -100.5, -1.0), "radius": 100, material: material.createMatt(vec.of(0.1, 0.2, 0.5))},
    {"pos": vec.of( 0.0,    0.0, -1.2), "radius": 0.5, material: material.createMatt(vec.of(0.8, 0.8, 0.0))},
    {"pos": vec.of(-1.0,    0.0, -1.0), "radius": 0.5, material: material.createMetal(vec.of(0.8, 0.8, 0.8), 0.8)},
    {"pos": vec.of(-1.0,    0.0, -1.0), "radius": 0.5, material: material.createGloss(vec.of(1, 1, 1), 1.5)},
    {"pos": vec.of(-1.0,    0.0, -1.0), "radius": 0.4, material: material.createGloss(vec.of(1, 1, 1), 1.00 / 1.33)}
]

export default spheres