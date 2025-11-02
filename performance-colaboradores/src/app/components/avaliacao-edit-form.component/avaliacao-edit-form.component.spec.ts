import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoEditFormComponent } from './avaliacao-edit-form.component';

describe('AvaliacaoEditFormComponent', () => {
  let component: AvaliacaoEditFormComponent;
  let fixture: ComponentFixture<AvaliacaoEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvaliacaoEditFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvaliacaoEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
