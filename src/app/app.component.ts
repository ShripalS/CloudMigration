import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { DataService } from './data.service';
import { Subscription } from 'rxjs';

export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CMS';
  navLinks: any[];
  activeLinkIndex = -1; 
  public subscription : Subscription;

  constructor(private router: Router, private data:DataService) {
    //window.location.href = 'https://login.windows.net/';

    // this.subscription = router.events.subscribe((event) => {
    //   if (event instanceof NavigationStart) {
    //      browserRefresh = !router.navigated;
    //   }
    // });
    this.data.currentNavLinkData.subscribe(data =>{
      this.navLinks = data;
    })
  }
  ngOnInit(): void {
    this.router.events.subscribe((res) => {
        this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }
  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

}
