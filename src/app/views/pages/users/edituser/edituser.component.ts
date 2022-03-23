import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { config } from '../../../../config';
import { UserService } from '../../../../core/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router,ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'kt-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.scss']
})
export class EdituserComponent implements OnInit {
  
  	imgURL: any;
  	image_url: any;
  	public message: string;
  	addForm: FormGroup;
  	loading = false;
  	is_uploaded = false;
  	allowedMimes:any = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg'];
  	image_error:boolean=false;
  	file: any = '';
  	image_final: any = '';
  	id: any;
  	updated_image = '';
  	IMAGES_URL  = config.IMAGES_URL;
  	errors  = config.errors;
    user: any;

  	constructor(public activatedRoute: ActivatedRoute, private fb: FormBuilder,private cdr: ChangeDetectorRef, public userService: UserService, private _snackBar: MatSnackBar, private router: Router, public sanitizer:DomSanitizer) { 

  		this.id = activatedRoute.snapshot.paramMap.get('id');
  		this.initAddForm();
  	}

  	ngOnInit() {

  		this.getUser();
  	}

    setRequired(c,fld) {
        if(c==1) {
          
            return [Validators.pattern(/^\S*$/)];
        } else {
            return [];
        }   
    }

    checkValue(event){
      if(this.addForm.value.new_password != ''){
        this.addForm.get('new_password').setValidators(this.setRequired(1,0));
      }else{
        this.addForm.get('description').setValidators(this.setRequired(0,0));
      }
    }


    checkValuePass(event){
      if(this.addForm.value.new_password != ''){
        this.addForm.get('new_password').setValidators(this.setRequired(1,0));
      }else{
        this.addForm.get('new_password').setValidators(this.setRequired(0,0));
      }
    }
    checkValueConfirmPass(event){
      if(this.addForm.value.confirm_password != ''){
        this.addForm.get('confirm_password').setValidators(this.setRequired(1,0));
      }else{
        this.addForm.get('confirm_password').setValidators(this.setRequired(0,0));
      }
    }



  	initAddForm(){
      	this.addForm = this.fb.group({
	        name: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z].*$/)])],
	        email: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')])],
	        contact: ['', Validators.compose([Validators.required,  Validators.pattern(/^\d{6,10}$/)])],
	        new_password: [''],
	        confirm_password: ['']
	    });
  	}

  	getUser(){ 
      		
  		var dict = {
  			id: this.id
  		};
  
      	this.userService.postData(dict,'getUserByID').subscribe((result) => { 

            console.log(result)
            this.user = result.data;
            this.addForm.patchValue({
            	name: result.data.name,
            	email: result.data.email,
            	contact: result.data.contact
            });
           	this.image_final = result.data.image;

          
      	},
      	err => {
          	this.showSnackBar('Technical error, Please try after some time');
      	});
  	}


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

  updateUser(){
  console.log('add')
      this.loading = true;
      const controls = this.addForm.controls;
      if (this.addForm.invalid) {
      
        Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
        );
        return false;
      }
      if(this.addForm.value.new_password != this.addForm.value.confirm_password){
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
    	var frmData = {
	        name:this.addForm.value.name,
	        email:this.addForm.value.email,
	        contact:this.addForm.value.contact,
	        password:this.addForm.value.password,
	        image: this.image_final,
	        _id: this.id
	    }

      	this.userService.postData(frmData,'updateUser').subscribe((result) => { 

        	this.showSnackBar(result.error);
          	if(result.status == 1){
            	this.loading = false;
            
            	this.addForm.reset();
            	this.router.navigate(['/demo1/users']);
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
