import axios from "axios";

// TODO: Replace buildingApiUrl with actual value
const buildingApiUrl = "https://k5jkpyg7ji.execute-api.us-east-1.amazonaws.com/prod";

const testClient = axios.create({
    baseURL: buildingApiUrl,
    validateStatus: () => true,
});

describe("BuildingApi", () => {
    let buildingId: string;
    let zoneId: string;

    test("creates building", async () => {
        const result = await testClient.post(`/building`, {
            name: "Test Building 1",
            setpoints: [70, 74]
        });
        buildingId = result.data.id;

        expect(result.status).toEqual(200);
        expect(result.data).toBeTruthy();
        expect(result.data).toHaveProperty("name", "Test Building 1");
        expect(result.data).toHaveProperty("setpoints", [70,74]);
    });

    test("creates zone for building", async () => {
        const result = await testClient.post(`building/${buildingId}/zone`, {
            name: "Test Zone 1",
            buildingId: buildingId,
            setpoints: [68, 72]
        });
        zoneId = result.data.id;
        console.log(zoneId);

        expect(result.status).toEqual(200);
        expect(result.data).toBeTruthy();
        expect(result.data).toHaveProperty("name", "Test Zone 1");
        expect(result.data).toHaveProperty("setpoints", [68,72]);
    });

    test ("get zone", async () => {
        const result = await testClient.get(`building/${buildingId}/zone/${zoneId}`);

        expect(result.status).toEqual(200);
        expect(result.data).toBeTruthy();
        expect(result.data).toHaveProperty("name", "Test Zone 1");
        expect(result.data).toHaveProperty("setpoints", [68,72]);
    });

    test("get building", async () => {

    })

    test("update building", async () => {
        
    });

    test("update zone", async () => {

    });

    test("get zone schedule", async () => {
        const result = await testClient.get(`zone/${zoneId}/`)
    })


    test ("deletes zone", async () => {
        const result = await testClient.delete(`/building/${buildingId}/zone/${zoneId}`);
        expect(result.status).toEqual(204);
    });

    test("deletes building", async () => {
        const result = await testClient.delete(`/building/${buildingId}`);
        expect(result.status).toEqual(204);
    });
})