import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDividerModule } from '@angular/material';
import {MatListModule} from '@angular/material/list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { DxTemplateModule } from 'devextreme-angular/core/template';
import { DxAutocompleteModule } from 'devextreme-angular/ui/autocomplete';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxMenuModule } from 'devextreme-angular/ui/menu';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxDateBoxModule } from 'devextreme-angular/ui/date-box';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadPanelModule } from 'devextreme-angular/ui/load-panel';
import { DxNumberBoxModule } from 'devextreme-angular/ui/number-box';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxTabPanelModule } from 'devextreme-angular/ui/tab-panel';
import { DxTagBoxModule } from 'devextreme-angular/ui/tag-box';
import { DxTextAreaModule } from 'devextreme-angular/ui/text-area';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxValidationGroupModule } from 'devextreme-angular/ui/validation-group';
import { DxValidationSummaryModule } from 'devextreme-angular/ui/validation-summary';
import { DxValidatorModule } from 'devextreme-angular/ui/validator';
import { SideNavOuterToolbarModule } from './../shared/layouts/side-nav-outer-toolbar/side-nav-outer-toolbar.component';
import {DxPopoverModule, DxRadioGroupModule} from "devextreme-angular";
import { InlineHelpComponent } from './components/inline-help/inline-help.component';
import {EmptyDataComponent} from "./components/empty-data/empty-data.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from '@angular/material/button';

library.add(fas);

const DEVEXTREME_MODULES = [
    DxValidationSummaryModule,
    DxValidationGroupModule,
    DxAutocompleteModule,
    DxLoadPanelModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxValidatorModule,
    DxTemplateModule,
    DxCheckBoxModule,
    DxDataGridModule,
    DxTabPanelModule,
    DxTextAreaModule,
    DxDateBoxModule,
    DxTextBoxModule,
    DxPopoverModule,
    DxButtonModule,
    DxTagBoxModule,
    DxPopupModule,
    DxFormModule,
    DxMenuModule,
    DxRadioGroupModule
]

const ANGULAR_MODULES: any[] = [
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDividerModule,
    MatDialogModule,
    MatListModule,
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MatButtonModule
];

@NgModule({
    imports: [
        DEVEXTREME_MODULES,
        ANGULAR_MODULES,
        SideNavOuterToolbarModule,
        FontAwesomeModule
    ],
    exports: [
        DEVEXTREME_MODULES,
        ANGULAR_MODULES,
        SideNavOuterToolbarModule,
        FontAwesomeModule,
        InlineHelpComponent,
        EmptyDataComponent
    ],
    declarations: [InlineHelpComponent, EmptyDataComponent]
})
export class SharedModule { }