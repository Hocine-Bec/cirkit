using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Extensions;

namespace Presentation.Controllers;

[ApiController]
[Route("api/admin/analytics")]
[Authorize(Roles = "Admin,Staff")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;
    public AnalyticsController(IAnalyticsService analyticsService) => _analyticsService = analyticsService;

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
        => (await _analyticsService.GetOverviewAsync()).HandleResult();

    [HttpGet("revenue")]
    public async Task<IActionResult> GetDailyRevenue([FromQuery] int days = 30)
        => (await _analyticsService.GetDailyRevenueAsync(days)).HandleResult();

    [HttpGet("orders-by-status")]
    public async Task<IActionResult> GetOrdersByStatus()
        => (await _analyticsService.GetOrdersByStatusAsync()).HandleResult();
}
