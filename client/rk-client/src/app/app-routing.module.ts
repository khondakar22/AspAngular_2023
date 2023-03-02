import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';

const routes: Routes = [
 
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'members', component: MemberListComponent },
      { path: 'members/:id', component: MemberDetailsComponent  },
      { path: 'lists', component: ListsComponent  },
      { path: 'messages', component: MessagesComponent  },
    ]
  },
  { path: 'home', component: HomeComponent  },
  { path: 'login', component: LoginComponent  },
  { path: 'test-error', component: TestErrorComponent  },
  { path: 'not-found', component: NotFoundComponent  },
  { path: 'server-error', component: ServerErrorComponent  },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**',   component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
