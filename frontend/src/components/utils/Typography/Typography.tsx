import { TypographyProps } from './Typography.props';
import clsx from 'clsx';
import './Typography.css';

const variantMap = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-semibold',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-medium',
  h5: 'text-lg font-medium',
  body1: 'text-base',
  body2: 'text-sm',
  caption: 'text-xs text-gray-500',
};

const defaultComponentMap = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  body1: 'p',
  body2: 'p',
  caption: 'span',
};

export const Typography = ({
  children,
  variant = 'body1',
  component,
  className = '',
  style,
  ...props
}: TypographyProps) => {
  const Component = component || defaultComponentMap[variant] || 'p';
  const classes = clsx(variantMap[variant], className);

  return (
    <Component className={classes} {...props} style={{ ...style }}>
      {children}
    </Component>
  );
};
