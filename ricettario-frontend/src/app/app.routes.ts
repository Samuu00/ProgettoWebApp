import { Routes } from '@angular/router';

// Auth / Utente
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { Profile } from './components/auth/profile/profile';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { ForgotPassword } from './components/auth/forgot-password/forgot-password';
import { ResetPassword } from './components/auth/reset-password/reset-password';
import { ResetPasswordGuard } from './guards/resetPasswordGuard';

// Ricette
import { RecipeList } from './components/recipes/recipe-list/recipe-list';
import { RecipeDetail } from './components/recipes/recipe-detail/recipe-detail';
import { RecipeForm } from './components/recipes/recipe-form/recipe-form';
import { Favorites } from './components/recipes/favorites/favorites';

// Admin
import { authGuard } from './guards/auth-guard';
import { AdminGuard } from './guards/adminGuard';
import { AdminDashboard } from './components/admin/admin-dashboard/admin-dashboard';
import { UserManagement } from './components/admin/user-management/user-management';
import { RecipeModeration } from './components/admin/recipe-moderation/recipe-moderation';
import { PendingRecipeDetail } from './components/admin/pending-recipe-detail/pending-recipe-detail';

// notFound
import { NotFound } from './components/shared/not-found/not-found';
import { AboutUs } from './components/shared/about-page/about-page';
import { Privacy } from './components/shared/privacy/privacy-page';
import { CommentModeration } from './components/admin/comment-moderation/comment-moderation';

export const routes: Routes = [
  // Auth ---
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'register', component: Register },
  { path: 'about-page', component: AboutUs },
  { path: 'privacy-page', component: Privacy },

  // --- ROTTE RESET PASSWORD CON TOKEN VALIDO (Protette da ResetPasswordGuard) ---
  { path: 'reset-password/:token', component: ResetPassword, canActivate: [ResetPasswordGuard] },

  // --- ROTTE UTENTE AUTENTICATO (Protette da authGuard) ---
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'favorites', component: Favorites, canActivate: [authGuard] },
  { path: 'recipe-create', component: RecipeForm, canActivate: [authGuard] },
  { path: 'recipe-edit/:id', component: RecipeForm, canActivate: [authGuard] },
  { path: 'recipe/:id', component: RecipeDetail , canActivate: [authGuard] },
  { path: 'recipe-list',  component: RecipeList , canActivate: [authGuard] },

  // --- ROTTE PROTETTE ADMIN ---
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: UserManagement },
      { path: 'moderation', component: RecipeModeration },
      { path: 'comment-moderation', component: CommentModeration},
      { path: 'pending-recipe/:id', component: PendingRecipeDetail },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // --- PAGINA ERRORE ---
  { path: '404', component: NotFound },
  { path: '**', redirectTo: '404' }
];
