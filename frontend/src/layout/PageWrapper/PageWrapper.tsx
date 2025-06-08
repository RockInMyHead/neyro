import { PageWrapperProps } from './PageWrapper.props';
import './PageWrapper.css';

export function PageWrapper({ children }: PageWrapperProps) {
  return <div className='page_wrapper'>{children}</div>;
}
