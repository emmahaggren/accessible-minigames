import useSound from 'use-sound';
import correctSfx from './correct.mp3';
import errorSfx from './error.mp3';
import winSfx from './win.mp3';
import wrongSfx from './wrong.mp3';
import loseSfx from './lose.mp3';
import wrongLiteSfx from './uh-oh.mp3';
import wrongMidSfx from './oh-no.mp3';
import wrongHardSfx from './nooo.mp3';

// Custom hooks that wrap `useSound` so components can import one clean API
export function useCorrectSound(options) {
  return useSound(correctSfx, options);
}

export function useErrorSound(options) {
  return useSound(errorSfx, options);
}

export function useWinSound(options) {
  return useSound(winSfx, options);
}

export function useWrongSound(options) {
  return useSound(wrongSfx, options);
}

export function useLoseSound(options) {
  return useSound(loseSfx, options);
}

export function useWrongLiteSound(options) {
  return useSound(wrongLiteSfx, options);
}

export function useWrongMidSound(options) {
  return useSound(wrongMidSfx, options);
}

export function useWrongHardSound(options) {
  return useSound(wrongHardSfx, options);
}

export { correctSfx, errorSfx, winSfx, wrongSfx, loseSfx, wrongLiteSfx, wrongMidSfx, wrongHardSfx };