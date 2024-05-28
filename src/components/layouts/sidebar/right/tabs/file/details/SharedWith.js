import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { fetchSharePermissions } from 'views/shares/_actions';
import { Tooltip } from 'reactstrap';
import styled, { css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

class SharedWith extends Component {
  state = { owner: null, users: [], openTooltip: null };

  componentDidMount() {
    this.fetchUsers();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) this.fetchUsers();
  }

  fetchUsers() {
    this.setState({ owner: null, users: [] });
    this.props
      .fetchSharePermissions({
        shareable_id: this.props.id,
        shareable_type: this.props.mode
      })
      .then(data =>
        this.setState({
          owner: data.owner,
          users: data.shares
        })
      );
  }

  render() {
    return (
      <Fragment>
        <Title>Shared with</Title>
        {this.state.owner && (
          <div className="d-flex">
            <div id={'user-' + this.state.owner.id}>
              <Avatar {...this.state.owner} group={false}>
                {!this.state.owner.photo && this.state.owner.name[0]}
              </Avatar>
            </div>

            <Tooltip
              placement="bottom"
              isOpen={this.state.openTooltip === this.state.owner.id}
              toggle={() =>
                this.setState(prev => ({
                  openTooltip: prev.openTooltip === this.state.owner.id ? null : this.state.owner.id
                }))
              }
              target={'user-' + this.state.owner.id}
              innerClassName={TooltipStyle}
              className={css`
                opacity: 1 !important;
              `}
            >
              {this.state.owner.name}
            </Tooltip>

            {this.state.users.slice(0, 8).map((user, i) => (
              <Fragment key={i}>
                <div id={'user-' + user.id}>
                  <Avatar key={user.id + i} {...user} group={true} height={10 - i}>
                    {!user.photo && user.name[0]}
                  </Avatar>
                </div>
                <Tooltip
                  isOpen={this.state.openTooltip === user.id}
                  toggle={() =>
                    this.setState(prev => ({
                      openTooltip: prev.openTooltip === user.id ? null : user.id
                    }))
                  }
                  placement="bottom"
                  target={'user-' + user.id}
                  innerClassName={TooltipStyle}
                  className={css`
                    opacity: 1 !important;
                  `}
                >
                  {user.name}
                </Tooltip>
              </Fragment>
            ))}
            {this.state.users.length > 8 && <More>{`+${this.state.users.length - 8}`}</More>}
          </div>
        )}
      </Fragment>
    );
  }
}
export default connect(
  null,
  { fetchSharePermissions }
)(SharedWith);

const Title = styled('div')`
  margin-top: ${variables.size16};
  margin-bottom: ${variables.size16};
`;

const Avatar = styled('div')`
  width: ${variables.size32};
  height: ${variables.size32};
  border: 1px solid white;
  border-radius: 50%;

  margin-right: ${({ group }) => (group ? '-8px' : '4px')};

  background-color: ${variables.primary};
  color: white;

  background-image: ${({ photo }) => (photo ? `url(${photo})` : 'none')};
  background-size: cover;
  background-position: center;

  z-index: ${({ height }) => (height ? height : 10)};

  display: flex;
  justify-content: center;
  align-items: center;
`;

const More = styled(Avatar)`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-right: 0;
  margin-left: ${variables.size16};

  background-color: white;
  color: ${variables.iconInactive};
  border: 1px solid ${variables.iconInactive};
  font-size: ${variables.size12};
`;

const TooltipStyle = css`
  font-size: ${variables.size12};

  background-color: ${variables.head};
  color: white;
  box-shadow: 4px 6px 32px -3px #9e9e9e;

  + .arrow:before {
    border-top-color: ${variables.head};
    border-bottom-color: ${variables.head};
  }
`;
