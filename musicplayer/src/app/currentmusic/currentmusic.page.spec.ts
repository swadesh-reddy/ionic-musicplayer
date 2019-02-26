import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentmusicPage } from './currentmusic.page';

describe('CurrentmusicPage', () => {
  let component: CurrentmusicPage;
  let fixture: ComponentFixture<CurrentmusicPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentmusicPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentmusicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
