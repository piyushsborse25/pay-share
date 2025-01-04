import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatMenuModule} from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    FooterComponent
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

}
