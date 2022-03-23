// Angular
import { Component, Input, OnInit,ChangeDetectorRef } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../../core/auth';

import { config } from '../../../../../config';
import { UserService } from '../../../../../core/user/user.service';
import { GlobalFooService } from '../../../../../core/globalFooService.service';
import { Router } from '@angular/router';


@Component({
	selector: 'kt-user-profile',
	templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
	// Public properties
	user$: Observable<User>;

	name:any;
	image:any;
	isLoggedIn:boolean;
	userId:any;
	errors : any = ['',null,undefined,'undefined','null'];
	IMAGES_URL:any = config.IMAGES_URL;
	user: any;

	@Input() avatar: boolean = true;
	@Input() greeting: boolean = true;
	@Input() badge: boolean;
	@Input() icon: boolean;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(private cdr: ChangeDetectorRef, private store: Store<AppState>, public userService: UserService, private router: Router,public globalFooService: GlobalFooService) {

		this.userId = localStorage.getItem('apart_admin_auth_token');
		this.checkUserToken();

    	this.globalFooService.getObservable().subscribe((data) => {
            console.log('Data received', data);
            this.userId = localStorage.getItem('apart_admin_auth_token');
            this.checkUserToken();

        });
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.user$ = this.store.pipe(select(currentUser));
	}

	/**
	 * Log out
	 */
	logout() {
		this.userId = 0;
	  	this.isLoggedIn = false;
	  	localStorage.clear();
	  	this.router.navigate(['/auth/login']);
	}


	checkUserToken(){
	  	this.userService.postData({_id: localStorage.getItem('apart_admin_auth_token')},'adminProfile').subscribe((result) => {

	  		this.user = result.data;
	  		if(result.status == 1){
	  			this.isLoggedIn = true;
	  		}
	  		else{
	  			this.userId = 0;
	  			this.isLoggedIn = false;
	  		}
	  		this.cdr.markForCheck();
	  	});
	}
}
