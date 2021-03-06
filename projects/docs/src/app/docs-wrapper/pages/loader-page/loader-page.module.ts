import { NgModule } from "@angular/core";
import { LoaderModule } from "@sebgroup/ng-components/loader";
import { LoaderPageComponent } from "./loader-page.component";
import { CommonModule } from "@angular/common";
import { DocPageModule } from "../../doc-page/doc-page.module";
import { FormsModule } from "@angular/forms";
import { CheckboxModule } from "@sebgroup/ng-components/checkbox";
import { DropdownModule } from "@sebgroup/ng-components/dropdown";
import { RadioGroupModule } from "projects/ng-components/public-api";
import { LoaderPageRoutingModule } from "./loader-page-routing.module";

@NgModule({
    declarations: [LoaderPageComponent],
    imports: [
        CommonModule,
        LoaderPageRoutingModule,
        FormsModule,
        DocPageModule,
        LoaderModule,
        CheckboxModule,
        DropdownModule,
        RadioGroupModule,
    ],
})
export class LoaderPageModule {}
