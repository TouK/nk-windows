import alpha from "color-alpha";

export function rgba(color: string, a: number): string {
  return alpha(color, a);
}
