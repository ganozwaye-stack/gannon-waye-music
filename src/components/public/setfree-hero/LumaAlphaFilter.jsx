// Owner-supplied brand art (SET FREE title, GWM wordmark) is on pure black.
// This filter turns black into transparency wherever the art is placed, so no
// black box can ever show, inside a glass panel or inside the 3D heart plate.
// Use it as style={{ filter: 'url(#gw-luma-alpha)' }} on the image.
export default function LumaAlphaFilter() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <filter id="gw-luma-alpha" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0.66 1.32 0.22 0 -0.06" />
        </filter>
      </defs>
    </svg>
  );
}