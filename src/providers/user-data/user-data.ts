import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';


  constructor(
    public events: Events,
    public storage: Storage
  ) { }

  hasFavorite(sessionName: string): boolean {
    // this.getFavorite().then((value: any) => {
    //   this._favorites = value;
    // });
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addWishList(sessionName: string): void {
    this._favorites.push(sessionName);
    this.storage.set('wishlist', this._favorites);
    this.events.publish('user:wishlist');
  };


  removeWishList(sessionName: string): void {

    this.getWishList().then((value: any) => {
      this._favorites = value;
      console.log(this._favorites);
      console.log(sessionName);

      let index = this._favorites.findIndex((x: any) => x.pet_id === sessionName)
      console.log(index);

      if (index > -1) {
        this._favorites.splice(index, 1);
      }
      console.log(this._favorites);
      this.storage.set('wishlist', this._favorites);

    });
    this.events.publish('user:wishlist');
  };


  getWishList(): Promise<string> {
    return this.storage.get('wishlist').then((value) => {
      return value;
    });
  };


  login(username: string): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:login');
  };

  signup(username: string): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:signup');
  };

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.storage.remove('user_id');
    this.storage.remove('email');
    this.storage.remove('password');
    this.storage.remove('mobileno');
    this.storage.remove('city_state_id');
    this.storage.remove('pincode');
    this.storage.remove('address');
    this.storage.remove('is_call_allow');
    this.events.publish('user:logout');
  };

  setUsername(username: string): void {
    this.storage.set('username', username);
  };

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };


  setlocationtitle(title: any): void {
    this.storage.set('locationtitle', title);
  }

  getlocationtitle(): Promise<string> {
    return this.storage.get('locationtitle').then((value) => {
      return value;
    });
  };

  setLat(lat: any): void {
    this.storage.set('lat', lat);
  };


  setlng(lng: any): void {
    this.storage.set('lng', lng);
  };


  setSessionId(sessionid: any) {
    this.storage.set('session_id', sessionid);
  }

  getSessionId() {
    return this.storage.get('session_id').then((value) => {
      return value;
    });
  }

  getlat(): Promise<string> {
    return this.storage.get('lat').then((value) => {
      return value;
    });
  };


  getlng(): Promise<string> {
    return this.storage.get('lng').then((value) => {
      return value;
    });
  };



  user_register(user_id: any, username: any, email: any, password: any, mobileno: any, city_state_id: any, pincode: any, address: any, is_call_allow: any) {

    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);

    this.storage.set('user_id', user_id);
    this.storage.set('email', email);
    this.storage.set('password', password);
    this.storage.set('mobileno', mobileno);
    this.storage.set('city_state_id', city_state_id);
    this.storage.set('pincode', pincode);
    this.storage.set('address', address);
    this.storage.set('is_call_allow', is_call_allow);

    this.events.publish('user:login');
  }

  user_update(city_state_id: any, pincode: any, address: any, email: any, is_call_allow: any, mobileno: any) {
    this.storage.set('city_state_id', city_state_id);
    this.storage.set('address', address);
    this.storage.set('pincode', pincode);
    this.storage.set('email', email);
    this.storage.set('mobileno', mobileno);
    this.storage.set('is_call_allow', is_call_allow);
  }


  getUser_ID(): Promise<string> {
    return this.storage.get('user_id').then((value) => {
      return value;
    });
  };
  getUserEmail(): Promise<string> {

    return this.storage.get('email').then((value) => {
      return value;
    });

  };
  getUserpassword(): Promise<string> {
    return this.storage.get('password').then((value) => {
      return value;
    });
  };
  getUserMobileno(): Promise<string> {
    return this.storage.get('mobileno').then((value) => {
      return value;
    });
  };

  getCity_State_ID(): Promise<string> {
    return this.storage.get('city_state_id').then((value) => {
      return value;
    });
  };

  getPinCode(): Promise<string> {
    return this.storage.get('pincode').then((value) => {
      return value;
    });
  };

  getGstin(): Promise<string> {
    return this.storage.get('address').then((value) => {
      return value;
    });
  };

  getAllowCall(): Promise<string> {
    return this.storage.get('is_call_allow').then((value) => {
      return value;
    });
  };


  public success: boolean;
  public user_id: any;
  public user_name: any;
  public user_email: any;
  public user_photo: any;

  fblogin(username: any, id: any, email: any, image: any) {
    this.user_id = id;
    this.user_name = name;
    this.user_email = email;
    this.user_photo = image;

    this.storage.set(this.HAS_LOGGED_IN, true);

    this.storage.set('user_name', username);
    this.storage.set('user_id', id);
    this.storage.set('user_email', email);
    this.storage.set('user_photo', image);

    this.events.publish('user:login');
  }

  getuser_name() {
    return this.storage.get('user_name').then((value) => {
      return value;
    });
  }

  fblogout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('user_name');
    this.storage.remove('user_id');
    this.storage.remove('user_email');
    this.storage.remove('user_photo');

    this.events.publish('user:logout');
  }

  getUserProfile() {
    return this.storage.get('user_photo').then((value) => {
      return value;
    });
  }




  setUserData(user_data: any) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.storage.set('user_data', user_data);

    this.events.publish('user:login', { "phone": user_data.Mobile, "name": user_data.User_name });
    //this.events.publish('user:login', user_data.userphone);

  }

  getUserData() {
    return this.storage.get('user_data').then((value) => {
      return value;
    });
  }

  userlogout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('user_data');
    this.events.publish('user:logout');
  };

  // getUserEmail() {
  //   return this.storage.get('user_email').then((value) => {
  //     return value;
  //   });
  // }

  // getUserId() {
  //   return this.storage.get('user_id').then((value) => {
  //     return value;
  //   });
  // }


  setDeviceToken(deviceToken: string) {

    this.storage.set('deviceToken', deviceToken);
  }

  getDeviceToken() {
    return this.storage.get('deviceToken').then((value) => {
      return value;
    });
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };
}
