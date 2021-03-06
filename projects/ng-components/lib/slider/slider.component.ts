import {
    Input,
    EventEmitter,
    Output,
    OnInit,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
    Component,
    forwardRef,
    Provider,
    ChangeDetectorRef,
    AfterContentChecked,
    HostBinding,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export type SliderTheme = "primary" | "inverted" | "success" | "danger" | "warning" | "purple";
export type SliderAppearance = "normal" | "alternative";
export interface RangeSliderLabel {
    position: number;
    text: string;
}

type AppearanceStyleMap = {
    [key in SliderAppearance]: {
        width: string;
        offset: string;
    };
};

const CUSTOM_SLIDER_CONTROL_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SliderComponent),
    multi: true,
};

/** A slider to experiment and adjust values with. */
@Component({
    selector: "sebng-slider",
    templateUrl: "./slider.component.html",
    styleUrls: ["./slider.component.scss"],
    encapsulation: ViewEncapsulation.None,
    providers: [CUSTOM_SLIDER_CONTROL_VALUE_ACCESSOR],
})
export class SliderComponent implements OnInit, OnChanges, AfterContentChecked, ControlValueAccessor {
    /** Use an alternative version of the slider */
    @Input() alternative?: boolean;
    /** Always Show tooltip (default: false) */
    @Input() alwaysShowTooltip?: boolean;
    /** Element class name */
    @Input() className?: string;
    /** Property sets whether slider is disabled */
    @Input() disabled?: boolean;
    /** Error message of slider */
    @Input() error?: string;
    /** Element ID */
    @Input() id?: string;
    /** Element label */
    @Input() label?: string;
    /** Labels to be displayed below the slider */
    @Input() labels?: Array<RangeSliderLabel>;
    /** Maximum value of the range */
    @Input() max?: number;
    /** Minimum value of the range */
    @Input() min?: number;
    /** Slider name */
    @Input() name: string;
    /** Callback on slider value change */
    @Output() onChange: EventEmitter<number> = new EventEmitter<number>();
    /** Show ticks with labels (default: false) */
    @Input() showTicks?: boolean;
    /** Value changes on every increment/decrement */
    @Input() step?: number;
    /** Slider theme based on SEB predefined colors. (default: 'primary') */
    @Input() theme?: SliderTheme;
    /** Tooltip theme based on SEB predefined colors. (default: 'inverted') */
    @Input() tooltipTheme?: SliderTheme;
    /** Custom tooltip value */
    @Input() tooltipValue?: string;

    @HostBinding("style") styles = "width: 100%;";

    private _min: number = 0;
    private _max: number = 0;
    private _size: number = 0;
    private _labelsPositions: Array<string> = [];

    private _appearance: SliderAppearance;
    private _activeTrackStyles: CSSStyleDeclaration = {} as CSSStyleDeclaration;

    public thumbPosition: number = 0;

    private _value: number;

    private onTouchedCallback: () => void;
    private onChangeCallback: (_: any) => void;

    private appearanceSizesMap: AppearanceStyleMap = {
        alternative: { width: "27px", offset: "56px" },
        normal: { width: "5px", offset: "24px" },
    };

    constructor(private ref: ChangeDetectorRef) {
        this.appearance = !!this.alternative ? "alternative" : "normal";
    }

    get innerMin(): number {
        return this._min;
    }

    set innerMin(value: number) {
        this._min = value;
        this.setLabelsPositions();
        this.setStyleTracks();
    }

    get innerMax(): number {
        return this._max;
    }

    set innerMax(value: number) {
        this._max = value;
        this.setLabelsPositions();
        this.setStyleTracks();
    }

    get size(): number {
        return this._size;
    }

    set size(value: number) {
        this._size = value;
        this.setStyleTracks();
    }

    @Input()
    get appearance(): SliderAppearance {
        return this._appearance;
    }

    set appearance(value: SliderAppearance) {
        this._appearance = value;
        this.setStyleTracks();
    }

    get labelsPositions(): Array<string> {
        return this._labelsPositions;
    }

    set labelsPositions(value: Array<string>) {
        this._labelsPositions = value;
        this.setStyleTracks();
    }

    get activeTrackStyles(): CSSStyleDeclaration {
        return this._activeTrackStyles;
    }

    set activeTrackStyles(value: CSSStyleDeclaration) {
        this._activeTrackStyles = value;
    }

    setSliderRange(): void {
        // Checking if the min or max are not numbers, null value or undefined
        const minValue: number = typeof this.min !== "number" ? 0 : this.min;
        const maxValue: number = typeof this.max !== "number" ? 100 : this.max;
        this.innerMin = minValue;
        this.innerMax = maxValue;

        this.size = this.getSize(minValue, maxValue);
    }

    setLabelsPositions(): void {
        if (this.labels && this.labels.length) {
            const positions: Array<string> = [];
            this.labels.map((label: RangeSliderLabel) => {
                positions.push(this.getLabelPosition(label.position) + "%");
            });
            this.labelsPositions = positions;
        }
    }

    setStyleTracks(): void {
        this.thumbPosition = this.getPercentage();
        this.activeTrackStyles = this.getActiveTrackStyles();
    }

    /**
     * Finds the size between two numbers
     * @param {number} minValue The minimum value
     * @param {number} maxValue The maximum value
     * @returns {number} The size
     */
    getSize(minValue: number, maxValue: number): number {
        if (maxValue > minValue) {
            return maxValue - minValue;
        } else {
            // Will calculate the size anyway, but it will show a warning since the min is larger than the max
            console.warn(`The max value of the slider should be larger than the min value (Max:${this.innerMax}, Min: ${this.innerMin}`);
            return minValue - maxValue;
        }
    }
    /**
     * Converts the current value to percentage based on min and max
     * @returns {number} The precentage
     */
    getPercentage(): number {
        if (this.value <= this.innerMin) {
            return 0;
        } else if (this.value >= this.innerMax) {
            return 100;
        } else {
            const distanceFromMin: number = Math.abs(this.value - this.innerMin);
            return this.size ? (distanceFromMin / this.size) * 100 : 0;
        }
    }

    /**
     * Calculates the styles needed for the active track
     * @returns {CSSStyleDeclaration} The active track styles object
     */
    getActiveTrackStyles(): CSSStyleDeclaration {
        const calculatedThumbPosition: number = this.getPercentage();
        let zeroPosition: number;
        const { width, offset }: AppearanceStyleMap[keyof AppearanceStyleMap] = this.appearanceSizesMap[this.appearance];
        const style: CSSStyleDeclaration = {} as CSSStyleDeclaration;
        if (this.innerMin >= 0) {
            zeroPosition = 0;
            style.left = `${zeroPosition}%`;
            style.width = `calc(${calculatedThumbPosition}% + ${width})`;
        } else if (this.innerMax <= 0) {
            zeroPosition = 100;
            style.left = `calc(${zeroPosition}% + ${offset})`;
            style.width = `calc(${100 - calculatedThumbPosition}% + ${width})`;
            style.transform = "rotateY(180deg)";
        } else {
            if (this.value <= 0) {
                zeroPosition = this.size ? Math.abs((this.innerMin / this.size) * 100) : 0;
                style.left = `calc(${zeroPosition}% + ${width})`;
                style.width = zeroPosition - calculatedThumbPosition + "%";
                style.transform = "rotateY(180deg)";
            } else {
                zeroPosition = this.size ? Math.abs(100 - (this.innerMax / this.size) * 100) : 0;
                style.left = `calc(${zeroPosition}% + ${width})`;
                style.width = calculatedThumbPosition - zeroPosition + "%";
            }
        }
        return style;
    }

    /**
     * Calculating the position of the label based on it's value
     * @param {number} value The Slider value
     * @returns {number} The position of the label in percentage
     */
    getLabelPosition(value: number): number {
        if (value >= this.innerMax) {
            return 100;
        } else if (value <= this.innerMin) {
            return 0;
        }
        return Math.abs(((value - this.innerMin) / (this.innerMax - this.innerMin)) * 100);
    }

    /**
     * Determines whether to enable or disable CSS transitions based on the total amount of steps
     * This is fix for a performance impact caused by rapidly updating the state when sliding
     * @var maxNumberOfStepsToAllowTransition represents the maximum number of steps to have the
     * transitions enabled. Transitions would be disabled when exceeding that number;
     * @returns {boolean} `True` if it should transition
     */
    shouldEnableTransition(): boolean {
        const maxNumberOfStepsToAllowTransition: number = 30;
        return this.size / this.step <= maxNumberOfStepsToAllowTransition;
    }

    @Input()
    get value(): number {
        return this._value;
    }

    set value(v: number) {
        if (v !== this._value) {
            this._value = v;
            this.onChangeCallback && this.onChangeCallback(v);
            this.onChange && this.onChange.emit(v);
            this.thumbPosition = this.getPercentage();
            this.activeTrackStyles = this.getActiveTrackStyles();
        }
    }

    // accessor props
    writeValue(val: number): void {
        if (val !== this._value) {
            this._value = val;
            this.thumbPosition = this.getPercentage();
            this.activeTrackStyles = this.getActiveTrackStyles();
        }
    }

    registerOnChange(fn: () => void): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouchedCallback = fn;
    }

    ngOnInit(): void {
        this.size = 0;
        this.labelsPositions = [];

        this.setSliderRange();
        this.setStyleTracks();
        this.setLabelsPositions();
    }

    ngAfterContentChecked(): void {
        this.ref.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.max || changes.min) {
            this.setSliderRange();
            this.thumbPosition = this.getPercentage();
            this.activeTrackStyles = this.getActiveTrackStyles();
            this.setLabelsPositions();
        }

        if (changes.value) {
            this.setStyleTracks();
        }

        if (changes.labels) {
            this.setLabelsPositions();
        }
    }
}
