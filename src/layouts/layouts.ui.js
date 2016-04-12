import React from 'react';

const Prop = React.PropTypes;



/*TODO: Add remove button next to each loadable layout
* - Connect with Actions
* */
export const NavItem = (props) => {
    return <div className="ui simple dropdown item">
        Layout
        <i className="dropdown icon"></i>
        <div className="menu">
            <div className="item">
                <div className="ui icon input">
                    <input type="text" placeholder="Save as..."/>
                        <i className="save icon"></i>
                </div>
            </div>
            <a className="item"><i className="undo icon"></i> Reset</a>
            <div className="ui divider"></div>
            <div className="header">Load Layout</div>
            {props.layouts.map(l => {
                return <div className="item" key={l.name}>{l.name}</div>
            })}
        </div>
    </div>
};

LayoutList.propTypes = {
    layouts: Prop.arrayOf(
        Prop.shape({
            name: Prop.string
        })
    )
};