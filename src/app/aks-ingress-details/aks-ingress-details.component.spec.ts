import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AksIngressDetailsComponent } from './aks-ingress-details.component';

describe('AksIngressDetailsComponent', () => {
  let component: AksIngressDetailsComponent;
  let fixture: ComponentFixture<AksIngressDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AksIngressDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AksIngressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
