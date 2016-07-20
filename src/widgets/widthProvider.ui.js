/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @noflow
// Intentional; Flow can't handle the bind on L20
import * as React from 'react'
import * as ReactDOM from 'react-dom';

/*
 * A simple HOC that provides facility for listening to container resizes.
 */
export default (ComposedComponent) => {

    class WidthProvider extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                mounted: false,
                width: 1280
            };
        }

        componentDidMount() {
            this.setState({mounted: true});

            window.addEventListener('resize', this.onWindowResize.bind(this));
            // Call to properly set the breakpoint and resize the elements.
            // Note that if you're doing a full-width element, this can get a little wonky if a scrollbar
            // appears because of the grid. In that case, fire your own resize event, or set `overflow: scroll` on your body.
            this.onWindowResize();
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.onWindowResize);
        }

        onWindowResize(_event, cb) {
            const node = ReactDOM.findDOMNode(this);


            let padLeft = window.getComputedStyle(node, null).getPropertyValue('padding-left') || 0;
            padLeft = parseInt(padLeft) || 0;


            let padRight = window.getComputedStyle(node, null).getPropertyValue('padding-right') || 0;
            padRight = parseInt(padRight) || 0;


            this.setState({width: node.offsetWidth - padLeft - padRight}, cb);
        }

        render() {
            if (this.props.measureBeforeMount && !this.state.mounted) return <div {...this.props} {...this.state} />;
            return <ComposedComponent {...this.props} {...this.state} />;
        }
    }

    WidthProvider.defaultProps = {
        measureBeforeMount: false
    };

    WidthProvider.propTypes = {
        // If true, will not render children until mounted. Useful for getting the exact width before
        // rendering, to prevent any unsightly resizing.
        measureBeforeMount: React.PropTypes.bool
    };

    return WidthProvider;
}


