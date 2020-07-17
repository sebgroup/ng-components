import { NgModule } from "@angular/core";
import { RatingModule } from "@sebgroup/ng-components/rating";
import { RatingPageComponent } from "./rating-page.component";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { DocPageModule } from "../../doc-page/doc-page.module";
import { FormsModule } from "@angular/forms";
import { StepperModule } from "@sebgroup/ng-components/stepper";
import { CheckBoxModule } from "@sebgroup/ng-components/checkBox";

const routes: Routes = [{ path: "", component: RatingPageComponent }];

@NgModule({
    declarations: [RatingPageComponent],
    imports: [CommonModule, RouterModule.forChild(routes), FormsModule, DocPageModule, RatingModule, StepperModule, CheckBoxModule],
    exports: [RouterModule, RatingModule],
})
export class RatingPageModule {}