import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'uniqueFont' })
export class UniqueFontPipe implements PipeTransform {
    transform(data: any, args?: any): any {
        if (data) {
            const res = [];
            const result = data.map(c => c[args]).filter((code, currentIndex, allCodes) => allCodes.indexOf(code) === currentIndex);

            for (const fontFamily of result) {
                const uniqueFontsArray = data.filter(el => el.fontFamily === fontFamily);
                if (uniqueFontsArray.length > 1) {
                    const regularFont = uniqueFontsArray.filter(el => el.fontSubfamily === 'Regular');
                    if (regularFont) {
                        regularFont[0].fontFamilyMerged = regularFont[0].fontFamily + ' ' + regularFont[0].fontSubfamily;
                        res.push(regularFont[0]);
                    } else {
                        uniqueFontsArray[0].fontFamilyMerged = uniqueFontsArray[0].fontFamily + ' ' + uniqueFontsArray[0].fontSubfamily;
                        res.push(uniqueFontsArray[0]);
                    }
                } else {
                    uniqueFontsArray[0].fontFamilyMerged = uniqueFontsArray[0].fontFamily + ' ' + uniqueFontsArray[0].fontSubfamily;
                    res.push(uniqueFontsArray[0]);
                }
            }

            return res;
        }
    }
}
