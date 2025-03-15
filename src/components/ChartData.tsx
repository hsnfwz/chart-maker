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
    labelX,
    labelY,
    dataX,
    dataY,
    setLabelX,
    setLabelY,
    setDataX,
    setDataY,
  } = useChartContext();

  const [chartLabelX, setChartLabelX] = useState<string>('Groups');
  const [chartLabelY, setChartLabelY] = useState<string[]>(['Day 1', 'Day 2', 'Day 3']);
  const [chartDataX, setChartDataX] = useState<(number|string)[]>(['Group A', 'Group B', 'Group C']);
  const [chartDataY, setChartDataY] = useState<(number[])>([10, 20, 30, 40, 50, 60, 70, 80, 90]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEndX(event: any) {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const activeIndexX = +active.id.split('-')[1];
      const overIndexX = +over.id.split('-')[1];
      const _chartDataX = arrayMove(chartDataX, activeIndexX, overIndexX);
      setChartDataX(_chartDataX);

      const _dataX = [...dataX];
      const [valueX] = _dataX.splice(activeIndexX, 1);
      _dataX.splice(overIndexX, 0, valueX);
      setDataX(_dataX);

      if (overIndexX > activeIndexX) {
        let _chartDataY: number[] = [...chartDataY];
        let i = chartLabelY.length-1;
        while (i >= 0) {
          _chartDataY = arrayMove(_chartDataY, (activeIndexX*labelY.length)+i, (overIndexX*labelY.length)+i);
          i--;
        }
        setChartDataY(_chartDataY);
  
        let _dataY: number[] = [...dataY];
        let j = labelY.length-1;
        while (j >= 0) {
          _dataY = arrayMove(_dataY, (activeIndexX*labelY.length)+j, (overIndexX*labelY.length)+j);
          j--;
        }
        setDataY(_dataY);
      } else {
        let _chartDataY: number[] = [...chartDataY];
        let i = 0;
        while (i < chartLabelY.length) {
          _chartDataY = arrayMove(_chartDataY, (activeIndexX*labelY.length)+i, (overIndexX*labelY.length)+i);
          i++;
        }
        setChartDataY(_chartDataY);
  
        let _dataY: number[] = [...dataY];
        let j = 0;
        while (j < labelY.length) {
          _dataY = arrayMove(_dataY, (activeIndexX*labelY.length)+j, (overIndexX*labelY.length)+j);
          j++;
        }
        setDataY(_dataY);
      }
    }
  }

  function handleDragEndLabelY(event: any) {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const activeIndex = +active.id.split('-')[1];
      const overIndex = +over.id.split('-')[1];
      const _chartLabelY = arrayMove(chartLabelY, activeIndex, overIndex);
      setChartLabelY(_chartLabelY);

      const _labelY = [...labelY];
      const [value] = _labelY.splice(activeIndex, 1);
      _labelY.splice(overIndex, 0, value);
      setLabelY(_labelY);
    }
  }

  function handleDragEndDataY(event: any) {
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
      <label tabIndex={0} htmlFor="file" className="bg-neutral-200 hover:bg-black hover:text-white p-2 cursor-pointer rounded text-center">Upload</label>
      <input type="file" id="file" name="file" accept=".csv, .txt" value={''} className="hidden" onInput={(event) => {
        const files = event.currentTarget.files;

        if (files) {
          const file = files[0];

          if (file) {
            const reader = new FileReader();

            reader.onload = () => {
              const { result } = reader;

              if (result && typeof result === 'string') {
                const lines: string[] = result.split('\n');
                const header: string = lines[0].replace('\r', '');

                const xValues: string[] = [];
                const yValues: number[] = [];

                let i = 1;
                while (i < lines.length) {
                  const data: string[] = lines[i].replace('\r', '').split(',');

                  const xValue: string = data[0];

                  if (xValue.length !== 0) {
                    xValues.push(xValue);
                  }

                  let j = 1;
                  while (j < data.length) {
                    const yValue: string = data[j];

                    if (isNumeric(yValue)) {
                      yValues.push(+yValue);
                    }

                    j++;
                  }

                  i++;
                }

                if (xValues.length > 0) {
                  const _chartDataX = [...chartDataX];
                  _chartDataX.push(...xValues);
                  setChartDataX(_chartDataX);

                  const _dataX = [...dataX];
                  _dataX.push(...xValues);
                  setDataX(_dataX);
                }

                if (yValues.length > 0) {
                  const _chartDataY = [...chartDataY];
                  _chartDataY.push(...yValues);
                  setChartDataY(_chartDataY);

                  const _dataY = [...dataY];
                  _dataY.push(...yValues);
                  setDataY(_dataY);
                }
              }
            };

            reader.onerror = () => {
              console.log('Error reading the file.');
            };

            reader.readAsText(file);
          }
        }


      }} />
      <DndContext
        id="x-axis"
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToParentElement]}
        onDragEnd={handleDragEndX}
      >
        <div className="flex flex-col gap-2">
          <h1 className="font-bold">X-Axis</h1>
          <div className="flex flex-col gap-2">
            <SortableContext items={chartDataX.map((x, index) => `x-${index}`)} strategy={verticalListSortingStrategy}>
              {chartDataX.map((value, index) => (
                <SortableItem id={`x-${index}`} key={`x-${index}`}>
                  <div className="flex gap-1 w-full items-center">
                    <button className="hover:bg-neutral-200 p-1 cursor-pointer stroke-black rounded-full" type="button" onClick={() => {
                      const _chartDataX = [...chartDataX];
                      _chartDataX.splice(index, 1);
                      setChartDataX(_chartDataX);

                      const _dataX = [...dataX];
                      _dataX.splice(index, 1);
                      setDataX(_dataX);
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
                    </button>
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
                  </div>
              </SortableItem>
              ))}
            </SortableContext>
          </div>
          <button className="bg-neutral-200 rounded p-2 cursor-pointer hover:bg-black hover:text-white" type="button" onClick={() => {
            const _chartDataX = [...chartDataX];
            _chartDataX.push('Group');
            setChartDataX(_chartDataX);

            const _dataX = [...dataX];
            _dataX.push('Group');
            setDataX(_dataX);
          }}>Add</button>
        </div>
      </DndContext>
      <DndContext
        id="y-axis-label"
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToParentElement]}
        onDragEnd={handleDragEndLabelY}
      >
        <div className="flex flex-col gap-2">
          <h1 className="font-bold">Y-Axis Label</h1>
          <div className="flex flex-col gap-2">
            <SortableContext items={chartLabelY.map((y, index) => `y-${index}`)} strategy={verticalListSortingStrategy}>
              {chartLabelY.map((value, index) => (
                <SortableItem id={`y-${index}`} key={`y-${index}`}>
                  <div className="flex gap-1 w-full items-center">
                    <button className="hover:bg-neutral-200 p-1 cursor-pointer stroke-black rounded-full" type="button" onClick={() => {
                      const _chartLabelY = [...chartLabelY];
                      _chartLabelY.splice(index, 1);
                      setChartLabelY(_chartLabelY);

                      const _labelY = [...labelY];
                      _labelY.splice(index, 1);
                      setLabelY(_labelY);
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
                    </button>
                    <input
                      className="bg-neutral-200 rounded p-2 w-full"
                      type="text"
                      value={value}
                      onInput={(event) => {
                        const _chartLabelY = [ ...chartLabelY ];
                        _chartLabelY[index] = event.currentTarget.value;
                        setChartLabelY(_chartLabelY);
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

                          const _labelY = [ ...labelY ];
                          _labelY[index] = _value;
                          setLabelY(_labelY);

                          const _chartLabelY = [ ...chartLabelY ];
                          _chartLabelY[index] = _value;
                          setChartLabelY(_chartLabelY);
                        } else {
                          const _chartLabelY = [ ...chartLabelY ];
                          _chartLabelY[index] = labelY[index];
                          setChartLabelY(_chartLabelY);
                        }
                      }}
                    />
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </div>
          <button className="bg-neutral-200 rounded p-2 cursor-pointer hover:bg-black hover:text-white" type="button" onClick={() => {
            const _chartLabelY = [...chartLabelY];
            _chartLabelY.push('Day');
            setChartLabelY(_chartLabelY);

            const _labelY = [...labelY];
            _labelY.push('Day');
            setLabelY(_labelY);
          }}>Add</button>
        </div>
      </DndContext>
      <DndContext
        id="y-axis-data"
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToParentElement]}
        onDragEnd={handleDragEndDataY}
      >
        <div className="flex flex-col gap-2">
          <h1 className="font-bold">Y-Axis Data</h1>
          <div className="flex flex-col gap-2">
            <SortableContext items={chartDataY.map((y, index) => `y-${index}`)} strategy={verticalListSortingStrategy}>
              {chartDataY.map((value, index) => (
                <SortableItem id={`y-${index}`} key={`y-${index}`}>
                  <div className="flex gap-1 w-full items-center">
                    <button className="hover:bg-neutral-200 p-1 cursor-pointer stroke-black rounded-full" type="button" onClick={() => {
                      const _chartDataY = [...chartDataY];
                      _chartDataY.splice(index, 1);
                      setChartDataY(_chartDataY);

                      const _dataY = [...dataY];
                      _dataY.splice(index, 1);
                      setDataY(_dataY);
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
                    </button>
                    <input
                      className="bg-neutral-200 rounded p-2 w-full"
                      type="text"
                      value={value}
                      onInput={(event) => {
                        const _chartDataY = [ ...chartDataY ];
                        _chartDataY[index] = +event.currentTarget.value;
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
                          _dataY[index] = +_value;
                          setDataY(_dataY);

                          const _chartDataY = [ ...chartDataY ];
                          _chartDataY[index] = +_value;
                          setChartDataY(_chartDataY);
                        } else {
                          const _chartDataY = [ ...chartDataY ];
                          _chartDataY[index] = dataY[index];
                          setChartDataY(_chartDataY);
                        }
                      }}
                    />
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </div>
          <button className="bg-neutral-200 rounded p-2 cursor-pointer hover:bg-black hover:text-white" type="button" onClick={() => {
            const _chartDataY = [...chartDataY];
            _chartDataY.push(1);
            setChartDataY(_chartDataY);

            const _dataY = [...dataY];
            _dataY.push(1);
            setDataY(_dataY);
          }}>Add</button>
        </div>
      </DndContext>
    </>
  );
}

export default ChartData;
