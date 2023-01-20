import { Component, ViewChild, ElementRef, OnInit, ɵConsole } from '@angular/core';
import { Platform, Events, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserData } from '../providers/user-data/user-data';
//import { HomePage } from '../pages/home/home';
import { Nav } from 'ionic-angular';
import { MapGoogle } from '../providers/google-maps';
//import { HomePage } from '../pages/home/home';
import { Geolocation } from '@ionic-native/geolocation';
declare var google: any;

import { HomePage } from '../pages/home/home';
//import { MainLandingPage } from '../pages/main-landing/main-landing';
import { ProfilePage } from '../pages/profile/profile';
import { MytripPage } from '../pages/mytrip/mytrip';
import { LoginPage } from '../pages/login/login';
import { WalletPage } from '../pages/wallet/wallet';
@Component({
  templateUrl: 'app.html',
  selector: 'page-app-css',
})
export class MyApp implements OnInit {

  rootPage: any;
  @ViewChild(Nav) nav: Nav;

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;


  autocompleteService: any;
  placesService: any;

  username: any;
  userphone: any;
  usermail: any;
  constructor(public userData: UserData,
    public platform: Platform,
    public maps: MapGoogle,
    public geolocation: Geolocation,
    public events: Events,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen) {

    this.platform.ready().then(() => {
      let options = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 60000
      };
      this.geolocation.getCurrentPosition(options).then((resp) => {
        console.log(resp.coords.latitude)
        console.log(resp.coords.longitude)
        // resp.coords.longitude
        this.userData.setLat(resp.coords.latitude);
        this.userData.setlng(resp.coords.longitude);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    });
  }



  async ngOnInit() {

    this.events.subscribe('user:login', (val) => {
      console.log(val);
      if (val) {

        this.username = val.name;
        this.userphone = val.phone
      }
    });

    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.maps.map);

      this.userData.setlocationtitle('');
      console.log("maps : ", this.maps)
      this.userData.setLat(this.maps.map.data.map.center.lat());
      this.userData.setlng(this.maps.map.data.map.center.lng());

    });
    console.log(mapLoaded);
    console.log(this.placesService);
    await setInterval(() => {
      this.platformReady();
    }, 2000);
  }


  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      //console.log("go into start");
      this.splashScreen.hide();
      // this.statusBar.styleDefault();
      this.userData.hasLoggedIn().then((hasLoggedIn) => {

        //console.log(hasLoggedIn);
        if (hasLoggedIn) {
          console.log('hasLoggedIn : ', hasLoggedIn)
          //console.log("hello");
          this.rootPage = HomePage;
          this.get_usersession();
        } else {
          //console.log("hello2");
          this.rootPage = LoginPage;
        }
      });
    });

  }

  get_usersession() {
    //console.log("val");

    this.userData.getUserData().then(val => {
      //console.log(val);

      this.username = val.User_name;
      this.userphone = val.Mobile
      this.usermail = val.Email;

    })
  }




  onTrips() {
    this.nav.setRoot(MytripPage);
  }

  onProfile() {
    this.nav.setRoot(ProfilePage);
  }

  onHome() {
    this.nav.setRoot(HomePage);
  }

  onWallet() {
    this.nav.setRoot(WalletPage);
  }

  logout() {
    console.log("logout");
    this.userData.logout();
    this.nav.setRoot(LoginPage);
  }



}

