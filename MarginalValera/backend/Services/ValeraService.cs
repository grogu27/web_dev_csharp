using MarginalValera.Data;
using MarginalValera.Models;
using Microsoft.EntityFrameworkCore;
using MarginalValera.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MarginalValera.Services
{
    public class ValeraService
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher; 

        public ValeraService(AppDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();

        }

        public async Task<List<Valera>> GetAllValerasAsync()
        {
            return await _context.Valeras.ToListAsync();
        }

        public async Task<Valera> GetValeraAsync(int id)
        {
            var valera = await _context.Valeras.FindAsync(id);
            if (valera == null)
                throw new ArgumentException($"Valera with id {id} not found");
            return valera;
        }
        public async Task<Valera> AddValeraAsync(Valera? newValera, int ownerId)
        {
            var valera = new Valera
            {
                OwnerId = ownerId,
                Health = newValera?.Health ?? 100,
                Alcohol = newValera?.Alcohol ?? 0,
                Cheerfulness = newValera?.Cheerfulness ?? 0,
                Fatigue = newValera?.Fatigue ?? 0,
                Money = newValera?.Money ?? 0
            };

            _context.Valeras.Add(valera);
            await _context.SaveChangesAsync();
            return valera;
        }
        private void CheckAccess(Valera valera, ClaimsPrincipal user)
        {
            if (user.IsInRole("Admin"))
                return;

            int userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier));
            if (valera.OwnerId != userId)
                throw new UnauthorizedAccessException("Это не ваша Валера");
        }


            public async Task<Valera> DoActionAsync(int id, string action, ClaimsPrincipal user)
            {
                var valera = await _context.Valeras.FindAsync(id);
                if (valera == null)
                    throw new ArgumentException($"Valera with id {id} not found");
                CheckAccess(valera, user);

                if (valera == null)
                {
                    valera = new Valera();
                    _context.Valeras.Add(valera);
                    await _context.SaveChangesAsync();
                }

                bool success;

                switch (action.ToLower())
                {
                    case "work":
                        success = valera.GoToWork();
                        break;
                    case "nature":
                        valera.EnjoyNature();
                        success = true;
                        break;
                    case "wine":
                        success = valera.DrinkWineAndWatchSeries();
                        break;
                    case "bar":
                        success = valera.GoToBar();
                        break;
                    case "marginals":
                        success = valera.DrinkWithMarginals();
                        break;
                    case "sing":
                        valera.SingInMetro();
                        success = true;
                        break;
                    case "sleep":
                        valera.Sleep();
                        success = true;
                        break;
                    default:
                        throw new ArgumentException($"Unknown action: {action}");
                }

                if (!success)
                    throw new InvalidOperationException("Not enough money to perform this action");

                await _context.SaveChangesAsync();
                return valera;
            }
            public async Task DeleteValeraAsync(int id, ClaimsPrincipal user)
            {
                var valera = await _context.Valeras.FindAsync(id);
                if (valera == null)
                    throw new ArgumentException($"Valera with id {id} not found");

                if (user.IsInRole("Admin"))
                {
                    _context.Valeras.Remove(valera);
                    await _context.SaveChangesAsync();
                    return;
                }
                var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? throw new UnauthorizedAccessException("UserId not found in token");

                int userId = int.Parse(userIdClaim);
                //int userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier));
                if (valera.OwnerId != userId)
                    throw new UnauthorizedAccessException("You cannot delete someone else's Valera");


                _context.Valeras.Remove(valera);
                await _context.SaveChangesAsync();
            }
  

        }
}
