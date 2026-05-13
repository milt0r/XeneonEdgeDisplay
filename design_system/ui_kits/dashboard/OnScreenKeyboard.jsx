// OnScreenKeyboard — touch QWERTY rendered as a fixed bottom drawer.
const OSK_ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','e','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m']
];

const OnScreenKeyboard = ({ onKey, onClose }) => (
  <div className="osk">
    <div className="osk-bar">
      <span>QWERTY · ASCII</span>
      <span style={{ cursor: 'pointer' }} onClick={onClose}>CLOSE ✕</span>
    </div>
    {OSK_ROWS.map((row, i) => (
      <div className="osk-row" key={i}>
        {i === 1 && <div className="osk-key wide">⇧</div>}
        {i === 2 && <div className="osk-key wide">123</div>}
        {row.map((k) => (
          <div key={k} className="osk-key" onMouseDown={() => onKey(k)}>{k}</div>
        ))}
        {i === 2 && <div className="osk-key wide" onMouseDown={() => onKey('BS')}>⌫</div>}
      </div>
    ))}
    <div className="osk-row">
      <div className="osk-key wide">ABC</div>
      <div className="osk-key space" onMouseDown={() => onKey(' ')}>SPACE</div>
      <div className="osk-key wide accent" onMouseDown={() => onKey('\n')}>↵</div>
    </div>
  </div>
);

window.OnScreenKeyboard = OnScreenKeyboard;
