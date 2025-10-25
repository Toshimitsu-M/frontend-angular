import { Routes } from '@angular/router';
import { Search } from './search/search';
import { App } from './app';

export const routes: Routes = [
    { path: '', component: App },
    { path: 'search', component: Search }

];
