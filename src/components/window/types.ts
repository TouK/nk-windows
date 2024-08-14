export enum Side {
  none,
  top = 1 << 0,
  right = 1 << 1,
  bottom = 1 << 2,
  left = 1 << 3,
  topLeft = top | left,
  topRight = top | right,
  bottomLeft = bottom | left,
  bottomRight = bottom | right,
}

export interface Coords {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}
