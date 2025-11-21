using MateshopApi.Controllers;
using MateshopApi.Data;
using MateshopApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace MateshopApi.Tests
{
    public class BookPostControllerTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Crear una nueva base de datos en memoria para cada prueba
                .Options;

            return new ApplicationDbContext(options);
        }
        
        [Fact]
        public async Task GetAll_ReturnsListOfBookPosts()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            context.Mates.AddRange(
                new Mate
                {
                    Name = "1984",
                    Brand = "George Orwell",
                    Category = "Dystopic",
                    Description = "Great book",
                    Condition = "used",
                    Price = 8,
                    Date = DateTime.Now,
                    ImageUrl = "",
                    UserId = 1
                },
                new Mate
                {
                    Name = "Atlas Shrugged",
                    Brand = "Ayn Rand",
                    Category = "Novel",
                    Description = "Story of John Galt",
                    Condition = "used",
                    Price = 10,
                    Date = DateTime.Now,
                    ImageUrl = "",
                    UserId = 3
                }
            );
            context.SaveChanges();

            var controller = new MateController(context);

            // Act
            var result = await controller.GetAll();

            // Assert
            Assert.Equal(2, result.Count);

            Assert.Equal("1984", result[0].Name);
            Assert.Equal("George Orwell", result[0].Brand);
            Assert.Equal("Dystopic", result[0].Category);
            Assert.Equal("Great book", result[0].Description);
            Assert.Equal("used", result[0].Condition);
            Assert.Equal(8, result[0].Price);
            Assert.Equal(DateTime.Today, result[0].Date?.Date);
            Assert.Equal("", result[0].ImageUrl);
            Assert.Equal(1, result[0].UserId);

            Assert.Equal("Atlas Shrugged", result[1].Name);
            Assert.Equal("Ayn Rand", result[1].Brand);
            Assert.Equal("Novel", result[1].Category);
            Assert.Equal("Story of John Galt", result[1].Description);
            Assert.Equal("used", result[1].Condition);
            Assert.Equal(10, result[1].Price);
            Assert.Equal(DateTime.Today, result[1].Date?.Date);
            Assert.Equal("", result[1].ImageUrl);
            Assert.Equal(3, result[1].UserId);
        }
        
 
        [Fact]
        public async Task GetById_ReturnsBookPostById()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            context.Mates.Add(new Mate
                {
                    Name = "1984",
                    Brand = "George Orwell",
                    Category = "Dystopic",
                    Description = "Great book",
                    Condition = "used",
                    Price = 8,
                    Date = DateTime.Now,
                    ImageUrl = "",
                    UserId = 1
                });
            context.SaveChanges();

            var controller = new MateController(context);

            // Act
            var result = await controller.GetById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            Assert.Equal("1984", result.Name);
            Assert.Equal("George Orwell", result.Brand);
            Assert.Equal("Dystopic", result.Category);
            Assert.Equal("Great book", result.Description);
            Assert.Equal("used", result.Condition);
            Assert.Equal(8, result.Price);
            Assert.Equal(DateTime.Today, result.Date?.Date);
            Assert.Equal("", result.ImageUrl);
            Assert.Equal(1, result.UserId);
        }

        [Fact]
        public async Task Create_AddsBookPost()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new MateController(context);

            var newMate = new Mate{
                                Name = "1984",
                                Brand = "George Orwell",
                                Category = "Dystopic",
                                Description = "Great book",
                                Condition = "used",
                                Price = 8,
                                Date = DateTime.Now,
                                ImageUrl = "",
                                UserId = 1
                            };

            // Act
            await controller.Create(newMate);

            // Assert
            var mate = await context.Mates.FindAsync(1);
            Assert.NotNull(mate);
            Assert.Equal("1984", mate.Name);
            Assert.Equal("George Orwell", mate.Brand);
            Assert.Equal("Dystopic", mate.Category);
            Assert.Equal("Great book", mate.Description);
            Assert.Equal("used", mate.Condition);
            Assert.Equal(8, mate.Price);
            Assert.Equal(DateTime.Today, mate.Date?.Date);
            Assert.Equal("", mate.ImageUrl);
            Assert.Equal(1, mate.UserId);
        }

        [Fact]
        public async Task Update_UpdatesBookPost()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var existingMate = new Mate{
                                Name = "1984",
                                Brand = "George Orwell",
                                Category = "Dystopic",
                                Description = "Great book",
                                Condition = "used",
                                Price = 8,
                                Date = DateTime.Now,
                                ImageUrl = "",
                                UserId = 1
                            };
            context.Mates.Add(existingMate);
            context.SaveChanges();

            var controller = new MateController(context);

            var updatedMate = new Mate { Id = 1, Description = "Updated description" };

            // Act
            await controller.Update(updatedMate);

            // Assert
            var mate = await context.Mates.FindAsync(1);
            Assert.NotNull(mate);
            Assert.Equal("Updated description", mate.Description);
        }

        [Fact]
        public async Task Delete_RemovesBookPost()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var mateToDelete = new Mate{
                                Name = "1984",
                                Brand = "George Orwell",
                                Category = "Dystopic",
                                Description = "Great book",
                                Condition = "used",
                                Price = 8,
                                Date = DateTime.Now,
                                ImageUrl = "",
                                UserId = 1
                            };
            context.Mates.Add(mateToDelete);
            context.SaveChanges();

            var controller = new MateController(context);

            // Act
            await controller.Delete(1);

            // Assert
            var mate = await context.Mates.FindAsync(1);
            Assert.Null(mate);
        }
    }
}
