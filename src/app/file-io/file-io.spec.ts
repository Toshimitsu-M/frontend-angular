import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileIo } from './file-io';

describe('FileIo', () => {
  let component: FileIo;
  let fixture: ComponentFixture<FileIo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileIo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileIo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
