import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { LoginPage } from '../login/login';
//import { SignupPage } from '../signup/signup';
import { VerifyNumberPage } from '../verify_number/verify_number';
import { ForgetPasswordPage } from '../forget_password/forget_password';

@IonicPage()
@Component({
  selector: 'page-main-landing',
  templateUrl: 'main-landing.html',
})
export class MainLandingPage {

  constructor(public navCtrl: NavController,
    public menu: MenuController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainLandingPage');
  }

  onRegister() {
    this.navCtrl.push(VerifyNumberPage);
  }
  onsign() {
    this.navCtrl.push(LoginPage);
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(false);
  }

  forgetPassword() {
    this.navCtrl.push(ForgetPasswordPage);
  }
  
}
