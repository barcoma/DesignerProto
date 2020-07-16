import { Pipe, Injectable, PipeTransform } from '@angular/core';

@Pipe({
    name: 'parseFont'
})
@Injectable()
export class ParseFontPipe implements PipeTransform {
    transform(value): any {
        const keys = [];
        for (const key in value) {
            if (key) {
                keys.push({ key, value: JSON.parse(value[key].key) });
            }
        }
        return keys;
    }
}
