import React, { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import cellValueSelector from '../../redux/selectors/cellValue.selector';
import { numberToChar } from '../../utils/cells';

import { evaluateValue } from '../../utils/math';
import { Input, Label, Wrapper } from './styles';
import { ISpreadsheetCellProps } from './types';

const SpreadsheetCell = (props: ISpreadsheetCellProps) => {
  const { cell, onValueChange } = props;
  const cellId = `${numberToChar(cell.col)}${cell.row}`;

  const [isEditMode, setIsEditMode] = useState(false);
  const value = useSelector(cellValueSelector(cell));
  const inputRef = useRef<HTMLInputElement>(null);

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(cell, event.target.value);
  };

  const handleCellClick = () => {
    setIsEditMode(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 250);
  };

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if ((event.target as HTMLElement)?.dataset?.cellId !== cellId) {
        setIsEditMode(false);
      }
    },
    [cellId],
  );

  const handleDefocus = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      setIsEditMode(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [handleOutsideClick]);

  return (
    <Wrapper isEditMode={isEditMode} onClick={handleCellClick}>
      {isEditMode ? (
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleValueChange}
          onKeyDown={handleDefocus}
          data-cell-id={cellId}
        />
      ) : (
        <Label data-cell-id={cellId}>{evaluateValue(value)}</Label>
      )}
    </Wrapper>
  );
};

export default SpreadsheetCell;
