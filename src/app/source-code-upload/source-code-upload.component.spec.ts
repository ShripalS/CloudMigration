import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceCodeUploadComponent } from './source-code-upload.component';

describe('SourceCodeUploadComponent', () => {
  let component: SourceCodeUploadComponent;
  let fixture: ComponentFixture<SourceCodeUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceCodeUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceCodeUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
