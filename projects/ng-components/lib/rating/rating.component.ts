import { Component, Input, forwardRef, ViewEncapsulation, ViewChildren, QueryList, ElementRef, OnInit } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { randomId } from "@sebgroup/frontend-tools/dist/randomId";

export const CUSTOM_RATING_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RatingComponent),
    multi: true,
};

/** Rating is a component to indicate user interest in content */
@Component({
    selector: "sebng-rating",
    templateUrl: "./rating.component.html",
    styleUrls: ["./rating.component.scss"],
    providers: [CUSTOM_RATING_VALUE_ACCESSOR],
    encapsulation: ViewEncapsulation.None,
})
export class RatingComponent implements ControlValueAccessor, OnInit {
    /** Visual width of rating icon */
    @Input() iconWidth?: number = 25;
    /** Visual height of rating icon */
    @Input() iconHeight?: number = 25;
    /** Maximum value that can be given  */
    @Input() max?: number = 5;
    /** Property sets whether rating is readonly */
    @Input() readOnly?: boolean = false;
    /** List of tooltip corresponding to each icon */
    @Input() tooltipList?: Array<string>;
    /** Element class name */
    @Input() className?: string;
    /** Property sets whether rating's icon is hollow */
    @Input() useHollow?: boolean;
    /** Property sets whether rating will show value */
    @Input() showValue?: boolean;
    /** Property sets whether rating will show text value */
    @Input() showTextValue?: boolean;

    randomIds: Array<string> = [];

    /**
     * Colors of icons
     * @member 0 Grey (unselected)
     * @member 1 Yellow (Selected)
     */
    @Input() colors?: Array<string> = ["#A9A9A9", "#ffc500"];

    // Placeholders for the callbacks which are later provided
    // by the Control Value Accessor
    private _value: any = "";

    activeList: Array<string> = [];
    initialized: boolean = false;
    displayValue?: string;

    tabCounter: number = 0;

    @ViewChildren("radioItemRefs") radios: QueryList<ElementRef>;

    ngOnInit() {
        if (this.max) {
            this.randomIds = Array.apply(null, Array(this.max)).map((item: any) => {
                return randomId("star-");
            });
        }
    }

    /**
     * Provides an array for ngFor to loop through
     * @returns {Array<number>} An array of ones just to loop through it
     */
    getList(): Array<number> {
        return Array(this.max).fill(1);
    }

    setTabIndex(i: number): string {
        return i === 0 ? "0" : Math.floor(this.value) === i + 1 ? "0" : "-1";
    }

    /**
     * Sets the rating value and updates the active list of stars
     */
    setRateValue(): void {
        if (this.value) {
            for (let i: number = 0; i < this.max; i++) {
                this.activeList[i] = i < this.value ? "100%" : "0%";
            }
            if (this.value % 1 !== 0) {
                this.activeList[Math.ceil(this.value) - 1] = (this.value % 1) * 100 + "%";
            }
        }
    }

    /**
     * Retrieves the active list of stars to be used in the HTML template
     * @returns {Array<string>} The array of active stars
     */
    getActiveList(): Array<string> {
        if (!this.initialized) {
            if (this.value) {
                this.setRateValue();
                this.initialized = true;
            }
        }
        this.getTextValue();
        return this.activeList;
    }

    /** Retrieves the text value if the option is set to true */
    getTextValue(): void {
        if (this.value && this.showTextValue && this.tooltipList.length) {
            this.displayValue = this.tooltipList[Math.ceil(this.value - 1)];
        } else {
            this.displayValue = "error!";
        }
    }

    /**
     * Sets the value to the clicked star
     * @param {number} key The key number of the star being clicked
     */
    onClick(key: number): void {
        if (!this.readOnly) {
            this.value = key;
        }
    }

    /**
     * Gives a UI feedback by highlighting the stars being hovered over
     * @param key The key number of the star being hovered over
     */
    onMouseEnter(key: number): void {
        if (!this.readOnly) {
            for (let i: number = 0; i < this.max; i++) {
                this.activeList[i] = i <= key ? "100%" : "0%";
            }
        }
    }

    /**
     * navigate through the ratings of arrowLeft and right clicks
     * @param e KeyBoardEvent
     * @param index , the index of the selectedIndex
     */

    onKeydown(e: KeyboardEvent): void {
        e.preventDefault();
        e.stopPropagation();

        let selectedElement: ElementRef = null;

        if (e.key.toLowerCase() === "arrowright" || e.key.toLowerCase() === "arrowup") {
            if (this.tabCounter + 1 <= this.getList().length) {
                this.onMouseEnter(this.tabCounter);
                selectedElement = this.radios.toArray()[this.tabCounter];
                this.tabCounter = this.tabCounter + 1;
                this.onClick(this.tabCounter);
            }
        } else if (e.key.toLowerCase() === "arrowleft" || e.key.toLowerCase() === "arrowdown") {
            if (this.tabCounter - 1 > -2) {
                if (this.tabCounter > 0) {
                    this.tabCounter = this.tabCounter - 1;
                } else {
                    this.tabCounter = 0;
                }

                selectedElement = this.radios.toArray()[this.tabCounter - 1];
                this.onMouseEnter(this.tabCounter - 1);
                this.onClick(this.tabCounter);
            }
        }

        if (selectedElement) {
            selectedElement.nativeElement.setAttribute("aria-checked", "true");
            selectedElement.nativeElement.focus();
        }
    }

    /**
     * Resets the active list of stars after hover is completed
     * @param key The key number of the star where the hover have left
     */
    onMouseLeave(key: number): void {
        if (!this.readOnly) {
            this.setRateValue();
        }
    }

    /**
     *
     * On keyup, set the focus on the first rating
     * @param e keboard event , check if the click key is enter key
     * @param index the selected rating value
     */
    onKeyup(e: KeyboardEvent, index: number): void {
        e.preventDefault();
        e.stopPropagation();
        if (e.key.toLowerCase() === "tab") {
            const selectedElement: ElementRef = this.radios.toArray()[index];
            this.tabCounter = index;
            if (selectedElement) {
                selectedElement.nativeElement.setAttribute("aria-checked", "false");
                selectedElement.nativeElement.focus();
            }
        }
    }

    onTouchedCallback: () => void = () => {};
    onChangeCallback: (_: any) => void = () => {};

    // get and set accessor----------------------
    @Input()
    get value(): any {
        return this._value;
    }
    set value(v: any) {
        if (v !== this._value) {
            this._value = v;
            this.onChangeCallback(v);
        }
    }

    // From ControlValueAccessor interfaces--------------
    writeValue(value: any): void {
        if (value !== this._value) {
            this._value = value;
            this.setRateValue();
        }
    }
    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }
}
