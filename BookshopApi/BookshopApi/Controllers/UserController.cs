using Microsoft.AspNetCore.Mvc;
using BookshopApi.Data;
using BookshopApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookshopApi.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<List<User>> GetAll()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<User> GetById(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        [HttpPost]
        public async Task Create([FromBody] User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User userLoginRequest)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == userLoginRequest.Username && u.Password == userLoginRequest.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            return Ok(new { message = "Login successful", userId = user.Id});
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            var userToDelete = await _context.Users.FindAsync(id);
            _context.Remove(userToDelete);
            await _context.SaveChangesAsync();
        }
    }
}
