export type DropDirection =
  | 'top'
  | 'up'
  | 'west'
  | 'left'
  | 'center'
  | 'right'
  | 'east'
  | 'down'
  | 'bottom';

export type DropTarget = DropDirection | 'float';

export type DropzoneVisibility = Partial<Record<DropDirection, boolean>>;

export type OverPanelDropzone = {
  [key in DropDirection]: boolean;
};

export interface PanelDropEvent {
  fromId?: string;
  toId?: string;
  tabId?: string;
  direction?: DropTarget;
  handled?: boolean;
}
