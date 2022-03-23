import {
	Component,
	ViewChild,
	ViewChildren,
	OnInit,
	ChangeDetectorRef,
	ElementRef,
	ContentChild,
	TemplateRef,
} from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { UserService } from "../../../core/user/user.service";
import { config } from "../../../config";
import {
	ActivatedRoute,
	Router,
	Event,
	NavigationStart,
	NavigationEnd,
	NavigationError,
} from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: "kt-category",
	templateUrl: "./category.component.html",
	styleUrls: ["./category.component.scss"],
})
export class CategoryComponent implements OnInit {
	displayedColumns = ["name", "action"];
	dataSource: any = [];
	del_id: any;
	del_index: any;
	modalRef: any;
	loading = false;

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
		this.getCategories();
	}
	openVerticallyCentered(content, del_id, del_index) {
		this.modalRef = this.modalService.open(content, { centered: true });
		this.del_id = del_id;
		this.del_index = del_index;
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	getCategories() {
		this.userService.postData({}, "onlycategories").subscribe(
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

	confirm_delete() {
		this.loading = true;
		this.userService
			.postData({ _id: this.del_id }, "deletecategory")
			.subscribe(
				(result) => {
					this.loading = false;

					if (result.status == 1) {
						this.modalRef.close();
						this.dataSource.data.splice(this.del_index, 1);
						this.cdr.markForCheck();
						this.dataSource.paginator = this.paginator;
						this.dataSource.sort = this.sort;
						this.showSnackBar("Category deleted successfully.");
					} else {
						this.showSnackBar(
							"Error while deleting post,Please try after some time"
						);
					}
				},
				(err) => {
					this.loading = false;
					this.showSnackBar(
						"Technical error,Please try after some time"
					);
				}
			);
	}

	showSnackBar(message) {
		this._snackBar.open(message, "Close", {
			duration: 3000,
		});
	}
}
