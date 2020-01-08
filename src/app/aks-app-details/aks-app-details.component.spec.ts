import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AksAppDetailsComponent } from './aks-app-details.component';

describe('AksAppDetailsComponent', () => {
  let component: AksAppDetailsComponent;
  let fixture: ComponentFixture<AksAppDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AksAppDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AksAppDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
