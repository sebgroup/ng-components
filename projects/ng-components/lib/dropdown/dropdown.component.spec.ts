import { ViewChild, Component, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DropdownComponent, DropdownItem, DropdownPlaceholders } from "./dropdown.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
    selector: "test-sebng-dropdown",
    template: `
        <sebng-dropdown
            name="myDropdown"
            [list]="list"
            [label]="label"
            [error]="error"
            [placeholder]="placeholder"
            [placeholders]="placeholders"
            [className]="className"
            [disabled]="disabled"
            [native]="native"
            [multi]="multi"
            [clearable]="clearable"
            [searchable]="searchable"
            [nativeOnChange]="nativeOnChange"
            [(ngModel)]="selectedItem"
        ></sebng-dropdown>
    `,
})
class DropdownTestComponent {
    @ViewChild(DropdownComponent) dropDownComponent: DropdownComponent;
    list: Array<DropdownItem>;
    label?: string;
    error?: string;
    placeholder?: string;
    placeholders?: DropdownPlaceholders;
    className?: string;
    disabled?: boolean = false;
    native?: boolean = false;
    multi?: boolean;
    clearable?: boolean = false;
    searchable?: boolean = false;
    ellipsisMode?: boolean = false;
    nativeOnChange?: (event: DropdownItem | Array<DropdownItem> | UIEvent) => void;

    selectedItem: DropdownItem | Array<DropdownItem>;

    constructor() {
        this.list = [
            { label: "Nigeria", value: "NG" },
            { label: "Malaysia", value: "MY" },
        ];
    }
}

describe("DropdownComponent", () => {
    let component: DropdownTestComponent;
    let fixture: ComponentFixture<DropdownTestComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [FormsModule, CommonModule],
                declarations: [DropdownComponent, DropdownTestComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(DropdownTestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it(
        "Should render label and error",
        waitForAsync(() => {
            component.label = "Country";
            component.error = "Some error";
            fixture.detectChanges();
            const label = fixture.debugElement.query(By.css(".dropdown-label"));
            const error = fixture.debugElement.query(By.css(".alert"));
            expect(label).not.toBeNull();
            expect(label.nativeElement.innerHTML).toEqual("Country");
            expect(error).not.toBeNull();
            expect(error.nativeElement.innerHTML).toEqual("Some error");
        })
    );

    it(
        "Should pass custom className prop to component",
        waitForAsync(() => {
            component.className = "custom-class";
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css(".custom-class"))).toBeTruthy();
        })
    );

    it(
        "Should allow searchable and clearable when enabled",
        waitForAsync(() => {
            component.clearable = true;
            component.searchable = true;
            component.selectedItem = component.list[0];
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css(".search-input"))).not.toBeNull();
        })
    );

    it("Testing two-way data binding", async () => {
        const ngModelChange = spyOn(component.dropDownComponent, "writeValue");
        component.selectedItem = component.list[1];
        fixture.detectChanges();
        await fixture.whenStable().then(() => expect(ngModelChange).toHaveBeenCalled());
    });

    it(
        "Should render native select element when selected",
        waitForAsync(() => {
            component.native = true;
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css("select.form-control"))).toBeDefined();
        })
    );

    it(
        "Should render placeholder when passed",
        waitForAsync(() => {
            component.placeholder = "Some placeholder";
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css(".title"))).toBeDefined();
            /** Testing placeholder in native */
            component.native = true;
            component.selectedItem = null;
            fixture.detectChanges();

            const options = fixture.debugElement.queryAll(By.css("option"));
            expect(options.length).toEqual(3);
            expect(options[0].nativeElement.innerHTML).toEqual("Some placeholder");
        })
    );

    it(
        'Should display label "Select ..." when no placeholder is defined and no item is selected',
        waitForAsync(() => {
            component.placeholder = null;
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css(".title")).nativeElement.innerHTML.trim()).toEqual("Select ...");
        })
    );

    it(
        "Should enable more button when ellipsisMode set to true",
        waitForAsync(() => {
            component.ellipsisMode = true;
            fixture.detectChanges();
            const moreIcon = fixture.debugElement.query(By.css(".dropdown-more-icon"));
            expect(moreIcon).toBeDefined();
        })
    );

    it(
        "Should disable the element when disabled prop is set to true",
        waitForAsync(() => {
            component.disabled = true;
            fixture.detectChanges();
            const ngSelect = fixture.debugElement.query(By.css(".disabled"));
            expect(ngSelect).toBeDefined();
            /** Testing disabled in native */
            component.native = true;
            fixture.detectChanges();
            const select = fixture.debugElement.query(By.css("select"));
            expect(select.nativeElement.disabled).toBeTruthy();
        })
    );

    it(
        "Should enable multi-select when enabled",
        waitForAsync(() => {
            component.multi = true;
            fixture.detectChanges();
            const ngSelect: DebugElement = fixture.debugElement.query(By.css(".custom-control"));
            expect(ngSelect).toBeTruthy();
            /** Testing multiple in native */
            component.native = true;
            fixture.detectChanges();
            const select = fixture.debugElement.query(By.css("select"));
            expect(select.nativeElement.multiple).toBeTruthy();
        })
    );

    it(
        "Should fire onChange callback when change is detected (native only)",
        waitForAsync(() => {
            component.native = true;
            component.nativeOnChange = () => "test";
            const nativeOnChangeSpy = spyOn(component, "nativeOnChange");
            fixture.detectChanges();
            fixture.debugElement.query(By.css("select.form-control")).nativeElement.dispatchEvent(new Event("change"));
            expect(nativeOnChangeSpy).toHaveBeenCalled();
        })
    );

    it(
        "Should open menu when clicked on trigger",
        waitForAsync(() => {
            fixture.debugElement.query(By.css(".custom-dropdown-toggle")).nativeElement.dispatchEvent(new Event("click"));
            fixture.detectChanges();
            const menu: DebugElement = fixture.debugElement.query(By.css(".show"));
            expect(menu).toBeTruthy();
        })
    );

    describe("Custom dropdown placeholders", () => {
        it("Should set custom empty state message", () => {
            const emptyText: string = "customEmptyText";
            component.placeholders = { emptyText };
            component.list = [];
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css(".title")).nativeElement.innerHTML).toContain(emptyText);
        });
        it(
            "Should set custom search text when searchable enabled",
            waitForAsync(() => {
                const searchText: string = "customSearchText";
                component.placeholders = { searchText };
                component.searchable = true;
                component.selectedItem = component.list[0];
                fixture.detectChanges();

                expect(fixture.debugElement.query(By.css(".search-input")).nativeElement.getAttribute("placeholder")).toBe(searchText);
            })
        );
        it(
            "Should set custom no result text when searchable enabled",
            waitForAsync(() => {
                const noResultText: string = "customNoResultText";
                component.placeholders = { noResultText };
                component.searchable = true;
                component.list = [];
                fixture.detectChanges();
                expect(fixture.debugElement.query(By.css(".dropdown-item.disabled > .label")).nativeElement.innerHTML).toBe(noResultText);
            })
        );
        it(
            "Should set custom select all text when multi enabled",
            waitForAsync(() => {
                const selectAllOptionText: string = "customSelectAllOptionText";
                const selectAllText: string = "customSelectAllText";
                component.placeholders = { selectAllOptionText, selectAllText };
                component.multi = true;
                fixture.detectChanges();
                expect(fixture.debugElement.query(By.css(".custom-control-label")).nativeElement.innerHTML).toContain(selectAllOptionText);
            })
        );
    });
});
