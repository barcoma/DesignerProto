import { FilterPipe } from './filter.pipe';
import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './safeHtml.pipe';
import { UniquePipe } from './unique.pipe';
import { ParseFontPipe } from './parseFont.pipe';
import { UniqueFontPipe } from './uniqueFont.pipe';
import { SortByPipe } from './orderBy.pipe';

@NgModule({
    declarations: [SafeHtmlPipe, FilterPipe, UniquePipe, ParseFontPipe, UniqueFontPipe, SortByPipe],
    imports: [],
    exports: [SafeHtmlPipe, FilterPipe, UniquePipe, ParseFontPipe, UniqueFontPipe, SortByPipe]
})
export class PipesModule {}
