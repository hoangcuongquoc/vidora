import {
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import { PlaylistDialogComponent } from '../../dialogs/playlist-dialog/playlist-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { VideoModel } from '../../../models/video.model';
import { Subscription } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { VideoState } from '../../../ngrxs/video/video.state';
import { UserState } from '../../../ngrxs/user/user.state';
import { AlertService } from '../../../services/alert.service';
import * as VideoActions from '../../../ngrxs/video/video.actions';

@Component({
  selector: 'app-video-card-vertical',
  standalone: true,
  imports: [SharedModule, MaterialModule, VideoModule],
  templateUrl: './video-card-vertical.component.html',
  styleUrl: './video-card-vertical.component.scss',
})
export class VideoCardVerticalComponent implements OnInit, OnDestroy {
  @Input() video!: VideoModel;
  @ViewChild('media', { static: false }) videoElement!: ElementRef;
  readonly dialog = inject(MatDialog);

  subscriptions: Subscription[] = [];
  isMuteVolume!: boolean;
  isHovering: boolean = false;
  user!: UserModel;
  protected readonly open = open;

  constructor(
    private router: Router,
    private store: Store<{
      video: VideoState;
      user: UserState;
    }>,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select('video', 'isMuteVolume').subscribe((isMutedVideo) => {
        this.isMuteVolume = isMutedVideo;
      }),
      this.store.select('user', 'user').subscribe((user) => {
        if (user) {
          this.user = user;
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onMouseEnter() {
    this.isHovering = !this.isHovering;
    setTimeout(() => {
      const video = document.getElementById('hls-video') as HTMLVideoElement;
      if (video) {
        video.focus();
        video.volume = this.isMuteVolume ? 0 : 1;
        video
          .play()
          .then((r) => r)
          .catch((e) => console.error(e));
      }
    }, 100);
  }

  onMouseLeave() {
    this.isHovering = !this.isHovering;
  }

  onMuteClick(event: Event) {
    event.stopPropagation(); // Ngăn không cho sự kiện lan lên vg-player
    this.isMuteVolume = !this.isMuteVolume;
    const video = document.getElementById('hls-video') as HTMLVideoElement;
    if (video) {
      video.volume = this.isMuteVolume ? 0 : 1;
    }
    this.store.dispatch(VideoActions.toggleMuteVolume());
  }

  onVideoClick(event: Event): void {
    event.preventDefault();
    this.router
      .navigate(['/watch'], {
        queryParams: { v: this.video.id },
      })
      .then((r) => r);
  }

  openPlaylistDialog() {
    const dialogRef = this.dialog.open(PlaylistDialogComponent, {
      data: this.video.id,
    });
  }

  openDialog(event: MouseEvent) {
    event.stopPropagation();
  }

  addToWatchLater() {}
}
