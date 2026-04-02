using System.Text.Json.Serialization;

namespace StudentApi.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }


        //extra fields
        public string? Address { get; set; }
        public string? ContactNo { get; set; }
        [JsonIgnore]
        public ICollection<Course>? Courses { get; set; }
    }
}
