import HTMLFlipBook from "react-pageflip";

export default function FlipBook({ pages }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-[20%]">
      <HTMLFlipBook
        width={300}
        height={400}
        size="stretch"
        minWidth={200}
        maxWidth={600}
        minHeight={300}
        maxHeight={800}
        maxShadowOpacity={0.5}
        showCover={false}
        mobileScrollSupport={true}
        className="shadow-none outline-none"
      >
        {pages.map((page, index) => (
          <div
            key={index}
            className={`flex items-center justify-center text-md font-medium p-4 shadow-none outline-none ${page.color}`}
          >
            {page.content}
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}
