import { Component, ViewChild, ViewChildren , OnInit,ChangeDetectorRef, ElementRef,ContentChild,TemplateRef } from '@angular/core';
import {MatPaginator , MatSort , MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../core/user/user.service';
import { config } from '../../../config';
import { ActivatedRoute, Router ,Event, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'kt-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
	
	dataSource : any = [];
  	del_id: any;
  	del_index: any;
  	modalRef: any;
  	loading = false;
  	IMAGES_URL = config.IMAGES_URL;
  	errors = config.errors;  
  	id: any;

  	constructor(private _snackBar: MatSnackBar,public userService: UserService,private modalService: NgbModal, private cdr: ChangeDetectorRef, private router: Router, private activatedRoute: ActivatedRoute) { }

  	ngOnInit() {

  		this.getNotifications();
  	}

  	getimage(img){
	    if(this.errors.indexOf(img) == -1){
	    if(img.includes('https') == true){
	            return true;
	          }else{
	            return false;
	          }
	    }else{
	      return false;
	    }
	}

  	getNotifications(){
	    this.userService.postData({},'listNotificationAdmin').subscribe((result) => {
	      console.log(result.data);
	    
	    this.cdr.markForCheck();
	    this.dataSource = result.data;
	    },
	    err => {
	    });
	};

  	

}
