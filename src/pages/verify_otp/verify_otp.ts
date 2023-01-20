import { Component } from '@angular/core';
import { SignupPage } from '../signup/signup';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
//import { UserData } from '../../providers/user-data';
import { Http, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangePasswordPage } from '../change-password/change-password';
import { Common } from '../../providers/common';

@Component({
  selector: 'page-verify_otp',
  templateUrl: 'verify_otp.html'
})
export class VerifyOtpPage {
  user_detail: any;
  is_verified: boolean = false;
  otp: any;
  mobileno: any;
  ionform: FormGroup;
  submitted = false;

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public common:Common,
    public http: Http,
    public formBuilder: FormBuilder) {

    if (this.navParams.get('otp')) {
      console.log(this.navParams.get('otp'));

      this.otp = this.navParams.get('otp');
      alert("your otp is " + this.otp);
    }

    if (this.navParams.get('is_verified')) {
      console.log(this.navParams.get('is_verified'));
      this.is_verified = this.navParams.get('is_verified');
    }

    if (this.is_verified) {
      if (this.navParams.get('user_detail')) {
        console.log(this.navParams.get('user_detail'));
        this.user_detail = this.navParams.get('user_detail');
      }
    }

    if (this.navParams.get('mobile')) {
      console.log(this.navParams.get('mobile'));
      this.mobileno = this.navParams.get('mobile');
    }

    this.ionform = formBuilder.group({
      otp: ['', Validators.compose([Validators.required])]
    })
  }

  onSignup() {

    this.submitted = true;
    if (this.ionform.valid) {

      var params = "mobile_no=" + this.mobileno +
        "&verify_otp=" + this.ionform.value.otp;
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      console.log(params);

      let loader = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loader.present();
      let url = this.common.URL_VERIFY_OTP
      this.http.post(url, params, { headers: headers })
        //.map(res => res.json())
        .subscribe(res => {
          loader.dismiss();
          let data = res.json();
          console.log(data);
          if (data.success) {

            if (this.is_verified) {
              this.navCtrl.push(ChangePasswordPage, { mobile: this.mobileno, user_detail: this.user_detail });
            }
            else {
              this.navCtrl.push(SignupPage, { mobile: this.mobileno });
            }
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
    else {
      alert("Please ente OTP.");
      return;
    }
  }

}
