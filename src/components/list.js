(() => ({
  name: 'List',
  type: 'CONTAINER_COMPONENT',
  allowedTypes: ['CONTENT_COMPONENT', 'LIST_SUBHEADER', 'CONTAINER_COMPONENT'],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { List } = window.MaterialUI.Core;
    const { env } = B;
    const isDev = env === 'dev';
    const isEmpty = children.length === 0;
    const isPristine = children.length === 0 && isDev;
    const { disablePadding, dense } = options;

    const renderData = () =>
      isEmpty ? (
        <div
          className={[
            isEmpty ? classes.empty : '',
            isPristine ? classes.pristine : '',
          ].join(' ')}
        />
      ) : (
        children
      );

    return (
      <List
        className={classes.root}
        disablePadding={disablePadding}
        dense={dense}
      >
        {renderData()}
      </List>
    );
  })(),
  styles: B => t => {
    const style = new B.Styling(t);
    return {
      root: {
        backgroundColor: ({ options: { backgroundColor } }) =>
          style.getColor(backgroundColor),
      },
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
          content: '"List"',
        },
      },
    };
  },
}))();
