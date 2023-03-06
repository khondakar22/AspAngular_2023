namespace Rk.Webapi.Helpers
{
    public class PaginationHeader
    {
        public PaginationHeader(int currentPage, int totalItems, int itemsPerPage, int totalCount)
        {
            CurrentPage = currentPage;
            TotalItems = totalItems;
            ItemsPerPage = itemsPerPage;
            TotalCount = totalCount;
        }
        public int CurrentPage { get; set; }
        public int TotalItems { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalCount { get; set; }
    }
}
