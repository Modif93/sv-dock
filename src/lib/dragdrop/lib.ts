type DropDirection =
  | 'top'
  | 'up'
  | 'west'
  | 'left'
  | 'center'
  | 'right'
  | 'east'
  | 'down'
  | 'bottom';

type OverPanelDropzone = {
  [key in DropDirection]: boolean;
};

export type { DropDirection, OverPanelDropzone };

export interface PanelDropEvent {
  fromId: string;
  toId: string;
  direction: DropDirection;
}
