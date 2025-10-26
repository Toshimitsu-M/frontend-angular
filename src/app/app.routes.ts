import { Routes } from '@angular/router';
import { Search } from './search/search';
import { App } from './app';
import { FileIo } from './file-io/file-io';

export const routes: Routes = [
    { path: '', component: App },
    { path: 'search', component: Search },
    { path: 'fileIo', component: FileIo }
];
