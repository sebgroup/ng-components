import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ToggleSelectorComponent, IToggleSelector } from "./toggle-selector.component";
import { Component, DebugElement, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { By } from "@angular/platform-browser";

@Component({
    selector: "test-sebng-toggle-selector",
    template: `<sebng-toggle-selector
        #toggleSelector
        [multi]="multi"
        [list]="list"
        [(ngModel)]="model"
        [disabled]="disabled"
        [error]="error"
        [errorMessage]="errorMessage"
    ></sebng-toggle-selector>`,
})
class ToggleSelectorTestComponent {
    @ViewChild("toggleSelector") toggleSelector: ToggleSelectorComponent;
    list: Array<IToggleSelector>;
    multi: boolean = false;
    disabled?: boolean = false;
    model?: any;
    error: boolean;
    errorMessage: string;

    constructor() {
        this.list = [
            { value: "1", label: "Four mississipi", disabled: true },
            { value: "2", label: "Five mississipi" },
        ];
    }
}

describe("ToggleSelectorComponent", () => {
    let component: ToggleSelectorTestComponent;
    let fixture: ComponentFixture<ToggleSelectorTestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormsModule, CommonModule],
            declarations: [ToggleSelectorComponent, ToggleSelectorTestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ToggleSelectorTestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("Testing two-way data binding", async () => {
        component.model = component.list[1];

        const ngModelChange = spyOn(component.toggleSelector, "writeValue").and.callThrough();
        const generateDisplayArray = spyOn(component.toggleSelector, "generateCheckedItems");
        fixture.detectChanges();
        await fixture.whenStable().then(() => {
            expect(ngModelChange).toHaveBeenCalled();
            expect(generateDisplayArray).toHaveBeenCalled();
        });
    });

    it("Should disable the element when disabled prop is set to true", () => {
        component.disabled = true;
        fixture.detectChanges();
        const container: DebugElement = fixture.debugElement.query(By.css(".disabled"));
        const elements: DebugElement[] = fixture.debugElement.queryAll(By.css(".toggle-selector input:disabled"));
        expect(container).toBeDefined();
        expect(container).not.toBeNull();
        expect(elements).toBeDefined();
        expect(elements).toBeTruthy();
        expect(elements.length).toBe(component.list.length);
    });

    it("Should disable one element when disabled prop is set to true", () => {
        const inputEl: DebugElement[] = fixture.debugElement.queryAll(By.css("input"));
        expect(inputEl.some(el => el.nativeElement.disabled === true)).toBeTruthy();
        expect(inputEl.every(el => el.nativeElement.disabled === true)).toBeFalsy();
    });

    it("should have error class name and text when error is passed", () => {
        component.error = true;
        fixture.detectChanges();
        const container: DebugElement = fixture.debugElement.query(By.css(".error"));
        const span: DebugElement = fixture.debugElement.query(By.css(".text-danger"));
        expect(container).toBeDefined();
        expect(container).not.toBeNull();
        expect(span).toBeDefined();
        expect(span).not.toBeNull();
    });

    describe("Things that should happen when multi is true", () => {
        beforeEach(() => {
            component.multi = true;
            component.list = [
                { value: "1", label: "Four mississipi" },
                { value: "2", label: "Five mississipi" },
            ];
            fixture.detectChanges();
        });

        it("Should have type checkbox when multi is true", () => {
            const elements: DebugElement[] = fixture.debugElement.queryAll(By.css(".toggle-selector input[type=checkbox]"));
            expect(elements.length).toBe(component.list.length);
        });

        it("Should have two checked when both options are clicked", () => {
            const element: HTMLElement[] = fixture.nativeElement.querySelectorAll(".toggle-selector");
            element[1].dispatchEvent(new Event("click"));
            fixture.detectChanges();
            const inputEl: DebugElement[] = fixture.debugElement.queryAll(By.css("input"));
            expect(inputEl.every(el => el.nativeElement.checked === true)).toBeFalsy();

            element[0].dispatchEvent(new Event("click"));
            fixture.detectChanges();
            expect(inputEl.every(el => el.nativeElement.checked)).toBeTruthy();
        });

        it("should uncheck when previously checked option is clicked", () => {
            const element: HTMLElement[] = fixture.nativeElement.querySelectorAll(".toggle-selector");
            element[1].dispatchEvent(new Event("click"));
            fixture.detectChanges();
            const inputEl: DebugElement[] = fixture.debugElement.queryAll(By.css("input"));

            expect(inputEl.every(el => el.nativeElement.checked)).toBeFalsy();

            element[1].dispatchEvent(new Event("click"));
            fixture.detectChanges();
            expect(inputEl.some(el => el.nativeElement.checked)).toBeFalsy();
        });
    });

    describe("Things that should happen when multi is false", () => {
        beforeEach(() => {
            component.multi = false;
            component.list = [
                { value: "1", label: "Four mississipi" },
                { value: "2", label: "Five mississipi" },
            ];
            fixture.detectChanges();
        });

        it("Should have type radio when multi is false", () => {
            const elements: DebugElement[] = fixture.debugElement.queryAll(By.css(".toggle-selector input[type=radio]"));
            expect(elements.length).toBe(component.list.length);
        });

        it("should not have anything checked", () => {
            const inputEl: DebugElement[] = fixture.debugElement.queryAll(By.css("input"));
            expect(inputEl.every(el => el.nativeElement.checked)).toBeFalsy();
        });

        it("Should have only one checked when an option is clicked and move to another option if it's clicked", () => {
            const element: HTMLElement[] = fixture.nativeElement.querySelectorAll(".toggle-selector");
            element[1].dispatchEvent(new Event("click"));
            fixture.detectChanges();
            const inputEl: DebugElement[] = fixture.debugElement.queryAll(By.css("input"));
            expect(inputEl.every(el => el.nativeElement.checked)).toBeFalsy();
            expect(inputEl[1].nativeElement.checked).toBeTruthy();

            element[0].dispatchEvent(new Event("click"));
            fixture.detectChanges();
            expect(inputEl.every(el => el.nativeElement.checked)).toBeFalsy();
            expect(inputEl[0].nativeElement.checked).toBeTruthy();
        });
    });
});
