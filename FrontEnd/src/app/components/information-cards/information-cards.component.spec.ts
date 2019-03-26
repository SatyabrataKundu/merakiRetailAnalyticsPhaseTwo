import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationCardsComponent } from './information-cards.component';

describe('InformationCardsComponent', () => {
  let component: InformationCardsComponent;
  let fixture: ComponentFixture<InformationCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
