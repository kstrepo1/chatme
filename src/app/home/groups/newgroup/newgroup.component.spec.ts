import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { NewgroupComponent } from './newgroup.component';

describe('NewgroupComponent', () => {
  let component: NewgroupComponent;
  let fixture: ComponentFixture<NewgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewgroupComponent],
      providers:[provideHttpClient(),provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
