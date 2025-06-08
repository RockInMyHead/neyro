import { AboutBlock1 } from './blocks/AboutBlock1';
import { AboutBlock2 } from './blocks/AboutBlock2';
import { AboutBlock3 } from './blocks/AboutBlock3';
import './About.css';
import { AboutBlock4 } from './blocks/AboutBlock4';
import { AboutBlock5 } from './blocks/AboutBlock5';

export function About() {
  return (
    <div>
      <AboutBlock1 />
      <AboutBlock2 />
      <AboutBlock3 />
      <AboutBlock4 />
      <AboutBlock5 />
    </div>
  );
}
