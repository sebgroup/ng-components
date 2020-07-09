import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { DocsWrapperModule } from "./docs-wrapper/docs-wrapper.module";
import { AppComponent } from "./app.component";
import { GettingStartedComponent } from "./getting-started/getting-started.component";
import { HomeModule } from "./home/home.module";
import { AppCommonModule } from "./common/app-common.module";

@NgModule({
  declarations: [
    AppComponent,
    GettingStartedComponent,
  ],
  imports: [
    HomeModule,
    DocsWrapperModule,
    AppRoutingModule,
    AppCommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
