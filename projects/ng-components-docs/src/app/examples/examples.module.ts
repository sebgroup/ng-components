import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonsModule } from "./components/buttons/buttons.module";
import { ModalModule } from "./components/modal/modal.module";
import { DropdownModule } from "./components/dropdown/dropdown.module";
import { WizardModule } from "./components/wizard/wizard.module";

@NgModule({
    declarations: [],
    imports: [CommonModule, ButtonsModule, ModalModule, DropdownModule, WizardModule],
})
export class ExamplesModule {}
