import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Common } from '../../providers/common';
import { Http } from '@angular/http';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  public mobileno: any;

  signUp: { name?: any, user_name?: any, mobile?: any, mail?: any, pwd?: any } = {};
  submitted = false;
  loader: any;

  constructor(public navCtrl: NavController, public http: Http, public alertctrl: AlertController,
    public common:Common,

    public navParams: NavParams, public loadCtrl: LoadingController) {

    if (this.navParams.get('mobile')) {
      console.log(this.navParams.get('mobile'));
      this.mobileno = this.navParams.get('mobile');
      this.signUp.mobile = this.mobileno;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }


  doSignup(form: NgForm) {
    let me: any = this;
    this.submitted = true;
    this.loader = this.loadCtrl.create({
      content: 'Please wait...'
    });


    if (form.valid) {
      this.loader.present();

      var post_data = {
        'secret_key': 'My_key',
        'Email': this.signUp.mail,
        'Password': this.signUp.pwd,
        'Mobile': this.signUp.mobile,
        'User_name': this.signUp.user_name,
        'Name': this.signUp.name
      }

      console.log("web_service/sign_up");
      this.http.post(this.common.URL_SIGNUP, post_data)
        .subscribe(
          res => {
            let data = res.json();
            if (data.status == 'success') {
              this.loader.dismiss();
              console.log(data[0]);
              let alert = this.alertctrl.create({
                title: "Thank You",
                message: "You are successfully registered",
                buttons: [{
                  text: "ok",
                  handler: function () {
                    me.navCtrl.pop().then(() => {
                      me.navCtrl.push('LoginPage');
                    })
                  }
                }
                ]
              })
              alert.present();
            }
            else {
              this.loader.dismiss();
              let alert = this.alertctrl.create({
                title: "Alert !",
                message: data.error_list[0].message
              })
              alert.present();
            }


          },
          err => {
            console.log("ERROR!: ", err);
            this.loader.dismiss();
          }
        );
    }
  }
}
