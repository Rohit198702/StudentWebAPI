import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable,inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as StudentActions from './student.actions'; 
import { of,map } from "rxjs";
import { catchError, exhaustMap } from "rxjs/operators";
import { Student } from "../../../services/student";

interface StudentAPIResponse {
    items: Student[];
    totalCount:number
}
@Injectable()
export class StudentsEffects {
    private apiUrl='https://localhost:7296/api/students';
    private actions$ =inject(Actions);
    private http = inject(HttpClient);

    loadStudents$=createEffect(()=> {
        
        return this.actions$.pipe(
            ofType(StudentActions.loadStudents),
            exhaustMap(action=>
                this.http.get<Student[]>(this.apiUrl,{
                    params:new HttpParams({fromObject:action.params || {}})
                }).pipe(
                    map((res:Student[]) => StudentActions.loadStudentsSuccess({
                        students:res,
                        totalCount: res.length
                    })),
                    catchError(error=> of(StudentActions.loadStudentsFailure({ error: error })))
                )
            )
        );
      }); 
}