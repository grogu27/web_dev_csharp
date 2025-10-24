using Microsoft.AspNetCore.Mvc;
using MarginalValera.Services;
using MarginalValera.Models;

namespace MarginalValera.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ValeraController : ControllerBase
    {
        private readonly ValeraService _service = new ValeraService();

        [HttpGet]
        public ActionResult<Valera> GetState()
        {
            return Ok(_service.GetState());
        }

        [HttpPost("{actionName}")]
        public ActionResult<Valera> DoAction(string actionName)
        {
            _service.DoAction(actionName);
            return Ok(_service.GetState());
        }
    }
}
