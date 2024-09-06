import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit {

  public userForm!: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initUserForm();
  }

  initUserForm(): void {
    const currentUser = JSON.parse(localStorage.getItem('tomatina_currentUser') as string);
    this.userForm = this.fb.group({
      firstName: [currentUser.firstName, Validators.required],
      lastName: [currentUser.lastName, Validators.required],
      phoneNumber: [currentUser.phoneNumber, Validators.required],
      email: [currentUser.email, [Validators.required, Validators.email]]
    });
  }

}
