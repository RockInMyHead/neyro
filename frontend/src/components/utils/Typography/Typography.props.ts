import { ElementType, ReactNode } from 'react';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'body1'
  | 'body2'
  | 'caption';

export type TypographyProps = {
  children: ReactNode;
  variant?: TypographyVariant;
  component?: ElementType;
  className?: string;
  style?: React.CSSProperties; 
} & React.HTMLAttributes<HTMLElement>;
