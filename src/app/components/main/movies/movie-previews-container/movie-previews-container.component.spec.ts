import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviePreviewsContainerComponent } from './movie-previews-container.component';

describe('MoviePreviewsContainerComponent', () => {
  let component: MoviePreviewsContainerComponent;
  let fixture: ComponentFixture<MoviePreviewsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviePreviewsContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoviePreviewsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
