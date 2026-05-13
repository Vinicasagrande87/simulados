import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroProfessor } from './cadastro-professor';

describe('CadastroProfessor', () => {
  let component: CadastroProfessor;
  let fixture: ComponentFixture<CadastroProfessor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroProfessor],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroProfessor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
