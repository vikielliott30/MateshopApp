using Microsoft.EntityFrameworkCore;
using MateshopApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MateshopApi.Data
{
    public class ApplicationDbContext: DbContext
    {
        public DbSet<Mate> Mates { get; set; }
        public DbSet<User> Users { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Map the Mate entity to the existing BookPosts table to avoid schema changes
            modelBuilder.Entity<Mate>().ToTable("BookPosts");

            // Map renamed properties to their original column names
            modelBuilder.Entity<Mate>().Property(m => m.Name).HasColumnName("Title");
            modelBuilder.Entity<Mate>().Property(m => m.Brand).HasColumnName("Author");
            modelBuilder.Entity<Mate>().Property(m => m.Category).HasColumnName("Genre");

            base.OnModelCreating(modelBuilder);
        }
    }
}
