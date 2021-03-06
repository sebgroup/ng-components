import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Pipe, PipeTransform, NgModule } from "@angular/core";

@Pipe({ name: "safeHtml" })
export class AccordionSafeHtmlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
    transform(value: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
}
