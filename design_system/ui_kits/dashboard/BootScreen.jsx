// BootScreen — typewriter BIOS POST intro.
const BootScreen = () => {
  const script = [
    'XENEON-EDGE BIOS v3.7.4',
    'Memory check: 32768 KB OK',
    'Initializing widget grid...',
    'Loading themes... [pipboy, dark, synthwave, nord, cyberpunk]',
    'Connecting providers... weather, sensors, ha, spotify',
    'Touch interface: ENABLED',
    'Vault-Tec Industries (c)',
    ''
  ];
  const [lines, setLines] = React.useState([]);
  React.useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setLines((p) => [...p, script[i]]);
      i++;
      if (i >= script.length) clearInterval(t);
    }, 140);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="boot-screen">
      <pre className="boot-text">
        {lines.map((l, i) => <div key={i}>{`> ${l}`}</div>)}
        <span className="boot-cursor"></span>
      </pre>
    </div>
  );
};

window.BootScreen = BootScreen;
