import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
    { path: '', loadChildren: './view/home/home.component#HomePageModule' },

    { path: '**', redirectTo: '' } // Rota padrão
]
@NgModule({
    imports: [
        BrowserAnimationsModule,
        RouterModule.forRoot(routes, { useHash: true })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
