import { config } from "./../../../config";
import { UserService } from "./../../../core/user/user.service";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import {
	MatPaginator,
	MatSort,
	MatSnackBar,
	MatTableDataSource,
} from "@angular/material";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: "kt-feedback",
	templateUrl: "./feedback.component.html",
	styleUrls: ["./feedback.component.scss"],
})
export class FeedbackComponent implements OnInit {
	displayedColumns = ["name", "email", "contact"];
	dataSource: any = [];
	del_id: any;
	del_index: any;
	modalRef: any;
	loading = false;
	IMAGES_URL = config.IMAGES_URL;
	errors = config.errors;

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	constructor(
		private _snackBar: MatSnackBar,
		public userService: UserService,
		private modalService: NgbModal,
		private cdr: ChangeDetectorRef,
		private router: Router
	) {}

	ngOnInit() {
		this.getUsers();
	}

	getimage(img) {
		if (this.errors.indexOf(img) == -1) {
			if (img.includes("https") == true) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	getUsers() {
		this.userService.postData({}, "getAllFeedback").subscribe(
			(result) => {
				console.log(result.data);

				this.cdr.markForCheck();
				this.dataSource = new MatTableDataSource(result.data);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			},
			(err) => {}
		);
	}

	openVerticallyCentered(content, del_id, del_index) {
		this.modalRef = this.modalService.open(content, { centered: true });
		this.del_id = del_id;
		this.del_index = del_index;
	}

	confirm_delete() {
		this.loading = true;
		this.userService.postData({ _id: this.del_id }, "deleteUser").subscribe(
			(result) => {
				this.loading = false;

				if (result.status == 1) {
					this.modalRef.close();
					this.dataSource.data.splice(this.del_index, 1);
					this.cdr.markForCheck();
					this.dataSource.paginator = this.paginator;
					this.dataSource.sort = this.sort;
					this.showSnackBar("User deleted successfully.");
				} else {
					this.showSnackBar(
						"Error while deleting post,Please try after some time"
					);
				}
			},
			(err) => {
				this.loading = false;
				this.showSnackBar("Technical error,Please try after some time");
			}
		);
	}

	showSnackBar(message) {
		this._snackBar.open(message, "Close", {
			duration: 3000,
		});
	}
}

export interface Element {
	name: string;
	//result: string;
	email: string;
	phone: string;
	imageurl: string;
	posts: string;
	follow: string;
}
const ELEMENT_DATA: Element[] = [
	{
		imageurl: "assets/media/users/100_1.jpg",
		name: "Adelmo ",
		email: "adelmo@gmail.com",
		phone: "+1234 567 890",
		posts: "4",
		follow: "540",
	},
	{
		imageurl: "assets/media/users/100_2.jpg",
		name: "John Smith ",
		email: "john@gmail.com",
		phone: "+1234 567 890",
		posts: "5",
		follow: "150",
	},
	{
		imageurl: "assets/media/users/100_3.jpg",
		name: "David Smith",
		email: "david@gmail.com",
		phone: "+1234 567 890",
		posts: "2",
		follow: "120",
	},
	{
		imageurl: "assets/media/users/100_4.jpg",
		name: "Steve Smith",
		email: "steve@gmail.com",
		phone: "+1234 567 890",
		posts: "1",
		follow: "230",
	},
	{
		imageurl: "assets/media/users/100_5.jpg",
		name: "Johnson",
		email: "johnson@gmail.com",
		phone: "+1234 567 890",
		posts: "6",
		follow: "1000",
	},
	{
		imageurl: "assets/media/users/100_6.jpg",
		name: "Andrew",
		email: "andrew@gmail.com",
		phone: "+1234 567 890",
		posts: "3",
		follow: "789",
	},
];
