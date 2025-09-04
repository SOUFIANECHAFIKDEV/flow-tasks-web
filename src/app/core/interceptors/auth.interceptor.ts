import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = req.clone({ setHeaders: { Authorization: 'Bearer <token>' } });
  return next(auth);
};
