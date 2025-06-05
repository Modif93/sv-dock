export type MaxBoxData = {};
export type TabData = {
  id: string;
  title: string | Function;
  content: string | Function;
  closable?: boolean;
};
export type PanelData = {
  id?: string;
  size?: number;
  tabs: TabData[];
  box?: SizeBox
};
export type SizeBox = {
  w: number;
  h: number;
  x: number;
  y: number;
}

// export type FloatBoxData = {
//   id?: string;
//   tabs: TabData[];
//   box: SizeBox
// };
export type BoxData = {
  mode: 'horizontal' | 'vertical';
  children: (PanelData | BoxData)[];
  size?: number;
};

export type FloatBoxData = {
  mode: 'float';
  children: PanelData[];
}
export type LayoutData = {
  dockbox: BoxData;
  floatbox: FloatBoxData;
  maxbox: MaxBoxData;
};

export type HandlePosition = 'e' | 'w' | 'n' | 's' | 'ne' | 'nw' | 'sw' | 'se';
export function isPanelData(child: PanelData | BoxData): child is PanelData {
  return 'tabs' in child;
}

export function isBoxData(child: PanelData | BoxData): child is BoxData {
  return 'children' in child;
}


