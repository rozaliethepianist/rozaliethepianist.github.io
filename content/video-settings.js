// The only source of video selections. Preserve the desired display order.
// About: any number of HTTPS YouTube video URLs; invalid entries are skipped.
// Home: two positions, each a video URL or "auto". One auto = newest upload;
// two auto = newest and second newest. Duplicates are intentionally preserved.
// uploadsPlaylist: the channel uploads playlist used by automatic Home positions.
window.ROZALIE_VIDEOS = {
  uploadsPlaylist: "UUG5_aMyEhXXVwi5zO8ttx0g",
  about: [
    "https://youtu.be/S9z2L2W-NAg",
    "https://youtu.be/Ul3ZjhHKQAQ",
    "https://youtu.be/P4u-Hn2TzWw",
    "https://youtu.be/eJcp-Q_IN6g",
  ],
  home: ["auto", "auto"]
};
