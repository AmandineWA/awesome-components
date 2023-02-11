import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable, startWith, tap} from "rxjs";

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

  showEmailCtrl$!: Observable<boolean>;
  showPhoneCtrl$!: Observable<boolean>;

  constructor( private formbuilder: FormBuilder) {
  }
  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initFormObservables();
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

  private initFormObservables() {
    this.showEmailCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map(preference => preference === 'email'),
      tap(showEmailCtrl => {
        if (showEmailCtrl) {
          this.emailCtrl.addValidators([
            Validators.required,
            Validators.email]);
          this.confirmEmailCtrl.addValidators([
            Validators.required,
            Validators.email
          ]);
        }else {
          this.emailCtrl.clearValidators();
          this.confirmEmailCtrl.clearValidators();
        }
        this.emailCtrl.updateValueAndValidity();
        this.confirmEmailCtrl.updateValueAndValidity();
      })
    );
    this.showPhoneCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map(preference => preference === 'phone'),
      tap(showPhonectrl => {
        if(showPhonectrl){
          this.phoneCtrl.addValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
        } else {
          this.phoneCtrl.clearValidators();
        }
        this.phoneCtrl.updateValueAndValidity();
      })
    );
  }

  onSubmitForm() {
    console.log(this.mainForm.value)
  }

}
