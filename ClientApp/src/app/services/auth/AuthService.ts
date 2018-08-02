import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Indicator } from '../../shared/models/indicator';
import { IndicatorService } from '../indicator/indicator.service';
import { Router } from '@angular/router';
import { NotificationService } from '../alerts/notification.service';
import { PermissionTarget, PermissionClaim } from './permissions';
import { User } from './User';
export interface Credentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router, private notifications: NotificationService) {}

  private static AUTHORIZATION_API = '/api/auth/';
  private self_token = null;

  public auth(credentials: Credentials): Observable<boolean> {
    return Observable.create(observer => {
      return this.http.post<any>(AuthService.AUTHORIZATION_API, credentials).subscribe(
        (data: any) => {
          // success path
          const token: string = data.token;
          localStorage.setItem('token', token);
          observer.next(true);
          observer.complete();
          this.router.navigate(['/home']);
          this.notifications.showToaster('Sesión iniciada', 'success');
          this.self_token = this.getToken();
        },
        error => {
          // error path
          localStorage.setItem('token', null);
          this.router.navigate(['/welcome']);
          this.self_token = null;
          observer.error(new Error('usuario inválido'));
          this.notifications.showToaster('Usuario inválido', 'error');
          observer.complete();
        }
      );
    });
  }

  // came with this idea while listening https://www.youtube.com/watch?v=4NrJ1C4sKr8 and drinking some vodka <3
  public isAllowedTo(target: PermissionTarget, claim: PermissionClaim): boolean {
    const token = <any>this.getToken();
    if (token.reads && claim === PermissionClaim.READ) {
      return token.reads.indexOf(target) > -1;
    } else if (token.writes && claim === PermissionClaim.WRITE) {
      return token.writes.indexOf(target) > -1;
    }
    return false;
  }

  public signOut() {
    return Observable.create(observer => {
      localStorage.removeItem('token');
      observer.next(true);
      observer.complete();
      this.notifications.showToaster('Sesión finalizada', 'info');
      this.self_token = null;
    });
  }


  public getUser(): User | boolean {
    const user: any = this.getToken();
    if (user !== false) {
      return user;
    }
    return false;
  }

  public getToken(): String | boolean {
    const raw_token = localStorage.getItem('token');
    if (!raw_token) {
      return false;
    }
    const secure_token: string = this.parseJwt(raw_token);
    if (secure_token == null) {
      return false;
    }
    return secure_token;
  }

  private parseJwt(raw_token: string) {
    let base64Url: string;
    base64Url = (raw_token + '').split('.')[1];
    let base64: string;
    base64 = (base64Url + '').replace('-', '+');
    base64 = (base64 + '').replace('_', '/');
    return JSON.parse((<any>window).atob(base64 + ''));
  }

  public newUser(response) {
    const token = response.headers.get('Authorization');
    const user = this.parseJwt(token);
    return JSON.stringify({
      user: user.sub,
      secure: {
        token: token
      }
    });
  }
}
