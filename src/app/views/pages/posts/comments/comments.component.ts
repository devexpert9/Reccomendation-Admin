import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { config } from '../../../../config';
import { UserService } from '../../../../core/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router,ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'kt-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
	
	dataSource : any = [];
  	del_id: any;
  	del_index: any;
  	modalRef: any;
  	loading = false;
  	IMAGES_URL = config.IMAGES_URL;
  	errors = config.errors;
  	id: any;

  	constructor(private _snackBar: MatSnackBar,public userService: UserService,private modalService: NgbModal, private cdr: ChangeDetectorRef, private router: Router, private activatedRoute:ActivatedRoute ) { 

  		this.id = activatedRoute.snapshot.paramMap.get('id');
  	}

  	ngOnInit() {

  		this.getComments();
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

  	
  	getComments(){
	    this.userService.postData({postId: this.id},'getPostComments').subscribe((result) => {
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
	    this.userService.postData({_id: this.del_id},'deleteComment').subscribe((result) => {
	      	console.log(result.data);
	    
	    	if(result.status == 1){
		        this.modalRef.close();
		        this.dataSource.splice(this.del_index,1);
		        this.cdr.markForCheck();
		        this.showSnackBar(result.msg);
	      	}
	      	else{
		        this.showSnackBar('Error while deleting post,Please try after some time');
	      	}
	    },
	    err => {

	    	this.showSnackBar('Error while deleting post,Please try after some time');
	    });
	};

	showSnackBar(message){
      this._snackBar.open(message, 'Close', {
        duration: 3000,
      });
  	}

  
}
