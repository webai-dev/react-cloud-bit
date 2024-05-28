import React, { Component } from 'react';
import { connect } from 'react-redux';
import { apiService } from 'utils/api';
import { format } from 'utils/dates';
import { Row, Col } from 'reactstrap';
import styled from 'react-emotion';

import { TableBody, TableCell, TableHeader, TableRow } from 'components/table';
import Header from 'components/layouts/header';
import SvgRender from 'components/general/SvgRender';

import variables from 'assets/sass/partials/_exports.scss';
import { menu } from 'views/settings/_helpers';

import SimpleModal from 'components/modals/SimpleModal';
import DeletePreventation from 'components/modals/DeletePrevention';

import IntegrationModal from './IntegrationModal';
import Button from './common/Button';
import CopyClip from './common/CopyClip';

class ApiKey extends Component {
  state = {
    data: [],
    modal: null,
    selected: null
  };

  fetch = async () => {
    const res = await apiService.get(`/teams/${this.props.active_team.id}/integrations`);
    this.setState({
      data: res.data.map(row => ({
        id: row.id,
        access_key: row.key,
        secret: row.secret,
        url: row.url,
        folders: row.folders,
        created_at: row.created_at,
        updated_at: row.updated_at
      }))
    });
  };

  componentDidMount() {
    this.fetch();

    document.title = 'API Keys settings | yBit';
  }
  componentWillUnmount() {
    document.title = 'yBit';
  }

  toggleModal = (modal, selected = null) =>
    this.setState(prev => ({ modal: prev.modal ? null : modal, selected }));

  addNew = newKey => this.fetch();

  delete = async id => {
    await apiService.delete(`/teams/${this.props.active_team.id}/integrations/${id}`);
    this.setState(prev => ({ data: prev.data.filter(row => row.id !== id) }));
  };

  executeAction = action => async values => {
    const params = {
      folders: values.folders.map(folder => folder.id),
      url: values.url
    };
    await apiService[action === 'create' ? 'post' : 'put'](
      `/teams/${this.props.active_team.id}/integrations${
        action === 'edit' ? `/${this.state.selected.id}` : ''
      }`,
      params
    );
    this.fetch();
  };

  render() {
    const { modal, data, selected } = this.state;
    return (
      <div className="content-inner-wrapper">
        <Header
          title={'Settings'}
          menu={
            this.props.user.role.label === 'owner' || this.props.user.role.label === 'admin'
              ? menu
              : menu.filter(m => m.label !== 'team')
          }
        />
        <Row>
          <Col xs="12">
            <div style={{ fontSize: 18, marginBottom: -4 }}>Access Keys</div>
            <small className="secondary-text" style={{ display: 'block' }}>
              Use access keys to make secure REST or HTTP Query protocol requests to Ybit service
              APIs. For your protection, you should never share your secret keys with anyone. As a
              best practice, we recommend frequent key rotation.
            </small>
            <div className="my-3 d-flex">
              <Button onClick={() => this.toggleModal('create')}>Create access key</Button>
            </div>
          </Col>
          {data && data.length > 0 && (
            <Col xs="12">
              <TableBody>
                <TableRow className="p-0">
                  <TableHeader grow="1" className="p-0 pb-1" title="ACCESS KEY ID" />
                  <TableHeader
                    grow="2"
                    className="p-0 pb-1 d-flex justify-content-center"
                    title="SECRET KEY"
                  />
                  <TableHeader grow="2" className="p-0 pb-1" title="CREATED" />
                  <TableHeader grow="2" className="p-0 pb-1" title="LAST USED" />
                  <TableHeader grow="3" className="p-0 pb-1" title="URL" />
                  <TableHeader
                    grow="2"
                    className="p-0 pb-1  d-flex justify-content-center"
                    title="ACTIONS"
                  />
                </TableRow>

                {data.map(d => (
                  <TableRow key={d.id} className="p-0">
                    <TableCell grow="1" className="p-0 py-2">
                      <CopyClip text={d.access_key} width={170} message="Access key ID copied!" />
                    </TableCell>
                    <TableCell grow="2" className="p-0 py-2 d-flex justify-content-center">
                      <CopyClip text={d.secret} iconOnly width={150} message="Secret key copied!" />
                    </TableCell>
                    <TableCell grow="2" className="p-0 py-2">
                      {format(d.created_at)}
                    </TableCell>
                    <TableCell grow="2" className="p-0 py-2">
                      {format(d.updated_at)}
                    </TableCell>
                    <TableCell grow="3" className="p-0 py-2">
                      <A
                        href={
                          d.url.startsWith('http://') || d.url.startsWith('https://')
                            ? d.url
                            : 'http://' + d.url
                        }
                        target="_blank"
                      >
                        {d.url}
                      </A>
                    </TableCell>
                    <TableCell grow="2" className="p-0 py-2 d-flex justify-content-center">
                      <SvgRender
                        style={{ height: this.props.height || 18 }}
                        className="bin-icon mr-2"
                        path={require('assets/svg/actions/edit.svg')}
                        onClick={() => this.toggleModal('edit', d)}
                      />
                      <SvgRender
                        style={{ height: this.props.height || 18 }}
                        className="edit-icon mr-2"
                        path={require('assets/svg/actions/delete.svg')}
                        onClick={() => this.toggleModal('delete', d)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Col>
          )}
        </Row>

        <SimpleModal
          header="Create api key"
          body={
            <IntegrationModal
              addNew={this.addNew}
              toggle={this.toggleModal}
              onSubmit={this.executeAction('create')}
            />
          }
          modalOpen={modal === 'create'}
          toggle={this.toggleModal}
        />
        <SimpleModal
          header="Edit api key"
          body={
            <IntegrationModal
              addNew={this.addNew}
              toggle={this.toggleModal}
              onSubmit={this.executeAction('edit')}
              selected={selected}
            />
          }
          modalOpen={modal === 'edit'}
          toggle={this.toggleModal}
        />
        <SimpleModal
          header="Delete api key"
          body={
            <DeletePreventation
              body="You are about to delete this access api key. Are you sure you want to continue?"
              modalOpen={!!modal}
              action={async () => {
                await this.delete(selected.id);
                this.toggleModal();
              }}
              toggle={this.toggleModal}
            />
          }
          modalOpen={modal === 'delete'}
          toggle={this.toggleModal}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    active_team: state.teams.active
  };
}

export default connect(mapStateToProps)(ApiKey);

const A = styled('a')`
  color: ${variables.main} !important;
  &:hover {
    color: inherit !important;
  }

  text-decoration: underline !important;
`;
