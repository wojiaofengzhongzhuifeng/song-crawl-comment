export enum SongStatus{
  LYRIC_AUDIT_PASS = 'LYRIC_AUDIT_PASS'
}

// 接口返回数据
export interface BackEndSongMeta{
  "result": string,
  "message":  string,
  "data": {
    "id": number,
    "trackId": number,
    "externalId":  string// "youtube-vb8wloc4Xpw",
    "youtubeTitle":  string// "Becky G, KAROL G - MAMIII (Audio)",
    "youtubeSong":  string// "MAMIII",
    "youtubeAlbum":  string// "",
    "youtubeArtists":  string[]// ["Becky G", " KAROL G"],
    "youtubeDuration":  number// 227625,
    "externalSongId":  string// "spotify-1ri9ZUkBJVFUdgwzCnfcYs",
    "spotifySong":  string// "MAMIII",
    "spotifyAlbum":  string// "MAMIII",
    "spotifyArtists":  string[]// ["Becky G", "KAROL G"],
    "spotifyArtistIds":  string[]// ["spotify-4obzFoKoKRHIphyHzJ35G3", "spotify-790FomKkXshlbRYZFtlgla"],
    "spotifyAlbumId":  string// "spotify-6GHUywBU0u92lg0Dhrt40R",
    "spotifyDuration": number// 226088,
    "status": SongStatus,
    "failReason":  string// "",
    "creation":  string// "2022-04-01T08:31:57.309+0000",
    "modification":  string// "2022-07-09T12:32:00.000+0000",
    "type":  string// "OFFICIAL",
    "version":  string// "AUDIO",
    "auditor":  string // "all",
    "auditSuggestion": string | null//  null,
    "source": string | null// null
  },
  "traceId": string | null// null
}

// nest 需要使用数据
export type FrontEndSongMeta = {
  spotifyAlbum: string
  spotifySong: string
  spotifyArtists: string[]

}

