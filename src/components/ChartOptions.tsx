'use client';

function ChartOptions() {

  return (
    <>
      <button type="button" onClick={() => console.log('click')} className="bg-neutral-200 rounded p-2">PNG</button>
      <button type="button" onClick={() => console.log('click')} className="bg-neutral-200 rounded p-2">JPG</button>
      <button type="button" onClick={() => console.log('click')} className="bg-neutral-200 rounded p-2">SVG</button>
    </>
  );
}

export default ChartOptions;
