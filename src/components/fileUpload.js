(() => ({
  name: 'FileUpload',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { env, useText, getProperty, getActionInput, useFileUpload } = B;
    const {
      FormControl,
      FormControlLabel,
      FormHelperText,
      Button,
      Typography,
      IconButton,
    } = window.MaterialUI.Core;
    const { Icons } = window.MaterialUI;
    const { Close } = Icons;
    const {
      property,
      label,
      propertyLabelOverride,
      actionInputId,
      required,
      hideDefaultError,
      disabled,
      helperText,
      fullWidth,
      size,
      accept,
      margin,
      variant,
      icon,
      iconPosition,
      buttonText,
      multiple,
    } = options;

    const isDev = env === 'dev';
    const inputRef = React.createRef();
    const [uploads, setUploads] = useState({
      files: [],
      data: [],
      failedFiles: [],
    });
    const helper = useText(helperText);
    const propLabel =
      property && getProperty(property) && getProperty(property).label;
    const propLabelOverride = useText(propertyLabelOverride);
    const propertyLabelText = isDev ? '{{ property label }}' : propLabel;
    const propertyLabel = propLabelOverride || propertyLabelText;
    const labelText = property ? propertyLabel : useText(label);
    const requiredText = required ? '*' : '';

    const actionInput = getActionInput(actionInputId);

    const handleChange = e => {
      setUploads({
        ...uploads,
        files: e.target.files,
      });
    };

    const clearFiles = e => {
      e.preventDefault();
      setUploads({
        files: [],
        data: [],
        failedFiles: [],
      });
    };

    const { files, data, failedFiles } = uploads;

    const acceptedValue = useText(accept) || 'image/*';
    const acceptList = acceptedValue.split(',').map(item => item.trim());

    const [uploadFile, { loading } = {}] = useFileUpload({
      options: {
        variables: {
          fileList: Array.from(files),
          mimeType: acceptList,
        },
        onError: errorData => {
          B.triggerEvent('onError', errorData.message);
        },
        onCompleted: uploadData => {
          const { uploadFiles } = uploadData;

          const [succeededData, failedData] = uploadFiles.reduce(
            (result, d) => {
              result[d.url.startsWith('http') ? 0 : 1].push(d);
              return result;
            },
            [[], []],
          );
          if (succeededData.length > 0) {
            B.triggerEvent('onSuccess', succeededData);
          }
          if (failedData.length > 0) {
            B.triggerEvent(
              'onError',
              failedData.map(
                d => `File: ${d.name} failed with error: ${d.url}`,
              ),
            );
          }
          setUploads({
            ...uploads,
            data: multiple ? data.concat(succeededData) : succeededData,
            failedFiles: multiple ? failedFiles.concat(failedData) : failedData,
          });
        },
      },
    });

    const removeFileFromList = fileUrl => {
      const newList = data.filter(d => d.url !== fileUrl);
      setUploads({
        ...uploads,
        data: newList,
      });
    };

    const UploadComponent = (
      <div
        className={[classes.control, fullWidth ? classes.fullwidth : ''].join(
          ' ',
        )}
      >
        <input
          accept={acceptedValue}
          className={classes.input}
          multiple={multiple}
          type="file"
          onChange={handleChange}
          ref={inputRef}
        />
        <Button
          size={size}
          variant={variant}
          classes={{
            root: classes.button,
            contained: classes.contained,
            outlined: classes.outlined,
          }}
          component="span"
          disabled={disabled}
          startIcon={
            variant !== 'icon' &&
            icon !== 'None' &&
            iconPosition === 'start' &&
            React.createElement(Icons[icon])
          }
          endIcon={
            variant !== 'icon' &&
            icon !== 'None' &&
            iconPosition === 'end' &&
            React.createElement(Icons[icon])
          }
        >
          {variant === 'icon'
            ? React.createElement(Icons[icon === 'None' ? 'Error' : icon], {
                fontSize: size,
              })
            : useText(buttonText)}
        </Button>
        {data.length > 0 && (
          <input
            type="hidden"
            name={actionInput && actionInput.name}
            value={data.map(d => d.url).join(',')}
          />
        )}
      </div>
    );

    const Control = (
      <FormControl
        fullWidth={fullWidth}
        required={required}
        error={!hideDefaultError && failedFiles.length > 0}
        disabled={disabled}
        margin={margin}
      >
        <FormControlLabel
          control={UploadComponent}
          label={`${labelText}${requiredText}`}
          labelPlacement="top"
          classes={{
            root: classes.label,
          }}
        />
        <FormHelperText>
          {!hideDefaultError &&
            failedFiles.length > 0 &&
            failedFiles.map(
              file => `File: ${file.name} failed with error: ${file.url}`,
            )}
          {helper && { helper }}
        </FormHelperText>
        <div className={classes.messageContainer}>
          {loading && B.triggerEvent('onLoad')}
          {data.map(file => (
            <div className={classes.fileList}>
              <Typography variant="body1" noWrap className={classes.span}>
                {file.name}
              </Typography>
              <IconButton
                className={classes.remove}
                size="small"
                onClick={() => removeFileFromList(file.url)}
              >
                <Close fontSize="small" />
              </IconButton>
            </div>
          ))}
        </div>
      </FormControl>
    );

    useEffect(() => {
      if (files.length > 0) {
        uploadFile();
      }
    }, [files]);

    useEffect(() => {
      B.defineFunction('clearFileUpload', e => clearFiles(e));
    }, []);

    return isDev ? <div className={classes.root}>{Control}</div> : Control;
  })(),
  styles: B => t => {
    const style = new B.Styling(t);
    return {
      root: {
        display: ({ options: { fullWidth } }) =>
          fullWidth ? 'block' : 'inline-block',
      },
      label: {
        marginLeft: [0, '!important'],
        pointerEvents: B.env === 'dev' && 'none',
        alignItems: ['start', '!important'],
      },
      input: {
        display: 'none',
      },
      control: {
        display: 'inline-flex',
        alignItems: 'center',
      },
      fullwidth: {
        display: 'flex',
        width: '100%',
      },
      span: {
        flex: 1,
        textAlign: 'start',
        marginRight: ['1rem', '!important'],
      },
      button: {
        color: ({ options: { variant, textColor, background } }) => [
          style.getColor(variant === 'icon' ? background : textColor),
          '!important',
        ],
      },
      contained: {
        backgroundColor: ({ options: { background } }) => [
          style.getColor(background),
          '!important',
        ],
      },
      outlined: {
        borderColor: ({ options: { background } }) => [
          style.getColor(background),
          '!important',
        ],
      },
      messageContainer: {
        paddingTop: '1.25rem',
      },
      fileList: {
        display: 'flex',
        alignItems: 'center',
      },
      remove: {
        padding: ['0.25rem', '!important'],
      },
    };
  },
}))();
