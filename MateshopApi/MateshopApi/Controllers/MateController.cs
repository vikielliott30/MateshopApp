using MateshopApi.Data;
using MateshopApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MateshopApi.Controllers
{
    [Route("api/mates")]
    [ApiController]
    public class MateController : ControllerBase
    {
        private ApplicationDbContext _context;

        public MateController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<List<Mate>> GetAll()
        {
            return await _context.Mates.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<Mate> GetById(int id)
        {
            return await _context.Mates.FindAsync(id);
        }

        [HttpPost]
        public async Task Create([FromBody] Mate mate)
        {
            mate.Date = DateTime.Now;
            await _context.Mates.AddAsync(mate);
            await _context.SaveChangesAsync();
        }

        [HttpPut("{id}")]
        public async Task Update([FromBody] Mate mate)
        {
            Mate mateToUpdate = await _context.Mates.FindAsync(mate.Id);
            mateToUpdate.Name = mate.Name;
            mateToUpdate.Brand = mate.Brand;
            mateToUpdate.Category = mate.Category;
            mateToUpdate.Description = mate.Description;
            mateToUpdate.Condition = mate.Condition;
            mateToUpdate.Price = mate.Price;
            mateToUpdate.ImageUrl = mate.ImageUrl;

            await _context.SaveChangesAsync();
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            var mateToDelete = await _context.Mates.FindAsync(id);
            _context.Remove(mateToDelete);
            await _context.SaveChangesAsync();
        }
    }
}
