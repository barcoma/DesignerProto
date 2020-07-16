import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BarcodesPage } from './barcodes.page';

describe('BarcodesPage', () => {
  let component: BarcodesPage;
  let fixture: ComponentFixture<BarcodesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BarcodesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
