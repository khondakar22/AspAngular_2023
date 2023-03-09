import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { Messages } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessagesService } from 'src/app/_services/messages.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  member: Member | undefined;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  messages: Messages[] = [];

  @ViewChild("myMessageTab", { static: false }) myMessageTab: MatTabGroup | undefined;
  constructor(private memberService: MembersService,
    private route: ActivatedRoute,
    private messageService: MessagesService){}
  ngOnInit(): void {
    this.loadMember();
    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent:100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }]
  }
  getImages(){
    if(!this.member) return [];
    const imageUrls = [];
    for(const photo of this.member.photos ) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url
      })
    }
    return imageUrls;
  }

  loadMember(){
    const username = this.route.snapshot.paramMap.get('userName');
    if(!username) return;
    this.memberService.getMember(username).subscribe({
      next: (res) =>{
        this.member = res;
        this.galleryImages = this.getImages();
      }
    })
  }

  onTabChange($event: any) {
    if($event.tab.textLabel === 'Messages') {
      this.loadMessagesThreads()
    }
  }

  goMessage(tabTitle: string) {
    const tabGroup = this.myMessageTab;
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) return;
    tabGroup._tabs['_results'].forEach((element: MatTab) => {
      console.log("🚀 ~ file: member-details.component.ts:72 ~ MemberDetailsComponent ~ header ~ element:", element.textLabel)
      if(element.textLabel === tabTitle) {
        if (this.myMessageTab)this.myMessageTab.selectedIndex = element.position;
      }
    });

  }

  loadMessagesThreads(){
    if(this.member?.userName) {
      this.messageService.getMessagesThread(this.member?.userName).subscribe({
        next: res => {
          this.messages = res;
        }
      })
    }
  }

}
