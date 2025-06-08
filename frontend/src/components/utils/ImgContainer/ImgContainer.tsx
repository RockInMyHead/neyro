import { HTMLAttributes, ReactNode } from 'react';
import './ImgContainer.css';

type ImgContainerProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function ImgContainer({ children, className }: ImgContainerProps) {
  return <div className={`img_wrapper ${className}`}>{children}</div>;
}
