import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmodelsComponent } from './submodels.component';

describe('SubmodelsComponent', () => {
  let component: SubmodelsComponent;
  let fixture: ComponentFixture<SubmodelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmodelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmodelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
