(() => ({
  name: 'CardActions',
  type: 'CARD_ACTIONS',
  allowedTypes: ['BODY_COMPONENT', 'CONTAINER_COMPONENT', 'CONTENT_COMPONENT'],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { env } = B;
    const { CardActions } = window.MaterialUI.Core;
    const isDev = env === 'dev';
    const { disableSpacing } = options;
    const isEmpty = children.length === 0;
    const isPristine = isEmpty && isDev;
    const PlaceHolder = (
      <div
        className={[
          isEmpty ? classes.empty : '',
          isPristine ? classes.pristine : '',
        ].join(' ')}
      />
    );

    const CardActionsComponent = (
      <CardActions
        classes={{ root: classes.root }}
        disableSpacing={disableSpacing}
      >
        {isEmpty ? PlaceHolder : children}
      </CardActions>
    );

    return isDev ? <div>{CardActionsComponent}</div> : CardActionsComponent;
  })(),
  styles: () => () => ({
    root: {
      alignItems: 'center',
      justifyContent: ({ options: { alignment } }) => alignment,
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
        content: '"Card Actions"',
      },
    },
  }),
}))();
