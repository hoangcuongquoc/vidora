import { Component, Input } from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import { VideoModel } from '../../../models/video.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-card-horizontal',
  standalone: true,
  imports: [SharedModule, MaterialModule, VideoModule],
  templateUrl: './video-card-horizontal.component.html',
  styleUrls: ['./video-card-horizontal.component.scss'],
})
export class VideoCardHorizontalComponent {
  @Input() video!: VideoModel;

  constructor(private router: Router) {}

  onVideoClick(video: VideoModel) {
    this.router.navigate(['/watch'], {
      queryParams: { v: video.id },
    });
  }
}
