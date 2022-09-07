import { Injectable } from '@nestjs/common';
import { BackEndSongMeta, FrontEndSongMeta } from "../types/song-meta";
import { HttpService } from "@nestjs/axios";
import { map, Observable } from "rxjs";
import { AxiosResponse } from "axios";

// 用于发起请求
@Injectable()
export class SongMetaProxy {
  constructor(private readonly httpService: HttpService) {}

  async getMetaByYTBId(yid: string): Promise<FrontEndSongMeta>{
    let frontEndSongMeta: FrontEndSongMeta = { spotifyAlbum: '', spotifySong: '', spotifyArtists: [], }
    let requestUrl = `http://api.larkplayerapp.com/ms-map-seed-server/song-maps/external-id?externalId=youtube-${yid}`
    const response: AxiosResponse<BackEndSongMeta> = await this.httpService.axiosRef.get(requestUrl)
    frontEndSongMeta.spotifySong = response?.data?.data?.spotifySong || ''
    frontEndSongMeta.spotifyAlbum = response?.data?.data?.spotifyAlbum || ''
    frontEndSongMeta.spotifyArtists = response?.data?.data?.spotifyArtists
    return frontEndSongMeta
  }
}
