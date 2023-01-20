import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { Http } from '@angular/http';
import { UserData } from '../../providers/user-data/user-data';
import { ContactUsPage } from '../contact_us/contact_us';
import { Common } from '../../providers/common';

/**
 * Generated class for the TripdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-tripdetail',
	templateUrl: 'tripdetail.html',
})
export class TripdetailPage {
	trip: any;
	driver: any;
	user_id: any;
	details: any;
	categories: any;
	activateFilterBlock: boolean = false;
	mobileno:any;
	selectedReason: any;
	selectedCategories: any;

	constructor(public navCtrl: NavController, private callNumber: CallNumber, public toastCtrl: ToastController,
    	public common:Common,
		public loadCtrl: LoadingController, private http: Http, public userData: UserData,
		public navParams: NavParams, public alertctrl: AlertController) {
		this.details = navParams.data.item;
		console.log(this.details);
		
		if(navParams.data.driver) {
			this.driver = navParams.data.driver;
		}

		this.userData.getUserData().then(val => {
			this.user_id = val.Id;
			this.mobileno =  val.Mobile;
		});
	}

	ionViewDidLoad() {
		console.log(this.details);
		console.log('ionViewDidLoad TripdetailPage');
		this.CancellationList();
	}



	onclick(driver: any) {

		let template = "<p class='text-center color-white'>Name: " + driver.name + "<br><br>Vehicle No: " + (driver.car_no === null ? "-" : driver.car_no) + "<br><br>Phone No: " + driver.phone + "</p>"
		//	let item = "Name: " + + "<br/>" + "Car No: " + driver.car_no + "<br/>" + "Mobile No: " + driver.phone;
		this.alertctrl.create({
			cssClass: "calert-wrapper",
			title: "<p class='text-center color-white'>Driver Information</p>", 
			message: template,
			buttons: [{
				text: "Ok",
				handler: () => {
					console.log("cancel");
				}
			},
			{
				text: "Call",
				handler: () => {
					this.callNumber.callNumber(driver.phone, true)
						.then(res => console.log('Launched dialer!', res))
						.catch(err => console.log('Error launching dialer', err));
				}
			}
			]
		}).present()

		//	alert(item);
	}


	ontrack(driver: any) {
		this.navCtrl.push("ViewTrackPage", { "driver": driver, "trip_detail": this.details });
	}

	// cancelRide() {


	// 	let alert = this.alertctrl.create({
	// 		title: 'Cancel Ride?',
	// 		inputs: [
	// 			{
	// 				name: 'reason',
	// 				placeholder: 'Enter Reason',
	// 				type: 'text'
	// 			}
	// 		],
	// 		buttons: [
	// 			{
	// 				text: 'No',
	// 				role: 'No',
	// 				handler: data => {
	// 					console.log(data);
	// 					console.log('Cancel clicked');
	// 				}
	// 			},
	// 			{
	// 				text: 'Yes',
	// 				handler: data => {
	// 					if (data.reason) {
	// 						var post_data = {
	// 							"user_id": this.user_id,
	// 							"booking_id": this.details.id,
	// 							"reason": data.reason,
	// 							"subject": ""
	// 						}

	// 						this.http.post("web_service/userBookingCancellation", post_data)
	// 							.subscribe(
	// 								res => {
	// 									let data = res.json();
	// 									console.log(data);
	// 								},
	// 								err => {
	// 									console.log("ERROR!: ", err);
	// 								}
	// 							);
	// 					} else {
	// 						return false;
	// 					}
	// 				}
	// 			}
	// 		]
	// 	});
	// 	alert.present();
	// }


	closeFilters() {
		this.activateFilterBlock = false;
	}

	resetFilters() {
		this.selectedCategories = '';
		this.selectedReason = '';
	}

	cancelRide() {
		this.activateFilterBlock = true;
	}


	applyFilters() {
		if (this.selectedReason) {
			var post_data = {

				"user_id": this.user_id,
				"booking_id": this.details.id,
				"reason": this.selectedReason,
				"mobileno":this.mobileno,
				"subject": this.selectedCategories
			}

			console.log(post_data);
			console.log("web_service/userBookingCancellation")
			this.http.post(this.common.URL_CANCEL_BOOKING, post_data)
				.subscribe(
					res => {
						let data = res.json();
						console.log(data);
						this.navCtrl.pop();
					},
					err => {
						console.log("ERROR!: ", err);
					}
				);
		} else {
			this.toastCtrl.create({
				message: "Cancelation reason are required",
				dismissOnPageChange: true,
				duration: 2000
			}).present();
		}
	}


	CancellationList() {
		console.log("web_service/cancellation_list");
		this.http.get(this.common.URL_CANCEL_BOOKING_LIST)
			.subscribe(
				res => {
					let data = res.json();
					console.log(data);
					this.categories = data.data;
				},
				err => {
					console.log("ERROR!: ", err);
				}
			);
	}

	onFeedback() {
		this.navCtrl.push(ContactUsPage);
	}

}
