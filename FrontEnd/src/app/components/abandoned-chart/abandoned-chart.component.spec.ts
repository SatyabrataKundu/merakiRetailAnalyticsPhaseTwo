import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonedChartComponent } from './abandoned-chart.component';

describe('AbandonedChartComponent', () => {
  let component: AbandonedChartComponent;
  let fixture: ComponentFixture<AbandonedChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbandonedChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbandonedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
