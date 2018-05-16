import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { IndicatorHomeComponent } from './components/indicator-home/indicator-home.component';
import { IndicatorDisplayComponent } from './components/indicator-home/indicator-display/indicator-display.component';
import { IndicatorDetailComponent } from './components/indicator-detail/indicator-detail.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { IndicatorService } from './services/indicator/indicator.service';
import { IndicatorGroupService } from './services/indicator-group/indicator-group.service';
import { RegistryFormComponent } from './components/registry-form/registry-form.component';
import { RegistryDetailsComponent } from './components/registry-details/registry-details.component';
import { FileDocumentFormComponent } from './components/file-document-form/file-document-form.component';
import { LinkDocumentFormComponent } from './components/link-document-form/link-document-form.component';

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
    RegistryDetailsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ModalModule.forRoot(),

    RouterModule.forRoot([
      { path: 'indicator/:idIndicator', component: IndicatorDetailComponent },
      { path: 'registry-details/:id', component: RegistryDetailsComponent },
      { path: 'home',        component: IndicatorHomeComponent },
      { path: '',            component: IndicatorHomeComponent },
      { path: '**',          component: IndicatorHomeComponent }
    ])
  ],
  providers: [IndicatorService, IndicatorGroupService],
  bootstrap: [AppComponent]
})
export class AppModule { }
