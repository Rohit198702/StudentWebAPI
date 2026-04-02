using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentApi.Data;
using StudentApi.DTO;
using StudentApi.Models;

namespace StudentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentsController(AppDbContext context) 
        { 
            _context = context;        
        }

        [HttpGet]
        public async Task<IActionResult> GetStudents()
        {
            return Ok(await _context.Students.ToListAsync());
        }

        [HttpGet("Courses")]
        public async Task<IActionResult> GetCourses()
        {
            var data = await _context.Students.Include(s => s.Courses)
                .Select(s => new 
                {
                    Id=s.Id,                    
                    StudentName = s.Id != 0 ? s.Name : "",
                    StudentAddress = s.Id != 0 ? s.Address : "",
                    ContactNumber = s.Id != 0 ? s.ContactNo : "",
                    Courses = s.Courses!.Select(c => c.Title).ToList()
                }).ToListAsync();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> AddStudent(StudentDto studentdto)
        {
            var student = new Student
            {
                Name = studentdto.Name,
                Email = studentdto.Email,
                Address = studentdto.Address,
                ContactNo = studentdto.ContactNo,
            };
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            return Ok(student);
        }
        [HttpPost("course")]
        public async Task<IActionResult> AddCourse(CourseDto coursedto)
        {
            var student = await _context.Students.FindAsync(coursedto.StudentId);

            if(student == null)
            {
                return NotFound("Student not found");
            }

            var course=new Course{
                Title = coursedto.Title,
                StudentId =coursedto.StudentId,
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return Ok(course);
        }
        [HttpPut("update-course/{id}")]
        public async Task<IActionResult> UpdateCourse(int id, Student updateStudent)
        {
            if (id != updateStudent.Id)
            {
                return BadRequest("Id mismatch");
            }

            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound("Student Not Found");
            }
            if (!string.IsNullOrWhiteSpace(updateStudent.Name) && updateStudent.Name != "string")
            {
                student.Name = updateStudent.Name;
            }
            if (!string.IsNullOrWhiteSpace(updateStudent.Address) && updateStudent.Address != "string")
            {
                student.Address = updateStudent.Address;
            }
            if (!string.IsNullOrWhiteSpace(updateStudent.ContactNo) && updateStudent.ContactNo != "string")
            {
                student.ContactNo = updateStudent.ContactNo;
            }
            if (!string.IsNullOrWhiteSpace(updateStudent.Email) && updateStudent.Email != "string")
            {
                student.Email = updateStudent.Email;
            }
            

            await _context.SaveChangesAsync();
            return Ok(student);
        }
    }
}
