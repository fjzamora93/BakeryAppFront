import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPoliticComponent } from './privacy-politic.component';

describe('PrivacyPoliticComponent', () => {
  let component: PrivacyPoliticComponent;
  let fixture: ComponentFixture<PrivacyPoliticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPoliticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyPoliticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
