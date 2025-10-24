export interface PlacementArea {
  center: { x: number, y: number }; // percentage
  width: number; // percentage
  height: number; // percentage
  rotation: number; // in degrees
}

export interface MockupConfig {
  id: string;
  name: string;
  imageId: string;
  imageDataUrl?: string; // For runtime rendering, not persisted
  placementArea?: PlacementArea;
  designOpacity: number; // 0 to 1, now per mockup
}

export interface Profile {
  id: string;
  name: string;
  mockups: MockupConfig[];
}