import { Component, ViewChild, ViewChildren , OnInit,ChangeDetectorRef, ElementRef,ContentChild,TemplateRef } from '@angular/core';
import {MatPaginator , MatSort , MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../core/user/user.service';
import { GlobalFooService } from '../../../core/globalFooService.service';
import { config } from '../../../config';
import { ActivatedRoute, Router ,Event, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'kt-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	
	addForm: FormGroup;
	dataSource : any = [];
  	del_id: any;
  	del_index: any;
  	modalRef: any;
  	loading = false;
  	IMAGES_URL = config.IMAGES_URL;
  	errors = config.errors;  
  	countries: any;
  	user: any;
  	image_url: any;
  	public message: string;
  	is_uploaded = false;
  	allowedMimes:any = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg'];
  	image_error:boolean=false;
  	file: any = '';
  	image_final: any = '';

  	constructor(private _snackBar: MatSnackBar,public userService: UserService,public globalFooService: GlobalFooService,private modalService: NgbModal, private cdr: ChangeDetectorRef, private router: Router, private fb: FormBuilder, public sanitizer:DomSanitizer) { 

  		this.initAddForm();

  	}

  	ngOnInit() {
  		this.getProfile();
  	}


    setRequired(c,fld) {
        if(c==1) {
          
            return [Validators.pattern(/^\S*$/)];
        } else {
            return [];
        }   
    }

    checkValuePass(event){
      if(this.addForm.value.new_pass != ''){
        this.addForm.get('new_pass').setValidators(this.setRequired(1,0));
      }else{
        this.addForm.get('new_pass').setValidators(this.setRequired(0,0));
      }
    }
    checkValueConfirmPass(event){
      if(this.addForm.value.confirm_pass != ''){
        this.addForm.get('confirm_pass').setValidators(this.setRequired(1,0));
      }else{
        this.addForm.get('confirm_pass').setValidators(this.setRequired(0,0));
      }
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

  	initAddForm(){
	      this.addForm = this.fb.group({
	        name: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z].*$/)])],
	        email: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')])],
	        contact: ['', Validators.compose([Validators.required,  Validators.pattern(/^\d{6,10}$/)])],
	        address: ['', Validators.compose([Validators.required])],
	        state: ['', Validators.compose([Validators.required])],
	        country: ['', Validators.compose([Validators.required])],
	        new_pass: [''],
	        confirm_pass: [''],
	      });
	}
  	

 //  	getCountries(){
	//     this.userService.getData('countries').subscribe((result) => {
	//       console.log(result);
	//       	this.countries = result;
	//     	this.getProfile();
	//     this.cdr.markForCheck();
	//     },
	//     err => {
	//     });
	// };

  	getProfile(){
	    this.userService.postData({_id: localStorage.getItem('apart_admin_auth_token')},'adminProfile').subscribe((result) => {
	      	console.log(result.data);
	      	this.cdr.markForCheck();
	    	this.user = result.data;
	    	this.addForm.patchValue({
	    		name: result.data.firstname,
	    		email: result.data.email,
	    		contact: result.data.contact,
	    		address: result.data.address,
	    		country: result.data.country,
	    		state: result.data.state,
	    	});
	    	this.image_final = result.data.image;

	    },
	    err => {
	    });
	};


	upload(event){
	    this.image_error = false;
	    var self = this;
	    if (event.target.files && event.target.files[0]) {
	      var reader = new FileReader();
	      var image_file = event.target.files[0];
	      if(self.allowedMimes.indexOf(image_file.type) == -1){
	        this.image_error = true;
	      }
	      else{
	        self.file = image_file;
	        self.image_url = window.URL.createObjectURL(image_file);
	        self.is_uploaded = true;
	      }
	    }	
  	}

 	updateProfile(){
  		console.log('add')
      	this.loading = true;
      	const controls = this.addForm.controls;
      	if (this.addForm.invalid) {
      
	        Object.keys(controls).forEach(controlName =>
	          controls[controlName].markAsTouched()
	        );
	        return false;
      	}
      	if(this.addForm.value.new_pass != this.addForm.value.confirm_pass){
        	return false;
      	}

      	if(this.user.password == this.addForm.value.new_pass){
      		return false;
      	}

      	if(this.addForm.value.new_pass != '' && this.addForm.value.confirm_pass == '')
      	{
      		return false;
      	}

      	if(this.is_uploaded == true){

        	this.uploadImage(controls);
        
      	}else{
        	this.finalSubmit(controls);
      	} 
  	};

  	uploadImage(controls){

    	const frmData = new FormData();  
      	if(this.file=='')
      	{
        	frmData.append("file", "");
      	}
      	else
      	{
        	frmData.append("file", this.file);  
      	}
  
      	this.userService.postData(frmData,'uploadImage').subscribe((result) => { 

            this.image_final = result;
            this.finalSubmit(controls);
          
      	},
      	err => {
          this.showSnackBar('Technical error, Please try after some time');
      	});
  	}


  	finalSubmit(controls){
  		var password;
  		if(this.addForm.value.new_pass != ''){
  			password = this.addForm.value.new_pass;
  		}else{
  			password = this.user.password;
  		}

    	var frmData = {
	        name:this.addForm.value.name,
	        email:this.addForm.value.email,
	        contact:this.addForm.value.contact,
	        country:this.addForm.value.country,
	        state:this.addForm.value.state,
	        address:this.addForm.value.address,
	        password: password,
	        image: this.image_final,
	        id: this.user._id
      	}


      	this.userService.postData(frmData,'updateAdminProfile').subscribe((result) => { 

        this.showSnackBar(result.msg);
          if(result.status == 1){
            this.loading = false;
            this.user = result.data;
            this.addForm.patchValue({
              new_pass: '',
              confirm_pass: ''
            });

            this.globalFooService.publishSomeData({
              foo: {'data': '', 'page': 'profile'}
          });
            
            // this.addForm.reset();
          }
          else{
            this.loading = false;
            
          }
      	},
      	err => {
          this.showSnackBar('Technical error, Please try after some time');
      	});
  	}

   	isControlHasError(controlName: string, validationType: string): boolean {
    	const control = this.addForm.controls[controlName];
    	if (!control) {
      		return false;
    	}
    	const result = control.hasError(validationType) && (control.dirty || control.touched);
    	return result;
  	}

  	showSnackBar(message){
      this._snackBar.open(message, 'Close', {
        duration: 3000,
      });
  	}
  

}
