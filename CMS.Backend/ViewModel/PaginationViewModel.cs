using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.ViewModel
{
    public class PaginationViewModel<T>
    {
        public List<T> Items { get; set; } = new();

        public int CurrentPage { get; set; }

        public int TotalPages { get; set; }

        public int TotalItems { get; set; }

        public int PageSize { get; set; }

        public string Keyword { get; set; } = "";
    }
}
