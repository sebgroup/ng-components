import { Component, Input, Provider, forwardRef, Pipe, PipeTransform, OnInit } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { randomId } from "@sebgroup/frontend-tools/randomId";

export type InputType = "checkbox" | "radio";
export type IconPosition = "left" | "right";

type ToggleSelectorType = IToggleSelector | Array<IToggleSelector>;

export interface IToggleSelector {
    value: string;
    label?: string;
    icon?: string;
    iconPosition?: IconPosition;
    customLabel?: HTMLElement;
    description?: string;
    disabled?: boolean;
}

interface IDisplayToggleSelector extends IToggleSelector {
    optionItem: IToggleSelector;
    selected: boolean;
}

const TOGGLE_SELECTOR_CONTROL_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleSelectorComponent),
    multi: true,
};

/** The Toggle selector emphasizes to the user that this is an important choice. We also think it can make choosing more attractive. */
@Component({
    selector: "sebng-toggle-selector",
    templateUrl: "./toggle-selector.component.html",
    styleUrls: ["./toggle-selector.component.scss"],
    providers: [TOGGLE_SELECTOR_CONTROL_VALUE_ACCESSOR],
})
export class ToggleSelectorComponent implements ControlValueAccessor, OnInit {
    /** List of option items for the component */
    @Input() list: Array<IToggleSelector>;
    /** Option item control name */
    @Input() name?: string = randomId("name");
    /** Flag whether the component is allowed to select multiple options */
    @Input() multi?: boolean = false;
    /** Flag whether the component is disabled */
    @Input() disabled?: boolean = false;
    /** Flag whether the component is in an invalid state */
    @Input() error?: boolean = false;
    /** Error message */
    @Input() errorMessage?: string;

    value: ToggleSelectorType = [];

    /**
     * Used to append a class to style the container of each input group
     * when the element is focused or remove it when it get's blured
     */
    focusedItem: number;

    /**  Array that will be used to render */
    displayList: Array<IDisplayToggleSelector> = [];

    ngOnInit(): void {
        this.generateCheckedItems();
    }

    /** get the type attribute that needs to be rendered */
    get inputType(): InputType {
        return this.multi ? "checkbox" : "radio";
    }

    /**
     * Click event on the input container
     * @param event Click event
     * @param idx Index of the item clicked
     */
    handleItemOnClick(event: Event, idx: number): void {
        event.preventDefault();

        //return false if disabled
        if (this.list[idx].disabled) {
            return;
        }

        const item: IToggleSelector = this.list[idx];

        if (!this.multi) {
            if (item && (this.value as IToggleSelector)?.value !== item.value) {
                this.value = item;
            }
        } else {
            if (Array.isArray(this.value) && (this.value as Array<IToggleSelector>)?.includes(item)) {
                (this.value as Array<IToggleSelector>).splice((this.value as Array<IToggleSelector>).indexOf(item), 1);
            } else {
                if (this.value) {
                    if (Array.isArray(this.value)) {
                        (this.value as Array<IToggleSelector>).push(item);
                    } else {
                        this.value = [this.value as IToggleSelector, item];
                    }
                } else {
                    this.value = [item];
                }
            }
        }

        // call callbacks
        this.onChangeCallback && this.onChangeCallback(this.value);
        this.onTouchedCallback && this.onTouchedCallback();

        // generate checked items to display
        this.generateCheckedItems();
    }

    /** focus input element */
    focus(idx: number) {
        this.focusedItem = idx;
    }

    /** blur input element */
    blur() {
        this.focusedItem = null;
    }

    /** defines how to track changes for items in the iterable. */
    trackByFn = (index): number => index;

    /** generate list of toggle selector with selected option */
    generateCheckedItems(): void {
        this.displayList =
            this.list &&
            this.list.map(e => {
                if (this.multi) {
                    let selected: boolean = false;

                    if (Array.isArray(this.value) && this.value.length > 0) {
                        selected = !!this.value.find((element: IToggleSelector) => element.value === e.value);
                    }

                    return { optionItem: e, selected } as IDisplayToggleSelector;
                } else {
                    let selected: boolean = (this.value as IToggleSelector)?.value === e.value;
                    return { optionItem: e, selected } as IDisplayToggleSelector;
                }
            });
    }

    /**
     * Placeholders for the callbacks which are later provided
     * by the Control Value Accessor
     */
    private onTouchedCallback: () => void;
    private onChangeCallback: (_: any) => void;

    writeValue(value: ToggleSelectorType): void {
        this.value = value;
        this.generateCheckedItems();
    }
    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }
}

@Pipe({ name: "safeHtml" })
export class ToggleSelectorSafeHtmlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
    transform(value: string) {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
}
