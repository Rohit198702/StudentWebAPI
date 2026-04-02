import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Student,StudentService } from '../../services/student';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-student',
  standalone:true,
  imports: 
  [
    CommonModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './student.html',
  styleUrl: './student.css',
})

export class StudentComponent implements OnInit,AfterViewInit {
    dataSource=new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    students: Student[] = [];
    selectedStudentId:number | null =null;
    selectedStudents:any[]=[];
    editIndex:number | null =null;
    displayedColumns:string[]=['index','name','email','contactNo','address','actions'];
    newStudent:Student={
      id:0,
      name:'',
      email:'',
      contactNo:'',
      address:''
    }

    constructor(
      private studentService: StudentService,
      private cd:ChangeDetectorRef
    ) {}

    ngOnInit(): void {
      this.loadStudents();      
    }

    ngAfterViewInit(){
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
    }


    loadStudents(){
        this.studentService.getStudents().subscribe(data => {
            console.log(data);
            this.students=[...data];

            this.dataSource.data=this.students;
            this.cd.detectChanges();
            this.dataSource.paginator=this.paginator;
            this.dataSource.sort=this.sort;
        });

    }

    resetStudent={
      id:0,
      name:'',
      email:'',
      contactNo:'',
      address:''
    }

    addStudent() {
      if(this.editIndex !== null){
        console.log(this.editIndex);
        
          this.studentService.updateStudent(this.newStudent).subscribe(()=>{
              this.loadStudents();

              this.selectedStudents=this.selectedStudents.map(s=>
                s.id === this.newStudent.id ? { ...this.newStudent } : s
              )

              
              this.editIndex=null;
              this.newStudent={...this.resetStudent};
          })
      }else{
          this.studentService.addStudent(this.newStudent).subscribe(()=>{
            this.loadStudents();
            this.selectedStudents=[];          
            this.newStudent={...this.resetStudent};
        });
      }      
    }

    deleteStudent(id:number){
      if(confirm('Are you sure you want to delete?')){
        this.studentService.deleteStudent(id).subscribe(
          ()=> {
            this.loadStudents();
            this.selectedStudents=this.selectedStudents.filter(s=>
                s.id !==id
              );             

              this.selectedStudentId = null;
          });
      }
    }

    onSelectStudent(){
      this.selectedStudents = [];
      const student=this.students.find(
        s=>s.id == this.selectedStudentId
      );
      this.selectedStudents= student ? [student] : [];
      
      if(student){
        console.log(student);
        if(!this.selectedStudents.some(s => s.id == student.id)) {
          this.selectedStudents = [...this.selectedStudents, student];
        }
      }
      this.selectedStudentId=null;
    }

    editStudent(student:any, index:number){
      this.newStudent={...student};
      this.editIndex=index;
    }    
}


