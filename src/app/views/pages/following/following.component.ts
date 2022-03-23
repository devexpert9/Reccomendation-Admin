import { Component, ViewChild, ViewChildren , OnInit,ChangeDetectorRef, ElementRef,ContentChild,TemplateRef } from '@angular/core';
import {MatPaginator , MatSort , MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../core/user/user.service';
import { config } from '../../../config';
import { ActivatedRoute, Router ,Event, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'kt-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {
	
	dataSource : any = [];
  	del_id: any;
  	del_index: any;
  	modalRef: any;
  	loading = false;
  	IMAGES_URL = config.IMAGES_URL;
  	errors = config.errors;  
  	id: any;

  	constructor(private _snackBar: MatSnackBar,public userService: UserService,private modalService: NgbModal, private cdr: ChangeDetectorRef, private router: Router, private activatedRoute: ActivatedRoute) { 

  		this.id = activatedRoute.snapshot.paramMap.get('id');
  	}

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
	    this.userService.postData({userId: this.id},'followingListingTab').subscribe((result) => {
	      console.log(result.data);
	    
	    this.cdr.markForCheck();
	    this.dataSource = result.data;
	    },
	    err => {
	    });
	};


	

  	openVerticallyCentered(content, del_id, del_index) {
	    this.modalRef = this.modalService.open(content, { centered: true });
	    this.del_id = del_id;
	    this.del_index = del_index;
	}


  	confirm_delete(){
	    this.loading = true;
	    let dict = {
	      userId: this.id,
	      friendId: this.del_id,
	    };
	    this.userService.postData(dict,'removeFriend').subscribe((result) => {
	      this.loading = false;
	   
	      if(result.status == 1){
	        this.modalRef.close();
	        this.dataSource.splice(this.del_index,1);
	        this.cdr.markForCheck();
	        this.showSnackBar('Unfollowed successfully.');
	      }
	      else{
	        this.showSnackBar('Error while deleting post,Please try after some time');
	      }
	    },
	    err => {
	      this.loading = false;
	      this.showSnackBar('Technical error,Please try after some time');
	    });
  	}

  	showSnackBar(message){
      	this._snackBar.open(message, 'Close', {
        	duration: 3000,
      	});
  	}

  	

}
