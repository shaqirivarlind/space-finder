import {handler} from '../../../src/services/monitor/handler'

describe('Monitor lambda tests', () => {
  const fetchSpy = jest.spyOn(global, 'fetch')
  fetchSpy.mockImplementation(() => Promise.resolve({} as any))

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  })

  test('makes requests for record in SNSEvents', async () => {
    await handler({
      Records: [{
        Sns: {
          Message: 'This is a test'
        }
      }]
    } as any, {});

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), {
      method: 'POST',
      body: JSON.stringify({
        "text": `Test, we have a problem: This is a test`,
      })
    })
  });

  test('no SnsRecord, no requests', async () => {
    await handler({
      Records: []
    } as any, {});

    expect(fetchSpy).not.toHaveBeenCalledTimes(1)
  });
})
// section 14 lecture 105
