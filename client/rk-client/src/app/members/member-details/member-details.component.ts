import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Messages } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MessagesService } from 'src/app/_services/messages.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
})
export class MemberDetailsComponent implements OnInit, OnDestroy {
  member: Member = {} as Member;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  messages: Messages[] = [];
  user?: User;

  @ViewChild('myMessageTab', { static: true }) myMessageTab = {} as MatTabGroup;
  constructor(
    private route: ActivatedRoute,
    private messageService: MessagesService,
    public presenceService: PresenceService,
    private accountService: AccountService,
    private router: Router
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (res) => {
        if (res) {
          this.user = res;
        }
      },
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (res) => {
        this.member = res['member'];
      },
    });

    this.route.queryParams.subscribe({
      next: (params) => {
        if (params['tab']) {
          this.goMessage(params['tab'], true);
        }
      },
    });
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];
    this.galleryImages = this.getImages();
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
  getImages() {
    if (!this.member) return [];
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
      });
    }
    return imageUrls;
  }

  onTabChange($event: any) {
    if ($event.tab.textLabel === 'Messages' && this.user) {
      this.loadMessageHub();
    } else {
      this.messageService.stopHubConnection();
    }
  }

  goMessage(tabTitle: string, _loadFromParam = false) {
    const tabGroup = this.myMessageTab;

    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) return;
    if (_loadFromParam) {
      if (this.myMessageTab) {
        this.myMessageTab.selectedIndex = 4;
        this.loadMessageHub();
      }
    } else {
      tabGroup._tabs['_results'].forEach((element: MatTab) => {
        if (element.textLabel === tabTitle) {
          if (this.myMessageTab)
            this.myMessageTab.selectedIndex = element.position;
        }
      });
    }
  }

  loadMessagesThreads() {
    if (this.member?.userName) {
      this.messageService.getMessagesThread(this.member?.userName).subscribe({
        next: (res) => {
          this.messages = res;
        },
      });
    }
  }
  loadMessageHub() {
    if (this.user) {
      this.messageService.createHubConnection(this.user, this.member.userName);
    } else {
      this.messageService.stopHubConnection();
    }
  }
}
