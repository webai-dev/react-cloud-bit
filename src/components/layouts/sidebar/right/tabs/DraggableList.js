import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { css } from 'react-emotion';
import SvgRender from 'components/general/SvgRender';
import reorderSvg from 'assets/svg/actions/reorder.svg';
import variables from 'assets/sass/partials/_exports.scss';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.items !== prevState.items) return { items: nextProps.items };
    else return null;
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const items = reorder(this.state.items, result.source.index, result.destination.index);
    this.setState({
      items
    });
    this.props.onOrderChange(items);
  }

  onCheck = id => () => {
    this.setState(prevState => {
      this.props.onCollapseChange(id, !prevState.items.find(item => item.id === id).checked);
      return {
        items: prevState.items.map(
          item =>
            item.id === id
              ? {
                  ...item,
                  checked: !item.checked
                }
              : item
        )
      };
    });
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div ref={provided.innerRef}>
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${ListItemStyle} ${snapshot.isDragging ? 'dragging' : ''}`}
                    >
                      <div className="d-flex align-items-center">
                        <SvgRender path={reorderSvg} style={{ height: 16 }} />
                        <div className="ml-1" />
                        {item.content}
                      </div>
                      <div className="d-flex align-items-center">
                        <button
                          type="button"
                          className={`btn btn-select ${item.checked ? 'active' : ''}`}
                          onClick={this.onCheck(item.id)}
                        />
                        <div className="ml-1" />
                        Collapse
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default List;

const ListItemStyle = css`
  display: flex;
  align-items: center;
  padding-bottom: ${variables.size16};
  padding-top: ${variables.size16};
  border-bottom: 1px solid #e6f0f7;
  justify-content: space-between;
  background-color: ${variables.white};

  &.dragging {
    border-top: 1px solid #e6f0f7;
  }
`;
