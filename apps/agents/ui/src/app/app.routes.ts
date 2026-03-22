import { Route } from '@angular/router';
import { ChatLandingComponent } from '@idl/ngx/chat';

export const appRoutes: Route[] = [
  { path: 'chat', component: ChatLandingComponent },
  { path: '', redirectTo: 'chat', pathMatch: 'full' },
];
