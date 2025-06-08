import { ButtonProps } from './Button.props';

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
