namespace NextStepBackend.Data;

public static class DbInitializer
{
    public static void Initialize(NextStepDbContext context)
    {
        context.Database.EnsureCreated();

        // Add any seed data here if needed
        if (!context.Users.Any())
        {
        }
    }
}