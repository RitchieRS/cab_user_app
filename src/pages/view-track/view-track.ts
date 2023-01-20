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
      path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
      scale: 0.4,
      fillColor: "#F2C21E", //<-- Car Color, you can change it 
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
