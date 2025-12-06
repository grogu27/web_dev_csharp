using MarginalValera.Data;
using MarginalValera.Models;
using Microsoft.EntityFrameworkCore;

namespace MarginalValera.Services
{
    public class ValeraService
    {
        private readonly AppDbContext _context;

        public ValeraService(AppDbContext context)
        {
            _context = context;
        }

        // Получить всех Валер
        public async Task<List<Valera>> GetAllValerasAsync()
        {
            return await _context.Valeras.ToListAsync();
        }

        // Получить Валеру по Id
        public async Task<Valera> GetValeraAsync(int id)
        {
            var valera = await _context.Valeras.FindAsync(id);
            if (valera == null)
                throw new ArgumentException($"Valera with id {id} not found");
            return valera;
        }
        public async Task<Valera> AddValeraAsync(Valera? newValera)
        {
            var valera = new Valera
            {
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

        // Создать новую Валеру
            public async Task<Valera> DoActionAsync(int id, string action)
            {
                var valera = await _context.Valeras.FindAsync(id);

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
            public async Task DeleteValeraAsync(int id)
            {
                var valera = await _context.Valeras.FindAsync(id);
                if (valera == null)
                    throw new ArgumentException($"Valera with id {id} not found");

                _context.Valeras.Remove(valera);
                await _context.SaveChangesAsync();
            }

        }
}
