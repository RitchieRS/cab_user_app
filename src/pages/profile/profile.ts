import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Http } from '@angular/http';
import { UserData } from '../../providers/user-data/user-data';
import { Common } from '../../providers/common';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  username: any;
  usermail: any;
  userphone: any;
  loader: any;
  user_token: any;
  public submitted: any = false;
  signUp: { c_pwd?: any, pwd?: any } = {};

  constructor(public http: Http, public alertctrl: AlertController,
     public common:Common,
     public loadCtrl: LoadingController, public userData: UserData, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.get_usersession();
  }



  get_usersession() {
    this.userData.getUserData().then(val => {
      console.log(val);

      this.username = val.User_name;
      this.userphone = val.Mobile
      this.usermail = val.Email;
      this.user_token = val.token;

    })
  }



  do_change(form: NgForm) {

    this.submitted = true;
    this.loader = this.loadCtrl.create({
      content: 'Please wait...'
    });

    if (!form.valid) {
      return;
    }
    if (form.valid && this.signUp.pwd == this.signUp.c_pwd) {
      this.loader.present();

      var post_data = {
        "username": this.username,
        "Password": this.signUp.pwd,
        "token": this.user_token
      } 
      console.log("web_service/update_pwd")

      this.http.post(this.common.URL_UPDATE_PASSWORD, post_data)
        .subscribe(
          res => {
            let data = res.json();
            this.loader.dismiss();
            if (data.status == 'success') {
              let alert = this.alertctrl.create({
                title: "Change Password",
                message: "Your password successfully updated",
                buttons: [{
                  text: "ok",
                  handler: function () {

                  }
                }
                ]
              })
              alert.present();
            } else {
              console.log("Error");
              this.loader.dismiss();
            }

          },
          err => {
            console.log("ERROR!: ", err);
            this.loader.dismiss();
          }
        );
    }
    else {
      let alert = this.alertctrl.create({
        title: "Change Password",
        message: "password not matched please try again",
        buttons: [{
          text: "ok",
          handler: function () {

          }
        }
        ]
      })
      alert.present();
    }
  }
}
