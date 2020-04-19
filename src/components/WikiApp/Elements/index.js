import React, { Fragment, useState, useEffect } from "react";
// import { trimAll } from "./../../../wiki_parser";

export const Text = ({ text }) => {
  let [splitText, setSplitText] = useState("");
  useEffect(() => {
    let paragraphs = text.split("\n\n"),
      res = [];
    for (let i = 0; i < paragraphs.length; i++) {
      res.push(<span key={-i - 1}>{paragraphs[i]}</span>);
      if (i < paragraphs.length - 1) {
        res.push(<br key={i} />);
      }
    }
    setSplitText(res);
  }, []);
  return <Fragment>{splitText}</Fragment>;
};

export const Template = ({ props }) => {
  if (Array.isArray(props.children)) {
    return (
      <Fragment>
        {props.children.map((e, i) => (
          <Element key={i} props={e} />
        ))}
      </Fragment>
    );
  }
  let { attribute } = props;

  return (
    <Fragment>
      <a className="wiki-cite" href={attribute.url}>
        {`"${attribute.title}"`}
      </a>
      {". "}
      {props.subType == "web" && attribute.publisher && (
        <span>{`${attribute.publisher}. `}</span>
      )}
      {props.subType == "web" && attribute.accessdate && (
        <span>{`Retrieved ${attribute.accessdate}. `}</span>
      )}
    </Fragment>
  );
};

export const Element = ({ props, images }) => {
  let { elementName, children } = props;

  if (elementName == "ExternalLink") {
    return (
      <a href={"https://en.wikipedia.org/wiki/" + props.url}>
        {props.displayText}
      </a>
    );
  }

  if (elementName == "Break") {
    return <br />;
  }

  if (elementName == "Text") {
    return <Text text={props.text} />;
  }

  if (elementName == "Template") {
    return <Template {...{ props }} />;
  }

  let renderChildren;
  if (Array.isArray(children)) {
    renderChildren = children.map((e, i) => <Element key={i} props={e} />);
  }

  if (elementName == "Bold") {
    return <span className="wiki-bold">{renderChildren}</span>;
  }

  if (elementName == "Italic") {
    return <span className="wiki-italic">{renderChildren}</span>;
  }

  if (elementName == "BoldItalic") {
    return <span className="wiki-italic wiki-bold">{renderChildren}</span>;
  }

  if (elementName == "Block Quote") {
    return <blockquote>{renderChildren}</blockquote>;
  }

  if (elementName.slice(0, -1) == "Heading") {
    return (
      <div className={props.className} id={props.id}>
        {props.text}
      </div>
    );
  }

  // if (elementName == "Heading2") {
  //   return <h3>{renderChildren}</h3>;
  // }

  if (elementName == "Link") {
    let type = props.type;
    if (type == "wikiLink") {
      return (
        <a href={"https://en.wikipedia.org/wiki/" + props.url}>
          {props.displayText}
        </a>
      );
    }
    if (type == "media") {
      if (props && props.url && images && images[props.url]) {
        // console.log(props);
        let float = props.options.indexOf("left") > -1 ? "fl-left" : "fl-right";
        return (
          <Fragment>
            <div className={`wiki-img__container ${float}`}>
              <img
                id={props.url}
                className="wiki-img__image"
                src={images[props.url].url}
              />
              <div className="wiki-img__caption">
                {props.caption.map((e, i) => (
                  <Element key={i} props={e} />
                ))}
              </div>
            </div>
          </Fragment>
        );
      }
    }
  } else if (elementName == "Reference") {
    if (
      props.children &&
      props.children.length &&
      props.children[0].attribute &&
      props.children[0].attribute.url
    ) {
      return (
        <sup>
          <a href={props.children[0].attribute.url}>{props.referenceIndex}</a>
        </sup>
      );
    }
    return (
      <sup>
        <a href={props}>{props.referenceIndex}</a>
      </sup>
    );
  }
  return JSON.stringify(props);
};