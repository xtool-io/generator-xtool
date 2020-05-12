import { SharedModule } from './../../shared/shared.module';
import { Component, OnInit, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { DxHtmlEditorModule } from 'devextreme-angular';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

    public navigation: Array<any> = [];

    constructor(private title: Title) { }

    ngOnInit() {
        this.title.setTitle('Home');
    }

}


const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        DxHtmlEditorModule,
    ],
    exports: [
        HomeComponent
    ],
    entryComponents: [
        HomeComponent
    ]
})
export class HomePageModule { }