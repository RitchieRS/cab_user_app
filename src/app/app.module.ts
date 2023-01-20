import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MainLandingPage } from '../pages/main-landing/main-landing';
import { HttpModule } from '@angular/http';
import { UserData } from '../providers/user-data/user-data';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';

//import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { CallNumber } from '@ionic-native/call-number';
import { InAppBrowser } from '@ionic-native/in-app-browser';

//import { GooglePlacesAutocompleteComponentModule } from 'ionic2-google-places-autocomplete';

import { Connectivity } from '../providers/connectivity-service';
import { MapGoogle } from '../providers/google-maps';
import { ProfilePage } from '../pages/profile/profile';
import { MytripPage } from '../pages/mytrip/mytrip';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { TripdetailPage } from '../pages/tripdetail/tripdetail';
import { ViewTrackPage } from '../pages/view-track/view-track';
import { WalletPage } from '../pages/wallet/wallet';

import { VerifyNumberPage } from '../pages/verify_number/verify_number';
import { VerifyOtpPage } from '../pages/verify_otp/verify_otp';
import { ContactUsPage } from '../pages/contact_us/contact_us';

import { ForgetPasswordPage } from '../pages/forget_password/forget_password';
import { ChangePasswordPage } from '../pages/change-password/change-password';

import { Common } from '../providers/common';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MainLandingPage,
    ProfilePage,
    LoginPage,
    TripdetailPage,
    MytripPage,
    SignupPage,
    VerifyOtpPage,
    VerifyNumberPage,
    ViewTrackPage,
    ContactUsPage,
    ForgetPasswordPage,
    ChangePasswordPage,
    WalletPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    //GooglePlacesAutocompleteComponentModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: HomePage, name: 'HomePage', segment: 'home' },
        { component: ProfilePage, name: 'ProfilePage', segment: 'profilepage' },
        { component: MainLandingPage, name: 'MainLandingPage', segment: 'mainlanding' },
        { component: MytripPage, name: 'MytripPage', segment: 'mytrip' },
        { component: VerifyNumberPage, name: 'VerifyNumberPage', segment: 'verifynumber' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: VerifyOtpPage, name: 'VerifyOtpPage', segment: 'verifyotp' },
        { component: ViewTrackPage, name: 'ViewTrackPage', segment: 'view_track' },
        { component: TripdetailPage, name: 'TripdetailPage', segment: 'trip_detail' },
        { component: ContactUsPage, name: 'ContactUsPage', segment: 'contact_us' },
        { component: ForgetPasswordPage, name: 'ForgetPasswordPage', segment: 'forget_password' },
        { component: ChangePasswordPage, name: 'ChangePasswordPage', segment: 'change_password' },
        { component: WalletPage, name: 'WalletPage', segment: 'wallet' }
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MytripPage,
    TripdetailPage,
    SignupPage,
    ProfilePage,
    LoginPage,
    MainLandingPage,
    VerifyOtpPage,
    VerifyNumberPage,
    ViewTrackPage,
    ContactUsPage,
    ForgetPasswordPage,
    ChangePasswordPage,
    WalletPage
  ],

  providers: [
    StatusBar,
    MapGoogle,
    SplashScreen,
    Connectivity,
    CallNumber,
    // GoogleMaps,
    Network,
    Geolocation,
    NativeGeocoder,
    Common,
    InAppBrowser,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserData
  ]
})
export class AppModule { }
