import axios from "axios";

const buildingApiUrl = "https://k5jkpyg7ji.execute-api.us-east-1.amazonaws.com/prod";

const testClient = axios.create({
    baseURL: buildingApiUrl,
    validateStatus: () => true,
});

describe("BuildingApi", () => {
    const buildingIds: string[] = [];

    afterAll(async () => {
        // Check for buildings that need cleanup
        if (buildingIds.length > 0) {
            console.warn(`[WARNING] Attempting to clean up the following buildings: ${buildingIds}`);
        }

        buildingIds.forEach(async (buildingId) => {
            await testClient.delete(`/building/${buildingId}`);
        });
    });

    test("creates building", async () => {
        const result1 = await testClient.post(`/building`, {
            name: "Test Building 1",
            setpoints: [68, 72]
        });
        buildingIds.push(result1.data.id);

        expect(result1.status).toEqual(200);
        expect(result1.data).toBeTruthy();
        expect(result1.data).toHaveProperty("name", "Test Building 1");
        expect(result1.data).toHaveProperty("setpoints", [68,72]);

        // const result2 = await testClient.post(`/building`, {
        //     name: "Test Building 2",
        //     setpoints: [60,70]
        // });
        // buildingIds.push(result2.data.id);

        // expect(result1.status).toEqual(200);
        // expect(result1.data).toBeTruthy();
        // expect(result1.data).toHaveProperty("name", "Test Building 2");
        // expect(result1.data).toHaveProperty("setpoints", [60,70]);
    });

    // test("creates zone for building", async () => {
    //     const result1 = await testClient.post(`building/zone/{zoneId}/`, {
    //         name: "Test Zone 1",
    //         buildingId: buildingId[0],
    //     });
    //     zoneIds.push(result1.data.sk.split("#")[1]);

    //     expect(result1.status).toEqual(200);
    //     expect(result1.data).toBeTruthy();
    //     expect(result1.data).toHaveProperty("pk", `BUILDING#${buildingId}`);
    //     expect(result1.data).toHaveProperty("name", "Test Zone 1");
    // })

    test("deletes building", async () => {
        const buildingId1 = buildingIds.pop();
        // const buildingId2 = buildingIds.pop();

        const result1 = await testClient.delete(`/building/${buildingId1}`);
        expect(result1.status).toEqual(204);
    });
})