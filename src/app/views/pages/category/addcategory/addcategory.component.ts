import {
	Component,
	OnInit,
	ChangeDetectorRef,
	ElementRef,
	ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { config } from "../../../../config";
import { UserService } from "../../../../core/user/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
	selector: "kt-addcategory",
	templateUrl: "./addcategory.component.html",
	styleUrls: ["./addcategory.component.scss"],
})
export class AddcategoryComponent implements OnInit {
	addForm: FormGroup;
	loading = false;

	isAll: boolean = false;
	constructor(
		public activatedRoute: ActivatedRoute,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		public userService: UserService,
		private _snackBar: MatSnackBar,
		private router: Router
	) {
		this.initAddForm();
	}

	initAddForm() {
		this.addForm = this.fb.group({
			category: ["", Validators.compose([Validators.required])],
		});
	}

	ngOnInit() {}

	addCategory() {
		console.log("add");
		this.loading = true;
		const controls = this.addForm.controls;
		if (this.addForm.invalid) {
			Object.keys(controls).forEach((controlName) =>
				controls[controlName].markAsTouched()
			);
			return false;
		}
		var frmData = {
			name: this.addForm.value.category,
			isAll: this.isAll,
		};

		this.userService.postData(frmData, "addcategory").subscribe(
			(result) => {
				this.showSnackBar(result.msg);
				if (result.status == 1) {
					this.loading = false;

					this.addForm.reset();
					this.router.navigate(["/demo1/categories"]);
				} else {
					this.loading = false;
				}
			},
			(err) => {
				this.showSnackBar(
					"Technical error, Please try after some time"
				);
			}
		);
	}

	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.addForm.controls[controlName];
		if (!control) {
			return false;
		}
		const result =
			control.hasError(validationType) &&
			(control.dirty || control.touched);
		return result;
	}
	showSnackBar(message) {
		this._snackBar.open(message, "Close", {
			duration: 3000,
		});
	}

	onClick() {
		this.isAll = this.isAll ? false : true;
		console.log(this.isAll);
	}
}
