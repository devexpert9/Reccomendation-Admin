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
	selector: "kt-editcategory",
	templateUrl: "./editcategory.component.html",
	styleUrls: ["./editcategory.component.scss"],
})
export class EditcategoryComponent implements OnInit {
	addForm: FormGroup;
	loading = false;
	category_detail: any;
	id: any;
	isAll: boolean = true;
	constructor(
		public activatedRoute: ActivatedRoute,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		public userService: UserService,
		private _snackBar: MatSnackBar,
		private router: Router
	) {
		this.id = activatedRoute.snapshot.paramMap.get("id");
		this.initAddForm();
	}

	ngOnInit() {
		this.getCategory();
	}

	initAddForm() {
		this.addForm = this.fb.group({
			category: ["", Validators.compose([Validators.required])],
		});
	}

	onClick() {
		if (this.category_detail.isAll == true) {
			this.isAll = false;
		} else {
			this.isAll = true;
		}
		console.log(this.isAll);
	}

	getCategory() {
		var frmData = {
			_id: this.id,
		};

		this.userService.postData(frmData, "getcategory").subscribe(
			(result) => {
				this.category_detail = result.data;
				this.addForm.patchValue({
					category: result.data.name,
				});
				console.log(this.addForm.value);
				this.cdr.markForCheck();
			},
			(err) => {
				this.showSnackBar(
					"Technical error, Please try after some time"
				);
			}
		);
	}

	editCategory() {
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
			_id: this.category_detail._id,
			isAll: this.isAll,
		};

		this.userService.postData(frmData, "updatecategory").subscribe(
			(result) => {
				this.showSnackBar(result.msg);
				this.cdr.markForCheck();
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
}
