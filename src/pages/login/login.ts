import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, MenuController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Http } from '@angular/http';
import { UserData } from '../../providers/user-data/user-data';
import { HomePage } from '../home/home';
import { ForgetPasswordPage } from '../forget_password/forget_password';
import { VerifyNumberPage } from '../verify_number/verify_number';
import { Common } from '../../providers/common';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  login: { mail?: any, pwd?: any } = { mail: '', pwd: '' };
  submitted = false;
  loader: any;

  constructor(public navCtrl: NavController, public http: Http,
    public common:Common,
    public menu: MenuController,public userdata: UserData, public toastCtrl: ToastController,
    public navParams: NavParams, public loadCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }



  doLogin(form: NgForm) {

    this.submitted = true;
    this.loader = this.loadCtrl.create({
      content: 'Please wait...'
    });


    if (form.valid) {
      this.loader.present();

      var post_data = {
        'secret_key': 'My_key',
        'Email': this.login.mail,
        'Password': this.login.pwd
      }
      console.log("web_service/login");
     

      this.http.post(this.common.URL_LOGIN, post_data)
        .subscribe(
          res => {
            let data = res.json();
            if (data[0].status == 'success') {
              this.loader.dismiss();
              console.log(data[0]);

              var user_data = {
                "Id": data[0].id,
                "Name": data[0].mobile,
                "Email": data[0].email,
                "User_name": data[0].username,
                "wallet_amount": data[0].wallet_amount,
                "Mobile": data[0].mobile,
                "token": data[0].token,
              };

              this.userdata.setUserData(user_data);
              this.navCtrl.setRoot(HomePage);

            }
            else {
              this.loader.dismiss();
              const toast = this.toastCtrl.create({
                message: data[0].message,
                duration: 2000
              });
              toast.present();
            }

          },
          err => {
            console.log("ERROR!: ", err);
          }
        );
    }


  }

  onSignup() {
    this.navCtrl.push("SignupPage");
  }


  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

  forgetPassword() {
    this.navCtrl.push(ForgetPasswordPage);
  }

  onRegister() {
    this.navCtrl.push(VerifyNumberPage);
  }


}
