export function getGradientBg(
  gradientBgOptions = { angle: 0, color: ['#fff'] }
) {
  const { angle, color } = gradientBgOptions;
  if (color.length === 1) {
    return color[0];
  }
  const background = `linear-gradient(${angle}deg,${color.join(',')})`;
  return background;
}

export function hexToRgb() {}
