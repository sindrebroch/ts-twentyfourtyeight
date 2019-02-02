import * as React from 'react';

interface BoardSizePickerProps {
    gridOptions: number[],
    currentGridSize: number,
    handleGridChange: Function
}

interface BoardSizePickerState {}

export default class BoardSizePicker extends React.Component<BoardSizePickerProps, BoardSizePickerState> {
  public static defaultProps = {
    gridOptions: [3],
    currentGridSize: 3,
    handleGridChange: () => {}
  }

  renderBoardSizePicker = () => {
    return this.props.gridOptions.map((option, index) => {
      return <a key={index} onClick={() => this.props.handleGridChange(index+1)}>{option}</a>;
    });
  }

  render() {
    return (
      <div className="board-picker">
        {this.renderBoardSizePicker()}
      </div>
    );
  }
}