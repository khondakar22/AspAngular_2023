namespace Rk.Webapi.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateOnly dobOnly)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var age = today.Year - dobOnly.Year;
            if (dobOnly > today.AddYears(-age)) age--;
            return age;
        }
    }
}
