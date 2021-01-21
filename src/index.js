import * as Core from '@material-ui/core';
import * as Lab from '@material-ui/lab';
import * as Pickers from '@material-ui/pickers';
import * as Styles from '@material-ui/styles';
import DateFnsUtils from '@date-io/date-fns';
import enLocale from 'date-fns/locale/en-US';
import nlLocale from 'date-fns/locale/nl';
import * as Arcgis from '@esri/react-arcgis';
import * as EsriLoader from 'esri-loader';
import Icons from './icons';

export default {
  Arcgis,
  EsriLoader,
  Core,
  Icons,
  Lab,
  Pickers,
  Styles,
  DateFnsUtils,
  DateLocales: { enLocale, nlLocale },
};
