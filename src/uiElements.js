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

    return <a className="item" href="#" onClick={() => props.onClick(props)}>{icon} {props.text}</a>;
};

LinkItem.propTypes = {
    onClick: Prop.func.isRequired,
    text: Prop.string,
    icon: Prop.string
};