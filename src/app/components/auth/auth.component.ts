import { Component, OnInit } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  docData, 
  setDoc 
} from '@angular/fire/firestore';
import { 
  AbstractControl, 
  FormBuilder, 
  FormGroup, 
  Validators 
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ROLE } from 'src/app/shared/constants/role.constants';
import { IRegister } from 'src/app/shared/interfaces/account/account.interface';
import { AccountService } from 'src/app/shared/services/account/account.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  
  public loginUrl = '';
  public userName = '';
  public loginForm!: FormGroup;
  public registerForm!: FormGroup;
  public loginSubscription!: Subscription;
  private registerData!: IRegister;
  public signInIsOpen = false;
  public signUpIsOpen = false;
  public checkPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private afs: Firestore,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.checkUserLogin();
    this.checkUpdatedUserLogin();
    this.initLoginForm();
    this.initRegisterForm();
  }

  checkUserLogin(): void {
    const currentUser = JSON.parse(localStorage.getItem('tomatina_currentUser') as string);
    if (currentUser && currentUser.role === ROLE.USER) {
      this.loginUrl = 'cabinet';
      this.userName = currentUser.firstName;
    } else if(currentUser && currentUser.role === ROLE.ADMIN) {
      this.loginUrl = 'admin';
      this.userName = 'ADMIN';
    } else {
      this.loginUrl = '';
    }
  }

  checkUpdatedUserLogin(): void {
    this.accountService.isUserLogin$
      .subscribe(() => {
        this.checkUserLogin();
      });
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  initRegisterForm(): void {
    this.registerForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    });
  }

  openSignIn(): void {
    this.signUpIsOpen = false;
    this.signInIsOpen = true;
  }

  closeSignIn(): void {
    this.signInIsOpen = false;
  }

  openSignUp(): void {
    this.signUpIsOpen = true;
    this.signInIsOpen = false;
  }

  closeSignUp(): void {
    this.signUpIsOpen = false;
  }

  loginUser(): void {
    const { email, password } = this.loginForm.value;
    this.login(email, password)
      .then(() => {
        console.log('Login is sucessful');
        this.closeSignIn();
        this.loginForm.reset();
      }).catch(err => {
        console.log('Wrong login or password');
      })
  }

  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    this.loginSubscription = docData(doc(this.afs, 'users', credential.user.uid))
      .subscribe(user => {
        const currentUser = { ...user, uid: credential.user.uid };
        localStorage.setItem('tomatina_currentUser', JSON.stringify(currentUser));
        if(user && user['role'] === ROLE.USER) {
          this.router.navigate(['/cabinet']);
        } else if(user && user['role'] === ROLE.ADMIN) {
          this.router.navigate(['/admin']);
        }
        this.accountService.isUserLogin$.next(true);
      }, (err) => {
        console.log(err.message);
      })
  }

  registerUser(): void {
    const { email, password } = this.registerForm.value;
    this.registerData = this.registerForm.value;
    this.emailSignUp(email, password)
      .then(() => {
        console.log('New account created');
        this.openSignIn();
        this.registerForm.reset();
      }).catch(err => {
        console.log(err.message);
      })
  }

  async emailSignUp(email: string, password: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = {
      email: credential.user.email,
      firstName: this.registerData.firstName,
      lastName: this.registerData.lastName,
      phoneNumber: this.registerData.phoneNumber,
      adress: '',
      role: ROLE.USER,
      orders: []
    };
    setDoc(doc(this.afs, 'users', credential.user.uid), user);
  }

  checkConfirmedPassword(): void {
    this.checkPassword = this.password.value === this.confirmed.value;
    if(this.password.value !== this.confirmed.value) {
      console.log('Password is wrong');
    }
  }

  get password(): AbstractControl {
    return this.registerForm.controls['password'];
  }

  get confirmed(): AbstractControl {
    return this.registerForm.controls['confirmPassword'];
  }

}
