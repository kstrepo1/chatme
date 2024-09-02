import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ChannelsComponent } from './home/channels/channels.component';
import { GroupsComponent } from './home/groups/groups.component';
import { UsersComponent } from './home/users/users.component';
import { ChatComponent } from './home/chat/chat.component';


export const routes: Routes = [
    {path: 'home', component:HomeComponent},
    {path: 'login', component:LoginComponent},
    {path: 'channels', component:ChannelsComponent},
    {path: 'groups', component:GroupsComponent},
    {path: 'users', component:UsersComponent},
    {path: 'chat', component:ChatComponent},

];
