import React, { Component } from 'react';

import { createQueryParams, parseQueryParams } from 'utils/query';

import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import onClickOutside from 'react-onclickoutside';

import { connect } from 'react-redux';
import { fetchTeamSearch } from 'state/search/_actions';
import { fetchTeamMembers } from 'views/teammates/_actions';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import Bar from './Bar';
import Dropdown from './Dropdown';

const enhance = compose(
  connect(
    state => ({
      team_id: state.teams.active.id,
      teammates: state.teammates.list
    }),
    { fetchTeamSearch, fetchTeamMembers }
  ),
  withRouter,
  onClickOutside
);
class Search extends Component {
  state = {
    search: '',
    tags: [],
    types: [],
    owner: null,
    terms: '',
    isDropdownOpen: false,
    isFetchingTeamates: false
  };

  componentDidMount() {
    const params = parseQueryParams(this.props.location.search);
    this.setState({
      search: params.search ? params.search.split('%2C').join(',') : '',
      tags: params.tags ? params.tags : [],
      types: params.types ? params.types : [],
      terms: params.terms ? params.terms : '',
      owner: params.owner ? params.owner : null
    });

    if (this.props.teammates.length === 0) this.fetchTeamMembers();
  }

  fetchTeamMembers = async () => {
    const { team_id, fetchTeamMembers } = this.props;
    this.setState({ isFetchingTeamates: true });
    await fetchTeamMembers({ team_id });
    this.setState({ isFetchingTeamates: false });
  };

  handleChange = value => {
    value = this.removeMultipleOwners(value);
    this.setState({ search: value });
    this.parseValues(value);
  };

  parseValues = input => {
    this.setState({ owner: this.getSpecial('owner', input, true) });
    this.setState({ types: this.getSpecial('type', input) });
    this.setState({ tags: this.getSpecial('tag', input) });
    this.setState({ terms: this.getTerms(input) });
  };

  getSpecial = (type, input, single = false) => {
    let regEx;
    switch (type) {
      case 'owner':
        regEx = /{{owner, ([^{}]*), [^{}]*}}/g;
        break;
      case 'type':
        regEx = /{{type, ([^{}]*), [^{}]*}}/g;
        break;
      case 'tag':
        regEx = /{{tag, ([^{}]*), [^{}]*}}/g;
        break;

      default:
        return [];
    }

    if (single) {
      let m = regEx.exec(input);
      return m ? (type === 'owner' ? parseInt(m[1]) : m[1]) : null;
    } else {
      let matches = [];
      let m;
      while ((m = regEx.exec(input))) {
        matches.push(type === 'owner' ? parseInt(m[1]) : m[1]);
      }

      return matches;
    }
  };

  removeMultipleOwners = input => {
    const matches = input.match(/{{owner, ([^{}]*), [^{}]*}}/g);
    const occurences = matches ? matches.length : 0;

    if (occurences >= 2) {
      let index = 0;
      return input.replace(/ {{owner, ([^{}]*), [^{}]*}}/g, value => {
        index++;
        return index === occurences ? value : '';
      });
    } else return input;
  };

  getTerms = input =>
    input
      .split(/{{[^{}]*, [^{}]*, [^{}]*}}/g)
      .reduce((acc, sub) => [...acc, ...sub.split(' ').filter(s => s.length > 0)], [])
      .join(' ')
      .trim();

  handleBarFocus = () => this.setState({ isDropdownOpen: true });
  handleClickOutside = () => this.setState({ isDropdownOpen: false });

  addSpecial = type => (value, label) => {
    const markup = `{{${type}, ${value}, ${label}}}`;
    this.handleChange(this.state.search + ' ' + markup);
  };

  removeSpecial = type => (value, label) => {
    const newValue = this.state.search.split(` {{${type}, ${value}, ${label}}}`).join('');
    this.handleChange(newValue);
  };

  handleSearch = e => {
    e.preventDefault();
    const { owner, tags, terms, types, search } = this.state;
    const query = createQueryParams({ owner, tags, terms, types, search });
    this.props.history.push('/search?' + query);
  };

  render() {
    const { search, isDropdownOpen, isFetchingTeamates } = this.state;
    const { teammates } = this.props;

    return (
      <Wrapper>
        <form onSubmit={this.handleSearch}>
          <Bar
            value={search}
            onChange={this.handleChange}
            onFocus={this.handleBarFocus}
            isDropdownOpen={isDropdownOpen}
            teammates={teammates}
          />
          <Dropdown
            isOpen={isDropdownOpen}
            teammates={teammates}
            isFetchingTeamates={isFetchingTeamates}
            addSpecial={this.addSpecial}
            removeSpecial={this.removeSpecial}
            selectedOwner={this.state.owner}
            selectedTypes={this.state.types}
          />
        </form>
      </Wrapper>
    );
  }
}
export default enhance(Search);

const Wrapper = styled('div')`
  position: relative;
  width: 842px;
  margin-bottom: ${variables.size24};
`;
