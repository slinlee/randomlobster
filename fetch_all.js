// fetch_all.js
import fetch from "node-fetch";
import fs from "fs";

async function fetchAllPosts() {
  let start = 1;
  let allPosts = [];
  let done = false;

  while (!done) {
    const url = `https://overopinionatedframebuilder.blogspot.com/feeds/posts/default?alt=json&start-index=${start}&max-results=500`;
    const res = await fetch(url);
    const data = await res.json();
    const entries = data.feed.entry || [];

    if (entries.length === 0) {
      done = true;
      break;
    }

    const urls = entries.map(
      (e) => e.link.find((l) => l.rel === "alternate").href,
    );
    allPosts.push(...urls);
    start += entries.length;
  }

  allPosts = [...new Set(allPosts)];
  fs.writeFileSync("posts.json", JSON.stringify(allPosts, null, 2));
  console.log(`✅ Saved ${allPosts.length} posts.`);
}

fetchAllPosts();
