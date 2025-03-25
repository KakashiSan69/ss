import axios from "axios";
import * as cheerio from "cheerio";

class InDown {
  constructor() {
    this.baseUrl = "https://indown.io";
  }

  async download(instagramLink) {
    try {
      const { data: html, headers } = await axios.get(`${this.baseUrl}/id`, { withCredentials: true });
      const cookies = headers["set-cookie"].join("; ");
      const $ = cheerio.load(html);
      const formAction = $("form#downloadForm").attr("action");
      const inputValues = Object.fromEntries(
        $("form#downloadForm input[name]")
          .get()
          .map((el) => [$(el).attr("name"), $(el).val() || ""])
      );

      inputValues.link = instagramLink;
      const { data: responseData } = await axios.post(formAction, new URLSearchParams(inputValues), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: cookies,
        },
        withCredentials: true,
      });

      return this.extractMedia(responseData);
    } catch (error) {
      console.error("Error on indown.io/id:", error);
      console.log("Attempting to fetch from indown.io/es...");
      return await this.downloadFallback(instagramLink);
    }
  }

  async downloadFallback(instagramLink) {
    try {
      const res = await axios.get(`${this.baseUrl}/es`, {
        headers: {
          Referer: `${this.baseUrl}/es`,
        },
      });

      const cookies = res.headers["set-cookie"]?.map((cookie) => cookie.split(";")[0]).join("; ") || "";
      const $ = cheerio.load(res.data);
      const _token = $('input[name="_token"]').val();
      const p = $('input[name="p"]').val();

      const { data: dlhtml } = await axios.post(
        `${this.baseUrl}/download`,
        new URLSearchParams({ referer: `${this.baseUrl}/es`, locale: "es", p, _token, link: instagramLink }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            cookie: cookies,
            Referer: `${this.baseUrl}/es`,
          },
        }
      );

      return this.extractMedia(dlhtml);
    } catch (error) {
      console.error("Error on indown.io/es:", error);
      return { status: false, msg: error.message };
    }
  }

  extractMedia(html) {
    const $ = cheerio.load(html);
    const media = [];

    $("div.mt-2.mb-2, div.mt-3").each((_, el) => {
      const buttonTitle = $(el).find(".btn.btn-outline-primary").first().text().trim().replace(/\s+/g, " ");
      const type = buttonTitle === "Descargar" ? "image" : buttonTitle.includes("Servidor") ? "video" : "";
      const href = $(el).find("a").first().attr("href");
      if (href) media.push({ type, url: href });
    });

    return media.length > 0
      ? { status: true, result: { media } }
      : { status: false, msg: "No results found." };
  }
}

export default InDown;
