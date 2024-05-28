import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import SvgRender from 'components/general/SvgRender';
import close from 'assets/svg/actions/close.svg';
import RadioList from 'components/inputs/RadioList';
import DraggableList from './DraggableList';
import { apiService } from 'utils/api';
import { errorHandler, infoHandler, MSG } from 'utils/alerts';

import {
  filtersSortChange,
  filtersOrderChange,
  filtersCollapseChange,
  filtersFillGaps
} from 'state/filters/_actions';

const sortOptions = [
  {
    id: 'recently_edited',
    text: 'Recently Edited',
    selected: false
  },
  {
    id: 'last_created',
    text: 'Last Created',
    selected: false
  },
  {
    id: 'alphabetical_ascending',
    text: 'Alphabetical Ascending',
    selected: false
  },
  {
    id: 'alphabetical_descending',
    text: 'Alphabetical Descending',
    selected: false
  }
];

const orderOptions = [
  {
    id: 'bits',
    content: 'Bits',
    checked: false
  },
  {
    id: 'folders',
    content: 'Folders',
    checked: false
  },
  {
    id: 'files',
    content: 'Files',
    checked: false
  }
];

const itemTypes = [{ text: 'Bits' }, { text: 'Folders' }, { text: 'Files' }];

class Filters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applyToAll: false
    };
  }

  withInitialOptions(orderOptions) {
    const getItemsOrder = item =>
      Object.entries(this.props.itemsOrder).find(([key]) => key === item.id)[1];

    const getItemsCollapseStatus = item =>
      Object.entries(this.props.collapse).find(([key]) => key === item.id)[1];

    return orderOptions
      .sort((a, b) => getItemsOrder(a) - getItemsOrder(b))
      .map(item => ({ ...item, checked: getItemsCollapseStatus(item) }));
  }

  onOrderChange = items => {
    this.props.orderChange({
      bits: items.findIndex(item => item.id === 'bits'),
      folders: items.findIndex(item => item.id === 'folders'),
      files: items.findIndex(item => item.id === 'files')
    });
  };

  onCollapseChange = (id, checked) => {
    this.props.collapseChange({
      ...this.props.collapse,
      [id]: checked
    });
  };

  onCheckApplyToAll = () => {
    this.setState(prevState => ({ applyToAll: !prevState.applyToAll }));
  };

  onSubmit = () => {
    const params = this.prepareParams();

    apiService
      .post('filters', params)
      .then(() => {
        this.props.infoHandler(MSG.FILTER_SAVE);
      })
      .catch(error => {
        this.props.errorHandler(error);
      });

    this.setState({ applyToAll: false });
  };

  prepareParams() {
    const filterParams = this.prepareFilterParams();
    const additionalParams = this.state.applyToAll
      ? this.prepareTeamParams()
      : this.prepareFolderParams();
    return { ...filterParams, ...additionalParams };
  }

  prepareFilterParams() {
    const selectedSortOption = this.props.sortOptions.find(option => option.selected);
    return {
      sort_by: selectedSortOption ? selectedSortOption.id : 'alphabetical_ascending',
      bits_order: this.props.itemsOrder.bits,
      folders_order: this.props.itemsOrder.folders,
      files_order: this.props.itemsOrder.files,
      bits_collapse: this.props.collapse.bits,
      folders_collapse: this.props.collapse.folders,
      files_collapse: this.props.collapse.files,
      fill_gaps: this.props.fillGaps
    };
  }

  prepareFolderParams() {
    return this.props.activeFolderId
      ? {
          folder_id: this.props.activeFolderId,
          is_shares: false
        }
      : {
          folder_id: null,
          is_shares: this.props.location.pathname === '/shared'
        };
  }

  prepareTeamParams() {
    return { team_id: this.props.activeTeamId };
  }

  inRootFolder() {
    return this.props.location.pathname === '/';
  }

  render() {
    return (
      <Wrapper>
        <div className="d-flex flex-column p-4">
          <div className="d-flex justify-content-between mb-3">
            <Title>Sort By </Title>
            <IconButton onClick={this.props.hideSidebar}>
              <SvgRender style={{ height: 16 }} path={close} />
            </IconButton>
          </div>
          <RadioList options={this.props.sortOptions} onSelectionChange={this.props.sortChange} />
          <div className="mb-3" />
          {!this.inRootFolder() && (
            <Fragment>
              <Title className="mb-1">Order</Title>
              <DraggableList
                items={this.withInitialOptions(orderOptions)}
                onOrderChange={this.onOrderChange}
                onCollapseChange={this.onCollapseChange}
              />
              <div className="mb-3" />
              <Title className="mb-3">Bits</Title>
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className={`btn btn-select ${this.props.fillGaps ? 'active' : ''}`}
                  onClick={this.props.changeFillGaps(!this.props.fillGaps)}
                />
                <div className="ml-1" />
                Fill Gaps
              </div>
            </Fragment>
          )}
        </div>
        <BottomPart>
          <button onClick={this.onSubmit} className="btn btn-success pr-5 pl-5 mr-2">
            Save
          </button>
          <button
            type="button"
            className={`btn btn-select ${this.state.applyToAll ? 'active' : ''}`}
            onClick={this.onCheckApplyToAll}
          />
          <div className="ml-1" />
          <SmallText>Apply to all current and future folders</SmallText>
        </BottomPart>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    sortOptions: sortOptions.map(option =>
      option.id === state.filters.sortBy ? { ...option, selected: true } : option
    ),
    itemsOrder: state.filters.order,
    collapse: state.filters.collapse,
    fillGaps: state.filters.fillGaps,
    activeTeamId: state.teams.active.id,
    activeFolderId: state.folders.active
  };
};

const mapDispatchToProps = dispatch => ({
  sortChange: index => () => dispatch(filtersSortChange(sortOptions[index].id)),
  orderChange: newOrder => dispatch(filtersOrderChange(newOrder)),
  collapseChange: newCollapse => dispatch(filtersCollapseChange(newCollapse)),
  changeFillGaps: value => () => dispatch(filtersFillGaps(value)),
  infoHandler: message => infoHandler(dispatch, message),
  errorHandler: message => errorHandler(dispatch, message)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Filters));

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  color: ${variables.iconOutline};
  font-size: ${variables.size14};
  letter-spacing: 0.22px;
`;

const Title = styled('div')`
  font-size: ${variables.size16};
  font-weight: 600;
`;

const IconButton = styled('div')`
  cursor: pointer;
`;

const Circle = styled('span')`
  height: 16px;
  width: 16px;
  border: 1px solid #d6dbe1;
  border-radius: 8px;
`;

const BottomPart = styled('div')`
  display: flex;
  align-items: center;

  padding: ${variables.size20} ${variables.size24};
  box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.05);
`;
const SmallText = styled('span')`
  font-size: 12px;
  font-weight: 300;
  color: #8492a6;
`;
