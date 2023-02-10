import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-complex-form',
  templateUrl: './complex-form.component.html',
  styleUrls: ['./complex-form.component.scss']
})
export class ComplexFormComponent implements OnInit{

  mainForm!: FormGroup;
  personnalInfoForm!: FormGroup;
  contactPreferenceCtrl!: FormControl;
  phoneCtrl!: FormControl;

  constructor( private formbuilder: FormBuilder) {
  }
  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
  }

  private initFormControls() {
    this.personnalInfoForm = this.formbuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    this.contactPreferenceCtrl = this.formbuilder.control('email');
    this.phoneCtrl = this.formbuilder.control('');
  }

  private initMainForm(){
    this.mainForm = this.formbuilder.group({});
  }

  onSubmitForm() {

  }
}
