import { Injectable } from '@angular/core';
import { Http, Headers, Response,RequestOptions, RequestOptionsArgs } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { Subject,BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
	private subject = new Subject<any>();
	 userType: BehaviorSubject<string> = new BehaviorSubject<string>(this.getUserType());
  constructor(private http: Http) { }

  postData(data,endpoint){

    return this.http.post(endpoint , data).map((responseData) => {
        return responseData.json();
    }, error => {
     	return error.json();
  	});
  }

  getUserType() {
    return localStorage.getItem('user_type');
  }

  getData(endpoint){
    return this.http.get(endpoint).map((responseData) => {
        return responseData.json();
    }).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
  }




	  sendNumber(number){
	    this.subject.next({text:number});
	  }

	  getNumber():Observable<any>{
	    return this.subject.asObservable();
	  }
}
