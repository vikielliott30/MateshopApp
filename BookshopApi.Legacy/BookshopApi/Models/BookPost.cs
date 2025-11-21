using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookshopApi.Models
{
    public class BookPost
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Genre { get; set; }
        public string Description { get; set; }
        public string Condition { get; set; } // used, new
        public double Price { get; set; }
        public DateTime? Date { get; set; }
        public string ImageUrl { get; set; }

        public int UserId { get; set; }
        
    }
}
