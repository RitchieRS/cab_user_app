import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { UserData } from '../../providers/user-data/user-data';
import { Common } from '../../providers/common';

declare var paytm: any;

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {

  mwallets: any;
  current_balance: any;
  wallet_List: any;
  public loading: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public common:Common,
    public http: Http, public userdata: UserData, public alertCtrl: AlertController, 
  public loadingController: LoadingController) {
    this.userdata.getUserData().then(val => {
      console.log(val);
      if (val.Id) {
        console.log("web_service/transaction?user_id=" + val.Id);

        this.http.get(this.common.URL_GET_TRANSACTION+"?user_id=" + val.Id)
          .map(res => res.json())
          .subscribe(data => {
            console.log("Wallet Data");
            console.log(data);
            this.loading = false;
            this.current_balance = data.wallet_amount;
            this.mwallets = data.transactions;
            console.log(this.mwallets);
          }, error => {
            console.log(error);
            this.loading = false;
          });
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletPage');
  }

  wallet_process() {
    let alert = this.alertCtrl.create({
      title: 'Enter Amount',
      inputs: [
        {
          name: 'amount',
          placeholder: 'Enter amount to add in wallet',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log(data);
            console.log('Cancel clicked');
          }
        },
        {
          text: 'proceed',
          handler: data => {
            if (data.amount) {
              this.makePayment_paytm(data.amount);
            } else {
              // invalid login
              console.log("Please try again!");
              return false;
            }
          }
        }
      ]
    });
    alert.present();

  }

  makePayment_paytm(Payable_amount: any) {
    this.userdata.getUserData().then(val => {
        let txnRequest = {
          "MID": "XXXXXXXXXXX",
          "ORDER_ID": Math.floor((Math.random() * 100006) + 1),
          "CHANNEL_ID": "WAP",
          "CUST_ID": val.Id,
          "MOBILE_NO": "1234567890",
          "EMAIL": val.Email,
          "TXN_AMOUNT": Payable_amount,
          "WEBSITE": "WEBSTAGING",
          "INDUSTRY_TYPE_ID": "Retail",
          "CALLBACK_URL": "https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=" + Math.floor((Math.random() * 100006) + 1),
          "ENVIRONMENT": "production",
          "CHECKSUMHASH": "",
        }

        let loader = this.loadingController.create({
          content: 'Please wait...',
          duration: 5000
        });
        loader.present();
        this.http.post(this.common.GET_CHECKSUM, txnRequest)
          .subscribe(
            res => {
              let data = res.json();
              loader.dismiss();
              if (data) {
                txnRequest.CHECKSUMHASH = data.checkSum;
                console.log(JSON.stringify(txnRequest));
                const successCallback = (response) => {
                  console.log(JSON.stringify(response));
                  if (response.STATUS == "TXN_SUCCESS") {
                    this.proceed(Payable_amount);
                  } else {
                    // alert(`Transaction Failed for reason: - ${response.RESPMSG} (${response.RESPCODE})`);
                    alert('Please try again! something went wrong')
                  }
                }
                const failureCallback = (error) => {
                  console.log(JSON.stringify(error));
                  alert('Payment Cancel..!');
                }
                paytm.startPayment(txnRequest, successCallback, failureCallback);
              }
            }
          );
    });
  }

  proceed(wallent_amt: any) {
    this.userdata.getUserData().then(val => {
      var params = "id=" + val.Id +
        "&wallet_trans_amount=" + wallent_amt +
        "&transaction_note=" + "Paytm amount credited successfully in your wallet";

      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      this.http.post(this.common.ADD_WALLET_AMOUNT, params, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          if (data.success) {
           // alert("Your amount successfully credited thank you")
            let alert = this.alertCtrl.create({
              title: 'Your amount successfully credited in your wallet.thank you',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: data => {
                    console.log(data);
                    console.log('Cancel clicked');
                    this.ionViewDidLoad();
                  }
                },
                {
                  text: 'ok',
                  handler: data => {
                    console.log(data);
                    this.ionViewDidLoad();
                  }
                }
              ]
            });
            alert.present();
          } else {
            //alert(data.message);

          }
        }, error => {
          ///loader.dismiss();
          console.log(error);
        });
    });
  }

}
