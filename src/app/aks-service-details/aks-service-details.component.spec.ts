import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AksServiceDetailsComponent } from './aks-service-details.component';

describe('AksServiceDetailsComponent', () => {
  let component: AksServiceDetailsComponent;
  let fixture: ComponentFixture<AksServiceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AksServiceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AksServiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
