import fetch from "node-fetch";
import fs from "fs";

const BLOGS = [
  "https://overopinionatedframebuilder.blogspot.com",
  "https://rocklobstershop.blogspot.com",
];

async function fetchBlogPosts(blogUrl) {
  let start = 1;
  let allPosts = [];
  let done = false;

  while (!done) {
    const url = `${blogUrl}/feeds/posts/default?alt=json&start-index=${start}&max-results=500`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
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

  return allPosts;
}

async function fetchAllPosts() {
  let allPosts = [];

  for (const blog of BLOGS) {
    console.log(`Fetching posts from ${blog}...`);
    const posts = await fetchBlogPosts(blog);
    allPosts.push(...posts);
  }

  // Deduplicate
  allPosts = [...new Set(allPosts)];

  // Shuffle so it feels "randomized" right away
  allPosts.sort(() => Math.random() - 0.5);

  fs.writeFileSync("posts.json", JSON.stringify(allPosts, null, 2));
  console.log(`✅ Saved ${allPosts.length} posts total.`);
}

fetchAllPosts().catch((err) => {
  console.error("Error fetching posts:", err);
  process.exit(1);
});
