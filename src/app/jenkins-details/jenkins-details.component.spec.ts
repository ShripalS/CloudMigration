import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JenkinsDetailsComponent } from './jenkins-details.component';

describe('JenkinsDetailsComponent', () => {
  let component: JenkinsDetailsComponent;
  let fixture: ComponentFixture<JenkinsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JenkinsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JenkinsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
