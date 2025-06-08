import { TextareaHTMLAttributes } from 'react';

export type FancyInputProps = {
  value: string;
  isLoadingPromt: boolean;
  sessionId: string | null;
  handleFetchPromt: (val: string) => void;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;
