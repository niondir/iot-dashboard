/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import {PropTypes as Prop}  from "react";

/**
 * This module contains generic UI Elements reuse in the app
 */

export const LinkItem = (props) => {
    let icon;
    if (props.icon) {
        icon = <i className={props.icon +" icon"}/>;
    }

    return <a className={"item" + (props.disabled ? " disabled" : "")} href="#"
              onClick={(e) =>{
              e.stopPropagation();
              e.preventDefault();
              props.onClick(props);
              }}>{icon} {props.children} {props.text}</a>;
};

LinkItem.propTypes = {
    onClick: Prop.func.isRequired,
    text: Prop.string,
    icon: Prop.string,
    disabled: Prop.bool,
    children: Prop.any
};

export const Icon = (props) => {
    const classes = [];
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