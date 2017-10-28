import Frisbee from 'frisbee';
import { Constants } from 'expo';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

const deviceId = Platform.OS === 'android' ? DeviceInfo.getUniqueID() : Constants.deviceId;

const API_BASE_URL = 'http://13.228.235.195:3002/';
// const API_BASE_URL = 'http://localhost:3002/';

const api = new Frisbee({
  baseURI: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const get = path => api.get(path).then(response => response.body);
const post = (path, payload) => api.post(path, { body: payload });
const patch = (path, payload) => api.patch(path, { body: payload });

export default {
  postDevice: () => {
    const { deviceName, isDevice, linkingUrl, manifest } = Constants;
    return post('device', {
      deviceId,
      deviceName,
      isDevice,
      linkingUrl,
      version: manifest.version,
      country: Platform.OS === 'android' ? DeviceInfo.getTimezone() : null,
      timezone: (new Date()).getTimezoneOffset(),
      isTablet: Platform.OS === 'android' ? DeviceInfo.isTablet() : null,
    });
  },
  postAnswer: (answer) => {
    console.log('posting answer', answer);
    return post('answer', { ...answer, deviceId })
      .catch(e => console.log('Post answer api', e, answer));
  },
  postSchedule: schedule => post('experiment', { schedule, deviceId })
    .catch(e => console.log('Post experiment schedule', e, schedule)),
  postTrial: answer => post('trial', { ...answer, deviceId })
    .catch(e => console.log('Post trial', e, answer)),
  postExperimentStarted: answer => post('experiment/started', { ...answer, deviceId })
    .catch(e => console.log('Post experiment start', e, answer)),
  postExperimentAnswer: answer => post('experiment/answer', { ...answer, deviceId })
    .catch(e => console.log('Post experiment ans', e, answer)),
  postExperimentRound: answer => post('experiment/round', { ...answer, deviceId })
    .catch(e => console.log('Post experiment round', e, answer)),
  isDisqualified: () => get(`disqualified/${deviceId}`),
  postAll: state => post('all', { ...state, deviceId })
    .catch(e => console.log('Post all', e)),
  disqualify: () => patch('disqualify', { deviceId }),
};
