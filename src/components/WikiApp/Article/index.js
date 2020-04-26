import React, { Fragment, useState, useEffect } from "react";
import { main } from "./../../../wiki_parser";
// import Sidebar from "./../SideBar";
// import Reference from "./../Reference";
import Content from "./../Content";
import Menu from "./../Menu";
import Navigation from "./../Navigation";
import "lazysizes";
<<<<<<< HEAD
import useFetch from "./../../../hooks/useFetch.js";
import Popover from "react-tiny-popover";

// import Sidebar from "./../SideBar";
// import Reference from "./../Reference";

export const ImagesContext = React.createContext(null);

const titles = [
  // "Pet_door"
=======
export const ImagesContext = React.createContext(null);

const titles = [
>>>>>>> parent of f769b01... Implement useFetch
  "New_York_City",
  "The_Last_Supper_(Leonardo)",
  "Leonardo_da_Vinci",
  "Mona_Lisa",
  "Renaissance"
];

const title = titles[Math.floor(Math.random() * titles.length)];

const Article = () => {
<<<<<<< HEAD
  const [images, setImages] = useState(null);
  const [content, setContent] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  // get content
  const contentFetch = useFetch(buildURL(contentParams(title)));

  useEffect(() => {
    setContent(parseWikiText(contentFetch.response));
  }, [contentFetch.response]);

  // get images
  const imageFetch = useFetch(buildURL(imageParams(title)));

=======
  const [images, setImages] = useState({});
  // const [references, setReferences] = useState([]);
  const [parsed, setParsed] = useState({});
  // const title = titles[Math.floor(Math.random() * titles.length)];
  // title = title || "New_York_City";
  // title = title || "The_Last_Supper_(Leonardo)";
  // title = title || "Leonardo_da_Vinci";
  // title = title || "Mona_Lisa";

  // get main content
>>>>>>> parent of f769b01... Implement useFetch
  useEffect(() => {
    var url = `https://en.wikipedia.org/w/api.php?action=parse&page=${title}&format=json&prop=wikitext&origin=*`;
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(_text => {
        let rawText = _text.parse.wikitext["*"];
        let result = main(rawText);
        setParsed(result);
      })
      .catch(function(error) {
        console.log(error);
      });
  }, []);

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

  // get images
  useEffect(() => {
    var url = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&generator=images&gimlimit=500&prop=imageinfo&iiprop=url|dimensions|mime&format=json&origin=*`;
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(data => {
        let imgs = data.query.pages,
          res = {};
        for (const key in imgs) {
          res[imgs[key].title] = imgs[key].imageinfo[0];
        }
        setImages(res);
      })
      .catch(function(error) {
        console.log(error);
      });
  }, []);

  return (
    <ImagesContext.Provider value={{ images }}>
      <Fragment>
        <Menu />
        <div className="article">
          {/*<Sidebar content={parsed.images} images={images} />*/}
          <div className="hero">
            <Popover
              isOpen={isPopoverOpen}
              position={"top"}
              content={<div>{"Hi! I'm popover content."}</div>}
            >
              <div onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                Click me!
              </div>
            </Popover>
            <div className="hero__title">{title.replace(/_/g, " ")}</div>
            <div className="hero__credit">
              From Wikipedia, the free encyclopedia
            </div>
            <Content content={parsed.children} />
            {/*<Reference {...{ references }} />*/}
          </div>
        </div>
        <Navigation headings={parsed.headings} />
      </Fragment>
    </ImagesContext.Provider>
  );
};

export default Article;
