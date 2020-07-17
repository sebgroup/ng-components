import { NgModule } from "@angular/core";
import { PaginationModule } from "@sebgroup/ng-components/pagination";
import { PaginationPageComponent } from "./pagination-page.component";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { DocPageModule } from "../../doc-page/doc-page.module";
import { FormsModule } from "@angular/forms";
import { StepperModule } from "@sebgroup/ng-components/stepper";
import { CheckBoxModule } from "@sebgroup/ng-components/checkBox";

const routes: Routes = [{ path: "", component: PaginationPageComponent }];

@NgModule({
    declarations: [PaginationPageComponent],
    imports: [CommonModule, RouterModule.forChild(routes), FormsModule, DocPageModule, PaginationModule, StepperModule, CheckBoxModule],
    exports: [RouterModule, PaginationModule],
})
export class PaginationPageModule {}