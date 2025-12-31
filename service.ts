import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
@Injectable({providedIn:'root'})


export class StudentService{
        private api="http://localhost:8080/api/students"

        constructor(private http: HttpClient){}

        getAll(): Observable<any>{
            return this.http.get(this.api)
        }

        getById(id:String) : Observable<any>{
            return this.http.get(`${this.api}/${id}`)
        }

        create(data:FormData): Observable<any>{
             return this.http.post(this.api,data)
        }

        update(id: string, data: any) {
        return this.http.put(`${this.api}/${id}`, data);
    }


}