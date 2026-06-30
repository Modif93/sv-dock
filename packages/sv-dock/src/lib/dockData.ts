import type { Component, ComponentProps, Snippet } from 'svelte';
import type { RenderComponentConfig, RenderSnippetConfig } from './renderHelper.js';

export type Renderable =
  | string
  | number
  | null
  | undefined
  | RenderComponentConfig<Component>
  | RenderSnippetConfig<unknown>
  | ((context?: unknown) => unknown);

export type MaxBoxData = Record<string, never>;

export type TabData = {
  id: string;
  title: Renderable;
  content: Renderable;
  closable?: boolean;
};

export type SizeBox = {
  w: number;
  h: number;
  x: number;
  y: number;
  z?: number;
};

export type PanelData = {
  id?: string;
  size?: number;
  tabs: TabData[];
  box?: SizeBox;
};

export type BoxData = {
  mode: 'horizontal' | 'vertical';
  children: (PanelData | BoxData)[];
  size?: number;
};

export type FloatBoxData = {
  mode: 'float';
  children: PanelData[];
};

export type LayoutData = {
  dockbox: BoxData;
  floatbox?: FloatBoxData;
  maxbox?: MaxBoxData;
};

export type HandlePosition = 'e' | 'w' | 'n' | 's' | 'ne' | 'nw' | 'sw' | 'se';

export function isPanelData(child: PanelData | BoxData): child is PanelData {
  return 'tabs' in child;
}

export function isBoxData(child: PanelData | BoxData): child is BoxData {
  return 'children' in child;
}

export function findPanelInDockBox(boxData: BoxData, panelId: string): PanelData | null {
  for (const child of boxData.children) {
    if (isPanelData(child) && child.id === panelId) {
      return child;
    }

    if (isBoxData(child)) {
      const panel = findPanelInDockBox(child, panelId);
      if (panel) return panel;
    }
  }

  return null;
}

export function findPanelInFloatBox(floatData: FloatBoxData, panelId: string): PanelData | null {
  return floatData.children.find((panel) => panel.id === panelId) ?? null;
}

export function findParentBox(
  box: BoxData,
  panelId: string
): { box: BoxData; index: number } | null {
  for (let i = 0; i < box.children.length; i++) {
    const child = box.children[i];

    if (isPanelData(child) && child.id === panelId) {
      return { box, index: i };
    }

    if (isBoxData(child)) {
      const result = findParentBox(child, panelId);
      if (result) return result;
    }
  }

  return null;
}
