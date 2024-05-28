import React, { Component } from 'react';

export default class Tabs extends Component {
  state = {
    activeTab: 0
  };

  changeActiveTab(index) {
    this.setState({ activeTab: index });
  }

  handleHiddenTabs = (visible, index) => {
    // If the initial activeTab renders a Hidden tab, change it to the next one
    if (!visible && index === this.state.activeTab) {
      if (index + 1 <= this.props.tabs.length - 1) {
        this.changeActiveTab(index + 1);
      }
    }
  };

  renderButtons() {
    return this.props.tabs.map((tab, index) => {
      const Button = (
        <tab.button
          key={index}
          onClick={() => this.changeActiveTab(index)}
          className={`${index === this.state.activeTab ? 'active' : ''}`}
        />
      );

      return Button;
    });
  }

  renderActiveContent() {
    const activeTab = this.props.tabs.find((tab, index) => {
      return index === this.state.activeTab;
    });
    const Content = <activeTab.content />;

    return Content;
  }

  render() {
    const { indicatorClassName, noMargin, buttonsClassName, contentClassName } = this.props;

    return (
      <div className="tabs-wrapper">
        <div className={`tabs-buttons ${buttonsClassName || ''} ${!noMargin && 'mb-4'} d-flex`}>
          {this.renderButtons()}
        </div>
        <div className={`${contentClassName ? contentClassName : ''}`}>
          {this.renderActiveContent()}
        </div>
      </div>
    );
  }
}
