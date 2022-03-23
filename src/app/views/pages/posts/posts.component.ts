import { Component, ViewChild, ViewChildren , OnInit,ChangeDetectorRef, ElementRef,ContentChild,TemplateRef } from '@angular/core';
import {MatPaginator , MatSort , MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../core/user/user.service';
import { config } from '../../../config';
import { ActivatedRoute, Router ,Event, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'kt-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  
  displayedColumns = [ 'imageurl' ,  'description' , 'category' , 'comment' , 'like' ,'action'];
  dataSource : any = [];
  del_id: any;
  del_index: any;
  modalRef: any;
  loading = false;
  IMAGES_URL = config.IMAGES_URL;
  errors = config.errors;  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
	    this.dataSource.sort = this.sort;
  }

  
  constructor(private _snackBar: MatSnackBar,public userService: UserService,private modalService: NgbModal, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {

    this.getPosts();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  };

  getPosts(){
    this.userService.postData({},'getAllReccAdmin').subscribe((result) => {
      console.log(result.data);
    
    this.cdr.markForCheck();
    this.dataSource = new MatTableDataSource(result.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    this.userService.postData({_id:this.del_id},'deleteRecc').subscribe((result) => {
      this.loading = false;
   
      if(result.status == 1){
        this.modalRef.close();
        this.dataSource.data.splice(this.del_index,1);
        this.cdr.markForCheck();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.showSnackBar('Post deleted successfully.');
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
export interface Element {
  description: string;
  category: string;
  imageurl: string;
  comment: string;
  like: string;
}
const ELEMENT_DATA: Element[] = [
  { imageurl:'assets/media/imgs/post1.jpg',  description: 'The best show on netflix i have watched in 2020. Hands  town Action , drama and madness.' , category: 'Netflix Series' , comment: '5' , like: '2'},
  { imageurl:'assets/media/imgs/post2.jpg', description: 'The stock market is a great place to make money and these are recommendations to get you started in the game' , category: 'Stock Market' , comment: '3' , like: '1'},
  { imageurl:'assets/media/imgs/post3.jpg', description: 'The best show on netflix i have watched in 2020. Hands  town Action , drama and madness.' , category: 'Netflix Series' , comment: '7' , like: '15'},
  { imageurl:'assets/media/imgs/post1.jpg', description: 'The stock market is a great place to make money and these are recommendations to get you started in the game' , category: 'Stock Market' , comment: '8' , like: '22'},
  { imageurl:'assets/media/imgs/post2.jpg', description: 'The best show on netflix i have watched in 2020. Hands  town Action , drama and madness.' , category: 'Netflix Series' , comment: '5' , like: '10'},
  { imageurl:'assets/media/imgs/post3.jpg', description: 'The stock market is a great place to make money and these are recommendations to get you started in the game' , category: 'Stock Market' , comment: '7' , like: '18'}
];