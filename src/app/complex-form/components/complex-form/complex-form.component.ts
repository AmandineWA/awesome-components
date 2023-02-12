import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable, startWith, tap} from "rxjs";
import {ComplexFormService} from "../../services/complex-form.service";
import {confirmEqualValidator} from "../../validators/confirm-equal.validator";

@Component({
  selector: 'app-complex-form',
  templateUrl: './complex-form.component.html',
  styleUrls: ['./complex-form.component.scss']
})
export class ComplexFormComponent implements OnInit{

  loading = false;

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
  showEmailError$!: Observable<boolean>;
  showPasswordError$!: Observable<boolean>

  constructor( private formbuilder: FormBuilder, private complexFormService: ComplexFormService) {
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
    }, {
      validators: [confirmEqualValidator('email', 'confirm')],
      updateOn: 'blur'
    })
    this.phoneCtrl = this.formbuilder.control('');
    this.passwordCtrl = this.formbuilder.control('', Validators.required);
    this.confirmPasswordCtrl =this.formbuilder.control('', Validators.required);
    this.loginInfoForm =this.formbuilder.group({
      username: ['', Validators.required],
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl,
    }, {
      validators: confirmEqualValidator('password', 'confirmPassword'),
      updateOn: 'blur'
    })
  }

  private initFormObservables() {
    this.showEmailCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map(preference => preference === 'email'),
      tap(showEmailCtrl => {this.setEmailValidators(showEmailCtrl)})
    );
    this.showPhoneCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map(preference => preference === 'phone'),
      tap(showPhoneCtrl => { this.setPhoneValidators(showPhoneCtrl)})
    );
    this.showEmailError$ = this.emailForm.statusChanges.pipe(
      map(status => status === 'INVALID'
        && this.emailCtrl.value
        && this.confirmEmailCtrl.value
      )
    );
    this.showPasswordError$ = this.loginInfoForm.statusChanges.pipe(
      map( status => status === 'INVALID'
        && this.passwordCtrl.value
        && this.confirmPasswordCtrl.value
        && this.loginInfoForm.hasError('confirmEqual')
      )
    );
  }

  private setEmailValidators(showEmailCtrl: boolean){
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
  }

  private setPhoneValidators(showPhoneCtrl:boolean){
    if(showPhoneCtrl){
      this.phoneCtrl.addValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
    } else {
      this.phoneCtrl.clearValidators();
    }
    this.phoneCtrl.updateValueAndValidity();
  }

  onSubmitForm() {
    this.loading = true;
    this.complexFormService.saveUserInfo(this.mainForm.value).pipe(
      tap(saved => {
        this.loading = false;
       if (saved){
         this.resetForm();
       } else {
          console.error('Echec de l\'enregistrement')
       }
      })
    ).subscribe()
  }

  private resetForm(){
    this.mainForm.reset();
    this.contactPreferenceCtrl.patchValue('email');
  }

  getFormControlErrorText(ctrl: AbstractControl){
    if (ctrl.hasError('required')){
      return 'Ce champ est requis.';
    } else if (ctrl.hasError('email')){
      return 'Merci d\entrer une adresse mail valide.';
    }else if (ctrl.hasError('maxlength')){
      return 'Ce numéro de téléphone trop de chiffre';
    }else if (ctrl.hasError('minlength')){
      return 'Ce numéro de téléphone ne contient pas assez de chiffre';
    }else if (ctrl.hasError('validValidator')){
      return 'Ce champ ne contient pas le mot VALID';
    } else {
      return 'Ce champ contient une erreur.';
    }
  }

}
