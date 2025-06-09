import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { writable } from 'svelte/store';
import type { DropDirection, OverPanelDropzone } from './dragdrop/gesture-manager';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PanelStore = {
  fromId?: string;
  toId?: string;
  tabId?: string;
  direction?: DropDirection | 'float';
  handled: boolean
};

type DragStore = {
  x: number;
  y: number;
};

export const dropStore = writable<PanelStore>({
  fromId: undefined,
  tabId: undefined,
  toId: undefined,
  direction: 'float',
  handled: false,
});

export const dragStore = writable<DragStore>({ x: 0, y: 0 });
