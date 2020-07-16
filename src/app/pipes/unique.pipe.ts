import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'unique' })
export class UniquePipe implements PipeTransform {
    transform(data: any, args?: any): any {
        if (data) {
            const result = data.map(c => c[args]).filter((code, currentIndex, allCodes) => allCodes.indexOf(code) === currentIndex);
            return result;
        }
    }
}
