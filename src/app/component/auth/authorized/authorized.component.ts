import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-authorized',
  templateUrl: './authorized.component.html',
  styleUrls: ['./authorized.component.scss']
})
export class AuthorizedComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  goHome() {
    this.router.navigateByUrl('/');
  }
}
