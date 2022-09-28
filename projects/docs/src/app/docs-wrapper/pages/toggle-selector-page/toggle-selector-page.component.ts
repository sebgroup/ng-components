import { Component } from "@angular/core";
import { FormService } from "@common/dynamic-form/form.service";
import { ExtendedFormGroup } from "@common/dynamic-form/model/custom-classes/extended-form-group";
import { IToggleSelector } from "@sebgroup/ng-components/toggle-selector";

@Component({
    selector: "app-toggle-page",
    templateUrl: "./toggle-selector-page.component.html",
    styles: [
        `
            ::ng-deep .custom-option {
                background-color: lightblue;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                align-self: stretch;
            }

            .toggle-selector-container {
                max-width: 26.25rem;
            }
        `,
    ],
    providers: [FormService],
})
export class ToggleSelectorPageComponent {
    importString: string = require("!raw-loader!@sebgroup/ng-components/toggle-selector/toggle-selector.component");
    code: string = `<sebng-toggle-loader ></sebng-toggle-loader>`;
    icon: string = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170">
        <path d="M137.5,102.1V40.4a3,3,0,0,0-3-3H8a3,3,0,0,0-3,3v61.7a3,3,0,0,0,3,3H134.5A3,3,0,0,0,137.5,102.1ZM112,91.3v7.7H30.5V91.3a3,3,0,0,0-3-3,6.1,6.1,0,0,1-6.1-6.1,3,3,0,0,0-3-3H11V63h7.5a3,3,0,0,0,3-3,6.1,6.1,0,0,1,6.1-6.1,3,3,0,0,0,3-3V43.4H112v7.5a3,3,0,0,0,3,3A6.1,6.1,0,0,1,121,60a3,3,0,0,0,3,3h7.5V79.3H124a3,3,0,0,0-3,3,6.1,6.1,0,0,1-6.1,6.1A3,3,0,0,0,112,91.3ZM131.5,57h-4.9a12.1,12.1,0,0,0-8.7-8.7V43.4h13.6ZM24.5,43.4v4.9A12.1,12.1,0,0,0,15.9,57H11V43.4ZM11,85.3h4.9A12.1,12.1,0,0,0,24.5,94v5.1H11ZM118,99.1V94a12.1,12.1,0,0,0,8.7-8.7h4.9V99.1Z"></path><path d="M151.3,115.8V54.2h-6v58.7H21.7v6H148.3A3,3,0,0,0,151.3,115.8Z"></path>
        <path d="M159,67.9v58.7H35.5v6H162a3,3,0,0,0,3-3V67.9Z"></path>
        <path d="M71.3,88.8A17.5,17.5,0,1,1,88.8,71.3,17.5,17.5,0,0,1,71.3,88.8Zm0-29A11.5,11.5,0,1,0,82.8,71.3,11.5,11.5,0,0,0,71.3,59.8Z"></path>
    </svg>
    `;

    list: Array<IToggleSelector> = [
        {
            value: "1",
            label: "One Missisipi",
            description: "Option item with description.",
        },
        {
            value: "2",
            label: "Two mississipi",
            icon: this.icon,
            description: "Option item with longer description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        { value: "3", label: "Three mississipi", icon: this.icon, iconPosition: "right" },
        { value: "4", label: "", icon: this.icon },
        { value: "5", label: "Five mississipi", disabled: true },
        { value: "6", customLabel: "<div class='custom-option w-100'>Six mississipi</div>" as unknown as HTMLElement },
    ];

    errorMessage: string = "I am an error message.";
    extendedFormGroup: ExtendedFormGroup;
    model: IToggleSelector;

    constructor(private formService: FormService) {
        document.title = "Toggle Selector - SEB Angular Components";
        this.extendedFormGroup = this.formService.dynamicFormSectionsToFormGroup([
            {
                key: "toggles",
                items: [
                    {
                        key: "multi",
                        controlType: "Checkbox",
                        label: "Multi-select",
                        description: "Enable selection of multiple options.",
                        value: true,
                    },
                    {
                        key: "error",
                        controlType: "Checkbox",
                        label: "Error State",
                        description: "View the component in an invalid state.",
                        value: false,
                    },
                    {
                        key: "disabled",
                        controlType: "Checkbox",
                        label: "Disabled State",
                        description: "View the component in a disabled state.",
                        value: false,
                    },
                ],
            },
        ]);
    }
}
