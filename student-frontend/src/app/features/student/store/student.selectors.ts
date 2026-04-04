import { createFeatureSelector, createSelector } from "@ngrx/store";
import { StudentState } from "./student.reducer";

export const selectStudentState=
createFeatureSelector<StudentState>('students');

export const selectedStudents=createSelector(
    selectStudentState,
    state=>state.students
);

export const selectTotalCount=createSelector(
    selectStudentState,
    state=>state.totalCount
);

export const selectLoading=createSelector(
    selectStudentState,
    state=>state.loading
);