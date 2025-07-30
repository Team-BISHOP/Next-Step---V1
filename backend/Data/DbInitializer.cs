using NextStepBackend.Models;

namespace NextStepBackend.Data;

public static class DbInitializer
{
    public static void Initialize(NextStepDbContext context)
    {
        context.Database.EnsureCreated();

        // Check if database is already seeded
        if (context.Courses.Any())
        {
            return;
        }

        // Seed courses
        var courses = new Course[]
        {
            new Course
            {
                Title = "Introduction to Web Development",
                Description = "Learn the basics of HTML, CSS, and JavaScript",
                Level = "foundation",
                Category = "Web Development",
                XpPoints = 100,
                EstimatedHours = 20,
                ExternalUrl = "https://www.codecademy.com/learn/introduction-to-javascript"
            },
            new Course
            {
                Title = "React Fundamentals",
                Description = "Master React.js for modern web applications",
                Level = "intermediate",
                Category = "Frontend Development",
                XpPoints = 150,
                EstimatedHours = 30,
                ExternalUrl = "https://reactjs.org/tutorial/tutorial.html"
            },
            new Course
            {
                Title = "Database Design Principles",
                Description = "Learn SQL and database design concepts",
                Level = "foundation",
                Category = "Database",
                XpPoints = 120,
                EstimatedHours = 25,
                ExternalUrl = "https://sqlbolt.com/"
            },
            new Course
            {
                Title = "Python for Data Science",
                Description = "Introduction to Python, NumPy, and Pandas",
                Level = "intermediate",
                Category = "Data Science",
                XpPoints = 180,
                EstimatedHours = 40,
                ExternalUrl = "https://www.kaggle.com/learn/python"
            },
            new Course
            {
                Title = "Comptia Security+ Certification Prep",
                Description = "Basic concepts of information security",
                Level = "foundation",
                Category = "Cybersecurity",
                XpPoints = 130,
                EstimatedHours = 28,
                ExternalUrl = "https://www.cybrary.it/certification-prep-courses/security-plus"
            }
        };

        context.Courses.AddRange(courses);
        context.SaveChanges();
    }
}
