import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonBillEditorComponent } from './json-bill-editor.component';

describe('JsonBillEditorComponent', () => {
  let component: JsonBillEditorComponent;
  let fixture: ComponentFixture<JsonBillEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonBillEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JsonBillEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
