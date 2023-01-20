import { Component, ViewChild, NgZone, ElementRef, OnInit } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { UserData } from '../../providers/user-data/user-data';
import { MapGoogle } from '../../providers/google-maps';
import { Platform } from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { MytripPage } from '../mytrip/mytrip';
import { Common } from '../../providers/common';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Geolocation } from '@ionic-native/geolocation';

declare var paytm: any;
//import { GooglePlacesAutocompleteComponent } from 'ionic2-google-places-autocomplete';
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {

  @ViewChild('map_canvas') elemElem: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  Location = 'You are here';
  start_box = { 'location': null, 'lat': null, 'lng': null };
  end_box = { 'location': null, 'lat': null, 'lng': null };
  //this.autocomplete =

  start_box_copy = {};
  end_box_copy = {};
  current_box = {};
  disable_input: string = 'disable_input';
  current_lat: any;
  current_lng: any;

  my_model;
  pop_status = false;
  //map: GoogleMap;

  trip_rate: any;

  marker: any;
  directionsService: any;
  directionsDisplay: any;

  Trip_now = true;
  book_date = new Date();
  cabs: any;
  active_cab: any;
  selected_cab: any;
  //public marker: Marker;
  trip_distance: any;
  query: any;
  GoogleAutocomplete: any;
  autocomplete: any = { input: '' };
  dropcomplete: any = { input: '' };

  autocompleteItems: any;
  pickupautocomplteItems: any;
  cabist: any

  btngo: boolean = true;
  btnbook: boolean = false;

  username: any;
  usermail: any;
  userphone: any;
  loader: any;
  user_token: any;

  driver_icon: any;
  current_icon: any;
  icons: any;
  show_booking_types: any = true;
  selected_trip_type: any;
  trip_types: any = [];
  active_type: any;
  userid: any;

  activateFilterBlock: boolean = false;

  autocompleteService: any;
  placesService: any;
  extraKm: number;
  constructor(public navCtrl: NavController,
    public platform: Platform,
    public http: Http,
    public userData: UserData,
    public zone: NgZone,
    public common: Common,
    public maps: MapGoogle,
    private geolocation: Geolocation,
    private iab: InAppBrowser,
    public loadCtrl: LoadingController,
    private nativeGeocoder: NativeGeocoder) {
    this.trip_types.push({ type: 'Point To Point', value: 'Point to Point Transfer', img: 'assets/imgs/point.png' });
    this.trip_types.push({ type: 'Hourly Rental', value: 'Hourly Rental', img: 'assets/imgs/hourly.png' });
    this.trip_types.push({ type: 'Outstation', value: 'Outstation Transfer', img: 'assets/imgs/outstation.png' });
    //this.loadMap();
  }
  reLocate() {
    this.dropcomplete.input = '';
    setTimeout(() => { this.loadMap() }, 500);
  }
  ngOnInit() {
    this.platform.ready().then(() => {
      this.geolocation.getCurrentPosition().then((resp) => {
        console.log(resp.coords.latitude)
        console.log(resp.coords.longitude)
        // resp.coords.longitude
        this.userData.setLat(resp.coords.latitude);
        this.userData.setlng(resp.coords.longitude);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    });
    this.get_usersession();
  }

  startOver() {
    this.show_booking_types = true;
  }

  setBookingType() {
    this.show_booking_types = false;
  }

  clicked_type(index) {
    this.disable_input = '';
    this.makeMarker(null, '', '', null);
    this.active_type = index;
    // this.animate_tab();
    this.selected_trip_type = this.trip_types[index];
    this.show_booking_types = false;
    console.log(this.selected_trip_type);
  }

  ionViewDidLoad() {


    let mapLoaded = this.maps.init(this.elemElem.nativeElement, this.pleaseConnect.nativeElement).then(() => {
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.directionsService = new google.maps.DirectionsService;
      this.directionsDisplay = new google.maps.DirectionsRenderer;

    }).catch((error: any) => {

      console.log(error)
    });

    setTimeout(() => { this.loadMap() }, 500);

    this.driver_icon = {
      start: {
        path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
        scale: 0.4,
        fillColor: "#F2C21E", //<-- Car Color, you can change it 
        fillOpacity: 1,
        strokeWeight: 1,
        anchor: new google.maps.Point(0, 5)
      }
    }

    this.current_icon = {
      ic: new google.maps.MarkerImage(
        // URL
        'http://maps.google.com/mapfiles/ms/micons/blue.png',
        new google.maps.Size(44, 32),
        new google.maps.Point(0, 0),
        new google.maps.Point(22, 32))

    }


    this.icons = {
      start: new google.maps.MarkerImage(
        // URL
        'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000',
        new google.maps.Size(44, 32),
        new google.maps.Point(0, 0),
        new google.maps.Point(22, 32)),
      end: new google.maps.MarkerImage(
        // URL
        'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=D|FF0000|000000',
        new google.maps.Size(44, 32),
        new google.maps.Point(0, 0),
        new google.maps.Point(22, 32))
    };

    console.log(mapLoaded);
    console.log(this.placesService);
  }


  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }

    let location = {
      lat: this.current_lat,
      lng: this.current_lng,
    };

    let config = {
      bounds: new google.maps.LatLngBounds(location),
      input: this.autocomplete.input
    }

    this.autocompleteService.getPlacePredictions(config,
      (predictions, status) => {
        console.log(status);
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });

  }


  dropSearchResults() {
    if (this.dropcomplete.input == '') {
      this.pickupautocomplteItems = [];
      return;
    }

    let location = {
      lat: this.current_lat,
      lng: this.current_lng,
    };

    let config = {
      bounds: new google.maps.LatLngBounds(location),
      input: this.dropcomplete.input
    }

    this.autocompleteService.getPlacePredictions(config,
      (predictions, status) => {
        console.log(status);
        this.pickupautocomplteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.pickupautocomplteItems.push(prediction);
          });
        });
      });

  }




  loadDriver() {

    this.loader = this.loadCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loader.present();

    console.log("web_service/get_driver_info?latitude=" + this.start_box.lat + "&longitude=" + this.start_box.lng + "&taxi_type=" + this.selected_cab.cartype);

    this.http.get(this.common.URL_GET_DRIVER_INFO + "?latitude=" + this.start_box.lat + "&longitude=" + this.start_box.lng + "&taxi_type=" + this.selected_cab.cartype)
      .map(res => res.json())
      .subscribe(data => {
        this.loader.dismiss();
        this.btnbook = true;
        /*if (data.success) {
          data.data.forEach(element => {
            this.makeMarker({ lat: parseFloat(element.latitude), lng: parseFloat(element.longitude) }, this.driver_icon.start, element.name, this.maps.map);
            //console.log(this.makeMarker({ lat: element.latitude, lng: element.longitude }, this.driver_icon.start, element.name, this.maps.map));
          });

          this.btnbook = true;

        }
        else {
          alert("Driver Not found this location");

          console.log("error");
          this.loader.dismiss();
          this.btnbook = false;
        }*/
      }, error => {
        console.log(error);
        this.loader.dismiss();
      });

  }



  get_usersession() {
    this.userData.getUserData().then(val => {
      console.log(val);
      this.userid = val.Id;
      this.username = val.User_name;
      this.userphone = val.Mobile
      this.usermail = val.Email;
      this.user_token = val.token;

    })
  }


  // check_Driver() {
  //   setTimeout(() => {
  //     this.loadDriver()
  //   }, 2000);
  // }

  book_cab() {

    this.loader = this.loadCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loader.present();

    var post_data = {
      "token": this.user_token,
      "transfertype": this.selected_trip_type.value,
      "book_date": this.book_date,
      "pickup_lat": this.start_box.lat,
      "pickup_lng": this.start_box.lng,
      "pickup_area": this.start_box.location,
      "drop_area": this.end_box.location,
      "taxi_type": this.cabs[this.active_cab].cartype,
      "km": this.trip_distance,
      "amount": this.trip_rate,
      "mobileno": this.userphone,
      "user_name": this.username,
    }
    //console.log(post_data);
    console.log("web_service/book_cab")

    this.http.post(this.common.URL_BOOK_CAB, post_data)
      .subscribe(
        res => {
          let data = res.json();
          console.log(data);
          this.loader.dismiss();
          if (data.success) {
            //if (data.pay_online) {
            //  this.makePayment_paytm(data);
            //} else {
            this.navCtrl.setRoot(MytripPage);
            // }

          }
          else {
            alert(data.message);
          }
        },
        err => {
          console.log("ERROR!: ", err);
          this.loader.dismiss();
        }
      );

  }
  makePayment_paytm(orderResponse: any) {


    let txnRequest = {
      "MID": "XXXXXXXX",
      "ORDER_ID": orderResponse.trip_id,
      "CHANNEL_ID": "WAP",
      "CUST_ID": this.userid,
      "MOBILE_NO": this.userphone,
      "EMAIL": this.usermail,
      "TXN_AMOUNT": Math.round(orderResponse.pay_online_amount),
      "WEBSITE": "WEBSTAGING",
      "INDUSTRY_TYPE_ID": "Retail",
      "CALLBACK_URL": "https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=" + orderResponse.trip_id,
      "ENVIRONMENT": "staging",
      "CHECKSUMHASH": "",
    }
    console.log("paytm/getChecksum");
    this.http.post(this.common.GET_CHECKSUM, txnRequest).subscribe(res => {
      let data = res.json();

      if (data.success) {
        txnRequest.CHECKSUMHASH = data.checkSum;
        console.log(JSON.stringify(txnRequest));

        const successCallback = (response) => {
          console.log(JSON.stringify(response));
          if (response.STATUS == "TXN_SUCCESS") {
            console.log("Done");
            alert("Payment Done");
            this.paymentStatus(orderResponse, 1);

          } else {
            console.log(response);
            alert('Please try again! something went wrong');
            this.navCtrl.setRoot(MytripPage);
            // this.paymentStatus(orderResponse, 0);
          }
        }
        const failureCallback = (error) => {
          console.log(JSON.stringify(error));
          alert('Payment Cancel..!'); this.navCtrl.setRoot(MytripPage);
          //   this.paymentStatus(orderResponse, 0);
        }
        paytm.startPayment(txnRequest, successCallback, failureCallback);
      } else {
        console.log("Something went wrong");
        alert('Please try again! something went wrong');
        this.navCtrl.setRoot(MytripPage);
      }
    });
  }
  paymentStatus(orderResponse: any, payment_status: any) {
    this.loader = this.loadCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loader.present();

    var post_data = {
      "paid_amount": orderResponse.pay_online_amount,
      "trip_id": orderResponse.trip_id,
      "user_name": this.username,
      "taxi_type": orderResponse.taxi_type,
      "mobileno": this.userphone,
      'amount': orderResponse.amount,
      "payment_status": payment_status,
    }
    //console.log(post_data);
    console.log("web_service/book_cab")

    this.http.post(this.common.URL_CHANGE_BOOKING_PAYMENT_STATUS, post_data)
      .subscribe(
        res => {
          let data = res.json();
          console.log(data);
          this.loader.dismiss();
          if (data.success) {
            this.navCtrl.setRoot(MytripPage);
          }
          else {
            alert(data.message);
          }
        },
        err => {
          console.log("ERROR!: ", err);
          this.loader.dismiss();
        }
      );
  }

  selectPlace(place: any) {
    console.log(place);

    this.autocomplete.input = place.description;
    this.placesService.getDetails({ placeId: place.place_id }, (details: any) => {
      this.zone.run(() => {
        this.end_box.location = place.description;
        this.end_box.lat = details.geometry.location.lat();
        this.end_box.lng = details.geometry.location.lng();
      });
      console.log(this.end_box);
    });
    this.autocompleteItems = [];

  }


  selectdropPlace(place: any) {
    console.log(place);
    this.dropcomplete.input = place.description;
    this.placesService.getDetails({ placeId: place.place_id }, (details: any) => {
      this.zone.run(() => {
        this.start_box.location = place.description;
        this.start_box.lat = details.geometry.location.lat();
        this.start_box.lng = details.geometry.location.lng();
      });

      console.log(this.start_box);

    });
    this.pickupautocomplteItems = [];

  }


  loadMap() {
    this.userData.getlat().then((glat: any) => {
      this.userData.getlng().then((glng: any) => {
        console.log('new marker');

        console.log(glat);
        console.log(glng);
        if (glat && glng) {
          this.current_lat = glat;
          this.current_lng = glng;

          let latLng = new google.maps.LatLng(parseFloat(glat), parseFloat(glng));
          console.log(latLng);

          this.makeMarker({ lat: glat, lng: glng }, this.current_icon.ic, "your location", this.maps.map);  //current_icon
          let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 5
          };
          this.start_box.lat = glat;
          this.start_box.lng = glng;
          this.nativeGeocoder.reverseGeocode(glat, glng, options)
            .then((result: NativeGeocoderReverseResult[]) => {
              console.log(JSON.stringify(result[0]));
              this.dropcomplete.input = result[0].thoroughfare + " " + result[0].subLocality;
              this.start_box.location = result[0].thoroughfare + " " + result[0].subLocality;

            })
            .catch((error: any) => console.log(error));
          console.log(this.start_box);
        }


      })

    })


  }


  // addInfoWindow(marker, content) {

  //   let infoWindow = new google.maps.InfoWindow({
  //     content: content
  //   });

  //   google.maps.event.addListener(marker, 'click', () => {
  //     infoWindow.open(this.maps.map, marker);
  //   });

  // }

  // codeLatLng(lat, lng) {

  //   this.loader = this.loadCtrl.create({
  //     content: 'Getting current location...'
  //   });
  //   this.loader.present();

  //   let options: NativeGeocoderOptions = {
  //     useLocale: true,
  //     maxResults: 5
  //   };

  //   this.nativeGeocoder.reverseGeocode(lat, lng, options)
  //     .then((result: NativeGeocoderReverseResult[]) => {
  //       console.log(JSON.stringify(result[0]));

  //     })
  //     .catch((error: any) => console.log(error));

  // }


  ride() {

    this.makeMarker('', '', '', this.maps.map);

    if (this.start_box.lat == null) {
      alert('Enter pickup location');
      return;
    }

    if (this.end_box.lat == null) {
      alert('Enter drop location');
      return;
    }
    this.activateFilterBlock = true;
    this.fetch_cabs();

  }

  public google: any;
  fetch_cabs() {

    this.loader = this.loadCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loader.present();

    var post_data = {
      "transfertype": this.selected_trip_type.value,
      "book_date": this.book_date,
    }

    console.log("web_service/fetch_cab_details");

    this.http.post(this.common.URL_FETCH_CAB_DETAIL, post_data)
      .subscribe(
        res => {
          let data = res.json();
          this.loader.dismiss();
          this.btngo = false;
          if (data.cabs.length == 0) {
            alert('no cabs')
          } else {

            this.cabs = data.cabs;
            console.log(this.cabs);
            this.active_cab = 0;
            this.selected_cab = this.cabs[0];

            var dist_promise = this.calcRoute();
            console.log(data);
            console.log(dist_promise);

            this.clicked_item(0);
          }
        },
        err => {
          console.log("ERROR!: ", err);
          this.loader.dismiss();
        }
      );
  }

  calcRoute() {

    console.log("try")
    var request = {
      origin: { lat: parseFloat(this.start_box.lat), lng: parseFloat(this.start_box.lng) },
      destination: { lat: parseFloat(this.end_box.lat), lng: parseFloat(this.end_box.lng) },
      travelMode: google.maps.DirectionsTravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC
    };

    console.log(request);

    this.directionsDisplay.setMap(this.maps.map);
    this.directionsDisplay.setPanel(this.elemElem.nativeElement);

    this.directionsService.route(request, ((response, status) => {
      console.log("calculate")
      if (status == google.maps.DirectionsStatus.OK) {

        new google.maps.DirectionsRenderer({
          map: this.maps.map,
          directions: response,
          suppressMarkers: true
        });
        var leg = response.routes[0].legs[0];
        this.makeMarker(leg.start_location, this.icons.start, 'Origin', this.maps.map);
        this.makeMarker(leg.end_location, this.icons.end, 'Destination', this.maps.map);

        this.trip_distance = response.routes[0].legs[0].distance.value / 1000;
        this.trip_distance = Math.ceil(this.trip_distance * 10) / 10;

        if (this.trip_distance > this.selected_cab.intialkm) {
          this.extraKm = this.trip_distance - this.selected_cab.intialkm;
          console.log("extraKm : ", this.extraKm);
          this.trip_rate = parseInt(this.selected_cab.intailrate) + (this.extraKm * this.selected_cab.standardrate);
        } else {
          this.trip_rate = this.selected_cab.intailrate;
        }
        console.log(this.trip_distance);
        console.log(this.trip_rate);
        // this.directionsDisplay.setDirections(response);
        // this.animateMyPop();
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


  round_num(num) {
    return Math.ceil(num * 10) / 10;
  }

  clicked_item(index) {
    this.makeMarker(null, '', '', null);
    this.active_cab = index;
    // this.animate_tab();
    this.selected_cab = this.cabs[index];
  }


  confirm() {
    this.activateFilterBlock = false;
    setTimeout(() => {
      this.loadDriver()
    }, 1000);
  }


  cancel_tab() {
    console.log("hello");
    this.btngo = true;
    this.activateFilterBlock = false;
  }


  call_page() {
    this.navCtrl.setRoot(HomePage);
  }
  animate_tab() {
    document.getElementById('#tab-hide').className = "hidden";
  }



}
