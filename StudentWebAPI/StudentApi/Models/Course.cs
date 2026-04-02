using System.ComponentModel.DataAnnotations;

namespace StudentApi.Models
{
    public class Course
    {
        public int Id { get; set; }

        [Required]
        public string? Title { get; set; }

        public int StudentId { get; set; }

        public Student? Student { get; set; }
    }
}
