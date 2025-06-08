import { Textarea } from './Content/Textarea';
import './FancyInput.css';
import { FancyInputProps } from './FancyInput.props';

export function FancyInput({
  value,
  isLoadingPromt,
  handleFetchPromt,
  sessionId,
  ...props
}: FancyInputProps) {
  return (
    <div className='demo_input_container_wrapper'>
      <Textarea
        sessionId={sessionId}
        handleFetchPromt={handleFetchPromt}
        value={value}
        {...props}
        isLoadingPromt={isLoadingPromt}
      />
    </div>
  );
}
