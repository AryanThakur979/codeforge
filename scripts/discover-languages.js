const https = require("https");
const fs = require("fs");

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error("Failed to parse JSON: " + e.message + "\nData: " + data.slice(0, 200)));
        }
      });
      res.on("error", reject);
    });
  });
}

async function main() {
  console.log("Fetching real languages from https://ce.judge0.com/languages ...");
  try {
    const list = await fetchJson("https://ce.judge0.com/languages");
    console.log(`Retrieved ${list.length} languages from provider.`);

    // Sort by id
    list.sort((a, b) => a.id - b.id);

    console.log("\nID   | Name");
    console.log("-----|---------------------------------------------------------");
    for (const item of list) {
      console.log(`${String(item.id).padEnd(4)} | ${item.name}`);
    }

    fs.writeFileSync("scripts/provider-languages.json", JSON.stringify(list, null, 2));
    console.log("\nSaved full raw list to scripts/provider-languages.json");
  } catch (err) {
    console.error("Error fetching languages:", err.message);
    process.exit(1);
  }
}

main();
