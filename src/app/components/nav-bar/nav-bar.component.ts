import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AnilistService } from 'src/app/services/anilist.service';

@Component({
  selector: 'as-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  @ViewChild('navList') menu?: ElementRef;
  @ViewChild('.activeLink') activeLink?: ElementRef;

  user?: User;

  constructor(private route: ActivatedRoute, private anilistService: AnilistService) { }

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment?.includes("access_token=")) {
        // Set authenticated user
        this.anilistService.getAuthenticatedUser().then(res => {
          this.user = res;
        });
        
      } else {
        let accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          // Set authenticated user
          this.anilistService.getAuthenticatedUser().then(res => {
            this.user = res;
          });
        }
      }
    })
  }

  underline(event: any) {
    if (event.target.classList.contains("navEntry")) {
      console.log(event.target.offsetWidth)
      this.menu?.nativeElement.style.setProperty(
        "--underline-width",
        `${event.target.offsetWidth}px`
      );
      this.menu?.nativeElement.style.setProperty(
        "--underline-offset-x",
        `${event.target.offsetLeft}px`
      );
    }
  }

  noUnderline() {
    console.log(this.activeLink?.nativeElement.offsetLeft)
    // this.menu?.nativeElement.style.setProperty("--underline-offset-x", `${this.activeLink?.nativeElement.offsetLeft - 20}px`)
    this.menu?.nativeElement.style.setProperty(
      "--underline-width",
      `0px`
    );
  }

}
