'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TablePickerProps {
  onSelect: (rows: number, cols: number) => void;
  maxRows?: number;
  maxCols?: number;
}

export function TablePicker({ onSelect, maxRows = 10, maxCols = 10 }: TablePickerProps) {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellHover = (row: number, col: number) => {
    setHoveredCell({ row, col });
  };

  const handleCellClick = (row: number, col: number) => {
    onSelect(row + 1, col + 1);
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  return (
    <div className="p-2" onMouseLeave={handleMouseLeave}>
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}>
        {Array.from({ length: maxRows }, (_, rowIndex) =>
          Array.from({ length: maxCols }, (_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                'w-4 h-4 border border-gray-300 cursor-pointer transition-colors',
                hoveredCell &&
                  rowIndex <= hoveredCell.row &&
                  colIndex <= hoveredCell.col
                  ? 'bg-blue-500 border-blue-600'
                  : 'bg-white hover:bg-gray-100'
              )}
              onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
      <div className="text-center mt-2 text-xs text-gray-600">
        {hoveredCell ? `${hoveredCell.row + 1} × ${hoveredCell.col + 1}` : 'Select table size'}
      </div>
    </div>
  );
}
