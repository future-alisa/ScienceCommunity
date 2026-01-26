import { RenderElementProps } from "slate-react";

export const RenderElement = (props: RenderElementProps) => {
  console.log(props.element);
  const textAlignStyle = { textAlign: props.element.align };

  const listStyle = {
    ...textAlignStyle,
    paddingLeft: "1em",
    margin: "0.2em 0",
  };

  switch (props.element.type) {
    case "heading":
      if (props.element.level == 1) {
        return (
          <h1 style={textAlignStyle} {...props.attributes}>
            {props.children}
          </h1>
        );
      } else if (props.element.level == 2) {
        return (
          <h2 style={textAlignStyle} {...props.attributes}>
            {props.children}
          </h2>
        );
      } else {
        return (
          <h3 style={textAlignStyle} {...props.attributes}>
            {props.children}
          </h3>
        );
      }
    case "bulleted-list":
      return (
        <ul style={listStyle} {...props.attributes}>
          {props.children}
        </ul>
      );
    case "list-item":
      return (
        <li style={listStyle} {...props.attributes}>
          {props.children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={listStyle} {...props.attributes}>
          {props.children}
        </ol>
      );
    case "block-quote":
      return (
        <blockquote style={textAlignStyle} {...props.attributes}>
          {props.children}
        </blockquote>
      );
    default:
      return (
        <p style={textAlignStyle} {...props.attributes}>
          {props.children}
        </p>
      );
  }
};
