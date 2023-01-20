import { Component } from '@angular/core';
import { VerifyOtpPage } from '../verify_otp/verify_otp';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
//import { UserData } from '../../providers/user-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Common } from '../../providers/common';


@Component({
  selector: 'page-verify_number',
  templateUrl: 'verify_number.html'
})
export class VerifyNumberPage {

  otp: any;
  ionform: FormGroup;
  submitted = false;
  constructor(public toastCtrl: ToastController, public http: Http,
    public common:Common,
    public navCtrl: NavController, public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController) {

    this.ionform = formBuilder.group({
      mobileno: ['', Validators.compose([Validators.minLength(10), Validators.required])],
    })
  }


  onSignup() {
    this.submitted = true;

    if (this.ionform.valid) {
      var params = "mobile_no=" + this.ionform.value.mobileno;
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      console.log(params);

      let loader = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loader.present();
      let url = this.common.URL_SEND_OTP
      this.http.post(url, params, { headers: headers })
        //.map(res => res.json())
        .subscribe(res => {
          loader.dismiss();
          let data = res.json();
          console.log(data);
          if (data.success) {
            console.log("done");
            this.navCtrl.push(VerifyOtpPage, { mobile: this.ionform.value.mobileno });
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

  onTermsPage() {
    this.navCtrl.push('TermsAndConditionPage');
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

}
