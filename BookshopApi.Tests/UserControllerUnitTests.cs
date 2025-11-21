using BookshopApi.Controllers;
using BookshopApi.Data;
using BookshopApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Mvc;

namespace BookshopApi.Tests
{
    public class UserControllerTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Crear una nueva base de datos en memoria para cada prueba
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task GetAll_ReturnsListOfUsers()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            context.Users.AddRange(
                new User { Username = "janedoe@gmail.com", Password = "janespassword" },
                new User { Username = "johndoe@gmail.com", Password = "johnspassword" }
            );
            context.SaveChanges();

            var controller = new UserController(context);

            // Act
            var result = await controller.GetAll();

            // Assert
            Assert.Equal(2, result.Count);

            Assert.Equal("janedoe@gmail.com", result[0].Username);
            Assert.Equal("janespassword", result[0].Password);

            Assert.Equal("johndoe@gmail.com", result[1].Username);
            Assert.Equal("johnspassword", result[1].Password);

        }

        [Fact]
        public async Task GetById_ReturnsUserById()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            context.Users.Add(new User { Username = "janedoe@gmail.com", Password = "janespassword" });
            context.SaveChanges();

            var controller = new UserController(context);

            // Act
            var result = await controller.GetById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            Assert.Equal("janedoe@gmail.com", result.Username);
            Assert.Equal("janespassword", result.Password);
        }

        [Fact]
        public async Task Create_AddsUser()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new UserController(context);

            var newUser = new User { Username = "janedoe@gmail.com", Password = "janespassword" };

            // Act
            await controller.Create(newUser);

            // Assert
            var user = await context.Users.FindAsync(1);
            Assert.NotNull(user);
            Assert.Equal("janedoe@gmail.com", user.Username);
            Assert.Equal("janespassword", user.Password);
        }

        [Fact]
        public async Task Login_CorrectPassword_LogsIn()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var existingUser = new User { Username = "janedoe@gmail.com", Password = "janespassword" };
            context.Users.Add(existingUser);
            context.SaveChanges();

            var controller = new UserController(context);
            var userToLogin = new User { Username = "janedoe@gmail.com", Password = "janespassword" };

            // Act
            var result = await controller.Login(userToLogin);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result); // se espera un 200 OK
            
        }

        [Fact]
        public async Task Delete_RemovesUser()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userToDelete = new User { Username = "janedoe@gmail.com", Password = "janespassword" };
            context.Users.Add(userToDelete);
            context.SaveChanges();

            var controller = new UserController(context);

            // Act
            await controller.Delete(1);

            // Assert
            var user = await context.Users.FindAsync(1);
            Assert.Null(user);
        }
    }
}
