import * as React from 'react';

interface BoardSizePickerProps {
    gridOptions: number[],
    currentGridSize: number,
    handleGridChange: Function
}

export default class BoardSizePicker extends React.Component<BoardSizePickerProps, {}> {
  public static defaultProps = {
    gridOptions: [3],
    currentGridSize: 3,
    handleGridChange: () => {}
  }

  getGridPickerStyles = (gridSize:number, index:number):string => {
    const defaultStyle = "grid-style";
    if(index !== this.props.gridOptions.length-1 && gridSize === this.props.currentGridSize) return `${defaultStyle} chosen-grid grid-border`
    else if(gridSize === this.props.currentGridSize) return `${defaultStyle} chosen-grid`;
    else if(index !== this.props.gridOptions.length-1) return `${defaultStyle} grid-border`
    else return `${defaultStyle}`;
  }

  renderBoardSizePicker = () => {
    return this.props.gridOptions.map((option, index) => {
      return <a key={index} className={this.getGridPickerStyles(option, index)} onClick={() => this.props.handleGridChange(option)}>{option}</a>;
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