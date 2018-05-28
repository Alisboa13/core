import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { IndicatorHomeComponent } from './components/indicator-home/indicator-home.component';
import { IndicatorDisplayComponent } from './components/indicator-home/indicator-display/indicator-display.component';
import { IndicatorDetailComponent } from './components/indicator-detail/indicator-detail.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResultHomeComponent } from './components/result-home/result-home.component';
import { ResultDisplayComponent } from './components/result-home/result-display/result-display.component';

import { IndicatorService } from './services/indicator/indicator.service';
import { IndicatorGroupService } from './services/indicator-group/indicator-group.service';
import { RegistryFormComponent } from './components/registry-form/registry-form.component';
import { RegistryDetailsComponent } from './components/registry-details/registry-details.component';
import { FileDocumentFormComponent } from './components/file-document-form/file-document-form.component';
import { LinkDocumentFormComponent } from './components/link-document-form/link-document-form.component';

import { RegistryEditorComponent } from './components/indicator-detail/registry-editor/registry-editor.component';
import { RegistryService } from './services/registry/registry.service';
import { IndicatorGraphOptionComponent } from './components/indicator-detail/indicator-graph-option/indicator-graph-option.component';
import { IndicatorDetailRegistryComponent } from './components/indicator-detail/indicator-detail-registry/indicator-detail-registry.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    IndicatorHomeComponent,
    IndicatorDetailComponent,
    IndicatorDisplayComponent,
    RegistryFormComponent,
    FileDocumentFormComponent,
    LinkDocumentFormComponent,
    RegistryDetailsComponent,
    RegistryEditorComponent,
    ResultDisplayComponent,
    ResultHomeComponent,
    IndicatorGraphOptionComponent,
    IndicatorDetailRegistryComponent
  ],
  imports: [
    BsDropdownModule.forRoot(),
    NgbModule.forRoot(),
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),

    RouterModule.forRoot([
      { path: 'indicator/:idIndicator', component: IndicatorDetailComponent },
      { path: 'registry-details/:id', component: RegistryDetailsComponent },
      { path: 'indicatorGroup/:idIndicatorGroup',   component: IndicatorHomeComponent },
      { path: 'registry-details/:id', component: RegistryDetailsComponent },
      { path: 'home',        component: ResultHomeComponent },
      { path: '',            component: ResultHomeComponent },
      { path: '**',          component: ResultHomeComponent },
    ])
  ],
  providers: [IndicatorService, IndicatorGroupService, RegistryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
