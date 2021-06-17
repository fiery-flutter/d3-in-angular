import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrapherComponent } from './grapher.component';

describe('GrapherComponent', () => {
  let component: GrapherComponent;
  let fixture: ComponentFixture<GrapherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrapherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrapherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
