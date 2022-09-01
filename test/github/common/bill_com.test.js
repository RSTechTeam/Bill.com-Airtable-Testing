import * as billCom from '../../../src/common/bill_com.js';

let billComApi;

test('getApi', async () => {
  const devKey = process.env.BILL_COM_DEV_KEY;
  billComApi =
      await billCom.getApi(
          process.env.AIRTABLE_ORG_IDS_BASE_ID,
          process.env.AIRTABLE_API_KEY,
          process.env.BILL_COM_USER_NAME,
          process.env.BILL_COM_PASSWORD,
          devKey,
          true);
  expect(billComApi).not.toBeNull();
  expect(billComApi.getDevKey()).toBe(devKey);
  expect(billComApi.getSessionId()).toBeNull();
});

test('login', async () => {
  await billComApi.login('RS');
  expect(billComApi.getSessionId()).not.toBeNull();
});

test('dataCall', () => {
  const response =
      billComApi.dataCall('GetEntityMetadata', {'entity': ['Vendor']});
  return expect(response).resolves.not.toBeNull();
});

describe('list', () => {
  const expectListLength = (expectedLength, filters = null) => () => {
    const response = billComApi.list('Vendor', filters);
    return expect(response).resolves.toHaveLength(expectedLength);
  };

  test('no filter', expectListLength(2));
  test('with filter',
      expectListLength(1, [billCom.filter('isActive', '=', '1')]));
});
