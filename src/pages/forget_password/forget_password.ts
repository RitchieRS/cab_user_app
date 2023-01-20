import { Component } from '@angular/core';
import { VerifyOtpPage } from '../verify_otp/verify_otp';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
//import { UserData } from '../../providers/user-data';
//import { HomePage } from '../home/home';
//import { Common } from '../../providers/common';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Common } from '../../providers/common';

@Component({
  selector: 'page-forget_password',
  templateUrl: 'forget_password.html'
})
export class ForgetPasswordPage {

  otp: any;
  ionform: FormGroup;
  submitted = false;
  constructor(public navCtrl: NavController,
    //public common: Common,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public common: Common,
    public formBuilder: FormBuilder,
    public http: Http) {

    this.ionform = formBuilder.group({
      mobileno: ['', Validators.compose([Validators.minLength(10), Validators.required])],
    })
  }

  // onSignup() {
  //   this.submitted = true;
  //   if (this.ionform.valid) {
  //     this.otp = this.getotp(4);
  //     this.navCtrl.push(VerifyOtpPage, { otp: this.otp, mobile: this.ionform.value.mobileno });
  //   }
  // }

  onSend() {


    this.submitted = true;
    if (this.ionform.valid) {

      var param = {
        "mobile": this.ionform.value.mobileno
      }

      console.log("web_service/checkUserExists", param)

      this.http.post(this.common.URL_CHECK_USER_EXIST, param)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          if (data.success) {
            this.check(data.user_id);
          }
          else {
            //this.navCtrl.push(RegistrationPage, { mobile: this.mobileno });
            alert("Invalid MobileNo, Please Enter Valid Mobileno");
            return;
          }
        }, error => {
          console.log(error);
          alert(JSON.stringify(error));
        });


    }
    else {
      alert("Invalid Please Enter Valid Mobileno");
      return;
    }

  }

  getotp(length: any) {
    var text = "";
    var possible = "0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  onLogin() {
    this.navCtrl.push('LoginPage');
  }

  check(driver_id: any) {
    var params = "mobile_no=" + this.ionform.value.mobileno;

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    console.log(params);

    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();

    this.http.post(this.common.URL_FORGOT_SEND_OTP, params, { headers: headers })
      //.map(res => res.json())
      .subscribe(res => {
        loader.dismiss();
        let data = res.json();
        console.log(data);
        if (data.success) {
          console.log("done");
          this.navCtrl.push(VerifyOtpPage, { mobile: this.ionform.value.mobileno, is_verified: true, user_detail: driver_id });
        }
        else {
          const toast = this.toastCtrl.create({
            message: data.message,
            duration: 2000
          });
          toast.present();

        }
      }, error => {

        loader.dismiss();
        var data = error.json();
        console.log(data);

      });
  }
}
