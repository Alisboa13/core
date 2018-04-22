using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using think_agro_metrics.Model.Indicator1;

namespace think_agro_metrics.Controllers {

  [Route ("api/[controller]")]
  public class Indicator1AController : Controller {

    private static string[] Events = new string[] {
      "Feria Internacional Universidad de Talca",
      "Conferencia Internacional de University of New South Whales",
      "Convención anual Qantas AU",
      "The ACM-ICPC Contest",
      "Google I/O",
      "Mobile World Congress:MWC18"
    };

    [HttpGet ("[action]")]
    public IEnumerable<Detail1A> Index () {
      var rnd = new Random ();
      return Enumerable.Range (1, 10).Select (index => new Detail1A {
        date = DateTime.Now.AddDays (index).ToString ("d"),
          name = Indicator1AController.Events[rnd.Next (0, 5)],
          documenturl = "#"
      });
    }
  }
}