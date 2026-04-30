export function AudioBar({width, height}) {
  return (
    <div
      style={{
        position: "relative",
        width: `${width}px`,
        height: "1000px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
        alignItems: "center",
        // overflow:"hidden"
      }}
    >
      <div
        style={{
          flex: 1,
          width: "1px",
          backgroundColor: "#B72EFF",
        }}
      ></div>
      <div style={{ width: `${width / 4}px`, backgroundColor: "#B72EFF", height: `${height*1.3}px`}}></div>
      <div style={{width: `${width / 2}px`, backgroundColor: "#B72EFF", height: `${height*1.5}px`}}></div>
      <div style={{width: `${width}px`, backgroundColor: "#B72EFF", height: `${height*2}px`}}></div>
    </div>
  );
}
