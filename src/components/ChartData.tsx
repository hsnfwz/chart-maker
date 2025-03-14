'use client';

import { useState } from "react";

import { useChartContext } from "@/hooks/context";
import { isNumeric } from "@/helpers/chart";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
 } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
 } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import SortableItem from "./SortableItem";

function ChartData() {
  const {
    dataX,
    dataY,
    setDataX,
    setDataY,
  } = useChartContext();

  const [chartDataX, setChartDataX] = useState<(number|string)[]>(['Category A', 'Category B', 'Category C']);
  const [chartDataY, setChartDataY] = useState<(number|string)[]>([10, 20, 30]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEndX(event: any) {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const activeIndex = +active.id.split('-')[1];
      const overIndex = +over.id.split('-')[1];
      const _chartDataX = arrayMove(chartDataX, activeIndex, overIndex);
      setChartDataX(_chartDataX);

      const _dataX = [...dataX];
      const [value] = _dataX.splice(activeIndex, 1);
      _dataX.splice(overIndex, 0, value);
      setDataX(_dataX);
    }
  }

  function handleDragEndY(event: any) {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const activeIndex = +active.id.split('-')[1];
      const overIndex = +over.id.split('-')[1];
      const _chartDataY = arrayMove(chartDataY, activeIndex, overIndex);
      setChartDataY(_chartDataY);

      const _dataY = [...dataY];
      const [value] = _dataY.splice(activeIndex, 1);
      _dataY.splice(overIndex, 0, value);
      setDataY(_dataY);
    }
  }

  return (
    <>
      <DndContext
        id="x-axis"
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToParentElement]}
        onDragEnd={handleDragEndX}
      >
        <div className="flex flex-col gap-2">
          <h1>X-Axis</h1>
          <div className="flex flex-col gap-2">
            <SortableContext items={chartDataX.map((x, index) => `x-${index}`)} strategy={verticalListSortingStrategy}>
              {chartDataX.map((value, index) => (
                <SortableItem id={`x-${index}`} key={`x-${index}`}>
                  <input
                    className="bg-neutral-200 rounded p-2 w-full"
                    type="text"
                    value={value}
                    onInput={(event) => {
                      const _chartDataX = [ ...chartDataX ];
                      _chartDataX[index] = event.currentTarget.value;
                      setChartDataX(_chartDataX);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === 'Tab') {
                        event.currentTarget.blur();
                      }
                    }}
                    onBlur={(event) => {
                      const _dataX = [ ...dataX ];
                      _dataX[index] = event.currentTarget.value;
                      setDataX(_dataX);

                      const _chartDataX = [ ...chartDataX ];
                      _chartDataX[index] = event.currentTarget.value;
                      setChartDataX(_chartDataX);
                    }}
                  />
              </SortableItem>
              ))}
            </SortableContext>
          </div>
        </div>
      </DndContext>
      <DndContext
        id="y-axis"
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToParentElement]}
        onDragEnd={handleDragEndY}
      >
        <div className="flex flex-col gap-2">
          <h1>Y-Axis</h1>
          <div className="flex flex-col gap-2">
            <SortableContext items={chartDataY.map((y, index) => `y-${index}`)} strategy={verticalListSortingStrategy}>
              {chartDataY.map((value, index) => (
                <SortableItem id={`y-${index}`} key={`y-${index}`}>
                  <input
                    className="bg-neutral-200 rounded p-2 w-full"
                    type="text"
                    value={value}
                    onInput={(event) => {
                      const _chartDataY = [ ...chartDataY ];
                      _chartDataY[index] = event.currentTarget.value;
                      setChartDataY(_chartDataY);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === 'Tab') {
                        event.currentTarget.blur();
                      }
                    }}
                    onBlur={(event) => {
                      if (isNumeric(event.target.value)) {
                        let _value: string = event.currentTarget.value.trim();

                        const indexOfDot = _value.indexOf('.');
                        if (indexOfDot === _value.length-1) {
                          _value = _value.slice(0, -1);
                        }

                        const _dataY = [ ...dataY ];
                        _dataY[index] = _value;
                        setDataY(_dataY);

                        const _chartDataY = [ ...chartDataY ];
                        _chartDataY[index] = _value;
                        setChartDataY(_chartDataY);
                      } else {
                        const _chartDataY = [ ...chartDataY ];
                        _chartDataY[index] = dataY[index];
                        setChartDataY(_chartDataY);
                      }
                    }}
                  />
                </SortableItem>
              ))}
            </SortableContext>
          </div>
        </div>
      </DndContext>
    </>
  );
}

export default ChartData;
