
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http'; 
import { UserData } from '../providers/user-data/user-data';

@Injectable()
export class Common {

  static customer_id: any;
    constructor(public events: Events,
        public http: Http,
        public userdata: UserData,
        public storage: Storage,
        public platform: Platform) {
        this.platform.ready().then(() => {

        });
    }


  private URL_MAIN_ROOT: string = "http://googlehub.com/cab/web_service/";
  public URL_MAIN_URL: string = "http://googlehub.com/cab/"; 
  
  public URL_RESET_PASSWORD: string = this.URL_MAIN_ROOT + "userResetPassword";

  public URL_FEEDBACK: string = this.URL_MAIN_ROOT + "feedback";
  
  public URL_CHECK_USER_EXIST: string = this.URL_MAIN_ROOT + "checkUserExists";
  
  public URL_SEND_OTP: string = this.URL_MAIN_ROOT + "new_user_send_otp";
  public URL_FORGOT_SEND_OTP: string = this.URL_MAIN_ROOT + "send_otp_recover_password";
  
  public URL_VERIFY_OTP: string = this.URL_MAIN_ROOT + "verify_otp"; 

  public ADD_WALLET_AMOUNT: string = this.URL_MAIN_URL + "paytm/addWallteAmount"; 
  
  public GET_CHECKSUM: string = this.URL_MAIN_URL + "paytm/getChecksum"; 
  
  public URL_GET_DRIVER_INFO: string = this.URL_MAIN_ROOT + "get_driver_info";
  
  public URL_BOOK_CAB: string = this.URL_MAIN_ROOT + "book_cab";

  public URL_CHANGE_BOOKING_PAYMENT_STATUS: string = this.URL_MAIN_ROOT + "update_payment_status";
 
  public URL_FETCH_CAB_DETAIL: string = this.URL_MAIN_ROOT + "fetch_cab_details";
  
  public URL_LOAD_TRIPS: string = this.URL_MAIN_ROOT + "load_trips";

  public URL_LOAD_HOSPITAL: string = this.URL_MAIN_ROOT + "getHospitals";

  public URL_UPDATE_PASSWORD: string = this.URL_MAIN_ROOT + "update_pwd";

  public URL_SIGNUP: string = this.URL_MAIN_ROOT + "sign_up";

  public URL_PROFILE_UPDATE: string = this.URL_MAIN_ROOT + "update_profile";
  
  public URL_LOGIN: string = this.URL_MAIN_ROOT + "login";

  public URL_CANCEL_BOOKING: string = this.URL_MAIN_ROOT + "userBookingCancellation";

  public URL_CANCEL_BOOKING_LIST: string = this.URL_MAIN_ROOT + "cancellation_list";

  public URL_GET_DRIVER_LAT_LONG: string = this.URL_MAIN_ROOT + "get_driver_lat_lng";

  public URL_UPDATE_DROP_POINT: string = this.URL_MAIN_ROOT + "update_drop_point";

  public URL_CATEGORY: string = this.URL_MAIN_ROOT + "getCategories";

  public URL_GET_SUBCATEGORY: string = this.URL_MAIN_ROOT + "getSubCategories";

  public URL_GET_HOSPITAL_DETAIL: string = this.URL_MAIN_ROOT + "getBookedHospital";

  public URL_GET_TRANSACTION: string = this.URL_MAIN_ROOT + "transaction";

}
