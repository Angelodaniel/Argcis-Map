(() => ({
  name: 'Arcgis Map',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { env } = B;
    const isDev = env === 'dev';
    const { Map } = window.MaterialUI.Arcgis;
    const { setDefaultOptions } = window.MaterialUI.EsriLoader;
    setDefaultOptions({ css: true });
    const ArcgisMap = <Map style={{ height: '80vh', width: '100vw' }} />;
    return isDev ? <div height="100px">{ArcgisMap}</div> : ArcgisMap;
  })(),
  styles: () => () => ({
    empty: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '4rem',
      height: '100%',
      width: '100%',
      fontSize: '0.75rem',
      color: '#262A3A',
      textTransform: 'uppercase',
      boxSizing: 'border-box',
    },
    pristine: {
      borderWidth: '0.0625rem',
      borderColor: '#AFB5C8',
      borderStyle: 'dashed',
      backgroundColor: '#F0F1F5',
      '&::after': {
        content: '"Paper"',
      },
    },
  }),
}))();
