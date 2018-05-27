import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { PercentPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions,  } from '@angular/http';
import { HttpClient } from '@angular/common/http';

// Models
import { Indicator } from '../../shared/models/indicator';
import { IndicatorType } from '../../shared/models/indicatorType';
import { Router } from '@angular/router';
import { Registry } from '../../shared/models/registry';
import { Document } from '../../shared/models/document';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

// Services
import { IndicatorService } from '../../services/indicator/indicator.service';
import { RegistryService } from '../../services/registry/registry.service';
import { IndicatorDisplayComponent } from '../indicator-home/indicator-display/indicator-display.component';
import { $ } from 'protractor';

@Component({
  selector: 'app-indicator-detail',
  templateUrl: './indicator-detail.component.html',
  styleUrls: ['./indicator-detail.component.css'],
})
export class IndicatorDetailComponent implements OnInit {
  public indicator: Indicator = new Indicator();
  public idIndicator = -1;
  public registriesCount = 0;


  public indicator$: Observable<Indicator>;
  router: Router;
  modalRef: BsModalRef;

  public registry: Registry = null; // For EditRegistry
  public type: number;
  public editModalRef: BsModalRef;

  // For filtering by years
  private static ALL_YEARS = 'Todos los años';
  private static YEAR = 'Año '; // Part of the string that the DropDown has to show as selected
  allYears: string = IndicatorDetailComponent.ALL_YEARS;
  selectionYear: string; // Dropdow year "Año 2018"
  selectedYear: number; // Numeric value for selectionYear
  years: number[] = []; // List of years from 2018 to CurrentYear

  constructor(private service: IndicatorService,
    router: Router,
    private registryService: RegistryService,
    private route: ActivatedRoute,
    private modalService: BsModalService) {
    this.idIndicator = this.route.snapshot.params.idIndicator;
    this.router = router;
  }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.getIndicator(this.idIndicator, currentYear);
    const baseYear = 2018;
    for (let i = 0; i <= (currentYear - baseYear); i++) {
      this.years[i] = baseYear + i;
    }
    this.selectionYear = IndicatorDetailComponent.YEAR + currentYear; // Show Año 2018 on dropdown
    this.selectedYear = currentYear; // 2018 (current year) is the selected year
    
    //console.log(this.indicator.registries[0].date);

  }

  get Date()
  {
    return this.indicator.registries[0].date;
  }

  selectRegistriesYear(year: any) {
    if (year === IndicatorDetailComponent.ALL_YEARS) {
      this.getIndicator(this.idIndicator); // Show all the registries
      this.selectionYear = IndicatorDetailComponent.ALL_YEARS;
      this.selectedYear = -1;
    }
    else {
      this.getIndicator(this.idIndicator, year); // Show registries from the year selected
      this.selectionYear = IndicatorDetailComponent.YEAR + year; // Change the text on the dropdown
      this.selectedYear = year;
    }
  }

  openModalEditRegistry(template: TemplateRef<any>, selectedRegistry: Registry) {
    this.registry = selectedRegistry;
    this.type = this.indicator.type;
    this.editModalRef = this.modalService.show(template);
  }

  private getIndicator(indicatorId: number, year?: number) {
    if (!year) {
      this.service.getIndicator(indicatorId).subscribe(
        data => {
          this.indicator = data;
          this.registriesCount = data.registries.length;
        },
        err => console.error(err)
      );
    }
    else {
      this.service.getIndicatorYearRegistries(indicatorId, year).subscribe(
        data => {
          this.indicator.registries = data.registries;
          this.registriesCount = data.registries.length;
        },
        err => console.error(err))
    };
    
  }

  private deleteRegistry (registry: Registry) {
    const date: Date = new Date(registry.date);
    const formatedDate: string = date.getDate() + '-' + (+date.getMonth() + 1) + '-' + date.getFullYear();
    const result = confirm('Está seguro que desea eliminar el registro: \n' + formatedDate + ' - ' + registry.name);

    if (result) {
      let removed: Registry;
      this.service.deleteRegistry(registry.registryID).subscribe(
        data => {
          removed = data;
          this.registriesCount--; },
        err => console.error(err)
      );

      const index: number = this.indicator.registries.indexOf(registry);
      if ( index !== -1) {
        this.indicator.registries.splice(index, 1);
        
      }
    }
    
  }

  deleteDocument(registry: Registry, document: Document) {
    const result = confirm('Está seguro que desea elimianr el documento: ' + document.documentName);
    if (registry.documents.length === 1) {
      alert('Debe existir al menos un documento de respaldo para el registro');
      return;
    }
    if (result) {
      let removed: Document;
      this.registryService.deleteDocument(document).subscribe(
        data => {
          removed = data;
        },
        err => console.error(err)
      );

      const index: number = registry.documents.indexOf(document);
      if (index !== -1) {
        registry.documents.splice(index, 1);
      }
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  gotoAddRegistry() {
    this.router.navigateByUrl('/indicator-add-registry');
  }

  gotoRegistry() {
    this.router.navigateByUrl('/registry-details/' + 1); //Reemplazar por ID, sacado del button
    
  }


  // lineChart
  public lineChartData:Array<any> = [
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Series A'}
  ];
  public lineChartLabels:Array<any> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public lineChartOptions:any = {
    responsive: true,
    elements:{
      point:{
        radius: 5,
        hitRadius: 5,
        hoverRadius: 7,
        hoverBorderWidth: 2
      }
    }
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(144,188,36,0.4)',
      borderColor: 'rgba(0,149,58,1)',
      pointBackgroundColor: 'rgba(0,149,58,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
   
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
 
  public randomize() {
  


    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    _lineChartData[0] = {data: new Array(this.lineChartData[0].data.length), label: this.lineChartData[0].label};
    
    let cantidad = 0;
    let cantidadAcumulada = 0;
    let monthMin = 0;

    /* Se ingresa 0 a todos los datos en el arreglo provisorio de los meses (_lineChartData) */
    for (let i = 0; i < 12; i++) 
    {
      _lineChartData[0].data[i] = 0;
    }
    this.lineChartData = _lineChartData;//se ingresa los datos del arreglo provisorio al arreglo de meses original
    
    /* Ingreso de datos al arreglo provisorio de meses */
    for(let i=0; i<this.indicator.registries.length; i++)
    {
      let date: Date = new Date(this.indicator.registries[i].date);
      let month = date.getMonth();

      /* if si el registro es de cantidad */
      if(this.indicator.registries[i].discriminator=="QuantityRegistry")
      {
        cantidad = this.indicator.registries[i].quantity;

        for (let j = 0; j < 12; j++) 
        {
          if(j>=month)
          {
            _lineChartData[0].data[j] += cantidad;
          }     
        } 
      }
      else //caso contrario si el registro es default o algun otro que no sea cantidad
      {
        cantidad = 1; 
        for (let j = 0; j < 12; j++) 
        {
          if(j>=month)
          {
            _lineChartData[0].data[j] += cantidad;
          } 
        }
      }
    }  
        
    this.lineChartData = _lineChartData;//se ingresa los datos del arreglo provisorio al arreglo de meses original
    console.log("largo registro: "+this.indicator.registries.length);
    //window.location.reload(true);
  }
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

}

