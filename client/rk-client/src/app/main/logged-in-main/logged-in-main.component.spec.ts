import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedInMainComponent } from './logged-in-main.component';

describe('LoggedInMainComponent', () => {
  let component: LoggedInMainComponent;
  let fixture: ComponentFixture<LoggedInMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoggedInMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggedInMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
