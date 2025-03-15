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
    rerenderChart,
    labelX,
    labelY,
    dataX,
    dataY,
    setRerenderChart,
    setLabelX,
    setLabelY,
    setDataX,
    setDataY,
  } = useChartContext();

  const [chartLabelX, setChartLabelX] = useState<string>('X-Axis');
  const [chartLabelY, setChartLabelY] = useState<string[]>(['Y1', 'Y2', 'Y3']);
  const [chartDataX, setChartDataX] = useState<(number|string)[]>(['X1', 'X2', 'X3']);
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
      const activeIndex = +active.id.split('-')[1];
      const overIndex = +over.id.split('-')[1];

      const _chartDataX = arrayMove(chartDataX, activeIndex, overIndex);
      setChartDataX(_chartDataX);

      const _dataX = arrayMove(dataX, activeIndex, overIndex);
      setDataX(_dataX);

      if (overIndex > activeIndex) {
        let _chartDataY: number[] = [...chartDataY];
        let i = chartLabelY.length-1;
        while (i >= 0) {
          _chartDataY = arrayMove(_chartDataY, (activeIndex*chartLabelY.length)+i, (overIndex*chartLabelY.length)+i);
          i--;
        }
        setChartDataY(_chartDataY);
  
        let _dataY: number[] = [...dataY];
        let j = labelY.length-1;
        while (j >= 0) {
          _dataY = arrayMove(_dataY, (activeIndex*labelY.length)+j, (overIndex*labelY.length)+j);
          j--;
        }
        setDataY(_dataY);
      } else {
        let _chartDataY: number[] = [...chartDataY];
        let i = 0;
        while (i < chartLabelY.length) {
          _chartDataY = arrayMove(_chartDataY, (activeIndex*chartLabelY.length)+i, (overIndex*chartLabelY.length)+i);
          i++;
        }
        setChartDataY(_chartDataY);
  
        let _dataY: number[] = [...dataY];
        let j = 0;
        while (j < labelY.length) {
          _dataY = arrayMove(_dataY, (activeIndex*labelY.length)+j, (overIndex*labelY.length)+j);
          j++;
        }
        setDataY(_dataY);
      }
    }

    setRerenderChart(!rerenderChart);
  }

  // TODO: fix y-label sort adding new fields when moving - also fix animation when moving y labels

  function handleDragEndLabelY(event: any) {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const activeIndex = +active.id.split('-')[1];
      const overIndex = +over.id.split('-')[1];

      const _chartLabelY = arrayMove(chartLabelY, activeIndex, overIndex);
      setChartLabelY(_chartLabelY);

      const _labelY = arrayMove(labelY, activeIndex, overIndex);
      setLabelY(_labelY);

      if (overIndex > activeIndex) {
        let _chartDataY: number[] = [...chartDataY];
        let i = chartDataX.length-1;
        while (i >= 0) {
          _chartDataY = arrayMove(_chartDataY, activeIndex+(chartDataX.length*i), overIndex+(chartDataX.length*i));
          i--;
        }
        setChartDataY(_chartDataY);
  
        let _dataY: number[] = [...dataY];
        let j = dataX.length-1;
        while (j >= 0) {
          _dataY = arrayMove(_dataY, activeIndex+(dataX.length*j), overIndex+(dataX.length*j));
          j--;
        }
        setDataY(_dataY);
      } else {
        let _chartDataY: number[] = [...chartDataY];
        let i = 0;
        while (i < chartDataX.length) {
          _chartDataY = arrayMove(_chartDataY, activeIndex+(chartDataX.length*i), overIndex+(chartDataX.length*i));
          i++;
        }
        setChartDataY(_chartDataY);
  
        let _dataY: number[] = [...dataY];
        let j = 0;
        while (j < dataX.length) {
          _dataY = arrayMove(_dataY, activeIndex+(dataX.length*j), overIndex+(dataX.length*j));
          j++;
        }
        setDataY(_dataY);
      }
    }

    setRerenderChart(!rerenderChart);
  }

  function handleDragEndDataY(event: any) {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const activeIndex = +active.id.split('-')[1];
      const overIndex = +over.id.split('-')[1];

      const _chartDataY = arrayMove(chartDataY, activeIndex, overIndex);
      setChartDataY(_chartDataY);

      const _dataY = arrayMove(dataY, activeIndex, overIndex);
      setDataY(_dataY);
    }

    setRerenderChart(!rerenderChart);
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

                setRerenderChart(!rerenderChart);
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

                      const _chartDataY = [...chartDataY];
                      _chartDataY.splice(index*chartLabelY.length, chartLabelY.length);
                      setChartDataY(_chartDataY);

                      const _dataX = [...dataX];
                      _dataX.splice(index, 1);
                      setDataX(_dataX);

                      const _dataY = [...dataY];
                      _dataY.splice(index*chartLabelY.length, labelY.length);
                      setDataY(_dataY);

                      setRerenderChart(!rerenderChart);
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
                    </button>
                    <input
                      className="bg-neutral-200 rounded p-2 w-full border border-transparent hover:border-black"
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

                        setRerenderChart(!rerenderChart);
                      }}
                    />
                  </div>
              </SortableItem>
              ))}
            </SortableContext>
          </div>
          <button className="bg-neutral-200 rounded p-2 cursor-pointer hover:bg-black hover:text-white" type="button" onClick={() => {
            const _chartDataX = [...chartDataX];
            _chartDataX.push(`X${chartDataX.length + 1}`);
            setChartDataX(_chartDataX);

            const _chartDataY = [...chartDataY];
            chartLabelY.forEach((labelY, index) => {
              _chartDataY.push(index + 1);
            })
            setChartDataY(_chartDataY);

            const _dataX = [...dataX];
            _dataX.push(`X${dataX.length + 1}`);
            setDataX(_dataX);

            const _dataY = [...dataY];
            labelY.forEach((labelY, index) => {
              _dataY.push(index + 1);
            })
            setDataY(_dataY);

            setRerenderChart(!rerenderChart);
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

                      const _chartDataY = [...chartDataY];
                      chartDataX.forEach((x, xIndex) => {
                        _chartDataY.splice(index+(xIndex*_chartLabelY.length), 1);
                      });
                      setChartDataY(_chartDataY);

                      const _labelY = [...labelY];
                      _labelY.splice(index, 1);
                      setLabelY(_labelY);

                      const _dataY = [...dataY];
                      dataX.forEach((x, xIndex) => {
                        _dataY.splice(index+(xIndex*_labelY.length), 1);
                      });
                      setDataY(_dataY);

                      setRerenderChart(!rerenderChart);
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
                    </button>
                    <input
                      className="bg-neutral-200 rounded p-2 w-full border border-transparent hover:border-black"
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
                        const _labelY = [ ...labelY ];
                        _labelY[index] = event.currentTarget.value;
                        setLabelY(_labelY);

                        const _chartLabelY = [ ...chartLabelY ];
                        _chartLabelY[index] = event.currentTarget.value;
                        setChartLabelY(_chartLabelY);

                        setRerenderChart(!rerenderChart);
                      }}
                    />
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </div>
          <button className="bg-neutral-200 rounded p-2 cursor-pointer hover:bg-black hover:text-white" type="button" onClick={() => {
            const _chartLabelY = [...chartLabelY];
            _chartLabelY.push(`Y${chartLabelY.length + 1}`);
            setChartLabelY(_chartLabelY);

            const _chartDataY = [...chartDataY];
            chartDataX.forEach((y, index) => {
              _chartDataY.splice((_chartLabelY.length - 1)*(index + 1)+index, 0, 1);
            });
            setChartDataY(_chartDataY);

            const _labelY = [...labelY];
            _labelY.push(`Y${labelY.length + 1}`);
            setLabelY(_labelY);

            const _dataY = [...dataY];
            dataX.forEach((y, index) => {
              _dataY.splice((_labelY.length - 1)*(index + 1)+index, 0, 1);
            });
            setDataY(_dataY);

            setRerenderChart(!rerenderChart);
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

                      setRerenderChart(!rerenderChart);
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
                    </button>
                    <input
                      className="bg-neutral-200 rounded p-2 w-full border border-transparent hover:border-black"
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

                          setRerenderChart(!rerenderChart);
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

            setRerenderChart(!rerenderChart);
          }}>Add</button>
        </div>
      </DndContext>
    </>
  );
}

export default ChartData;
