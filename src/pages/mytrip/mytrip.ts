import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { UserData } from '../../providers/user-data/user-data';
import { TripdetailPage } from '../tripdetail/tripdetail';
import { Common } from '../../providers/common';

@IonicPage()
@Component({
	selector: 'page-mytrip',
	templateUrl: 'mytrip.html',
})
export class MytripPage {
	trips: string = "booked";
	loader: any;
	active_trip: any;
	cancelled_trips: any;
	all_trips: any;
	booked_trips: any;
	driver: any;
	Trip_select: any = "booked";

	constructor(public navCtrl: NavController,
		public common:Common,
		public navParams: NavParams, public http: Http, public loadCtrl: LoadingController, public userData: UserData) {
		this.getAll();

	}

	ionViewDidLoad() {

		console.log('ionViewDidLoad MytripPage');

	}

	segmentChanged() {
		this.getAll();
	}
	getAll() {
		this.loader = this.loadCtrl.create({
			content: 'Please wait...'
		});
		this.userData.getUserData().then(user_data => {
			var post_data = {
				"user_name": user_data.User_name,
				"token": user_data.token,
			}
			console.log("web_service/load_trips");
			
			this.http.post(this.common.URL_LOAD_TRIPS, post_data)
				.subscribe(
					res => {
						let data = res.json();
						console.log("Data Success");
						console.log(data);
						if (data.status == 'success') {
							this.loader.dismiss();
							console.log(data[0]);
							
							if (this.Trip_select == "Cancelled") {
								this.active_trip = data.Cancelled;
								//this.driver = data.booking[0].driver;
							}
							else if (this.Trip_select == "complete") {
								this.active_trip = data.success;
							}
							else if (this.Trip_select == "booked") {
								this.active_trip = data.booking;
							}

							//	console.log(this.booked_trips);
						}
						else {
							this.loader.dismiss();
						}

					},
					err => {
						console.log("ERROR!: ", err);
					}
				);
		});
	}
	show_details(item: any) {
		//console.log(this.driver);
		if(item.driver) {
			this.navCtrl.push(TripdetailPage, { item: item, driver: item.driver[0] });
		} else {
			this.navCtrl.push(TripdetailPage, { item: item, driver: '' });
		}
	}




}
