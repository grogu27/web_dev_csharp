// using Microsoft.EntityFrameworkCore;
// using BlogApp.DTOs.Pagination;

// namespace BlogApp.Helpers
// {
//     public static class QueryExtensions
//     {
//         public static async Task<PageResponse<T>> ToPagedListAsync<T>(
//             this IQueryable<T> source,
//             PageRequest request)
//         {
//             var count = await source.CountAsync();
            
//             if (!string.IsNullOrWhiteSpace(request.Search))
//             {
//                 // Поисковая логика должна быть реализована в конкретных сервисах
//                 // Здесь просто возвращаем исходный запрос
//             }

//             var items = await source
//                 .Skip((request.Page - 1) * request.PageSize)
//                 .Take(request.PageSize)
//                 .ToListAsync();

//             return new PageResponse<T>
//             {
//                 Items = items,
//                 TotalCount = count,
//                 Page = request.Page,
//                 PageSize = request.PageSize
//             };
//         }
//     }
// }
using Microsoft.EntityFrameworkCore;
using BlogApp.DTOs.Pagination;

namespace BlogApp.Helpers
{
    public static class QueryExtensions
    {
        public static async Task<PageResponse<T>> ToPagedListAsync<T>(
            this IQueryable<T> source,
            PageRequest request)
        {
            var count = await source.CountAsync();
            
            var items = await source
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            return new PageResponse<T>
            {
                Items = items,
                TotalCount = count,
                Page = request.Page,
                PageSize = request.PageSize
            };
        }
    }
}