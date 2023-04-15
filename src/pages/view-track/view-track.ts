import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
declare var google;
import { MapGoogle } from '../../providers/google-maps';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Common } from '../../providers/common';

@IonicPage()
@Component({
  selector: 'page-view-track',
  templateUrl: 'view-track.html',
})
export class ViewTrackPage implements OnInit {
  @ViewChild('map_canvas') mapElement: ElementRef;
  @ViewChild('please_connect') pleaseConnect: ElementRef;

  map: any;
  marker: any;
  driver: any;
  detail: any;

  directionsService: any;
  autocompleteService: any;
  placesService: any;
  directionsDisplay: any;
  
  current_driver_lat: any;
  current_driver_lng: any;

  //icons driver car and user destination
  icons = {
    start: {
      path: 'M44.6,28.3v-0.3h0.1c0.1,0,0.2-0.1,0.2-0.2v-1.4c0-0.1-0.1-0.2-0.2-0.2h-0.1V26h-0.3v-4.3c0-2.3-1.8-4.1-4.1-4.1h2.5v-6.2c0.2-0.2,0.3-0.4,0.3-0.6V6.2h0.5V5.9c0-0.3-0.2-0.5-0.5-0.6V4.3c0-0.3-0.2-0.6-0.4-0.7c0.1-0.2,0.2-0.4,0.2-0.7V1.5c0-0.8-0.6-1.4-1.4-1.4H25.5c-0.8,0-1.4,0.6-1.4,1.4v1.4c0,0.3,0.1,0.5,0.2,0.7C24,3.8,23.8,4,23.8,4.3v0.9c-0.4,0-0.6,0.3-0.6,0.7v0.3h0.6v4.6c0,0.2,0.1,0.4,0.2,0.6v6.3h2.5c-2.3,0-4.1,1.8-4.1,4.1V26h-0.3v0.3H22c-0.1,0-0.2,0.1-0.2,0.2v1.4c0,0.1,0.1,0.2,0.2,0.2h0.1v0.3h0.3v0.6h-0.3v0.3H22c-0.1,0-0.2,0.1-0.2,0.2v1.4c0,0.1,0.1,0.2,0.2,0.2h0.1v0.3h0.3v8.2h-0.3v0.3H22c-0.1,0-0.2,0.1-0.2,0.2v1.4c0,0.1,0.1,0.2,0.2,0.2h0.1v0.3h0.3v1c0,1.3,0.6,2.4,1.5,3.2h-1.5v0.6c0,0.7,0.5,1.2,1.2,1.2h2.5c0.1,0.1,0.2,0.2,0.4,0.2h2.4h3h3h3h2.4c0.1,0,0.3-0.1,0.4-0.2h2.4c0.7,0,1.2-0.5,1.2-1.2v-0.6h-1.5c0.9-0.8,1.5-1.9,1.5-3.2v-1h0.3v-0.3h0.1c0.1,0,0.2-0.1,0.2-0.2v-1.4c0-0.1-0.1-0.2-0.2-0.2h-0.1v-0.3h-0.3v-8.2h0.3V31h0.1c0.1,0,0.2-0.1,0.2-0.2v-1.4c0-0.1-0.1-0.2-0.2-0.2h-0.1v-0.3h-0.3v-0.6H44.6z M40.8,17.4h-3v-0.8h2.4c0.3,0,0.5,0.2,0.5,0.5V17.4z M37.8,12.3l-0.4,1c-0.1,0.4-0.7,0.4-0.8,0l-0.3-1c-0.2-0.5,0.2-1.1,0.8-1.1C37.6,11.2,38,11.8,37.8,12.3z M42.3,8.5v8h-0.9v-6.3L42,8.5H42.3zM25.1,16.5h-0.9v-8h0.3l0.6,1.7V16.5z M25.5,9.3L24.6,7c-0.1-0.2,0.1-0.4,0.3-0.4h16.8C41.9,6.6,42,6.8,42,7l-0.8,2.3c0,0.1-0.2,0.2-0.3,0.2H25.7C25.6,9.5,25.5,9.4,25.5,9.3z M34.8,16.6v0.8h-3v-0.8H34.8z M33.3,11.2c0.6,0,0.9,0.6,0.8,1.1l-0.4,1c-0.1,0.4-0.7,0.4-0.8,0l-0.3-1C32.4,11.8,32.7,11.2,33.3,11.2z M30.3,12.3l-0.4,1c-0.1,0.4-0.7,0.4-0.8,0l-0.3-1c-0.2-0.5,0.2-1.1,0.8-1.1C30.1,11.2,30.5,11.8,30.3,12.3z M25.9,17.4v-0.3c0-0.3,0.2-0.5,0.5-0.5h2.4v0.8H25.9z M39.7,33.7H36v3.7c0,0.3-1,0.5-2.2,0.5s-2.2-0.2-2.2-0.5v-3.7h-3.7c-0.3,0-0.5-1-0.5-2.2c0-1.2,0.2-2.2,0.5-2.2h3.7v-3.7c0-0.3,1-0.5,2.2-0.5s2.2,0.2,2.2,0.5v3.7h3.7c0.3,0,0.5,1,0.5,2.2C40.1,32.8,39.9,33.7,39.7,33.7z',
      //path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
      scale: 0.4,
      fillColor: "#E80000", //<-- Ambulancia Color, you can change it 
      fillOpacity: 1,
      strokeWeight: 1,
      anchor: new google.maps.Point(0, 5),
    }, //<-- Car angle,
    end: new google.maps.MarkerImage(
      // URL
      'http://maps.google.com/mapfiles/ms/micons/blue.png',
      new google.maps.Size(44, 32),
      new google.maps.Point(0, 0),
      new google.maps.Point(22, 32))
  };


  private observable: Observable<any>;
  positionSubscription: any;
  constructor(public navCtrl: NavController,
    public platform: Platform,
    public http: Http,
    public common:Common,
    public maps: MapGoogle,
    public loadCtrl: LoadingController,
    public navParams: NavParams
  ) {
    if (this.navParams.get("driver")) {
      this.driver = this.navParams.get("driver");
      console.log(this.driver);
    }

    if (this.navParams.get("trip_detail")) {
      this.detail = this.navParams.get("trip_detail");
      console.log(this.detail);
    }
  }


  async ngOnInit() {
    let loader = this.loadCtrl.create({
      content: 'wait..'
    });
    loader.present();
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.directionsService = new google.maps.DirectionsService;
      this.directionsDisplay = new google.maps.DirectionsRenderer;
    });
    console.log(mapLoaded);
    console.log(this.placesService);
    await setInterval(() => {
      this.load_data().subscribe();
      loader.dismiss();
    }, 2000);
  }

  ionViewCanEnter() {
  }


  public load_data(): Observable<any> {
    var post_data = {
      "driver_id": this.driver.id
    }
    console.log("web_service/get_driver_lat_lng");


    this.observable = this.http.post(this.common.URL_GET_DRIVER_LAT_LONG, post_data)
      .pipe(map(
        res => {
          let data = res.json();
          console.log(data);
          if (data.success) {
            console.log("success");
			this.current_driver_lat = data.data[0].latitude;
			this.current_driver_lng = data.data[0].longitude;
            setTimeout(() => {
              return this.calcRoute(data.data[0].latitude, data.data[0].longitude);
            }, 0);

          } else {
            return alert("Error");
          }
        },
        err => {
          console.log("ERROR!: ", err);
          return alert("Error");
        }
      ));
    return this.observable;
  }


  calcRoute(driver_lat, driver_lng) {
    console.log("try")
    var request = {
      origin: { lat: parseFloat(driver_lat), lng: parseFloat(driver_lng) },
      destination: this.detail.pickup_area,
      travelMode: google.maps.DirectionsTravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC
    };
    console.log(request);

    this.directionsDisplay.setMap(this.maps.map);
    this.directionsDisplay.setPanel(this.mapElement.nativeElement);
    this.directionsService.route(request, ((response, status) => {
      console.log("calculate")
      console.log(status);
      if (status == google.maps.DirectionsStatus.OK) {
        new google.maps.DirectionsRenderer({
          map: this.maps.map,
          directions: response,
          suppressMarkers: true
        });
        var leg = response.routes[0].legs[0];

        setTimeout(() => {
          this.makeMarker(leg.start_location, this.icons.start, 'driver', this.maps.map);
          this.makeMarker(leg.end_location, this.icons.end, 'your location', this.maps.map);
        }, 2000);


        let trip_distance = response.routes[0].legs[0].distance.value / 1000;
        trip_distance = Math.ceil(trip_distance * 10) / 10;
        console.log(trip_distance);
      }
    }),
      err => {
        console.log("ERROR!: ", err);
      }
    );
  }


  makeMarker(position, icon, title, map) {
    new google.maps.Marker({
      position: position,
      map: map,
      icon: icon,
      title: title
    });
  }
}
