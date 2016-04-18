import * as React from 'react';
const Prop = React.PropTypes;

/**
 * This module contains generic UI Elements reuse in the app
 */

export const LinkItem = (props) => {
    let icon;
    if (props.icon) {
        icon = <i className={props.icon +" icon"}/>;
    }

    return <a className="item" href="#" onClick={() => props.onClick(props)}>{icon} {props.children} {props.text}</a>;
};

LinkItem.propTypes = {
    onClick: Prop.func.isRequired,
    text: Prop.string,
    icon: Prop.string
};

export const Icon = (props) => {
    let classes = [];
    classes.push(props.type);
    if (props.align === 'right') {
        classes.push('right floated');
    }
    if (props.size !== "normal") {
        classes.push(props.size);
    }
    classes.push('icon');
    return <i {...props} className={classes.join(" ")}/>
};

Icon.propTypes = {
    type: Prop.string.isRequired,
    onClick: Prop.func,
    align: Prop.oneOf(["left", "right"]),
    size: Prop.oneOf(["mini", "tiny", "small", "normal", "large", "huge", "massive"])
};


export const Divider = (props) => {
    return <div className="ui divider"></div>
};