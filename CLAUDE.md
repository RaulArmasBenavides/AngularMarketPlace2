# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Angular Marketplace** is an e-commerce/marketplace platform built with Angular 21 and Firebase. It uses a **modular architecture with lazy loading** featuring product listings, user accounts, vendor management, shopping cart, checkout, messaging, and dispute resolution.

## Development Commands

### Installation & Setup
```bash
nvm use 12.22.12        # Use Node 12.22.12 (as specified in README)
npm install             # Install dependencies
```

### Development
```bash
npm start               # Start dev server on http://localhost:4200
ng serve               # Same as npm start
```

### Build & Production
```bash
npm run build          # Build project (artifacts go to dist/my-app)
npm run build -- --prod  # Production build with optimization
```

### Testing
```bash
npm test               # Run unit tests via Karma
ng test                # Same as npm test
# Run specific test: ng test --include='**/account.component.spec.ts'
```

## Architecture & Structure

### Core Modules (Always Loaded)
- **CoreModule** (`src/app/core/core.module.ts`): Layout components (header, footer, newsletter) and HTTP interceptors. Declared in AppModule.
- **SharedModule** (`src/app/shared/shared.module.ts`): Reusable pipes (UrlsecurePipe, KeysPipe). Imported by feature modules that need pipes.

### Feature Modules (Lazy-Loaded)
Each feature module has its own route and only loads when that route is visited:

| Module | Route | File |
|--------|-------|------|
| HomeModule | `/` | `src/app/pages/home/home.module.ts` |
| ProductsModule | `/products/:param` | `src/app/pages/products/products.module.ts` |
| ProductModule | `/product/:param` | `src/app/pages/product/product.module.ts` |
| SearchModule | `/search/:param` | `src/app/pages/search/search.module.ts` |
| LoginModule | `/login` | `src/app/pages/login/login.module.ts` |
| RegisterModule | `/register` | `src/app/pages/register/register.module.ts` |
| AccountModule | `/account`, `/account/:param` | `src/app/pages/account/account.module.ts` |
| ShoppingCartModule | `/shopping-cart` | `src/app/pages/shopping-cart/shopping-cart.module.ts` |
| CheckoutModule | `/checkout` | `src/app/pages/checkout/checkout.module.ts` |
| StoreListModule | `/store-list` | `src/app/pages/store-list/store-list.module.ts` |
| BecomeAVendorModule | `/become-a-vendor` | `src/app/pages/become-a-vendor/become-a-vendor.module.ts` |
| Error404Module | `**` (wildcard) | `src/app/pages/error404/error404.module.ts` |

### Key Folders
- **pages/**: Page-level feature modules (home, products, product detail, account, checkout, etc.)
- **core/**: CoreModule (layout), interceptors, and guards
- **shared/**: Pipes and utilities used across feature modules
- **services/**: HTTP services communicating with Firebase & external APIs
- **models/**: TypeScript interfaces for type safety

### Lazy Loading Pattern
Routes in `app-routing.module.ts` use `loadChildren`:

```typescript
{
  path: 'products/:param',
  loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule)
}
```

Each feature module defines its own routes with `RouterModule.forChild()`:

```typescript
@NgModule({
  // ...
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: ProductsComponent }])]
})
export class ProductsModule {}
```

---

## HTTP Interceptors

The project uses two global HTTP interceptors for automatic token injection and error handling:

### AuthInterceptor
- **Location**: `src/app/core/interceptors/auth.interceptor.ts`
- **Purpose**: Automatically injects Firebase Realtime DB auth token as query param
- **How it works**:
  - Reads `localStorage.getItem('idToken')`
  - Only modifies requests to Firebase Realtime DB (checks URL for `databaseURL`)
  - Adds `?auth=TOKEN` to the request automatically
  - Leaves other requests (Firebase Auth, PHP, etc.) untouched
- **Result**: Services don't need to manually construct `?auth=idToken` anymore

### ErrorInterceptor
- **Location**: `src/app/core/interceptors/error.interceptor.ts`
- **Purpose**: Global HTTP error handling
- **Behavior**:
  - **401/403** (Unauthorized): Clears localStorage, redirects to `/login`
  - **0** (No connection): Shows error notification "Sin conexión a internet"
  - **500+** (Server error): Shows error notification "Error del servidor. Intenta más tarde"
  - All errors are re-thrown so components can handle them if needed
- **Uses**: `Sweetalert.fnc()` from `functions.ts` for notifications

---

## Backend & Data Layer

### Firebase Integration
- **Realtime Database**: Primary data store (products, users, orders, messages, disputes, etc.)
- **Authentication**: Firebase Auth REST API (signup, login, password reset, email verification)
- **Configuration**: `src/app/config.ts` defines all Firebase endpoints
- **Environment**: `src/environments/environment.ts` contains Firebase credentials

### Auth Token Management
- Token stored in `localStorage` with keys:
  - `'idToken'`: JWT token from Firebase Auth
  - `'expiresIn'`: Expiration timestamp (saved as string from `Date.getTime()`)
- **AuthInterceptor** automatically includes token in Firebase DB requests
- **AuthGuard** checks token validity before accessing protected routes (`/account`, `/checkout`)

### Services Pattern
Each service (ProductsService, UsersService, OrdersService, etc.) handles:
- HTTP calls via HttpClient
- RxJS observables for reactive data flow
- Data transformation/mapping
- Location: `src/app/services/`

### Services Without Explicit Token Handling
Due to **AuthInterceptor**, services no longer need `idToken: string` parameters for methods like:
- `products.patchDataAuth(id, value)` ← automatically adds `?auth=TOKEN`
- `stores.registerDatabase(body)` ← automatically adds `?auth=TOKEN`
- etc.

### External APIs
- **PayU & Mercado Pago**: Payment processing (endpoints in config.ts)
- **PHP Backend**: File uploads (Server.url) and email sending (Email.url) via local assets endpoints
- **API Key**: Required in environment.ts for server-side operations

---

## Important Patterns & Conventions

### Routing & Guards
- Routes defined in `app-routing.module.ts` use `loadChildren` for lazy loading
- Protected routes use `canActivate: [AuthGuard]` at the route definition level
- AuthGuard checks token expiration via `localStorage.getItem('expiresIn')`
- Routes support dynamic params (e.g., `/products/:param`, `/product/:param`)
- Fallback route (`**`) redirects to Error404Component

### Module Organization
- **AppModule**: Only bootstraps AppComponent, imports CoreModule and routing
- **Feature modules**: Declare their own components and imports (CommonModule, FormsModule, etc.)
- No circular dependencies between feature modules
- SharedModule exported by features that need pipes

### Styling
- **Global CSS**: `src/styles.css`
- **Bootstrap**: v5.3.8 for grid and utilities
- **Angular Material**: Used for some components (Material Design UI)
- **Summernote**: Rich text editor CSS included in build

---

## Adding a New Feature Module

### Step 1: Create module structure
```bash
mkdir -p src/app/pages/my-feature
touch src/app/pages/my-feature/my-feature.module.ts
ng generate component pages/my-feature/my-feature  # or manually create
```

### Step 2: Create feature module
```typescript
// src/app/pages/my-feature/my-feature.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyFeatureComponent } from './my-feature.component';
import { SharedModule } from '../../shared/shared.module';  // if using pipes

@NgModule({
  declarations: [MyFeatureComponent],
  imports: [
    CommonModule,
    SharedModule,  // only if using UrlsecurePipe or KeysPipe
    RouterModule.forChild([
      { path: '', component: MyFeatureComponent }  // route inside module
    ])
  ]
})
export class MyFeatureModule {}
```

### Step 3: Add route in app-routing.module.ts
```typescript
{
  path: 'my-feature',
  loadChildren: () => import('./pages/my-feature/my-feature.module').then(m => m.MyFeatureModule)
}
```

### Step 4: Import any needed modules
- **CommonModule**: Always import for `*ngIf`, `*ngFor`, pipes, etc.
- **FormsModule**: If using template-driven forms (`[(ngModel)]`, `NgForm`)
- **SharedModule**: If using `UrlsecurePipe` or `KeysPipe`
- **Third-party modules**: NgxDropzoneModule, TagInputModule, etc. as needed

---

## TypeScript & Configuration

### Type Checking
- **Strict Mode**: Enabled in tsconfig.json (strict, noImplicitAny, strictNullChecks)
- **Full Template Type Check**: Enabled for components
- **Target**: ES2022
- **Module**: ESNext

### Known Configuration Notes
- `allowedCommonJsDependencies` in angular.json: ['js-cookie', 'firebase'] (for CommonJS imports)
- Production build has size budgets: initial 2mb warning/5mb error, component styles 6kb warning/10kb error
- `types: ["jquery"]` in tsconfig.json for jQuery type support

---

## Common Development Tasks

### Adding a New Service
1. Generate service: `ng generate service services/my-service`
2. Inject HttpClient in constructor
3. Create methods that return observables from `http.get/post/put/delete`
4. Use `config.ts` endpoints for API URLs
5. If method needs auth, **AuthInterceptor handles token injection automatically**

### Making an API Call in a Component
```typescript
// Before (old pattern)
this.productsService.patchDataAuth(id, value, localStorage.getItem('idToken'));

// After (interceptor handles auth)
this.productsService.patchDataAuth(id, value);
```

### Updating Data Models
1. Add/modify interfaces in `src/app/models/`
2. Import in services and components
3. Update component templates to use new properties

### Handling HTTP Errors
Errors are handled globally by **ErrorInterceptor**. If you need custom error handling in a component:

```typescript
this.myService.getData().subscribe(
  (data) => { /* success */ },
  (error) => { /* custom handling */ }
);
```

---

## Third-Party Libraries

### UI Components
- **Angular Material**: Dialog, form controls, typography
- **Bootstrap**: Grid, spacing, utilities
- **Summernote**: WYSIWYG editor
- **ngx-chips**: Tag input component
- **ngx-dropzone**: File upload zones
- **DataTables.net**: Data tables with sorting/filtering
- **angular-confirmation-popover**: Confirm dialogs

### Utilities
- **RxJS**: Reactive programming (map, filter, tap, etc.)
- **js-cookie**: Cookie management
- **notie**: Notifications
- **md5-typescript**: MD5 hashing

---

## Testing Notes

- **Test Framework**: Karma/Jasmine
- **Test Files**: `.spec.ts` files colocated with source files
- **Current Coverage**: Spec files exist for most components but may not be fully implemented
- Run: `npm test` to execute all tests

---

## Common Gotchas & Notes

1. **Lazy loading not working?**: Make sure `RouterModule.forChild()` is used in feature modules, not `forRoot()`
2. **SharedModule usage**: Import SharedModule in feature modules that use pipes (UrlsecurePipe, KeysPipe)
3. **AuthInterceptor**: Only modifies Firebase Realtime DB requests. Other APIs (Firebase Auth, PHP) pass through unchanged
4. **ErrorInterceptor**: Handles 401/403 by clearing storage and redirecting to `/login`. Be aware if your auth flow differs
5. **Firebase async**: Services return observables; always subscribe or use async pipe
6. **Environment vars**: API keys in `environment.ts` — never commit sensitive data
7. **PHP backend**: File uploads and emails route through local PHP scripts in `src/assets/`

---

## Key Dependencies

- Angular 21.2.2 — Latest Angular version with signals and modern features
- RxJS 7.8.2 — Reactive utilities (map, filter, tap, catchError, etc.)
- Firebase 12.5.0 — Realtime DB and Auth (REST API, not SDK-based)
- Bootstrap 5.3.8 — CSS framework
- TypeScript 5.9.3 — Strict type checking enabled
- jQuery 3.x — Used in legacy code via `declare var $`

---

## Performance Notes

### Bundle Size Improvements
With lazy loading, the initial bundle is significantly smaller:
- **main.js**: Only AppComponent + CoreModule (header, footer, etc.)
- **Feature chunks**: Each route loads its chunk on demand (e.g., `login-login-module.js`)
- Benefit: Faster First Contentful Paint for initial page load

### Best Practices
- Avoid importing feature modules' components in the root AppModule
- Use `RouterModule.forChild()` in feature modules (never `forRoot()`)
- Unsubscribe from observables in components using `takeUntil(this.destroy$)` or async pipe
- Use OnPush change detection for expensive components

