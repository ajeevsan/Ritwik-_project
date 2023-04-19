import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDateTimeComponent } from './search-date-time.component';

describe('SearchDateTimeComponent', () => {
  let component: SearchDateTimeComponent;
  let fixture: ComponentFixture<SearchDateTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchDateTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
