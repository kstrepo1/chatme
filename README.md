# Chatme

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.1.
The project is part one of a 3813ICT Assignment. This project will be created using a MEAN Stack. 

## Github Organisation
Github has been used as a tool to track creation and modification of code. Commits have been used for major changes and implementations of the software. 

## Data Structures 
Two core objects run this first phase of the assignement. These are the "authedusers" object (located in the authcheck service) which stored the user list and the "grouplist" which has a seperate list storing group names, channel lists, admins and the ID for the group creator. Once MONGO DB is implemented this can be swapped over in a smooth manner. 

## Angular Setup 
Angular has been used as the front end software library. Angular brings web-apps together using components, services and routes. 
You will see the layout of the app, its components and services under `./src/app` 

A range of routes have been used to configure navigation around the web app. The below were used:
| Route | Description |
| ------- | ------------ |
| 'login' | This oage is shown when a user first accessed the site. It requires a login and passowrd. |
| 'home'| This route shows the homepage and will be viewed after successful login |
| 'groups'| This route takes the user to the groups page where a list of groups are shown. Some may have access provided, others the user can  request to join |
| 'group/:id' | This route is an activated route. This means that the group being shown will display dynamically depending on group ID requested |
| 'newgroup' | This route allows the creation of a new group. |
| 'users' | This route shows a list of users. |
| 'user/:id' | This route uses an activated route to dynamically show a user page depending on ID requested |
| 'profile' | This route shows the users current profile and information. |

The relevant compnents were used based on the routes. 

A User service (authcheck) and a group service were used to closely manage the relevant requests. These will be able to be swapped to the relevant post requests to a proxy server. 



## Further Angular Information 

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
