# Payshare

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.11.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Setup Configuration

### 1. **Install FontAwesome**
FontAwesome is a popular icon library. To install it:

```bash
npm install @fortawesome/fontawesome-free
```

You also need to add the CSS for FontAwesome to your `angular.json` file:

```json
"styles": [
  "./node_modules/@fortawesome/fontawesome-free/css/all.min.css"
]
```

Alternatively, in your component's CSS, you can also import FontAwesome as:

```scss
@import "@fortawesome/fontawesome-free/css/all.css";
```

### 2. **Install Angular FontAwesome**

This package allows you to use FontAwesome icons as Angular components.

```bash
npm install @fortawesome/angular-fontawesome
```

After installing, make sure to import the `FontAwesomeModule` in your module (`app.module.ts`):

```typescript
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    // other imports
    FontAwesomeModule
  ]
})
export class AppModule { }
```

### 3. **Install Bootstrap**

Bootstrap provides responsive design and UI components.

To install it:

```bash
npm install bootstrap --save
```

Add the Bootstrap CSS and JavaScript files to your `angular.json` file:

```json
"styles": [
  "./node_modules/bootstrap/dist/css/bootstrap.min.css"
],
"scripts": [
  "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
]
```

This ensures that Bootstrap's styles and JavaScript (like the dropdown or modal) will work seamlessly in your application.

### 4. **TypeRoots for Angular Material**

This step isn't required unless you're customizing Angular Material typings or configurations. Normally, Angular Material is used by importing `MatModule` into your app module.

However, you mentioned:

```json
"typeRoots": ["./node_modules/@angular/material"]
```

This setting is used to define the paths for type declarations. It might be necessary if you have custom typings or if you're working with specific types from Angular Material.

### Conclusion

Once you've run these `npm install` commands and added the configurations to `angular.json` and `app.module.ts`, you can start using FontAwesome icons and Bootstrap in your Angular project. Let me know if you need further assistance with this setup!

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
