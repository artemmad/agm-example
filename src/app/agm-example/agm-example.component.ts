import { Component, OnInit } from '@angular/core';
declare const google: any;


@Component({
  selector: 'app-agm-example',
  templateUrl: './agm-example.component.html',
  styleUrls: ['./agm-example.component.css'],
})
export class AgmExampleComponent implements OnInit {


  lat = 55.62931516;
  lng = 37.50899053;
  pointList: { lat: number; lng: number }[] = [];
  drawingManager: any;
  selectedShape: any;
  selectedArea = 0;
  private extern: any;

  constructor() {}

  // tslint:disable-next-line:variable-name
  // @ts-ignore
  // tslint:disable-next-line:variable-name max-line-length
    const triangleCoords: ({ lng: number; lat: number } | { lng: number; lat: number } | { lng: number; lat: number } | { lng: number; lat: number })[] = [
/*
    55.62796445, 37.50761724
    55.62881244, 37.50786400
    55.62963618, 37.50901199
    55.63011467, 37.51015998

    55.63024186, 37.51096464
    55.63001170, 37.51110411
    55.62953927, 37.50999904
    55.62827336, 37.50863648

   */

    { lat: 55.62796445, lng: 37.50761724 },
    { lat: 55.62881244, lng: 37.50786400 },
    { lat: 55.62963618, lng: 37.50901199},
    { lat: 55.63011467, lng: 37.51015998},

    { lat: 55.63024186, lng:  37.51096464},
    { lat: 55.63024186, lng:  37.51110411},
    { lat: 55.62953927, lng:  37.50999904},
    { lat: 55.62827336, lng:  37.50863648}
  ];

  ngOnInit() {
    this.setCurrentPosition();
    // tslint:disable-next-line:prefer-const
  }

  onMapReady(map) {
    this.initDrawingManager(map);
    // Construct the polygon.
    const bermudaTriangle = new google.maps.Polygon({
      paths: this.triangleCoords,
      strokeColor: '#264072',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#387BFE',
      fillOpacity: 0.40,
    });
    bermudaTriangle.setMap(map);
  }

  initDrawingManager = (map: any) => {
    const self = this;
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ['polygon'],
      },
      polygonOptions: {
        draggable: true,
        editable: false,
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };
    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);
    google.maps.event.addListener(
      this.drawingManager,
      'overlaycomplete',
      (event) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const paths = event.overlay.getPaths();
          for (let p = 0; p < paths.getLength(); p++) {
            google.maps.event.addListener(
              paths.getAt(p),
              'set_at',
              () => {
                if (!event.overlay.drag) {
                  self.updatePointList(event.overlay.getPath());
                }
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'insert_at',
              () => {
                self.updatePointList(event.overlay.getPath());
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'remove_at',
              () => {
                self.updatePointList(event.overlay.getPath());
              }
            );
          }
          self.updatePointList(event.overlay.getPath());
          this.selectedShape = event.overlay;
          this.selectedShape.type = event.type;
        }
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          // Switch back to non-drawing mode after drawing a shape.
          self.drawingManager.setDrawingMode(null);
          // To hide:
          self.drawingManager.setOptions({
            drawingControl: false,
          });
        }
      }
    );
  }
  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        //this.lat = position.coords.latitude;
        //this.lng = position.coords.longitude;
      });
    }
  }

  deleteSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.selectedArea = 0;
      this.pointList = [];
      // To show:
      this.drawingManager.setOptions({
        drawingControl: true,
      });
    }
  }

  updatePointList(path) {
    this.pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this.pointList.push(
        path.getAt(i).toJSON()
      );
    }
    this.selectedArea = google.maps.geometry.spherical.computeArea(
      path
    );
  }
}
