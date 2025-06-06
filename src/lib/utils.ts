import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { writable } from 'svelte/store';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PanelStore = {
  draggingId: string | null;
};

export const panelStore = writable<PanelStore>({
  draggingId: null
});
