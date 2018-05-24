﻿using System;
using System.Collections.Generic;
using System.Linq;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using think_agro_metrics.Data;
using think_agro_metrics.Models;

namespace think_agro_metrics.Controllers
{
    [Produces("application/json")]
    [Route("api/Indicators")]
    public class IndicatorsController : Controller
    {
        private readonly DataContext _context;

        public IndicatorsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Indicators
        [HttpGet]
        public IEnumerable<Indicator> GetIndicators()
        {
            _context.Indicators.Include(x => x.Registries)
                .ThenInclude(x => x.Documents).ToList();
            _context.Indicators.Include(x => x.Goals).ToList();
            _context.LinkRegistries.Include(x => x.Links).ToList();
            return _context.Indicators;
        }

        // GET: api/Indicators/5
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetIndicator([FromRoute] long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var indicatorQuery = _context.Indicators.Where(x => x.IndicatorID == id);

            await indicatorQuery.Include(x => x.Registries)
                .ThenInclude(x => x.Documents).ToListAsync();
            await _context.Indicators.Include(x => x.Goals).ToListAsync();
            await _context.LinkRegistries.Include(x => x.Links).ToListAsync();

            var indicator = await indicatorQuery.SingleAsync();

            if (indicator == null)
            {
                return NotFound();
            }

            return Ok(indicator);
        }

        // GET: api/Indicators/Calculate
        [Route("Calculate")]
        public async Task<IActionResult> CalculateIndicators()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Load from the DB the Indicators with its Registries, Documents, and Links
            _context.Indicators.Include(x => x.Registries).ToList();
            _context.LinkRegistries.Include(x => x.Links).ToList();

            // Obtain the Indicators
            List<Indicator> indicators = new List<Indicator>();
            await _context.Indicators.ForEachAsync(x => indicators.Add(x));

            // If the indicators list is empty, show NotFound
            if (!indicators.Any())
            {
                return NotFound();
            }

            // List of the results of every indicator
            List<double> list = new List<double>();

            // Calculate every indicator
            foreach (Indicator indicator in indicators) {
                indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
                list.Add(indicator.IndicatorCalculator.Calculate(indicator.Registries));
            }
            
            // Return the list with the results
            return Ok(list);
        }
        
        // GET: api/Indicators/Calculate/2018
        [Route("Calculate/{year:int}")]
        public async Task<IActionResult> CalculateIndicators([FromRoute] int year)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Load from the DB the Indicators with its Registries, Documents, and Links
            _context.Indicators.Include(x => x.Registries).ToList();
            _context.LinkRegistries.Include(x => x.Links).ToList();

            // Obtain the Indicators
            List<Indicator> indicators = new List<Indicator>();
            await _context.Indicators.ForEachAsync(x => indicators.Add(x));

            // If the indicators list is empty, show NotFound
            if (!indicators.Any())
            {
                return NotFound();
            }

            // List of the results of every indicator
            List<double> list = new List<double>();

            // Calculate every indicator
            foreach (Indicator indicator in indicators) {
                indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
                list.Add(indicator.IndicatorCalculator.Calculate(indicator.Registries, year));
            }
            
            // Return the list with the results
            return Ok(list);
        }

        // GET: api/Indicators/Calculate/2018/1
        [Route("Calculate/{year:int}/{month:int}")]
        public async Task<IActionResult> CalculateIndicators([FromRoute] int year, [FromRoute] int month)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Load from the DB the Indicators with its Registries, Documents, and Links
            _context.Indicators.Include(x => x.Registries).ToList();
            _context.LinkRegistries.Include(x => x.Links).ToList();

            // Obtain the Indicators
            List<Indicator> indicators = new List<Indicator>();
            await _context.Indicators.ForEachAsync(x => indicators.Add(x));

            // If the indicators list is empty, show NotFound
            if (!indicators.Any())
            {
                return NotFound();
            }

            // List of the results of every indicator
            List<double> list = new List<double>();

            // Calculate every indicator
            foreach (Indicator indicator in indicators) {
                indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
                list.Add(indicator.IndicatorCalculator.Calculate(indicator.Registries, year, month+1)); // The month in Angular starts in 0 and in C# starts in 1
            }
            
            // Return the list with the results
            return Ok(list);
        }


        // PUT: api/Indicators/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIndicator([FromRoute] long id, [FromBody] Indicator indicator)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != indicator.IndicatorID)
            {
                return BadRequest();
            }

            _context.Entry(indicator).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IndicatorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Indicators
        [HttpPost]
        public async Task<IActionResult> PostIndicator([FromBody] Indicator indicator)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Indicators.Add(indicator);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIndicator", new { id = indicator.IndicatorID }, indicator);
        }

        // DELETE: api/Indicators/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIndicator([FromRoute] long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var indicator = await _context.Indicators.SingleOrDefaultAsync(m => m.IndicatorID == id);
            if (indicator == null)
            {
                return NotFound();
            }

            _context.Indicators.Remove(indicator);
            await _context.SaveChangesAsync();

            return Ok(indicator);
        }

        private bool IndicatorExists(long id)
        {
            return _context.Indicators.Any(e => e.IndicatorID == id);
        }
    }
}