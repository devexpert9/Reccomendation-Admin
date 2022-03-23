import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { config } from '../../../../config';
import { UserService } from '../../../../core/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router,ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'kt-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.scss']
})
export class AddpostComponent implements OnInit {
	startDate = new Date(1990, 0, 1);
  public imagePath;
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
  categories: any;
  errors = config.errors;
  is_submit = false;
  expression: any;

  	constructor(public activatedRoute: ActivatedRoute, private fb: FormBuilder,private cdr: ChangeDetectorRef, public userService: UserService, private _snackBar: MatSnackBar, private router: Router, public sanitizer:DomSanitizer) { 

  		this.initAddForm();
  		this.expression = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  	}

  	ngOnInit() {
  		this.getCategories();
  	}

  	initAddForm(){
	      this.addForm = this.fb.group({
	        type: ['', Validators.compose([Validators.required])],
	        category: ['', Validators.compose([Validators.required])],
	        description: ['', Validators.compose([Validators.required])],
	        web_link: [''],
	      });
	}

	setRequired(c,fld) {
        if(c==1) {
          
            return [Validators.required];
        } else {
            return [];
        }   
  	}

  	changeType(event){
  		//if(this.addForm.value.type == 'Website'){
  		//	this.addForm.get('web_link').setValidators(this.setRequired(1,0));
  		//}else{
  		//	this.addForm.get('web_link').setValidators(this.setRequired(0,0));
  		//}
  	}

	getCategories(){

  		var dict = {
	    	user_id: ''
	    }
	  
	    this.userService.postData(dict,'categories').subscribe((result) => { 
	      if(result.status == 1){
	        this.categories = result.data;
	      }
	      else{
	      }
	    },
	    err => {
	        
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

	addUser(){
	  console.log('add')
	      this.loading = true;
	      this.is_submit = true;
	      const controls = this.addForm.controls;
	      if (this.addForm.invalid) {
	      
	        Object.keys(controls).forEach(controlName =>
	          controls[controlName].markAsTouched()
	        );
	        return false;
	      }
	      
	      if(this.addForm.value.type != 'Website' && this.errors.indexOf(this.addForm.value.description) >= 0){
	      	return false;
	      }
	      
	     /* if(this.addForm.value.type == 'Website' && this.errors.indexOf(this.addForm.value.web_link) >= 0){
	      	return false;
	      }*/

	       if(this.addForm.value.type == 'Website'){
	    	if(this.errors.indexOf(this.addForm.value.web_link) >= 0 || !this.expression.test(this.addForm.value.web_link)){
		      return false;
		    }
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

  	removeImage(){
  		this.image_url = '';
  		this.file = '';
  		this.is_uploaded = false;
  	}


	finalSubmit(controls){
	    var frmData = {
	        type:this.addForm.value.type,
	        category:this.addForm.value.category,
	        description:this.addForm.value.description,
	        web_link:this.addForm.value.web_link,
	        image: this.image_final,
	        user_id: localStorage.getItem('apart_admin_auth_token'),
	        add_user_type: 'admin'
	      }

	      this.userService.postData(frmData,'addRecc').subscribe((result) => { 

	        this.showSnackBar('Post added succesfully');
	          if(result.status == 1){
	            this.loading = false;
	            
	            this.addForm.reset();
	            this.router.navigate(['/demo1/posts']);
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
