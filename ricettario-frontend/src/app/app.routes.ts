import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth-guard';
import { AdminGuard } from './guards/adminGuard';
import { ResetPasswordGuard } from './guards/resetPasswordGuard';
import { RecipeList } from './components/recipes/recipe-list/recipe-list';
import { Login } from './components/auth/login/login';

const t = (page: string) => `${page} · Ricettario`;

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'recipe-list' },

  // --- Pubbliche / ospiti ---
  { path: 'login', component: Login, canActivate: [guestGuard], title: t('Accedi') },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register').then((m) => m.Register),
    canActivate: [guestGuard],
    title: t('Crea un account'),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./components/auth/forgot-password/forgot-password').then((m) => m.ForgotPassword),
    title: t('Recupera password'),
  },
  {
    path: 'reset-password/:token',
    loadComponent: () => import('./components/auth/reset-password/reset-password').then((m) => m.ResetPassword),
    canActivate: [ResetPasswordGuard],
    title: t('Nuova password'),
  },
  {
    path: 'about-page',
    loadComponent: () => import('./components/shared/about-page/about-page').then((m) => m.AboutUs),
    title: t('Chi siamo'),
  },
  {
    path: 'privacy-page',
    loadComponent: () => import('./components/shared/privacy/privacy-page').then((m) => m.Privacy),
    title: t('Privacy'),
  },

  // --- Utente autenticato ---
  { path: 'recipe-list', component: RecipeList, canActivate: [authGuard], title: t('Ricette') },
  {
    path: 'recipe/:id',
    loadComponent: () => import('./components/recipes/recipe-detail/recipe-detail').then((m) => m.RecipeDetail),
    canActivate: [authGuard],
    title: t('Ricetta'),
  },
  {
    path: 'recipe-create',
    loadComponent: () => import('./components/recipes/recipe-form/recipe-form').then((m) => m.RecipeForm),
    canActivate: [authGuard],
    title: t('Nuova ricetta'),
  },
  {
    path: 'recipe-edit/:id',
    loadComponent: () => import('./components/recipes/recipe-form/recipe-form').then((m) => m.RecipeForm),
    canActivate: [authGuard],
    title: t('Modifica ricetta'),
  },
  {
    path: 'favorites',
    loadComponent: () => import('./components/recipes/favorites/favorites').then((m) => m.Favorites),
    canActivate: [authGuard],
    title: t('Preferiti'),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/admin/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
    title: t('La mia cucina'),
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/auth/profile/profile').then((m) => m.Profile),
    canActivate: [authGuard],
    title: t('Profilo'),
  },

  // --- Admin (guard su padre e figli) ---
  {
    path: 'admin',
    canActivate: [AdminGuard],
    canActivateChild: [AdminGuard],
    loadComponent: () => import('./components/admin/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
        title: t('Admin · Panoramica'),
      },
      {
        path: 'moderation',
        loadComponent: () => import('./components/admin/recipe-moderation/recipe-moderation').then((m) => m.RecipeModeration),
        title: t('Admin · Ricette'),
      },
      {
        path: 'pending-recipe/:id',
        loadComponent: () =>
          import('./components/admin/pending-recipe-detail/pending-recipe-detail').then((m) => m.PendingRecipeDetail),
        title: t('Admin · Revisione'),
      },
      {
        path: 'users',
        loadComponent: () => import('./components/admin/user-management/user-management').then((m) => m.UserManagement),
        title: t('Admin · Utenti'),
      },
      {
        path: 'comment-moderation',
        loadComponent: () =>
          import('./components/admin/comment-moderation/comment-moderation').then((m) => m.CommentModeration),
        title: t('Admin · Commenti'),
      },
    ],
  },

  {
    path: '404',
    loadComponent: () => import('./components/shared/not-found/not-found').then((m) => m.NotFound),
    title: t('Pagina non trovata'),
  },
  { path: '**', redirectTo: '404' },
];
