(() => ({
  name: 'Arcgis Map',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const {
      rowHeight,
      startLong,
      startLat,
      zoomLevel,
      model,
      filter,
      latProperty: latProp,
      longProperty: longProp,
      idProperty: idProp,
    } = options;
    const { env, useAllQuery, getProperty } = B;
    const isDev = env === 'dev';
    const { Scene } = window.MaterialUI.Arcgis;
    const { setDefaultOptions, loadModules } = window.MaterialUI.EsriLoader;
    setDefaultOptions({ css: true });
    const startLatFloat = parseFloat(startLat);
    const startLongFloat = parseFloat(startLong);

    const { name: latName } = getProperty(latProp) || {};
    const { name: longName } = getProperty(longProp) || {};
    const { name: idName } = getProperty(idProp) || {};

    const { data, refetch } =
      model &&
      useAllQuery(model, {
        filter,
        skip: 0,
        take: 50,
        onCompleted(res) {
          const hasResult = res && res.result && res.result.length > 0;
          if (hasResult) {
            B.triggerEvent('onSuccess', res.results);
          } else {
            B.triggerEvent('onNoResults');
          }
        },
      });

    const { results } = data || {};

    B.defineFunction('Refetch', () => refetch());

    const PlottedData = props => {
      useEffect(() => {
        loadModules(['esri/Graphic'])
          .then(([Graphic]) => {
            const point = (long, lat, identifier) => ({
              type: 'point',
              longitude: long,
              latitude: lat,
              id: identifier,
            });

            const markerSymbol = {
              type: 'simple-marker',
              color: [226, 119, 40],
              outline: {
                color: [255, 255, 255],
                width: 2,
              },
            };

            const plottedData = (results || []).map(
              item =>
                latName &&
                longName &&
                point(item[longName], item[latName], item[idName]),
            );

            const graphicfunction = datacollection => {
              props.view.graphics.removeAll();
              (datacollection || []).map(item => {
                const pointAtt = {
                  id: item.id,
                };
                const graphicdata = new Graphic({
                  geometry: item,
                  symbol: markerSymbol,
                  attributes: pointAtt,
                });
                props.view.graphics.add(graphicdata);
                return null;
              });
            };
            graphicfunction(plottedData);

            // props.view.on('pointer-down', clickHandler);

            // function clickHandler(event) {
            //   props.view.hitTest(event).then(function(response) {
            //     if (response.results.length) {
            //       const graphic = response.results[0].graphic;
            //       const attributes = graphic.attributes;
            //       const formattedAttributes = {
            //         modelData: { id: attributes.id },
            //       };
            //       B.triggerEvent('onPointClick', event, formattedAttributes);
            //     } else {
            //     }
            //   });
            // }
          })
          .catch(err => console.error(err));
      }, []);
      return null;
    };

    const ArcgisMap = (
      <Scene
        style={{ height: rowHeight, width: '100%' }}
        viewProperties={{
          center: [startLongFloat, startLatFloat],
          zoom: zoomLevel,
        }}
      >
        <PlottedData />
      </Scene>
    );

    return isDev ? <div height="100%">{ArcgisMap}</div> : ArcgisMap;
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
