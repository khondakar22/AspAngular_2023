import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  member: Member | undefined;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  constructor(private memberService: MembersService, private route: ActivatedRoute){}
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
    console.log('a');
    if(!this.member) return [];
    const imageUrls = [];
    console.log('c');
    for(const photo of this.member.photos ) {
      console.log(photo);
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
        console.log(res);
        this.member = res;
        this.galleryImages = this.getImages();
      }
    })
  }

}
