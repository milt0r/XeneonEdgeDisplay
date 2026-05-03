import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

/**
 * Controlled on-screen keyboard rendered via a portal so it floats above the
 * entire app (not clipped by a widget). Parent owns the value; the keyboard
 * mirrors it. Physical keyboard / paste / OSK keystrokes all converge on the
 * same value via the parent.
 */
export function OnScreenKeyboard({
  value,
  onChange,
  onClose,
  passwordMode = false
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  passwordMode?: boolean;
}) {
  const kbRef = useRef<any>(null);
  const [shift, setShift] = React.useState(false);

  useEffect(() => {
    if (kbRef.current && kbRef.current.getInput() !== value) {
      kbRef.current.setInput(value);
    }
  }, [value]);

  return createPortal(
    <div className="osk no-drag" onMouseDown={(e) => e.preventDefault()}>
      <div className="osk-bar">
        <span className="mono muted">
          On-screen keyboard{passwordMode ? ' (input hidden)' : ''}
        </span>
        <button className="btn" onClick={onClose}>DONE</button>
      </div>
      <Keyboard
        keyboardRef={(r) => (kbRef.current = r)}
        layoutName={shift ? 'shift' : 'default'}
        onChange={(input: string) => onChange(input)}
        onKeyPress={(button: string) => {
          if (button === '{shift}' || button === '{lock}') setShift((s) => !s);
        }}
        layout={{
          default: [
            '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
            '{tab} q w e r t y u i o p [ ] \\',
            '{lock} a s d f g h j k l ; \' {enter}',
            '{shift} z x c v b n m , . / {shift}',
            '.com : / @ {space}'
          ],
          shift: [
            '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
            '{tab} Q W E R T Y U I O P { } |',
            '{lock} A S D F G H J K L : " {enter}',
            '{shift} Z X C V B N M < > ? {shift}',
            '.com : / @ {space}'
          ]
        }}
      />
    </div>,
    document.body
  );
}
