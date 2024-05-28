import React, { Fragment, Component } from 'react';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import ActivityInfo from './ActivityInfo';
import { addBitActivity } from 'views/bits/_actions';
import { addFileActivity } from 'views/files/_actions';
import { addFolderActivity } from 'views/folders/_actions';
import { Scrollbar } from 'utils/styles/scrollbar';
import { connect } from 'react-redux';
import { apiService } from 'utils/api';
import SvgRender from 'components/general/SvgRender';
import loader from 'assets/svg/general/loader.svg';

class Activity extends Component {
  state = {
    hasMore: true,
    fetchingData: false
  };

  onScroll = async e => {
    const element = e.target;
    const { hasMore, fetchingData } = this.state;
    const { activity, mode, sidebar, bits, files, folders } = this.props;
    if (!hasMore || fetchingData) return;

    if (!activity.next_page_url) {
      this.setState({ hasMore: false });
      return;
    }

    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      this.setState({ fetchingData: true });

      const page = activity.next_page_url.split('?')[1];

      const activityResponse = await apiService.get(
        `/${mode}s/${sidebar.data.fileId}/activity?${page}&major=1`
      );
      if (activityResponse.data.next_page_url === null) this.setState({ hasMore: false });

      let newData = [...activityResponse.data.data];
      let newActivity = { ...activityResponse.data };

      let oldData;
      if (mode === 'bit') {
        oldData = [...bits.activity.data];
        newActivity.data = oldData.concat(newData);
        await this.props.addBitActivity(newActivity);
      } else if (mode === 'file') {
        oldData = [...files.activity.data];
        newActivity.data = oldData.concat(newData);
        await this.props.addFileActivity(newActivity);
      } else {
        oldData = [...folders.activity.data];
        newActivity.data = oldData.concat(newData);
        await this.props.addFolderActivity(newActivity);
      }

      this.setState({ fetchingData: false });
    }
  };

  render() {
    const { fetchingData } = this.state;
    return (
      <Fragment>
        <MainContainer
          onScroll={this.onScroll}
          className={Scrollbar}
          withPreview={this.props.withPreview}
        >
          <InfoContainer>
            <ActivityInfo {...this.props} />
          </InfoContainer>
          {fetchingData && (
            <LoaderContainer>
              <SvgRender path={loader} style={{ width: 48, height: 48 }} />
            </LoaderContainer>
          )}
        </MainContainer>
      </Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addBitActivity: activity => dispatch(addBitActivity(activity)),
    addFileActivity: activity => dispatch(addFileActivity(activity)),
    addFolderActivity: activity => dispatch(addFolderActivity(activity))
  };
};

export default connect(
  (state, props) => {
    let activity;
    if (props.mode === 'file') {
      activity = state.files.activity;
    } else if (props.mode === 'bit') {
      activity = state.bits.activity;
    } else {
      activity = state.folders.activity;
    }
    return {
      activity: activity,
      sidebar: state.sidebar,
      bits: state.bits,
      files: state.files,
      folders: state.folders
    };
  },
  mapDispatchToProps
)(Activity);

const LoaderContainer = styled('div')`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 10px;
`;

const MainContainer = styled('div')`
  flex: 1;
  overflow-y: auto;
  padding-right: ${variables.size8};
  margin-right: ${variables.size8};
`;

const InfoContainer = styled('div')`
  margin: 0 ${variables.size32};
`;
