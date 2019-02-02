// StyleUtils.ts
/**
 * 
 * @param gridSize 
 */
export const getBoardStyles = (gridSize:number):string => {
    const defaultClass = "board-container";
    switch(gridSize) {
      case 1: return `${defaultClass} board-one`;
      case 2: return `${defaultClass} board-two`;
      case 3: return `${defaultClass} board-three`;
      case 4: return `${defaultClass} board-four`;
      case 5: return `${defaultClass} board-five`;
      default: return `${defaultClass}`;
    }
}