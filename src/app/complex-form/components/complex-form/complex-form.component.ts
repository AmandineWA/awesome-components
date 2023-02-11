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
  emailCtrl!: FormControl;
  confirmEmailCtrl!: FormControl;
  emailForm!: FormGroup;
  phoneCtrl!: FormControl;
  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;
  loginInfoForm!: FormGroup;

  constructor( private formbuilder: FormBuilder) {
  }
  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
  }

  private initMainForm(){
    this.mainForm = this.formbuilder.group({
      personalInfo: this.personnalInfoForm,
      contactPreference: this.contactPreferenceCtrl,
      email: this.emailForm,
      phone: this.phoneCtrl,
      loginInfo: this.loginInfoForm
    });
  }

  private initFormControls() {
    this.personnalInfoForm = this.formbuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    this.contactPreferenceCtrl = this.formbuilder.control('email');
    this.emailCtrl = this.formbuilder.control('');
    this.confirmEmailCtrl = this.formbuilder.control('');
    this.emailForm = this.formbuilder.group({
      email:this.emailCtrl,
      confirm: this.confirmEmailCtrl
    })
    this.phoneCtrl = this.formbuilder.control('');
    this.passwordCtrl = this.formbuilder.control('', Validators.required);
    this.confirmPasswordCtrl =this.formbuilder.control('', Validators.required);
    this.loginInfoForm =this.formbuilder.group({
      username: ['', Validators.required],
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl,
    })
  }

  onSubmitForm() {

  }
}
