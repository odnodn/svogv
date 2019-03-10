import { NgModule, Injector, Pipe, PipeTransform } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
// access to WebAPI
import { SiteApiService, EmitterService } from './services';
// custom components
import * as cmp from './components';
// routes' configuration
import { routes } from './configurations/routes';

import { FormValidatorService, FormValidatorFromJsonService, SvogvModule } from 'svogv';

const svogvModule = SvogvModule.forRoot();
const routerModule = RouterModule.forRoot(routes);

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    routerModule,
    svogvModule
  ],
  declarations: [
    // Demo app
    cmp.NavComponent
    , cmp.RootComponent
    , cmp.AboutComponent
    , cmp.DashboardComponent
    // Editor, Validation & Grid
    , cmp.EditorDemoComponent
    , cmp.EditorAutoformComponent
    , cmp.EditorListComponent
    , cmp.EditorNewComponent
    , cmp.EditorDemoComponent
    , cmp.EditorDeleteComponent
    // Widget Demos
    , cmp.WidgetDemoComponent
    , cmp.ListWidgetsComponent
    , cmp.TreeviewComponent
    // Custom Widgets just for Demo
    , cmp.SideMenuComponent
    , cmp.BreadcrumbComponent
    , cmp.TabsComponent
  ],
  bootstrap: [cmp.RootComponent],
  providers: [
      SiteApiService        // just for demo to get some static data
    , EmitterService        // simple publish/subscribe patterm to distribute data
    , { provide: LocationStrategy, useClass: HashLocationStrategy }
    , FormValidatorService, FormValidatorFromJsonService  // the forms support, manages the decorators
  ]
})
export class AppModule {
}
