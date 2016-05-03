import React from "react";
import ModalDialog from "../modal/modalDialog.ui.js";
import Modal from "../modal/modalDialog.js";
import * as Datasource from "./datasource";
import {connect} from "react-redux";
import _ from 'lodash'
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
                _.valuesIn(props.datasources).map(ds => {
                    return <ui.LinkItem key={ds.id} onClick={() => { props.editDatasource(ds.id)}}>
                        <ui.Icon type="delete" size="huge" align="right"
                                 onClick={(e) => {
                        e.stopPropagation();
                           e.preventDefault();
                        props.deleteDatasource(ds.id);
                        }}
                        />
                        {ds.props.name}
                    </ui.LinkItem>
                })
            }
        </div>
    </div>
};

TopNavItem.propTypes = {
    createDatasource: Prop.func.isRequired,
    editDatasource: Prop.func.isRequired,
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
            createDatasource: () => dispatch(Datasource.startCreateDatasource()),
            editDatasource: (id) => dispatch(Datasource.startEditDatasource(id)),
            deleteDatasource: (id) => dispatch(Datasource.deleteDatasource(id))
        }
    }
)(TopNavItem);