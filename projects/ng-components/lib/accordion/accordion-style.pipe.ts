import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "dynamicStyle" })
export class DynamicStylePipe implements PipeTransform {
    transform(value: Array<number>, index: number): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve(value[index] + "px");
        });
    }
}
