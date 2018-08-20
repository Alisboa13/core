import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpResponse,
  HttpProgressEvent,
  HttpErrorResponse,
  HttpUserEvent
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth/AuthService';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  refreshLock = false;
  refreshThreadLock: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);


  injectToken(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getRawToken()}`
      }
    });
}


  constructor(public auth: AuthService) {}

  // tslint:disable-next-line:max-line-length
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
  > {
    return next.handle(this.injectToken(request)).catch(error => {
      if (error instanceof HttpErrorResponse) {
        switch ((<HttpErrorResponse>error).status) {
          case 400:
            return this.handle400Error(error);
          case 401:
            return this.handle401Error(request, next);
        }
      } else {
        return Observable.throw(error);
      }
    });
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.refreshLock) {
      this.refreshLock = true;
      return this.auth
        .refreshToken()
        .switchMap((tokenAvailable: boolean) => {
          if (tokenAvailable) {
            this.refreshThreadLock.next(tokenAvailable);
            return next.handle(
              this.injectToken(req)
            );
          }
          return this.logoutAction();
        })
        .catch(error => {
          return this.logoutAction();
        })
        .finally(() => {
          this.refreshLock = false;
        });
    } else {
      return this.refreshThreadLock
        .filter(token => token != null).take(1)
        .switchMap(token => {
          return next.handle(this.injectToken(req));
        });
    }
  }

  handle400Error(error) {
    if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
        // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
        return this.logoutAction();
    }

    return Observable.throw(error);
}

  logoutAction() {
    // Route to the login page (implementation up to you)

    return Observable.throw('');
  }
}
