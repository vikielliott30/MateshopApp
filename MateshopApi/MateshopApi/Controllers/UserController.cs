using MateshopApi.Data;
using MateshopApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MateshopApi.Controllers
{
    [Route("api/users")]
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
        public async Task<IActionResult> Login([FromBody] User user)
        {
            var u = await _context.Users.FirstOrDefaultAsync(x => x.Username == user.Username && x.Password == user.Password);
            if (u == null) return Unauthorized();
            return Ok();
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
