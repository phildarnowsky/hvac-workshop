import axios from 'axios'

// TODO: Replace buildingApiUrl with actual value
const buildingApiUrl = 'https://6rpkutlu6e.execute-api.us-east-2.amazonaws.com/prod/'

const testClient = axios.create({
  baseURL: buildingApiUrl,
  validateStatus: () => true
})

describe('BuildingApi', () => {
  let buildingId: string
  let zoneId1: string
  let zoneId2: string

  test('creates building', async () => {
    const result = await testClient.post('/building', {
      name: 'Test Building 1',
      setpoints: [70, 74]
    })
    buildingId = result.data.id

    expect(result.status).toEqual(200)
    expect(result.data).toBeTruthy()
    expect(result.data).toHaveProperty('name', 'Test Building 1')
    expect(result.data).toHaveProperty('setpoints', [70, 74])
  })

  test('creates zone for building', async () => {
    const result1 = await testClient.post(`building/${buildingId}/zone`, {
      name: 'Test Zone 1',
      buildingId: buildingId,
      setpoints: [68, 72]
    })
    zoneId1 = result1.data.id

    expect(result1.status).toEqual(200)
    expect(result1.data).toBeTruthy()
    expect(result1.data).toHaveProperty('name', 'Test Zone 1')
    expect(result1.data).toHaveProperty('setpoints', [68, 72])

    const result2 = await testClient.post(`building/${buildingId}/zone`, {
      name: 'Test Zone 2',
      buildingId: buildingId
    })
    zoneId2 = result2.data.id

    expect(result2.status).toEqual(200)
    expect(result2.data).toBeTruthy()
    expect(result2.data).toHaveProperty('name', 'Test Zone 2')
    expect(result2.data).not.toHaveProperty('setpoints')
  })

  test('get zone', async () => {
    const result = await testClient.get(`building/${buildingId}/zone/${zoneId1}`)

    expect(result.status).toEqual(200)
    expect(result.data).toBeTruthy()
    expect(result.data).toHaveProperty('name', 'Test Zone 1')
    expect(result.data).toHaveProperty('setpoints', [68, 72])
  })

  test('TASK 1: Get building', async () => {
    const result = await testClient.get(`building/${buildingId}`)

    expect(result.status).toEqual(200)
    expect(result.data).toBeTruthy()
    expect(result.data).toHaveProperty('name', 'Test Building 1')
    expect(result.data).toHaveProperty('setpoints', [70, 74])
  })

  test('TASK 2: Update building', async () => {
    const result = await testClient.patch(`building/${buildingId}`, {
      name: 'Updated Test Building 1',
      setpoints: [72, 78]
    })

    expect(result.status).toEqual(204)

    const getResult = await testClient.get(`building/${buildingId}`)

    expect(getResult.status).toEqual(200)
    expect(getResult.data).toBeTruthy()
    expect(getResult.data).toHaveProperty('name', 'Updated Test Building 1')
    expect(getResult.data).toHaveProperty('setpoints', [72, 78])
  })

  test('TASK 3: Get zone setpoints', async () => {
    // Returns zone-specific setpoints
    const result1 = await testClient.get(`building/zone/${zoneId1}/setpoints`)
    expect(result1.status).toEqual(200)
    expect(result1.data).toEqual([68, 72])

    // Returns default building setpoints
    const result2 = await testClient.get(`building/zone/${zoneId2}/setpoints`)
    expect(result2.status).toEqual(200)
    expect(result2.data).toEqual([72, 78])
  })

  test('deletes zone', async () => {
    const result1 = await testClient.delete(`/building/${buildingId}/zone/${zoneId1}`)
    expect(result1.status).toEqual(204)

    const result2 = await testClient.delete(`/building/${buildingId}/zone/${zoneId2}`)
    expect(result2.status).toEqual(204)
  })

  test('deletes building', async () => {
    const result = await testClient.delete(`/building/${buildingId}`)
    expect(result.status).toEqual(204)
  })
})
