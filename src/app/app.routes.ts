import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ChannelsComponent } from './home/channels/channels.component';
import { GroupsComponent } from './home/groups/groups.component';
import { GroupComponent } from './home/groups/group/group.component';
import { NewgroupComponent } from './home/groups/newgroup/newgroup.component';
import { UsersComponent } from './home/users/users.component';
import { UserComponent } from './home/users/user/user.component';
import { ChatComponent } from './home/chat/chat.component';
import { ProfileComponent } from './home/profile/profile.component';


export const routes: Routes = [
    {path: 'home', component:HomeComponent},
    {path: 'login', component:LoginComponent},
    {path: 'channels', component:ChannelsComponent},
    {path: 'groups', component:GroupsComponent},
    {path: 'group/:id', component:GroupComponent},
    {path: 'newgroup', component:NewgroupComponent},
    {path: 'users', component:UsersComponent},
    {path: 'user/:id', component:UserComponent},
    {path: 'chat', component:ChatComponent},
    {path: 'profile', component:ProfileComponent},
];
