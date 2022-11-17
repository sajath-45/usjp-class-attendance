import { EventEmitter, Input } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Course } from 'src/app/models/class';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

import { DatabaseService } from 'src/app/services/database.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  registerForm: FormGroup;
  courses: Course[] = [];

  @Input() password: string;
  @Input() minLength: number = 8;
  @Input() numberCheck?: boolean = true;
  @Input() specialCharCheck?: boolean = true;
  @Input() smallcaseCheck?: boolean = true;
  @Input() uppercaseCheck?: boolean = true;
  @Output() strengthChange = new EventEmitter<number>();
  public strengthText: string = '';
  public score: number = 0;
  public feedbackArr: Array<Object> = [];
  passwordStrength: any = null;
  public barLabel: string = 'Password strength:';
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  public strengthLabels = [
    '(Useless)',
    '(Weak)',
    '(Normal)',
    '(Strong)',
    '(Great!)',
  ];
  public showPassword = false;
  passwordDetailsShow = false;

  constructor(
    private formBuilder: FormBuilder,
    public dbService: DatabaseService,
    private authService: AuthService,
    private util: UtilService
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            "[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?"
          ),
        ],
      ],
      type: ['student', Validators.pattern('student|lecturer')],
      id: ['', Validators.required],
      password: ['', Validators.required],
      courses: [],
    });

    this.registerForm
      .get('password')
      .valueChanges.subscribe((data: string) => {});
  }

  ngOnInit() {
    let closeSub = this.dbService
      .getAll(`course`, 'courseId')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.courses = res;
          console.log('corses', this.courses);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  passwordMatch(control: FormControl) {
    if (control.parent) {
      let password = control.parent.controls['password'].value;
      let passwordConfirm = control.parent.controls['passwordConfirm'].value;
      return password === passwordConfirm
        ? null
        : {
            matchPassword: true,
          };
    }
  }

  compareWith(o1, o2) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  handleChange(ev) {
    console.log(ev.target.value);
    this.registerForm.get('courses').setValue(ev.target.value);
  }

  register() {
    if (this.registerForm.valid) {
      let user = this.registerForm.value;
      delete user.password;
      console.log(user);
      debugger;

      try {
        this.authService
          .registerFirebase(
            {
              email: this.registerForm.get('email').value,
              password: this.registerForm.get('password').value,
            },
            user
          )
          .then(
            (res) => {
              console.log(res);
              this.util.showToast('Account Created', 'success', 'bottom');
            },
            (err) => {
              console.log(err);
              this.util.showToast('Error', 'danger', 'bottom');
            }
          );
      } catch (e) {
        console.log(e);
        this.util.showToast('Error', 'danger', 'bottom');
      }
    } else {
      this.util.showToast('Register form not valid!', 'danger', 'bottom');
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
