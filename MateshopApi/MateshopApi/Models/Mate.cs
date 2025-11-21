using System;

namespace MateshopApi.Models
{
    public class Mate
    {
        public int Id { get; set; }
        public string Name { get; set; }       // maps to Title
        public string Brand { get; set; }      // maps to Author
        public string Category { get; set; }   // maps to Genre
        public string Description { get; set; }
        public string Condition { get; set; }  // used, new
        public double Price { get; set; }
        public DateTime? Date { get; set; }
        public string ImageUrl { get; set; }

        public int UserId { get; set; }
    }
}
