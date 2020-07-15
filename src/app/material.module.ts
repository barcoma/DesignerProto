import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {DomSanitizer} from '@angular/platform-browser';

import {
    /*
    MatTableModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    */
    MatExpansionModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatSnackBarModule,
    MatSliderModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatGridListModule,
    MatBadgeModule,
    MatCardModule,
    MatIconRegistry,
    MatRadioModule,
    MatDialogModule,
    MatDialog,
    MatDialogRef,
    MatCheckboxModule
} from '@angular/material';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    exports: [
        /*
        MatTableModule,
        MatStepperModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatOptionModule,
        MatSelectModule,
        MatPaginatorModule,
        MatSortModule,
        */
        DragDropModule,
        MatExpansionModule,
        MatMenuModule,
        MatIconModule,
        MatDividerModule,
        MatListModule,
        MatSnackBarModule,
        MatSliderModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatGridListModule,
        MatBadgeModule,
        MatCardModule,
        MatRadioModule,
        MatDialogModule,
        MatCheckboxModule
    ]
})
export class MaterialModule {
    constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
        // tslint:disable-next-line: max-line-length
        matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/mdi.svg'));
        matIconRegistry.addSvgIcon('ungroup', domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/ungroup.svg'));
        matIconRegistry.addSvgIcon('group', domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/group.svg'));
        matIconRegistry.addSvgIcon('align-vertical-center',
            domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/align-vertical-center.svg'));
        matIconRegistry.addSvgIcon('align-horizontal-center',
            domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/align-horizontal-center.svg'));
        matIconRegistry.addSvgIcon('arrow-left', domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/menu-left.svg'));
        matIconRegistry.addSvgIcon('arrow-right', domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/menu-right.svg'));
        matIconRegistry.addSvgIcon('counter', domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/counter.svg'));
        matIconRegistry.addSvgIcon('copy', domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/content-copy.svg'));
        matIconRegistry.addSvgIcon('link-variant', domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/link-variant.svg'));
        matIconRegistry.addSvgIcon('link-variant-off', domSanitizer.bypassSecurityTrustResourceUrl('../assets/icon/link-variant-off.svg'));
    }
}
