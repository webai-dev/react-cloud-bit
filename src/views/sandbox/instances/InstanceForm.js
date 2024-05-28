import React, { Component } from 'react';
import SimpleModal from 'components/modals/SimpleModal';
import DeletePreventation from 'components/modals/DeletePrevention';
import Input from 'components/inputs';
import { Row, Col } from 'reactstrap';

export default class InstanceForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      instance: this.props.initialInstance,
      submiting: false
    };
  }

  render() {
    const { instance, submiting } = this.state;
    const { onSubmit, onDismiss } = this.props;

    return (
      <SimpleModal
        header="Create Instance"
        body={
          <div className="mx-4 mt-4 mb-3">
            <Row>
              <Col xs="9">
                <Input
                  label="Instance Name"
                  tag="text"
                  value={instance.title}
                  onChange={e => {
                    this.setState({ instance: { ...instance, title: e.target.value } });
                  }}
                />
              </Col>
            </Row>
            <div class="d-flex justify-content-end">
              <button
                type="submit"
                className={`btn btn-main mt-1 pr-4 pl-4 ${submiting ? 'pointer-events-none' : ''}`}
                onClick={() => {
                  onSubmit(instance);
                  this.setState({ submiting: true });
                }}
              >
                {submiting ? 'Saving ...' : 'Save'}
              </button>
            </div>
          </div>
        }
        modalOpen={true}
        toggle={onDismiss}
      />
    );
  }
}
