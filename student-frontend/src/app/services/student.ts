import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Student {
  id: number,
  name:string,
  email:String,
  contactNo:string,
  address:string
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl='https://localhost:7296/api/students';
  constructor(private http:HttpClient) {}

  getStudents() : Observable<Student[]> {
      return this.http.get<Student[]>(`${this.apiUrl}/getStudents`);
  }
  addStudent(student:Student) {
    return this.http.post(`${this.apiUrl}/addStudent`,student);
  }
  updateStudent(student:Student){
    return this.http.put(`${this.apiUrl}/updateStudent/${student.id}`,student);
  }
  deleteStudent(id:number){
    console.log(id);
    return this.http.delete(`${this.apiUrl}/deleteStudent/${id}`,{responseType:'text'});
  }
}
