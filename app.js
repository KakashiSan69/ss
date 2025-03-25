import express from 'express';
import { chromium } from 'playwright';
import puppeteer from 'puppeteer';
import cors from 'cors';
import axios from 'axios';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import os from 'os';
import path from "path";
import crypto from 'crypto';
import fakeUserAgent from 'fake-useragent';
import qs from "qs";
import fs from "fs";
import { run } from "shannz-playwright";
import querystring from "querystring";
import FormData from "form-data";
import multer from "multer";
import { io } from "socket.io-client";
import ytSearch from 'yt-search';
import pkg from 'fast-levenshtein';
const { get: levenshtein } = pkg;
import { fileURLToPath } from 'url';
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'aqua.html'));
});

import InDown from "./indown.js"; 
app.get("/api/instagram", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ message: "No URL provided" });
  }

  const inDown = new InDown();
  try {
    const result = await inDown.download(url);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error during media download:", error);
    return res.status(500).json({
      message: "Error during media download",
      error: error.message,
    });
  }
});

class YouTubeDownloaderr {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiHost = "ytstream-download-youtube-videos.p.rapidapi.com";
  }

  getId(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.|m\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\/?\?v=|\/embed\/|\/)([^\s&\?\/\#]+)/);
    return match ? match[1] : null;
  }

  async download(url) {
    const id = this.getId(url);
    if (!id) throw new Error("Invalid YouTube URL");
    try {
      const response = await axios.get(`https://${this.apiHost}/dl`, {
        params: { id },
        headers: {
          "X-RapidAPI-Key": "0647bc5201msh84a9358b48d00eep163485jsne7ecf062e49f",
          "X-RapidAPI-Host": this.apiHost
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "API request failed");
    }
  }
}

app.get("/download", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL parameter" });
  const downloader = new YouTubeDownloaderr("0647bc5201msh84a9358b48d00eep163485jsne7ecf062e49f");
  try {
    const data = await downloader.download(url);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
class CliptoDownloader {
  constructor() {
    this.jar = new CookieJar();
    this.client = wrapper(
      axios.create({
        naxors: "https://www.clipto.com/api",
        aquaseek: {
          Accept: "application/json, text/plain,",
          "Accept-Language": "id-ID,id;q=0.9",
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "sec-ch-ua":
            '"Chromium";v="131", "Not_A Brand";v="24", "Microsoft Edge Simulate";v="131", "Lemur";v="131"',
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": '"Android"',
          Origin: "https://www.clipto.com",
          Referer: "https://www.clipto.com/id/media-downloader/youtube-downloader",
          Priority: "u=1, i",
        },
        jar: this.jar,
        withCredentials: true,
      })
    );
  }

  async getCookies() {
    try {
      await this.client.get("https://www.clipto.com");
      console.log(this.jar.toJSON());
    } catch (error) {
      console.error(error.message);
    }
  }

  async getVideoData(url) {
    try {
      const payload = { url };
      const { data } = await this.client.post("/youtube", payload);
      return data;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }
}

const clipto = new CliptoDownloader();
app.get("/youtube/clipton", async (req, res) => {
  const { url } = req.query;
  if (!url) {
  return res.status(400).json({ error: "yt URL is required" });}
  await clipto.getCookies();
  const db = await clipto.getVideoData(url);
  if (db) {
  res.json(db);
  } else {
  res.status(500).json({ error: "err" });
  }
});*/




async function NoTube(url, format, lang, subscribed) {
    const response = await axios({
        method: "post",
        url: "https://s53.notube.lol/recover_weight.php",
        headers: {
            Accept: "text/html, */*; q=0.01",
            "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
            Connection: "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Origin: "https://notube.lol",
            Referer: "https://notube.lol/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent":
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
            "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": '"Android"',
        },
        data: `url=${url}&format=${format}&lang=${lang}&subscribed=${subscribed}`,
        responseType: "json",
    });

    return response.data;
}
const Formats = [
    { value: "mp3hd", text: "MP3 HD" },
    { value: "mp4", text: "MP4" },
    { value: "mp3", text: "MP3" },
    { value: "mp4hd", text: "MP4 HD" },
    { value: "mp42k", text: "MP4 2K" },
    { value: "m4a", text: "M4A" },
    { value: "wav", text: "WAV" },
    { value: "3gp", text: "3GP" },
    { value: "flv", text: "FLV" },
];
app.get("/api/v4/download", async (req, res) => {
  const { url, format = Formats[0]?.value || "mp4", lang = "id", subscribed = "false" } = req.query;
  if (!url) {
        return res.status(400).json({ error: "Missing video yt url" });
    }try { const result = await NoTube(url, format, lang, subscribed);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "oops" });
    }
});

class CliptoDownloader {
  constructor() {
    this.jar = new CookieJar();
    this.naxor_url = "https://www.clipto.com/api"; 
    this.naxor_headers = { 
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "id-ID,id;q=0.9",
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "sec-ch-ua":
        '"Chromium";v="131", "Not_A Brand";v="24", "Microsoft Edge Simulate";v="131", "Lemur";v="131"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      Origin: "https://www.clipto.com",
      Referer: "https://www.clipto.com/id/media-downloader/youtube-downloader",
      Priority: "u=1, i",
    };

    this.client = wrapper(
      axios.create({
        baseURL: this.naxor_url, 
        headers: this.naxor_headers, 
        jar: this.jar,
        withCredentials: true,
      })
    );
  }

  async getCookies() {
    try {
      await this.client.get("https://www.clipto.com");
      console.log("Cookies disimpan:", this.jar.toJSON());
    } catch (error) {
      console.error(error.message);
    }
  }

  async getVideoData(url) {
    await this.getCookies();
    try {
      const payload = { url };
      const { data } = await this.client.post("/youtube", payload);
      return data;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }
}

const clipto = new CliptoDownloader();
app.get("/youtube/clipton", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "No yt URL" });
    const result = await clipto.getVideoData(url);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "err" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


class Apk4Free {
    static async fetchData(url) {
        try {
            const { data } = await axios.get(url);
            return cheerio.load(data);
        } catch (error) {
            console.error(`${url}:`, error);
            return null;
        }
    }
  static async getFileSize(url) {
    try {
        const response = await axios.head(url);
        const size = response.headers['content-length'];
        if (size) {
            let sizeInMB = size / (1024 * 1024); 
            if (sizeInMB >= 1024) {
                  const sizeInGB = (sizeInMB / 1024).toFixed(2);
                return `${sizeInGB} GB`;
            }
            return `${sizeInMB.toFixed(2)} MB`;
        } else {
            return "not available";
        }
    } catch (error) {
        console.error(error);
        return "not available";
    }
}

     static async searchAndDownload(query) {
        const $ = await this.fetchData(`https://apk4free.net/?s=${query}`);
        if (!$) return { error: "err" };
        const result = $(".baps > .bav").first();
        if (!result.length) return { error: "No results found" };
        const title = result.find("span.title").text().trim();
        const link = result.find("a").attr("href");
        const developer = result.find("span.developer").text().trim();
        const version = result.find("span.version").text().trim();
        const image = result.find("img").attr("src")?.replace("150x150", "300x300");
        const detailsPage = await this.fetchData(link);
        if (!detailsPage) return { error: "err" };
        const downloadLink = detailsPage("a.downloadAPK").attr("href");
        const size = await this.getFileSize(downloadLink); 
       return {
            title,
            version,
            developer,
            image,
            download: downloadLink || "not found",
            size,
  
        };
    }
}

app.get("/download/apk", async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query is required" });
    const data = await Apk4Free.searchAndDownload(query);
    res.json(data);
});

         
const kamu3 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36";
function halahMbuh() {
    const entahlah = Math.round(Math.random() * 100000000000) + "";
    const IntinyaInti = (() => {
        let kntl = [];
        for (let i = 0; i < 64; i++) {
            kntl[i] = 0 | 4294967296 * Math.sin(i + 1 % Math.PI);
        }
        return function (jmbt) {
            let puki, halah, iwak, ayam = [puki = 1732584193, halah = 4023233417, ~puki, ~halah], rizky = [], iyadeh = unescape(encodeURI(jmbt)) + "\u0080", bngst = iyadeh.length;
            jmbt = --bngst / 4 + 2 | 15;
            rizky[--jmbt] = 8 * bngst;
            for (let i = 0; i < jmbt; i++) {
                for (bngst = ayam; 64 > i; bngst = [iwak = bngst[3], puki + ((iwak = bngst[0] + [puki & halah | ~puki & iwak, iwak & puki | ~iwak & halah, puki ^ halah ^ iwak, halah ^ (puki | ~iwak)][i >> 4] + kntl[i] + ~~rizky[jmbt | [i, 5 * i + 1, 3 * i + 5, 7 * i][i >> 4] & 15]) << (i = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][4 * i + i++ % 4]) | iwak >>> -i), puki, halah]) {
                    puki = bngst[1] | 0;
                    halah = bngst[2];
                }
                for (let j = 4; j; ) {
                    ayam[--j] += bngst[j];
                }
            }
            return ayam.map(a => ("00000000" + (a >>> 0).toString(16)).slice(-8)).join("").split("").reverse().join("");
        };
    })();
    return 'tryit-' + entahlah + '-' + IntinyaInti(kamu3 + IntinyaInti(kamu3 + IntinyaInti(kamu3 + entahlah + 'suditya_is_a_smelly_hacker')));
}

async function deepaiAPI(prompt, endpoint) {
    try {
        const apiKey = "7f831cb9-aa30-4270-bfa6-0a5d4d03afac";
        let body;

        if (endpoint === "api/chat") {
            body = `------WebKitFormBoundaryChatGPT
Content-Disposition: form-data; name="text"

${prompt}
------WebKitFormBoundaryChatGPT--`;
        } else if (endpoint === "api/text2img") {
            body = `------WebKitFormBoundaryDeepAI
Content-Disposition: form-data; name="text"

${prompt}
------WebKitFormBoundaryDeepAI
Content-Disposition: form-data; name="image_generator_version"

hd
------WebKitFormBoundaryDeepAI--`;
        } else if (endpoint === "generate_video") {
            body = `------WebKitFormBoundaryVideoAI
Content-Disposition: form-data; name="textPrompt"

${prompt}
------WebKitFormBoundaryVideoAI
Content-Disposition: form-data; name="dimensions"

{"width":1024,"height":1024}
------WebKitFormBoundaryVideoAI--`;
        } else {
            return { error: "Invalid endpoint" };
        }

        const response = await fetch(`https://api.deepai.org/${endpoint}`, {
            method: "POST",
            headers: {
                "accept": "*/*",
                "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "api-key": apiKey,
                "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryDeepAI",
                "user-agent": kamu3,
            },
            body: body
        });

        return await response.json();
    } catch (error) {
        console.error("Error generating:", error);
        return null;
    }
}


app.get("/deepai/chat", async (req, res) => {
    const { prompt } = req.query;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    const result = await deepaiAPI(prompt, "api/chat");
    res.json(result);
});

app.get("/deepai/image", async (req, res) => {
    const { prompt } = req.query;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    const result = await deepaiAPI(prompt, "api/text2img");
    res.json(result);
});

app.get("/deepai/video", async (req, res) => {
    const { prompt } = req.query;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    const result = await deepaiAPI(prompt, "generate_video");
    res.json(result);
});


const voidi = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://ytmp3.mobi/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
};

const MP3_QUALITIES = ["128", "192", "256", "320"];
const MP4_QUALITIES = ["360", "480", "720", "1080"];
app.get("/yt/ytdl", async (req, res) => {
    try {
        const query = req.query.q;
        let format = req.query.format || "mp3"; 
        let quality = req.query.quality || (format === "mp3" ? "320" : "720");
        if (!query) return res.status(400).json({ error: "Query is required" });
        if (!["mp3", "mp4"].includes(format)) return res.status(400).json({ error: "mp3 or mp4" });
        if (format === "mp3" && !MP3_QUALITIES.includes(quality)) {
            return res.status(400).json({ error: `Invalid_quality: ${MP3_QUALITIES.join(", ")}` });
        }
        if (format === "mp4" && !MP4_QUALITIES.includes(quality)) {
            return res.status(400).json({ error: `Invalid q: ${MP4_QUALITIES.join(", ")}` });
        }

        const getSearch = await ytSearch(query);
        if (!getSearch.videos.length) return res.status(404).json({ error: "Not_found" });
        const video = getSearch.videos[0]; 
        const _id_ = video.videoId;
        const title = video.title; 
        const thumbnail = `https://i.ytimg.com/vi/${_id_}/hqdefault.jpg`; 
        const initialResponse = await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { voidi });
        const init = await initialResponse.json();
        if (!init || !init.convertURL) {
            console.error("Initialization failed:", init);
            return res.status(500).json({ error: "Failed to initialize conversion" });
        }

        const convertURL = `${init.convertURL}&v=${_id_}&f=${format}&q=${quality}&_=${Math.random()}`;
        const convertResponse = await fetch(convertURL, { voidi });
        const convert = await convertResponse.json();
        if (!convert || !convert.downloadURL) {
            console.error("Conversion failed:", convert);
            return res.status(500).json({ error: "Failed to convert video" });
        }

      res.json({
            title: title,
            format: format,
            quality: quality,
            thumbnail: thumbnail,
            ytdl_dl: convert.downloadURL,
            creator: "naxordeve"
        });

    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});


const headars = {
    "accept": "*/*",
    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://id.ytmp3.mobi/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
};

async function fetchYouTubeDownloadLink(url, format = 'mp3') {
    const initialResponse = await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headars });
    const init = await initialResponse.json();
    const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
    if (!id) throw new Error('Invalid YouTube URL');
    const convertURL = `${init.convertURL}&v=${id}&f=${format}&_=${Math.random()}`;
    const convertResponse = await fetch(convertURL, { headars });
    const convert = await convertResponse.json();
    let info = {};
    for (let i = 0; i < 3; i++) {
        const progressResponse = await fetch(convert.progressURL, { headars });
        info = await progressResponse.json();
        if (info.progress === 3) break;
        await new Promise(resolve => setTimeout(resolve, 1000));  
    }

    return {
        url: convert.downloadURL,
        title: info.title
    };
}

app.get('/youtube', async (req, res) => {
    const { url, format } = req.query;
    if (!url) {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
    }try{
    const result = await fetchYouTubeDownloadLink(url, format || 'mp3');
    res.json(result);
    } catch (err) {
        res.status(500).json({ details: err.message });
    }});

class MediaScraper {
  async parseMediaResults(media) {
    return media.map(item => {
      const {
        quality,
        size,
        link
      } = item;
      const baseUrl = "https://9xbuddy.online";
      let formattedLink = link;
      if (link.startsWith("//")) {
        formattedLink = `https:${link}`;
      } else if (!link.startsWith("https:")) {
        formattedLink = `${baseUrl}${link}`;
      }
      return {
        quality: quality.split("Extract")[0].trim().replace("Download Now", ""),
        size: size === "-" ? "Unknown" : size,
        link: formattedLink
      };
    });
  }

  async scrapeData(url) {
    let mediaResults = [];
    let info = {};
    while (mediaResults.length === 0) {
      try {
        const { data } = await axios.get(`https://${process.env.DOMAIN_URL}/api/tools/web/html/v1?url=https://9xbuddy.online/process?url=${encodeURIComponent(url)}`, {
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        const $ = cheerio.load(data);
        info = {
          title: $("div.text-gray-500.dark\\:text-gray-200").first().text().trim(),
          uploader: $("p:contains('Uploader') span.text-blue-500").text().trim(),
          duration: $("p:contains('Duration') span.text-blue-500").text().trim()
        };
        const results = [];
        $("div.lg\\:flex.lg\\:justify-center.items-center").each((_, el) => {
          const [quality, size, link] = [$(el).find("div:nth-child(2)").text().trim(), $(el).find("div:nth-child(3)").text().trim(), $(el).find("a").attr("href")];
          if (quality && size && link) results.push({ quality, size, link });
        });
        if (results.length > 0) {
          mediaResults = await this.parseMediaResults(results);
        }
      } catch (em) {
        console.error("Error:", em.message);
        break;
      }
    }
    return { media: mediaResults, info };
  }
}


const mediaScraper = new MediaScraper();
app.get("/9xbuddy", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }try {
    const data = await mediaScraper.scrapeData(url);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to scrape data" });
  }
});


const enc = (text) => {
  const key = "qwertyuioplkjhgf";
  const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
  return cipher.update(text, "utf8", "hex") + cipher.final("hex");
};

async function toINSTA(url) {
  try {
    const { data } = await axios.get("https://backend.instavideosave.com/allinone", {
      headers: {
        Accept: "*/*",
        Origin: "https://instavideosave.net",
        Referer: "https://instavideosave.net/",
        "User-Agent": fakeUserAgent(),
        Url: enco(url),
      },
    });
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
}

app.get('/instagram', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing insta url" });
  try { const result = await toINSTA(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const toKEY = "35c9046f7cmshd2db25369e25f75p1cf84ejsn4d95e7ba9240";
const voidii = "https://youtube-video-download-info.p.rapidapi.com/dl";
async function download(url, type = "mp3") {
  const toAudi = type === "mp3" ? "https://youtube-mp3-download1.p.rapidapi.com/dl" : voidii;
  try { const res = await axios.get(toAudi, {
      params: { id: url },
      headers: {
        "x-rapidapi-key": toKEY,
        "x-rapidapi-host": type === "mp3" ? "youtube-mp3-download1.p.rapidapi.com" : "youtube-video-download-info.p.rapidapi.com"
      }
    });
    return res.data;
  } catch (error) {
    throw new Error("err");
  }
}

app.get('/yt-download', async (req, res) => {
  const { id, type } = req.query;
  if (!id) return res.status(400).json({ error: "Missing yt url" });
  try { const result = await download(id, type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
const baseUrlll = "https://ytdlp.online/stream";
const heade = {
    accept: "text/event-stream",
    "accept-language": "id-ID,id;q=0.9",
    "cache-control": "no-cache",
    priority: "u=1, i",
    "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24", "Microsoft Edge Simulate";v="131", "Lemur";v="131"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
};

const fetchStream = async (ytUrl, type = "best") => {
    const format = type === "mp3"
        ? "-x --audio-format mp3"
        : type === "best"
            ? "-f bestvideo+bestaudio"
            : type === "url"
                ? "--get-url"
                : "-f bestvideo+bestaudio";

    const params = new URLSearchParams({
        command: encodeURIComponent(`${format} ${ytUrl}`)
    });
    try {
        const response = await axios.get(`https://api.allorigins.win/raw?url=${baseUrlll}?${params.toString()}`, {
            heade
        });
        return parseResponse(response.data);
    } catch (error) {
        console.error("Error fetching stream:", error);
        throw error;
    }
};

const parseResponse = (data) => {
    const lines = data.split("\n");
    const downloadLinkLine = lines.find(line => line.includes('<a href="/download/'));
    const statusLine = lines.find(line => line.includes("data: [youtube]"));
    const response = {};
    if (downloadLinkLine) {
        const regex = /href="([^"]+)"/;
        const match = downloadLinkLine.match(regex);
        if (match && match[1]) {
            response.downloadUrl = `https://ytdlp.online${match[1]}`;
        }
    }

    if (statusLine) {
        const status = statusLine.split(":")[1]?.trim();
        response.status = status || "Unknown status";
    }
    const fileInfoLine = lines.find(line => line.includes("data: [info]"));
    if (fileInfoLine) {
        const info = fileInfoLine.split(":")[1]?.trim();
        response.fileInfo = info || "File info not found";
    }
    if (Object.keys(response).length === 0) {
        response.error = "No relevant data found in the response.";
    }
    return response;
};

app.get('/youtubee', async (req, res) => {
    const { url, type } = req.query;
    if (!url) {
        return res.status(400).json({ error: "Missing 'url' query parameter" });
    }try{
        const result = await fetchStream(url, type || 'best');
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

*/
      /*
class YouTuberDownloader {
  constructor() {
    this.gC = {
      0: "NywyOCw2LDUzLDM4LDU1LDM4LDYxLDgsMjYsMTksMjEsMjUsMjksMzQsNDEsOCwzMiw4LDM1LDM1LDQ5LDI4LDI2LDIwLDI0LDUyLDQ2LDY2LDQ5LDE2LDU5LDM1LDM0LDQ2LDUyLDU5LDQ1LDYxLDIxLDk=",
      1: "IrHUN6Xe07oKmLT5SihqEOuckvDY8Vsf42MFGwP9JCdzZxylbApjRQn1taB3gW",
      f: ["0", "", 1, 36, 5, 1, ","],
      r: ["youtube-mp36.p.", "3fb448bb80mshb8219b06208d8c8p179be5jsndaed67c1144f"]
    };
    this.gA = 0;
    this.gVideo = false;
  }
  atobSafe(str) {
    return Buffer.from(str, "base64").toString("utf-8");
  }
  k(e) {
    const data = this.atobSafe(this.gC["0"]).split(this.gC.f[6]);
    const reversed = this.gC["1"].split("").reverse().join("");
    for (let t = 0; t < data.length; t++) {
      e += reversed[data[t] - this.gC.f[4]];
    }
    return this.gC.f[2] === 1 ? e.toLowerCase() : this.gC.f[2] === 2 ? e.toUpperCase() : e;
  }
  async api(videoId) {
    this.gA = 1;
    const endpoint = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}&_=${Math.random()}`;
    const headers = {
      "x-rapidapi-host": this.gC.r[0] + "rapidapi.com",
      "x-rapidapi-key": this.gC.r[1]
    };
    try {
      const response = await axios.get(endpoint, {
        headers: headers
      });
      const data = response.data;
      if (data.status === "ok") {
        return {
          title: data.title,
          link: data.link
        };
      } else if (data.status === "processing") {
        return this.api(videoId);
      } else {
        throw new Error("Failed to process video.");
      }
    } catch (error) {
      throw new Error("API request failed.");
    }
  }
  async processVideo(url) {
    const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
    if (!match) throw new Error("Invalid YouTube URL.");
    this.gVideo = match[1];
    return await this.api(this.gVideo);
  }
  async download(youtubeUrl) {
    try {
      const result = await this.processVideo(youtubeUrl);
      return result;
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

app.get('/tomp3', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "missing yt url lol" });
  let ytv = new YoutuberDownloader();
  try { const result = await ytv.download(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/


  






/*
 const BASE_URLL = "https://9xbuddy.com/";
 const URL_TOKEN = "https://ab1.9xbud.com/token";
 const URL_EXTRACT = "https://ab1.9xbud.com/extract";
 const URL_CONVERT = "https://ab1.9xbud.com/convert";  
const REG_DATA = /window.__INIT__\s?=\s?(.*);?<\/script>/;
 let FULL_DATA = {};
const headList = {
  "authority": "ab1.9xbud.com",
  "accept": "application/json, text/plain, ",
  "accept-encoding": "gzip",
  "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
  "content-type": "application/json; charset=UTF-8",
  "origin": "https://9xbuddy.com",
  "priority": "u=1, i",
  "referer": "https://9xbuddy.com/",
  "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "cross-site",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
  "x-requested-domain": "9xbuddy.com",
  "x-requested-with": "xmlhttprequest"
};

async function fetchContent(url, method = "GET", data = null) {
  return await fetch(url, {
    method,
    headers: headList,
    ...(data ? { body: data } : {})
  });
}

 async function initData() {
  const rs = await fetchContent(BASE_URLL);
  const txt = await rs.text();
  const mt = txt.match(REG_DATA)[1];
  FULL_DATA = JSON.parse(mt);
}

async function encode64(str) {
  return Buffer.from(str, "binary").toString("base64");
}

async function decode64(str) {
  return Buffer.from(str, "base64").toString("binary");
}

async function getToken() {
  const tk = await fetchContent(URL_TOKEN, "POST", JSON.stringify({}));
  const tx = await tk.json();
  return tx.access_token;
}

async function getDataToken(url) {
  await initData();
  const encodedUrl = encodeURIComponent(url);
  const authToken = await syntx();
  headList["x-auth-token"] = authToken;
  const accessToken = await getToken();
  headList["x-access-token"] = accessToken;
  const _sig = encode64(`${encodedUrl}${authToken}jv7g2_DAMNN_DUDE`);

  return { authToken, _sig, accessToken, encodedUrl };
}

async function getInfo(url) {
  const dt = await getDataToken(url);
  const payload = { url: dt.encodedUrl, _sig: dt._sig, searchEngine: "yt" };
  const rs = await fetchContent(URL_EXTRACT, "POST", JSON.stringify(payload));
  const jsn = await rs.json();
  return { data: jsn, dt };
}

async function Buddy(url) {
  try {
    const info = await getInfo(url);
    let decLink = info.data;

    for (let i = 0; i < decLink.response.formats.length; i++) {
      decLink.response.formats[i].url = decode64(decLink.response.formats[i].url);
    }

    return decLink;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { error: "Could not process the link" };
  }
}

app.get("/9xBuddy", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL parameter" });
  try {
    const data = await Buddy(url);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to process request" });
  }
});

*/

class TubidyScraper {
    constructor() {
        this.baseURL = 'https://tubidy.cool';
    }

    fixUrl(url) {
        return !url ? '' : url.startsWith('//') ? `https:${url}` : url.startsWith('http') ? url : `${this.baseURL}${url}`;
    }

    async search(query) {
        try {
            const { data } = await axios.get(`${this.baseURL}/search.php?q=${encodeURIComponent(query)}`);
            const $ = cheerio.load(data);
            return $('.list-container .media').map((_, el) => ({
                title: $(el).find('.media-body a').first().text().trim(),
                duration: $(el).find('.video-search-footer li').first().text().replace('Duration: ', '').trim(),
                thumbnail: this.fixUrl($(el).find('.media-left img').attr('src')),
                link: this.fixUrl($(el).find('.media-body a').first().attr('href'))
            })).get();
        } catch (error) {
            console.error('Search Error:', error);
            return [];
        }
    }

    async detail(url) {
        try {
            const { data } = await axios.get(this.fixUrl(url));
            const $ = cheerio.load(data);
            const title = $('.video-title-selected').text().replace(/\n/g, ' ').trim() || 'No Title';
            const duration = $('.video-title-selected span').text().replace(/[()]/g, '').trim() || '0:00';
            const thumbnail = this.fixUrl($('.donwload-box .text-center img').attr('src'));
            const downloadLinks = $('.list-group-item a').map((_, el) => this.fixUrl($(el).attr('href'))).get();

            const downloads = [];
            for await (const link of downloadLinks) {
                const data = await this.fetchDownload(link);
                if (data) downloads.push(...data);
            }

            return { title, duration, thumbnail, media: downloads.filter((v, i, arr) => arr.findIndex(x => x.link === v.link && !v.link.includes('send')) === i) };
        } catch (error) {
            console.error('Detail Error:', error);
            return {};
        }
    }

    async fetchDownload(url) {
        try {
            const { data } = await axios.get(this.fixUrl(url));
            const $ = cheerio.load(data);
            return $('#donwload_box .list-group-item.big a').map((_, el) => ({
                type: $(el).text().trim().split(' ')[0].toLowerCase(),
                size: $(el).find('.mb-text').text().trim() || 'Unknown',
                link: this.fixUrl($(el).attr('href'))
            })).get().filter((v, i, arr) => arr.findIndex(x => x.link === v.link && !v.link.includes('send')) === i);
        } catch (error) {
            console.error('Fetch Download Error:', error);
            return null;
        }
    }
}

const scraper = new TubidyScraper();
app.get('/tubidy/search', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Missing query parameter "q"' });
    const results = await scraper.search(q);
    res.json(results);
});

app.get('/tubidy/dl', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'Missing query parameter "url"' });
    const details = await scraper.detail(url);
    res.json(details);
});

                
async function aoyo(content) {
  try {
    const response = await fetch("https://aoyo.ai/Api/AISearch/AISearch", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36",
        Referer: `https://aoyo.ai/search/?q=${content}&t=${Date.now()}`
      },
      body: new URLSearchParams({ content })
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.text();
    const extractJson = text => {
      const startIndex = text.indexOf("[START]");
      if (startIndex === -1) throw new Error("[START] not found");
      return JSON.parse(text.substring(startIndex + 7).trim());
    };

    return extractJson(data)?.data?.Response || "No response";
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

app.get("/aoyo", async (req, res) => {
  const { prompt } = req.method === "GET" ? req.query : req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing 'prompt' parameter" });}
  const result = await aoyo(query);
  if (!result) {
    return res.status(500).json({ error: "Failed to fetch data" });}
  res.json({ response: result });
});

const upload = multer({ storage: multer.memoryStorage() });
async function freeImage(content) {
  const spinner = ora("Uploading to FreeImage.host").start();
  try {
    const apiKey = "6d207e02198a847aa98d0a2a901485a5";
    const uploadUrl = "https://freeimage.host/api/1/upload";
    const formData = new FormData();
    formData.append("key", apiKey);
    formData.append("action", "upload");
    formData.append("source", content.toString("base64"));
    const response = await axios.post(uploadUrl, formData, {
      headers: formData.getHeaders(),
    });
    spinner.succeed(chalk.green("Uploaded to FreeImage.host"));
    return response.data?.image?.url || response.data?.image?.image?.url;
  } catch (error) {
    spinner.fail(chalk.red("Upload failed"));
    console.error(error);
    return null;
  }
}


app.post("/api/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });}
  const imageUrl = await freeImage(req.file.buffer);
  if (!imageUrl) {
    return res.status(500).json({ error: "Failed to upload image" });
  }
  res.json({ url: imageUrl });
});


const API = {
  search: "https://lrclib.net/api/search"
};

const HEADERSS = {
  "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  Referer: "https://lrclib.net"
};

async function searchLyrics(query) {
  if (!query) throw new Error("Query parameter is required.")
  const url = `${API.search}?q=${encodeURIComponent(query)}`;
  try {
    const { data } = await axios.get(url, { headers: HEADERSS });
    if (!data.length) throw new Error("No lyrics found.")
    return data.map(item => ({
      id: item.id,
      trackName: item.trackName,
      artistName: item.artistName,
      albumName: item.albumName,
      duration: item.duration,
      instrumental: item.instrumental,
      plainLyrics: item.plainLyrics,
      details: item
    }));
  } catch (error) {
    throw new Error(`Error fetching lyrics: ${error.message}`);
  }
}

app.get("/api/lyrics", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Missing query parameter 'q'" });
  }try {
    const result = await searchLyrics(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const url = "https://tikvideo.app/api/ajaxSearch";
const headers = {
  accept: "*/*",
  "accept-language": "id-ID,id;q=0.9",
  "cache-control": "no-cache",
  "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  cookie: "__gads=ID=842f2dfb12f8b25e:T=1738578005:RT=1738578005:S=ALNI_MbOp6qVQRGTFsEgIhcjQ_xcJCCnuw;",
  origin: "https://tikvideo.app",
  pragma: "no-cache",
  priority: "u=1, i",
  referer: "https://tikvideo.app/id",
  "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24"',
  "sec-ch-ua-mobile": "?1",
  "sec-ch-ua-platform": '"Android"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  "x-requested-with": "XMLHttpRequest"
};

async function fetchTikVideo(query) {
  try {
    const data = new URLSearchParams();
    data.append("q", query);
    data.append("lang", "id");
    data.append("cftoken", "");
    const response = await axios.post(url, data, { headers });
    const $ = cheerio.load(response.data.data);
    return $(".video-data .tik-video")
      .map((_, el) => ({
        thumbnail: $(el).find(".thumbnail img").attr("src") || "",
        title: $(el).find(".content h3").text() || "No Title",
        download: $(el).find(".dl-action a")
          .map((_, em) => ({
            title: $(em).text().trim() || "No Label",
            link: $(em).attr("href") || "#"
          }))
          .get()
      }))
      .get()[0];
  } catch (error) {
    console.error("Error fetching TikVideo:", error.message);
    return null;
  }
}


app.get("/tiktok/v3", async (req, res) => {
  const {url} = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing url parameter 'url'" });
  }
  const result = await fetchTikVideo(url);
  if (result) {
    res.json(result);
  } else {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});


const BASE_URL = "https://reelsdownloader.socialplug.io/api/instagram_reels_downloader";
const HEADERS = {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  Referer: "https://www.socialplug.io/free-tools/instagram-reels-downloader"
};

const downloadReels = async (url) => {
  const response = await axios.post(BASE_URL, { url }, { headers: HEADERS });
  return response.data || null;
};



app.get("/insta_reels", async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: "URL parameter is required!" });
  }

  try {
    const data = await downloadReels(url);
    if (!data) throw new Error("No download URL found");
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: "Failed to download the Instagram Reel." });
  }
});


const downloadTikTok = async (videoUrl) => {
    try {
        const response = await fetch("https://tiktokio.com/api/v1/tk-htmx", {
            method: "POST",
            headers: {
                "HX-Request": "true",
                "HX-Trigger": "search-btn",
                "HX-Target": "tiktok-parse-result",
                "HX-Current-URL": "https://tiktokio.com/id/",
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
                Referer: "https://tiktokio.com/id/"
            },
            body: new URLSearchParams({
                prefix: "dtGslxrcdcG9raW8uY29t",
                vid: videoUrl
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const html = await response.text();
        const $ = cheerio.load(html);

        const results = $(".tk-down-link a")
            .map((_, el) => ({
                text: $(el).text(),
                url: $(el).attr("href"),
                quality: $(el).text().includes("(HD)") ? "HD" : "Normal"
            }))
            .get()
            .filter(v => v.url.startsWith("https"));

        return { medias: results };
    } catch (error) {
        console.error("Error in downloadTikTok:", error);
        throw error;
    }
};


app.get('/ttdl', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'TikTok URL is required' });
    }try {
        const data = await downloadTikTok(url);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



/*
const tiktokDl = async (url) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
            ],
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
        });

        await page.goto('https://tiktokdl.app/', { waitUntil: 'networkidle2' });
        const inputSelector = 'input[name="url"]';
        await page.waitForSelector(inputSelector);
        await page.type(inputSelector, url);
        const submitButtonSelector = '.splash-search-button';
        await page.click(submitButtonSelector);
        await page.waitForSelector('.splash-video-wrapper', { visible: true });
        const video = await page.$$eval('.splash-video a[data-extension="mp4"]', links =>
            links.map(link => ({
                url: link.href,
                size: link.getAttribute('data-size') || 'Unknown'
            })).filter(video => video.size !== 'Unknown')
        );

        const author = await page.$eval('.splash-video h2', el => el.textContent.trim());
        const audio = await page.$eval('.splash-video a[data-extension="mp3"]', el => el.href);
        const caption = await page.$eval('.splash-video p', el => el.textContent.trim());
        await browser.close();
        return { caption, author, video, audio };
    } catch (error) {
        throw new Error(error)
    }
};

app.get('/tiktok/v2', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }
  const result = await tiktokDl(url);
  if (result.error) {
    return res.status(500).json(result);
  }
  return res.json(result);
});
*/

const tiktokDl = async (url) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
            ],
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
        });

        await page.goto('https://tiktokdl.app/', { waitUntil: 'networkidle2' });
        const inputSelector = 'input[name="url"]';
        await page.waitForSelector(inputSelector);
        await page.type(inputSelector, url);
        const submitButtonSelector = '.splash-search-button';
        await page.click(submitButtonSelector);
        await page.waitForSelector('.splash-video-wrapper', { visible: true });

        const video = await page.$$eval('.splash-video a[data-extension="mp4"]', links =>
            links.map(link => ({
                url: link.href,
                size: link.getAttribute('data-size') || 'Unknown'
            })).filter(video => video.size !== 'Unknown')
        );

        const author = await page.$eval('.splash-video h2', el => el.textContent.trim());
        const audio = await page.$eval('.splash-video a[data-extension="mp3"]', el => el.href);
        const caption = await page.$eval('.splash-video p', el => el.textContent.trim());

        await browser.close();
        return { caption, author, video, audio };
    } catch (error) {
        throw new Error(error.message);
    }
};


app.get('/ttdll', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'TikTok URL is required' });
    }try {
        const data = await tiktokDl(url);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



const getFileSize = async(url) => {
    try {
        const response = await axios.head(url);
        return parseInt(response.headers['content-length']);
    } catch (error) {
        console.error(error.message);
        return 0;
    }
}
const bytesToSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
const apk_search = async(args) => {
  try {
      let res = await axios.get(`http://ws75.aptoide.com/api/7/apps/search?query=${args}`);
      if(res.data.datalist.list.length === 0){
        return { author: 'naxor', message: 'No Results Found' };
      }
      let ress = res.data.datalist.list.map(v => ({
          name: v.name,
          id: v.package
      }));
      return { author: 'naxor', apps: ress };
  } catch (error) {
      console.error(error.message);
      return { author: 'naxor', message: 'Err' };
  }
}

const apk_download = async(id) => {
    try {
        let res = await axios.get(`http://ws75.aptoide.com/api/7/apps/search?query=${id}&limit=1`);
        if (res.data.datalist.list.length === 0) {
          return { author: 'naxor', message: 'No Results Found' };
        }
        let { name, package: pkg, icon, file, updated } = res.data.datalist.list[0];
        let dllink = file.path;
        let lastup = updated;
        let bytes = await getFileSize(dllink);
        let size = bytesToSize(bytes);
        return {
            author: 'naxor',
            name,
            lastup,
            package: pkg,
            size,
            icon,
            dllink
        };
    } catch (error) {
      console.log(error);
      return { author: 'naxor', message: 'Error' };
    }
}
app.get('/apk_s/query', async (req, res) => {
    const query = req.params.query;
    const result = await apk_search(query);
    res.json(result);
});
app.get('/apk_dl/id', async (req, res) => {
    const id = req.params.id;
    const result = await apk_download(id);
    res.json(result);
});

async function ttdl(url) {
  try {
    const data = qs.stringify({
      url: url,
      count: 12,
      cursor: 0,
      web: 1,
      hd: 1
    });

    const response = await axios.post('https://tikwm.com/api/', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (response.data.code === 0) {
      const videoData = response.data.data;
      return {
        author: "naxor",
        status: 200,
        data: {
          id: videoData.id,
          title: videoData.title,
          cover: `https://tikwm.com${videoData.cover}`,
          playUrl: `https://tikwm.com${videoData.play}`,
          hdPlayUrl: `https://tikwm.com${videoData.hdplay}`,
          musicUrl: `https://tikwm.com${videoData.music}`,
          musicTitle: videoData.music_info.title,
          musicAuthor: videoData.music_info.author,
          playCount: videoData.play_count,
          diggCount: videoData.digg_count,
          commentCount: videoData.comment_count,
          shareCount: videoData.share_count,
          downloadCount: videoData.download_count,
          avatar: `https://tikwm.com${videoData.author.avatar}`,
          nickname: videoData.author.nickname,
          isAd: videoData.is_ad,
        }
      };
    } else {
      throw new Error('Failed to fetch video data');
    }
  } catch (error) {
    console.error('Error in scraping video:', error);
    return { error: 'Error fetching video data' };
  }
}

app.get('/tiktok', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }
  const result = await ttdl(url);
  if (result.error) {
    return res.status(500).json(result);
  }
  return res.json(result);
});


async function igdl(url) {
  try {
    const requestData = qs.stringify({ url });
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      Referer: "https://instasave.website/download",
    };
    const response = await axios.post("https://api.instasave.website/media", requestData, { headers });
    if (response.status === 200) {
      const html = response.data;
      const urls = [];
      const regex = /https:\/\/[a-zA-Z0-9./?=_-]+/g;
      let match;
      while ((match = regex.exec(html)) !== null) {
        urls.push(match[0]);
      }
      return {
        creator: "naxor",
        status: 200,
        data: urls,
      };
    } else {
      return {
        creator: "naxor",
        status: response.status,
        data: [],
      };
    }
  } catch (error) {
    return {
      creator: "naxor",
      status: 500,
      data: [],
    };
  }
}


app.get("/instagram", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({
      creator: "naxor",
      status: 400,
      error: "url is required as a query parameter",
    });
  }
  const result = await igdl(url);
  res.status(result.status).json(result);
});


const fbdl = async (videoUrl) => {
  const apiUrl = "https://v3.fdownloader.net/api/ajaxSearch?lang=en";
  const requestData = qs.stringify({
    k_exp: "1732847386",
    k_token: "23919191f2d6ca1d8062299f5ca2548c2aec728ee10e9400dba7046b9ee0a978",
    q: videoUrl,
    lang: "en",
    web: "fdownloader.net",
    v: "v2",
    w: "",
  });

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "*/*",
      },
    });
    if (response.data.status === "ok" && response.data.data) {
      const html = response.data.data;
      const downloadLinks = {};
      const matches = [...html.matchAll(/<a href="([^"]+)"[^>]*title="Download ([^"]+)"/g)];
      for (const match of matches) {
        const url = match[1];
        const resolution = match[2];
        downloadLinks[resolution] = url;
      }
      return {
        author: "naxor",
        status: 200,
        data: downloadLinks,
      };
    }
    return {
      author: "naxor",
      status: 400,
      message: "No download links found.",
    };
  } catch (error) {
    return {
      author: "naxor",
      status: 500,
      error: error.message,
    };
  }
};

app.get("/facebook", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({
      author: "naxor",
      status: 400,
      error: "url is required as a query parameter",
    });
  }
  const result = await fbdl(url);
  res.status(result.status).json(result);
});  

app.get('/mediafire', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }try {
    const downloadInfo = await mediafire(url);
    return res.json(downloadInfo);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});
async function mediafire(url) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Linux; Android 6.0; iris50) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36',
  });
  const page = await context.newPage();
  try {
    await page.goto(url);
    let downloadInfo = await page.evaluate(() => {
      const fileNameElement = document.querySelector('.dl-btn-label');
      const fileName = fileNameElement ? fileNameElement.textContent.trim() : '';
      const downloadLinkElement = document.querySelector('#downloadButton');
      const downloadLink = downloadLinkElement ? downloadLinkElement.href : '';
      const fileSizeText = downloadLinkElement ? downloadLinkElement.textContent : '';
      const sizeMatch = fileSizeText.match(/\(([^)]+)\)/);
      const fileSize = sizeMatch ? sizeMatch[1] : '';
      const metaTags = Array.from(document.querySelectorAll('meta')).reduce((acc, meta) => {
        const name = meta.getAttribute('name') || meta.getAttribute('property');
        const content = meta.getAttribute('content');
        if (name && content) acc[name.split(':')[1]] = content;
        return acc;
      }, {});

      return {
        fileName,
        downloadLink,
        fileSize,
        meta: metaTags,
      };
    });

    if (!downloadInfo.downloadLink.startsWith('https://down')) {
      await browser.close();
      const newBrowser = await chromium.launch({ headless: true });
      const newContext = await newBrowser.newContext({
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0; iris50) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36',
      });
      const newPage = await newContext.newPage();
      await newPage.goto(downloadInfo.downloadLink);
      const updatedInfo = await newPage.evaluate(() => {
        const downloadLink = document.querySelector('#downloadButton')?.href || '';
        return { downloadLink };
      });

      downloadInfo.downloadLink = updatedInfo.downloadLink;
      await newBrowser.close();
    }

    return downloadInfo;
  } catch (error) {
    console.error('Error:', error.message);
    return { success: false, message: error.message };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

app.get('/ytdl', async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).send('Parameter "id" is required.');
  }
  try {
    const response = await fetch(`https://api.allorigins.win/raw?url=https://ytdlp.online/stream?command=https://www.youtube.com/watch?v=${id} --get-url`, {
            timeout: 1000,
            cache: 'no-store'
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const responseText = await response.text();
        const urls = responseText.split('\n')
            .filter(line => line.trim().startsWith('data:'))
            .map(line => line.substring(5).trim())
            .filter(url => url.startsWith('http'));
    res.json({ data: urls });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while processing the request.');
  }
});

app.get('/yts/search', async (req, res) => {
  const { query, limit = 5 } = req.query;
  if (!query) return res.status(400).json({ error: '"query" is required' });
  try {
    const result = await ytSearch(query);
    if (!result.videos || result.videos.length === 0) {
      return res.status(404).json({ error: 'No results found.' });
    }
    const cos = levenshtein;
    const videosWithSimilarity = result.videos.map(video => {
      const videoId = video.url.split('v=')[1];
      return {
        id: videoId,
        title: video.title,
        url: video.url,
        duration: video.timestamp,
        views: video.views,
        uploaded: video.ago,
        author: video.author.name,
        similarity: 1 - (cos(query, video.title) / Math.max(query.length, video.title.length)) 
      };
    });

    const sortedVideos = videosWithSimilarity.sort((a, b) => b.similarity - a.similarity).sort((a, b) => b.views - a.views);
    const topVideos = sortedVideos.slice(0, parseInt(limit));
    res.json({ query, limit: parseInt(limit), videos: topVideos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch YouTube search results.' });
  }
});

app.get('/ace', async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).send('"id" is required.');
  }try {
    const apiUrl = `https://www.acethinker.com/downloader/api/video_info.php?url=https://www.youtube.com/watch?v=${id}&israpid=1&ismp3=0`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('AceThinker API request failed');
    const processedData = await response.json();
    res.json(processedData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while processing the request.');
  }
});

const genSpinner = () => Math.random().toString(36).substring(2, 10);
app.get("/y232", async (req, res) => {
    const id = req.query.id;
  if (!id) {
    return res.status(400).send('"id" is required.');
  } try {
    const spinnerid = genSpinner();
    const socket = io("https://api.y232.live");
    const data = { url: `https://www.youtube.com/watch?v=${id}`, spinnerid, method: "streams" };
    socket.emit("getInfoEvent", data);
    socket.on("done", (response) => {
        res.status(200).send(response);
        socket.close();
    });
    socket.on("error", (err) => {
        res.status(500).send({ success: false, error: err.message });
        socket.close();
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while processing the request.');
  }

});

const PORT = process.env.PORT || 7860;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
});
process.on('SIGINT', async () => {
    process.exit(0);
});