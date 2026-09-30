export interface GeoOverlayDTO {
  /**
   * Type of overlay e.g., trajectory, heatmap.
   */
  type: string;
  /**
   * GeoJSON FeatureCollection.
   */
  data: any;
}
