import { NgModule } from "@angular/core";
import { TabsModule } from "@sebgroup/ng-components/tabs";
import { DocPageComponent } from "./doc-page.component";
import { CommonModule } from "@angular/common";
import { APIExtractService } from "../../common/services/api-extract.service";
import { APIsComponent } from "./apis/apis.component";
import { FormsModule } from "@angular/forms";
import { PlaygroundComponent } from "./playground/playground.component";
import { CodeSnippetModule } from "../../common/code-snippet/code-snippet.module";
import { DynamicFormModule } from "../../common/dynamic-form/dynamic-form.module";
import { SafeHtmlPipe } from "@common/pipes/safe-html.pipe";

@NgModule({
    declarations: [DocPageComponent, PlaygroundComponent, APIsComponent, SafeHtmlPipe],
    imports: [CommonModule, FormsModule, TabsModule, CodeSnippetModule, DynamicFormModule],
    exports: [DocPageComponent, DynamicFormModule],
    providers: [APIExtractService],
})
export class DocPageModule {}
