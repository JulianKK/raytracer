import fs from 'fs'
import logUpdate from 'log-update';
import tools from './raytracer/hardware.js'
import raytracer from './raytracer/raytracer.js'
import ray from './raytracer/ray.js'

const canvas = tools.canvas
const vec = tools.vec
const camera = tools.camera
const samples_per_pixel = 10;
const pixel_samples_scale = 1.0 / samples_per_pixel;
const max_depth = 50;

const sample_square = () => {
  // Returns the vector to a random point in the [-.5,-.5]-[+.5,+.5] unit square.
  return vec.of(Math.random() - 0.5, Math.random() - 0.5, 0);
}

const getRay = (i, j) => {
  const offset = sample_square();
  const xPos = vec.multiplyNum(camera.pixel_delta_u, i + offset.x)
  const yPos = vec.multiplyNum(camera.pixel_delta_v, j + offset.y)
  const pixel_sample = vec.plusVec(vec.plusVec(camera.pixel_loc, yPos), xPos)

  const ray_origin = camera.center;
  const ray_direction = vec.minusVec(pixel_sample, ray_origin);
  const r = ray.of(ray_origin, ray_direction)
  return r;
}

for (let j = 0; j < canvas.height; j++) {
  logUpdate("\rScanlines remaining: " + (canvas.height - j) + ' ');
  for (let i = 0; i < canvas.width; i++) {

    const pixel = {color: vec.of(0, 0, 0)}
    for (let sample = 0; sample < samples_per_pixel; sample++) {
      const ray = getRay(i, j)
      pixel.color = vec.plusVec(pixel.color, raytracer.calcPixel(ray, max_depth));
    }
    canvas.addLine(vec.multiplyNum(pixel.color, pixel_samples_scale));
  }
}

fs.writeFile('./test.ppm', canvas.data, err => {
  if (err) {
    console.error(err);
  } else {
    logUpdate("Done");
  }
});