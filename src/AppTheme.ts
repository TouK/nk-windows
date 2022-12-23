export type AppTheme = Partial<{
  backgroundOpacity: number;
  backdropFilter: string;
  spacing: Partial<{
    baseUnit: number;
  }>;
  colors: Partial<{
    borderColor: string;
    focusColor: string;
    mutedColor: string;
    primaryBackground: string;
    secondaryBackground: string;
  }>;
  zIndex: number;
}>;

declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends AppTheme {}
}
