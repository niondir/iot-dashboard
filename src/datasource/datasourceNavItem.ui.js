import React from "react";
import ModalDialog from "../ui/modal.ui";
import * as Datasource from "./datasource";
import {connect} from "react-redux";
import {valuesOf} from "../util/collection";
import * as ui from "../ui/elements.ui";
import {reset} from "redux-form";
import * as DatasourceConfigDialog from './datasourceConfigDialog.ui'
const Prop = React.PropTypes;


const TopNavItem = (props) => {
    return <div className="ui simple dropdown item">
        Datasources
        <i className="dropdown icon"/>
        <div className="ui menu">
            <ui.LinkItem icon="plus" onClick={() => {props.createDatasource()}}>Add Datasource</ui.LinkItem>
            <ui.Divider/>
            {
                valuesOf(props.datasources).map(ds => {
                    return <ui.LinkItem key={ds.id} onClick={() => {/*Edit*/}}>
                        <ui.Icon type="delete" size="huge" align="right" onClick={() => props.deleteDatasource(ds.id)}/>
                        {ds.props.name}
                    </ui.LinkItem>
                })
            }
        </div>
    </div>
};

TopNavItem.propTypes = {
    createDatasource: Prop.func.isRequired,
    deleteDatasource: Prop.func.isRequired,
    datasources: Prop.objectOf(
        Prop.shape({
            type: Prop.string.isRequired,
            id: Prop.string.isRequired,
            props: Prop.object.isRequired
        })
    ).isRequired
};

export default connect(
    (state) => {
        return {
            datasources: state.datasources
        }
    },
    (dispatch) => {
        return {
            createDatasource: () => DatasourceConfigDialog.showDialog(),
            deleteDatasource: (id) => dispatch(Datasource.deleteDatasource(id))
        }
    }
)(TopNavItem);