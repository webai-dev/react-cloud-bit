import React, { Component } from 'react';
import ButtonIcon from 'components/general/ButtonIcon';
import SvgRender from 'components/general/SvgRender';
import InstanceForm from './InstanceForm';
import DeleteInstance from './DeleteInstance';
import { Link } from 'react-router-dom';
import { TableBody, TableCell, TableHeader, TableRow } from 'components/table';

import { connect } from 'react-redux';
import {
  createSandboxInstance,
  editSandboxInstance,
  deleteSandboxInstance
} from 'views/sandbox/_actions';

import deleteSvg from 'assets/svg/actions/delete.svg';
import editSvg from 'assets/svg/actions/edit.svg';
import showSvg from 'assets/svg/actions/show.svg';

class InstancesTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      targetedInstance: null,
      targetedInstanceActionType: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  handleSubmit(instance) {
    const params = {
      title: instance.title,
      jwt_key: this.props.type.jwt_key
    };

    if (this.state.actionType === 'edit') {
      this.props
        .editSandboxInstance(this.props.type.id, instance.id, params)
        .then(res => this.hideModal());
    } else {
      this.props.createSandboxInstance(this.props.type.id, params).then(res => this.hideModal());
    }
  }

  hideModal() {
    this.setState({ targetedInstance: null, actionType: null });
  }

  render() {
    const { targetedInstance, actionType } = this.state;
    const { type, deleteSandboxInstance } = this.props;

    return (
      <div>
        <p className="size-18 font-weight-bold">{type.name} Instances</p>

        <div>
          <TableBody className="table">
            <TableRow className="table-header pb-0">
              <TableHeader className="pb-1" title="ID" grow="1" />
              <TableHeader className="pb-1" title="Name" grow="2" />
              <TableHeader className="pb-1" title="Created At" grow="2" />
              <TableHeader className="pb-1" title="" grow="1" />
            </TableRow>
            {type.instances.map((instance, index) => (
              <TableRow key={index}>
                <TableCell grow="1">{instance.id}</TableCell>
                <TableCell grow="2">{instance.title}</TableCell>
                <TableCell grow="2">{instance.created_at}</TableCell>
                <TableCell grow="1">
                  <div className="d-flex align-items-center">
                    <button
                      onClick={() =>
                        this.setState({ targetedInstance: instance, actionType: 'delete' })
                      }
                      type="button"
                      className="btn btn-empty px-1"
                    >
                      <div className="icon-active">
                        <SvgRender style={{ height: 16 }} path={deleteSvg} />
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        this.setState({ targetedInstance: instance, actionType: 'edit' });
                      }}
                      type="button"
                      className="btn btn-empty px-1"
                    >
                      <SvgRender style={{ height: 16 }} path={editSvg} />
                    </button>

                    <Link
                      className="btn btn-empty px-1 d-flex align-items-center"
                      to={`/sandbox/types/${type.id}/instances/${instance.id}`}
                    >
                      <SvgRender style={{ height: 16 }} path={showSvg} />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <div className="d-flex justify-content-end mt-2">
            <button
              type="button"
              className="btn btn-success btn-smaller d-flex align-items-center px-2"
              onClick={() =>
                this.setState({ targetedInstance: { title: '' }, actionType: 'create' })
              }
            >
              <ButtonIcon icon="create-thin" iconClassName="create-plus-svg" width={12} height={12}>
                {null}
              </ButtonIcon>
            </button>

            {targetedInstance && (actionType === 'edit' || actionType === 'create') && (
              <InstanceForm
                initialInstance={targetedInstance}
                onSubmit={this.handleSubmit}
                onDismiss={this.hideModal}
              />
            )}

            {targetedInstance && actionType === 'delete' && (
              <DeleteInstance
                instance={targetedInstance}
                deleteSandboxInstance={deleteSandboxInstance}
                hideModal={this.hideModal}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  { createSandboxInstance, editSandboxInstance, deleteSandboxInstance }
)(InstancesTable);
