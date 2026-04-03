import { CommonModule } from '@angular/common';
import { Component, Inject,ViewChild,AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Student,StudentService } from '../../services/student';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-student-dialog', 
  standalone:true,
  imports:[   
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,   
  ], 
  templateUrl: './student-dialog.html'
})
export class StudentDialogComponent implements OnInit,AfterViewInit{
    displayedColumns:string[]=['index','name','email','contactNo','address','actions'];
    dataSource=new MatTableDataSource<Student>();
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any[],
      private studentService: StudentService,
      private cd:ChangeDetectorRef,
      private dialogRef:MatDialogRef<StudentDialogComponent>
    ){}
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    selectedStudentId:number | null =null;
    selectedStudents:any[]=[];
    editIndex:number | null =null;
     students: Student[] = [];
        newStudent:Student={
          id:0,
          name:'',
          email:'',
          contactNo:'',
          address:''          
        }
    ngOnInit() {
      console.log(this.data);
    this.dataSource =new MatTableDataSource(this.data); // 🔥 set dialog data
  }

     ngAfterViewInit(){
      if (this.paginator) {
        this.dataSource.paginator=this.paginator;
      }
      if(this.sort){
        this.dataSource.sort=this.sort;
      }      
      this.cd.detectChanges();
    }

        loadStudents(){
        this.studentService.getStudents().subscribe({
          next:(data) => {           
            this.students=[...data];
            this.dataSource.data=this.students;
            this.cd.detectChanges();           
          },
          error(err) {
            console.error('API Error', err);
          },            
        });
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

    editStudent(student:any, index:number){       
      this.dialogRef.close({
        action:'edit',
        data:student
      });
    }   
}
