import { createAction,props } from "@ngrx/store";
import { Student } from "../../../services/student";

export const loadStudents=createAction(
    '[Student] Load Students',
    props<{ params: Record<string, string>}>()    
)

export const loadStudentsSuccess=createAction(
    '[Student] Load Students Success',
    props<{ students:Student[]; totalCount:number }>()
);

export const loadStudentsFailure=createAction(
    '[Student] Load Students Failure',
    props< { error: unknown } >()
);