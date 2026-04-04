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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';import { MatListModule } from '@angular/material/list';import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTooltipModule } from '@angular/material/tooltip';
import FileSaver, {saveAs} from 'file-saver';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { StudentDialogComponent } from '../student-dialog/student-dialog';
import { MatPaginatorModule,MatPaginator } from '@angular/material/paginator';
import { MatSortModule,MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx-js-style';
import { Store } from '@ngrx/store';
import * as StudentActions from './store/student.actions';
import * as StudentSelectors from './store/student.selectors';

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
    MatTooltipModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule   
  ],
  templateUrl: './student.html',
  styleUrl: './student.css',
})

export class StudentComponent implements OnInit {
    dataSource=new MatTableDataSource<Student>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    students: Student[] = [];
    selectedStudentId:number | null =null;
    selectedStudents:any[]=[];
    editIndex:number | null =null;
  
    newStudent:Student={
      id:0,
      name:'',
      email:'',
      contactNo:'',
      address:''
    }

    constructor(
      private store:Store,
      private studentService:StudentService,
      private dialog:MatDialog,    
      private cd: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
      this.store.dispatch(
        StudentActions.loadStudents({params:{}})
      );

      this.store.select(StudentSelectors.selectedStudents).subscribe(data=>{
        this.students=data;
        this.dataSource.data=data;
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
        if(this.newStudent.id !== 0){
          this.studentService.updateStudent(this.newStudent).subscribe(()=>{
              this.store.dispatch(
                StudentActions.loadStudents({ params: {} })
              );
              this.selectedStudents=this.selectedStudents.map(s=>
                s.id === this.newStudent.id ? { ...this.newStudent } : s
              )              
              this.editIndex=null;
              this.newStudent={...this.resetStudent};
          });
        }
          
      }else{
          this.studentService.addStudent(this.newStudent).subscribe(()=>{
            this.store.dispatch(
            StudentActions.loadStudents({ params: {} })
            );
            this.selectedStudents=[];          
            this.newStudent={...this.resetStudent};
        });
      }      
    }

    

    onSelectStudent(){
      this.selectedStudents = [];
      const student=this.students.find(
        s=>s.id == this.selectedStudentId
      );          

      this.selectedStudents= student ? [student] : [];
      this.selectedStudentId=null;
    }

  
    
    exportToPDF() {
      const doc=new jsPDF();

      let yPosition=10;

      const groupedData= this.students.reduce((acc:any, student:any)=>{
        const key=student.address;
        
        if(!acc[key]) acc[key]=[];
        acc[key].push(student);

        return acc;
      },{});
    
      Object.keys(groupedData).forEach((group, index)=>{
        doc.setFontSize(14);
        doc.text(`${group}`,10,yPosition);
        yPosition += 5;     
      
      autoTable(doc, {
        startY:yPosition,
        head: [['ID','Name','Email','Contact No']],
        body: groupedData[group].map((s:any)=>[
          s.id,
          s.name,
          s.email,
          s.contactNo
        ])
      });

        yPosition=(doc as any).lastAutoTable.finalY + 10;
    });
      doc.save('students.pdf');

    }
    reset() {      
        this.selectedStudents=[];       
        this.newStudent={...this.resetStudent}; 
    }


    exportToExcel(){   
      const groupedData=this.students.reduce((acc:any, student:any)=>{
         const key=student.address || 'Unknown';

         if(!acc[key]) acc[key]=[];
         acc[key].push(student);

         return acc;
      },{});



        const excelData: any[]=[];

        Object.keys(groupedData).forEach(group => {
          excelData.push({
            'ID':`${group}`,
            'Name':'',
            'Email':'',
            'Contact No':''
          });

          groupedData[group].forEach((s:any)=>{
            excelData.push({
              'ID':s.id,
              'Name':s.name,
              'Email':s.email,
              'Contact No':s.contactNo
            });
          });


          excelData.push({});
        });

        //convert to worksheet
        const headers=['ID','Name','Email','Contact No'];
        const worksheet:XLSX.WorkSheet=XLSX.utils.json_to_sheet(excelData, {header:headers});

        const columnWidths:number[]=[];

        const range =XLSX.utils.decode_range(worksheet['!ref']!);
        const totColumns=range.e.c+1;
        const merges:any[] =[];
        const addressRows:number[]=[];

        excelData.forEach(row => {
          Object.values(row).forEach((val:any, i) => {
            const len=val ? val.toString().length :0;
            columnWidths[i]=Math.max(columnWidths[i] || 10, len);
          });
        });
       
        worksheet['!cols']=columnWidths.map(w=>({
          wch:w+2
        }));

        excelData.forEach((row, index)=>{
          const isGroupRow=
          row['ID'] && !row['Name'] && !row['Email'] && !row['Contact NO'];
          if(isGroupRow){
              const excelRow=index+1;

             merges.push({
              s:{r:excelRow, c:0 },
              e:{r:excelRow, c:totColumns -1}
            });
            addressRows.push(excelRow);
          }

        });

        worksheet['!merges']=merges;

        addressRows.forEach(r=>{
          const addr=XLSX.utils.encode_cell({r,c:0});

          if(!worksheet[addr]) return;

          worksheet[addr].s={
            font:{
              bold:true,
              sz:14
            },
            alignment:{
              horizontal:"left"
            }
          };
        });
        for(let C=range.s.c; C<=range.e.c; ++C){
          const cellAddress=XLSX.utils.encode_cell({r:0, c:C});          

          if(!worksheet[cellAddress]) continue;

          worksheet[cellAddress].s={
            font:{
              bold:true,
              sz:14
            }
          };
        }
        const workbook:XLSX.WorkBook={
          Sheets:{'Students':worksheet},
          SheetNames:['Students']
        };

        const excelBuffer=XLSX.write(workbook, {
            bookType:'xlsx',
            type:'array'
        });

        this.saveAsExcelFile(excelBuffer,'Students');
    }

    saveAsExcelFile(buffer:any, fileName:string):void {
      const data:Blob =new Blob([buffer],{
        type:`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF8`
      });

      FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xlsx');
    }

    openDialog() { 
      const dialogRef=this.dialog.open(StudentDialogComponent,{
        width: '80vw',       // ✅ responsive width
        maxWidth: '95vw',    // ✅ prevent cutoff
        height: 'auto',
        data: this.students
      });

      dialogRef.afterClosed().subscribe(result=>{
        if(result?.action === 'edit'){
          console.log(result.data);
          this.newStudent={...result.data};
          this.editIndex=this.students.findIndex(
            s=>s.id === result.data.id
          );
          this.cd.detectChanges();
        }
      });
    }
}


