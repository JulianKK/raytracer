import vec from './veccalculator.js'
import intervall from './interval';

const lookfrom = vec.of(-2, 2, 1);   // Point camera is looking from
const lookat = vec.of(0, 0, -1);  // Point camera is looking at
const img_with = 1024
const aspect_ratio = 16.0 / 9.0;
const img_height = Math.floor(img_with / aspect_ratio)
const focal_length = vec.length(vec.minusVec(lookfrom, lookat));
const vfov = 96;

const vup = vec.of(0, 1, 0);     // Camera-relative "up" direction
const w = vec.unit_vector(vec.minusVec(lookfrom, lookat));
const u = vec.unit_vector(vec.cross(vup, w));
const v = vec.cross(w, u);
const camera_center = vec.of(0, 0, 3);

const degrees_to_radians = (degrees) => {
    return degrees * Math.PI / 180.0;
}

const calcViewPortHight = () => {
    const theta = degrees_to_radians(vfov);
    const h = Math.tan(theta / 2);

    // return 2 * h * focal_length;
    return 2
}

const viewport_height = calcViewPortHight()
const viewport_width = viewport_height * img_with / img_height;
// const viewport_u = vec.multiplyNum(u, viewport_width); 
const viewport_u = vec.of(viewport_width, 0, 0); 
const viewport_v = vec.of(0, -viewport_height, 0)
const pixel_delta_u = vec.devideNum(viewport_u, img_with)
const pixel_delta_v = vec.devideNum(viewport_v, img_height)

const calcviewport_upper_left = () => {
    const centerMinDirection = vec.minusVec(camera_center, vec.of(0, 0, focal_length))
    const viewUHalthU = vec.devideNum(viewport_u, 2)
    const viewUHalthv = vec.devideNum(viewport_v, 2)
    const centerMinViewPortu = vec.minusVec(centerMinDirection, viewUHalthU)

    return vec.minusVec(centerMinViewPortu, viewUHalthv)
}

const calcpixel00_loc = () => {
    const deltaplus = vec.plusVec(pixel_delta_u, pixel_delta_v)
    const halthDelptaPlus = vec.multiplyNum(deltaplus, 0.5)
    return vec.plusVec(viewport_upper_left, halthDelptaPlus)
}

const viewport_upper_left = calcviewport_upper_left();
const pixel00_loc = calcpixel00_loc()

const linear_to_gamma = (linear_component) => {
    if (linear_component > 0)
        return Math.sqrt(linear_component);

    return 0;
}

const canvas = {
    width: img_with,
    height: img_height,
    data: "P3\n" + img_with + ' ' + img_height + "\n255\n",
    addLine: function (pixel) {
        const r = linear_to_gamma(pixel.x);
        const g = linear_to_gamma(pixel.y);
        const b = linear_to_gamma(pixel.z);

        // Translate the [0,1] component values to the byte range [0,255].
        const intensity = intervall(0.000, 0.999);
        const rbyte = Math.floor(256 * intensity.clamp(r));
        const gbyte = Math.floor(256 * intensity.clamp(g));
        const bbyte = Math.floor(256 * intensity.clamp(b));

        // Write out the pixel color components.
        this.data += rbyte + ' ' + gbyte + ' ' + bbyte + '\n';
    }
}

const camera = {
    view_width: viewport_width,
    view_hight: viewport_height,
    foc_length: focal_length,
    center: camera_center,
    view_u: viewport_u,
    view_v: viewport_v,
    pixel_delta_u: pixel_delta_u,
    pixel_delta_v: pixel_delta_v,
    view_upper_left: viewport_upper_left,
    pixel_loc: pixel00_loc,
    samples_per_pixel: 10
}

export default { canvas, vec, camera }