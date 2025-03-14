'use client';

function ChartExport() {

  return (
    <>
      <button type="button" onClick={() => console.log('click')} className="bg-neutral-200 rounded p-2 cursor-pointer hover:bg-black hover:text-white">PNG</button>
      <button type="button" onClick={() => console.log('click')} className="bg-neutral-200 rounded p-2 cursor-pointer hover:bg-black hover:text-white">JPEG</button>
      <button type="button" onClick={() => console.log('click')} className="bg-neutral-200 rounded p-2 cursor-pointer hover:bg-black hover:text-white">SVG</button>
      <button type="button" onClick={() => console.log('click')} className="bg-neutral-200 rounded p-2 cursor-pointer hover:bg-black hover:text-white">PDF</button>
    </>
  );
}

export default ChartExport;
