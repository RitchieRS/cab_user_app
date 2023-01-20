import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Common } from '../../providers/common';
import { Http/*, Headers*/ } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-contact_us',
  templateUrl: 'contact_us.html',
})
export class ContactUsPage {
  ionform: FormGroup;
  submitted: boolean = false;
  loader: any;

  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public common: Common,
    public http: Http,
    public loadCtrl: LoadingController,
    public navParams: NavParams) {


    this.ionform = formBuilder.group({
      comment: [''],
      email: [''],
    });
  }

  onFeedback() {
    this.submitted = true;
    if (this.ionform.valid) {

      var param = {
        "your_email": this.ionform.value.comment,
        "message": this.ionform.value.email
      }

      console.log("web_service/feedback", param)

      this.http.post(this.common.URL_FEEDBACK, param)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          if (data.success) {
            alert("get your feedback! thank you");
            this.navCtrl.pop();
          }
          else {
            //this.navCtrl.push(RegistrationPage, { mobile: this.mobileno });
            alert("Not properly send ! please try again");
            return;
          }
        }, error => {
          console.log(error);
          alert(JSON.stringify(error));
        });

    }
    else {
      alert("Not properly send ! please try again");
      return;
    }

  }

}
