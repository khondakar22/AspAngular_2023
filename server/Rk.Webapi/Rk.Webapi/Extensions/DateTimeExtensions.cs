namespace Rk.Webapi.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateTime dobOnly)
        {
            var today = DateTime.Today;
            var age = today.Year - dobOnly.Year;
            if (dobOnly > today.AddYears(-age)) age--;
            return age;
        }
    }
}
