import { createReducer,on } from "@ngrx/store";
import * as StudentActions from './student.actions';
import { Student } from "../../../services/student";


export interface StudentState {
    students:Student[];
    totalCount:number;
    loading:boolean;
     error:any;
}

export const initialState: StudentState={
    students:[],
    totalCount:0,
    loading:false,
    error:null
};

export const studentReducer = createReducer(
    initialState,

    on(StudentActions.loadStudents, state=> ({
        ...state,
        loading:true,
        error:null
    })),

    on(StudentActions.loadStudentsSuccess, (state,  { students, totalCount}) => ({
        ...state,
        students,
        totalCount,
        loading:false,        
    })),

    on(StudentActions.loadStudentsFailure, (state, {error}) => ({
        ...state,
        loading:false,
        error
    }))
);

