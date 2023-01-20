import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserData } from '../../providers/user-data/user-data';

import { LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';

import { Common } from '../../providers/common';


@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html'
})
export class ChangePasswordPage {

  public pageTitle: any = "Change Password";
  ionform: FormGroup;
  submitAttempt: boolean = false;
  public companyItem: any;
  public hide: boolean = true;
  user_detail: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public common:Common,
    public toastCtrl: ToastController,
    public userData: UserData, private http: Http, private loadingController: LoadingController) {


    if (this.navParams.get('user_detail')) {
      console.log(this.navParams.get('user_detail'));
      this.user_detail = this.navParams.get('user_detail');
    }


    this.ionform = formBuilder.group({
      set_password: ['', Validators.compose([Validators.required])],
      confirm_password: ['', Validators.compose([Validators.required])],

    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Change Password');
  }


  changePassword() {

    this.submitAttempt = true;

    if (!this.ionform.valid) {
      return;
    }
    let loader = this.loadingController.create({
      content: 'Please wait...'
    });
    loader.present();
    //console.log(this.feedback);
    console.log();

    var params = "?user_id=" + this.user_detail + "&password=" + this.ionform.value.set_password;

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');


    console.log(params);
    console.log("web_service/userResetPassword");
    //console.log(this.common.USER_CHANGE_PASSWORD_X);
    
    this.http.get(this.common.URL_RESET_PASSWORD + params)
      .map(res => res.json())
      .subscribe(data => {
        loader.dismiss();
        console.log(data);

        if (data.success) {
          this.navCtrl.popAll().then(() => {
            this.navCtrl.push(LoginPage);
          });
          const toast = this.toastCtrl.create({
            message: 'Password SuccessFully Updated',
            duration: 2000
          });
          toast.present();
        } else {
          //alert(data.message);

          const toast = this.toastCtrl.create({
            message: 'Password Invalid Or Incorrect',
            duration: 2000
          });
          toast.present();
        }
      }, error => {
        loader.dismiss();
        console.log(error);
        // var data = error.json();

        // if (data.type && data.type === "error") {
        //   alert('Sorry, no internet connection. Please try again later.');
        // }
        // else if (data.message)
        //   alert(data.message);
      });


  }

  validpassword() {
    if (this.ionform.value.confirm_password != this.ionform.value.set_password) {
      const toast = this.toastCtrl.create({
        message: 'Password does not match.',
        duration: 2000
      });
      toast.present();
    }
    else {
      //this.save();
      this.changePassword();
    }
  }

}
