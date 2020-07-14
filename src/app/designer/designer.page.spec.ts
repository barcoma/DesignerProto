import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DesignerPage } from './designer.page';

describe('DesignerPage', () => {
  let component: DesignerPage;
  let fixture: ComponentFixture<DesignerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DesignerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
