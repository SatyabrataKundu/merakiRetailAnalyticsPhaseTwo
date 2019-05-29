import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule, MatSlideToggleModule, MatSnackBarModule, MatTooltipModule } from '@angular/material';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { ChatService } from '../app/services/chat.service';

import { AppComponent } from './app.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { InformationCardsComponent } from './components/information-cards/information-cards.component';
import { ChartsComponent } from './components/charts/charts.component';
import { StackedBarChartComponent } from './components/stacked-bar-chart/stacked-bar-chart.component';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartdataService } from './services/chartdata.service';
import { NotificationPanelComponent } from './components/notification-panel/notification-panel.component';
import { AbandonedChartComponent } from './components/abandoned-chart/abandoned-chart.component';
import { TestChartComponent } from './components/test-chart/test-chart.component';
import { snackBarComponent } from './app.component';


const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'left',
			distance: 12
		},
		vertical: {
			position: 'bottom',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 500,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 500,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    SideNavComponent,
    InformationCardsComponent,
    ChartsComponent,
    StackedBarChartComponent,
    DonutChartComponent,
    NotificationPanelComponent,
    AbandonedChartComponent,
    TestChartComponent,
    snackBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatBadgeModule,
    MatMenuModule,
    MatListModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    NotifierModule.withConfig(customNotifierOptions),
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [ChartdataService, ChatService],
  bootstrap: [AppComponent],
  entryComponents: [snackBarComponent],
})
export class AppModule { }
