import React, { Fragment, useState, useEffect } from "react";
import { main } from "./../../../wiki_parser";
import Content from "./../Content";
import Menu from "./../Menu";
import Navigation from "./../Navigation";
import "lazysizes";
import useFetch from "./../../../hooks/useFetch.js";

// import Sidebar from "./../SideBar";
// import Reference from "./../Reference";

export const ImagesContext = React.createContext(null);

const titles = [
  // "Pet_door"
  "New_York_City",
  "The_Last_Supper_(Leonardo)",
  "Leonardo_da_Vinci",
  "Mona_Lisa",
  "Renaissance"
];

const title = titles[Math.floor(Math.random() * titles.length)];

const parseWikiText = response => main(response?.parse?.wikitext?.["*"]);

const buildURL = params =>
  "https://en.wikipedia.org/w/api.php?" +
  new URLSearchParams({ ...params, format: "json", origin: "*" });

const pageContentParams = title => ({
  action: "parse",
  prop: "wikitext",
  page: title
});

const imageParams = (title, limit = 500) => ({
  action: "query",
  prop: "imageinfo",
  titles: title,
  generator: "images",
  gimlimit: limit,
  iiprop: "url|dimensions"
});

const summaryParams = title => ({
  action: "query",
  prop: "extracts",
  exsentences: 4,
  exintro: true,
  explaintext: true,
  redirects: 1,
  titles: title
});

const Article = () => {
  const [images, setImages] = useState(null);
  const [pageContent, setPageContent] = useState(null);

  // get pageContent
  const pageContentFetcher = useFetch(buildURL(pageContentParams(title)));

  useEffect(() => {
    setPageContent(parseWikiText(pageContentFetcher.response));
  }, [pageContentFetcher.response]);

  // get images
  const imageFetch = useFetch(buildURL(imageParams(title)));

  // const parseWikiText = response => main(response?.parse?.wikitext?.["*"]);

  useEffect(() => {
    let imgs = imageFetch.response?.query?.pages,
      res = {};
    // return object {filename: {url, width, height}}
    for (const key in imgs) {
      let { url, width, height } = imgs[key]?.imageinfo?.[0];
      res[imgs[key].title] = { url, width, height };
    }
    setImages(res);
  }, [imageFetch.response]);

  const summaryFetch = useFetch(buildURL(summaryParams(title)));

  useEffect(() => {
    console.log(summaryFetch.response);
  }, [summaryFetch.response]);

  // get references
  // useEffect(() => {
  //   if (parsed.children) {
  //     let res = [];
  //     for (const element of parsed.children) {
  //       if (element.elementName == "Reference") {
  //         res.push(element);
  //       }
  //     }
  //     setReferences(res);
  //   }
  // }, [parsed]);

  return (
    <ImagesContext.Provider value={{ images }}>
      <Fragment>
        <Menu />
        <div className="article">
          {/*<Sidebar content={parsed.images} images={images} />*/}
          <div className="hero">
            <div className="hero__title">{title.replace(/_/g, " ")}</div>
            <div className="hero__credit">
              From Wikipedia, the free encyclopedia
            </div>
            <Content content={pageContent?.children} />
            {/*<Reference {...{ references }} />*/}
          </div>
        </div>
        <Navigation headings={pageContent?.headings} />
      </Fragment>
    </ImagesContext.Provider>
  );
};

export default Article;
