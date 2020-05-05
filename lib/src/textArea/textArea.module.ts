import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TextAreaComponent } from "./textArea.component";
import { FormsModule } from "@angular/forms";

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [TextAreaComponent],
    exports: [TextAreaComponent],
})
export class TextAreanModule {}